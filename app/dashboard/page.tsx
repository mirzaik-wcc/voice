import Link from 'next/link'
import { getSession } from '../actions/auth'

export default async function LaunchpadDashboard() {
    const session = await getSession()

    // We should probably check permissions here too, but layout handles most of it.
    // In a real app we'd fetch which modules are active for this tenant.

    const modules = [
        {
            id: 'voice',
            name: 'Voice AI',
            description: 'AI Receptionist & Call Handling',
            icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
            href: '/dashboard/voice',
            color: 'from-indigo-500 to-violet-500',
            active: true
        },
        {
            id: 'crm',
            name: 'Leads & CRM',
            description: 'Manage contacts and pipeline',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            href: '/dashboard/leads',
            color: 'from-emerald-500 to-teal-500',
            active: true
        },
        {
            id: 'calendar',
            name: 'Calendar',
            description: 'Appointments and scheduling',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            href: '/dashboard/calendar',
            color: 'from-amber-500 to-orange-500',
            active: true
        },
        {
            id: 'services',
            name: 'Services',
            description: 'Configure service offerings',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
            href: '/dashboard/services',
            color: 'from-blue-500 to-cyan-500',
            active: true
        },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Launchpad</h1>
                <p className="text-slate-400 mt-1">Select a module to manage.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Link href={module.href} key={module.id} className="group">
                        <div className="glass-panel rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/5 hover:border-white/10">
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.icon} />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{module.name}</h3>
                                <p className="text-slate-400 text-sm mb-4 flex-grow">{module.description}</p>

                                <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                                    <span>Open Module</span>
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
