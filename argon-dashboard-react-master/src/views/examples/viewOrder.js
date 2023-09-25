import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container } from 'reactstrap';
import Login from 'components/Footers/AuthFooter';
import Nav from 'react-bootstrap/Nav';
  import Navbar from 'react-bootstrap/Navbar';
  import { Input,FormGroup ,NavItem,NavLink,Button,  DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,  DropdownToggle,
    Row,Col, CardHeader,
    Table,
    Media,
    Badge} from "reactstrap";
    import { Link } from "react-router-dom";
    import cookie from "js-cookie";
    
const ViewOrder = () => {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:5000/orders/orderbyuser', {
          headers: {
             'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` 
          },
        });
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      }
    }

    fetchOrders();
  }, []);

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
  const handleLogout = () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("role");

    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 204) {
          // The cookie did not exist
          console.log(response);
          console.log("Cookie not found");
        } else if (response.status === 200) {
          // The cookie was cleared successfully
          console.log("Cookie cleared");
          cookie.remove("jwt", response.accessToken);
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          window.location.href = "http://localhost:3000/auth/login";
        }
      })
      .catch((error) => {
        console.error("Error while logging out:", error);
      });
  };
  return (
    (
<>
<Navbar
         className="navbar-horizontal navbar-dark bg-default"
         expand="lg"
      >
        <Container>
          <NavLink className="navbar-brand" href="/">
            Order Detail
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
      <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg rounded-lg"  style={{ width: "80%", margin: "auto" }}  border="1px solid #ccc">
        <h2 className="text-center mb-4">My Orders</h2>
        <Row className="font-weight-bold">
          <Col xs="3">Order ID</Col>
          <Col xs="2">Order Total</Col>
          <Col xs="4">Shipping Address</Col>
          <Col xs="3">Status</Col>
        </Row>
        {orders.map((order) => (
          <Row key={order._id} className="mt-2">
            <Col xs="3">{order._id}</Col>
            <Col xs="2">{order.totalPrice}</Col>
            <Col xs="4">{order.shippingAddress}</Col>
            <Col xs="3">
              <div className={`status ${order.isDelivered ? 'delivered' : 'undelivered'}`}>
                {order.isDelivered ? 'Delivered' : 'Undelivered'}
              </div>
              <div className={`status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </div>
            </Col>
            <Col xs="12">
              <ul className="pl-0">
                {order.products.map((item) => (
                  <li key={item._id} className="mt-2">
                    <div className="product-info border rounded-lg p-3">
                      <div className="font-weight-bold">Products: {item.name}</div>
                      <div>Price: {item.price}</div>
                      <div>Quantity: {item.quantity}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        ))}
      </Card>
    </Container>
      <Login />
      </>
    ))
};

export default ViewOrder;
