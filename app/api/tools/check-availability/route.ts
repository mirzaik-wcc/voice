import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const callLogId = searchParams.get('callLogId')

        // AI might ask: "When are you free tomorrow?" -> sends { date: "2024-05-20" }
        // or just "next week" -> we default to next 3-5 days.
        const body = await request.json()
        const targetDate = body.date ? new Date(body.date) : new Date()

        if (!callLogId) {
            return NextResponse.json({ error: 'Missing callLogId context' }, { status: 400 })
        }

        const callLog = await prisma.callLog.findUnique({
            where: { id: callLogId }
        })

        if (!callLog) {
            return NextResponse.json({ error: 'Invalid Call Log' }, { status: 404 })
        }

        const tenantId = callLog.tenantId

        // 1. Get Tenant Availability Rules
        const availabilities = await prisma.availability.findMany({
            where: { tenantId, isActive: true }
        })

        if (availabilities.length === 0) {
            // Default to Mon-Fri 9-5 if not set
            return NextResponse.json({
                message: "I am available Monday to Friday from 9 AM to 5 PM."
            })
        }

        // 2. Get Existing Appointments for the target range (simple logic: check whole day)
        // Simplified: Just returning the rule for now to let the LLM figure it out, 
        // or we calculate specific slots. 
        // Let's calculate specific slots for the "targetDate".

        const dayOfWeek = targetDate.getDay() // 0=Sun
        const rule = availabilities.find(a => a.dayOfWeek === dayOfWeek)

        if (!rule) {
            return NextResponse.json({ message: "We are closed on that day." })
        }

        // Fetch booked slots
        const startOfDay = new Date(targetDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(targetDate)
        endOfDay.setHours(23, 59, 59, 999)

        const appointments = await prisma.appointment.findMany({
            where: {
                tenantId,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: { not: 'CANCELED' }
            }
        })

        // Prepare a human readable summary of free time
        // This is a naive implementation. Real scheduling needs complex slot logic.
        // We will just return the "Operating Hours" and "Busy Times" and let LLM parse it.

        const busyTimes = appointments.map(a =>
            `${a.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${a.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        ).join(', ')

        let responseMsg = `We are open from ${rule.startTime} to ${rule.endTime}.`
        if (busyTimes.length > 0) {
            responseMsg += ` However, we are fully booked at these times: ${busyTimes}. Other times are free.`
        } else {
            responseMsg += ` We have wide availability on this day.`
        }

        return NextResponse.json({
            success: true,
            message: responseMsg
        })

    } catch (error) {
        console.error('Availability Tool Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
