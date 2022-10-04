import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Card } from "reactstrap";
import { Icon } from "../../../Component";
import { TotalOrderChart } from "../../charts/e-commerce/EcomCharts";

const Orders = ({ revenue, totalSold }) => {
  const [lastMonthSold, setLastMonthSold] = useState(0);
  const [thisMonthSold, setThisMonthSold] = useState(0);

  const getSold = () => {
    let tempLastMonth = 0;
    let tempThisMonth = 0;
    revenue.lastMonthSold.forEach((item) => {
      tempLastMonth += +item.sold;
    });
    revenue.thisMonthSold.forEach((item) => {
      tempThisMonth += +item.sold;
    });
    setLastMonthSold(tempLastMonth);
    setThisMonthSold(tempThisMonth);
  };

  // GET GROWTH IN %
  const getGrowth = (last, current) => {
    const growth = ((current - last) / last) * 100;
    return growth.toFixed(2) + "%";
  };

  useEffect(() => {
    if (revenue.thisMonthSold) {
      getSold();
    }
  }, [revenue, revenue.thisMonthSold]);

  return (
    <Card>
      <div className="nk-ecwg nk-ecwg3">
        <div className="card-inner pb-0">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">Number of sales</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">{thisMonthSold}</div>
              <div className="info text-right">
                <span className={`change ${lastMonthSold > thisMonthSold ? `down` : `up`} `}>
                  <Icon name={lastMonthSold > thisMonthSold ? `arrow-long-down` : `arrow-long-up`}></Icon>
                  {getGrowth(lastMonthSold, thisMonthSold)}
                </span>
                <br />
                <span>vs. last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-ecwg3-ck">
          <TotalOrderChart salesData={revenue.itemSoldPerDay} />
        </div>
      </div>
    </Card>
  );
};
export default Orders;
