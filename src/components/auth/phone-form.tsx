"use client"

import { otpVerifySchema , phoneVerifySchema } from '@/schemas/UserSchema'
import { otpVerify, phoneVerify, setOtpSessionId, setPhoneNumber } from '@/store/slice/authSlice'
import { useFormik } from 'formik'
import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import Link from 'next/link'
import Logo from '../navbar/Logo'
import { ToastError } from '../utils/custom-error/toast'


const PhoneNumberField = () => {

    const router = useRouter()
    const dispatch = useDispatch()    
    const state = useSelector((state: any) => state.user)
    const [timer, setTimer] = useState(30);
    
    const handlePhoneSubmit = async (val: any) => {
        try {
            // setDisableResend(false);
            val.phone_number = "+91" + val.phone_number
            console.log("<<<" ,val.phone_number)
            // startTimer();
            const response = await dispatch(phoneVerify(val))
            console.log(response.payload);
            
            if (response.payload.session_token) {
                // console.log(response.payload, "In if condition");
                await dispatch(setPhoneNumber({ phone_no: val.phone_number }));
            }
        }
        catch (error) {
            throw error
        }
    }

    const handleOtpSubmit = async ( val: any) => {
        // val.phone_no = state.phone_no
        val.session_token = state.otp_session_id
        val.phone_number = state.phone_no

        console.log("<<<", state.phone_no)
        console.log("<<<", val.phone_number)
        try {
            // console.log(val);
            const response = await dispatch(otpVerify(val))
            // console.log(response.payload);
            
            if (response.payload.security_code) {
                // console.log(response.payload, "In if condition");
                // await dispatch(setPhoneNumber({ phone_no: val.phone_no }));
                dispatch(setOtpSessionId());
                router.push('/auth/register')
            }
        }
        catch (error) {
            throw error
        }
    }

    const phoneFormik = useFormik({
        initialValues: {
            phone_number: '',
        },
        validationSchema: phoneVerifySchema,
        onSubmit: handlePhoneSubmit,
    })

    const otpFormik = useFormik({
        initialValues: {
            security_code: '',
        },
        validationSchema: otpVerifySchema,
        onSubmit: handleOtpSubmit,
    })

    const startTimer = () => {
        let timeLeft = timer;
        const interval = setInterval(() => {
            timeLeft--;
            setTimer(timeLeft);
            if (timeLeft === 0) {
                clearInterval(interval);
                // setDisableResend(true);
                setTimer(30);
            }
        }, 1000);
    };

    const handleResend = async () => {
        // Implement resend logic here
        // For demonstration, let's reset the timer
        // setDisableResend(true);
        startTimer();
        // You may dispatch a phoneVerify action here to resend OTP
    };

  return (
    <section>
        <ToastContainer/>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className='grid place-items-center mb-6'>
                        <Logo />
                    </div>
                    <h2 className="text-start text-2xl font-bold leading-tight text-black">
                        Enter Your Contact No for Verification
                    </h2>
                    <p className="mt-4 text-base text-gray-600">
                        Already have an account?{' '}
                        <Link href='/auth/login' className="font-semibold text-black transition-all duration-200 hover:underline">Sign In</Link>
                    </p>
                    <form method="POST" onSubmit={phoneFormik.handleSubmit} className="mt-8">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="phone_number" className="text-base font-medium text-gray-900">
                                    {' '}
                                    Phone No{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone_number"
                                        name='phone_number'
                                        value={phoneFormik.values.phone_number}
                                        onChange={phoneFormik.handleChange}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="6353355965"
                                    ></input>
                                    {phoneFormik.touched.phone_number && phoneFormik.errors.phone_number && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            <span className='font-medium'>{phoneFormik.errors.phone_number}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-800"
                                >
                                    Send Otp
                                </button>
                            </div>
                            {/* <div>
                                <button
                                    onClick={handleResend}
                                    disabled={!disableResend}
                                    className={`inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white ${
                                        disableResend ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                    }`}
                                >
                                    Resend OTP {disableResend ? '' : `(${timer}s)`}
                                </button>
                            </div> */}
                        </div>
                    </form>
                    <form method="POST" onSubmit={otpFormik.handleSubmit} className="mt-8">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="security_code" className="text-base font-medium text-gray-900">
                                    {' '}
                                    Verify OTP{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id='security_code'
                                        name='security_code'
                                        value={otpFormik.values.security_code}
                                        onChange={otpFormik.handleChange}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="123456"
                                    ></input>
                                    {otpFormik.touched.security_code && otpFormik.errors.security_code && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            <span className='font-medium'>{otpFormik.errors.security_code}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-800"
                                >
                                    Verify <ArrowRight className="ml-2" size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    </section>
  )
}

export default PhoneNumberField