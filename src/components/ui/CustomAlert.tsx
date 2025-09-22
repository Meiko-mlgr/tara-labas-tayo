import React from 'react';

type CustomAlertProps = {
  show: boolean;
  message: string;
  onClose: () => void;
};

export default function CustomAlert({ show, message, onClose }: CustomAlertProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">Hey there!</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        <button
          onClick={onClose}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-md transition-colors w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}