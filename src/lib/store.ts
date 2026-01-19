import { events as initialEvents, Event } from "./data"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "src", "data")
const DATA_FILE = path.join(DATA_DIR, "events.json")

class EventStore {
    private events: Event[]

    constructor() {
        this.events = [] // Initialize empty
        this.init() // Load synchronously on startup
    }

    private init() {
        try {
            // Ensure directory exists
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true })
            }

            // Check if file exists
            if (fs.existsSync(DATA_FILE)) {
                const fileContent = fs.readFileSync(DATA_FILE, "utf-8")
                this.events = JSON.parse(fileContent)
            } else {
                // Seed with initial data if file missing
                this.events = [...initialEvents]
                this.save()
            }
        } catch (error) {
            console.error("Failed to initialize EventStore:", error)
            this.events = [...initialEvents] // Fallback
        }
    }

    private save() {
        try {
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true })
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.events, null, 2))
        } catch (error) {
            console.error("Failed to save EventStore:", error)
        }
    }

    getAll() {
        // Reload in dev to simulate fresh fetch on request? 
        // For efficiency, we keep in memory, but if we assume external edits, we'd read every time.
        // Let's stick to memory-first for perf, write-through for persistence.
        return this.events
    }

    getBySlug(slug: string) {
        return this.events.find((e) => e.slug === slug)
    }

    update(slug: string, updates: Partial<Event>) {
        const index = this.events.findIndex((e) => e.slug === slug)
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...updates }
            this.save() // ROI: Save changes
            return this.events[index]
        }
        return null
    }

    add(event: Event) {
        this.events.push(event)
        this.save() // ROI: Save new event
        return event
    }

    delete(slug: string) {
        this.events = this.events.filter(e => e.slug !== slug)
        this.save() // ROI: Save deletion
    }
}

// Singleton instance
const globalForStore = globalThis as unknown as { eventStore: EventStore }

export const eventStore = globalForStore.eventStore || new EventStore()

if (process.env.NODE_ENV !== "production") globalForStore.eventStore = eventStore
