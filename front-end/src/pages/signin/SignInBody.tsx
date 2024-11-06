import React, { RefObject } from 'react';
import FieldInput from 'components/FieldInput';
import { signinInputs } from './consts';
import { SigninInputModel, ValidationCallback } from './types';
import { Link } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';

interface SignInBodyProps {
  inputs: SigninInputModel[];
  onChangeValue: (key: string) => (val: React.ChangeEvent<HTMLInputElement>) => void;
  forwardRef: RefObject<Record<string, ValidationCallback>>;
}

const SignInBody: React.FC<SignInBodyProps> = ({ onChangeValue, forwardRef }) => (
  <div className='space-y-4 md:space-y-6'>
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
    <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
      Don’t have an account yet?{' '}
      <Link to={PageRoutes.SignUp}>
        <span className='font-medium text-primary-600 text-blue-900 uppercase hover:underline dark:text-primary-500'>
          sign up
        </span>
      </Link>
    </p>
  </div>
);

export default SignInBody;
