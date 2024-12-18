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
    
        if (!values.password) {
            errors.password = "Required";
        }
    
        if (!values.password_confirm) {
            errors.password_confirm = "Required";
        } else if (values.password !== values.password_confirm) {
            errors.password_confirm = "Passwords must match";
        }
    
        return errors;
    };

    const handleSubmit = async (values) => {
        const { username, password, password_confirm } = values;
        try {
          const response = await fetch("http://localhost:8000/api/register/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, password_confirm }),
          });
    
            if (response.ok) {
                const data = await response.json();
                dispatch(setCurrentUser(data));
                setIsAuthenticated(true);
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
                    password: "",
                    password_confirm: "",
                }}
                validate={validateSignUpForm}
                onSubmit={handleSubmit}
>
                <Form className="signup-form">
                    <div>
                        <label htmlFor="username">Username</label>
                        <Field name="username" placeholder="Enter your username" />
                        <ErrorMessage name="username" component="div" className="error" />
                    </div>
                    
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" placeholder="Enter your password" />
                        <ErrorMessage name="password" component="div" className="error" />
                    </div>
                    
                    <div>
                        <label htmlFor="password_confirm">Confirm Password</label>
                        <Field name="password_confirm" type="password" placeholder="Confirm your password" />
                        <ErrorMessage name="password_confirm" component="div" className="error" />
                    </div>
                    
                    <button type="submit">Sign Up</button>
                </Form>
            </Formik>

        </div>
    );
};

export default Signup;
