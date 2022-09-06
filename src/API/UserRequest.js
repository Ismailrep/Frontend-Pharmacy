import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:2000" });

export const verifyUser = (id) =>
  API.patch(`/users/verified/${id}`)
    .then((res) => console.log(res), console.log(id))
    .catch((err) => console.log(err));
