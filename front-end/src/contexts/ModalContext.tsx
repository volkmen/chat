import React, { PropsWithChildren } from 'react';
import { noop } from 'lodash';

const ModalContext = React.createContext({
  openModal: noop,
  closeModal: noop
});

export const ModalContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [modal, setModal] = React.useState<React.ReactNode | null>(null);

  const openModal = React.useCallback((newModal: React.ReactNode) => {
    setModal(() => newModal);
  }, []);

  const value = React.useMemo(
    () => ({
      openModal,
      closeModal: () => setModal(null)
    }),
    []
  );

  return (
    <ModalContext.Provider value={value}>
      {typeof modal === 'function' ? React.cloneElement(modal) : null}
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => React.useContext(ModalContext);
