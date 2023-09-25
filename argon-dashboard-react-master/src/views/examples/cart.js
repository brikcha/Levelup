
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Modal from 'react-bootstrap/Modal';
import TextField from '@mui/material/TextField';
import { Button, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import {
  Container,
  Col,
  NavItem,
  NavLink,
} from "reactstrap";
import { ImFilePdf } from 'react-icons/im';

import { ToastContainer, toast } from 'react-toastify';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OrderDetail from './orderdetail';
import { async } from 'react-input-emoji';
import { FloatingLabel } from 'react-bootstrap';
import Login from 'components/Footers/AuthFooter';
import cookie from "js-cookie";
// import NavBar from './NavBar';
import Navbars from './NavBars';
import Footer from './Footer';
import { FaMoneyCheck } from 'react-icons/fa';

const useStyles = makeStyles({
  table: {
    margin: '20px auto',
    width: '80%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    fontSize: '16px',
  },
  th: {
    padding: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
  },
  td: {
    padding: '12px',
    border: '1px solid #ddd',
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  total: {
    marginTop: '20px',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    margin: '0 5px',
    fontSize: '14px',
    padding: '8px 16px',
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
  },
  placeOrder: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButton: {
    fontSize: '16px',
    padding: '10px 20px',
  },
});


function CartItems() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setphoneNumber] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  function handleCheckboxChange1() {
    setIsChecked1(!isChecked1);
  }

  function handleCheckboxChange2() {
    setIsChecked2(!isChecked2);
  }
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event.key === 'Tab' || event.key === 'Shift'))
    ) {
      return;
    }
    setIsOpen(open);
  };
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);}
  
  
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
   
     if (!accessToken || role !== "user") {
       history.push("/auth/login"); }// Rediriger vers la page de connexion
    async function getCartItems() {
      try {
        const response = await axios.get('http://localhost:5000/carts/list', {
          headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
        });
        setItems(response.data.items);


        // Calculate total price
        let price = 0;
        response.data.items.forEach(item => {
          price += item.quantity * item.price;
        });
        setTotalPrice(price);
        if (price > 0) {
          PayPalButton();
        }
        if (price > 0) {
          handleOrder();
        }
       

      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    }
    getCartItems();
  }, []); 
 
  const handleCancel = () => {
    setIsOpen(false);
    setShowCheckout(false); // hide the checkout button
  
  };
  const handleOrder = async (event) => {
    event.preventDefault();

  try {
    const response = await axios.post('http://localhost:5000/orders/', {
      shippingAddress,
      paymentMethod,
      items: cart,
      totalPrice: totalPrice
    }, {
      headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
    });
    console.log("==========> ",response.data.order);
    console.log("=====> ",response.data.order._id)
    setOrderId(response.data.order._id);
    setShowCheckout(true); // show the checkout button
    toast.success('Order created successfully!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeButton: true,
    });
   
  } catch (error) {
    console.log(error) ; 
  }
};
const handleGetInvoiceClick = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/orders/invoices/${orderId}`, { responseType: 'arraybuffer' });
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  } catch (error) {
    console.log(error);
  }
};

const handleEmptyCart = async (cartId) => {
  setIsLoading(true);
  try {
    const response = await axios.post(`/api/carts/${cartId}/empty`);
    setMessage(response.data.message);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
  const handleIncrement = async (cartId, productId) => {
    console.log("cartId:", cartId); // Add this line
    console.log("productId:", productId); // Add this line

    try {
      const response = await axios.put(`http://localhost:5000/carts/carts/${cartId}/${productId}`, {}, {
        headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
      });
      
      const responses = await axios.get('http://localhost:5000/carts/list', {
        headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
      });
      setItems(responses.data.items);

      // Calculate total price
      let price = 0;
      responses.data.items.forEach(item => {
        price += item.quantity * item.price;
      });
      setTotalPrice(price);

    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

useEffect(() => {
    // Load the cart data from localStorage on component mount
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (cartData) {
      setCart(cartData);
    }
  }, []);  
  const handlePayment = async () => {
    try {
      // TODO: Capture the payment and do additional processing here
    alert(' congrats, purchase complete !!');
    setTotalPrice(0);
    setItems([]);
    sessionStorage.removeItem('items');
    sessionStorage.removeItem('totalPrice');

    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };
 
 
const PayPalButton = ({ total }) => {
    useEffect(() => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total,
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          // Show an alert when the payment is approved
          alert('Payment approved!');
          // Capture the payment and do additional processing
          return actions.order.capture().then((details) => {
            alert(' congrats, purchase complete !!');

            // Set the price to 0
            handlePayment();
            console.log("Data ===> ",data);
            console.log("Actions ===> ",actions)
            console.log("Details =====> ",details)
           updateIsPaid(orderId);

            // order.isPaid=true;
            // Return a value to resolve the Promise
            return undefined;
          });
        }
      }).render('#paypal-btn');
    }, [total]);
  
    return ( 
      <div id="paypal-btn"></div>

    );
  };
  const handleDelete = async (cartId, productId) => {
    try {
      await axios.delete(`http://localhost:5000/carts/cart/${cartId}/${productId}`, {
        headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
      });
      const response = await axios.get('http://localhost:5000/carts/list', {
        headers: { 'Authorization':` Bearer ${sessionStorage.getItem('accessToken')} ` }
      });
      setItems(response.data.items);
      console.log("==========> ",response.data.order);
      console.log("=====> ",response.data.order._id)
      setCartId(response.data.cart._id);      // Calculate total price
      let price = 0;
      response.data.items.forEach(item => {
        price += item.quantity * item.price;
      });
      setTotalPrice(price);
      toast.error('Item deleted from cart !', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        closeButton: true,
        hideProgressBar: false,
       
        
      });
    } catch (error) {
      setErrorMessage(error.response.data.message);
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

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  const updateIsPaid = async (orderId) => {
    try {
      const mytoken = sessionStorage.getItem("accessToken");
      const requestOptions = {
        method: "PUT",
        headers: {
          // Authorization: Bearer ${mytoken},
          // "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPaid: true }),
      };
      const response = await fetch(
        `http://localhost:5000/orders/${orderId}`,
        requestOptions
      );
      const data = await response.json();
      if (data.message === "Is Paid true") {
        console.log("This order is Paid ");
      } else {
        console.log(data); // log the response data to the console
      }
    } catch (error) {
      console.log(error); // log any errors to the console
    }
  };
  return (
    <>
    <Navbars/>
   
  <TableContainer style={{marginTop:'7rem'}} component={Paper} className={classes.table}>
  <Table aria-label="cart items table">
    <TableHead>
      <TableRow>
      <TableCell align="right" className={classes.th}>Image</TableCell>

        <TableCell className={classes.th}>Product Name</TableCell>
        <TableCell align="center" className={classes.th}>Quantity</TableCell>
        <TableCell align="right" className={classes.th}>Price</TableCell>
        <TableCell align="right" className={classes.th}>Total</TableCell>
        <TableCell align="center" className={classes.th}>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id} className={classes.tr}>
<TableCell align="center" className={classes.td}>
  <img src={`http://localhost:5000${item.image}`} style={{ maxWidth: "100px", maxHeight: "100px" }} />
</TableCell>

          <TableCell component="th" scope="row" className={classes.td}>{item.name}</TableCell>
          <TableCell align="center" className={classes.td}>{item.quantity}</TableCell>
          <TableCell align="right" className={classes.td}>{item.price}dt</TableCell>
          <TableCell align="right" className={classes.td}>{item.quantity * item.price}</TableCell>
          <TableCell align="center" className={classes.td}>
            <div className={classes.actions}>
              <Button variant="outlined" color="secondary" className={classes.actionButton} onClick={() => handleIncrement(cart._id, item.productId)}>+</Button>
              <Button variant="outlined" color="danger" className={classes.actionButton} onClick={() => handleDelete(item.cartId, item.productId)}>Remove</Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
              <TableCell colSpan={3} />
              <TableCell align="right">Total:</TableCell>
              <TableCell align="right" className={classes.total}>{totalPrice}dt</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer> 
      
      <Col md={{ span: 4, offset: 7}}>

      <div className={classes.placeOrder}>
      <div>
      <Button color="primary" onClick={() => setIsOpen(true)} style={{marginBottom:"2rem", marginRight:"1rem"}} >Click here to Place Order</Button>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 500 }}>
        <h1 style={{textAlign:'center',marginTop: '2rem'}}>Order Form</h1>

          <Form style={{ marginTop: '3rem', marginRight: '1rem', marginLeft: '1rem' }}>

            <FormGroup>
              <Label for="exampleEmail">Shipping Adress</Label>
              <Input type="text" id="exampleEmail" value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)} placeholder="Shipping Adress" />
            </FormGroup>
            <FormGroup>
            <Label > Phone Number</Label>
              <Input type="number" id="exampleEmail" value={phoneNumber}
            onChange={(event) => setphoneNumber(event.target.value)} placeholder="+216   Phone Number" />
            </FormGroup>
            <div>
        <Label>Payment Method:</Label>
        <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
          <option value="">Select Payment Method</option>
          <option value="paypal">Paypal</option>
          <option value="payOnDelivery">Pay on Delivery</option>
        </select>
      </div>
         

          </Form>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        onClick={handleOrder}
        color="primary"
        size="lg"
        variant="outline-success"      
        style={{ marginRight: '1rem' ,marginTop:'1rem', marginLeft:'13rem'}}
      >
        Place Order
      </Button>
     
      <Button
        onClick={handleCancel} 
        variant="outline-warning"
        style={{marginRight:'4rem',marginTop:'1rem'}}
        size="lg"

      >
        Cancel
      </Button>
    </div>
      {showCheckout && (
              <div  style={{ alignItems: 'center' }}>
              <h3 className="lead" style={{ marginTop: '2rem', marginLeft:'13rem' }}><FaMoneyCheck />Click here to checkout</h3>
        <Button
          style={{ marginTop: '2rem', marginLeft:'13rem' }}
          size="lg"
          onClick={handleShow}
          variant="outline-primary"
          >
          Checkout
        </Button>
        <Button style={{ marginTop: '2rem'}}  onClick={handleGetInvoiceClick}><ImFilePdf/> Get Invoice</Button>
      {fileUrl && (
        <iframe src={fileUrl} width="100%" height="500px" title="Invoice" />
      )}</div>
      )}    
        </Box>
      </Drawer>
    </div>      
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Select a Payment Method </Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
        
       
<Col style={{marginTop:'1rem'}}>
              <Label>  <input
          type="checkbox"
          checked={isChecked2} 
          onChange={handleCheckboxChange2}
        />Pay with paypal</Label>              </Col>
 

                
              {isChecked2  && totalPrice > 0 && (
  <div className={classes.actions}>
    <Col style={{marginTop:'2rem' ,marginLeft: '5rem',size:'sm', marginRight: '2rem'}}>
    <PayPalButton total={totalPrice}  />
    </Col>
  </div>
)}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"   onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        <Button  href="/productList" style={{marginBottom:"2rem"}}  color="secondary" >Continue Shopping</Button>
     
      </div>

      </Col>
      {/* <div id='paypal-btn' style={{size:'small'}}></div> */}
<Footer />

</>

  );
}

export default CartItems;