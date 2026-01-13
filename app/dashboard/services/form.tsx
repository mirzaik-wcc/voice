'use client'

import { useState, useTransition } from 'react'
import { createService } from '../../actions/services'

export default function ServiceForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const res = await createService(formData)
            if (res?.error) {
                setMessage('Error: ' + res.error)
            } else {
                setMessage('Service created successfully.')
                // Optional: clear form
            }
        })
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
            <form action={handleSubmit} className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
                    <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Plumbing Repair" />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (min)</label>
                    <input type="number" name="duration" required defaultValue={60} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input type="number" name="price" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {message && (
                    <div className={`sm:col-span-3 p-2 rounded text-sm ${message.startsWith('Error') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                        {message}
                    </div>
                )}

                <div className="sm:col-span-3">
                    <button type="submit" disabled={isPending} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {isPending ? 'Adding...' : 'Add Service'}
                    </button>
                </div>
            </form>
        </div>
    )
}
