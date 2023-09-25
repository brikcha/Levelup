import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar,Line } from 'react-chartjs-2';
import classnames from "classnames";
import Chart from "chart.js";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,

} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const GymStats = () => {
  const [gymLikes, setGymLikes] = useState([]);
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    // Récupération des données sur les likes des salles de sport
    axios.get('http://localhost:5000/gym/getGyms')
      .then(response => {
        const likes = response.data.map(gym => ({
          name: gym.name,
          likes: gym.likes.length
        }));
        setGymLikes(likes);
      })
      .catch(error => console.error(error));
  }, []);

  // Création des données pour le graphique
  const chartData = {
    labels: gymLikes.map(gym => gym.name),
    datasets: [{
      label: 'Likes',
      data: gymLikes.map(gym => gym.likes),
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1
    }]
  };

  return (
    <><>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)} />
                </div>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
       
      </Container>
    </><Card className="shadow">
        <CardHeader className="bg-transparent">
          <Row className="align-items-center">
            <div className="col">
              <h6 className="text-uppercase text-muted ls-1 mb-1">
                Likes
              </h6>
              <h2 className="mb-0">Par salle de sport</h2>
            </div>
          </Row>
        </CardHeader>
        <div className="chart">
          <Bar data={chartData} options={{
            ...chartOptions,
            ...{
              scales: {
                yAxes: [{
                  ticks: {
                    callback: function (value) {
                      if (!(value % 10)) {
                        return value;
                      }
                    }
                  }
                }]
              }
            }
          }} />
        </div>
      </Card></>
  );
        };
   


export default GymStats;