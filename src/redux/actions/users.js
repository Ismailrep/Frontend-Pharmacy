import * as UserApi from "../../API/UserRequest";

// export const registerUser = (data) => {
//   try {
//     return async (dispatch) => {
//       dispatch({
//         type: "LOADING",
//         payload: true,
//       });

//       const response = await Axios.post(`${API_URL}/users/register`, data);
//     };
//   } catch (error) {
//     throw new Error(err.response.data.message);
//   }
// };

// export const verifyUser = (data) => {
//   try {
//     return async (dispatch) => {
//       dispatch({
//         type: "LOADING",
//         payload: true,
//       });
//       const response = await Axios.patch(`${API_URL}/users/verified/:id`, data);
//     };
//   } catch (error) {
//     throw new Error(err.response.data.message);
//   }
// };

export const logIn = (formData) => async (dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const { data } = await UserApi.logIn(formData);
    dispatch({ type: "LOGIN_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOGIN_FAIL", error: error });
  }
};

export const verifyUser = (uuid) => async (dispatch) => {
  dispatch({ type: "VERIFICATION_START" });
  try {
    const { data } = await UserApi.verifyUser(uuid);
    dispatch({ type: "VERIFICATION_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "VERIFICATION_FAIL" });
  }
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: "GETUSER_START" });
  try {
    const { data } = await UserApi.getUser();
    dispatch({ type: "GETUSER_SUCCESS", data: data });
  } catch (error) {
    dispatch({ type: "GETUSER_FAIL" });
  }
};
