export class VoximplantClient {
    private accountId: string;
    private apiKey: string;
    private baseUrl = 'https://api.voximplant.com/platform_api';

    constructor() {
        this.accountId = process.env.VOXIMPLANT_ACCOUNT_ID || '';
        this.apiKey = process.env.VOXIMPLANT_API_KEY || '';
    }

    // Changed to public for script usage, or keep private and add specific methods
    public async request(method: string, params: Record<string, any> = {}) {
        if (!this.accountId || !this.apiKey) {
            console.warn('Missing Voximplant credentials. Mocking response.');
            return { result: 'mock_success', id: 'mock_id_' + Date.now() };
        }

        const url = new URL(`${this.baseUrl}/${method}/`);
        url.searchParams.append('account_id', this.accountId);
        url.searchParams.append('api_key', this.apiKey);

        // Append other params
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.error) {
            // Don't throw immediately, let caller handle if it's "Already exists"
            // throw new Error(`Voximplant Error: ${JSON.stringify(data.error)}`);
            return { error: data.error };
        }

        return data;
    }

    async createApplication(appName: string) {
        return this.request('AddApplication', {
            application_name: appName
        });
    }

    async createChildAccount(username: string, email: string) {
        // In a real multi-tenant setup, you might use 'AddChildAccount'
        // Or just 'AddApplication' if sharing one account.
        // Let's assume 'AddApplication' for simplicity in this MVP, 
        // keeping tenants logically separated by app name.

        const appName = `tenant-${username}-${Date.now()}`;
        return this.request('AddApplication', {
            application_name: appName
        });
    }

    async searchPhoneNumber(countryCode: string = 'US') {
        return this.request('GetNewPhoneNumbers', {
            country_code: countryCode,
            count: 1
        });
    }

    async buyPhoneNumber(phoneId: string) {
        return this.request('AttachPhoneNumber', {
            phone_number_id: phoneId
        });
    }

    async createScenario(scenarioName: string, script: string) {
        return this.request('AddScenario', {
            scenario_name: scenarioName,
            scenario_script: script
        });
    }

    async bindScenario(appId: string, ruleName: string, scriptId: string) {
        // 1. Create Rule
        return this.request('AddRule', {
            application_id: appId,
            rule_name: ruleName,
            rule_pattern: '.*', // Catch all
            scenario_id: scriptId
        });
    }
}
