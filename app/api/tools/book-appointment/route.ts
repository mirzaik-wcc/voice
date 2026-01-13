import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const callLogId = searchParams.get('callLogId')

        const body = await request.json()
        const { date, time, notes } = body // e.g., "2024-05-20", "10:00"

        if (!callLogId) {
            return NextResponse.json({ error: 'Missing callLogId context' }, { status: 400 })
        }

        const callLog = await prisma.callLog.findUnique({
            where: { id: callLogId },
            include: { contact: true, lead: true }
        })

        if (!callLog) {
            return NextResponse.json({ error: 'Invalid Call Log' }, { status: 404 })
        }

        // Construct DateTime
        // Assume date is YYYY-MM-DD and time is HH:MM
        const startDateTime = new Date(`${date}T${time}:00`)

        // Default duration 60 mins (Todo: lookup Service)
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

        // Check for conflict
        const conflict = await prisma.appointment.findFirst({
            where: {
                tenantId: callLog.tenantId,
                status: { not: 'CANCELED' },
                OR: [
                    {
                        startTime: { lte: startDateTime },
                        endTime: { gte: startDateTime }
                    },
                    {
                        startTime: { lte: endDateTime },
                        endTime: { gte: endDateTime }
                    }
                ]
            }
        })

        if (conflict) {
            return NextResponse.json({ success: false, message: "Sorry, that time slot is already booked. Please pick another time." })
        }

        const appointment = await prisma.appointment.create({
            data: {
                tenantId: callLog.tenantId,
                contactId: callLog.contactId,
                leadId: callLog.leadId, // might be null if no lead created yet
                startTime: startDateTime,
                endTime: endDateTime,
                notes: notes || 'Booked via Voice Agent'
            }
        })

        return NextResponse.json({
            success: true,
            appointmentId: appointment.id,
            message: `Appointment confirmed for ${startDateTime.toLocaleString()}.`
        })

    } catch (error) {
        console.error('Booking Tool Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
