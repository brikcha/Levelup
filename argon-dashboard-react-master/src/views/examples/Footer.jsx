import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer" style={{ backgroundColor: "black" }}>
      <Row>
        <Col md="4" className="footer-copywright">
          <h3 style={{ color: "white" }}>Designed and Developed by The achievers</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3 style={{ color: "white" }}>Copyright © {year} SB</h3>
          <ul className="footer-icons" style={{ display: "flex", alignItems: "center" }}>
  <div >
    <a
      href="mailto:levelupachievers345@gmail.com"
      style={{ color: "white" }}
      target="_blank"
      rel="noopener noreferrer"
    >
<AiOutlineMail style={{ fontSize: '24px' }} />
    </a>
  </div>
  <div>
    <h3 style={{ color: "white", marginLeft: "10px" }}>Contact Us</h3>
  </div>
</ul>

        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href="https://github.com/soumyajit4419"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://twitter.com/Soumyajit4419"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiOutlineTwitter />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/soumyajit4419/"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.instagram.com/soumyajit4419"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
