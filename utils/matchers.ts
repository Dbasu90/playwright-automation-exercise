import { expect } from '@playwright/test';
import { z } from 'zod';

expect.extend({
    toMatchSchema(received: unknown, schema: z.ZodSchema) {
        const result = schema.safeParse(received);

        if (result.success) {
            return {
                pass: true,
                message: () => 'Expected object not to match schema, but it did',
            };
        }

        const issues = result.error.issues.map((issue) => `• ${issue.path.join('.')}: ${issue.message}`).join('\n');

        return {
            pass: false,
            message: () => `Schema validation failed:\n${issues}`,
        };
    },
});
