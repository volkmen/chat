import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { Button, Modal, ModalProps as FlowbiteModalProps, Spinner } from 'flowbite-react';
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

const Modalv2: React.FC<Modalv2Props> = ({
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
  <Modal size='lg' show {...modalProps}>
    <section className='dark:bg-gray-900'>
      <Modal.Header className={classNames(disableCloseBtn && 'modal-disabled-close-btn', isLoading && 'opacity-10')}>
        <h1 className='text-xlleading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>{title}</h1>
      </Modal.Header>
      {getWrappedBody(
        Boolean(isForm),
        <div className={classNames(isLoading && 'opacity-10')}>
          <Modal.Body className='space-y-4 md:space-y-6'>{children}</Modal.Body>
          <Modal.Footer className='flex justify-end'>
            {cancel && (
              <Button color='light' {...omit(cancel, 'name')}>
                {cancel.name || 'Cancel'}
              </Button>
            )}
            <Button type='submit' onClick={submit.onSubmit} {...omit(submit, 'name')}>
              {submit.name || 'Submit'}
            </Button>
          </Modal.Footer>
        </div>
      )}
      {isLoading && (
        <div className='absolute-centered w-100'>
          <Spinner size='lg' />
        </div>
      )}
    </section>
  </Modal>
);

export default Modalv2;
