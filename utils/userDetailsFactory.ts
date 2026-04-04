import baseUser from '../test-data/baseUser.json';
import { UserDetails } from '../types/userDetails';
import { faker } from '@faker-js/faker';

export function userDetailsFactory(overrides?: Partial<UserDetails>): UserDetails {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
        ...baseUser,
        name: `${firstName} ${lastName}`,
        email: `${firstName}.${lastName}@test.com`,
        password: faker.internet.password({ length: 12 }),
        firstName: firstName,
        lastName: lastName,
        ...overrides, // allow test-specific overrides
    };
}
