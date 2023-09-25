import {
  Badge,
  Card,
  Row,
  Input,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  InputGroupAddon,
  InputGroupText,
  CardImg,
  UncontrolledTooltip,
  Alert,
  UncontrolledPopover,
  PopoverBody
} from "reactstrap";
import { Button } from 'antd';

import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Header from "components/Headers/Header";
import { Divider, Typography } from "antd";
import Slider from '@mui/material/Slider';
import {   NavItem, NavLink, Dropdown,  UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem, Media, Container } from 'reactstrap';
import { Link } from "react-router-dom";
import ReactStars from "react-stars";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { InputGroup, FormControl } from 'react-bootstrap';
import Rating from "react-rating-stars-component";
import {FormGroup} from "reactstrap";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-bootstrap/Carousel';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, Nav, Navbar } from 'react-bootstrap';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Title } from "@mantine/core";
import { ToastContainer, toast } from 'react-toastify';
import storee from '../storee.jpg'
import store from '../store.jpg'
import Login from "components/Footers/AuthFooter";
import Sidebar from "components/Sidebar/Sidebar";
import SwipeableTemporaryDrawer from "./sidebar";
import cookie from "js-cookie";
// import ChatBot from "./ChatBot";
// import NavBar from "./NavBar";
import Footer from "./Footer";
import Navbars from "./NavBars";
import BestSellers from "./bestseller";
import styled from 'styled-components';
import Chatbot from "./chatbot";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [rating, setRating] = useState(0);


  const toggleSidebar = () => setShowSidebar(!showSidebar);
const [filteredProducts, setFilteredProducts] = useState([]);
const [minPrice, setMinPrice] = useState(0);

const [maxPrice, setMaxPrice] = useState(999999999); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const textStyle = {
    color: 'grey',
    fontSize: '1.5rem',
    fontStyle: 'italic'
  };
  const stringstyle = {
    color: 'black',
    fontSize: '1.2rem',
  };
  const buttonStyle = {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    backgroundColor: 'red',
    color: 'white',
    fontSize: '20px',
    // other styles...
  };
    // block s user n' est pas connecte
   
    useEffect(() => {
      // Set access token and role in cookie
      document.cookie =
        "accessToken=" + sessionStorage.getItem("accessToken") + ";path=/";
      document.cookie = "role=" + sessionStorage.getItem("role") + ";path=/";
      // Retrieve access token and role from cookie
      const cookies = document.cookie.split(";");
      let accessToken, role;
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.substring("accessToken=".length, cookie.length);
        } else if (cookie.startsWith("role=")) {
          role = cookie.substring("role=".length, cookie.length);
        }
      }
  
      if (!accessToken || role !== "user"   && role !== "coach") {
        history.push("/auth/login"); // rediriger vers la page de login
      } else {
        const ProductList = async () => {
          const response = await fetch(
            `http://localhost:5000/products/list`
            // {
            //   headers: {
            //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            //   },
          );
          const data = await response.json();
          if (role !== "user"  && role !== "coach") {
            setProducts(data);
          } else {
            setProducts(data);
          }
        };
        ProductList();
      }
    }, []);

  useEffect(() => {
    // Set access token and role in cookie
    document.cookie = "accessToken=" + sessionStorage.getItem("accessToken") + ";path=/";
    document.cookie = "role=" + sessionStorage.getItem("role") + ";path=/";
    // Retrieve access token and role from cookie
    const cookies = document.cookie.split(';');
    let accessToken, role;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("accessToken=")) {
        accessToken = cookie.substring("accessToken=".length, cookie.length);
      } else if (cookie.startsWith("role=")) {
        role = cookie.substring("role=".length, cookie.length);
      }
    }
  
    if (!accessToken ) {
      history.push("/auth/login"); // redirect to login page
    } else {
      const fetchProduct = async () => {
        try {
          const response = await axios.get('http://localhost:5000/products/list', {
            headers: {
              Authorization:` Bearer ${sessionStorage.getItem('accessToken')}`,
              "Content-Type": "application/json",
            },
          });
          const data = response.data;
          if (role !== 'user') {
            setProducts(data.filter((product) => product._id === sessionStorage.getItem('_id')));
          } else {
            setProducts(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchProduct();
    }
  }, []);
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log("Selected category:", event.target.value);

  };

  const handleMinPriceChange = (event, value) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (event, value) => {
    setMaxPrice(value);
  };  


  const handleWish = async (productId) => {

    try {
      const response=await fetch ('http://localhost:5000/wish/whishlist', {
        method: 'POST',

        headers: {          'Content-Type': 'application/json',
        'Authorization':` Bearer ${sessionStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        productId: productId,
      })
      });
      const data = await response.json();
      console.log(data);
      setMessage('Product added to wishlist');
      toast.success('Product added to wishlist successfully!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: <Button color="error" size="lg" onClick={() => history.push("/whishlist")}>wishlist</Button>,
        
      });
    } catch (error) {
      console.error(error);
      setMessage('Server error');
      toast.error('Item Already in whishlist!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        
        
      });
    }
  };
  const spring = {
    type: "spring",
    damping: 10,
    stiffness: 100
  }
  const handleShow = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    const filtered = products.filter(
      (prod) =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        prod.price >= minPrice &&
        prod.price <= maxPrice &&
        (selectedCategory === "all" || prod.category === selectedCategory)
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery, minPrice, maxPrice, selectedCategory]);
  

  useEffect(() => {
    const productsWithAverage = products.map((product) => {
      const { ratings } = product;
      if (!ratings) {
        return product;
      }
      const ratingValues = Object.values(ratings);
      const sum = ratingValues.reduce((a, b) => a + b, 0);
      const average = sum / ratingValues.length;
      const roundedAverage = Math.round(average * 10) / 10;
      return {
        ...product,
        averageRating: roundedAverage,
      };
    });
    setFilteredProducts(productsWithAverage);

  }, [products]);
 

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredProducts = products.filter((product) => {
      const productNameMatch = product.name.toLowerCase().includes(query.toLowerCase());
      const productPriceMatch = product.price >= minPrice && product.price <= maxPrice;
      const productCategoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      console.log("Product:", product);
      console.log("Product name match:", productNameMatch);
      console.log("Product price match:", productPriceMatch);
      console.log("Product category match:", productCategoryMatch);
      return productNameMatch && productPriceMatch && productCategoryMatch;
    });
    console.log("Filtered products:", filteredProducts);

    setFilteredProducts(filteredProducts);
  };
  
   
  const handleLogout = () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("role");
  
    fetch("http://localhost:5000/auth/logout", {
      method: 'POST',
      credentials: 'include' ,
    })
    .then(response => {
      if (response.status === 204) {
        // The cookie did not exist
        console.log(response);
        console.log('Cookie not found');
      } else if (response.status === 200) {
        // The cookie was cleared successfully
        console.log('Cookie cleared');  
        cookie.remove("jwt", response.accessToken);
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
        window.location.href = "http://localhost:3000/auth/login"; 
      }
    })
    .catch(error => {
      console.error('Error while logging out:', error);
    });
  };
  const name = sessionStorage.getItem("name");
  const [currentUser, setCurrentUser] = useState("");
  const getCuurentuser = async () => {
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "get",
      url: "http://localhost:5000/api/users/currentuser",
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
    };
    try {
      let ressul = axios(config);
      ressul.then((response) => setCurrentUser(response.data));
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getCuurentuser();
  }, []);

  
  const Title = styled.h1`
  font-family: 'Poppins', Poppins;
  font-size: 48px;
  text-align: center;
  margin-top: 50px;
`;


  return (
    <>
     <Navbar
         className="navbar-horizontal navbar-dark bg-default"
         expand="lg"
      >
        <Container>
          <NavLink className="navbar-brand" href="/">
            LEVELUP
          </NavLink>
          <button
            aria-controls="navbar-info"
            aria-expanded={false}
            aria-label="Toggle navigation"
            className="navbar-toggler"
            data-target="#navbar-info"
            data-toggle="collapse"
            id="navbar-info"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/acceuil">Home</NavLink>
            </NavItem>
            <NavItem>
         <NavLink href="/menu">Diet</NavLink>
       </NavItem>
            <NavItem>
              <NavLink href="/admin/user-profile">Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/homeuser">Gyms</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/courslist">Cours</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="/calendar">Online Session</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/forum">Forum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/productlist">ESHOP</NavLink>
              </NavItem>
              <NavItem>
<SwipeableTemporaryDrawer />              </NavItem>
            
          </Nav>
          <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={`http://localhost:5000${currentUser.image}`}
                    />
                  </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold text-white">
                          {name}
                        </span>

                      </Media>
                    </Media>
                  </DropdownToggle>
                  
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-settings-gear-65" />
                      <span>Settings</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-calendar-grid-58" />
                      <span>Activity</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-support-16" />
                      <span>Support</span>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="#pablo" onClick={handleLogout}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
        </Container>
      </Navbar>
      <Carousel>
  <Carousel.Item interval={5000}>
    <img
      className="d-block w-100"
      src={storee}
      alt="First slide"
    />
    <Carousel.Caption style={{ position: 'absolute', top: 50, right: 1000 }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Level Up Eshop</h3>
      <h3 style={{  fontSize: '1rem' }}>Welcome To our shop where you can find anything you want !!.</h3>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item interval={5000}>
    <img
      className="d-block w-100"
      src={storee}
      alt="First slide"
    />
    <Carousel.Caption style={{ position: 'absolute', top: 50, right: 1000 }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Level Up Eshop</h3>
      <h3 style={{  fontSize: '1rem' }}>Welcome To our shop where you can find anything you want !!.</h3>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
   
 

<Divider />
<Title>Check out our best sellers</Title>
{/* <Typography><h1>Check Our BestSellers</h1></Typography> */}
<Divider />
  <BestSellers />
  <Divider />
  <Title>Check out our Products</Title>
<Divider/>
<Card>
  <div className="d-flex justify-content-between" style={{marginTop:'2rem'}}>
    <Col md="4">
      <FormGroup>
        <InputGroup className="mb-4">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-zoom-split-in" />
            </InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} type="text" />
        </InputGroup>
      </FormGroup>
    </Col>

    <Col md="4">
      <div className="form-group search-input">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Category</span>
          </div>
          <select className="form-control" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">All categories</option>
            <option value="proteines">Proteines</option>
            <option value="weights">Weights</option>
            <option value="dietary supplement">Dietary supplement</option>
            <option value="machines">Machines</option>
            <option value="sport">Sport</option>
          </select>
        </div>
      </div>
    </Col>

    <Col md="4">
    <div className="form-group price-input">
  <div className="input-group">
    <Typography style={{ marginRight: "1rem" }} id="input-slider" gutterBottom>
      Price
    </Typography>
    <Slider
      range
      min={0}
      max={2500}
      value={[minPrice, maxPrice]}
      aria-label="Temperature"
      color="error"
      onChange={(event, values) => {
        handleMinPriceChange(event, values[0]);
        handleMaxPriceChange(event, values[1]);
      }}
      style={{ width: '70%' }}
    />
  </div>
</div>

    </Col>
  </div>
</Card>
    <div className="product-grid" style={{marginTop:'2rem'}}>
      <Row xs={1} md={4} className="g-4">
        {filteredProducts.map((prod) => (
          <Col key={prod._id}>
            
            <motion.div
  whileHover={{ scale: 1.1 }}
  style={{ width: '300px' , marginTop:'2rem',marginLeft:'2rem'}}
  border="secondary"
>
  <img
    variant="top"
    src={`http://localhost:5000${prod.image}`}
    alt={prod.name}
    style={{ width: '300px', height: '300px' }}
  />
  <CardBody>
    <CardTitle tag="h5">{prod.name}</CardTitle>
    <CardSubtitle tag="h6" className="mb-2 text-muted">
      {prod.price} €
    </CardSubtitle>
    <CardSubtitle tag="h6" className="mb-2 text-muted">
      {prod.category} 
    </CardSubtitle>

    <div>
      <span style={stringstyle}>
        Average rating: {prod.averageRating ? prod.averageRating.toFixed(2) : 'N/A'}{' '}
      </span>

      <ReactStars
        count={5}
        size={24}
        value={prod.averageRating}
        edit={false}
      />
    </div>
    <Button
      color="primary"
      onClick={() => history.push(`/product/${prod._id}`)}
      size="sm"
    >
      <FontAwesomeIcon icon={faEye} />
      <span className="ml-2">View Details</span>
    </Button>
    <Button className="fas fa-heart me-2"  onClick={() => handleWish(prod._id)} type="primary" danger>
    </Button>
  </CardBody>
</motion.div>

          </Col>
        ))}
      </Row>
    </div>
  
    <style jsx>{`
      .search-label {
        margin-left: 50px;
      }
  
      .search-input-field {
        margin-left: 20px;
      }
  
     
    `}</style>
    <Chatbot />
<Footer/>
  </>
  
  
  


  
        );
      };

export default ProductList;