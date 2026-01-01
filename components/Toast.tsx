
import React, { useState, useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
    toast: ToastMessage | null;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toast }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000); 
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [toast]);

    const bgColor = toast?.type === 'info' ? 'bg-sky-500' : 'bg-red-500';

    return (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
            {toast && (
                <div className={`${bgColor} text-white font-semibold py-2 px-6 rounded-full shadow-lg`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};
