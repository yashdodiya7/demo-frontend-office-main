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


const PhoneNumberField = () => {

    const router = useRouter()
    const dispatch = useDispatch()    
    const state = useSelector((state: any) => state.user)
    
    const handlePhoneSubmit = async (val: any) => {
        try {
            // console.log(val);
            const response = await dispatch(phoneVerify(val))
            console.log(response.payload);
            
            if (response.payload.Status === "Success") {
                // console.log(response.payload, "In if condition");
                await dispatch(setPhoneNumber({ phone_no: val.phone_no }));
            }
        }
        catch (error) {
            throw error
        } finally {
        }
    }

    const handleOtpSubmit = async ( val: any) => {
        // val.phone_no = state.phone_no
        val.otp_session_id = state.otp_session_id
        try {
            // console.log(val);
            const response = await dispatch(otpVerify(val))
            // console.log(response.payload);
            
            if (response.payload.Status === "Success") {
                // console.log(response.payload, "In if condition");
                // await dispatch(setPhoneNumber({ phone_no: val.phone_no }));
                dispatch(setOtpSessionId());
                router.push('/auth/register')
            }
        }
        catch (error) {
            throw error
        } finally {
        }

    }

    const phoneFormik = useFormik({
        initialValues: {
            phone_no: '',
        },
        validationSchema: phoneVerifySchema,
        onSubmit: handlePhoneSubmit,
    })

    const otpFormik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: otpVerifySchema,
        onSubmit: handleOtpSubmit,
    })

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
                    <h3 className="text-red-600 text-md mt-3 font-semibold">
                        For verification otp you will recieve a call where OTP will be given to you
                    </h3>
                    <p className="mt-4 text-base text-gray-600">
                        Already have an account?{' '}
                        <Link href='/auth/login' className="font-semibold text-black transition-all duration-200 hover:underline">Sign In</Link>
                    </p>
                    <form method="POST" onSubmit={phoneFormik.handleSubmit} className="mt-8">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900">
                                    {' '}
                                    Phone No{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        name='phone_no'
                                        value={phoneFormik.values.phone_no}
                                        onChange={phoneFormik.handleChange}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="6353355965"
                                    ></input>
                                    {phoneFormik.touched.phone_no && phoneFormik.errors.phone_no && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            <span className='font-medium'>{phoneFormik.errors.phone_no}</span>
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
                        </div>
                    </form>
                    <form method="POST" onSubmit={otpFormik.handleSubmit} className="mt-8">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900">
                                    {' '}
                                    Verify OTP{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        name='otp'
                                        value={otpFormik.values.otp}
                                        onChange={otpFormik.handleChange}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="1234"
                                    ></input>
                                    {otpFormik.touched.otp && otpFormik.errors.otp && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            <span className='font-medium'>{otpFormik.errors.otp}</span>
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