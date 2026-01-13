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
