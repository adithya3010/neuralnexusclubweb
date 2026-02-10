import { NextResponse } from 'next/server'
import { eventStore } from '@/lib/store'

export async function GET() {
    const events = await eventStore.getAll()
    const simpleEvents = events.map(e => ({ slug: e.slug, title: e.title }))
    return NextResponse.json(simpleEvents)
}
