import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../store/actions/authActions";
import type { AppDispatch } from "../../../store";
import { useFormik } from "formik";
import { LoginSchema } from "../../../utils/validations/AuthValidations";
import { useState } from "react";
import { EyeOff, Eye, Loader, ArrowRight } from "lucide-react";
import type { LoginFormValues } from "../../interfaces/authInterface";
import { getHomeRouteForUser } from "../../hooks/authRedirects";
import { Logos } from "../../../utils/assets";



export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);



  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, }) => {
      try {
        const response = await dispatch(loginUser(values)).unwrap();
        const homeRoute = getHomeRouteForUser(response?.role, response?.currentSubscriptionId,);        
        navigate(homeRoute, { state: { stripeCustomerId: response?.stripeCustomerId } });
      } catch (error: unknown) {
        console.error("Login failed:", error);
      } finally {
        setTimeout(() => {
          setSubmitting(false);
        }, 3000);
        
      }
    }

  });

  return (
    <>
      {formik.isSubmitting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
          }}
        >
          <Loader
            size={48}
            style={{
              animation: "spin 1s linear infinite",
            }}
          />

        </Box>
      )}
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
          <Box sx={{ mb: 3 }} >
            <Avatar
              src={Logos.small}
              alt="Ecme logo"
              sx={{ width: 60, height: 60, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>
          <Typography
            variant="h5"
            mb={0}
            gutterBottom
            textAlign="left"
            sx={{ fontWeight: 600 }}
          >
            Welcome back!
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, fontSize: 14 }}
            textAlign="left"
            mb={3}
          >
            Please enter your credentials to sign in!
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column",   }}
          >
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="off"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}

            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              autoComplete="off"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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

            />

            {/* Display submit error if any */}
            {formik.errors.submit && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, textAlign: "center" ,}}
              >
                {formik.errors.submit}
              </Typography>
            )}

            <Link
              className="font-medium underline text-right text-[14px] mb-1"
              to="/forgot-password"
               
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={formik.isSubmitting}
              endIcon={<ArrowRight size={20} />}
              sx={{
                height: 56,
                textTransform: "none",
                letterSpacing: 0.5,
              }}
              
            >
              {formik.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

         
          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Don't have an account yet?{" "}
            <Link
              className="font-medium underline text-right text-[14px]"
              to="/signup-role"
            >
              Sign up
            </Link>
          </Typography>
        </Box>

      </Box>
    </>
  );
}
