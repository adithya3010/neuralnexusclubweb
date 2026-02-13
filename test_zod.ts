import { z } from "zod";

const formSchema = z.object({
    leadName: z.string().min(2, "Name is required"),
    driveLink: z.string().optional(),
});

const test1 = {
    leadName: "Test Lead",
    driveLink: null, // Simulate missing field from FormData
};

const result1 = formSchema.safeParse(test1);
console.log("Test 1 (driveLink: null):", result1.success ? "Success" : JSON.stringify(result1.error, null, 2));

const test2 = {
    leadName: "Test Lead",
    driveLink: undefined,
};

const result2 = formSchema.safeParse(test2);
console.log("Test 2 (driveLink: undefined):", result2.success ? "Success" : JSON.stringify(result2.error, null, 2));
