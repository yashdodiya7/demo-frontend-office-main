"use client";

import React from "react";

const ErrorCard = ({ message }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg w-1/2 h-1/2">
        <div className="bg-red-100 text-center text-red-700 px-4 py-3 rounded-t-lg">
          <strong className="font-bold">Error!</strong>
        </div>
        <div className="px-4 py-3 text-center flex justify-center items-center h-full w-full">
          <span className="block sm:inline font-semibold">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
