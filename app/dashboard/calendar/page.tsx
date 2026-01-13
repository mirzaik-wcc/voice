import prisma from '@/lib/prisma'
import { getSession } from '../../actions/auth'

export default async function CalendarPage() {
    const session = await getSession()
    if (!session || !session.tenantId) {
        return <div>Access Denied</div>
    }

    const appointments = await prisma.appointment.findMany({
        where: { tenantId: session.tenantId as string },
        include: {
            contact: true,
            service: true
        },
        orderBy: { startTime: 'asc' }
    })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {appointments.length === 0 ? (
                            <li className="px-4 py-8 text-center text-gray-500">No appointments scheduled.</li>
                        ) : (
                            appointments.map((appt) => (
                                <li key={appt.id} className="px-4 py-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <div className="text-lg font-medium text-indigo-600">
                                            {new Date(appt.startTime).toLocaleDateString()} at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {appt.contact ? `${appt.contact.firstName || 'Unknown'} ${appt.contact.lastName || ''} (${appt.contact.phone})` : 'Client info missing'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Service: {appt.service?.name || 'General Appointment'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                                            appt.status === 'CANCELED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </main>
        </div>
    )
}
