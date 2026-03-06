'use client'

import { useState, useTransition } from 'react'
import { updateAgentConfig } from '../../actions/agent'
import Link from 'next/link'

export default function AgentSettingsPage({
    initialConfig
}: {
    initialConfig: { systemPrompt: string, welcomeMessage: string, voiceId: string }
}) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        setMessage('')
        startTransition(async () => {
            const res = await updateAgentConfig(formData)
            if (res.error) {
                setMessage('Error: ' + res.error)
            } else {
                setMessage('Configuration saved successfully.')
            }
        })
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Agent Configuration</h1>
                    <p className="text-slate-400 mt-1">Define your agent's personality, voice, and instructions.</p>
                </div>
                <Link href="/dashboard/voice" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group">
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Voice Hub
                </Link>
            </header>

            <main className="max-w-4xl">
                <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group border border-white/5 hover:border-indigo-500/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <form action={handleSubmit} className="space-y-8 relative z-10">
                        {/* Voice Selection */}
                        <div className="space-y-3">
                            <label htmlFor="voiceId" className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                Voice Persona
                            </label>
                            <div className="relative">
                                <select
                                    id="voiceId"
                                    name="voiceId"
                                    defaultValue={initialConfig.voiceId}
                                    className="block w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all appearance-none"
                                >
                                    <option value="aura-asteria-en">Asteria (Female - Professional)</option>
                                    <option value="aura-orion-en">Orion (Male - Authoritative)</option>
                                    <option value="aura-luna-en">Luna (Female - Warm/Friendly)</option>
                                    <option value="aura-arcas-en">Arcas (Male - Calm/Helpful)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Select the Deepgram voice model for your agent.</p>
                        </div>

                        {/* Welcome Message */}
                        <div className="space-y-3">
                            <label htmlFor="welcomeMessage" className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                Welcome Greeting
                            </label>
                            <input
                                type="text"
                                name="welcomeMessage"
                                id="welcomeMessage"
                                defaultValue={initialConfig.welcomeMessage}
                                className="block w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="Hello! How can I help you today?"
                            />
                            <p className="text-xs text-slate-500">The very first thing callers hear when the call connects.</p>
                        </div>

                        {/* System Prompt */}
                        <div className="space-y-3">
                            <label htmlFor="systemPrompt" className="block text-sm font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
                                System Instructions
                                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">AI Guidance</span>
                            </label>
                            <textarea
                                id="systemPrompt"
                                name="systemPrompt"
                                rows={8}
                                defaultValue={initialConfig.systemPrompt}
                                className="block w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all font-mono text-sm leading-relaxed"
                                placeholder="You are a helpful assistant for a plumbing company. Your goal is to collect user information and book service calls..."
                            />
                            <p className="text-xs text-slate-500">
                                Define the agent's identity, knowledge, and behavioral rules. Be specific about constraints.
                            </p>
                        </div>

                        {/* Feedback Message */}
                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in border ${
                                message.startsWith('Error') 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Update Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
