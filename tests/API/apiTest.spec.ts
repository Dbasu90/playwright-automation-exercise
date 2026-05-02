import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { userSchema, brandsListSchema, productsSchema } from '../../types/schemas';
import { validateSchemaZod } from 'playwright-schema-validator';

test.describe('Verify the APIs for the clientsite', () => {
    test('Verify Login with valid details', async ({ request }) => {
        const loginResponse = await request.post('/api/verifyLogin', {
            form: {
                email: process.env.EMAIL!,
                password: process.env.PASSWORD!,
            },
        });
        expect(loginResponse.status()).toBe(200);
        const loginResponseBody = await loginResponse.json();
        const message = loginResponseBody.message;
        expect(message).toBe('User exists!');
    });

    test('Verify Login with invalid details', async ({ request }) => {
        const loginResponse = await request.post('/api/verifyLogin', {
            form: {
                email: 'testuser@test.com',
                password: 'test123',
            },
        });
        const loginResponseBody = await loginResponse.json();
        expect(loginResponseBody.responseCode).toBe(404);
        expect(loginResponseBody.message).toBe('User not found!');
    });

    test('Get All Brands List', async ({ request, page }) => {
        const brandResponse = await request.get('/api/brandsList');
        await expect(brandResponse).toBeOK();
        const brandResponseBody = await brandResponse.json();
        validateSchemaZod({ page }, brandResponseBody, brandsListSchema); // using playwright schema validator as no explicit assertion is required
        const firstBrand = brandResponseBody.brands[0].brand;
        expect(firstBrand).toBe('Polo');
        const uniqueBrands = [...new Set(brandResponseBody.brands.map((b: { brand: string }) => b.brand))];
        console.log(uniqueBrands);
        const brandsCount = brandResponseBody.brands.reduce((acc: { [key: string]: number }, b: { brand: string }) => {
            acc[b.brand] = (acc[b.brand] || 0) + 1;
            return acc;
        }, {});
        console.log(brandsCount);
    });

    test('Search Product', async ({ request }) => {
        const allProductsResponse = await request.get('/api/productsList');
        await expect(allProductsResponse).toBeOK();
        const allProductsResponseBody = await allProductsResponse.json();
        expect(productsSchema.parse(allProductsResponseBody)).toBeTruthy();
        const searchProduct = allProductsResponseBody.products[0].name;
        const searchResponse = await request.post('/api/searchProduct', {
            form: {
                search_product: searchProduct,
            },
        });
        const searchResponseBody = await searchResponse.json();
        expect(searchResponseBody.responseCode).toBe(200);
        expect(searchResponseBody.products).toHaveLength(1);
        expect(searchResponseBody.products[0].name).toBe(searchProduct);
        expect(searchResponseBody).toMatchObject({
            responseCode: 200,
            products: [
                {
                    id: expect.any(Number),
                    name: 'Blue Top',
                    price: 'Rs. 500',
                    brand: 'Polo',
                    category: {
                        usertype: {
                            usertype: 'Women',
                        },
                        category: 'Tops',
                    },
                },
            ],
        });
    });

    test('Create user account, update and delete it', async ({ request }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const user = {
            name: `${firstName} ${lastName}`,
            email: `${firstName}.${lastName}@test.com`,
            password: faker.internet.password({ length: 12 }),
            firstname: firstName,
            lastname: lastName,
            address1: faker.location.streetAddress(),
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            mobile_number: faker.phone.number(),
        };
        const userResponse = await request.post('/api/createAccount', {
            form: user,
        });
        const userResponseBody = await userResponse.json();
        expect(userResponseBody.responseCode).toBe(201);
        expect(userResponseBody.message).toBe('User created!');
        user.firstname = `Test ${firstName}`;
        user.lastname = `Test ${lastName}`;
        const updateResponse = await request.put('/api/updateAccount', {
            form: user,
        });
        const updateResponseBody = await updateResponse.json();
        expect(updateResponseBody.responseCode).toBe(200);
        expect(updateResponseBody.message).toBe('User updated!');
        const deleteResponse = await request.delete('/api/deleteAccount', {
            form: {
                email: user.email,
                password: user.password,
            },
        });
        const deleteResponseBody = await deleteResponse.json();
        expect(deleteResponseBody.responseCode).toBe(200);
        expect(deleteResponseBody.message).toBe('Account deleted!');
    });

    test('Get user account by email', async ({ request }) => {
        const accountResponse = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: process.env.EMAIL!,
            },
        });
        await expect(accountResponse).toBeOK();
        const accountResponseBody = await accountResponse.json();
        const userName = accountResponseBody.user.name;
        expect(userName).toBe(process.env.NAME!);
        expect(accountResponseBody).toMatchSchema(userSchema);
    });
});
