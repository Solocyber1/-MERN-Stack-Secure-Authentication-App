import { useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Spinner, Container } from "react-bootstrap";

import IMAGES from "../../assets";
import { Notify } from "../../utils";
import api from "../../api/axios"; // ✅ Use central axios instance

const PasswordResetPage = () => {
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const { resetToken } = useParams();

  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const passwordResetHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!credentials.password || !credentials.confirmPassword) {
      setIsLoading(false);
      return Notify("Please Fill all the Fields", "warn");
    }

    if (credentials.password !== credentials.confirmPassword) {
      setIsLoading(false);
      return Notify("Passwords Do Not Match", "warn");
    }

    if (credentials.password.length < 8) {
      setIsLoading(false);
      return Notify("Password must be at least 8 characters", "warn");
    }

    try {
      const response = await api.put(`/auth/resetPassword/${resetToken}`, {
        password: credentials.password,
      });

      const data = response.data;

      if (data.success) {
        setIsLoading(false);
        setIsPasswordReset(true);
        return Notify(data.data, "success");
      } else {
        setIsLoading(false);
        return Notify(data.error, "error");
      }
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.error || "Internal server error";
      return Notify(message, "error");
    }
  };

  return (
    <>
      {isPasswordReset ? (
        <Container>
          <img
            src={IMAGES.green_check}
            className="mx-auto d-block mt-5 mb-3"
            width="100px"
            alt="password changed successfully"
          />
          <p className="email__heading text-center fs-2">Password Changed!</p>
          <p className="text-center text-muted fs-5">
            Your password has been changed successfully.
          </p>
        </Container>
      ) : (
        <Form className="auth__form" onSubmit={passwordResetHandler}>
          <h4 className="mb-3">Create new password</h4>
          <p className="text-muted mb-4">
            Your new password must be different from previously used passwords.
          </p>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              tabIndex="1"
              placeholder="Enter new password"
              value={credentials.password}
              onChange={handleCredentials}
            />
            <Form.Text className="text-muted">
              Must be at least 8 characters.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              tabIndex="2"
              placeholder="Confirm new password"
              value={credentials.confirmPassword}
              onChange={handleCredentials}
            />
            <Form.Text className="text-muted">
              Both passwords must match.
            </Form.Text>
          </Form.Group>

          <Button
            tabIndex="3"
            variant="success"
            type="submit"
            className="mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" role="status" size="sm" />
            ) : (
              "Reset password"
            )}
          </Button>
        </Form>
      )}
    </>
  );
};

export default PasswordResetPage;
