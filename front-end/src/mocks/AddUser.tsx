import React from 'react';
import { Button } from 'flowbite-react';
import { faker } from '@faker-js/faker';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../api/account';
import toast from 'react-hot-toast';

const AddUser = () => {
  const [makeSignUp] = useMutation(SIGN_UP);

  const addUser = () =>
    makeSignUp({
      variables: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
      .then(() => {
        toast.success('Fake user added successfully');
      })
      .catch(() => {
        toast.error('Error ');
      });

  return <Button onClick={addUser}>add faker user</Button>;
};

export default AddUser;
