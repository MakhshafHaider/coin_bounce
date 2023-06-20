import * as yup from "yup";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const errorMessage = "Use lower case, upper case and digits";

const loginSchema = yup.object().shape({
  email: yup.string().required("email is required"),
  password: yup
    .string()
    .min(5)
    .max(30)
    .matches(passwordPattern, { message: errorMessage })
    .required(),
});

export default loginSchema;
