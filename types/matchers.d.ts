import { z } from 'zod';

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toMatchSchema(schema: z.ZodTypeAny): R;
        }
    }
}

export {};
