import prisma from '../lib/prisma'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()


async function main() {
    const email = 'admin@voice.ai'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Create Master Admin
    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            role: 'MASTER_ADMIN',
        },
    })
    console.log({ admin })

    // 2. Create Demo Tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'demo-tenant-001' },
        update: {},
        create: {
            id: 'demo-tenant-001',
            name: 'Demo Business',
        },
    })
    console.log({ tenant })

    // 3. Create Tenant Admin User
    const tenantAdminEmail = 'demo@voice.ai'
    const tenantAdmin = await prisma.user.upsert({
        where: { email: tenantAdminEmail },
        update: {},
        create: {
            email: tenantAdminEmail,
            password: hashedPassword,
            role: 'TENANT_ADMIN',
            tenantId: tenant.id,
        },
    })
    console.log({ tenantAdmin })

    // 4. Create Agent Config for Demo Tenant
    const agentConfig = await prisma.agentConfig.upsert({
        where: { tenantId: tenant.id },
        update: {},
        create: {
            tenantId: tenant.id,
            voiceId: 'aura-asteria-en',
            welcomeMessage: 'Hello! Thanks for calling Demo Business. How can I help you today?',
            systemPrompt: 'You are a helpful AI assistant for Demo Business. Be friendly, professional, and help callers with their questions. You can create leads, check availability, and book appointments.',
        },
    })
    console.log({ agentConfig })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
