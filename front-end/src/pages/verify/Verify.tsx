import React, { FormEvent } from 'react';
import Modal from 'components/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL } from 'api/account';
import FieldInput from 'components/FieldInput';
import { showToastError, showToastSuccess } from 'services/toast';
import SignOut from '../../components/SignOut';

const Verify = () => {
  const location = useLocation();
  const [makeVerify, { error }] = useMutation(VERIFY_EMAIL);
  const [inputValue, setInputValue] = React.useState('');
  const navigate = useNavigate();

  const isOpened = location.pathname === PageRoutes.Verify;

  const onSubmit = () =>
    makeVerify({
      variables: {
        token: +inputValue
      }
    })
      .then(() => {
        showToastSuccess('Verify successfully');
        navigate(PageRoutes.Home);
      })
      .catch(e => {
        console.error(e);
        showToastError('error to verify verification');
      });

  return (
    <Modal isOpen={isOpened} onSubmit={onSubmit} title='Verify Modal'>
      <FieldInput
        id='verify_email'
        label='Fill the code that was sent into your email'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        defaultValue={inputValue}
      />
      <div className='text-end'>
        <SignOut />
      </div>
    </Modal>
  );
};

export default Verify;
