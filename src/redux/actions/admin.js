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

      if (typeof response.data === "string") {
        return dispatch({
          type: "ADMIN_ERROR",
          payload: response.data,
        });
      }
      localStorage.setItem("adminAccess", response.data.token);
      dispatch({
        type: "ADMIN_LOGIN",
        payload: response.data.adminData,
      });
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
    localStorage.removeItem("adminAccess");
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
        token,
      });

      if (!response.data) {
        localStorage.removeItem("adminAccess");
        return dispatch({
          type: "ADMIN_LOGOUT",
        });
      }

      delete response.data.adminData.password;
      localStorage.setItem("adminAccess", response.data.token);

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
