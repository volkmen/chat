const { faker } = require('@faker-js/faker');
const { connectToDatabase } = require('../../services/typeorm');
const { UserEntity } = require('../../entities/User.entity');

module.exports = async function () {
  console.log('GLOBAL SETUP START...');
  const dataSource = await connectToDatabase({
    database: 'test',
    synchronize: true,
    dropSchema: true
  });

  console.log('Successfully connected to database');

  const userData = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    email_token: 1
  };

  const result = await dataSource.manager.createQueryBuilder().insert().into(UserEntity).values(userData).execute();
  console.log('Successfully added default user', result.identifiers[0]);

  await dataSource.close();
  console.log('GLOBAL SETUP END...');
};
