import React, { PropsWithChildren } from 'react';
import { noop } from 'lodash';

const ModalContext = React.createContext({
  openModal: noop,
  closeModal: noop
});

export const ModalContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [modal, setModal] = React.useState<any>(null);

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

  console.log(modal);

  return (
    <ModalContext.Provider value={value}>
      {modal && React.cloneElement(modal)}
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => React.useContext(ModalContext);
