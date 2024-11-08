import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from 'api/account';
import { showToastError, showToastSuccess } from 'services/toast';
import { signinInputs, FieldIds } from './consts';
import { ValidationCallback } from './types';
import SignInBody from './SignInBody';
import Modal from 'components/Modalv2';

const Signin = () => {
  const [makesignin, { loading }] = useMutation(SIGN_IN);
  const [submitIsDisabled, setSubmitIsDisabled] = React.useState(false);
  const navigate = useNavigate();

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
      console.log({
        email: inputsMap[FieldIds.Email],
        password: inputsMap[FieldIds.Password]
      });
      makesignin({
        variables: {
          email: inputsMap[FieldIds.Email],
          password: inputsMap[FieldIds.Password]
        }
      })
        .then(response => {
          localStorage.setItem('token', response.data.SignIn.jwtToken);
          navigate(PageRoutes.Home);
          showToastSuccess('successfully signed in');
        })
        .catch(e => {
          showToastError('Error to sign in');
        });
    } else {
      setSubmitIsDisabled(true);
    }
  };

  return (
    <Modal
      show={true}
      isLoading={loading}
      disableCloseBtn
      title='Sign in to your account'
      submit={{
        onClick: onSubmit,
        disabled: submitIsDisabled
      }}
    >
      <SignInBody forwardRef={inputsRef} onChangeValue={onChangeInputValue} inputs={signinFieldsWithDefaultValues} />
    </Modal>
  );
};

export default Signin;
