import React, { PropsWithChildren } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import classNames from 'classnames';
import { noop } from 'lodash';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: () => void;
  title: React.ReactNode;
  cancelBtn?: React.ReactNode;
  submitBtn?: React.ReactNode;
  submitIsDisabled?: boolean;
  isForm?: boolean;
}

const preventDefault = (e: React.FormEvent) => e.preventDefault();

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  cancelBtn,
  submitBtn = 'Submit',
  submitIsDisabled = false
}) => (
  <Dialog open={isOpen} onClose={onClose || noop} className='relative z-10'>
    <DialogBackdrop
      transition
      className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
    />
    <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
      <div className='md:flex md:min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0 h-full'>
        <DialogPanel
          transition
          className='d-flex md:d-block h-full md:h-auto content-center relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
        >
          <div>
            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full'>
                  <DialogTitle as='h3' className='text-xl text-center font-semibold leading-8 text-gray-600'>
                    {title}
                  </DialogTitle>
                  <div className='mt-2'>{children}</div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-10 py-3 sm:flex sm:flex-row justify-end sm:px-6'>
              {cancelBtn && (
                <button
                  type='button'
                  onClick={onClose}
                  className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                >
                  Cancel
                </button>
              )}
              <button
                disabled={submitIsDisabled}
                type='submit'
                data-autofocus
                onClick={onSubmit}
                className={classNames(
                  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800',
                  submitIsDisabled ? 'pointer-events-none opacity-50' : null
                )}
              >
                {submitBtn}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export default Modal;
