export interface UserState {
  token: string[]; // Change the type according to your actual data type
  userDetails: any; // Change the type according to your actual data type
  phone_no: string;
  otp_session_id: string;
  error: any; // Change the type according to your actual error type
  userProfile: any; // Change the type according to your actual data type
  userPreferences: any; // Change the type according to your actual data type
}

export interface ListingState {
  status: string;
  listingData: any[]; // Change the type according to your actual data type
  listingUserProfile: any[]; // Change the type according to your actual data type
}

export interface RootState {
  user: UserState; // Include the state for the userSlice
  listing: ListingState;
  // Add other slices here as needed
}
