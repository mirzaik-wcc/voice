'use server'

import prisma from '@/lib/prisma'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

export async function getAgentConfig() {
    const session = await getSession()
    if (!session || !session.tenantId) return null

    const config = await prisma.agentConfig.findUnique({
        where: { tenantId: session.tenantId as string }
    })

    if (!config) {
        // Create default config if missing?
        // Or return null and handle in UI
        return await prisma.agentConfig.create({
            data: {
                tenantId: session.tenantId as string
            }
        })
    }

    return config
}

export async function updateAgentConfig(formData: FormData) {
    const session = await getSession()
    if (!session || !session.tenantId) {
        return { error: 'Unauthorized' }
    }

    const systemPrompt = formData.get('systemPrompt') as string
    const welcomeMessage = formData.get('welcomeMessage') as string
    const voiceId = formData.get('voiceId') as string

    try {
        await prisma.agentConfig.upsert({
            where: { tenantId: session.tenantId as string },
            update: {
                systemPrompt,
                welcomeMessage,
                voiceId
            },
            create: {
                tenantId: session.tenantId as string,
                systemPrompt,
                welcomeMessage,
                voiceId
            }
        })

        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error) {
        console.error('Update Config Error:', error)
        return { error: 'Failed to update configuration' }
    }
}
