/*import { Button, Card, Group, Select, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
//import { useForm } from "@mantine/hooks";
import {useForm} from "@mantine/form";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react"; 
//import { useForm } from "react-hook-form";

function AddEvent() {
  const [courses, setCourses] = useState([]);
 
  const getCourses = async () => {
    await axios.get("http://localhost:5000/cours/list").then((response) => {
      setCourses(response.data);
    });
  };
  useEffect(() => {
    getCourses();
  }, []);

  
  const addEvent = async (formfields) => {
    await axios
      .post("http://localhost:5000/events/new_event", {
        title: formfields.title,
        coursId: formfields.coursId,
        coachId: formfields.coachId,
        event_date: formfields.event_date,
      }) 
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  };

  const form = useForm({
    initialValues: {
      title: "",
      coursId: "",
      coachId: sessionStorage.getItem("_id"),
      event_date: "",
    },
  });
  return (
    <Card>
      <Title order={3}>Add Event</Title>
      <TextInput label="Title" {...form.getInputProps("title")} />
      {courses.length !== 0 && (
        <Select
          label="Cours"
          placeholder="select a course"
          {...form.getInputProps("coursId")}
          data={
            courses.length === 0
              ? []
              : courses.map((item) => {
                  return { value: item._id, label: item.titre };
                })
          }
        />
      )}

      <DatePicker
        label="Date d'evenement"
        {...form.getInputProps("event_date")}
      />
      <Group position="right" mt="md">
        <Button
          color="violet"
          onClick={() => {
            addEvent(form.values);
          }}
        >
          Add
        </Button>
      </Group>
    </Card>
    
  );
}

export default AddEvent;


/*import { Button, Card, Group, Select, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AddEvent() { 
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    await axios.get("http://localhost:5000/cours/list").then((response) => {
      setCourses(response.data);
    });
  };
  useEffect(() => {
    getCourses();
  }, []);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      coursId: "",
      coachId: sessionStorage.getItem("_id"),
      event_date: "",
    },
  });

  const addEvent = async (formData) => {
    await axios
      .post("http://localhost:5000/events/new_event", {
        title: formData.title,
        coursId: formData.coursId,
        coachId: formData.coachId,
        event_date: formData.event_date,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  };
  
  return (
    <Card>
      <Title order={3}>Add Event</Title>
      <form onSubmit={handleSubmit(addEvent)}>
        <TextInput label="Title" {...register("title")} />
        {courses.length !== 0 && (
          <Select
            label="Cours"
            placeholder="select a course"
            {...register("coursId")}
            data={
              courses.length === 0
                ? []
                : courses.map((item) => {
                    return { value: item._id, label: item.titre };
                  })
            }
          />
        )}

     <DatePicker
  label="Date d'evenement"
    {...register("event_date", { required: true })}
    />

        <Group position="right" mt="md">
          <Button type="submit" color="violet">
            Add
          </Button>
        </Group>
      </form>
    </Card>
  );
}

export default AddEvent;*/

import { Button, Card, Group, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Howl } from 'howler';

function EventFormModal({ show, onHide, event_date }) {
  const [courses, setCourses] = useState([]);
 
  const getCourses = async () => {
    await axios.get("http://localhost:5000/cours/list").then((response) => {
      setCourses(response.data);
    });
  };
  useEffect(() => {
    getCourses();
  }, []);

  const addEvent = async (formfields) => {
    await axios
      .post("http://localhost:5000/events/new_event", {
        title: formfields.title,
        coursId: formfields.coursId,
        coachId: formfields.coachId,
        event_date: formfields.event_date,
        onlinesession: formfields.onlinesession,
      })
      .then((response) => {
        console.log(response.data);
        const sound = new Howl({
          src: [require('views/examples/video/successnoti_sai9ad67.mp3')]
        });
        sound.play();
        alert("Event added successfully!");
      })
      .catch((error) => console.log(error));
  };
  

  const form = useForm({
    initialValues: {
      title: "",
      coursId: "",
      coachId: sessionStorage.getItem("_id"),
      event_date: event_date,   
      onlinesession:"",
    },
  });
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Online Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Title order={3}>Add Online Session</Title>
          <TextInput label="Title" {...form.getInputProps("title")} />
          {courses.length !== 0 && (
            <><Select
              label="Cours"
              placeholder="select a course"
              {...form.getInputProps("coursId")}
              data={courses.length === 0
                ? []
                : courses.map((item) => {
                  return { value: item._id, label: item.titre };

                })} /><TextInput label="Link for Online Session" {...form.getInputProps("onlinesession")}/></>
          )}

          <Group position="right" mt="md">
            <Button color="red" onClick={onHide}>
              Annuler
            </Button>
            <Button
              color="violet"
              onClick={() => {
                addEvent(form.values);
              }}
            >
              Add
            </Button>
          </Group>
        </Card>
        
      </Modal.Body>
    </Modal>
  );
} 

export default EventFormModal;