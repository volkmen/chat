import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { Button, Modal as ModalFlowbite, ModalProps as FlowbiteModalProps, Spinner } from 'flowbite-react';
import classNames from 'classnames';
import { preventDefault } from 'utils/events';
import { omit } from 'lodash';

interface Modalv2Props extends PropsWithChildren {
  disableCloseBtn?: boolean;
  show?: boolean;
  title: React.ReactNode;
  isForm?: boolean;
  submit: HTMLAttributes<HTMLButtonElement> & { disabled?: boolean; name?: React.ReactNode };
  cancel?: HTMLAttributes<HTMLButtonElement> & { disabled?: boolean; name?: React.ReactNode };
  modalProps?: FlowbiteModalProps;
  isLoading?: boolean;
}

const getWrappedBody = (isForm: boolean, children: React.ReactNode) =>
  isForm ? (
    <form action='#' onSubmit={preventDefault}>
      {children}
    </form>
  ) : (
    children
  );

const Modal: React.FC<Modalv2Props> = ({
  title,
  children,
  disableCloseBtn = false,
  isForm = false,
  modalProps = {},
  submit,
  cancel,
  show,
  isLoading
}) => (
  <ModalFlowbite size='lg' show {...modalProps}>
    <section className='dark:bg-gray-900'>
      <ModalFlowbite.Header
        className={classNames(disableCloseBtn && 'modal-disabled-close-btn', isLoading && 'opacity-10')}
      >
        <h1 className='text-xlleading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>{title}</h1>
      </ModalFlowbite.Header>
      {getWrappedBody(
        Boolean(isForm),
        <div className={classNames(isLoading && 'opacity-10')}>
          <ModalFlowbite.Body className='space-y-4 md:space-y-6'>{children}</ModalFlowbite.Body>
          <ModalFlowbite.Footer className='flex justify-end'>
            {cancel && (
              <Button color='light' {...omit(cancel, 'name')}>
                {cancel.name || 'Cancel'}
              </Button>
            )}
            <Button type='submit' onClick={submit.onSubmit} {...omit(submit, 'name')}>
              {submit.name || 'Submit'}
            </Button>
          </ModalFlowbite.Footer>
        </div>
      )}
      {isLoading && (
        <div className='absolute-centered w-100'>
          <Spinner size='lg' />
        </div>
      )}
    </section>
  </ModalFlowbite>
);

export default Modal;
