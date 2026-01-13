
import { VoximplantClient } from '../lib/voximplant';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM if needed, but we are using tsx which handles CommonJS/ESM mix. 
// Standard process.cwd() is safest for .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    const vox = new VoximplantClient();
    const appName = 'voice-agent-app'; // The main "platform" app
    const scenarioName = 'deepgram-proxy';
    const ruleName = 'incoming-call';
    const ngrokUrl = process.env.NEXT_PUBLIC_APP_URL;

    console.log(`🚀 Starting Deployment to Voximplant...`);
    console.log(`   App URL: ${ngrokUrl}`);

    // 1. Create Application
    console.log(`\n1. Creating Application: ${appName}...`);
    let appId: number | null = null;

    // Check if exists first/create
    const appRes = await vox.createApplication(appName);
    if (appRes.error) {
        console.log('   Note:', appRes.error.msg);

        // Try to get applications to find ID
        const listRes = await vox.request('GetApplications');
        // Filter carefully
        const existingApp = listRes.result.find((a: any) =>
            a.application_name === appName ||
            a.application_name.startsWith(appName + '.')
        );

        if (existingApp) {
            appId = existingApp.application_id;
            console.log(`   Found existing App ID: ${appId} (${existingApp.application_name})`);
        }
    } else {
        appId = appRes.application_id;
        console.log(`   Created App ID: ${appId}`);
    }

    if (!appId) {
        console.error('Failed to resolve Application ID.');
        return;
    }

    // 2. Prepare Scenario
    console.log(`\n2. Preparing Scenario Script...`);
    const artifactPath = '/Users/mirzakhan/.gemini/antigravity/brain/00ab5d20-9f4b-424b-af9c-b0beac1cd387/voximplant_scenario.js';
    let scriptContent = fs.readFileSync(artifactPath, 'utf8');
    scriptContent = scriptContent.replace('https://<YOUR_NEXTJS_APP_URL>', ngrokUrl!);

    // 3. Upload Scenario
    console.log(`\n3. Uploading Scenario: ${scenarioName}...`);
    let scenarioId: number | null = null;

    // Try create
    const scenRes = await vox.createScenario(scenarioName, scriptContent);
    if (scenRes.error) {
        console.log('   Note:', scenRes.error.msg);
        // Try to get scenarios
        const listScen = await vox.request('GetScenarios');
        const existingScen = listScen.result.find((s: any) => s.scenario_name === scenarioName);
        if (existingScen) {
            scenarioId = existingScen.scenario_id;
            console.log(`   Found existing Scenario ID: ${scenarioId}`);

            // Update it
            await vox.request('SetScenarioInfo', {
                scenario_id: scenarioId,
                scenario_script: scriptContent
            });
            console.log('   Updated existing scenario script.');
        }
    } else {
        scenarioId = scenRes.scenario_id;
        console.log(`   Created Scenario ID: ${scenarioId}`);
    }

    if (!scenarioId) return;

    // 4. Bind Rule
    console.log(`\n4. Binding Rule: ${ruleName}...`);
    const ruleRes = await vox.bindScenario(appId.toString(), ruleName, scenarioId.toString());
    if (ruleRes.error) {
        console.log('   Note:', ruleRes.error.msg);
        // Likely already exists
    } else {
        console.log('   Rule bound successfully.');
    }

    console.log('\n✅ Deployment Complete!');
    console.log('   Go to Voximplant Console -> Numbers and buy/attach a number to "voice-agent-app" if you havent already.');
}

main().catch(console.error);
