import {  
  Avatar,
  Box,
  Button, 
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
// import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPasswordValidationSchema } from "../../../utils/validations/AuthValidations";
import { forgotPassword } from "../../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { Logos } from "../../../utils/assets";
import { ArrowRight } from "lucide-react";
 

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
 

 
 
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
          await dispatch(
          forgotPassword({ email: values.email })
        ).unwrap();
       
      
      } catch (err: unknown) {
        console.log("Error ", err); 
        const errorMessage = err instanceof Error ? err.message : "Unexpected error occurred";
        console.log("errorMessage", errorMessage);
      
      } finally {
        setSubmitting(false);
      }
    },
  }); 
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="div"
          sx={{
            width: 400,
            p: 2,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Avatar
              src={Logos.small}
              alt="Ecme logo"
              sx={{ width: 60, height: 60 }}
            />
          </Box>
          <Typography
            variant="h5"
            mb={0}
            gutterBottom
            textAlign="left"
            sx={{ fontWeight: 600 }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, fontSize: 14 }}
            textAlign="left"
            mb={3}
          >
            Please enter your email to receive password reset link
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              label="Email"
              type="text"
              variant="outlined"
              name="email"
              fullWidth
              margin="normal"
              autoComplete="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onBlur={formik.handleBlur}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<ArrowRight size={20} />}
              sx={{
                height: 56,
                textTransform: "none",
                letterSpacing: 0.5,
                 
              }}
            >
              Send Email Link
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Back to{" "}
            <Link
              className="font-medium underline text-right text-[14px]"
              to="/signin"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      
      </Box>
    </>
  );
}
