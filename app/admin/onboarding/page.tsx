import OnboardingForm from './form'

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tenant Onboarding</h1>
                </header>
                <OnboardingForm />
            </div>
        </div>
    )
}
