import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Col, Row } from "../../../components/Component";
import RecentOrders from "../../../components/partials/default/recent-orders/RecentOrders";
import TopProducts from "../../../components/partials/default/top-products/TopProducts";
import AverageOrder from "../../../components/partials/e-commerce/average-order/AverageOrder";
import Customer from "../../../components/partials/e-commerce/customers/Customer";
import Orders from "../../../components/partials/e-commerce/orders/Orders";
import TotalSales from "../../../components/partials/e-commerce/total-sales/TotalSales";
import StoreStatistics from "../../../components/partials/default/StoreStatistics";
import TrafficSources from "../../../components/partials/e-commerce/traffic-sources/TrafficSources";
import StoreVisitors from "../../../components/partials/e-commerce/store-visitors/StoreVisitors";
import { Redirect } from "react-router";
import axios from "axios";
import moment from "moment";
import { API_URL } from "../../../constants/API";

const Dashboard = () => {
  const admin = useSelector((state) => state.admin);
  const [revenue, setRevenue] = useState({});
  const [itemSold, setItemSold] = useState(0);

  // GET REVENUE
  const getRevenue = async () => {
    try {
      const response = await axios.post(`${API_URL}/report/getRevenue`, {
        week: getCurrent("isoWeek"),
        lastWeek: getLast("weeks", "isoWeek"),
        thisMonth: getCurrent("month"),
        lastMonth: getLast("month", "month"),
      });

      let sold = 0;
      await response.data.itemSold.forEach((element) => {
        sold += +element.sold;
      });
      setRevenue(response.data);
      setItemSold(sold);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrent = (type) => {
    return moment().startOf(type).format("YYYY-MM-DD");
  };

  const getLast = (subtract, type) => {
    const startDate = moment().subtract(1, subtract).startOf(type).format("YYYY-MM-DD");
    const endDate = moment().subtract(1, subtract).endOf(type).format("YYYY-MM-DD");
    return [startDate, endDate];
  };

  useEffect(() => {
    getRevenue();
  }, []);

  if (!admin.id) {
    return <Redirect to={"/"} />;
  }

  return (
    <React.Fragment>
      <Head title="Dashboard"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Dashboard</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col xxl="4" md="6">
              <TotalSales revenue={revenue} />
            </Col>
            <Col xxl="4" md="6">
              <AverageOrder revenue={revenue} />
            </Col>
            <Col xxl="4">
              <Row className="g-gs">
                <Col xxl="12" md="6">
                  <Orders />
                </Col>
                <Col xxl="12" md="6">
                  <Customer />
                </Col>
              </Row>
            </Col>
            <Col xxl="8">
              <RecentOrders />
            </Col>
            <Col xxl="4" md="6">
              <TopProducts />
            </Col>
            <Col xxl="3" md="6">
              <StoreStatistics />
            </Col>
            <Col xxl="5" lg="6">
              <TrafficSources />
            </Col>
            <Col xxl="4" lg="6">
              <StoreVisitors />
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Dashboard;
