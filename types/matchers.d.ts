import 'playwright/test';
import { z } from 'zod';

declare module 'playwright/test' {
    interface Matchers<R> {
        toMatchSchema(schema: z.ZodSchema): R;
    }
}
