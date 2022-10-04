import moment from "moment";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  totalSales,
  averargeOrder,
  averargeOrderSet2,
  averargeOrderSet3,
  averargeOrderSet4,
  totalOrders,
  totalCustomers,
  trafficSources,
  trafficSourcesSet2,
  trafficSourcesSet4,
  trafficSourcesSet3,
  storeVisitors,
} from "./Data";

export const TotalSalesChart = ({ salesData }) => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const sales = {
    labels,
    dataUnit: "Sales",
    lineTension: 0.3,
    datasets: [
      {
        label: "Sales",
        borderColor: "#1ABEA8",
        backgroundColor: "rgba(26,190,168,0.25)",
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#9d72ff",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 4,
        data,
      },
    ],
  };

  const getData = () => {
    let tempLabels = [];
    let tempData = [];
    salesData.forEach((item) => {
      tempLabels.push(moment(item.date).format("DD MMM"));
      tempData.push(+item.revenue);
    });
    setLabels(tempLabels);
    setData(tempData);
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
    if (salesData) {
      getData();
    }
  }, [salesData]);

  return (
    <Line
      className="ecommerce-line-chart-s1"
      data={sales}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return `${toCurrency(data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]])}`;
            },
          },
          backgroundColor: "#1ABEA8",
          titleFontSize: 10,
          titleFontColor: "#fff",
          titleMarginBottom: 4,
          bodyFontColor: "#fff",
          bodyFontSize: 10,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const AverageOrderChart = ({ revData }) => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const profit = {
    labels,
    dataUnit: "People",
    lineTension: 0.1,
    datasets: [
      {
        label: "Active Users",
        borderColor: "#4B6340",
        backgroundColor: "#4B6340",
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderWidth: 2,
        data,
      },
    ],
  };

  const getData = () => {
    let tempLabels = [];
    let tempData = [];

    revData.forEach((item) => {
      tempLabels.push(moment(item.date).format("DD MMM"));
      tempData.push(getProfit(+item.revenue));
    });
    setLabels(tempLabels);
    setData(tempData);
  };

  // GET PROFIT
  const getProfit = (revenue) => {
    return (12 / 100) * revenue;
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
    if (revData) {
      getData();
    }
  }, [revData]);

  return (
    <Bar
      data={profit}
      options={{
        legend: {
          display: false,
          labels: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              // return false;
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return `${toCurrency(data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]])}`;
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 9,
          titleFontColor: "#fff",
          titleMarginBottom: 6,
          bodyFontColor: "#fff",
          bodyFontSize: 9,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
                display: false,
                stepSize: 100,
              },
              gridLines: {
                color: "#fff",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "transparent",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    ></Bar>
  );
};

export const TotalOrderChart = ({ salesData }) => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const sales = {
    labels,
    dataUnit: "Sales",
    lineTension: 0.3,
    datasets: [
      {
        label: "Sales",
        borderColor: "#4B6340",
        backgroundColor: "rgba(26,190,168,0.25)",
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#9d72ff",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 4,
        data,
      },
    ],
  };

  const getData = () => {
    let tempLabels = [];
    let tempData = [];
    salesData.forEach((item) => {
      tempLabels.push(moment(item.date).format("DD MMM"));
      tempData.push(+item.sold);
    });
    setLabels(tempLabels);
    setData(tempData);
  };

  useEffect(() => {
    if (salesData) {
      getData();
    }
  }, [salesData]);

  return (
    <Line
      className="ecommerce-line-chart-s1"
      data={sales}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} sales`;
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 10,
          titleFontColor: "#fff",
          titleMarginBottom: 4,
          bodyFontColor: "#fff",
          bodyFontSize: 10,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const TotalCustomerChart = () => {
  return (
    <Line
      className="ecommerce-line-chart-s1"
      data={totalCustomers}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} customers`;
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 10,
          titleFontColor: "#fff",
          titleMarginBottom: 4,
          bodyFontColor: "#fff",
          bodyFontSize: 10,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const TrafficSourcesChart = ({ state }) => {
  const [data, setData] = useState(trafficSources);
  useEffect(() => {
    if (state === "7") {
      setData(trafficSourcesSet2);
    } else if (state === "15") {
      setData(trafficSourcesSet3);
    } else {
      setData(trafficSourcesSet4);
    }
  }, [state]);
  return (
    <Doughnut
      data={data}
      options={{
        legend: {
          display: false,
        },
        rotation: 1,
        cutoutPercentage: 40,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]];
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 13,
          titleFontColor: "#fff",
          titleMarginBottom: 6,
          bodyFontColor: "#fff",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
      }}
    />
  );
};

export const StoreVisitorsChart = () => {
  return (
    <Line
      data={storeVisitors}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 12,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]];
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 13,
          titleFontColor: "#fff",
          titleMarginBottom: 6,
          bodyFontColor: "#fff",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,

              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 8,
                stepSize: 2400,
                display: false,
              },
              gridLines: {
                color: "rgba(82, 100, 132, 0.2)",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "transparent",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};
