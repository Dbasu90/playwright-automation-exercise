import { test, expect } from '../../fixtures/baseTest';
import { faker } from '@faker-js/faker';

test.describe('Verify the APIs for the clientsite', async () => {
    test('Verify Login with valid details', async ({ request }) => {
        const loginResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
            form: {
                email: process.env.EMAIL!,
                password: process.env.PASSWORD!,
            },
        });
        expect(loginResponse.status()).toEqual(200);
        const loginResponseBody = await loginResponse.json();
        const message = loginResponseBody.message;
        expect(message).toEqual('User exists!');
    });
    test('Verify Login with invalid details', async ({ request }) => {
        const loginResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
            form: {
                email: 'testuser@test.com',
                password: 'test123',
            },
        });
        const loginResponseBody = await loginResponse.json();
        expect(loginResponseBody.responseCode).toEqual(404);
        expect(loginResponseBody.message).toEqual('User not found!');
    });
    test('Get All Brands List', async ({ request }) => {
        const brandResponse = await request.get('https://automationexercise.com/api/brandsList');
        expect(brandResponse.status()).toEqual(200);
        const brandResponseBody = await brandResponse.json();
        const firstBrand = brandResponseBody.brands[0].brand;
        expect(firstBrand).toEqual('Polo');
        const uniqueBrands = [...new Set(brandResponseBody.brands.map((b) => b.brand))];
        console.log(uniqueBrands);
        const brandsCount = brandResponseBody.brands.reduce((acc, b) => {
            acc[b.brand] = (acc[b.brand] || 0) + 1;
            return acc;
        }, {});
        console.log(brandsCount);
    });
    test('Search Product', async ({ request }) => {
        const allProductsResponse = await request.get('https://automationexercise.com/api/productsList');
        expect(allProductsResponse.status()).toEqual(200);
        const allProductsResponseBody = await allProductsResponse.json();
        const searchProduct = allProductsResponseBody.products[0].name;
        const searchResponse = await request.post('https://automationexercise.com/api/searchProduct', {
            form: {
                search_product: searchProduct,
            },
        });
        const searchResponseBody = await searchResponse.json();
        expect(searchResponseBody.responseCode).toEqual(200);
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
        const userResponse = await request.post('https://automationexercise.com/api/createAccount', {
            form: user,
        });
        const userResponseBody = await userResponse.json();
        expect(userResponseBody.responseCode).toEqual(201);
        expect(userResponseBody.message).toEqual('User created!');
        user.firstname = `Test ${firstName}`;
        user.lastname = `Test ${lastName}`;
        const updateResponse = await request.put('https://automationexercise.com/api/updateAccount', {
            form: user,
        });
        const updateResponseBody = await updateResponse.json();
        expect(updateResponseBody.responseCode).toEqual(200);
        expect(updateResponseBody.message).toEqual('User updated!');
        const deleteResponse = await request.delete('https://automationexercise.com/api/deleteAccount', {
            form: {
                email: user.email,
                password: user.password,
            },
        });
        const deleteResponseBody = await deleteResponse.json();
        expect(deleteResponseBody.responseCode).toEqual(200);
        expect(deleteResponseBody.message).toEqual('Account deleted!');
    });
    test('Get user account by email', async ({ request }) => {
        const accountResponse = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
            params: {
                email: process.env.EMAIL!,
            },
        });
        expect(accountResponse.status()).toEqual(200);
        const accountResponseBody = await accountResponse.json();
        const userName = accountResponseBody.user.name;
        expect(userName).toEqual(process.env.NAME!);
    });
});
