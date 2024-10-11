import toast from 'react-hot-toast';

export function showToastError(msg: string) {
  toast.error(msg, {
    position: 'top-right'
  });
}
