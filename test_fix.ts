import { z } from "zod";

const formSchema = z.object({
    leadName: z.string().min(2, "Name is required"),
    driveLink: z.string().optional(),
});

// Original failing case
const test1 = {
    leadName: "Test Lead",
    driveLink: null,
};

// Simulation of the fix
const test1Fixed = {
    ...test1,
    driveLink: test1.driveLink || undefined
};

const result1 = formSchema.safeParse(test1Fixed);
console.log("Test 1 (Simulated Fix - driveLink: null -> undefined):", result1.success ? "Success" : JSON.stringify(result1.error, null, 2));

const test2 = {
    leadName: "Test Lead",
    driveLink: "https://drive.google.com/test",
};

const result2 = formSchema.safeParse(test2);
console.log("Test 2 (Valid driveLink):", result2.success ? "Success" : JSON.stringify(result2.error, null, 2));
