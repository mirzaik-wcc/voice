import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        // Voximplant will send metadata about the call
        const body = await request.json()
        const { from, to, callId } = body

        if (!from || !to) {
            return NextResponse.json({ error: 'Missing from/to' }, { status: 400 })
        }

        // 1. Identify Tenant
        const tenant = await prisma.tenant.findFirst() // Mock lookup
        if (!tenant) {
            return NextResponse.json({ error: 'No tenant configured' }, { status: 404 })
        }

        // 2. Identify/Create Contact
        let contact = await prisma.contact.findFirst({
            where: { tenantId: tenant.id, phone: from }
        })

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    tenantId: tenant.id,
                    phone: from,
                    firstName: 'Unknown Caller',
                }
            })
        }

        // 3. Create Call Log
        const callLog = await prisma.callLog.create({
            data: {
                fromNumber: from,
                toNumber: to,
                direction: 'inbound',
                status: 'IN_PROGRESS',
                tenantId: tenant.id,
                contactId: contact.id
            }
        })

        // 4. Get Agent Config
        const agentConfig = await prisma.agentConfig.findUnique({
            where: { tenantId: tenant.id }
        })

        // 5. Return Configuration for Voximplant to pass to Deepgram
        // We return the URL for the tools as well so Voximplant knows where to route tool calls if it proxies them,
        // or we define the tools schema here for Deepgram.

        // Deepgram Voice Agent API expects a specific structure for tools.
        // We will return the system prompt and the tool definitions.

        const baseUrl = `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`

        return NextResponse.json({
            success: true,
            callLogId: callLog.id,
            tenantId: tenant.id,
            deepgramConfig: {
                apiKey: process.env.DEEPGRAM_API_KEY,
                voiceId: agentConfig?.voiceId || 'aura-asteria-en',
                systemPrompt: agentConfig?.systemPrompt || 'You are a helpful assistant.',
                welcomeMessage: agentConfig?.welcomeMessage || 'Hello, how can I help you?',
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "create_lead",
                            description: "Capture a new business lead from the conversation.",
                            parameters: {
                                type: "object",
                                properties: {
                                    title: { type: "string", description: "A brief title for the lead" },
                                    description: { type: "string" },
                                    value: { type: "number" }
                                },
                                required: ["title"]
                            },
                            url: `${baseUrl}/api/tools/create-lead?callLogId=${callLog.id}`
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "check_availability",
                            description: "Check for available appointment slots.",
                            parameters: {
                                type: "object",
                                properties: {
                                    date: { type: "string", description: "Date to check (YYYY-MM-DD)" }
                                }
                            },
                            url: `${baseUrl}/api/tools/check-availability?callLogId=${callLog.id}`
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "book_appointment",
                            description: "Book an appointment for the lead.",
                            parameters: {
                                type: "object",
                                properties: {
                                    date: { type: "string", description: "Date (YYYY-MM-DD)" },
                                    time: { type: "string", description: "Time (HH:MM)" },
                                    notes: { type: "string" }
                                },
                                required: ["date", "time"]
                            },
                            url: `${baseUrl}/api/tools/book-appointment?callLogId=${callLog.id}`
                        }
                    }
                ]
            }
        })

    } catch (error) {
        console.error('Config Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
