import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, RESEND_VERIFICATION_TOKEN, VERIFY_EMAIL } from 'api/account';
import Modal from 'components/Modal';
import FieldInput from 'components/design-system/FieldInput';
import { showToastError, showToastSuccess } from 'services/toast';

const Verify = () => {
  const [makeVerify, { error }] = useMutation(VERIFY_EMAIL);
  const [resendVerificationToken] = useLazyQuery(RESEND_VERIFICATION_TOKEN);
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

  const onResendVerification = () => {
    resendVerificationToken()
      .then(() => {
        showToastSuccess('Token sent successfully successfully');
      })
      .catch(() => {
        showToastError('error to send verification token');
      });
  };

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
      <p>
        Did not receive the token?{' '}
        <span className='hover:cursor-pointer text-blue-800 underline text-sm' onClick={onResendVerification}>
          Resend the token
        </span>
      </p>
    </Modal>
  );
};

export default Verify;
