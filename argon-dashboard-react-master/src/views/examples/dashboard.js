import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import { Button } from "@tremor/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FaUsers, FaBox, FaShoppingCart, FaMoneyBillAlt } from 'react-icons/fa';

import {
    Badge,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    CardText,
    CardBody,
    CardTitle,
    Col,
    Container,
    Row,
    UncontrolledTooltip,
    Table,
  } from "reactstrap";
  import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
  } from "variables/charts.js";
  
function Dashboard() {
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [coachCount, setCoachCount] = useState(0);
    const [paidOrders, setPaidOrders] = useState(0);
    const [unpaidOrders, setUnpaidOrders] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [deliveredOrders, setdeliveredOrders] = useState(0);
    const [UndeliveredOrders, setUndeliveredOrders] = useState(0);
    const [inStockCount, setInStockCount] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [ordersday, setOrdersday] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/products/count')
          .then(response => {
            setProductCount(response.data.count);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
      
    useEffect(() => {
        axios.get('http://localhost:5000/orders/long')
          .then(response => {
            setOrderCount(response.data.count);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
      
  useEffect(() => {
    axios.get('http://localhost:5000/api/users/count')
      .then(response => {
        setUserCount(response.data.userCount);
        setAdminCount(response.data.adminCount);
        setCoachCount(response.data.coachCount);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders/count');
        setPaidOrders(response.data.paid);
        setUnpaidOrders(response.data.unpaid);
        setdeliveredOrders(response.data.delivered);
        setUndeliveredOrders(response.data.undelivered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderCount();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders/day');
        setOrdersday(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/stock');
        setInStockCount(response.data.inStock);
        setOutOfStockCount(response.data.outOfStock);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/orders/total');
        setTotal(response.data.total);
        setOrders(response.data.orders);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/orders/total');
        setTotal(response.data.total);
        setOrders(response.data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const chartData = {
    labels: ordersday.map((order) => order._id),
    datasets: [
      {
        label: 'Orders',
        data: ordersday.map((order) => order.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Orders Per Day',
    },
  };
  const data = {
    labels: ['User Count', 'Admin Count', 'Coach Count'],
    datasets: [
      {
        label: 'User Count',
        data: [userCount, adminCount, coachCount],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 205, 86, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const dataOrder = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [paidOrders, unpaidOrders],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const dataDel = {
    labels: ['Delivered', 'UnDelivered'],
    datasets: [
      {
        data: [deliveredOrders, UndeliveredOrders],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const dataStock = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        data: [inStockCount, outOfStockCount],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
 
  
  const options = {
    title: {
        display: true,
        text: 'Users ',
      },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const optionsOrder = {
    legend: {
      position: 'bottom'
    },
   
 
    
  };
  return (
    <>
        
<div className="bg-gradient-info pb-5 pt-5 pt-md-5">
  <Container fluid style={{ marginTop: '2rem' }}>
    <div className="header-body">
      <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col lg="3" xl="3">
          <Card className="mb-2 shadow-sm" style={{ background: 'linear-gradient(to bottom, #FFFFFF, #fb6340)' }}>
            <Card.Header className="text-dark">
              <FaUsers className="mr-2" />
              Users
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-dark">Total Users: {userCount}</Card.Title>
              <Button  className="btn btn-outline-light bg-transparent" style={{outline: 'none'}}>
              View More <FaArrowRight />
            </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" xl="3">
          <Card className="mb-2 shadow-sm" style={{ background: 'linear-gradient(to bottom, #00C9FF, #2dce89)' }}>
            <Card.Header className="text-dark">
              <FaBox className="mr-2" />
              Products
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-dark">Total Products: {productCount}</Card.Title>
              <Button  className="btn btn-outline-light bg-transparent" style={{outline: 'none'}}>
              View More <FaArrowRight />
            </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" xl="3">
          <Card className="mb-2 shadow-sm" style={{ background: 'linear-gradient(to bottom, #FF0084, #11cdef)' }}>
            <Card.Header className="text-dark">
              <FaShoppingCart className="mr-2" />
              Orders
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-dark">Total Orders: {orderCount}</Card.Title>
              <Button  className="btn btn-outline-light bg-transparent" style={{outline: 'none'}}>
              View More <FaArrowRight />
            </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" xl="3">
          <Card className="mb-2 shadow-sm" style={{ background: 'linear-gradient(to bottom, #FFFFFF, #11cdef )' }}>
            <Card.Header className="text-dark">
              <FaMoneyBillAlt className="mr-2" />
              Sales
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-dark">
                <h3>Total Sales: {total} DT</h3>
              </Card.Title>
            <a href='#sales'>
            <Button  className="btn btn-outline-light bg-transparent" style={{outline: 'none'}}>
              View More <FaArrowRight />
            </Button>
            </a>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
  </Container>
  
  </div>
  <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', padding: '10px' }}>
      <h2>User Count Chart</h2>
      <Card>
      <Bar data={data} options={options} /></Card>      </div>
      <div style={{ flex: '1', padding: '10px' }}>
      <h2>Orders Per Day</h2>
      <Bar data={chartData} options={chartOptions} />      </div>
    </div>
  <div>
   
      <div id='order' style={{marginTop:'2rem'}}>
      <h2>Order Chart</h2>
      <div style={{ display: 'flex' }}>
      <Card style={{ width: '50%', padding: '10px' , marginRight:'1rem'}}>
        <Doughnut data={dataOrder} options={optionsOrder} />
      </Card>
      <Card style={{ width: '50%', padding: '10px' }}>
        <Doughnut data={dataDel} options={optionsOrder} />
      </Card>
    </div>
    </div>
    </div>
 
  <div id="my-section" style={{marginTop:'2rem'}}>
  <h2>Products Chart</h2>

  <Card style={{ display: 'flex' }} >
    
  <Pie data={dataStock} />
      </Card>

  
</div>
<Row id='sales' className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Total Sales : {total} DT</h3>
                  </div>
                  <div className="col text-right">
                  
                  </div>
                </Row>
              </CardHeader>
<Table className="align-items-center table-flush" responsive>
<thead className="thead-dark">
          <tr>
            <th>Order ID</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </Table></Card></Col>
      </Row>

     


        </>  )
}

export default Dashboard