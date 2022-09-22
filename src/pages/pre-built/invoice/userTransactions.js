import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Card,
  Badge,
  DropdownItem,
  Modal,
  ModalBody,
} from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PaginationComponent,
  Row,
  Col,
} from "../../../components/Component";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/API";
import moment from "moment";
import DatePicker from "react-datepicker";

const UserTransactions = () => {
  const { user_id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [item, setItem] = useState({});

  const [dateRange, setDateRange] = useState(["", null]);
  const [startDate, endDate] = dateRange;

  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(1);
  const [asc, setAsc] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getInvoices = async (page) => {
    try {
      const response = await axios.post(`${API_URL}/invoices/getInvoicesByUserId`, {
        page,
        perPage: itemPerPage,
        invoice_id: onSearchText,
        user_id,
        asc,
        startDate,
        endDate,
      });
      setInvoices(response.data.invoices);
      setTotalInvoices(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const btnChangeStatus = async (status) => {
    try {
      await axios.patch(`${API_URL}/invoices/setStatus`, { id: item.id, status });
      getInvoices(currentPage);
      setModalIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setPerPage = (items) => {
    setItemPerPage(items);
    setCurrentPage(1);
    getInvoices(1);
  };

  const orderByDate = (asc) => {
    setAsc(asc);
    setCurrentPage(1);
    getInvoices(1);
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
    getInvoices(1);
  }, [onSearchText, itemPerPage, asc, startDate, endDate]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getInvoices(pageNumber);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  return (
    <React.Fragment>
      <Head title="Invoice List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>{invoices.length ? invoices[0].user.first_name + "'s Transactions" : null}</BlockTitle>
              <BlockDes className="text-soft">
                <p>Total {totalInvoices} transactions.</p>
              </BlockDes>
            </BlockHeadContent>

            <BlockHeadContent className="d-flex flex-column align-items-end">
              <Link to={`/admin/customer`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex mb-3">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
              </Link>
              {/* <div className="d-flex flex-column align-items-end">
                <span className="text-soft">Filter by Date</span>
                <DatePicker
                  placeholderText={moment().format("l")}
                  startDate={startDate}
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  endDate={endDate}
                  selectsRange={true}
                  isClearable={true}
                  className="form-control date-picker"
                />
              </div> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card className="card-stretch">
            <div className="card-inner-group">
              <div className="card-inner">
                <div className="card-title-group">
                  <div className="card-title">
                    <h5 className="title">
                      All {invoices.length ? invoices[0].user.first_name + "'s" : null} Transactions
                    </h5>
                  </div>
                  <div className="card-tools mr-n1">
                    <ul className="btn-toolbar">
                      <li>
                        <Button onClick={toggle} className="btn-icon search-toggle toggle-search">
                          <Icon name="search"></Icon>
                        </Button>
                      </li>
                      <li className="btn-toolbar-sep"></li>
                      <li>
                        <DatePicker
                          placeholderText="Filter by date range"
                          startDate={startDate}
                          onChange={(update) => {
                            setDateRange(update);
                          }}
                          endDate={endDate}
                          selectsRange={true}
                          isClearable={true}
                          className="form-control date-picker"
                        />
                      </li>
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="setting"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-check">
                              <li>
                                <span>Show(per page)</span>
                              </li>
                              <li className={itemPerPage === 1 ? "active" : ""}>
                                <DropdownItem tag="a" onClick={() => setPerPage(1)}>
                                  1 item
                                </DropdownItem>
                              </li>
                              <li className={itemPerPage === 2 ? "active" : ""}>
                                <DropdownItem tag="a" onClick={() => setPerPage(2)}>
                                  2 items
                                </DropdownItem>
                              </li>
                            </ul>
                            <ul className="link-check">
                              <li>
                                <span>Order(by date)</span>
                              </li>
                              <li className={asc ? "" : "active"}>
                                <DropdownItem tag="a" onClick={() => orderByDate(false)}>
                                  DESC
                                </DropdownItem>
                              </li>
                              <li className={asc ? "active" : ""}>
                                <DropdownItem tag="a" onClick={() => orderByDate(true)}>
                                  ASC
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </div>
                  <div className={`card-search search-wrap ${!onSearch ? "active" : ""}`}>
                    <div className="search-content">
                      <input
                        type="text"
                        className="form-control border-transparent form-focus-none"
                        placeholder="Search by Id"
                        value={onSearchText}
                        onChange={(e) => onFilterChange(e)}
                      />
                      <Button className="search-submit btn-icon">
                        <Icon name="search"></Icon>
                      </Button>
                      <Button
                        className="search-back btn-icon toggle-search"
                        onClick={() => {
                          setSearchText("");
                          toggle();
                        }}
                      >
                        <Icon name="arrow-left"></Icon>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-inner p-0">
                <table className="table table-orders">
                  <thead className="tb-odr-head">
                    <tr className="tb-odr-item">
                      <th className="tb-odr-info">
                        <span className="tb-odr-id">ID</span>
                        <span className="tb-odr-date d-none d-md-inline-block">Date</span>
                      </th>
                      <th className="tb-odr-info">
                        <span className="tb-odr-id">Customer</span>
                      </th>
                      <th className="tb-odr-info">
                        <span className="tb-odr-id">Purchased</span>
                      </th>
                      <th className="tb-odr-amount">
                        <span className="tb-odr-total">Amount</span>
                        <span className="tb-odr-status d-none d-md-inline-block">Status</span>
                      </th>
                      <th className="tb-odr-info">
                        <span className="tb-odr-id">Payment</span>
                      </th>
                      <th className="tb-odr-action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody className="tb-odr-body">
                    {invoices.length > 0
                      ? invoices.map((item) => {
                          return (
                            <tr className="tb-odr-item" key={item.id}>
                              <td className="tb-odr-info">
                                <span className="tb-odr-id">
                                  <Link to={`/admin/invoice-details/${item.invoice_id}/${user_id}`}>
                                    {item.invoice_id}
                                  </Link>
                                </span>
                                <span className="tb-odr-date">
                                  {moment(item.createdAt).format("M-DD-YYYY, h:mm a")}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {item.user.first_name} {item.user.last_name}
                                </span>
                              </td>
                              <td>
                                <span>
                                  {item.invoice_details.length > 1
                                    ? item.invoice_details.length + " items"
                                    : item.invoice_details[0].product.name}
                                </span>
                              </td>
                              <td className="tb-odr-amount">
                                <span className="tb-odr-total">
                                  <span className="amount">{toCurrency(item.grand_total)}</span>
                                </span>
                                <span className="tb-odr-status">
                                  <Badge
                                    color={
                                      item.status === "Paid"
                                        ? "success"
                                        : item.status === "Waiting for payment"
                                        ? "warning"
                                        : "danger"
                                    }
                                    className="badge-dot"
                                  >
                                    {item.status}
                                  </Badge>
                                </span>
                              </td>
                              <td>
                                {item.payment_confirmation ? (
                                  <Button
                                    onClick={() => {
                                      setItem(item);
                                      setModalIsOpen(true);
                                    }}
                                    color="primary"
                                    size="sm"
                                    className="btn btn-dim"
                                  >
                                    {item.payment_confirmation.bank}
                                  </Button>
                                ) : (
                                  <span>No payment confirmation</span>
                                )}
                              </td>
                              <td className="tb-odr-action">
                                <div className="tb-odr-btns d-none d-sm-inline">
                                  {/* <Link to={`/invoice-print/${item.invoice_id}`} target="_blank">
                                    <Button color="primary" size="sm" className="btn-icon btn-white btn-dim">
                                      <Icon name="printer-fill"></Icon>
                                    </Button>
                                  </Link> */}
                                  <Link to={`/admin/invoice-details/${item.invoice_id}/${user_id}`}>
                                    <Button color="primary" size="sm" className="btn btn-dim">
                                      View
                                    </Button>
                                  </Link>
                                </div>
                                {/* <Link to={`/invoice-details/${item.invoice_id}`}>
                                  <Button className="btn-pd-auto d-sm-none">
                                    <Icon name="chevron-right"></Icon>
                                  </Button>
                                </Link> */}
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
              <div className="card-inner">
                {invoices.length > 0 ? (
                  <PaginationComponent
                    noDown
                    itemPerPage={itemPerPage}
                    totalItems={totalInvoices}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>

        {item ? (
          <Modal
            isOpen={modalIsOpen}
            toggle={() => {
              setModalIsOpen(false);
              setItem({});
            }}
            className="modal-dialog-centered"
            size="lg"
          >
            <ModalBody>
              <a href="#cancel" className="close">
                {" "}
                <Icon
                  name="cross-sm"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalIsOpen(false);
                  }}
                ></Icon>
              </a>
              <div className="nk-modal-head">
                <h4 className="nk-modal-title title">
                  Payment for Invoice
                  <small className="text-primary"> #{item.invoice_id}</small>
                </h4>
              </div>
              <div className="nk-tnx-details mt-sm-3">
                <Row className="gy-3">
                  <Col lg={6}>
                    <img
                      src={item.payment_confirmation && `${API_URL}/payments/${item.payment_confirmation.image}`}
                      alt="payment"
                    />
                  </Col>
                  <Col lg={6}>
                    <div className="invoice-desc">
                      <ul className="list-plain">
                        <li>
                          <span>Bank</span>:<span>{item.payment_confirmation && item.payment_confirmation.bank}</span>
                        </li>
                        <li>
                          <span>Account</span>:
                          <span>{item.payment_confirmation && item.payment_confirmation.account_name}</span>
                        </li>
                        <li>
                          <span>Amount</span>:
                          <span>{item.payment_confirmation && toCurrency(item.payment_confirmation.amount)}</span>
                        </li>
                      </ul>
                    </div>

                    {item.status === "Waiting for payment" ? (
                      <div className=" justify-content-end mt-3">
                        <Button
                          onClick={() => btnChangeStatus("Paid")}
                          color="primary"
                          size="sm"
                          className="btn btn-dim mr-2"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => btnChangeStatus("Rejected")}
                          color="danger"
                          size="sm"
                          className="btn btn-dim"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : item.status === "Paid" ? (
                      <span className="text-success">{item.status}</span>
                    ) : (
                      <span className="text-danger">{item.status}</span>
                    )}
                  </Col>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        ) : null}
      </Content>
    </React.Fragment>
  );
};

export default UserTransactions;
