import React from 'react'

const SubscriptionPopUp = ({ onClose, onLogin }: {onClose: () => void, onLogin: () => void}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white rounded-lg p-8">
            <p className="text-lg mb-4">Please Pay to view profiles.</p>
            <div className="flex justify-center">
                <button
                    onClick={onLogin}
                    className="bg-stone-700 text-white px-4 py-2 rounded-md mr-4 hover:bg-stone-800"
                >
                    Subscribe
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
  )
}

export default SubscriptionPopUp