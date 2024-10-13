export type ValidationCallback = () => boolean;

export type SigninInputModel = {
  type: string;
  label: string;
  placeholder: string;
  id: string;
  validation: (val: string) => boolean;
  errorMsg: string;
  defaultValue?: string;
};
