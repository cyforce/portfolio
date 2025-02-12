import React from 'react';

interface DisclaimerMsgConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
    msg: string;
}

const DisclaimerMsgConfirm = ({onConfirm, onCancel, msg}:DisclaimerMsgConfirmProps) => {
    return (
        <div className="fixed top-[3.45rem] left-0 w-screen h-[calc(100vh-3.45rem)] bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-4 text-white">Attention</h2>
                <p className="text-white text-center">{msg}</p>
                <div className="flex justify-evenly mt-4">
                    <button onClick={onCancel} className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-400">Annuler</button>
                    <button onClick={onConfirm} className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-400 mr-4">Continuer</button>
                </div>
            </div>
        </div>
    );
}

export default DisclaimerMsgConfirm;