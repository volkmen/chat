import React, { ChangeEventHandler } from 'react';
import { IoIosAttach } from 'react-icons/io';
import { useLazyQuery } from '@apollo/client';
import { GET_S3_PUT_OBJECT_URL } from 'api/messages';
import { S3Provider } from 'contexts/S3Provider';
import { NewMessageContext } from 'contexts/NewMessage';
import { v4 as uuidv4 } from 'uuid';

const AttachFile = () => {
  const { onFailedUpload, onSuccessUpload, onAddUpload } = React.useContext(NewMessageContext);

  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const { uploadToS3 } = React.useContext(S3Provider);

  const [fetchUrl] = useLazyQuery(GET_S3_PUT_OBJECT_URL);

  const onClick = () => {
    const event = new MouseEvent('click');

    fileRef.current?.dispatchEvent(event);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = async () => {
    // const fileType = fileRef.current?.files[0].type;

    Array.prototype.forEach.call(fileRef.current?.files, async function (file) {
      const blobUrl = URL.createObjectURL(file);
      const id = uuidv4();

      onAddUpload({
        id,
        url: blobUrl,
        fullUrl: blobUrl,
        fileName: file.name,
        size: file.size,
        contentType: file.type,
        loading: true
      });

      const response = await fetchUrl({
        variables: {
          contentType: file.type
        }
      });
      const fullUrl = response.data.GetS3PutObjectUrl;

      await uploadToS3(fullUrl, file)
        .then(() => {
          onSuccessUpload(id);
        })
        .catch(() => {
          onFailedUpload(id);
        });
    });
  };

  return (
    <>
      <IoIosAttach
        className='fill-cyan-600 cursor-pointer hover:fill-amber-700 hover:scale-110 transition-all'
        size={24}
        onClick={onClick}
      />
      <input accept='image/*' type='file' className='hidden' ref={fileRef} onChange={onChange} />
    </>
  );
};

export default AttachFile;
