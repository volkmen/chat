import React from 'react';
import Modal from 'components/Modal';
import { noop } from 'lodash';
import SignupBody from './SignupBody';
import { Link } from 'react-router-dom';
import { Routes } from 'consts/routes';
import { ValidationCallback } from './types';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from './api';
import { FieldIds, signupFields } from './consts';
import classNames from 'classnames';
import { showToastError } from '../../services/toast';

const Signup = () => {
  const [inputsMap, setInputsMap] = React.useState<Record<string, string>>({});
  const inputsRef = React.useRef<Record<string, ValidationCallback>>({});

  const [makeSignUp, { data, loading, error }] = useMutation(SIGN_UP);

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
        .then(() => {
          console.log('successfully signed up');
        })
        .catch(() => {
          showToastError('Error to sign up');
          console.log('error to SIGN up');
        });
    } else {
      console.log('error', validationsResult);
    }
  };

  return (
    <Modal isOpen={true} onClose={noop} onSubmit={onSubmit} title='SIGN UP'>
      {/*<div className='relative'>*/}
      {loading && (
        <div
          className={classNames(
            'h-full w-full flex flex-col justify-center items-center absolute top-0 text-center left-0'
          )}
        >
          <div className='loader'></div>
        </div>
      )}
      <div className={classNames(loading && 'opacity-20')}>
        <SignupBody forwardRef={inputsRef} onChangeValue={onChangeInputValue} inputs={signupFieldsWithDefaultValues} />
        <p className='text-sm text-gray-400'>
          You have an account? Pls{' '}
          <Link to={Routes.signIn}>
            <span className='uppercase text-blue-700 underline'>sign in</span>
          </Link>
        </p>
      </div>
      {/*</div>*/}
    </Modal>
  );
};

export default Signup;
