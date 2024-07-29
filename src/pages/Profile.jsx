import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Navigate } from 'react-router-dom';

import ResetPassword from '../components/ResetPassword';	

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {

      	console.log(data)
        if (data) {
          setDetails(data);
        } else if (data.error === 'User not found') {

          // Navigate to the desired page upon error

        } else {

          // Navigate to the desired page upon error

        }
      });
  }, [history]);

  return (
    <>
      {user.id === null ? (
        <Navigate to="/profile" />
      ) : (
        <>
          <Row className='mt-5 pt-5'>
            <Col className="p-5 bg-primary text-white mx-auto mt-5" md={8}>
              <h1 className="my-5">Profile</h1>
              <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
              <hr />
              <h4>Contacts</h4>
              <ul>
                <li>Email: {details.email}</li>
                <li>Mobile No: {details.mobileNo}</li>
              </ul>
            </Col>
          </Row>
          <Row className="pt-4 mt-4">
            <Col>
             	<ResetPassword />
            </Col>
          </Row>
          <Row className="pt-4 mt-4">
            <Col>
            
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
