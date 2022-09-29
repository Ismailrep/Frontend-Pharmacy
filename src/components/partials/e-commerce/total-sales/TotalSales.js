import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import { API_URL } from "../../../../constants/API";
import { Icon } from "../../../Component";
import { TotalSalesChart } from "../../charts/e-commerce/EcomCharts";

const TotalSales = ({ revenue }) => {
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
    <Card className="is-dark h-100">
      <div className="nk-ecwg nk-ecwg1">
        <div className="card-inner">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">Total Sales</h6>
            </div>
            <div className="card-tools">
              <a href="#report" onClick={(ev) => ev.preventDefault()} className="link info">
                View Report
              </a>
            </div>
          </div>
          <div className="data">
            <div className="amount">{toCurrency(revenue.total)}</div>
            <div className="info">
              <strong>{toCurrency(revenue.lastMonth)}</strong> in last month
            </div>
          </div>
          <div className="data">
            <h6 className="sub-title">This week so far</h6>
            <div className="data-group">
              <div className="amount">{toCurrency(revenue.thisWeek)}</div>
              <div className="info text-right">
                <span className={`change ${revenue.lastWeek > revenue.thisWeek ? `down` : `up`} `}>
                  <Icon name={revenue.lastWeek > revenue.thisWeek ? `arrow-long-down` : `arrow-long-up`}></Icon>
                  {getGrowth(revenue.lastWeek, revenue.thisWeek)}
                </span>
                <br />
                <span>vs. last week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-ecwg1-ck">
          <TotalSalesChart />
        </div>
      </div>
    </Card>
  );
};

export default TotalSales;
