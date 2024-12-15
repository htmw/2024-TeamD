import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../components/userSlice";
import { validateUserLoginForm } from "../components/validateUserLoginForm";

const validateSignUpForm = (values) => {
    const errors = validateUserLoginForm(values);

    if (!values.confirmPassword) {
        errors.confirmPassword = "Required";
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    return errors;
};

const SignUp = () => {
    const dispatch = useDispatch();

    const handleSignUp = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true); 
        const requestData = {
            username: values.username,
            password: values.password,
            password_confirm: values.confirmPassword,
        };
    
        try {
            // Send a POST request to the backend
            const response = await fetch("http://localhost:8000/api/register/" ,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            // Parse the response as JSON
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message);
            } else {
                setErrors(data);
            }
        } catch (error) {
            alert("An unexpected error occurred.  try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="signup-form">
            <h2>Create an Account</h2>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    confirmPassword: "",
                }}
                validate={validateSignUpForm}
                onSubmit={handleSignUp}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Field
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            className="form-control"
                        />
                        <ErrorMessage name="username" component="p" className="text-danger" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                        />
                        <ErrorMessage name="password" component="p" className="text-danger" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="form-control"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="p"
                            className="text-danger"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Sign Up
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default SignUp;
