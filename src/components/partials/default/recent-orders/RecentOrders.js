import axios from "axios";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Card } from "reactstrap";
import { API_URL } from "../../../../constants/API";
import { DataTableHead, DataTableRow, DataTableItem, UserAvatar } from "../../../Component";
import { recentOrderData } from "./OrderData";

const RecentOrders = ({ thisMonth }) => {
  const [recentOrder, setRecentOrder] = useState([]);

  // GET 5 RECENT ORDER
  const getRecentOrder = async () => {
    try {
      let startDate = thisMonth[0];
      let endDate = thisMonth[1];
      if (!startDate) startDate = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
      if (!endDate) endDate = moment(new Date().getTime()).format("YYYY-MM-DD");
      const response = await axios.post(`${API_URL}/report/getRecentOrder`, { thisMonth: [startDate, endDate] });
      setRecentOrder(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CONVERT PRICE TO CURRENCY TYPE
  const toCurrency = (data) => {
    const locale = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 9,
    });
    return locale.format(data);
  };

  // RENDER RECENT ORDER
  const renderRecentOrder = () => {
    return recentOrder.map((item) => (
      <DataTableItem key={item.id}>
        <DataTableRow>
          <span className="tb-lead">
            <a href="#order" onClick={(ev) => ev.preventDefault()}>
              {item.invoice_id}
            </a>
          </span>
        </DataTableRow>
        <DataTableRow size="sm">
          <div className="user-card">
            {/* <UserAvatar className="sm" theme={item.theme} text={item.initial} image={item.img}></UserAvatar> */}
            <div className="user-name">
              <span className="tb-lead">
                {item.user.first_name} {item.user.last_name}
              </span>
            </div>
          </div>
        </DataTableRow>
        <DataTableRow size="md">
          <span className="tb-sub">{moment(item.createdAt).format("MMM Do, YYYY")}</span>
        </DataTableRow>
        <DataTableRow>
          <span className="tb-sub tb-amount">{toCurrency(item.grand_total)}</span>
        </DataTableRow>
        <DataTableRow>
          <span
            className={`badge badge-dot badge-dot-xs badge-${
              item.status === "Paid" ? "success" : item.status === "Rejected" ? "danger" : "warning"
            }`}
          >
            {item.status}
          </span>
        </DataTableRow>
      </DataTableItem>
    ));
  };

  useEffect(() => {
    getRecentOrder();
  }, [thisMonth]);

  return (
    <Card className="card-full">
      <div className="card-inner">
        <div className="card-title-group">
          <div className="card-title">
            <h6 className="title">Recent Orders</h6>
          </div>
        </div>
      </div>
      <div className="nk-tb-list mt-n2">
        <DataTableHead>
          <DataTableRow>
            <span>Invoice Id</span>
          </DataTableRow>
          <DataTableRow size="sm">
            <span>Customer</span>
          </DataTableRow>
          <DataTableRow size="md">
            <span>Date</span>
          </DataTableRow>
          <DataTableRow>
            <span>Amount</span>
          </DataTableRow>
          <DataTableRow>
            <span className="d-none d-sm-inline">Status</span>
          </DataTableRow>
        </DataTableHead>
        {renderRecentOrder()}
      </div>
    </Card>
  );
};
export default RecentOrders;
