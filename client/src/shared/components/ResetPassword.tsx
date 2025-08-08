import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate,  } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { resetPasswordValidationSchema } from "../../utils/validations/AuthValidations";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../store/actions/authActions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
  console.log("token", tokenParam);
  console.log("email", emailParam);
  const dispatch = useDispatch<AppDispatch>();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      resetPasswordToken: tokenParam || "",
      encryptedEmail: emailParam || "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        const result = await dispatch(
          resetPassword({
            password: values.password,
            resetPasswordToken: values.resetPasswordToken,
            encryptedEmail: values.encryptedEmail,
          })
        ).unwrap();
        console.log("result", result);
        navigate("/login");
      } catch (err) {
        console.error("Error submitting reset password", err);
      }
    },
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
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
              src="https://ecme-react.themenate.net/img/logo/logo-light-streamline.png"
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
            Set new password
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, fontSize: 14 }}
            textAlign="left"
            mb={4}
          >
            Your new password must different to previous password
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              name="password"
              fullWidth
              margin="normal"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              name="confirmPassword"
              fullWidth
              margin="normal"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                height: 56,
                textTransform: "none",
                letterSpacing: 0.5,
                marginTop: 2,
              }}
            >
              Submit
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Back to{" "}
            <Link
              className="font-medium underline text-right text-[14px]"
              to="/login"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
