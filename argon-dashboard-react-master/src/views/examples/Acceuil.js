

import React from 'react';
import cookie from "js-cookie";
import {
    Navbar,
    Nav,
    NavItem,
    NavLink,
    Container,
   
  } from "reactstrap";
  import { motion } from "framer-motion";
  import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
  import CastForEducationSharpIcon from '@mui/icons-material/CastForEducationSharp';
  import video from '../examples/video/video.mp4'
  import {  useHistory } from "react-router-dom";
  import { useEffect, useState } from "react";
// import ChatBot from './ChatBot';
import ReactPlayer from 'react-player';
  import image from './video/img.png'
  import forum from './video/forum.png'
  import cours from './video/cours.png'
  import gym from './video/gym.jpg'
  // import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
  import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
  import IconButton from '@mui/material/IconButton';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import { CiUser,CiDumbbell } from "react-icons/ci";
  import { MdPlayLesson, MdForum, MdOutlineShoppingCart} from "react-icons/md";

import Login from 'components/Footers/AuthFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from './Footer';
import { AiOutlineHeart, AiOutlineHome } from 'react-icons/ai';
import { ContactEmergency } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { FaUtensils } from 'react-icons/fa';
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
  
  
function Acceuil() {
    const history = useHistory();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      // Rediriger vers la page de connexion
      history.push('/auth/login');
    }
  }, [history]);
    
  return (
    <>
 <div style={{ position: "relative" }}>
  <ReactPlayer
    url={video}
    playing
    muted
    loop
    width="100%"
    height="75%"
    style={{ position: "", top: "", left: "", transform: "" }}
  />
  <div style={{ 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)",
    zIndex: "1"
  }}>
    <h1
      style={{
        color: "#fff",
        fontSize: "3rem",
        textAlign: "center",
        textShadow: "1px 1px 3px #000",
      }}
    >
      Level Up
    </h1>
    <h2
      style={{
        color: "#fff",
        fontSize: "2rem",
        textAlign: "center",
        textShadow: "1px 1px 3px #000",
      }}
    >
      Welcome to our platform
    </h2>
  </div>
  <div style={{ 
    position: "absolute", 
    top: "3px", 
    left: "10px", 
    right: "10px", 
    display: "flex", 
    justifyContent: "flex-start",
    zIndex: "1",
    marginTop:"1rem"
  }}>
   <a href="/acceuil" style={{ color: "#000000", textDecoration: "none", marginRight: "3rem",marginLeft:"20rem" }}>
   <AiOutlineHome style={{ marginBottom: "2px" }} />
    Home</a>
    <a href="/menu"style={{ color: "#000000", textDecoration: "none", marginRight: "3rem" }}>
      <FaUtensils />
      Menu Planing</a>
    <a href="/productlist" style={{ color: "#000000", textDecoration: "none",marginRight: "3rem" }}>
      <MdOutlineShoppingCart />
      Eshop</a>
    <a href="/admin/forum" style={{ color: "#000000", textDecoration: "none",marginRight: "3rem" }}>
      <MdForum />
      Forum</a>
    <a href="/homeuser" style={{ color: "#000000", textDecoration: "none", marginRight: "3rem"  }}>
      <CiDumbbell />
      Gyms</a>
    <a href="/admin/user-profile" style={{ color: "#000000", textDecoration: "none", marginRight: "3rem" }}>
      <CiUser />
      Profile</a>
    <a href="/courslist"style={{ color: "#000000", textDecoration: "none", marginRight: "3rem" }}>
      <MdPlayLesson />
      Cours</a>
      
</div>

</div>
<Container style={{marginBottom:'10rem'}}>
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
<div>
  <Divider />
      <h1>App Features</h1>
<Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5rem",
          flexDirection: "row"
        }}
      >
   <motion.div whileHover={{ scale: 1.2 }}>
  <Card style={{ margin: '1rem', transform: 'scale(1.2)', width: '250px', height: '300px',marginRight:"2rem" }}>
    <CardMedia
      component="img"
      height="210"
      width="210"
      image={image}
      alt="eshop 1"
    />
    <CardContent>
      <Typography variant="h4" component="h2" align="center">
        ESHOP 
      </Typography>
      <Typography variant="subtitle1" component="h3" align="center">
Find a large selection of ... products      </Typography>
    </CardContent>
  </Card>
</motion.div>

<motion.div whileHover={{ scale: 1.2 }}>
  <Card style={{ margin: '1rem', transform: 'scale(1.2)', width: '250px', height: '300px' , marginRight:"5rem", marginLeft:"5rem"}}>
    <CardMedia
      component="img"
      height="210"
      width="210"
      image={gym}
      alt="eshop 1"
    />
    <CardContent>
      <Typography variant="h4" component="h2" align="center">
GYM      </Typography>
      <Typography variant="subtitle1" component="h3" align="center">
Find the best gyms    for you  </Typography>
    </CardContent>
  </Card>
</motion.div>
<motion.div whileHover={{ scale: 1.2 }}>
  <Card style={{ margin: '1rem', transform: 'scale(1.2)', width: '250px', height: '300px' , marginRight:"5rem"}}>
    <CardMedia
      component="img"
      height="210"
      width="210"
      image={forum}
      alt="eshop 1"
    />
    <CardContent>
      <Typography variant="h4" component="h2" align="center">
FORUM      </Typography>
      <Typography variant="subtitle1" component="h3" align="center">
Communicate with other members and add your friends      </Typography>
    </CardContent>
  </Card>
</motion.div>
<motion.div whileHover={{ scale: 1.2 }}>
  <Card style={{ margin: '1rem', transform: 'scale(1.2)', width: '250px', height: '300px' , marginRight:"5rem"}}>
    <CardMedia
      component="img"
      height="210"
      width="210"
      image={cours}
      alt="eshop 1"
    />
    <CardContent>
      <Typography variant="h4" component="h2" align="center">
COURSES      </Typography>
      <Typography variant="subtitle1" component="h3" align="center">
choose a course that helps you      </Typography>
    </CardContent>
  </Card>
</motion.div>

 

  
        
      </div>
    </div>
</div>
</Container>
<Footer />
    {/* <ChatBot /> */}





          </>
  );
}

export default Acceuil;

