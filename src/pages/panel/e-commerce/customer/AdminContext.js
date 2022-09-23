import axios from "axios";
import React, { useState, createContext, useEffect } from "react";
import { API_URL } from "../../../../constants/API";
import { CustomerData } from "./CustomerData";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
  return <AdminContext.Provider>{props.children}</AdminContext.Provider>;
};
