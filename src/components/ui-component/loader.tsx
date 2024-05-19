import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
    </div>
  );
}

export default Loader