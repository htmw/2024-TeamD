import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser, selectCurrentUser } from './userSlice';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Label,
    Button
} from 'reactstrap';
import defaultAvatar from '../assets/images/stocks.png';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validateUserLoginForm } from './validateUserLoginForm';


const Login = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const currentUser = useSelector(selectCurrentUser);

    const dispatch = useDispatch();

    const handleLogin = (values) => {
        const currentUser = {
            id: Date.now(),
            avatar: defaultAvatar,
            username: values.username,
            password: values.password
        };
        dispatch(setCurrentUser(currentUser));
        setLoginModalOpen(false);
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={handleLogin}
                validate={validateUserLoginForm}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Field
                            id="username"
                            name="username"
                            placeholder="Username"
                            className="form-control"
                        />
                        <ErrorMessage name="username">
                            {(msg) => <p className="text-danger">{msg}</p>}
                        </ErrorMessage>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="form-control"
                            type="password"
                        />
                        <ErrorMessage name="password">
                            {(msg) => <p className="text-danger">{msg}</p>}
                        </ErrorMessage>
                    </div>

                    <button type="submit" className="btn btn-primary">Login</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;