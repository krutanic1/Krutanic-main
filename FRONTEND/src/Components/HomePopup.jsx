import React from 'react';
import { Link } from 'react-router-dom';

const HomePopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
            <div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center relative border-4 border-orange-500 transform scale-100 transition-transform duration-300"
                style={{ animation: 'bounceIn 0.5s ease-out' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors focus:outline-none"
                    aria-label="Close popup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-4 flex justify-center">
                    <div className="bg-orange-100 p-4 rounded-full">
                        <span className="text-5xl">🎁</span>
                    </div>
                </div>

                <h2 className="text-2xl font-extrabold mb-2 text-gray-800 tracking-tight">Don't Miss Out!</h2>

                <p className="text-lg text-gray-600 mb-6 font-medium leading-normal">
                    Join the event for <span className="text-orange-600 font-bold">FREE</span> and win exciting gifts!
                </p>

                <Link
                    to="/events"
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-300 text-lg uppercase tracking-wide"
                    onClick={onClose}
                >
                    Join Now
                </Link>

                <p className="mt-4 text-xs text-gray-400">Limited time offer. Terms and conditions apply.</p>
            </div>

            <style jsx>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default HomePopup;
