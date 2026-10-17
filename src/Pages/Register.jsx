import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Register.css";

// Default empty form values
const emptyValues = { name: "", email: "", password: "" };

const Register = ({ switchToLogin }) => {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">
            Sign up to get started with your account
          </p>
        </div>

        {error && (
          <div className="register-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="register-success" role="alert">
            <span>{successMsg}</span>
          </div>
        )}

        <Formik
          initialValues={emptyValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            dispatch(clearError());
            const result = await dispatch(registerUser(values));

            if (!result.error) {
              setSuccessMsg("Registration successful! Redirecting to login...");

              // Immediately clear form inputs and validation errors
              resetForm({ values: emptyValues });

              // Transition to login after short delay
              setTimeout(() => {
                setSuccessMsg("");
                switchToLogin();
              }, 2000);
            }
          }}
        >
          {({ resetForm }) => (
            <Form className="register-form">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <Field
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                dispatch(clearError());
                switchToLogin();
              }}
              className="switch-btn"
              disabled={isLoading}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
