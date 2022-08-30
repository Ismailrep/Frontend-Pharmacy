import Axios from "axios";
import { API_URL } from "../../constants/API";

export const loginAdmin = (data) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: "LOADING",
        payload: true,
      });

      const response = await Axios.post(`${API_URL}/admin/login`, data);

      //   alert(response.data.adminData.email);

      if (typeof response.data === "string") {
        dispatch({
          type: "ADMIN_ERROR",
          payload: response.data,
        });
      } else {
        delete response.data.adminData.password;
        localStorage.setItem("userAccess", response.data.token);

        dispatch({
          type: "ADMIN_LOGIN",
          payload: response.data.adminData,
        });
      }
    };
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const logoutAdmin = () => {
  try {
    localStorage.removeItem("userAccess");
    return {
      type: "ADMIN_LOGOUT",
    };
  } catch (error) {
    console.log(error);
  }
};

export const adminKeepLogin = (token) => {
  return async (dispatch) => {
    try {
      const response = await Axios.post(`${API_URL}/admin/keepLogin`, {
        token: token,
      });

      delete response.data.adminData.password;
      localStorage.setItem("userAccess", response.data.token);

      dispatch({
        type: "ADMIN_LOGIN",
        payload: response.data.adminData,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const checkStorage = () => {
  return {
    type: "CHECK_STORAGE",
  };
};
