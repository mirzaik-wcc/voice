import prisma from '../lib/prisma'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()


async function main() {
    const email = 'admin@voice.ai'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

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
