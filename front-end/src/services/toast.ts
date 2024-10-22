import toast from 'react-hot-toast';

export function showToastError(msg: string) {
  toast.error(msg, {
    position: 'top-right'
  });
}

export function showToastSuccess(msg: string) {
  toast.success(msg, {
    position: 'top-right'
  });
}
