import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, VERIFY_EMAIL } from 'api/account';
import Modal from 'components/Modalv2';
import FieldInput from 'components/FieldInput';
import { showToastError, showToastSuccess } from 'services/toast';

const Verify = () => {
  const [makeVerify, { error }] = useMutation(VERIFY_EMAIL);
  const { refetch: refetchMe } = useQuery(ME_QUERY);
  const [inputValue, setInputValue] = React.useState('');
  const navigate = useNavigate();

  const onSubmit = () =>
    makeVerify({
      variables: {
        token: +inputValue
      }
    })
      .then(refetchMe)
      .then(() => {
        showToastSuccess('Verify successfully');
        navigate(PageRoutes.Home);
      })
      .catch(e => {
        console.error(e);
        showToastError('error to verify verification');
      });

  return (
    <Modal
      submit={{ onSubmit }}
      title='Verify Modal'
      disableCloseBtn
      cancel={{
        name: <Link to={PageRoutes.SignIn}>sign out</Link>
      }}
    >
      <FieldInput
        id='verify_email'
        label='Fill the code that was sent into your email'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        defaultValue={inputValue}
        wrapperStyle={{ marginBottom: 0 }}
        errorMsg={error?.message}
      />
    </Modal>
  );
};

export default Verify;
