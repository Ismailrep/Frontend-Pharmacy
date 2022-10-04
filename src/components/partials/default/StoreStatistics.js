import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card } from "reactstrap";
import { API_URL } from "../../../constants/API";
import { Icon } from "../../Component";

const StoreStatistics = ({ thisMonth }) => {
  const [statistic, setStatistic] = useState({});

  // GET STORE STATISTIC
  const getStatistic = async () => {
    try {
      const response = await axios.post(`${API_URL}/report/getStatistic`, thisMonth);
      setStatistic(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FORMATTING NUMBER #00.000
  const numberFormat = (numbers) => {
    return Intl.NumberFormat("de-DE").format(numbers);
  };

  useEffect(() => {
    getStatistic();
  }, [thisMonth]);

  return (
    <Card className="h-100">
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
            <h6 className="title">Store Statistics</h6>
          </div>
        </div>
        <ul className="nk-store-statistics">
          <li className="item">
            <div className="info">
              <div className="title">Orders</div>
              <div className="count">{numberFormat(statistic.orders)}</div>
            </div>
            <Icon name="bag" className="bg-primary-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Customers</div>
              <div className="count">{numberFormat(statistic.customers)}</div>
            </div>
            <Icon name="users" className="bg-info-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Products</div>
              <div className="count">{numberFormat(statistic.products)}</div>
            </div>
            <Icon name="box" className="bg-pink-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Categories</div>
              <div className="count">{numberFormat(statistic.categories)}</div>
            </div>
            <Icon name="server" className="bg-purple-dim"></Icon>
          </li>
        </ul>
      </div>
    </Card>
  );
};
export default StoreStatistics;
