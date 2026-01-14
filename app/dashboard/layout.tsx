import Link from 'next/link'
import { getSession } from '../actions/auth'
import { stopImpersonation } from '../actions/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    // Check if impersonating
    const isImpersonating = !!session?.impersonatorId

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Impersonation Banner */}
            {isImpersonating && (
                <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex justify-center items-center gap-4 shadow-md sticky top-0 z-50">
                    <span>⚠️ You are impersonating a specific tenant. Changes you make will be live.</span>
                    <form action={stopImpersonation}>
                        <button type="submit" className="bg-white text-amber-600 px-3 py-1 rounded hover:bg-amber-50 transition-colors">
                            Exit View
                        </button>
                    </form>
                </div>
            )}

            {/* Dashboard Content - We can reuse the header from page.tsx or move it here later, 
                for now just wrapping children to inject the banner */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}
