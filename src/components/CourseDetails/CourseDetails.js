import React, { useState, useEffect, useCallback } from "react";
import { Spinner, Alert, ListGroup } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import CheckIcon from "@material-ui/icons/Check";
import Parser from "html-react-parser";
import MainHeader from "../MainHeader";
import InstructorsDetail from "./getInstructorDetail";
import ButtonApp from "../ButtonApp";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import DeleteCourse from './DeleteCourse';
import EditCourse from './EditCourse.js'
import { render } from "@testing-library/react";


const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      height: 0,
      marginLeft: 0,
      width: "60%",
    }}
  />
);

const CourseDetails = () => {
  //   const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const props = useParams();
  const id = props.id;
  console.log(id);
  const [courseDetail, setCourseDetail] = useState([]);
  const [instructors, setInstructors] = useState([]);
  

  useEffect(() => {
    const fetchData = () => {
      setError(false);
      setIsLoading(true);

      fetch(`http://localhost:3001/courses/${id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong ...");
          }
        })
        .then((data) => {
          setCourseDetail(data);
          setInstructors(data.instructors);
          
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);



 

  if (error) {
    return <Alert variant="warning">{error.message}</Alert>;
  }

  if (isLoading) {
    return <Spinner animation="border" size="lg" />;
  }
  function formatDate(input) {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, "$3/$2/$1");
  }



 // const instructors = [courseDetail.instructors];
  console.log(instructors);

  
      if (courseDetail.dates) {
        courseDetail.dates.start_date = formatDate(courseDetail.dates.start_date);
        courseDetail.dates.end_date = formatDate(courseDetail.dates.end_date);
      }
    
  //console.log(courseDetail.description);
  if (courseDetail.description) {
    courseDetail.description = courseDetail.description.toString();

    console.log(courseDetail.description);
    return (
      <div style={{marginLeft:35, marginTop:20}}>
        <h1>
          {courseDetail.title} ({courseDetail.id})
        </h1>
        <img
          src={courseDetail.imagePath}
          style={{ width: "60%", height: "350px", marginTop:10 }}
          alt="Course Logo"
        ></img>
        <ColoredLine/>
        <div style={{marginTop:20}}>
        <div>Price: {courseDetail.price?.normal}€
        <span style={{marginLeft:"40%"}}>Duration: {courseDetail.duration} </span>
        </div>
        <div>Bookable: {courseDetail.open && <CheckIcon />}
        
        <span style={{marginLeft:660}}>
          Dates: {courseDetail.dates?.start_date} -{" "}
          {courseDetail.dates?.end_date}{" "}
        </span>
        </div>
       <div style={{marginTop:10}}>
        {Parser(courseDetail.description)}
        </div>
       <div style={{marginBottom:20}}>
       <Link to={{
  pathname: '/editCourse',
  state: {
    coursePacket:courseDetail
  }
}} id={courseDetail}>
          <ButtonApp id={courseDetail.id} msg="Edit"></ButtonApp>
          </Link>
          {/* <EditCourse detailsCourse={courseDetail}/> */}
           {/* <ButtonApp onChange={console.log('!')} msg="Delete"></ButtonApp>  */}
          {/* <button onChange={console.log('test')}>Delete</button> */}
         <DeleteCourse id={courseDetail.id}></DeleteCourse>
          {/* <Button variant="danger" onClick={() => deleteContact(courseDetail.id)}>Delete</Button> */}
          {/*  */}
          </div>
        <InstructorsDetail instr={courseDetail.instructors}/>
        
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default CourseDetails;
