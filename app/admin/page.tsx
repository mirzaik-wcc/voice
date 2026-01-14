import prisma from '@/lib/prisma'
import { getSession } from '../actions/auth' // We need to export this or implement it
import Link from 'next/link'

async function getTenants() {
    return await prisma.tenant.findMany({
        include: {
            _count: {
                select: { callLogs: true }
            }
        }
    })
}

export default async function AdminDashboard() {
    const tenants = await getTenants()

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Master Admin Dashboard</h1>
                    <Link href="/admin/onboarding" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        + Onboard Tenant
                    </Link>
                </header>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tenant Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Calls
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(tenant.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{tenant._count.callLogs}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <Link href={`/admin/tenant/${tenant.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                Manage
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                const { impersonateTenant } = await import('../../actions/auth')
                                                await impersonateTenant(tenant.id)
                                            }}>
                                                <button type="submit" className="text-amber-600 hover:text-amber-900 border border-amber-200 px-2 py-1 rounded text-xs bg-amber-50">
                                                    Impersonate
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No tenants found. Start by onboarding one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
