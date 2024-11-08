export enum FieldIds {
  email = 'email',
  username = 'username',
  password = 'password'
}

export const signupFields = [
  {
    type: 'email',
    label: 'Email',
    placeholder: 'Email',
    id: FieldIds.email,
    validation: (val: string) => !Boolean(val.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)),
    errorMsg: 'Incorrect email address'
  },
  {
    type: 'password',
    label: 'Password',
    placeholder: 'Password',
    id: FieldIds.password,
    validation: (val: string) => val.length < 8,
    errorMsg: 'Password should be not less than 8 symbols'
  },
  {
    type: 'text',
    label: 'First name',
    placeholder: 'First name',
    id: FieldIds.username,
    validation: (val: string) => val.length < 2,
    errorMsg: 'Name should be 3 or more symbols'
  }
];
