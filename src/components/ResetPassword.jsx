import React, { useState, useContext } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
const ResetPassword = () => {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleResetPassword = () => {
    // Check if passwords match
    if (password !== confirmPassword) {

      return;
    }

    // Make an API request to reset the password
    fetch(`${import.meta.env.VITE_API_URL}/users/update-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error resetting password');
        }
      })
      .then((result) => {
        // Handle success
        notyf.success("Password reset successful")

        // Close the modal after successful password reset
        handleClose();
      })
      .catch((error) => {
        // Handle error
        notyf.error("Error in password reset")
      });
  };

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Reset Password
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResetPassword;
