const userReducer = (
  state = {
    authData: null,
    loading: false,
    error: false,
    errorMessage: "",
  },
  action
) => {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, loading: true, error: false };
    case "REGISTER_SUCCESS":
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false, error: false };
    case "REGISTER_FAIL":
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error.message,
      };
    case "VERIFICATION_START":
      return { ...state, verifLoading: true, error: false };
    case "VERIFICATION_SUCCESS":
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return {
        ...state,
        authData: action.data,
        verifLoading: false,
        error: false,
      };
    case "VERIFICATION_FAIL":
      return { ...state, verifLoading: false, error: false };
    case "RESETPASS_START":
      return { ...state, resetLoading: true, error: false };
    case "RESETPASS_SUCCESS":
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return {
        ...state,
        authData: action.data,
        resetLoading: false,
        error: false,
      };
    case "RESETPASS_FAIL":
      return { ...state, resetLoading: false, error: false };

    default:
      return state;
  }
};

export default userReducer;
