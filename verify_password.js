const { eventStore } = require('./src/lib/store');

console.log("Starting Password Persistence Verification...");

async function verify() {
    try {
        const slug = "test-password-event";

        // Cleanup if exists
        try {
            await eventStore.delete(slug);
        } catch (e) { }

        // Create
        console.log("Creating event...");
        await eventStore.add({
            slug,
            title: "Test Password Event",
            shortDescription: "Test",
            fullDescription: "Test",
            date: "2025-01-01",
            time: "10:00",
            venue: "Test",
            teamSize: "1",
            maxTeamSize: 1,
            status: "Open",
            category: "Technical",
            password: "secret-password-123",
            image: "placeholder",
            showOnHighlights: false
        });

        // Read back
        console.log("Reading event...");
        const event = await eventStore.getBySlug(slug);

        if (event.password === "secret-password-123") {
            console.log("SUCCESS: Password saved and retrieved correctly.");
        } else {
            console.error("FAILURE: Password mismatch.", event.password);
            process.exit(1);
        }

        // Update
        console.log("Updating password...");
        await eventStore.update(slug, { password: "new-password-456" });
        const updatedEvent = await eventStore.getBySlug(slug);

        if (updatedEvent.password === "new-password-456") {
            console.log("SUCCESS: Password updated correctly.");
        } else {
            console.error("FAILURE: Password update failed.", updatedEvent.password);
            process.exit(1);
        }

        // Cleanup
        await eventStore.delete(slug);

    } catch (e) {
        console.error("Verification Error:", e);
        process.exit(1);
    }
}

// Mock Prisma if running purely in node without full next env context might be hard, 
// so this relies on being able to import store.ts. 
// If this fails due to environment, we rely on the implementation fix.
verify();
