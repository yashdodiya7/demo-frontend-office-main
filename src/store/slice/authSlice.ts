const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { default: axios } = require("axios");
import {
  ToastError,
  ToastSuccess,
} from "@/components/utils/custom-error/toast";
import { UserState } from "@/types/user";
import { RootState } from "@reduxjs/toolkit/query";
import { deleteCookie, setCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const phoneVerify = createAsyncThunk(
  "phoneVerify",
  async (val: Object) => {
    try {
      const otpSent = await axios.post(
        `${BASE_URL}/verify/phone/register`,
        val
      );
      ToastSuccess("OTP Sent successfully");
      return otpSent.data;
    } catch (error: any) {
      console.log(error.response.data.message);
      ToastError(error.response.data?.message);
      throw error.response.data.message;
    }
  }
);

export const otpVerify = createAsyncThunk("otpVerify", async (val: any) => {
  try {
    const otpVerify = await axios.post(
      `${BASE_URL}/verify/phone/verify_and_register`,
      val
    );
    ToastSuccess("OTP Verified");
    return otpVerify.data;
  } catch (error: any) {

    if (error.response?.data?.non_field_errors) {
      ToastError(error.response?.data?.non_field_errors[0]);
    } else {
      ToastError(error.response?.data?.error);
    }

    throw error.response;
  }
});

export const userRegister = createAsyncThunk(
  "userRegister",
  async (val: object) => {
    try {
      const createUser = await axios.post(`${BASE_URL}/user/register`, val);
      return createUser.data;
    } catch (error: any) {
      console.log(error.response.data?.email[0]);
      ToastError(error.response.data?.email[0]);
      throw error.response.data?.email[0];
    }
  }
);

export const userPreference = createAsyncThunk(
  "userPreference",
  async ({ userToken, val }: any) => {
    try {
      const createUserPreference = await axios.post(
        `${BASE_URL}/user/userchoice`,
        val,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return createUserPreference.data;
    } catch (error: any) {
      console.log(error.response);
      throw error.response;
    }
  }
);

export const updateUserPreference = createAsyncThunk(
  "updateUserPreference",
  async ({ userToken, val }: any) => {
    try {
      const updateUserPreference = await axios.patch(
        `${BASE_URL}/user/userchoice`,
        val,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      ToastSuccess(updateUserPreference.data.message);
      return updateUserPreference.data;
    } catch (error: any) {
      ToastError(error.response.data.message);
      throw error.response;
    }
  }
);

export const userLogin = createAsyncThunk("userLogin", async (val: object) => {
  try {
    const existingUser = await axios.post(`${BASE_URL}/user/login`, val);
    const data = await existingUser.data;
    return data;
  } catch (error: any) {
    console.log(error.response.data.errors);
    throw error.response.data.errors;
  }
});

export const getUserProfile = createAsyncThunk(
  "getUser",
  async (userToken: string) => {
    try {
      const existingUser = await axios.get(`${BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await existingUser.data;

      return data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
);

export const getUserPrefernce = createAsyncThunk(
  "getUserPrefernce",
  async (userToken: string) => {
    try {
      const existingUser = await axios.get(`${BASE_URL}/user/userchoice`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await existingUser.data;
      return data;
    } catch (error: any) {
      ToastError(error.response.data.message);
      throw error?.response?.data;
    }
  }
);

interface UserUpdateData {
  userToken: string;
  updatedata: object;
}

export const updateUserProfile = createAsyncThunk(
  "updateUserProfile",
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await existingUser.data;

      ToastSuccess("Profile Updated Successfully");
      return data;
    } catch (error: any) {
      ToastError(error.response.data.error);
      throw error?.response?.data;
    }
  }
);

const initialState: UserState = {
  token: [],
  userDetails: {},
  phone_no: "",
  otp_session_id: "",
  error: null,
  userProfile: {},
  userPreferences: {},
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state: any) => {
      state.token = null;
      state.user = null;
      state.userProfile = null;
      state.phone_no = null;
      state.userPreferences = null;
      deleteCookie("token");
    },
    setUserData: (state: any, action: any) => {
      state.userProfile = { ...state.userProfile, ...action?.payload };
    },
    setPhoneNumber: (state: any, action: any) => {
      const { phone_no } = action.payload; // Extract phone number from payload
      console.log
      state.phone_no = phone_no; // Update state with the new phone number
    },
    setOtpSessionId: (state: any) => {
      state.otp_session_id = "";
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(phoneVerify.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(phoneVerify.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.otp_session_id = action.payload?.session_token;
      })
      .addCase(phoneVerify.rejected, (state: any) => {
        state.status = "failed";
      })
      .addCase(otpVerify.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(otpVerify.fulfilled, (state: any) => {
        state.status = "succeeded";
      })
      .addCase(otpVerify.rejected, (state: any) => {
        state.status = "failed";
      })
      .addCase(userRegister.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(userRegister.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.token = action.payload.tokens?.access;
        state.userProfile = { ...action?.payload?.data };
        setCookie("token", action.payload.tokens?.access);
      })
      .addCase(userRegister.rejected, (state: any, action: any) => {
        state.status = "failed";
      })
      .addCase(userPreference.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(userPreference.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
      })
      .addCase(userPreference.rejected, (state: any, action: any) => {
        state.status = "failed";
      })
      .addCase(userLogin.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(userLogin.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.userProfile = { ...action?.payload?.data };
        state.token = action.payload.tokens?.access;
        setCookie("token", action.payload.tokens?.access);
      })
      .addCase(userLogin.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error;
      })
      .addCase(getUserProfile.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(getUserProfile.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.userProfile = { ...action.payload };
      })
      .addCase(getUserProfile.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.userProfile = { ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getUserPrefernce.pending, (state: any, action: any) => {
        state.status = "loading";
      })
      .addCase(getUserPrefernce.fulfilled, (state: any, action: any) => {
        state.status = "success";
        state.userPreferences = action.payload;
      })
      .addCase(getUserPrefernce.rejected, (state: any, action: any) => {
        state.status = "failed";
      })
      .addCase(updateUserPreference.pending, (state: any, action: any) => {
        state.status = "loading";
      })
      .addCase(updateUserPreference.fulfilled, (state: any, action: any) => {
        state.status = "success";
        state.userPreferences = action.payload.Data;
      })
      .addCase(updateUserPreference.rejected, (state: any, action: any) => {
        state.status = "failed";
      });
  },
});

export const { logout, setPhoneNumber, setOtpSessionId, setUserData } =
  authSlice.actions;
export default authSlice.reducer;
