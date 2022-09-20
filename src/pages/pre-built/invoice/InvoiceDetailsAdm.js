import React, { useState, useEffect } from "react";
import {
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  BlockDes,
  BlockHeadContent,
  Block,
  BlockBetween,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import LogoDark from "../../../images/logo-dark.png";
import { invoiceData } from "./Invoice";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/API";
import moment from "moment";

const InvoiceDetailsAdm = () => {
  const { id } = useParams();
  const [invoiceDetail, setInvoiceDetail] = useState({ user: {}, invoice_details: [], address: {} });

  const getInvoice = async () => {
    try {
      const response = await axios.get(`${API_URL}/invoices/getInvoiceById/${id}`);
      setInvoiceDetail(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CONVERT PRICE TO CURRENCY TYPE
  const toCurrency = (data) => {
    const locale = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 3,
    });
    return locale.format(data);
  };

  // DATE FORMATING
  const formatDate = (date, format) => {
    return moment(date).format(format);
  };

  useEffect(() => {
    getInvoice();
  }, []);

  return (
    <React.Fragment>
      <Head title="Invoice Detail"></Head>
      {invoiceDetail ? (
        <Content>
          <BlockHead>
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle>
                  Invoice <strong className="text-primary small">#{invoiceDetail.invoice_id}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Created At:{" "}
                      <span className="text-base">{formatDate(invoiceDetail.createdAt, "DD MMM YYYY, h:mm a")}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/admin/invoice-list`}>
                  <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                    <Icon name="arrow-left"></Icon>
                    <span>Back</span>
                  </Button>
                </Link>
                <Link to={`${process.env.PUBLIC_URL}/invoice-list`}>
                  <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                    <Icon name="arrow-left"></Icon>
                  </Button>
                </Link>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>

          <Block>
            <div className="invoice">
              <div className="invoice-action">
                <Link to={`${process.env.PUBLIC_URL}/invoice-print/${"invoiceDetail.id"}`} target="_blank">
                  <Button size="lg" color="primary" outline className="btn-icon btn-white btn-dim">
                    <Icon name="printer-fill"></Icon>
                  </Button>
                </Link>
              </div>
              <div className="invoice-wrap">
                <div className="invoice-brand text-center">
                  <img src={LogoDark} alt="" />
                </div>

                <div className="invoice-head">
                  <div className="invoice-contact">
                    <span className="overline-title">Invoice To</span>
                    <div className="invoice-contact-info">
                      <h4 className="title">
                        {invoiceDetail.user.first_name} {invoiceDetail.user.last_name}
                      </h4>
                      <ul className="list-plain">
                        <li>
                          <Icon name="map-pin-fill"></Icon>
                          <span>{invoiceDetail.address.address}</span>
                        </li>
                        <li>
                          <Icon name="call-fill"></Icon>
                          <span>{invoiceDetail.user.phone}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="invoice-desc">
                    <h3 className="title">Invoice</h3>
                    <ul className="list-plain">
                      <li className="invoice-id">
                        <span>Invoice ID</span>:<span>{invoiceDetail.invoice_id}</span>
                      </li>
                      <li className="invoice-date">
                        <span>Date</span>:<span>{formatDate(invoiceDetail.createdAt, "DD MMM YYYY")}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="invoice-bills">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="w-150px">Item ID</th>
                          <th className="w-60">Description</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceDetail.invoice_details.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td>24108054</td>
                              <td>{item.product.name}</td>
                              <td>{toCurrency(item.price)}</td>
                              <td>{item.qty}</td>
                              <td>{toCurrency(item.price * item.qty)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">Subtotal</td>
                          <td>{toCurrency(invoiceDetail.grand_total)}</td>
                        </tr>
                        {/* <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">Processing fee</td>
                          <td>$10.00</td>
                        </tr> */}
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">TAX(2%)</td>
                          <td>{toCurrency(invoiceDetail.grand_total * (2 / 100))}</td>
                        </tr>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">Grand Total</td>
                          <td>{toCurrency(invoiceDetail.grand_total + invoiceDetail.grand_total * (2 / 100))}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="nk-notes ff-italic fs-12px text-soft">
                      Invoice was created on a computer and is valid without the signature and seal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </Content>
      ) : null}
    </React.Fragment>
  );
};
export default InvoiceDetailsAdm;
