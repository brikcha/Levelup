import Login from 'components/Footers/AuthFooter'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Input,FormGroup ,NavItem,NavLink,Button,  DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,  DropdownToggle,
    Row,Col, Card, CardHeader,
    Table,
    Media,
    Badge} from "reactstrap";
  import Rating from "react-rating-stars-component";
  import { ToastContainer, toast } from 'react-toastify';
  import Container from 'react-bootstrap/Container';
  import Form from 'react-bootstrap/Form';
  import Nav from 'react-bootstrap/Nav';
  import Navbar from 'react-bootstrap/Navbar';
  import { SwipeableDrawer } from '@mui/material';
  import cookie from "js-cookie";
  
function ViewOrder(props) {
    const orderId = props.match.params.id;
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

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
    
    //   if (!accessToken || role !== "admin") {
    //     window.location.href = "http://localhost:3000/auth/login"; // Redirection vers la page de login
    //   }
    
    axios.get('http://localhost:5000/orders/user', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      })
        .then(response => {
          setOrders(response.data.orders);
        })
        .catch(error => {
          setError(error.response.data.error);
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
  return (
    <>
    <Navbar
        className="navbar-horizontal navbar-dark bg-gradient-info"
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
                  <NavLink href="/admin/forum">Forum</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="/productlist">ESHOP</NavLink>
              </NavItem>
                  <NavItem>
                      <NavLink href="/contact" onClick={handleLogout}>Logout</NavLink>
                  </NavItem>
              </Nav>
          </Container>
      </Navbar>
      <h2 style={{marginLeft:'15rem'}}>Order Details</h2>
      <Container style={{margintop:'5rem'}}>
      <Card style={{margintop:'2rem'}} >
   
               
                {orders && orders.map((order) => (
  <tr key={order._id}>
    <th scope="row">
      <Media className="align-items-center">
        <Media>
          <span className="mb-0 text-sm">
            orderId: {order._id}
          </span>
        </Media>
      </Media>
    </th>
    <p> price : {order.totalPrice}</p>
    <p>taxPrice :{order.taxPrice}</p>
    <p>shippingAddress :{order.shippingAddress}</p>
    <p> status : isDelivered ={order.isDelivered ? 'Yes' : 'No'}</p>
    <p>status : isPaid ={order.isPaid ? 'Yes' : 'No'}</p>
  </tr>
))}
              </Card></Container>
    <Login />
    </>
  )
}

export default ViewOrder