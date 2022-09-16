import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Link } from "react-router-dom";
import {
  BlockHead,
  BlockDes,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Button,
  Block,
  Row,
  Col,
  PaginationComponent,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import axios from "axios";
import { API_URL } from "../../../constants/API";
import { productData, unitOptions } from "../../panel/e-commerce/product/ProductData";

const ProductCard = () => {
  const [data, setData] = useState(productData);

  const [sm, updateSm] = useState(false);
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
  const [view, setView] = useState({
    edit: false,
    add: false,
    category: false,
    details: false,
  });
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [files, setFiles] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [errMsg, setErrMsg] = useState({});

  // SORT AND FILTER
  const [onSearchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState({ name: true, asc: true });

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
      // console.log(response.data);
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
        return item.name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...productData]);
    }
  }, [onSearchText]);

  const toggle = () => {
    setView(!view);
  };

  // filter text
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
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

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // console.log("productCount:", productCount);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getProducts(pageNumber);
  };

  const { errors, register, handleSubmit, reset } = useForm();

  return (
    <React.Fragment>
      <Head title="Product List"></Head>
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
                          onChange={(e) => onFilterChange(e)}
                          placeholder="Quick search"
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
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            {products.length > 0 ? (
              products.map((item) => {
                return (
                  <Col xxl={3} lg={4} sm={6} key={item.id}>
                    <Card className="product-card">
                      <div className="product-thumb">
                        <Link to={`${process.env.PUBLIC_URL}/product-details/${item.id}`}>
                          <img
                            className="card-img-top"
                            style={{ maxHeight: "500px" }}
                            src={getImageUrl(item.image)}
                            alt=""
                          />
                        </Link>
                        <ul className="product-badges">
                          {/* {item.new && (
                            <li>
                              <Badge color="success">New</Badge>
                            </li>
                          )}
                          {item.hot && (
                            <li>
                              <Badge color="danger">New</Badge>
                            </li>
                          )} */}
                        </ul>
                        <ul className="product-actions">
                          <li>
                            <a href="#cart" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="cart"></Icon>
                            </a>
                          </li>
                          <li>
                            <a href="#like" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="heart"></Icon>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="card-inner text-center">
                        <ul className="product-tags">
                          <li>
                            <Link to={`${process.env.PUBLIC_URL}/product-details/${item.id}`}>{item.name}</Link>
                          </li>
                        </ul>
                        <h5 className="product-title">
                          <Link to={`${process.env.PUBLIC_URL}/product-details/${item.id}`}>{item.title}</Link>
                        </h5>
                        <div className="product-price text-primary h5">
                          {/* <small className="text-muted del fs-13px">IDR{item.prevPrice}</small> */}{" "}
                          {toCurrency(item.price)}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div className="ml-2">No product found</div>
            )}
          </Row>
          {products.length > 0 && (
            <div className="mt-3">
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={productCount}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default ProductCard;
