import prisma from '@/lib/prisma'
import { getSession } from '../actions/auth'
import Link from 'next/link'

export default async function TenantDashboard() {
    const session = await getSession()
    if (!session || session.role === 'MASTER_ADMIN') {
        return <div className="p-4 text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg">Access Denied</div>
    }

    const tenantId = session.tenantId as string

    if (!tenantId) {
        return <div className="p-4 text-amber-400 bg-amber-900/20 border border-amber-500/20 rounded-lg">No Tenant ID found for user. Contact support.</div>
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
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Welcome back. Here's what's happening with your agent.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Calls */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-lg font-semibold text-white">Recent Calls</h3>
                        <Link href="/dashboard/leads" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View All &rarr;</Link>
                    </div>

                    <div className="relative z-10">
                        <ul role="list" className="space-y-3">
                            {calls.length === 0 ? (
                                <li className="text-slate-500 text-sm text-center py-8 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">No calls yet.</li>
                            ) : (
                                calls.map(call => (
                                    <li key={call.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/40 border border-transparent hover:border-indigo-500/20 hover:bg-slate-800/60 transition-all duration-200">
                                        <div>
                                            <div className="text-sm font-medium text-indigo-200">{call.fromNumber}</div>
                                            <div className="text-xs text-slate-500">{new Date(call.startTime).toLocaleString()}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${call.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                call.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {call.status}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Agent Config Summary */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-colors duration-300">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-violet-500/20 transition-all duration-500"></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-lg font-semibold text-white">Agent Status</h3>
                        <Link href="/dashboard/settings" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Configure &rarr;</Link>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                            <dt className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">Voice ID</dt>
                            <dd className="text-sm font-mono text-slate-200 break-all">{config?.voiceId || 'Default'}</dd>
                        </div>

                        <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                            <dt className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">System Prompt</dt>
                            <dd className="text-sm text-slate-300 bg-black/20 p-3 rounded-lg border border-black/20 max-h-32 overflow-y-auto">
                                {config?.systemPrompt || 'No prompt configured.'}
                            </dd>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5"></div>
                            <p className="text-xs text-slate-400">Agent is active and ready to take calls.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
