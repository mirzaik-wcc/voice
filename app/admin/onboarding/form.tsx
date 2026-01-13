'use client'

import { useState, useTransition } from 'react'
import { onboardTenant } from '../../actions/onboarding'

export default function OnboardingForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const res = await onboardTenant(formData)
            if (res.error) {
                setMessage('Error: ' + res.error)
            } else {
                setMessage(`Success! Tenant created (ID: ${res.tenantId}). Voximplant: ${res.provisionStatus}`)
            }
        })
    }

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Onboard New Tenant</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Create a new business tenant, admin account, and provision phone number.</p>
                </div>
                <form action={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input type="text" name="name" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Admin Email</label>
                        <input type="email" name="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Admin Password</label>
                        <input type="password" name="password" id="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">Preferred Area Code (Optional)</label>
                        <input type="text" name="areaCode" id="areaCode" maxLength={3} className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g 512" />
                    </div>

                    {message && (
                        <div className={`p-2 rounded text-sm ${message.startsWith('Error') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                            {message}
                        </div>
                    )}

                    <div className="pt-2">
                        <button type="submit" disabled={isPending} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {isPending ? 'Provisioning...' : 'Create Tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
