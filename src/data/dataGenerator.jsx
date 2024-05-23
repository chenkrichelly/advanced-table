import { faker } from '@faker-js/faker';

const createUser = () => {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const age= faker.number.int({ min: 20, max: 70 });
    const balance= faker.number.float({ min: 0, max: 10000, precision: 0.01 })

    return {
        id: faker.string.uuid(),
        name: `${firstName} ${lastName}`,
        email,
        age,
        isPremium: faker.datatype.boolean(),
        balance,
        language: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'Chinese', 'Hindu']),
    };
};

const createUserArray = (count = 50) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(createUser());
    }
    return users;
};

const dataGenerator = () => {
    const columns = [
        { id: 'name', ordinalNo: 1, title: 'Name', type: 'string' },
        { id: 'email', ordinalNo: 2, title: 'Email', type: 'string' },
        { id: 'age', ordinalNo: 3, title: 'Age', type: 'number', width: 70 },
        { id: 'balance', ordinalNo: 5, title: 'Balance', type: 'float', width: 150 },
        { id: 'isPremium', ordinalNo: 4, title: 'Premium', type: 'boolean', width: 80 },
        { id: 'language', ordinalNo: 6, title: 'Language', type: 'selection', options: ['English', 'Spanish', 'French', 'Chinese', 'Hindi'], width: 150 },
    ];

    const userData = createUserArray(40);

    return { columns, userData };
};

export default dataGenerator;
