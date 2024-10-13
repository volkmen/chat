import React, { RefObject } from 'react';
import FieldInput from 'components/FieldInput';
import { signinInputs } from './consts';
import { SigninInputModel, ValidationCallback } from './types';

interface SignInBodyProps {
  inputs: SigninInputModel[];
  onChangeValue: (key: string) => (val: React.ChangeEvent<HTMLInputElement>) => void;
  forwardRef: RefObject<Record<string, ValidationCallback>>;
}

const SignInBody: React.FC<SignInBodyProps> = ({ onChangeValue, forwardRef }) => (
  <div className='isolate bg-white px-6  lg:px-8 flex-col justify-center flex'>
    <div className='mx-auto max-w-2xl text-center'>
      <p className='text-base leading-8 text-gray-600'>Please fill the form below</p>
    </div>
    <div>
      {signinInputs.map(field => (
        <FieldInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          onChange={onChangeValue(field.id)}
          validation={field.validation}
          errorMsg={field.errorMsg}
          defaultValue={field.defaultValue}
          ref={forwardRef}
        />
      ))}
    </div>
  </div>
);

export default SignInBody;
