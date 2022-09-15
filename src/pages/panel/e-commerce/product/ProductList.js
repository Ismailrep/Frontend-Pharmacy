import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  PreviewAltCard,
} from "../../../../components/Component";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { productData, unitOptions } from "./ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { Redirect } from "react-router";
import axios from "axios";
import { API_URL } from "../../../../constants/API";

const ProductList = () => {
  const admin = useSelector((state) => state.admin);

  // DATA
  const [data, setData] = useState(productData);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [sm, updateSm] = useState(false);
  const [categories, setCategories] = useState([]);

  // INPUTS
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    category_id: null,
    name: "",
    price: null,
    total_stock: null,
    unit: "",
    unit_per_bottle: null,
    description: "",
    category: {},
    fav: false,
    check: false,
  });
  const [addCategory, setAddCategory] = useState("");
  const [view, setView] = useState({
    edit: false,
    add: false,
    category: false,
    details: false,
  });
  const [errMsg, setErrMsg] = useState({});

  // SORT AND FILTER
  const [onSearchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState({ name: true, asc: true });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5);

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

  // GET PRODUCTS
  const getProducts = async (page) => {
    try {
      const response = await axios.post(`${API_URL}/products/getProducts`, {
        name: onSearchText,
        category_id: categoryId,
        sortBy,
        page,
        perPage: itemPerPage,
      });

      setProducts(response.data.products);
      setProductCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  // GET CATEGORIES
  const getCategories = async () => {
    try {
      let tempCategories = [];
      const response = await axios.get(`${API_URL}/products/getCategories`);
      await response.data.forEach((category) => {
        tempCategories.push({ value: category.id, label: category.category });
      });
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts(1);
    setCurrentPage(1);
  }, [onSearchText, categoryId, sortBy]);

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = productData.filter((item) => {
        return item.sku.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...productData]);
    }
  }, [onSearchText]);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    const number = /^[0-9]*$/;
    if (number.test(e.target.value)) {
      setFormData({ ...formData, [e.target.name]: +e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  // RESET INPUT STATE
  const resetForm = () => {
    setFormData({
      category_id: null,
      name: "",
      price: null,
      total_stock: null,
      unit: "",
      unit_per_bottle: null,
      description: "",
      category: {},
      check: false,
    });
    reset({});
  };

  // ADD NEW CATEGORY
  const btnAddCategory = async () => {
    try {
      await axios.post(`${API_URL}/products/addCategory`, { addCategory });
      setView({ ...view, category: false });
      getCategories();
    } catch (error) {
      console.log(error);
    }
  };

  // ADD PRODUCT
  const onFormSubmit = async () => {
    try {
      if (!formData.unit) return setErrMsg({ unit: "Unit is required" });
      if (!formData.category_id) return setErrMsg({ category_id: "Category is required" });
      if (!files.length) return setErrMsg({ file: "Image is required" });
      let form = new FormData();
      await form.append("file", files[0]);
      for (let key in formData) {
        await form.append(key, formData[key]);
      }
      await axios.post(`${API_URL}/products/addProduct`, form);
      getProducts(currentPage);
      setView({ open: false });
      setFiles([]);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE PRODUCT
  const onEditSubmit = async () => {
    try {
      let form = new FormData();
      form.append("file", files[0]);
      for (let key in formData) {
        form.append(key, formData[key]);
      }
      await axios.patch(`${API_URL}/products/updateProduct`, form);
      getProducts(currentPage);
      resetForm();
      setView({ edit: false, add: false });
    } catch (error) {
      console.log(error);
    }
  };

  // function that loads the want to editted data
  const onEditClick = (item) => {
    setFormData(item);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  // selects all the products
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.patch(`${API_URL}/products/delete/${id}`);
      getProducts(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  // Restore Deleted Product
  const setActive = async (id) => {
    try {
      await axios.patch(`${API_URL}/products/setActive/${id}`);
      getProducts(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    if (type === "category") {
      setView({ ...view, category: true });
    } else {
      setView({
        edit: type === "edit" ? true : false,
        add: type === "add" ? true : false,
        details: type === "details" ? true : false,
      });
    }
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getProducts(pageNumber);
  };

  const { errors, register, handleSubmit, reset } = useForm();

  if (!admin.id) {
    return <Redirect to={"/"} />;
  }

  return (
    <React.Fragment>
      <Head title="Products"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Products</BlockTitle>
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
                          placeholder="Quick search by Name"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>

                    <li>
                      <select
                        onChange={(e) => setCategoryId(+e.target.value)}
                        className="form-control pr-2"
                        name="category_id"
                        defaultValue={formData.category_id}
                        ref={register({ required: "This is required" })}
                      >
                        <option value={null}>All Category</option>
                        {categories.map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.category}
                            </option>
                          );
                        })}
                      </select>
                    </li>

                    <li>
                      <select
                        onChange={(e) => {
                          e.target.value.includes("name")
                            ? e.target.value.includes("asc")
                              ? setSortBy({ name: true, asc: true })
                              : setSortBy({ name: true, asc: false })
                            : e.target.value.includes("asc")
                            ? setSortBy({ name: false, asc: true })
                            : setSortBy({ name: false, asc: false });
                        }}
                        className="form-control"
                        name="sort"
                      >
                        <option value="nameasc">A - Z</option>
                        <option value="namedesc">Z - A</option>
                        <option value="priceasc">Lowest Price</option>
                        <option value="pricedesc">Highest Price</option>
                      </select>
                    </li>

                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Product</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="nk-tb-list is-separate is-medium mb-3">
            <DataTableHead className="nk-tb-item">
              <DataTableRow className="nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input form-control"
                    id="uid_1"
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className="custom-control-label" htmlFor="uid_1"></label>
                </div>
              </DataTableRow>
              <DataTableRow size="sm">
                <span>Name</span>
              </DataTableRow>

              <DataTableRow>
                <span>Price</span>
              </DataTableRow>

              <DataTableRow>
                <span>Category</span>
              </DataTableRow>

              <DataTableRow>
                <span>Stock</span>
              </DataTableRow>

              <DataTableRow size="md">
                <span>Per Bottle</span>
              </DataTableRow>

              <DataTableRow size="md">
                <span>Stock(Bottle)</span>
              </DataTableRow>

              <DataTableRow size="md">
                <span>Status</span>
              </DataTableRow>

              <DataTableRow className="nk-tb-col-tools">
                <ul className="nk-tb-actions gx-1 my-n1">
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
                            <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="edit"></Icon>
                              <span>Edit Selected</span>
                            </DropdownItem>
                          </li>

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

                          <li>
                            <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="bar-c"></Icon>
                              <span>Update Stock</span>
                            </DropdownItem>
                          </li>

                          <li>
                            <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="invest"></Icon>
                              <span>Update Price</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </DataTableRow>
            </DataTableHead>

            {products.length
              ? products.map((item) => {
                  return (
                    <DataTableItem key={item.id}>
                      <DataTableRow className="nk-tb-col-check">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input form-control"
                            defaultChecked={item.check}
                            id={item.id + "uid1"}
                            // key={Math.random()}
                            onChange={(e) => onSelectChange(e, item.id)}
                          />
                          <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                        </div>
                      </DataTableRow>
                      <DataTableRow size="sm">
                        <span className="tb-product">
                          <img src={item.image ? getImageUrl(item.image) : ProductH} alt="product" className="thumb" />
                          <span className="title">{item.name}</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">{toCurrency(item.price)}</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">{item.category.category}</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">
                          {Intl.NumberFormat("de-DE").format(item.total_stock)} {item.unit}
                        </span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span className="tb-sub">
                          {Intl.NumberFormat("de-DE").format(item.unit_per_bottle)} {item.unit}
                        </span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span className="tb-sub">{item.stock_bottle}</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        {item.is_deleted ? (
                          <span className="text-danger">Deleted</span>
                        ) : (
                          <span className="text-success">Active</span>
                        )}
                      </DataTableRow>
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
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        onEditClick(item);
                                        toggle("edit");
                                      }}
                                    >
                                      <Icon name="edit"></Icon>
                                      <span>Edit Product</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      href="#view"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        onEditClick(item);
                                        toggle("details");
                                      }}
                                    >
                                      <Icon name="eye"></Icon>
                                      <span>View Product</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    {item.is_deleted ? (
                                      <DropdownItem
                                        tag="a"
                                        href="#remove"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setActive(item.id);
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>Set Active</span>
                                      </DropdownItem>
                                    ) : (
                                      <DropdownItem
                                        tag="a"
                                        href="#remove"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          deleteProduct(item.id);
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Remove Product</span>
                                      </DropdownItem>
                                    )}
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
          </div>

          <PreviewAltCard>
            {products.length ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={productCount}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No products found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Product Name
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
                          {errors.name && <span className="invalid">{errors.name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="price">
                          Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="price"
                            onChange={(e) => onInputChange(e)}
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
                        <label className="form-label" htmlFor="total_stock">
                          Stock
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="total_stock"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.total_stock}
                          />
                          {errors.total_stock && <span className="invalid">{errors.total_stock.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="unit">
                          Unit
                        </label>
                        <div className="form-control-wrap">
                          <select
                            onChange={(e) => onInputChange(e)}
                            className="form-control"
                            name="unit"
                            defaultValue={formData.unit}
                            ref={register({ required: "This is required" })}
                          >
                            <option value={0}>Unit</option>
                            {unitOptions.map((unit) => {
                              return (
                                <option key={unit.id} value={unit.value}>
                                  {unit.label}
                                </option>
                              );
                            })}
                          </select>
                          {errMsg.unit && <span className="invalid">{errMsg.unit}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="unit_per_bottle">
                          Per Bottle({formData.unit})
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="unit_per_bottle"
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                            defaultValue={formData.unit_per_bottle}
                          />
                          {errors.unit_per_bottle && <span className="invalid">{errors.unit_per_bottle.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Stock(Bottle)</label>
                        <div className="form-control-wrap">
                          <input
                            disabled={true}
                            type="number"
                            className="form-control"
                            value={
                              formData.total_stock ? Math.floor(formData.total_stock / formData.unit_per_bottle) : 0
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category_id">
                          Category
                        </label>
                        <div className="form-control-wrap">
                          <select
                            onChange={(e) => onInputChange(e)}
                            className="form-control"
                            name="category_id"
                            defaultValue={formData.category_id}
                            ref={register({ required: "This is required" })}
                          >
                            <option value={null}>Category</option>
                            {categories.map((category) => {
                              return (
                                <option key={category.id} value={category.id}>
                                  {category.category}
                                </option>
                              );
                            })}
                          </select>
                          {errMsg.category_id && <span className="invalid">{errMsg.category_id}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Product Image
                        </label>
                        <div className="form-control-wrap">
                          <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                              <section>
                                <div
                                  {...getRootProps()}
                                  className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                                >
                                  <input {...getInputProps()} />
                                  {files.length === 0 && formData.image && (
                                    <img src={getImageUrl(formData.image)} alt="preview" />
                                  )}
                                  {files.map((file) => (
                                    <div
                                      key={file.name}
                                      className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                    >
                                      <div className="">
                                        <img src={file.preview} alt="preview" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="description">
                          Description
                        </label>
                        <div className="form-control-wrap">
                          <textarea
                            className="form-control"
                            name="description"
                            onChange={(e) => onInputChange(e)}
                            defaultValue={formData.description}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col size="12"></Col>

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
        </Modal>

        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                Product Details
                {/* <small className="text-primary">#{formData.sku}</small> */}
              </h4>
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <img src={formData.image ? getImageUrl(formData.image) : ProductH} alt="product" />
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Description</span>
                  <p>{formData.description ? formData.description : "no description"}</p>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">{toCurrency(formData.price)}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Category</span>
                  <span className="caption-text">{formData.category.category}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text">
                    {formData.total_stock} {formData.unit}
                  </span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Product</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Product Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Product Name"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.name}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        placeholder="Rp"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "Price is required" })}
                        defaultValue={formData.price}
                      />
                      {errors.price && <span className="invalid">{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6" />
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="total_stock">
                      Stock
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        name="total_stock"
                        placeholder="Stock"
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                        defaultValue={formData.total_stock}
                      />
                      {errors.total_stock && <span className="invalid">{errors.total_stock.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="unit">
                      Unit
                    </label>
                    <div className="form-control-wrap">
                      <select
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        name="unit"
                        defaultValue={formData.unit}
                        ref={register({ required: "This is required" })}
                      >
                        <option value={0}>Unit</option>
                        {unitOptions.map((unit) => {
                          return (
                            <option key={unit.id} value={unit.value}>
                              {unit.label}
                            </option>
                          );
                        })}
                      </select>
                      {errMsg.unit && <span className="invalid">{errMsg.unit}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="unit_per_bottle">
                      Per Bottle({formData.unit})
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="unit_per_bottle"
                        ref={register({ required: "This is required" })}
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        placeholder="100"
                        defaultValue={formData.unit_per_bottle}
                      />
                      {errors.unit_per_bottle && <span className="invalid">{errors.unit_per_bottle.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label">Stock(Bottle)</label>
                    <div className="form-control-wrap">
                      <input
                        disabled={true}
                        type="number"
                        className="form-control"
                        value={
                          formData.total_stock && formData.unit_per_bottle
                            ? Math.floor(formData.total_stock / formData.unit_per_bottle)
                            : 0
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <div className="d-flex flex-row justify-content-between align-items-center mb-1">
                      <label className="form-label" htmlFor="category_id">
                        Category
                      </label>
                      <Button size="sm" className="toggle" color="primary" onClick={() => toggle("category")}>
                        <Icon name="plus"></Icon>
                      </Button>
                    </div>
                    <div className="form-control-wrap">
                      <select
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        name="category_id"
                        defaultValue={formData.category_id}
                        ref={register({ required: "This is required" })}
                      >
                        <option value={null}>Category</option>
                        {categories.map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.category}
                            </option>
                          );
                        })}
                      </select>
                      {errMsg.category_id && <span className="invalid">{errMsg.category_id}</span>}
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
                              <div className="">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {errMsg.file && (
                    <span style={{ color: "red", fontStyle: "italic", fontSize: 11 }}>{errMsg.file}</span>
                  )}
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="description">
                      Description
                    </label>
                    <div className="form-control-wrap">
                      <textarea
                        className="form-control"
                        name="description"
                        placeholder="Product Description"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.description}
                      />
                    </div>
                  </div>
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
        </SimpleBar>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.category ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Category</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <Row className="g-3">
              <Col size="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="add_category">
                    Category
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="add_category"
                      placeholder="Category"
                      onChange={(e) => setAddCategory(e.target.value)}
                      defaultValue={addCategory}
                    />
                  </div>
                </div>
              </Col>

              <Col size="12">
                <Button disabled={!addCategory} onClick={btnAddCategory} className="mr-2" color="primary">
                  <span>Add Category</span>
                </Button>
                <Button onClick={() => setView({ ...view, category: false })} color="primary">
                  <span>Cancel</span>
                </Button>
              </Col>
            </Row>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ProductList;
