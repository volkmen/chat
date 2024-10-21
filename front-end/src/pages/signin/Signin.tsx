import React from 'react';
import { noop } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Routes } from 'consts/routes';
import Modal from 'components/Modal';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from 'api/siginin';
import { showToastError } from 'services/toast';
import { signinInputs, FieldIds } from './consts';
import { ValidationCallback } from './types';
import SignInBody from './SignInBody';

const Signin = () => {
  const [makesignin, { loading }] = useMutation(SIGN_IN);
  const [submitIsDisabled, setSubmitIsDisabled] = React.useState(false);

  const [inputsMap, setInputsMap] = React.useState<Record<string, string>>({});
  const inputsRef = React.useRef<Record<string, ValidationCallback>>({});

  const signinFieldsWithDefaultValues = React.useMemo(
    () =>
      signinInputs.map(f => ({
        ...f,
        defaultValue: inputsMap[f.id]
      })),
    [inputsMap]
  );

  React.useEffect(() => {
    setInputsMap(
      signinInputs.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = '';

        return acc;
      }, {})
    );
  }, []);

  const onChangeInputValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputsMap({ ...inputsMap, [key]: event.target.value });
    setSubmitIsDisabled(false);
  };

  const onSubmit = () => {
    const validationsResult = Object.values(inputsRef.current).map(validationCb => validationCb());

    if (validationsResult.every(Boolean)) {
      makesignin({
        variables: {
          username: inputsMap[FieldIds.Username],
          password: inputsMap[FieldIds.Password]
        }
      })
        .then(() => {
          console.log('successfully signed in');
        })
        .catch(() => {
          showToastError('Error to sign in');
          console.log('error to SIGN in');
        });
    } else {
      setSubmitIsDisabled(true);
    }
  };

  return (
    <Modal isOpen={true} onClose={noop} onSubmit={onSubmit} submitIsDisabled={submitIsDisabled} title='SIGN IN'>
      {/*<div className='relative'>*/}
      {loading && (
        <div className='h-full w-full flex flex-col justify-center items-center absolute top-0 text-center left-0'>
          <div className='loader'></div>
        </div>
      )}
      <div className={classNames(loading && 'opacity-20')}>
        <SignInBody forwardRef={inputsRef} onChangeValue={onChangeInputValue} inputs={signinFieldsWithDefaultValues} />
        <p className='text-sm text-gray-400'>
          You not have an account? Pls register{' '}
          <Link to={Routes.signUp}>
            <span className='uppercase text-blue-700 underline'>sign up</span>
          </Link>
        </p>
      </div>
      {/*</div>*/}
    </Modal>
  );
};

export default Signin;
