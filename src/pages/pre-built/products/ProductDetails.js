import React, { useState, useEffect, useRef, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  Row,
  Icon,
  Block,
} from "../../../components/Component";
import { Badge, Card, Modal, ModalBody } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/API";

const ProductDetails = () => {
  const [counter, setCounter] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState("");
  const [view, setView] = useState({
    addItem: false,
  });
  const { id } = useParams();
  const user = JSON.parse(window.localStorage.getItem("profile"));

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
    // console.log(image);
    return `${API_URL}/products/${image}`;
  };

  // GET PRODUCTS
  const getProductsById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/getProductsById/${id}`);

      setProducts(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // GET CATEGORIES
  const getCategories = async () => {
    const response = await axios.get(`${API_URL}/products/getCategories`);
    setCategories(response.data);
  };

  const addToCart = async () => {
    await axios.post(`${API_URL}/cart/add-to-cart`, {
      product_id: id,
      user_id: user.id,
      qty: counter,
    });
    setView({ addItem: true });
  };

  useEffect(() => {
    getProductsById(id);
    getCategories();
  }, []);

  // increases quantity number
  const increaseCounter = () => {
    setCounter((prevState) => prevState + 1);
  };

  // decreases quantity number
  const decreaseCounter = () => {
    if (counter !== 0) {
      setCounter((prevState) => prevState - 1);
    }
  };

  // Closing Modal
  const onAddedToCart = () => {
    setView({ addItem: false });
  };

  // console.log(counter);
  return (
    <React.Fragment>
      <Head title="Product Detail"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockHeadContent>
              <BlockTitle>Product Details</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <Link to={`/`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
              </Link>
              <Link to={`/`}>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card>
            <div className="card-inner">
              <Row>
                <Col lg={6}>
                  <div className="product-gallery mr-xl-1 mr-xxl-5" style={{ borderRadius: "20px" }}>
                    <div className="slider-item rounded">
                      <img
                        style={{ maxHeight: "30%", borderRadius: "20px" }}
                        src={getImageUrl(products.image)}
                        className="w-100"
                        alt=""
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="product-info mt-5 mr-xxl-5">
                    <h4 className="product-price text-primary">{toCurrency(products.price)} </h4>
                    <h2 className="product-title">{products.name}</h2>
                    <div className="product-rating">
                      <ul className="rating">
                        <li>
                          <Icon name="star-fill"></Icon>
                        </li>
                        <li>
                          <Icon name="star-fill"></Icon>
                        </li>
                        <li>
                          <Icon name="star-fill"></Icon>
                        </li>
                        <li>
                          <Icon name="star-fill"></Icon>
                        </li>
                        <li>
                          <Icon name="star-half"></Icon>
                        </li>
                      </ul>
                      <div className="amount">(2 Reviews)</div>
                    </div>
                    <div className="product-excrept text-soft">
                      <p className="lead">{products.description}</p>
                    </div>
                    <div className="product-meta">
                      <ul className="d-flex g-3 gx-5">
                        <li>
                          <div className="fs-14px text-muted">Category</div>
                          <div className="fs-16px fw-bold text-secondary">
                            {products.category && products.category.category ? products.category.category : null}
                          </div>
                        </li>
                        <li>
                          <div className="fs-14px text-muted">Stocks</div>
                          <div className="fs-16px fw-bold text-secondary">
                            {products.total_stock} {products.unit}
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="product-meta">
                      <ul className="d-flex flex-wrap ailgn-center g-2 pt-1">
                        <li className="w-140px">
                          <div className="form-control-wrap number-spinner-wrap">
                            <Button
                              color="light"
                              outline
                              className="btn-icon number-spinner-btn number-minus"
                              onClick={() => decreaseCounter()}
                            >
                              <Icon name="minus"></Icon>
                            </Button>
                            <input
                              type="number"
                              className="form-control number-spinner"
                              value={counter}
                              onChange={(e) => setCounter(Number(e.target.value))}
                            />
                            <Button
                              color="light"
                              outline
                              className="btn-icon number-spinner-btn number-plus"
                              onClick={() => increaseCounter()}
                            >
                              <Icon name="plus"></Icon>
                            </Button>
                          </div>
                        </li>
                        <li>
                          {/* <Link to={`/add-to-cart`}> */}
                          <Button onClick={() => addToCart()} color="primary">
                            Add to Cart
                          </Button>
                          {/* </Link> */}
                        </li>
                        <li className="ml-n1">
                          <Button className="btn-icon btn-trigger text-primary">
                            <Icon name="heart"></Icon>
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Block>
        <Modal isOpen={view.addItem} toggle={() => onAddedToCart()} className="modal-dialog-centered" size="sm">
          <ModalBody>
            <div className="nk-modal-head">
              <h3 className="caption-text center">Added to cart</h3>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default ProductDetails;
