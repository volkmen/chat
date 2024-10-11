import React from 'react';
import Modal from 'components/Modal';
import { noop } from 'lodash';
import SignupBody from './SignupBody';

const fields: any[] = [
  {
    type: 'text',
    label: 'First name',
    placeholder: 'First name',
    id: 'firstName',
    validation: (val: string) => val.length < 4,
    errorMsg: 'Name should be more than 3 symbols'
  },
  {
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    id: 'password',
    validation: (val: string) => val.length < 8,
    errorMsg: 'Password should be not less than 8 symbols'
  },
  {
    type: 'email',
    label: 'Email',
    placeholder: 'Email',
    id: 'email',
    validation: (val: string) => !Boolean(val.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)),
    errorMsg: 'Incorrect email address'
  }
];

const SignUp = () => {
  const [inputsMap, setInputsMap] = React.useState<Record<string, string>>({});
  const inputsRef = React.useRef<Record<string, any>>({});

  React.useEffect(() => {
    setInputsMap(
      fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = '';

        return acc;
      }, {})
    );
  }, []);

  const onChangeInputValue = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputsMap({ ...inputsMap, [key]: event.target.value });
  };

  const a = 10;

  const onSubmit = () => {
    const validationsResult = Object.values(inputsRef.current).map(valiationCb => valiationCb());

    console.log(inputsRef.current, validationsResult);
    if (validationsResult.every(Boolean)) {
      console.log('submit', validationsResult);
    } else {
      console.log('error', validationsResult);
    }
  };

  return (
    <Modal isOpen={true} onClose={noop} onSubmit={onSubmit} title='SIGN UP'>
      <SignupBody forwardRef={inputsRef} onChangeValue={onChangeInputValue} inputs={fields} />
    </Modal>
  );
};

export default SignUp;
