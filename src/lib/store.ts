import { PrismaClient } from '@prisma/client'
import { Event } from "./data"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

class EventStore {
    async getAll() {
        return await prisma.event.findMany({
            orderBy: { date: 'asc' }
        })
    }

    async getBySlug(slug: string) {
        return await prisma.event.findUnique({
            where: { slug }
        })
    }

    async update(slug: string, updates: Partial<Event>) {
        return await prisma.event.update({
            where: { slug },
            data: {
                ...updates,
                maxTeamSize: typeof updates.maxTeamSize === 'string' ? parseInt(updates.maxTeamSize) : updates.maxTeamSize
            }
        })
    }

    async add(event: Event) {
        return await prisma.event.create({
            data: event
        })
    }

    async delete(slug: string) {
        return await prisma.event.delete({
            where: { slug }
        })
    }
}

export const eventStore = new EventStore()
