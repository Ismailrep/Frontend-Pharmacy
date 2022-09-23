const init_state = {
  full_name: "",
  email: "",
  id: null,
  errMsg: "",
  isLoading: false,
  storageIsChecked: false,
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "ADMIN_LOGIN":
      return {
        ...state,
        ...action.payload,
        storageIsChecked: true,
        isLoading: false,
      };

    case "ADMIN_LOGOUT":
      return { ...init_state, storageIsChecked: true };

    case "ADMIN_ERROR":
      return { ...state, errMsg: action.payload, isLoading: false };

    case "CHECK_STORAGE":
      return { ...state, storageIsChecked: true };

    case "LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

export default reducer;
