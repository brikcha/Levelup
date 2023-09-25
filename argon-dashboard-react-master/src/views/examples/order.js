/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip
} from "reactstrap";
import { BsFillEyeFill } from 'react-icons/bs';
// core components
import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";


const Order = () => {
    const [users, setUsers] = useState([]);
    const [accessToken, setAccessToken] = useState("");    
    const history = useHistory();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const shippingPrice=7;
    
    

  // fetch coach 

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
  
  axios.get('http://localhost:5000/orders/', {
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

  

 // methode bloc user en tant que admin


//delete user admin


 
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">List of orders</h3>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">order id</th>
                    <th scope="col">total Price</th>
                    <th scope="col">tax Price</th>
                    <th scope="col">shipping Price</th>
                    <th scope="col">is Delivered</th>
                    <th scope="col">is Paid</th>
                    <th scope="col">Created At</th>


                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <><tr key={order._id}>
                    <th scope="row">
                      <Media className="align-items-center">
                        
                        <Media>
                          <span className="mb-0 text-sm">
                            {order._id}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{order.totalPrice}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{order.taxPrice}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{order.shippingPrice}</span>
                        <div>
                         
                        </div>
                      </div>
                    </td>
                    <td>
                    <Badge color="secondary"  href="#pablo"
        onClick={e => e.preventDefault()} pill>
                    {`${order.isDelivered}`}  </Badge>
                     
                    </td>
                    <td>
                    <Badge color={order.isPaid ? "success" : "danger"} href="#pablo" onClick={e => e.preventDefault()} pill>
  {`${order.isPaid}`}
</Badge>

                     
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{order.createdAt}</span>
                      </div>
                    </td>
                    <BsFillEyeFill  onClick={() => history.push(`/admin/update/${order._id}`)}
/>
                   
                   
                  </tr><tr>
                     
                     
                     
                    </tr></>
                ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        {/* Dark table */}
     
      </Container>
    </>
  );
};

export default Order;