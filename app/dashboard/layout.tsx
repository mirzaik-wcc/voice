import Link from 'next/link'
import { getSession } from '../actions/auth'
import { stopImpersonation } from '../actions/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    const isImpersonating = !!session?.impersonatorId
    const tenantId = session?.tenantId as string

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: 'Leads', href: '/dashboard/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Calendar', href: '/dashboard/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Services', href: '/dashboard/services', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { name: 'Agent Config', href: '/dashboard/settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    ]

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
            {/* Impersonation Banner */}
            {isImpersonating && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur text-white px-4 py-1 text-center text-xs font-medium flex justify-center items-center gap-4 shadow-lg border-b border-white/20">
                    <span className="font-bold tracking-wide">⚠️ IMPERSONATING TENANT</span>
                    <form action={stopImpersonation}>
                        <button type="submit" className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded transition-all text-xs border border-white/30">
                            Exit View
                        </button>
                    </form>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-slate-950 border-r border-indigo-500/10 flex flex-col pt-8 pb-4 relative z-40">
                <div className="px-6 mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VoiceAI</span>
                    </div>
                    {tenantId && <div className="text-xs text-slate-500 font-mono pl-1">{tenantId.substring(0, 8)}...</div>}
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-800/50 hover:text-indigo-300 text-slate-400"
                        >
                            <svg className="w-5 h-5 transition-colors group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="px-6 mt-auto">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-500/20">
                        <h4 className="text-xs font-semibold text-indigo-300 mb-1">Status: Active</h4>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div className="bg-green-400 h-1.5 rounded-full w-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 overflow-y-auto relative bg-slate-900 ${isImpersonating ? 'pt-8' : ''}`}>
                {/* Top subtle glow */}
                <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/5 pointer-events-none blur-[100px]"></div>

                <div className="p-8 max-w-7xl mx-auto relative z-10 text-slate-200">
                    {children}
                </div>
            </main>
        </div>
    )
}
