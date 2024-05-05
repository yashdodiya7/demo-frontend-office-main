const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
const { default: axios } = require('axios')
import {ToastError, ToastSuccess} from '@/components/utils/custom-error/toast'
import { UserState } from '@/types/user'
import { RootState } from '@reduxjs/toolkit/query'
import { deleteCookie, setCookie } from 'cookies-next'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const PHONE_VERIFY = process.env.NEXT_PUBLIC_PHONE_VERIFY
const OTP_VERIFY = process.env.NEXT_PUBLIC_OTP_VERIFY


export const phoneVerify = createAsyncThunk(
    'phoneVerify',
    async (val: Object) => {
        try {
            const otpSent = await axios.post(`${BASE_URL}/verify/phone/register`, val)
            // const otpSent = await axios.get(`${PHONE_VERIFY}/+91${val.phone_no}/AUTOGEN3/`)
            // const otpSent = await axios.post(`${BASE_URL}/user/phone-verify`, val)
            console.log("<<<",otpSent.data);
            ToastSuccess("OTP Sent successfully")
            return otpSent.data
        } catch (error: any) {
            console.log(error.response.data.message);
            ToastError(error.response.data?.message)
            throw error.response.data.message
        }
    }
)

export const otpVerify = createAsyncThunk(
    'otpVerify',
    async (val: any) => {
        try {
            const otpVerify = await axios.post(`${BASE_URL}/verify/phone/verify_and_register`, val)
            // console.log(otpVerify.data);
            // ToastSuccess(createUser.data.message)
            ToastSuccess("OTP Verified")
            return otpVerify.data
        } catch (error: any) {
            ToastError(error.response?.data?.error)
            throw error.response
        }
    }
)


export const userRegister = createAsyncThunk(
    'userRegister',
    async (val: object) => {
        try {
            const createUser = await axios.post(`${BASE_URL}/user/register`, val)
            // ToastSuccess(createUser.data.message)
            return createUser.data
        } catch (error: any) {
            console.log(error.response.data?.email[0]);
            // ToastError(error.response.data.message)
            ToastError(error.response.data?.email[0])
            throw error.response.data?.email[0]
        }
    }
)


export const userPreference = createAsyncThunk(
    'userPreference',
    async ({userToken , val} : any) => {
        // console.log("userToken", userToken);
        // console.log("val", val);
        
        try {
            const createUserPreference = await axios.post(`${BASE_URL}/user/userchoice`,
                val,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            console.log(createUserPreference.data);
            
            // ToastSuccess(createUser.data.message)
            return createUserPreference.data
        } catch (error: any) {
            console.log(error.response);
            // ToastError(error.response.data.message)
            throw error.response
        }
    }
)


export const updateUserPreference = createAsyncThunk(
    'updateUserPreference',
    async ({userToken , val} : any) => {

        try {
            const updateUserPreference = await axios.patch(`${BASE_URL}/user/userchoice`,
                val,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            ToastSuccess(updateUserPreference.data.message)
            return updateUserPreference.data
        } catch (error: any) {
            // console.log(error.response);
            ToastError(error.response.data.message)
            throw error.response
        }
    }
)



export const userLogin = createAsyncThunk('userLogin', async (val: object) => {
    try {
        const existingUser = await axios.post(`${BASE_URL}/user/login`, val)
        const data = await existingUser.data
        // ToastSuccess(data.message)
        return data
    } catch (error: any) {

        console.log(error.response.data.errors);

        // ToastError(error.response.data.message)
        throw error.response.data.errors
    }
})


export const getUserProfile = createAsyncThunk(
    'getUser',
    async (userToken: string) => {
        try {
            const existingUser = await axios.get(`${BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            // localStorage.setItem('userData', JSON.stringify(existingUser.data.data))
            const data = await existingUser.data
            
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)

export const getUserPrefernce = createAsyncThunk(
    'getUserPrefernce',
    async (userToken: string) => {
        try {
            const existingUser = await axios.get(`${BASE_URL}/user/userchoice`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            const data = await existingUser.data
            return data
        } catch (error: any) {
            ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)


interface UserUpdateData {
    userToken: string
    updatedata: object
}

export const updateUserProfile = createAsyncThunk(
    'updateUserProfile',
    async ({ userToken, updatedata }: UserUpdateData) => {
        // console.log(userToken, "userToken")
        // console.log(updatedata, "updatedata")
        try {
            const existingUser = await axios.patch(
                `${BASE_URL}/user/profile`,
                updatedata,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            )
            const data = await existingUser.data

            ToastSuccess("Profile Updated Successfully")
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)

const initialState: UserState = {
    token: [],
    userDetails: {},
    phone_no: '',
    otp_session_id: '',
    error: null,
    userProfile: {},
    userPreferences: {},
}


const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state: any) => {
            state.token = null
            state.user = null
            state.userProfile = null
            state.phone_no = null
            state.userPreferences = null
            deleteCookie('token')
        },
        setUserData: (state: any, action: any) => {
            state.userProfile = {...state.userProfile, ...action?.payload}
        },
        setPhoneNumber: (state:any, action:any) => {            
            const { phone_no } = action.payload; // Extract phone number from payload
            state.phone_no = phone_no; // Update state with the new phone number
        },
        setOtpSessionId: (state:any) => {
            state.otp_session_id = '';
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(phoneVerify.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(phoneVerify.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
                console.log("<<<",action.payload.session_token);
                state.otp_session_id = action.payload.session_token
            })
            .addCase(phoneVerify.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(otpVerify.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(otpVerify.fulfilled, (state: any) => {
                state.status = 'succeeded'
            })
            .addCase(otpVerify.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(userRegister.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(userRegister.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
                state.token = action.payload.tokens?.access
                state.userProfile = {...action?.payload?.data}
                setCookie('token', action.payload.tokens?.access)
            })
            .addCase(userRegister.rejected, (state: any, action: any) => {
                state.status = 'failed'
                // console.log(action);
            })
            .addCase(userPreference.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(userPreference.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
            })
            .addCase(userPreference.rejected, (state: any, action: any) => {
                state.status = 'failed'
                // state.error = action.error.message
            })
            .addCase(userLogin.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(userLogin.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
                state.userProfile = {...action?.payload?.data}
                state.token = action.payload.tokens?.access
                setCookie('token', action.payload.tokens?.access)
            })
            .addCase(userLogin.rejected, (state: any, action: any) => {
                state.status = 'failed'
                state.error = action.error
            })
            .addCase(getUserProfile.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(getUserProfile.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
                // console.log(action.payload);
                state.userProfile = { ...action.payload }
            })
            .addCase(getUserProfile.rejected, (state: any, action: any) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(updateUserProfile.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(updateUserProfile.fulfilled, (state: any, action: any) => {
                state.status = 'succeeded'
                // console.log(action.payload);
                state.userProfile = { ...action.payload }
                // state.user = action.payload.data
            })
            .addCase(updateUserProfile.rejected, (state: any, action: any) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(getUserPrefernce.pending, (state: any, action: any) => {
                state.status = 'loading'
            })
            .addCase(getUserPrefernce.fulfilled, (state: any, action: any) => {
                state.status = 'success'
                state.userPreferences = action.payload
            })
            .addCase(getUserPrefernce.rejected, (state: any, action: any) => {
                state.status = 'failed'
            })
            .addCase(updateUserPreference.pending, (state: any, action: any) => {
                state.status = 'loading'
            })
            .addCase(updateUserPreference.fulfilled, (state: any, action: any) => {
                state.status = 'success'
                state.userPreferences = action.payload.Data
            })
            .addCase(updateUserPreference.rejected, (state: any, action: any) => {
                state.status = 'failed'
            })
    },
})

export const { logout, setPhoneNumber, setOtpSessionId, setUserData } = authSlice.actions
export default authSlice.reducer