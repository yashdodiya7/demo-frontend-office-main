export interface RootState {
    user: UserState;
}

export interface UserState {
    token: string[];
    user: string[];
    phone_no: string;
    otp_session_id: string;
    error: string;
    userProfile: object;
}

