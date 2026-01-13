import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const callLogId = searchParams.get('callLogId')

        const body = await request.json()
        // Deepgram/OpenAI might wrap arguments in specific ways, assuming standard JSON body here similar to OpenAI function calling
        const { title, description, value } = body

        if (!callLogId) {
            return NextResponse.json({ error: 'Missing callLogId context' }, { status: 400 })
        }

        // Lookup CallLog to find Tenant and Contact
        const callLog = await prisma.callLog.findUnique({
            where: { id: callLogId },
            include: { contact: true }
        })

        if (!callLog) {
            return NextResponse.json({ error: 'Invalid Call Log' }, { status: 404 })
        }

        // Create Lead
        const lead = await prisma.lead.create({
            data: {
                title,
                description,
                value: value ? parseFloat(value) : undefined,
                status: 'NEW',
                source: 'VOICE_AGENT',
                tenantId: callLog.tenantId,
                contactId: callLog.contactId,
                // Link call log to this lead?? Schema doesn't have it directly but Lead has callLogs if 1:many
                // The relation in schema is `callLogs CallLog[]` on Lead. 
                // So we can connect them.
                callLogs: {
                    connect: { id: callLog.id }
                }
            }
        })

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            message: `Lead '${title}' created successfully.`
        })

    } catch (error) {
        console.error('Tool Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
