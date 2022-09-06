import axios from "axios";
import React, { useState, createContext, useEffect } from "react";
import { API_URL } from "../../../../constants/API";
import { CustomerData } from "./CustomerData";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
  const [data, setData] = useState([]);

  const getAdminList = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-admin`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminList();
  }, []);

  return <AdminContext.Provider value={{ contextData: [data, setData] }}>{props.children}</AdminContext.Provider>;
};
