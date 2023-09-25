import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import { Col,Row } from "react-bootstrap";
 import { Input,FormGroup ,NavItem,NavLink, DropdownItem, DropdownMenu, Media, UncontrolledDropdown, DropdownToggle} from "reactstrap";
 import Rating from "react-rating-stars-component";
 import { Button } from 'antd';

 import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
 import { ToastContainer, toast } from 'react-toastify';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
 import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import Login from "components/Footers/AuthFooter";
// import { useCart } from "../contexts/cartContext";
import cookie from "js-cookie";
import Navbars from "./NavBars";
import Footer from "./Footer";
import SwipeableTemporaryDrawer from "./sidebar";

const ProductDetails = ({ match }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const history = useHistory();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState("");
  const [productId, setProductId] = useState('');
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



  // const { cart } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/list/${match.params.id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  }, [match.params.id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading product...</div>;
  }
  const addToCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':` Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      });
  
      const data = await response.json();
      console.log(data);
  
      // Show a notification and a button to view the cart
      toast.success('Item added to cart successfully!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: <Button variant="danger" onClick={() => history.push("/cart")}>cart</Button>,
        
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  const handleSubmit = async (event, productId) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(
        `http://localhost:5000/products/products/${productId}/evaluate`,
        {
          rating: rating
        },
        {
          headers: {
            Authorization:` Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      const data = response.data;
      console.log(data);
  
      setMessage("Product evaluated successfully!");
      toast.success("Product evaluated successfully!", {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while evaluating the product.");
      toast.error("An error occurred while evaluating the product.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
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
      toast.error('Product added to wishlist successfully!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: <Button  type="primary" danger size="lg" onClick={() => history.push("/whishlist")}>wishlist</Button>,
        
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
      </Navbar>       <Container style={{ marginTop: "30px" }}>
      
        <Row>
        <Row>
          <Row>
  <Col md={1}  >
    <Card.Img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: '36rem', borderRadius: "10px" }} />
  </Col>
  </Row>
  <Col md={3}>
    <Row>
      <Col md={12}>
        <h1>{product.name}</h1>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h5>Description :</h5>
      </Col>
      <Col md={12}>
        <p>{product.description}</p>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h5>Price :</h5>
      </Col>
      <Col md={12}>
        <p>{product.price} DT</p>
      </Col>
    </Row>
  
    <Row>
      <Col md={12}>
        <h5>Category:</h5>
      </Col>
      <Col md={12}>
        <p>{product.category}</p>
      </Col>
    </Row>
    <Rating
        count={5}
        size={24}
        activeColor="#ffd700"
        onChange={(value) => setRating(value)}
      />
      <Button onClick={(event) => handleSubmit(event, product._id)}>Evaluate</Button>
    <Button variant="success" size="lg" style={{ display: "block", marginTop: "2rem" }}>
      <FontAwesomeIcon icon={faShoppingCart} />
      <span className="ml-2" onClick={() => addToCart(product._id)}>Add to Cart</span>
    </Button>
    <Button  type="primary" danger size="lg" style={{ display: "block", marginTop: "2rem" }}>
      <i className="ni ni-favourite-28"></i>
      <span className="ml-2"  onClick={() => handleWish(product._id)}>Add To whishlist</span>
    </Button>
  </Col>
</Row>

        </Row>
    
    </Container>
<Container style={{ marginTop: "30px" }}>

    <Col md={12}>
        <Card>
  
    </Card>
  </Col>
</Container>

<Footer/>
   
    </>
  );
};

export default ProductDetails;
