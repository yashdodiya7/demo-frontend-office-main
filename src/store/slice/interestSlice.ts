const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { default: axios } = require("axios");
import { ToastError, ToastSuccess } from "@/components/utils/custom-error/toast";
import { getCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const token = getCookie('token');

export const interestedUserProfile = createAsyncThunk(
  "interestedUserProfile",
  async (id: number) => {
    try {
      const interestedUserProfile = await axios.get(
        `${BASE_URL}/listing/interesteduserprofile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return interestedUserProfile.data;
    } catch (error: any) {
      throw error.response;
    }
  }
);

export const fetchInterestedUsers = createAsyncThunk(
  "fetchInterestedUsers",
  async () => {
    try {
      const fetchInterestedUsers = await axios.get(
        `${BASE_URL}/listing/interestedusers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return fetchInterestedUsers.data;
    } catch (error: any) {
      throw error.response;
    }
  }
);

export const makeDeal = createAsyncThunk(
  "makeDeal",
  async ({ listingId, userId }: { listingId: number; userId: number }) => {
    try {
      const makeDeal = await axios.post(
        `${BASE_URL}/listing/make-deal`,
        { listingId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return makeDeal.data;
    } catch (error: any) {
      throw error.response;
    }
  }
);


export const handleInterestedButton = createAsyncThunk(
  "handleInterestedButton",
  async (id: number) => {
    try {
      const handleInterestedButton = await axios.post(
        `${BASE_URL}/listing/listings/${id}/interested`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastSuccess("Successfully Interested");
      return handleInterestedButton.data;
    } catch (error: any) {
      ToastError(error?.response?.data?.error);
      throw error.response;
    }
  }
);

export const fetchMyInterestedListings = createAsyncThunk(
  "fetchMyInterestedListings",
  async () => {
    try {
      const fetchMyInterestedListings = await axios.get(
        `${BASE_URL}/listing/interested`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return fetchMyInterestedListings.data;
    } catch (error: any) {
      throw error.response;
    }
  }
);

export const handlePaymentInterestedListing = createAsyncThunk(
  "handlePaymentInterestedListing",
  async (listingId: any) => {
    try {
      const handlePaymentInterestedListing = await axios.post(
        `${BASE_URL}/payment/wallet-add/`,
        { listing_id: listingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return handlePaymentInterestedListing.data;
    } catch (error: any) {
      throw error.response;
    }
  }
);


const initialState = {
  interestedUserProfile: {},
  interstedUsers: [],
};

const interestSlice = createSlice({
  name: "interest",
  initialState,
  reducers: {
    logoutInterest: (state: any) => {
      state.interestedUserProfile = null
      state.interstedUsers = null
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(interestedUserProfile.pending, (state: any) => {})
      .addCase(interestedUserProfile.fulfilled, (state: any, action: any) => {
        state.interestedUserProfile = action?.payload;
      })
      .addCase(interestedUserProfile.rejected, (state: any) => {})
      .addCase(fetchInterestedUsers.pending, (state: any) => {})
      .addCase(fetchInterestedUsers.fulfilled, (state: any, action: any) => {
        state.interstedUsers = [...action?.payload];
      })
      .addCase(fetchInterestedUsers.rejected, (state: any) => {})
      .addCase(makeDeal.pending, (state: any) => {})
      .addCase(makeDeal.fulfilled, (state: any, action: any) => {})
      .addCase(makeDeal.rejected, (state: any) => {})
      .addCase(handleInterestedButton.pending, (state: any) => {})
      .addCase(handleInterestedButton.fulfilled, (state: any, action: any) => {})
      .addCase(handleInterestedButton.rejected, (state: any) => {})
      .addCase(fetchMyInterestedListings.pending, (state: any) => {})
      .addCase(fetchMyInterestedListings.fulfilled, (state: any, action: any) => {})
      .addCase(fetchMyInterestedListings.rejected, (state: any) => {})
  },
});


export const { logoutInterest } = interestSlice.actions;
export default interestSlice.reducer;