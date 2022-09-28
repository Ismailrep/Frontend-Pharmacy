import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import { productData, categoryOptions } from "./pre-built/products/ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../components/Component";
import axios from "axios";
import { API_URL } from "../constants/API";
import { useParams } from "react-router";

const CartList = () => {
  const user = JSON.parse(window.localStorage.getItem("profile"));
  const [cartData, setCartData] = useState([]);
  const [data, setData] = useState(cartData);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [sm, updateSm] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  // const [qty, setQty] = useState("");
  const [sortBy, setSortBy] = useState({ name: true, asc: true });
  const [formData, setFormData] = useState({
    name: "",
    img: null,
    sku: "",
    price: 0,
    stock: 0,
    category: [],
    fav: false,
    check: false,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
    deleted: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [files, setFiles] = useState([]);
  const { id } = useParams();

  // Changing state value when searching name
  // useEffect(() => {
  //   if (onSearchText !== "") {
  //     const filteredObject = productData.filter((item) => {
  //       return item.sku.toLowerCase().includes(onSearchText.toLowerCase());
  //     });
  //     setData([...filteredObject]);
  //   } else {
  //     setData([...productData]);
  //   }
  // }, [onSearchText]);

  // GET CATEGORIES
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/getCategories`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // GET CART DATA
  const getCart = async (page) => {
    try {
      const response = await axios.get(`${API_URL}/cart/cart-item/${id}`, {
        name: onSearchText,
        sortBy,
        page,
        perPage: itemPerPage,
      });

      const tempCart = [];

      for (let item of response.data) {
        tempCart.push({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          qty: item.qty,
          category: item.product.category.category,
          unit: item.product.unit,
        });
        // console.log(tempCart);
      }

      setCartData(tempCart);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(cartData);

  // DELETE CART ITEM
  const delItem = async (product_id) => {
    try {
      // console.log(product_id, user.id);
      await axios.delete(`${API_URL}/cart/delete-cart-item`, {
        data: {
          user_id: user.id,
          product_id,
        },
      });
      setView({ deleted: true });
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  // CLOSING MODAL
  const onDelete = () => {
    setView({ deleted: false });
  };

  // UPDATE QUANTITY
  const updateQty = async (product_id, e) => {
    try {
      await axios.patch(`${API_URL}/cart/update-cart-item`, {
        product_id: product_id,
        user_id: user.id,
        qty: e,
      });
    } catch (error) {
      console.log(error);
    }
    getCart();
  };

  // INCREASING QUANTITY
  const increaseQty = (id) => {
    setCartData((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          updateQty(obj.id, obj.qty + 1);
          return { ...obj, qty: obj.qty + 1 };
        }
        return obj;
      })
    );
  };

  // DECREASING QUANTITY
  const decreaseQty = (id) => {
    setCartData((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          // console.log(obj);
          if (obj.qty !== 0) {
            updateQty(obj.id, obj.qty - 1);
            return { ...obj, qty: obj.qty - 1 };
          } else if (obj.qty === 1) {
            // delItem(obj.id);
          }
        }
        return obj;
      })
    );
  };

  // GET TOTAL PRICE
  const totalPrice = () => {
    let pricesArr = cartData.map(({ price }) => price);
    let qtyArr = cartData.map(({ qty }) => qty);

    let priceTotal = 0;
    for (let i = 0; i < pricesArr.length; i++) {
      priceTotal += pricesArr[i] * qtyArr[i];
    }

    return priceTotal;
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

  // GET IMAGE URL
  const getImageUrl = (image) => {
    return `${API_URL}/products/${image}`;
  };

  useEffect(() => {
    getCart(id);
    getCategories();
    totalPrice();
  }, [onSearchText, sortBy]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = cartData.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = cartData.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getCart(pageNumber);
  };

  const { errors, register, handleSubmit, reset } = useForm();

  return (
    <React.Fragment>
      <Head title="Product List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Cart</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    {/* <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      <Button className="toggle btn-icon d-md-none" color="primary" onClick={() => {}}>
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button className="toggle d-none d-md-inline-flex" color="primary" onClick={() => {}}>
                        <span>Checkout</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    {/* <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="uid_1"
                          onChange={(e) => selectorCheck(e)}
                        />
                        <label className="custom-control-label" htmlFor="uid_1"></label>
                      </div>
                    </DataTableRow> */}
                    <DataTableRow size="sm">
                      <span>Name</span>
                    </DataTableRow>
                    {/* <DataTableRow>
                      <span>SKU</span>
                    </DataTableRow> */}
                    <DataTableRow>
                      <span>Price</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Quantity</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Unit</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Category</span>
                    </DataTableRow>
                    {/* <DataTableRow size="md">
                      <Icon name="star-round" className="tb-asterisk"></Icon>
                    </DataTableRow> */}
                    <DataTableRow className="nk-tb-col-tools">
                      {/* <ul className="nk-tb-actions gx-1 my-n1">
                        <li className="mr-n1">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              tag="a"
                              href="#toggle"
                              onClick={(ev) => ev.preventDefault()}
                              className="dropdown-toggle btn btn-icon btn-trigger"
                            >
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#remove"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      selectorDeleteProduct();
                                    }}
                                  >
                                    <Icon name="trash"></Icon>
                                    <span>Remove Selected</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul> */}
                    </DataTableRow>
                  </DataTableHead>
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        // console.log(item);
                        return (
                          <DataTableItem key={item.id}>
                            {/* <DataTableRow className="nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  defaultChecked={item.check}
                                  id={item.id + "uid1"}
                                  key={Math.random()}
                                  onChange={(e) => onSelectChange(e, item.id)}
                                />
                                <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                              </div>
                            </DataTableRow> */}
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <img
                                  src={item.image ? getImageUrl(item.image) : ProductH}
                                  alt="product"
                                  className="thumb"
                                />
                                <span className="title">{item.name}</span>
                              </span>
                            </DataTableRow>
                            {/* <DataTableRow>
                              <span className="tb-sub">{item.sku}</span>
                            </DataTableRow> */}
                            <DataTableRow>
                              <span className="tb-sub">{toCurrency(item.price * item.qty)}</span>
                            </DataTableRow>
                            <DataTableRow>
                              {/*///////// QUANTITY EDIT ////////*/}
                              <div className="form-control-wrap number-spinner-wrap w-140px">
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    border: "none",
                                    padding: "7px",
                                    backgroundColor: "",
                                  }}
                                  type="button"
                                  outline
                                  className="btn-icon number-spinner-btn number-minus"
                                  disabled={item.qty === 1 ? true : false}
                                  onClick={() => decreaseQty(item.id)}
                                >
                                  <Icon name="minus"></Icon>
                                </button>
                                <input
                                  type="number"
                                  style={{ borderColor: "white", backgroundColor: "transparent" }}
                                  className="form-control number-spinner"
                                  value={item.qty}
                                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                                />
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    border: "none",
                                    padding: "7px",
                                    backgroundColor: "",
                                  }}
                                  type="button"
                                  className="btn-icon number-spinner-btn number-plus"
                                  onClick={() => increaseQty(item.id)}
                                >
                                  <Icon name="plus"></Icon>
                                </button>
                              </div>
                              {/* <span className="tb-sub">{item.qty}</span> */}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.unit}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.category}</span>
                            </DataTableRow>
                            {/* <DataTableRow size="md">
                              <div className="asterisk tb-asterisk">
                                <a
                                  href="#asterisk"
                                  className={item.fav ? "active" : ""}
                                  onClick={(ev) => ev.preventDefault()}
                                >
                                  <Icon name="star" className="asterisk-off"></Icon>
                                  <Icon name="star-fill" className="asterisk-on"></Icon>
                                </a>
                              </div>
                            </DataTableRow> */}
                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                <li className="mr-n1">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            style={{ cursor: "pointer" }}
                                            tag="a"
                                            onClick={() => delItem(item.id)}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Item</span>
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div style={{ fontWeight: "bold", textAlign: "center", marginTop: "20px" }}>
                  <div>PRICE TOTAL:</div>
                  <div style={{ fontSize: "large" }}>{toCurrency(totalPrice())}</div>
                </div>
                <div className="card-inner">
                  {currentItems.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={cartData.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No products found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        {/* <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Product Title
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: "This field is required",
                            })}
                            defaultValue={formData.name}
                          />
                          {errors.title && <span className="invalid">{errors.title.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="price"
                            ref={register({ required: "This is required" })}
                            className="form-control"
                            defaultValue={formData.price}
                          />
                          {errors.price && <span className="invalid">{errors.price.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sale-price">
                          Sale Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="salePrice"
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.price}
                          />
                          {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="stock">
                          Stock
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="stock"
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.stock}
                          />
                          {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="SKU">
                          SKU
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="sku"
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.sku}
                          />
                          {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Category
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            isMulti
                            options={categoryOptions}
                            defaultValue={formData.category}
                            onChange={onCategoryChange}
                            //ref={register({ required: "This is required" })}
                          />
                          {errors.category && <span className="invalid">{errors.category.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Product Image
                        </label>
                        <div className="form-control-wrap">
                          <img src={formData.img} alt=""></img>
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div
                              {...getRootProps()}
                              className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                            >
                              <input {...getInputProps()} />
                              {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                              {files.map((file) => (
                                <div
                                  key={file.name}
                                  className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                >
                                  <div className="dz-image">
                                    <img src={file.preview} alt="preview" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Product</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal> */}

        {/* <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Product <small className="text-primary">#{formData.sku}</small>
              </h4>
              <img src={formData.img} alt="" />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">$ {formData.price}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Category</span>
                  <span className="caption-text">
                    {formData.category.map((item, index) => (
                      <Badge key={index} className="mr-1" color="secondary">
                        {item.value}
                      </Badge>
                    ))}
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text"> {formData.stock}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal> */}

        {/* <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Product</BlockTitle>
              <BlockDes>
                <p>Add information or update product.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                      Product Title
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.name}
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Regular Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="price"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={formData.price}
                      />
                      {errors.price && <span className="invalid">{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Sale Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="salePrice"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.price}
                      />
                      {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Stock
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.stock}
                      />
                      {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="SKU">
                      SKU
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="sku"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.sku}
                      />
                      {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">
                      Category
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        options={categoryOptions}
                        onChange={onCategoryChange}
                        value={formData.category}
                        //ref={register({ required: "This is required" })}
                      />
                      {errors.category && <span className="invalid">{errors.category.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className="dropzone upload-zone small bg-lighter my-2 dz-clickable">
                          <input {...getInputProps()} />
                          {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                          {files.map((file) => (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar> */}

        {/* {view.add && <div className="toggle-overlay" onClick={toggle}></div>} */}
        <Modal isOpen={view.deleted} toggle={() => onDelete()} className="modal-dialog-centered" size="sm">
          <ModalBody>
            <div className="nk-modal-head">
              <h3 className="caption-text center">Item removed</h3>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default CartList;
