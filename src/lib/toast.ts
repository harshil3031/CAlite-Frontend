import toast from 'react-hot-toast';

export const toastSuccess = (message: string) => {
    toast.success(message, {
        position: 'top-right',
        duration: 4000,
    });
};

export const toastError = (message: string) => {
    toast.error(message, {
        position: 'top-right',
        duration: 4000,
    });
};

export const toastInfo = (message: string) => {
    toast(message, {
        position: 'top-right',
        duration: 4000,
        icon: 'ℹ️',
    });
};
