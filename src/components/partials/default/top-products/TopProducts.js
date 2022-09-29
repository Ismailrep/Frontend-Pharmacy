import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import { API_URL } from "../../../../constants/API";

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  // GET TOP 5 MOST SOLD PRODUCTS
  const getTopProducts = async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/report/getTopProducts`);
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
  }, []);

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
