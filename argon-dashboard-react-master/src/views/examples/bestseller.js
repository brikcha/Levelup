import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from './NavBars';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/');
        setBestSellers(response.data.slice(0, 3)); // Only display top 3 best sellers
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSellers();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    
  };
  return (
    <>
<div style={{ marginLeft:"35rem",marginRight:"40rem" }}>
  <Slider {...settings}>
    {bestSellers.map((product) => (
      <div key={product._id}>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Card>
            <img
              variant="top"
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              style={{ width: '300px', height: '300px' }}
            />
            <CardBody>
              <CardTitle tag="h5">{product.name}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                {product.price} €
              </CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                {product.category}
              </CardSubtitle>
              
            </CardBody>
          </Card>
        </motion.div>
      </div>
    ))}
  </Slider>
</div>


    </>
  );
};

export default BestSellers;
