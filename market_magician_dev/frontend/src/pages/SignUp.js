import { useDispatch } from "react-redux";
import { setCurrentUser } from "../components/userSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "../App.css";

const Signup = ({ setIsAuthenticated }) => {
    const dispatch = useDispatch();
    
    const validateSignUpForm = (values) => {
        const errors = {};
        
        if (!values.username) {
            errors.username = "Required";
        }
        
        if (!values.email) {
            errors.email = "Required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Invalid email address";
        }
        
        if (!values.password) {
            errors.password = "Required";
        }
        
        if (!values.confirmPassword) {
            errors.confirmPassword = "Required";
        } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords must match";
        }
        
        return errors;
    };

    const handleSubmit = async (values) => {
        const { username, email, password } = values;
        try {
            const response = await fetch("http://localhost:8000/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

            if (response.ok) {
                const data = await response.json();
                dispatch(setCurrentUser(data)); // Store user in Redux
                setIsAuthenticated(true); // Set authentication state
                alert("Signup successful");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Signup failed'}`);
            }
        } catch (error) {
            alert("Network error. Please try again.");
        }
    };

    return (
        <div className="signup-container"> {/* Centering the form */}
            <Formik
                initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validate={validateSignUpForm}
                onSubmit={handleSubmit}
            >
                <Form className="signup-form"> {/* Applying form styles */}
                    <div>
                        <label htmlFor="username">Username</label>
                        <Field name="username" placeholder="Enter your username" />
                        <ErrorMessage name="username" component="div" className="error" />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Field name="email" placeholder="Enter your email" />
                        <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" placeholder="Enter your password" />
                        <ErrorMessage name="password" component="div" className="error" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Field name="confirmPassword" type="password" placeholder="Confirm your password" />
                        <ErrorMessage name="confirmPassword" component="div" className="error" />
                    </div>
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Signup;
