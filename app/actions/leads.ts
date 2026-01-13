'use server'

import prisma from '@/lib/prisma'
import { getSession } from './auth'

export async function getLeads() {
    const session = await getSession()
    if (!session || !session.tenantId) {
        return []
    }

    const leads = await prisma.lead.findMany({
        where: {
            tenantId: session.tenantId as string
        },
        include: {
            contact: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return leads
}
