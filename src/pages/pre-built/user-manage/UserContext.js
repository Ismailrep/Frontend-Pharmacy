import axios from "axios";
import React, { useState, createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userData } from "./UserData";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [data, setData] = useState([{}]);

  const getUserData = async () => {
    try {
      const response = await axios.get("http://localhost:2000/users");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      setData([{}]);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return <UserContext.Provider value={{ contextData: [data, setData] }}>{props.children}</UserContext.Provider>;
};
