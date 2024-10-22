import { SigninInputModel } from './types';

export enum FieldIds {
  Email = 'email',
  Password = 'password'
}

export const signinInputs: SigninInputModel[] = [
  {
    type: 'text',
    label: 'Username',
    placeholder: 'username',
    id: FieldIds.Email,
    validation: (val: string) => val.length < 4,
    errorMsg: 'Name should be more than 3 symbols'
  },
  {
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    id: FieldIds.Password,
    validation: (val: string) => val.length < 8,
    errorMsg: 'Password should be not less than 8 symbols'
  }
];
