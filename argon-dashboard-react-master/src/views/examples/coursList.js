import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Badge,
  Card,
  Container,
  Row,
  Input,
  Button,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  CardImg,
  UncontrolledTooltip,
  Alert
} from "reactstrap";
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Header from "components/Headers/Header";
import { Slider } from "antd";
import ReactStars from "react-stars";

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
import Footer from "components/Footers/AdminFooter";
import Login from "components/Footers/AuthFooter";
import Sidebar from "components/Sidebar/Sidebar";
import SwipeableTemporaryDrawer from "./sidebar";
import cookie from "js-cookie";
import { useParams } from 'react-router-dom';
import { FaHandPointer } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CoursList = () => {
   
  const [cours, setCours] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [rating, setRating] = useState(0);
  const [filteredCours, setFilteredCours] = useState([]);
  //const [courseId, setCourseId] = useState('');
  const [selectedCours, setSelectedCours] = useState(null);
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
  
  
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredCours = cours.filter((cours) => {
      const coursTypeMatch = cours.type.toLowerCase().includes(query.toLowerCase());
      return coursTypeMatch ;
    });

    setFilteredCours(filteredCours);
  };
  
 
  const handleShow = (cours) => {
    setSelectedCours(cours);
    setShowDetailsModal(true);
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchCours = async () => {
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

      if (!accessToken || role !== "user" ) {
        history.push("/auth/login"); // redirect to login page
      } else {
        try {
          const response = await axios.get('http://localhost:5000/cours/list', {
            headers: {
              Authorization:` Bearer ${sessionStorage.getItem('accessToken')}`,
              "Content-Type": "application/json",
            },
          });
          const data = response.data;
          if (role !== 'user') {
            setCours(data.filter((cours) => cours._id === sessionStorage.getItem('_id')));
          } else {
            setCours(data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCours();
  }, [history]);

  useEffect(() => {
    const filtered = cours.filter(
      (cours) =>
        cours.type.toLowerCase().includes(searchQuery.toLowerCase()) 
        
    );

    setFilteredCours(filtered);
  }, [cours, searchQuery]);

 
  useEffect(() => {
    const coursWithAverage = cours.map((cours) => {
      const { ratings } = cours;
      if (!ratings) {
        return cours;
      }
      const ratingValues = Object.values(ratings);
      const sum = ratingValues.reduce((a, b) => a + b, 0);
      const average = sum / ratingValues.length;
      const roundedAverage = Math.round(average * 10) / 10;
      return {
        ...cours,
        averageRating: roundedAverage,
      };
    });
    setFilteredCours(coursWithAverage);
    console.log(filteredCours);

  }, [cours]);
  
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/cours/list")
      .then((response) => setCours(response.data))
      .catch((error) => console.error(error));
  }, []);
 
   
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
  
  const [subscribed, setSubscribed] = useState(false);
  const [ unsubscribed,  setUnsubscribed] = useState(false);
  

  const SubscribeCours = (id) => {
    axios
      .put(`http://localhost:5000/cours/sub/${id}`, {
        userId: sessionStorage.getItem("_id"),
      })
      .then((response) => {
        setSubscribed(true);
        setUnsubscribed(false);
        window.location.reload();
        alert("Subscribed avec success !");
      });
  };

  const unsubscribe = (id) => {
    axios
      .put(`http://localhost:5000/cours/unsubscribe/${id}`, {
        userId: sessionStorage.getItem("_id"),
      })
      .then((response) => {
        setSubscribed(false);
        setUnsubscribed(true);
        window.location.reload();
        alert(" You are Now unsibscribed!");
      });
  };

  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
  return (
    <>
    <Navbar
      className="navbar-horizontal navbar-dark bg-default"
      expand="lg"
    >
      <Container>
        <NavLink className="navbar-brand" href="/">
          LEVELUP         </NavLink>
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
      <Col md="6" style={{marginTop:'2rem'}}>
    <FormGroup>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" value={searchQuery}
            onChange={handleSearchInputChange}type="text" />
                </InputGroup>
              </FormGroup>
              </Col>
    <div className="search-bar">
  <div className="row">
    <div className="col-sm-6">
      <div className="form-group search-input">
        <div className="input-group">
      
          <div className="input-group-append">
           
          </div>
        </div>
      </div>
    </div>
    <div className="col-sm-6">
      <div className="form-group price-input">
        <div className="input-group">
          <div >
            <span>Type</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  
    <div className="product-grid">
      <Row xs={1} md={4} className="g-4">
        {filteredCours.map((cours) => (
          <Col key={cours._id}>
            <Card style={{ width: '15rem' }} border="secondary">
              
                <motion.div
        whileHover={{ rotate: isClicked ? 0 : -20, scale: isClicked ? 1 : 1.05 }}
        whileTap={{ rotate: isClicked ? 0 : 180, scale: isClicked ? 1 : 0.95 }}
        style={{
          width: "100%",
          height: "200px",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsClicked(!isClicked)}
      >
     <motion.img
  src={`http://localhost:5000${cours.image}`}
  alt="gym image"
  style={{
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: "10px",
    transformStyle: "preserve-3d",
    transform: "perspective(1000px)",
    backfaceVisibility: "hidden",
  }}
  whileTap={{
    rotate: 180,
    transition: { duration: 0.5 },
  }}
/>
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              transform: "translateZ(10px)",
              backfaceVisibility: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "#fff" }}>{cours.titre}</h4>
          </div>
        )}
      </motion.div>
              <CardBody>
                <CardTitle tag="h5">{cours.type}</CardTitle>
          
    
                <div>
                <span style={stringstyle}>
Average rating: {cours.averageRating ? cours.averageRating.toFixed(2) : 'N/A'}{' '}
</span>

                    <ReactStars
                      count={4}
                      size={24}
                      value={cours.averageRating}
                      edit={false}
                    />
                  </div>
                  <motion.button
  whileHover={{
    scale: 1.1,
    rotateY: 90,
    transition: { duration: 0.5 },
  }}
  whileTap={{ scale: 0.9 }}
  className="btn btn-blue btn-sm"
  onClick={() => history.push(`/cours/${cours._id}`)}
>
  <FontAwesomeIcon icon={faEye} />
  <span className="ml-2">View Details</span>
</motion.button>

                <i
  className={`fas fa-user-plus me-2 ${
    subscribed
      ? "text-danger"
      : cours.subscribers.includes(sessionStorage.getItem("_id"))
      ? "text-danger"
      : ""
  }`}
  onClick={() => {
    if (!cours.subscribers.includes(sessionStorage.getItem("_id"))) {
      SubscribeCours(cours._id);
      setSubscribed(true);
    }else {
      unsubscribe(cours._id);
      setSubscribed(false);
    }
  }}
/>
<i
  className={`fas fa-user-times me-2 ${
    unsubscribed
      ? "text-orange"
      : !cours.subscribers.includes(sessionStorage.getItem("_id"))
      ? "text-orange"
      : ""
  }`}
  onClick={() => {
    if (cours.subscribers.includes(sessionStorage.getItem("_id"))) {
      unsubscribe(cours._id);
      setSubscribed(true);
    } else {
      unsubscribe(cours._id);
      setSubscribed(false);
    }
  }}
></i>

          </CardBody>
            </Card>
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
    <Login />
  </>

        );
      };
    
    
export default CoursList;