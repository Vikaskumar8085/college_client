import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";

// Default empty form values
const emptyValues = { email: "", password: "" };

const Login = ({ switchToRegister }) => {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        <Formik
          initialValues={emptyValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            dispatch(clearError());
            const result = await dispatch(loginUser(values));

            if (!result.error) {
              // Reset all inputs & validation states on success
              resetForm({ values: emptyValues });
            }
          }}
        >
          {() => (
            <Form className="login-form">
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
                  autoComplete="current-password"
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
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                dispatch(clearError());
                switchToRegister();
              }}
              className="switch-btn"
              disabled={isLoading}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
