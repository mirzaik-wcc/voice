'use server'

import prisma from '@/lib/prisma'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

export async function getServices() {
    const session = await getSession()
    if (!session || !session.tenantId) return []

    return await prisma.service.findMany({
        where: { tenantId: session.tenantId as string },
        orderBy: { name: 'asc' }
    })
}

export async function createService(formData: FormData) {
    const session = await getSession()
    if (!session || !session.tenantId) return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const duration = parseInt(formData.get('duration') as string)
    const price = parseFloat(formData.get('price') as string)

    try {
        await prisma.service.create({
            data: {
                tenantId: session.tenantId as string,
                name,
                duration,
                price
            }
        })
        revalidatePath('/dashboard/services')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to create service' }
    }
}
