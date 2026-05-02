import { z } from 'zod';

export const userSchema = z.object({
    responseCode: z.number(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        title: z.string(),
        birth_day: z.string(),
        birth_month: z.string(),
        birth_year: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        company: z.string(),
        address1: z.string(),
        address2: z.string(),
        country: z.string(),
        state: z.string(),
        city: z.string(),
        zipcode: z.string(),
    }),
});

export const brandsListSchema = z.object({
    responseCode: z.number(),
    brands: z.array(z.object({ id: z.number(), brand: z.string() })),
});

export const productsSchema = z.object({
    responseCode: z.number(),
    products: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            price: z.string(),
            brand: z.string(),
            category: z.object({
                usertype: z.object({ usertype: z.string() }),
                category: z.string(),
            }),
        })
    ),
});
