import Swal from 'sweetalert2';

export const alertError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
};
