import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import { API_URL } from "../../../../constants/API";

const TopProducts = ({ thisMonth }) => {
  const [topProducts, setTopProducts] = useState([]);
  let [startDate, endDate] = thisMonth;

  // GET TOP 5 MOST SOLD PRODUCTS
  const getTopProducts = async (req, res) => {
    try {
      if (!startDate) startDate = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
      if (!endDate) endDate = moment(new Date().getTime()).format("YYYY-MM-DD");
      const response = await axios.post(`${API_URL}/report/getTopProducts`, { date: [startDate, endDate] });
      setTopProducts(response.data);
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

  useEffect(() => {
    getTopProducts();
  }, [thisMonth]);

  return (
    <Card className="h-100">
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
            <h6 className="title">Top products</h6>
          </div>
        </div>
        <ul className="nk-top-products">
          {topProducts.map((item) => (
            <li className="item" key={item.id}>
              <div className="thumb">
                <img src={`${API_URL}/products/${item.product.image}`} alt="product" />
              </div>
              <div className="info">
                <div className="title">{item.product.name}</div>
                <div className="price">{toCurrency(item.product.price)}</div>
              </div>
              <div className="total">
                <div className="amount">{item.count} Sold</div>
                {/* <div className="count">{toCurrency(item.total_price)}</div> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default TopProducts;
