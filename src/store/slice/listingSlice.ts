const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
const { default: axios } = require('axios')
import { ToastError, ToastSuccess } from '@/components/utils/custom-error/toast'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createPost = createAsyncThunk(
    'createPost',
    async ({userToken ,updatedata}: any) => {
        
        try {
            const createPost = await axios.post(
                `${BASE_URL}/listing/create`,
                updatedata,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            )
            const data = await createPost.data
            ToastSuccess(data.message)
            return data
        } catch (error: any) {
            ToastError(error?.response?.data?.message)
            throw error?.response?.data
        }
    }
)

export const updatePost = createAsyncThunk(
    'updatePost',
    async ({userToken ,updatedata}: any) => {
        
        try {
            const updatePost = await axios.patch(
                `${BASE_URL}/listing/update`,
                updatedata,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            )
            const data = await updatePost.data
            ToastSuccess(data.message)
            return data
        } catch (error: any) {
            ToastError(error?.response?.data?.error)
            throw error?.response?.data
        }
    }
)

export const fetchListing = createAsyncThunk(
    'fetchListing',
    async ( {userToken, locationCoords} ) => {
        // console.log(userToken, "userToken")
        // console.log(updatedata, "updatedata")
        try {
            let headers = {}; // Initialize empty headers object
            if (userToken) {
                headers = {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                };
            }

            const createPost = await axios.post(
                `${BASE_URL}/listing/getlistings`,
                locationCoords,
                {
                    headers: headers,
                }
            )

            const data = await createPost.data
            // ToastSuccess(data.message)
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)

export const fetchSingleListing = createAsyncThunk(
    'fetchSingleListing',
    async ( {userToken ,id} ) => {

        try {
            
            let headers = {}; // Initialize empty headers object
            if (userToken) {
                headers = {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                };
            }

            const getSinglePost = await axios.get(
                `${BASE_URL}/listing/update/${id}`,
                {
                    headers: headers,
                }
            )
            const data = await getSinglePost.data
            
            // ToastSuccess(data.message)
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)

export const fetchSingleListingUserProfile = createAsyncThunk(
    'fetchSingleListingUserProfile',
    async ( {userToken ,id} ) => {
        try {
            
            let headers = {}; // Initialize empty headers object
            if (userToken) {
                headers = {
                    Authorization: `Bearer ${userToken}`,
                };
            }

            const getSinglePostUserProfile = await axios.get(
                `${BASE_URL}/listing/listuserprofile/${id}`,
                {
                    headers: headers,
                }
            )
            const data = await getSinglePostUserProfile.data
            
            // ToastSuccess(data.message)
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)

export const fetchUpdateListingData = createAsyncThunk(
    'fetchUpdateListingData',
    async ( userToken ) => {

        try {
            let headers = {}; // Initialize empty headers object
            if (userToken) {
                headers = {
                    Authorization: `Bearer ${userToken}`,
                };
            }

            const fetchUpdateListingData = await axios.get(
                `${BASE_URL}/listing/update`,
                {
                    headers: headers,
                }
            )
            const data = await fetchUpdateListingData.data
            
            // ToastSuccess(data.message)
            return data
        } catch (error: any) {
            // ToastError(error.response.data.message)
            throw error?.response?.data
        }
    }
)


const initialState = {
    listingData: [],
    listingUserProfile:[],
}

const listSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        setSearchData(state, action) {
            state.listingData = action.payload; // Set listing data from payload
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(createPost.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(createPost.fulfilled, (state: any, action: any) => {
                state.status = 'success'
            })
            .addCase(createPost.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(fetchListing.pending, (state: any, action: any) => {
                state.status = 'loading'
            })
            .addCase(fetchListing.fulfilled, (state: any, action: any) => {
                state.status = 'success'
                state.listingData = [...action.payload]
            })
            .addCase(fetchListing.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(fetchSingleListing.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(fetchSingleListing.fulfilled, (state: any) => {
                state.status = 'success'
            })
            .addCase(fetchSingleListing.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(fetchSingleListingUserProfile.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(fetchSingleListingUserProfile.fulfilled, (state: any) => {
                state.status = 'success'
            })
            .addCase(fetchSingleListingUserProfile.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(fetchUpdateListingData.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(fetchUpdateListingData.fulfilled, (state: any) => {
                state.status = 'success'
            })
            .addCase(fetchUpdateListingData.rejected, (state: any) => {
                state.status = 'failed'
            })
            .addCase(updatePost.pending, (state: any) => {
                state.status = 'loading'
            })
            .addCase(updatePost.fulfilled, (state: any) => {
                state.status = 'success'
            })
            .addCase(updatePost.rejected, (state: any) => {
                state.status = 'failed'
            })
    },
})

export const { setSearchData } = listSlice.actions
export default listSlice.reducer