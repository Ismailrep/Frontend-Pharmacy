import React, { useState } from "react";
import { Icon } from "../../../Component";
import { Card, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { AverageOrderChart } from "../../charts/e-commerce/EcomCharts";

const AverageOrder = ({ revenue }) => {
  // GET PROFIT
  const getProfit = (revenue) => {
    return (12 / 100) * revenue;
  };

  // GET GROWTH IN %
  const getGrowth = (last, current) => {
    const growth = ((current - last) / last) * 100;
    return growth.toFixed(2) + "%";
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

  return (
    <Card className="h-100">
      <div className="nk-ecwg nk-ecwg2">
        <div className="card-inner">
          <div className="card-title-group mt-n1">
            <div className="card-title">
              <h6 className="title">Profit</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">{toCurrency(getProfit(revenue.thisMonth))}</div>
              <div className="info text-right">
                <span className={`change ${revenue.lastMonth > revenue.thisMonth ? `down` : `up`} `}>
                  <Icon name={revenue.lastMonth > revenue.thisMonth ? `arrow-long-down` : `arrow-long-up`}></Icon>
                  {getGrowth(getProfit(revenue.lastMonth), getProfit(revenue.thisMonth))}
                </span>
                <br />
                <span>vs. last month</span>
              </div>
            </div>
            <div className="info">
              <strong>{toCurrency(getProfit(revenue.lastMonth))}</strong> in last month
            </div>
          </div>
          <h6 className="sub-title">Last 30 days profit</h6>
        </div>
        <div className="nk-ecwg2-ck">
          <AverageOrderChart revData={revenue.revenuePerDay} />
        </div>
      </div>
    </Card>
  );
};
export default AverageOrder;
