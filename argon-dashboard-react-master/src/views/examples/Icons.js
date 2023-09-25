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
  UncontrolledTooltip,
  Button

} from "reactstrap";
import Col from 'react-bootstrap/Col';

import { useHistory } from "react-router-dom";

// core components
import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import Editprod from "./Editprod";
import Swal from 'sweetalert2';

import axios from "axios";
const Icons = () => {
  const history = useHistory();

    const [products, setProducts] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    
    const deleteProduct = async (productId) => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this product!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it'
        });
    
        if (result.isConfirmed) {
          const response = await fetch(`http://localhost:5000/products/delete/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(data);
          // Update products list
          const updatedProducts = products.filter(product => product._id !== productId);
          setProducts(updatedProducts);
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        }
      } catch (error) {
        console.error(error);
      }
    };
    
   
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
    
      if (!accessToken || role !== "admin") {
        history.push("/auth/login"); // Rediriger vers la page de connexion
      } else {
        const fetchProduct = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/products/list`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            const data = response.data;
            if (role !== "admin") {
              setProducts(data.filter((user) => user._id === sessionStorage.getItem("_id")));
            } else {
              setProducts(data);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchProduct();
      }
    }, []);
    
    


  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">

            <Card className="shadow">
              <CardHeader className="border-0">
              <Container>
      <Row>
      <Col xs="8">
                    <h3 className="mb-0">List of products</h3>
                  </Col>
        <Col className="text-right" xs="4">
                    <Button color="secondary" href="" size="sm">
                      <a onClick={() => history.push("/admin/addproduct")}>Add product </a>
                    </Button>
                  </Col>
   
      </Row></Container>
             
              

              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price </th>
                    <th scope="col">category</th>
                    <th scope="col">stock</th>

                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {products.map((prod) => (
                    <><tr key={prod._id}>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                           <img
                              alt={`${prod.name}`} 
                              
                              src={`http://localhost:5000${prod.image}`} 
                          />

                        </a>
                        
                        <Media>
                          <span className="mb-0 text-sm">
                            {prod.name}
                          </span>
                        </Media>
                      </Media>
                      
                    </th>
                    <td>{prod.description}</td>
                    
                    <td>
                     {prod.price}
                    </td>
                    <td>
                     {prod.category}
                    </td>
                    <td>
                     {prod.stock}
                    </td>
                    
                    <td className="text-right">
                      <UncontrolledDropdown>
                        
                          <Button
                          className="mr-4"
                          color="danger"
                          size="sm"
                            type="button" 
                            onClick={() => deleteProduct(prod._id)}
                          >
                            Delete Product
                          </Button>
                          <Button 
                          onClick={() => history.push(`/admin/editproduct/${prod._id}`)}
                          className="mr-4"
                          color="info"
                          size="sm"
                          >
                         Update Product
                         </Button>
                        
                
                      </UncontrolledDropdown>
                
                    </td>
                  </tr><tr>
                     
                     
                     
                    </tr></>
                ))}
                </tbody>
              </Table>
              
            </Card>
          </div>
        </Row>
      </Container>
     
    </>
  );
};

export default Icons;