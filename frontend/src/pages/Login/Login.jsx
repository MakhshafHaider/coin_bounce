  import React, { useState } from "react";
  import TextInput from "../../components/TextInput/Textinput";
  import styles from "./Login.module.css";
  import { useFormik } from "formik";
  import loginSchema from "../../Schemas/LoginSchema";
  import { login } from "../../api/internal";
  import { setUser } from "../../store/userSlice";
  import { useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";

  export default function Login() {
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
      const data = {
        email: values.email,
        password: values.password,
      };

      const response = await login(data);
      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          email: response.data.user.email,
          username: response.data.user.username,
          auth: response.data.auth,
        };

        dispatch(setUser(user));

        navigate("/");
      } else if (response.code === "ERR_BAD_REQUEST") {
        setError(response.response.data.message);
      }
    };

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
    });

    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginHeader}>Log in to your Account</div>
        <TextInput
          type="text"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="email"
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.email}
        />

        <TextInput
          type="password"
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="password"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />

        <button className={styles.logInButton} onClick={handleLogin}>
          Log In
        </button>
        <span>
          Don't have a account ?{" "}
          <button className={styles.createAccount} onClick={() => navigate('/signup')}> Register </button>
        </span>
        {
          error !== "" ? <p className={styles.errorMessage}>{error}</p>:""
        }
      </div>
    );
  }
