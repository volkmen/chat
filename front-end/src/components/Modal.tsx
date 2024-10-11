import React, { PropsWithChildren } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: React.ReactNode;
  cancelBtn?: React.ReactNode;
  submitBtn?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  cancelBtn,
  submitBtn = 'Submit'
}) => (
  <Dialog open={isOpen} onClose={onClose} className='relative z-10'>
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
            <div className='bg-gray-50 px-10 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              {cancelBtn && (
                <button
                  type='button'
                  onClick={onClose}
                  className='inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-200 sm:ml-3 sm:w-auto border'
                >
                  Cancel
                </button>
              )}
              <button
                type='button'
                data-autofocus
                onClick={onSubmit}
                className='mt-3 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-500 sm:mt-0 sm:w-auto'
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
