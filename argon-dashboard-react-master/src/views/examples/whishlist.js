import Login from 'components/Footers/AuthFooter';
import React, { useState, useEffect } from 'react';
import { Input,FormGroup ,NavItem,NavLink,Button,  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,  DropdownToggle,
  Row,Col, Card, CardHeader,
  Table, Media} from "reactstrap";
import Rating from "react-rating-stars-component";
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { SwipeableDrawer } from '@mui/material';
import SwipeableTemporaryDrawer from './sidebar';
import cookie from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);




  const deleteProduct = (productId) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` 
      },
    };
  
    fetch(`http://localhost:5000/wish/whishlist/${productId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Update the wishlist state to reflect the changes
        setWishlists(prevState => {
          const updatedWishlists = prevState.map(wishlist => {
            if (wishlist.products.some(product => product._id === productId)) {
              return {
                ...wishlist,
                products: wishlist.products.filter(product => product._id !== productId)
              };
            } else {
              return wishlist;
            }
          });
          return updatedWishlists;
        });
        toast.success('Item added to cart successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          
        });
      })
      
      .catch((error) => {
        console.error('Error removing product from wishlist:', error);
      });
  }
  
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` 
      },
    };

    fetch('http://localhost:5000/wish/whishlist', requestOptions)
      .then(response => response.json())
      .then(data => {
        setWishlists(data.wishlists);
      })
      .catch((error) => {
        console.error('Error fetching wishlist:', error);
      });
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
            product Detail
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
      <h1 className="lead"style={{marginLeft:'40rem', marginTop:'1rem'}}>My Wishlist</h1>

      <Container className="mt--7" fluid >
        {/* Table */}

        <Row style={{marginTop:'10rem'}}>
          <div className="col">

            <Card className="shadow" >
      <CardHeader className="border-0">

      <Container>
      <Row>
      <Col xs="8">
                    <h3 className="mb-0">List of products</h3>
                  </Col>
        <Col className="text-right" xs="4">
                    <Button color="secondary" href="" size="sm">
                      <a >Add product </a>
                    </Button>
                  </Col>
   
      </Row></Container></CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">image</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {wishlists.map((wishlist) =>
            wishlist.products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td><img src={`http://localhost:5000${product.image}`} /></td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td className="text-right">
                  <UncontrolledDropdown>
                   
                  <Button
                          className="mr-4"
                          color="danger"
                          size="sm"
                            type="button" 
                            onClick={() => deleteProduct(product._id)}
                          >
                            Delete Product
                          </Button>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      </Card>
          </div>
        </Row>
      </Container>
  
    <Login />
    </>
  );
};

export default Wishlist;
