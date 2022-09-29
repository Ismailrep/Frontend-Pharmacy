import React, { useState, createContext } from "react";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
  const [data, setData] = useState({});
  return <AdminContext.Provider value={[data, setData]}>{props.children}</AdminContext.Provider>;
};
