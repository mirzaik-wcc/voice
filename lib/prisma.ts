import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Debug logging to check environment variables at runtime
    console.log('Initializing Prisma Client...')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    // Log masked database URL to verify existence without leaking credentials
    const dbUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL defined:', !!dbUrl)
    if (dbUrl) {
        console.log('DATABASE_URL length:', dbUrl.length)
        console.log('DATABASE_URL prefix:', dbUrl.substring(0, 15) + '...')
    } else {
        console.error('CRITICAL: DATABASE_URL is missing')
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
