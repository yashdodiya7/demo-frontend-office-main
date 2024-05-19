const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { default: axios } = require("axios");
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
    async ({listingId, userId}: {listingId: number, userId: number}) => {
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

const initialState = {
  interestedUserProfile: {},
  interstedUsers: [],
};

const interestSlice = createSlice({
  name: "interest",
  initialState,
  reducers: {},
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
      .addCase(makeDeal.rejected, (state: any) => {});
  },
});

export default interestSlice.reducer;