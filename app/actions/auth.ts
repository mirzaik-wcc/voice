'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '../../lib/prisma'
import * as bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key')

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return { error: 'Invalid credentials' }
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return { error: 'Invalid credentials' }
    }

    // Create Session
    const token = await new SignJWT({
        userId: user.id,
        role: user.role,
        tenantId: user.tenantId
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET)

    const c = await cookies()
    c.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    })

    if (user.role === 'MASTER_ADMIN') {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

export async function logout() {
    const c = await cookies()
    c.delete('session')
    redirect('/login')
}

export async function impersonateTenant(tenantId: string) {
    const session = await getSession()
    if (!session || session.role !== 'MASTER_ADMIN') {
        throw new Error('Unauthorized')
    }

    // Determine the user to impersonate.
    // Ideally we impersonate a specific ADMIN user of that tenant, 
    // OR we create a synthetic session with the Tenant ID and a generic "TENANT_ADMIN" role.
    // For simplicity/robustness, let's look for the first admin of that tenant.
    const targetUser = await prisma.user.findFirst({
        where: {
            tenantId: tenantId,
            // We want to be an admin of that tenant to see everything
            role: 'TENANT_ADMIN' // Or just take the first user if strict role mapping isn't critical yet, but let's try safely.
        }
    })

    // Fallback: If no explicit admin user found (rare if created correctly), 
    // we can still synthesize a token, but having a real userId is better for "assignedTo" tasks etc.
    // If no user found, we might stub the userId or search for any user.
    let userIdToUse = targetUser?.id
    if (!userIdToUse) {
        // Just grab any user
        const anyUser = await prisma.user.findFirst({ where: { tenantId } })
        userIdToUse = anyUser?.id
    }

    // Create Impersonation Token
    const token = await new SignJWT({
        userId: userIdToUse || 'impersonated-admin', // Fallback if absolutely no users
        role: 'TENANT_ADMIN',
        tenantId: tenantId,
        impersonatorId: session.userId, // KEY: Tracks who the "Real" user is
        impersonatorRole: session.role
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h') // Short expiry for impersonation
        .sign(JWT_SECRET)

    const c = await cookies()
    c.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
        path: '/',
    })

    redirect('/dashboard')
}

export async function stopImpersonation() {
    const session = await getSession()
    if (!session || !session.impersonatorId) {
        // Not impersonating, just redirect
        redirect('/admin') // or login
    }

    // Restore Original Session
    const token = await new SignJWT({
        userId: session.impersonatorId as string,
        role: session.impersonatorRole as string || 'MASTER_ADMIN',
        tenantId: null // Master admin has no tenant
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET)

    const c = await cookies()
    c.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
    })

    redirect('/admin')
}

export async function getSession() {
    const c = await cookies()
    const token = c.get('session')?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch (error) {
        return null
    }
}
