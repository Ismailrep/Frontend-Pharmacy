import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
  Spinner,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
} from "../../../../components/Component";
import ProfPic from "../../../../images/Ramu-profile-default.png";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { filterRole, filterStatus } from "../../../pre-built/user-manage/UserData";
import { bulkActionOptions, findUpper } from "../../../../utils/Utils";
import { Link, Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../../../constants/API";
import { useSelector } from "react-redux";

const AdminList = () => {
  const admin = useSelector((state) => state.admin);

  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [asc, setAsc] = useState(true);

  const [errMsg, setErrMsg] = useState({});
  const [complete, setComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // REGULAR EXPRESSION
  const namePattern = /^([a-zA-Z]{3,})$/;
  const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;

  // INPUT VALIDATION WITH REGULAR EXPRESSION
  const validName = namePattern.test(formData.first_name);
  const validMail = emailPattern.test(formData.email);

  const getAdmins = async (page) => {
    try {
      const response = await axios.post(`${API_URL}/admin/get-admins`, {
        page,
        perPage: itemPerPage,
        nameOrMail: onSearchText,
        asc,
      });
      setTotalAdmins(response.data.count);
      setAdmins(response.data.admins);
    } catch (error) {
      console.log(error);
    }
  };

  const setPerPage = (items) => {
    setItemPerPage(items);
    setCurrentPage(1);
    getAdmins(1);
  };

  const orderByName = (asc) => {
    setAsc(asc);
    setCurrentPage(1);
    getAdmins(1);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      getAdmins(1);
    }
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  const btnAddAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/admin/add-admin`, formData);
      setIsLoading(false);
      if (response.data == "email") {
        return setErrMsg({ ...errMsg, emailUsed: response.data });
      }
      alert("Admin successfully added and verification mail has been sent.");
      setModal({ ...modal, add: false });
      getAdmins(1);
    } catch (error) {
      console.log(error);
    }
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getAdmins(pageNumber);
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // HANDLE INVALID NAME
  useEffect(() => {
    if (!validName && formData.first_name) {
      setErrMsg({ name: "Min. 3 character." });
    } else {
      setErrMsg({ name: "" });
    }
  }, [validName, formData.first_name]);

  // HANDLE INVALID EMAIL
  useEffect(() => {
    if (!validMail && formData.email) {
      setErrMsg({ email: "Email isn't valid." });
    } else {
      setErrMsg({ email: "" });
    }
  }, [validMail, formData.email]);

  useEffect(() => {
    if (!formData.first_name || errMsg.name || !formData.email || errMsg.email) {
      setComplete(false);
    } else {
      setComplete(true);
    }
  }, [{ ...errMsg }]);

  useEffect(() => {
    getAdmins(1);
  }, [itemPerPage, asc]);

  useEffect(() => {
    if (!onSearchText) {
      getAdmins(1);
    }
  }, [onSearchText]);

  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Admin Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {totalAdmins} admins.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    {admin.id && admin.role === "Super Admin" && (
                      <li className="nk-block-tools-opt">
                        <Button color="primary" className="btn-icon pr-2" onClick={() => setModal({ add: true })}>
                          <Icon name="plus"></Icon>
                          <span>Add New Admin</span>
                        </Button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">All Admins</h5>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>

                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 5 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setPerPage(5);
                                        }}
                                      >
                                        5
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={!asc ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          orderByName(false);
                                          // setSortState("dsc");
                                          // sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={asc ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          orderByName(true);
                                          // setSortState("asc");
                                          // sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button className="search-back btn-icon toggle-search active">
                      <Icon name="search"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                      onKeyDown={onKeyDown}
                    />
                    <Button
                      className="search-submit btn-icon"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="cross"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DataTableBody>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow>

                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">Verified</span>
                </DataTableRow>

                <DataTableRow size="md">
                  <span className="sub-text">Role</span>
                </DataTableRow>

                {/* <DataTableRow className="nk-tb-col-tools text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color="tranparent"
                      className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                    >
                      <Icon name="plus"></Icon>
                    </DropdownToggle>
                    <DropdownMenu right className="dropdown-menu-xs">
                      <ul className="link-tidy sm no-bdr">
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="bl" />
                            <label className="custom-control-label" htmlFor="bl">
                              Balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="ph" />
                            <label className="custom-control-label" htmlFor="ph">
                              Phone
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="vri" />
                            <label className="custom-control-label" htmlFor="vri">
                              Verified
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="st" />
                            <label className="custom-control-label" htmlFor="st">
                              Status
                            </label>
                          </div>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </DataTableRow> */}
              </DataTableHead>
              {/*Head*/}

              {admins.length > 0
                ? admins.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              defaultChecked={item.checked}
                              id={item.id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item.id)}
                            />
                            <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                          </div>
                        </DataTableRow>

                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                            <div className="user-card">
                              <UserAvatar image={ProfPic}></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">
                                  {item.first_name} {item.last_name}
                                  <span
                                    className={`dot dot-${
                                      item.active_status === true ? "success" : "danger"
                                    } d-md-none ml-1`}
                                  ></span>
                                </span>
                                <span>{item.email}</span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <ul className="list-status">
                            <li key={item.uuid}>
                              <Icon
                                className={`text-${item.is_verified === true ? "success" : "danger"}`}
                                name={`${item.is_verified === true ? "check-circle" : "alert-circle"}`}
                              ></Icon>{" "}
                              <span>Email</span>
                            </li>
                          </ul>
                        </DataTableRow>

                        <DataTableRow size="md">
                          <span>{item.role}</span>
                        </DataTableRow>

                        {/* <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li onClick={() => setRedirect({ user_id: item.id })}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="tranx"></Icon>
                                        <span>Transactions</span>
                                      </DropdownItem>
                                    </li>
                                    {item.active_status == true && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => suspendUser(item.uuid)}>
                                          <DropdownItem
                                            tag="a"
                                            href="deactivate"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Deactivate User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                    {item.active_status == false && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => activateUser(item.uuid)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#activate"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="check-circle"></Icon>
                                            <span>Activate User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow> */}
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>

            <div className="card-inner">
              {admins.length > 0 ? (
                <div className="d-flex justify-content-end">
                  <PaginationComponent
                    itemPerPage={itemPerPage}
                    totalItems={totalAdmins}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add New Admin</h5>
              <div className="mt-4">
                <Form className="row gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        placeholder="Enter name"
                        onChange={inputHandler}
                      />
                      {errMsg.name && <span className="invalid">{errMsg.name}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        placeholder="Enter name"
                        onChange={inputHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col size={12}>
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder="Enter email"
                        onChange={inputHandler}
                      />
                      {errMsg.email && <span className="invalid">{errMsg.email}</span>}
                      {errMsg.emailUsed && <span className="invalid">Email already registered.</span>}
                    </FormGroup>
                  </Col>
                </Form>
                <Col>
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button
                        disabled={!complete || isLoading}
                        onClick={btnAddAdmin}
                        color="primary"
                        size="md"
                        type="submit"
                      >
                        {isLoading ? <Spinner size="sm" color="light" /> : "Add Admin"}
                      </Button>
                    </li>
                    <li>
                      <a
                        href="#cancel"
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </a>
                    </li>
                  </ul>
                </Col>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default AdminList;
