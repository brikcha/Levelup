import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import Header from 'components/Headers/Header';
import { Button, CardBody, Form, Input } from 'reactstrap';

const UpdateOrderForm = ({ match, history  }) => {
  const [products, setProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [deliveredAt, setdeliveredAt] = useState(new Date());
  const [taxPrice, setTaxPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {  
    fetch(`http://localhost:5000/orders/${match.params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
  }},)
      .then((res) => res.json())
      .then((data) => {
        setTaxPrice(data.taxPrice);
        setdeliveredAt(data.deliveredAt);
        setShippingAddress(data.shippingAddress);
        setIsDelivered(data.isDelivered);
        setIsPaid(data.isPaid);
        setShippingPrice(data.shippingPrice);
        setTotalPrice(data.totalPrice);
      })
      .catch((error) => console.error(error));
  }, [match.params.id, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');
    fetch(`http://localhost:5000/orders/update/${match.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ isDelivered, isPaid, taxPrice, shippingPrice,deliveredAt }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        history.push('/admin/order');
        Swal.fire({
          icon: 'success',
          title: 'Product updated successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        history.push("/admin/order");

        Swal.fire({

          icon: 'success',
          title: 'Product updated successfully!',
          showConfirmButton: false,
          timer: 1500,

        });
      }
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the product.',
      });
    });
};
  


  return (
    <>
    <Header />
    <CardBody>

    <Form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Order updated successfully</div>}
      <div>
        <label htmlFor="shippingAddress">Shipping Address:</label>
        <Input type="text" id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="paymentMethod">Payment Method:</label>
        <Input type="text" id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="isPaid">Is Paid:</label>
        <input type="checkbox" id="isPaid" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
      </div>
      <div>
        <label htmlFor="isDelivered">Is Delivered:</label>
        <input type="checkbox" id="isDelivered" checked={isDelivered} onChange={(e) => setIsDelivered(e.target.checked)} />
      </div>
      <div>
        <label htmlFor="deliveredAt">deliveredAt:</label>
        <Input type="Date" id="deliveredAt" value={deliveredAt} onChange={(e) => setdeliveredAt(e.target.value)} />
      </div>
      <div>
        <label htmlFor="taxprice">taxprice:</label>
        <Input type="number" id="isDelivered" value={taxPrice} onChange={(e) => setTaxPrice(e.target.value)} />
      </div>
      <div>
        <label htmlFor="taxprice">total price:</label>
        <Input type="number" id="isDelivered" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
      </div>
      <div>
        <label htmlFor="shippingprice">shippingprice:</label>
        <Input type="number" id="isDelivered" value={shippingPrice} onChange={(e) => setShippingPrice(e.target.value)} />
      </div>
      <Button type="submit" color='warning'>Update Order</Button>
    </Form>
    </CardBody>
    </>
  );
};

export default UpdateOrderForm;