import {
    SIGNUP_REQUEST,
    SIGNUP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
} from "../actions/"

export default (
    state = {
        isSigningUp: false,
        signupSuccess: false,
        signupError: false,
        isLoggingIn: false,
        isLoggingOut: false,
        isVerifying: false,
        verifyingError: false,
        loginError: false,
        logoutError: false,
        isAuthenticated: false,
        user: {}
    },
        action
    ) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
            return {
                ...state,
                isSigningUp: true,
                signupError: false,
            };
        case SIGNUP_FAILURE:
            return {
                ...state,
                signupError: action.error.message,
            };
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
                loginError: action.error.message,
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
                logoutError: false,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: false,
                user: {},
            };
        case LOGOUT_FAILURE:
            return {
                ...state,
                isLoggingOut: false,
                logoutError: true,
            };
        case VERIFY_REQUEST:
            return {
                ...state,
                isVerifying: true,
                verifyingError: false,
            };
        case VERIFY_SUCCESS:
            return {
                ...state,
                isVerifying: false,
            };

        default:
            return {
                state
            }
    }
}

