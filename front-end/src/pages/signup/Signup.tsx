import React from 'react';
import { noop } from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import classNames from 'classnames';

import { ValidationCallback } from './types';
import { SIGN_UP } from 'api/account';
import { FieldIds, signupFields } from './consts';
import { showToastError, showToastSuccess } from 'services/toast';
import SignupBody from './SignupBody';
import Modal from 'components/Modal';
import { PageRoutes } from 'consts/routes';

const Signup = () => {
  const [inputsMap, setInputsMap] = React.useState<Record<string, string>>({});
  const inputsRef = React.useRef<Record<string, ValidationCallback>>({});
  const navigate = useNavigate();

  const [makeSignUp, { loading }] = useMutation(SIGN_UP);

  const signupFieldsWithDefaultValues = React.useMemo(
    () =>
      signupFields.map(f => ({
        ...f,
        defaultValue: inputsMap[f.id]
      })),
    [inputsMap]
  );

  React.useEffect(() => {
    setInputsMap(
      signupFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = '';

        return acc;
      }, {})
    );
  }, []);

  const onChangeInputValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputsMap({ ...inputsMap, [key]: event.target.value });
  };

  const onSubmit = () => {
    const validationsResult = Object.values(inputsRef.current).map(validationCb => validationCb());

    if (validationsResult.every(Boolean)) {
      makeSignUp({
        variables: {
          username: inputsMap[FieldIds.email],
          email: inputsMap[FieldIds.email],
          password: inputsMap[FieldIds.password]
        }
      })
        .then(result => {
          localStorage.setItem('token', result.data.SignUp.jwtToken);
          showToastSuccess('successfully signed up');
          navigate(PageRoutes.Verify);
        })
        .catch(() => {
          showToastError('Error to sign up');
        });
    } else {
      console.log('error', validationsResult);
    }
  };

  return (
    <Modal isOpen={true} onClose={noop} onSubmit={onSubmit} title='SIGN UP'>
      {/*<div className='relative'>*/}
      {loading && (
        <div className='h-full w-full flex flex-col justify-center items-center absolute top-0 text-center left-0'>
          <div className='loader'></div>
        </div>
      )}
      <div className={classNames(loading && 'opacity-20')}>
        <SignupBody forwardRef={inputsRef} onChangeValue={onChangeInputValue} inputs={signupFieldsWithDefaultValues} />
        <p className='text-sm text-gray-400'>
          You have an account? Pls{' '}
          <Link to={PageRoutes.SignIn}>
            <span className='uppercase text-blue-700 underline'>sign in</span>
          </Link>
        </p>
      </div>
      {/*</div>*/}
    </Modal>
  );
};

export default Signup;
