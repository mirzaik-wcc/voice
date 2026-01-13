import ServiceForm from './form'
import { getServices } from '../../actions/services'

export default async function ServicesPage() {
    const services = await getServices()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                <ServiceForm />

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {services.map(service => (
                            <li key={service.id} className="px-4 py-4 flex justify-between items-center sm:px-6">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                                    <p className="text-sm text-gray-500">{service.duration} minutes • ${service.price}</p>
                                </div>
                            </li>
                        ))}
                        {services.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-500">No services defined.</li>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    )
}
