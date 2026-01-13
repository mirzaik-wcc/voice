import { getAgentConfig } from '../../actions/agent'
import AgentSettingsPage from './agent-form'

export default async function Page() {
    const config = await getAgentConfig()

    if (!config) {
        return <div>Error loading configuration.</div>
    }

    return <AgentSettingsPage initialConfig={config} />
}
