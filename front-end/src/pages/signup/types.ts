export type ValidationCallback = () => boolean;

export type SignupInputModel = {
  type: string;
  label: string;
  placeholder: string;
  id: string;
  validation: (val: string) => boolean;
  errorMsg: string;
  defaultValue?: string;
};
