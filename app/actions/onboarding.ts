'use server'

import prisma from '@/lib/prisma'
import { VoximplantClient } from '@/lib/voximplant'
import * as bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

const voximplant = new VoximplantClient()

export async function onboardTenant(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const phoneAreaCode = formData.get('areaCode') as string || 'US'

    if (!name || !email || !password) {
        return { error: 'Missing required fields' }
    }

    try {
        // 1. Create Tenant in Database
        const tenant = await prisma.tenant.create({
            data: { name }
        })

        // 2. Create Admin User for Tenant
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'TENANT_ADMIN',
                tenantId: tenant.id
            }
        })

        // 3. Create Default Agent Config
        await prisma.agentConfig.create({
            data: {
                tenantId: tenant.id,
                systemPrompt: `You are a helpful assistant for ${name}.`,
                welcomeMessage: `Thank you for calling ${name}. How can I help you?`
            }
        })

        // 4. Provision Voximplant Resources (CPaaS Step)
        // For MVP, we will try to create an "Application" for them.
        // Note: In reality, you might strictly separate this into a background job.
        let provisionStatus = 'skipped'
        try {
            const appRes = await voximplant.createChildAccount(name.replace(/\s+/g, '').toLowerCase(), email)
            provisionStatus = 'success'
            // TODO: Buy number, etc. (Requires funds/real api key)
        } catch (e) {
            console.error('Voximplant Provisioning Failed:', e)
            provisionStatus = 'failed'
        }

        revalidatePath('/admin')
        return { success: true, tenantId: tenant.id, provisionStatus }

    } catch (error) {
        console.error('Onboarding Error:', error)
        return { error: 'Failed to create tenant' }
    }
}
