import React, { PropsWithChildren } from 'react';
import { noop } from 'lodash';

type UploadToS3 = (url: string, file: File) => any;
type S3ProviderProps = {
  uploadToS3: UploadToS3;
};
export const S3Provider = React.createContext<S3ProviderProps>({
  uploadToS3: noop
});

export default function S3ContextProvider({ children }: PropsWithChildren) {
  const uploadToS3 = React.useCallback<UploadToS3>(async (url, file) => {
    const imageUrl = url.split('?')[0];

    await fetch(url, {
      method: 'PUT',
      body: file
    });

    return imageUrl;
  }, []);

  const value = React.useMemo(
    () => ({
      uploadToS3
    }),
    []
  );

  return <S3Provider.Provider value={value}>{children}</S3Provider.Provider>;
}
