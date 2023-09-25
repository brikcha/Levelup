import axios from "axios";
import React, { useEffect, useState } from "react";
const GymDetail = ({ match }) => {
  const [gym, setGym] = useState({});

  const API_URL = "http://localhost:5000/gym/";

  const getGymById = async (id) => {
    const response = await axios.get(API_URL + id);

    return response.data;
  };

  useEffect(() => {
    const fetchGym = async () => {
      const data = await getGymById(match.params.id);
      setGym(data);
    };
    fetchGym();
  }, [match.params.id]);

  return (
    <div>
      <video controls src={`http://localhost:5000/gym/uploads/${gym.video}`} />
    </div>
  );
};

export default GymDetail;
