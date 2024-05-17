const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { default: axios } = require("axios");
import {
  ToastError,
  ToastSuccess,
} from "@/components/utils/custom-error/toast";
import { ListingState } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createPost = createAsyncThunk(
  "createPost",
  async ({ userToken, updatedata }: {userToken: string, updatedata: Object}) => {
    try {
      const createPost = await axios.post(
        `${BASE_URL}/listing/create`,
        updatedata,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await createPost.data;
      ToastSuccess(data.message);
      return data;
    } catch (error: any) {
      ToastError(error?.response?.data?.message);
      throw error?.response?.data;
    }
  }
);

export const updatePost = createAsyncThunk(
  "updatePost",
  async ({ userToken, updatedata }: {userToken: string, updatedata: Object}) => {
    try {
      const updatePost = await axios.patch(
        `${BASE_URL}/listing/update`,
        updatedata,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await updatePost.data;
      ToastSuccess(data.message);
      return data;
    } catch (error: any) {
      ToastError(error?.response?.data?.message);
      throw error?.response?.data;
    }
  }
);

export const fetchListing = createAsyncThunk(
  "fetchListing",
  async ({
    userToken,
    locationCoords,
    page,
  }: {
    userToken: string;
    locationCoords: Object;
    page: number;
  }) => {
    try {
      let headers = {}; // Initialize empty headers object
      if (userToken) {
        headers = {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        };
      }

      const createPost = await axios.post(
        `${BASE_URL}/listing/getlistings?page=${page}`,
        locationCoords,
        {
          headers: headers,
        }
      );

      const data = await createPost.data;
      return data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
);

export const fetchSingleListing = createAsyncThunk(
  "fetchSingleListing",
  async ({ userToken, id }: { userToken: string; id: number }) => {
    try {
      let headers = {}; // Initialize empty headers object
      if (userToken) {
        headers = {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        };
      }

      const getSinglePost = await axios.get(
        `${BASE_URL}/listing/update/${id}`,
        {
          headers: headers,
        }
      );
      const data = await getSinglePost.data;

      return data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
);

export const fetchSingleListingUserProfile = createAsyncThunk(
  "fetchSingleListingUserProfile",
  async ({ userToken, id }: { userToken: string; id: number }) => {
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
      );
      const data = await getSinglePostUserProfile.data;

      return data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
);

export const fetchUpdateListingData = createAsyncThunk(
  "fetchUpdateListingData",
  async (userToken: string) => {
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
      );
      const data = await fetchUpdateListingData.data;

      return data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
);

const initialState: ListingState = {
  status: "",
  listingData: [],
  listingUserProfile: [],
};

const listSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setSearchData(state: ListingState, action: any) {
      state.listingData = [...action?.payload?.listings]; // Set listing data from payload
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(createPost.pending, (state: ListingState) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state: ListingState, action: any) => {
        state.status = "success";
      })
      .addCase(createPost.rejected, (state: ListingState) => {
        state.status = "failed";
      })
      .addCase(fetchListing.pending, (state: ListingState, action: any) => {
        state.status = "loading";
      })
      .addCase(fetchListing.fulfilled, (state: ListingState, action: any) => {
        state.status = "success";
        state.listingData = [...action.payload.listings];
      })
      .addCase(fetchListing.rejected, (state: ListingState) => {
        state.status = "failed";
      })
      .addCase(fetchSingleListing.pending, (state: ListingState) => {
        state.status = "loading";
      })
      .addCase(fetchSingleListing.fulfilled, (state: ListingState) => {
        state.status = "success";
      })
      .addCase(fetchSingleListing.rejected, (state: ListingState) => {
        state.status = "failed";
      })
      .addCase(fetchSingleListingUserProfile.pending, (state: ListingState) => {
        state.status = "loading";
      })
      .addCase(
        fetchSingleListingUserProfile.fulfilled,
        (state: ListingState) => {
          state.status = "success";
        }
      )
      .addCase(
        fetchSingleListingUserProfile.rejected,
        (state: ListingState) => {
          state.status = "failed";
        }
      )
      .addCase(fetchUpdateListingData.pending, (state: ListingState) => {
        state.status = "loading";
      })
      .addCase(fetchUpdateListingData.fulfilled, (state: ListingState) => {
        state.status = "success";
      })
      .addCase(fetchUpdateListingData.rejected, (state: ListingState) => {
        state.status = "failed";
      })
      .addCase(updatePost.pending, (state: ListingState) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state: ListingState) => {
        state.status = "success";
      })
      .addCase(updatePost.rejected, (state: ListingState) => {
        state.status = "failed";
      });
  },
});

export const { setSearchData } = listSlice.actions;
export default listSlice.reducer;
