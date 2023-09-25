import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Form,
  Container,
  Row,
  Col
} from "reactstrap";
const PasswordReset = () => {
  const history = useHistory();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const userId = path.substring(path.lastIndexOf('/') + 1);
    setUserId(userId);
  }, []);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/password-reset/${userId}`, { password });
      console.log(response.data);
       // Password reset successfully.
       history.push("/admin/icons");

      Swal.fire({
        icon: "success",
        title: "Password reset successfully!",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      setError(error.response.data);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password failed to reset",
      });
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
    <div className="card shadow">
   
      <div className="card-body">
        <div className="text-center mb-3">
          <h2 className="forgot-passwords">Forgot Password?</h2>
          <p className="text-muted">Enter your  email to reset the password</p>
        </div>
        <Row className="justify-content-center">
      <Col xs={12}>
        <Form onSubmit={handleSubmit}> 
      
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              password
            </label>
            <Input
              type="password"
              value={password} onChange={handlePasswordChange}            />
          </div>
          <div className="d-grid gap-2">
            <Button type="submit" color="success">
              Reset Password
            </Button>
            {error && <p>{error}</p>}
          </div>
          <p className="mt-3 text-center">
            Don't have an account? <a href="/auth/user">Sign in</a>
          </p>
        </Form>
        </Col>
        </Row>
      </div>
    </div>
  </div>
  );
};

export default PasswordReset;