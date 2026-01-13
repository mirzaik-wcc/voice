import prisma from '@/lib/prisma'
import { getSession } from '../actions/auth'
import Link from 'next/link'

export default async function TenantDashboard() {
    const session = await getSession()
    if (!session || session.role === 'MASTER_ADMIN') {
        return <div>Access Denied</div>
    }

    const tenantId = session.tenantId as string

    if (!tenantId) {
        return <div>No Tenant ID found for user. Contact support.</div>
    }

    const calls = await prisma.callLog.findMany({
        where: { tenantId },
        orderBy: { startTime: 'desc' },
        take: 10
    })

    const config = await prisma.agentConfig.findUnique({
        where: { tenantId }
    })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <div className="text-sm text-gray-500">Tenant ID: {tenantId}</div>
                    </div>
                    <div className="space-x-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Overview</Link>
                        <Link href="/dashboard/leads" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Leads</Link>
                        <Link href="/dashboard/calendar" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Calendar</Link>
                        <Link href="/dashboard/services" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Services</Link>
                        <Link href="/dashboard/settings" className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium">Agent Config</Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Calls */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Calls</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul role="list" className="divide-y divide-gray-200">
                                {calls.length === 0 ? (
                                    <li className="px-4 py-4 text-gray-500 text-sm">No calls yet.</li>
                                ) : (
                                    calls.map(call => (
                                        <li key={call.id} className="px-4 py-4 flex justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-indigo-600">{call.fromNumber}</div>
                                                <div className="text-xs text-gray-500">{new Date(call.startTime).toLocaleString()}</div>
                                            </div>
                                            <div className="text-sm text-gray-900">{call.status}</div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Agent Config Summary */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Agent Status</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Voice</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{config?.voiceId || 'Default'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">System Prompt</dt>
                                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                        {config?.systemPrompt || 'No prompt configured.'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
