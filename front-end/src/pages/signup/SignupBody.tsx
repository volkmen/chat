import React, { RefObject } from 'react';
import FieldInput from 'components/FieldInput';
import { SignupInputModel, ValidationCallback } from './types';

interface SignupBodyProps {
  inputs: SignupInputModel[];
  onChangeValue: (key: string) => (val: React.ChangeEvent<HTMLInputElement>) => void;
  forwardRef: RefObject<Record<string, ValidationCallback>>;
}

const SignupBody: React.FC<SignupBodyProps> = ({ onChangeValue, inputs, forwardRef }) => (
  <div className='space-y-4 md:space-y-6'>
    <p className='text-sm font-light text-gray-500 dark:text-gray-400'>Please fill the form below</p>
    {inputs.map(field => (
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
        wrapperStyle={{ marginTop: '0.5rem' }}
      />
    ))}
  </div>
);

export default SignupBody;
