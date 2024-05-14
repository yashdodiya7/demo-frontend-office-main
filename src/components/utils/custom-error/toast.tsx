import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


export const ToastError = (error: string) => {
    
  return (
    <>
        {toast.error(error, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            })
        }
    </>
  )
}

export const ToastSuccess = (message: string) => {
    
    return (
      <>
          {toast.success(message, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              })
          }
      </>
    )
  }