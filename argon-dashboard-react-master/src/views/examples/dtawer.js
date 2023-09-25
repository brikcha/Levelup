import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Form, FormGroup, Input, Label, Row } from 'reactstrap';

export default function FormDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Form Drawer</Button>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 500 }}>
          <Form style={{ marginTop: '2rem', marginRight: '1rem', marginLeft: '1rem' }}>
            <FormGroup>
              <Label for="exampleEmail">Shipping Adress</Label>
              <Input type="text" id="exampleEmail" placeholder="Shipping Adress" />
            </FormGroup>
            <Row>
              <Label for="examplePassword">Payment Method</Label>
              <select value={selectedOption} onChange={handleChange}>
                <option value="">Select an option</option>
                <option value="option1">Pay at delivery</option>
                <option value="option2">Pay with paypal</option>
              </select>
              {selectedOption === 'option2' && <button>Button</button>}
            </Row>
          </Form>
        </Box>
      </Drawer>
    </div>
  );
}
