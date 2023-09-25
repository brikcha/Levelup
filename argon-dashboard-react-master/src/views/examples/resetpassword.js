import React, { useState } from 'react';
import { Alert, Modal,Form } from 'react-bootstrap';
import Swal from "sweetalert2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

function ForgotPassword(props) {
  const [isFormAtTop, setIsFormAtTop] = useState(true);

    const [showAlert, setShowAlert] = useState(false); // Add missing state for showAlert
    const [alertVariant, setAlertVariant] = useState(''); // Add missing state for alertVariant
    const [alertMessage, setAlertMessage] = useState(''); // Add missing state for alertMessage
  const [state, setState] = useState({
    email: '',
    error: '',
  });

  const { email, error } = state;

  function handleChange(event) {
    setState({ ...state, email: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch('http://localhost:5000/api/password-reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Email sent successfully!",
            showConfirmButton: false,
            timer: 2500,
          });
          // Handle successful response, e.g. show success message to user
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email is not Sent, try again!",
          });        }
      })
     
      .catch(error => {
        setState({ ...state, error: error.message });
        console.error(error);
       
      });
  };
  const handleClose = () => setShowAlert(false);


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
          <Modal show={showAlert} onHide={handleClose} centered>
   
   <Alert variant={alertVariant}>{alertMessage}</Alert>
   <Button variant="secondary" onClick={handleClose}>
     Close
   </Button>


</Modal>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Input
                type="email"
                value={email} onChange={handleChange}
              />
            </div>
            <div className="d-grid gap-2">
              <Button type="submit" color="danger">
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
}

export default ForgotPassword;