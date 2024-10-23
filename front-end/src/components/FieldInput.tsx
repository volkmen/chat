import React, { forwardRef, type HTMLAttributes, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { Input as HeadlessInput, Field, Label } from '@headlessui/react';
import { isNil } from 'lodash';

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  id: string;
  label: React.ReactNode;
  type?: string;
  validation?: (val: string) => boolean;
  errorMsg?: string;
}

const FieldInput = forwardRef<Record<string, () => boolean>, InputProps>(
  ({ label, className, validation, id, errorMsg, ...htmlAttrs }, forwRef) => {
    const [error, setError] = React.useState<string | null>(null);
    const ref = React.useRef<HTMLInputElement>(null);

    useImperativeHandle(
      forwRef,
      () => ({
        //@ts-ignore
        ...forwRef?.current,
        [id]: () => checkValidation(ref.current?.value)
      }),
      []
    );

    const checkValidation = (value?: string) => {
      const isError = isNil(value) ? true : validation?.(value);

      if (errorMsg && isError) {
        setError(errorMsg);

        return false;
      }

      return true;
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      checkValidation(e.target.value);
      htmlAttrs.onBlur?.(e);
    };

    const onFocus = () => {
      setError(null);
    };

    return (
      <Field className='pb-5 mb-2.5 relative '>
        <Label htmlFor='first-name' className='block text-sm leading-6 text-gray-600 text-start'>
          {label}
        </Label>
        <div>
          <HeadlessInput
            {...htmlAttrs}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
            className={classNames(
              className,
              'block w-full rounded-md px-3.5 transition duration-100 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
              error ? 'border-1 border-rose-600' : 'border-0'
            )}
          />
          {error && <div className='text-red-600 text-xs absolute bottom-0'>{error}</div>}
        </div>
      </Field>
    );
  }
);

export default FieldInput;
