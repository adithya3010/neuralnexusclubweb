import { PrismaClient } from '@prisma/client'
import { unstable_cache, revalidateTag } from 'next/cache'
import { Event } from "./data"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

class EventStore {
    // Cache the getAll query with a tag for invalidation
    getAll = unstable_cache(
        async () => {
            return await prisma.event.findMany({
                orderBy: { date: 'asc' }
            })
        },
        ['all-events'],
        { revalidate: 60, tags: ['events'] }
    )

    // Cache getBySlug with dynamic key based on slug
    getBySlug = async (slug: string) => {
        return await unstable_cache(
            async () => {
                return await prisma.event.findUnique({
                    where: { slug }
                })
            },
            [`event-${slug}`],
            { revalidate: 60, tags: ['events'] }
        )()
    }

    async update(slug: string, updates: Partial<Event>) {
        const result = await prisma.event.update({
            where: { slug },
            data: {
                ...updates,
                maxTeamSize: typeof updates.maxTeamSize === 'string' ? parseInt(updates.maxTeamSize) : updates.maxTeamSize
            }
        })
        revalidateTag('events', 'default')
        return result
    }

    async add(event: Event) {
        const result = await prisma.event.create({
            data: event
        })
        revalidateTag('events', 'default')
        return result
    }

    async delete(slug: string) {
        const result = await prisma.event.delete({
            where: { slug }
        })
        revalidateTag('events', 'default')
        return result
    }
}

export const eventStore = new EventStore()
