import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card } from "reactstrap";
import { Icon } from "../../../Component";
import { TotalCustomerChart } from "../../charts/e-commerce/EcomCharts";

const Customer = ({ revenue, totalSold }) => {
  const [cost, setCost] = useState({});
  const costPerInvoice = 6000;

  // GET COST
  const getCost = () => {
    setCost({
      ...cost,
      total: revenue.invoice.total * costPerInvoice,
      lastMonth: revenue.invoice.lastMonth * costPerInvoice,
      thisMonth: revenue.invoice.thisMonth * costPerInvoice,
    });
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

  useEffect(() => {
    if (revenue.invoice) {
      getCost();
    }
  }, [revenue.invoice]);

  return (
    <Card>
      <div className="nk-ecwg nk-ecwg3">
        <div className="card-inner pb-0">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">Operational Cost</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">{toCurrency(cost.thisMonth)}</div>
              <div className="info text-right">
                <span className={`change ${cost.lastMonth > cost.thisMonth ? `down` : `up`} `}>
                  <Icon name={cost.lastMonth > cost.thisMonth ? `arrow-long-down` : `arrow-long-up`} />
                  {getGrowth(cost.lastMonth, cost.thisMonth)}
                </span>
                <br />
                <span>vs. last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-ecwg3-ck px-4">
          <div className="info">
            <strong>{toCurrency(cost.lastMonth)}</strong> in last month
          </div>
        </div>
      </div>
    </Card>
  );
};
export default Customer;
