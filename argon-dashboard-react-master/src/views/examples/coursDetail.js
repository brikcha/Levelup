import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card'; 
import { Col,Row } from "react-bootstrap";
 import Button from 'react-bootstrap/Button'
 import { Input,FormGroup ,NavItem,NavLink, DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,} from "reactstrap";
 import Rating from "react-rating-stars-component";


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
import { motion } from "framer-motion";

const CoursDetails = ({ match }) => {
  const [cours, setCours] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory(); 
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState("");
  const [coursId, setCoursId] = useState('');

  const [rotate, setRotate] = useState(true);
  
  
  /*useEffect(() => {
    setTimeout(() => {
      setRotate(false);
    }, 20000);
  }, []);*/
 
 
  
 

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
      .get(`http://localhost:5000/cours/list/${match.params.id}`)
      .then((response) => {
        setCours(response.data);
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  }, [match.params.id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!cours) {
    return <div>Loading cours...</div>;
  }
  
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  const handleSubmit = async (event, coursId) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(
        `http://localhost:5000/cours/cours/${coursId}/evaluate`,
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
  
      setMessage("Cours evaluated successfully!");
      toast.success("Cours evaluated successfully!", {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while evaluating the cours.");
      toast.error("An error occurred while evaluating the cours.", {
        position: toast.POSITION.TOP_RIGHT
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
        className="navbar-horizontal navbar-dark bg-gradient-info"
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
       <Container style={{ marginTop: "30px" }}>
      
        <Row>
        <Row>
          <Row>
  <Col md={1}  >
  <Card>
  <motion.div
    style={{
      width: "36rem",
      borderRadius: "10px",
      perspective: "500px", // ajouter une perspective pour la 3D
    }}
    animate={{ rotateY: 360 }} // faire une rotation complète de 360 degrés
    transition={{ duration: 2 }} // spécifier la durée de l'animation à 2 secondes
  >
    <Card.Img
      src={`http://localhost:5000${cours.image}`}
      alt={cours.title}
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
    />
  </motion.div>
</Card>



  </Col>
  </Row>
  <Col md={3}>
    <Row>
      <Col md={12}>
        <h1>{cours.title}</h1>
      </Col>
    </Row>
    <Row>
    <Col md={12}>
  <h5>Coach:</h5>
</Col>
<Col md={12}>
  <div className="d-flex align-items-center">
    <img className="avatar rounded-circle mr-3"
         alt={cours.coachName}
         src={cours.coachImage}
         width="80"
         height="80" 
          />
  </div>
  <br></br>
  
</Col>
      <Col md={12}>
        <h5>Description :</h5>
      </Col>
      <Col md={12}>
        <p>{cours.description}</p>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h5>Type:</h5>
      </Col>
      <Col md={12}>
        <p>{cours.type}</p>
      </Col>
    </Row>
  
    <Row>
      <Col md={12}>
        <h5>CoursHeure:</h5>
      </Col>
      <Col md={12}>
        <p>{cours.CoursHeure}</p>
      </Col> 
    </Row>
    <Rating
        count={5}
        size={24}
        activeColor="#ffd700"
        onChange={(value) => setRating(value)}
      />
      <Button onClick={(event) => handleSubmit(event, cours._id)}>Evaluate</Button>
     

    
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

<Login />
    
   
    </>
  );
};

export default CoursDetails;
