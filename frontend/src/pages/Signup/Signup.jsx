import React from "react";
import Textinput from "../../components/TextInput/Textinput";
import styles from "./Signup.module.css";
import SignupSchem from "../../Schemas/SignupSchema";
import { useFormik } from "formik";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/internal";

export default function Signup() {
  const [error, setError] = React.useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await signup(data);

    if (response.status === 201) {
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

  const { values, touched, handleChange, handleBlur, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchem,
  });

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create Account</div>
      <Textinput
        type="text"
        value={values.name}
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="name"
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />

      <Textinput
        type="text"
        value={values.username}
        name="username"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />

      <Textinput
        type="text"
        value={values.email}
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="email"
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />

      <Textinput
        type="password"
        value={values.password}
        name="password"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />

      <Textinput
        type="password"
        value={values.confirmPassword}
        name="confirmPassword"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="confirmPassword"
        error={
          errors.confirmPassword && touched.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />

      <button className={styles.signupButton} onClick={handleSignup}>
        Sign up
      </button>
      <span>
        Already have a account?{" "}
        <button className={styles.login} onClick={() => navigate("/login")}>
          Login
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}
