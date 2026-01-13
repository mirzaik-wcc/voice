'use client'

import { useState, useTransition } from 'react'
import { updateAgentConfig } from '../../actions/agent'

export default function AgentSettingsPage({
    initialConfig
}: {
    initialConfig: { systemPrompt: string, welcomeMessage: string, voiceId: string }
}) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Agent Configuration</h1>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="voiceId" className="block text-sm font-medium text-gray-700">
                                Voice Model
                            </label>
                            <select
                                id="voiceId"
                                name="voiceId"
                                defaultValue={initialConfig.voiceId}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="aura-asteria-en">Asteria (Female)</option>
                                <option value="aura-orion-en">Orion (Male)</option>
                                <option value="aura-luna-en">Luna (Female)</option>
                                <option value="aura-arcas-en">Arcas (Male)</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">Select the voice persona for your agent.</p>
                        </div>

                        <div>
                            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
                                Welcome Message
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="welcomeMessage"
                                    id="welcomeMessage"
                                    defaultValue={initialConfig.welcomeMessage}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="Hello! How can I help you today?"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">The first thing the agent says when answering the call.</p>
                        </div>

                        <div>
                            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
                                System Prompt / Instructions
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="systemPrompt"
                                    name="systemPrompt"
                                    rows={10}
                                    defaultValue={initialConfig.systemPrompt}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="You are a helpful assistant for a plumbing company..."
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Define the agent's personality, knowledge base, and rules.
                            </p>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-md ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
