import React from 'react'
import {
  ModalBody,ModalHeader,ModalFooter, Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Button,
} from "reactstrap";

function UpdateFr({modalfr,togglefr}) {
    
  return (
    <Modal isOpenfr={modalfr} togglefr={togglefr} >
    <ModalHeader toggle={toggle}>Create new post</ModalHeader>
    <ModalBody>
      <Form
        className="card-profile shadow card"
        style={{ padding: 10, width: "100%" }}
        onSubmit={(e) => createNewPost(e)}
      >
        <FormGroup>
          <Label for="exampleEmail">Titre</Label>
          <Input id="exampleEmail" name="title" type="title" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail2">image</Label>
          <Input id="exampleEmail2" name="picture" type="file" onChange={(e)=>setpicture(e.target.files)} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">Message </Label>
          <Input id="exampleText" name="message" type="textarea" />
        </FormGroup>
        <Button type="submit"> Create Post </Button>
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  )
}

export default UpdateFr