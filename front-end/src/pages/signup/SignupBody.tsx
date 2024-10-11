import React, { RefObject } from 'react';
import FieldInput from 'components/FieldInput';
import { ValidationCallback } from './types';

interface SignupBodyProps {
  inputs: any[];
  onChangeValue: (key: string) => (val: React.ChangeEvent<HTMLInputElement>) => void;
  forwardRef: RefObject<Record<string, ValidationCallback>>;
}

const SignupBody: React.FC<SignupBodyProps> = ({ onChangeValue, inputs, forwardRef }) => (
  <div className='isolate bg-white px-6 py-24 sm:py-32 lg:px-8'>
    <div className='mx-auto max-w-2xl text-center'>
      <p className='mt-2 text-base leading-8 text-gray-600'>Please fill the form below</p>
    </div>
    <form action='#' method='POST' className='mx-auto mt-16 max-w-xl sm:mt-20'>
      <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
        <div>
          {inputs.map(field => (
            <FieldInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              onChange={onChangeValue(field.id)}
              validation={field.validation}
              errorMsg={field.errorMsg}
              ref={forwardRef}
            />
          ))}
        </div>
      </div>
    </form>
  </div>
);

export default SignupBody;
