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

    const handleSignUp = (values) => {
        const newUser = {
            id: Date.now(),
            username: values.username,
            password: values.password,
        };

        dispatch(setCurrentUser(newUser));
        alert("Account created successfully!");
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
