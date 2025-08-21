import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  IconButton,
  Rating,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Zap,
  Shield,
  ArrowRight, 
  ShieldCheck,
  Building2,
  CreditCard,
  Instagram,
  Facebook,
  BadgeCheck,
  Handshake,
  KeyRound, 
  FunnelPlus,
  Award,
  ChartSpline,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../../../assets/image/banner2.png";
import clientImage from "../../../assets/image/client-mockup.jpg";
import inspectorImage from "../../../assets/image/inspector.jpg";
import inspectorRequirementsImage from "../../../assets/image/inspector-requirements.jpg";
import {Logos} from "../../../utils/assets/index";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Motion components for consistent button animations
const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);
const buttonSpring = {
  type: "spring",
  stiffness: 400,
  damping: 22,
  mass: 0.6,
} as const;

export default function LandingPage() {
  const [role, setRole] = React.useState<"client" | "inspector">("client");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRole = (
    _: React.MouseEvent<HTMLElement>,
    next: "client" | "inspector" | null
  ) => {
    if (next) setRole(next);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const swap = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.35 },
  };

  const handleLogin = () => navigate("/signin");
  const handleGetStarted = () => navigate("/signup-role");
  const handleStartApplication = () => navigate("/signup-role");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <AppBar
        elevation={0}
        position="sticky"
        color="transparent"
        sx={{
          backdropFilter: "blur(8px)",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ flexGrow: 1 }}
          >
            <Avatar
              src={Logos.small}
              sx={{
                width: 40,
                height: 40,
              }}
            >
              <Zap size={24} />
            </Avatar>
            <Typography color="primary" variant="h5" fontWeight={600}>
              InspectConnect
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={2} alignItems="center">
              <ToggleButtonGroup
                exclusive
                size="small"
                value={role}
                onChange={handleRole}
                aria-label="role switch"
                sx={{
                  "& .MuiToggleButton-root": {
                    px: 2,
                    py: 0.75,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderColor: "divider",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  },
                }}
              >
                <ToggleButton sx={{ textTransform: "none" }} value="client">
                  Client
                </ToggleButton>
                <ToggleButton sx={{ textTransform: "none" }} value="inspector">
                  Inspector
                </ToggleButton>
              </ToggleButtonGroup>

              <MotionButton
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={buttonSpring}
                variant="text"
                onClick={handleLogin}
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                Sign In
              </MotionButton>

              <MotionButton
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={buttonSpring}
                variant="contained"
                endIcon={<ArrowRight size={20} />}
                onClick={handleGetStarted}
                sx={{
                  height: 40,
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 1,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(26, 44, 71, 0.3)",
                  },
                }}
              >
                Get Started
              </MotionButton>
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{ color: "text.primary" }}
              aria-label="menu"
            >
              <Menu size={24} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={600} color="primary">
              Menu
            </Typography>
            <IconButton onClick={closeMobileMenu} size="small">
              <X size={20} />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Role Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Select Role
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={role}
              onChange={handleRole}
              aria-label="role switch"
              sx={{
                "& .MuiToggleButton-root": {
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  borderColor: "divider",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                },
              }}
            >
              <ToggleButton sx={{ textTransform: "none" }} value="client">
                Client
              </ToggleButton>
              <ToggleButton sx={{ textTransform: "none" }} value="inspector">
                Inspector
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Navigation Links */}
          <List sx={{ mb: 2 }}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  handleLogin();
                  closeMobileMenu();
                }}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText 
                  primary="Sign In" 
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => {
                  handleGetStarted();
                  closeMobileMenu();
                }}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText 
                  primary="Get Started" 
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <ArrowRight size={18} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ mb: 2 }} />

          {/* Quick Actions */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => {
                  navigate("/signup", { state: { role } });
                  closeMobileMenu();
                }}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {role === "client" ? "Request Inspection" : "Become Inspector"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background:
            "linear-gradient(135deg, rgba(26, 44, 71, 0.03) 0%, rgba(245, 245, 240, 0.5) 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "auto", md: "90vh" },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26, 44, 71, 0.05) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -100,
            width: 250,
            height: 250,
            borderRadius: "50%",
            // background: "radial-gradient(circle, rgba(245, 245, 240, 0.8) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, height: "100%" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 4, lg: 8 },
              alignItems: "center",
            }}
          >
            {/* Left Content */}
            <Box>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`headline-${role}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={swap}
                  >
                    <Typography
                      variant="h2"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "2.5rem", md: "3.5rem" },
                        lineHeight: 1.1,
                        color: "text.primary",
                        mb: 3,
                      }}
                    >
                      {role === "client"
                        ? "Connecting Quality Inspections with Quality Projects"
                        : "Join a Network that Connects You to Quality Projects"}
                    </Typography>
                  </motion.div>
                </AnimatePresence>

                <motion.div variants={fadeUp}>
                  <Chip
                    icon={<Shield size={18} />}
                    label="Fast • Reliable • Certified"
                    color="primary"
                    variant="outlined"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderColor: "primary.main",
                      color: "primary.main",
                      "& .MuiChip-icon": {
                        color: "primary.main",
                      },
                    }}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`sub-${role}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={swap}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{
                        mb: 4,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                      }}
                    >
                      {role === "client"
                        ? "Find certified, pre-approved inspectors for your project — instantly. Get quality inspections delivered to your doorstep with our trusted network."
                        : "Join the inspection network and start getting paid for your expertise. Access quality projects, build your reputation, and grow your business."}
                    </Typography>
                  </motion.div>
                </AnimatePresence>

                <motion.div variants={fadeUp}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                  >
                    <MotionButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={buttonSpring}
                      size="large"
                      variant="contained"
                      endIcon={<ArrowRight size={20} />}
                      sx={{
                        height: 56,
                        px: 4,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: "1.125rem",
                        boxShadow: "0 4px 12px rgba(26, 44, 71, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 20px rgba(26, 44, 71, 0.4)",
                        },
                      }}
                      onClick={() => {
                        navigate("/signup", { state: { role } });
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`cta-${role}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          style={{ display: "inline-block" }}
                        >
                          {role === "client"
                            ? "Request an Inspection"
                            : "Become an Inspector"}
                        </motion.span>
                      </AnimatePresence>
                    </MotionButton>
                  </Stack>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  ></Stack>
                </motion.div>
              </motion.div>
            </Box>

            {/* Right Content */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box sx={{ position: "relative" }}>
                  {/* Hero image (free Unsplash) */}
                  <Box
                    component="img"
                    src={heroImage}
                    alt="Building inspector reviewing plans at a construction site"
                    loading="lazy"
                    decoding="async"
                    sx={{
                      width: "100%",
                      display: "block",
                      borderRadius: 3,
                      maxHeight: { xs: 360, sm: 420, md: 620 },
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* How it works Section */}
      {/* client container */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container>
          {/* Rounded feature panel like the image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ position: "relative" }}>
              <Paper elevation={0}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                    gap: { xs: 4, md: 6 },
                    alignItems: "center",
                  }}
                >
                  {/* Left column: text + bullets */}
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                      How it works? — Client
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 3, maxWidth: 640 }}
                    >
                      Built to adapt to any user or region, delivering seamless
                      performance across devices and languages.
                    </Typography>

                    <Stack spacing={1.5}>
                      {[
                        "Submit your project inspection request",
                        "Get matched with certified inspectors near you",
                        "Track and communicate in real-time",
                        "Pay securely after inspection is complete",
                      ].map((line, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              mt: "2px",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              bgcolor: "action.hover",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {/* tiny check icon */}
                            <Box
                              component="span"
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: "text.disabled",
                              }}
                            />
                          </Box>
                          <Typography variant="body1" color="text.secondary">
                            {line}
                          </Typography>
                        </Stack>
                      ))}
                      <MotionIconButton
                        whileHover={{ scale: 1.06, rotate: 0.5 }}
                        whileTap={{ scale: 0.96 }}
                        transition={buttonSpring}
                        sx={{
                          mt: 2,
                          p: 1.25,
                          color: "primary.light",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "1px",
                          borderColor: "primary.light",
                        }}
                        onClick={() => {
                          navigate("/signup", { state: { role: "client" } });
                        }}
                      >
                        Start Your First Request Today <ArrowRight size={20} />
                      </MotionIconButton>
                    </Stack>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      component="img"
                      src={clientImage}
                      alt="Responsive app preview"
                      loading="lazy"
                      sx={{
                        width: { xs: "90%", md: 420 },
                        maxWidth: 480,
                        borderRadius: 5,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        display: "block",
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>
      {/* inspector container */}

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container>
          {/* Rounded feature panel like the image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ position: "relative" }}>
              <Paper elevation={0}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                    gap: { xs: 4, md: 6 },
                    alignItems: "center",
                  }}
                >
                  {/* Left column: text + bullets */}
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      component="img"
                      src={inspectorImage}
                      alt="Responsive app preview"
                      loading="lazy"
                      sx={{
                        width: { xs: "90%", md: 420 },
                        maxWidth: 480,
                        borderRadius: 5,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        display: "block",
                      }}
                    />
                  </Box>

                  {/* Right column: phone mockup image */}
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                      How it works? — Inspector
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 3, maxWidth: 640 }}
                    >
                      Built to adapt to any user or region, delivering seamless
                      performance across devices and languages.
                    </Typography>

                    <Stack spacing={1.5}>
                      {[
                        "Apply with your certifications (ICC, ACI, etc.)",
                        "Choose your service areas",
                        "Receive job alerts & accept requests",
                        "Get paid instantly after completing inspections",
                      ].map((line, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              mt: "2px",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              bgcolor: "action.hover",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {/* tiny check icon */}
                            <Box
                              component="span"
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: "text.disabled",
                              }}
                            />
                          </Box>
                          <Typography variant="body1" color="text.secondary">
                            {line}
                          </Typography>
                        </Stack>
                      ))}
                      <MotionIconButton
                        whileHover={{ scale: 1.06, rotate: 0.5 }}
                        whileTap={{ scale: 0.96 }}
                        transition={buttonSpring}
                        sx={{
                          mt: 2,
                          p: 1.25,
                          color: "primary.light",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "1px",
                          borderColor: "primary.light",
                        }}
                      >
                        Join the Network - $49.99/mo <ArrowRight size={20} />
                      </MotionIconButton>
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                Why Choose InspectConnect?
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                We've built the most comprehensive platform for connecting
                quality inspections with quality projects
              </Typography>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {[
              {
                icon: <Handshake size={24} />,
                title:
                  "Real-Time Job Matching (Uber-style interface for inspectors)",
                description:
                  "Get matched with certified inspectors in your area within minutes, not days.",
              },
              {
                icon: <ShieldCheck size={24} />,
                title: "Verified & Certified Inspector Profiles",
                description:
                  "Track inspection progress with live updates and real-time communication.",
              },
              {
                icon: <KeyRound size={24} />,
                title: "Subscription-Only Access for Inspectors - $49.99/mo",
                description:
                  "All inspectors are pre-screened, certified, and continuously monitored.",
              },
              {
                icon: <CreditCard size={24} />,
                title: "Secure Payments & Instant Payouts",
                description:
                  "Get matched with certified inspectors in your area within minutes, not days.",
              },
              {
                icon: <FunnelPlus size={24} />,
                title: "Inspection Type Filtering (RC, Masonry, Soils, etc.)",
                description:
                  "Track inspection progress with live updates and real-time communication.",
              },
              {
                icon: <Award size={24} />,
                title: "Admin-Approved Quality Control",
                description:
                  "All inspectors are pre-screened, certified, and continuously monitored.",
              },
              {
                icon: <ChartSpline size={24} />,
                title:
                  "Client Dashboard - Easy to manage requests, status, and payments",
                description:
                  "All inspectors are pre-screened, certified, and continuously monitored.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all .25s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  {/* vertical layout like the screenshot */}
                  <Box sx={{ textAlign: "left" }}>
                    {/* icon tile */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(255,255,255,0.06)"
                            : "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "primary.main",
                        mb: 1.5,
                      }}
                    >
                      {/* keep your 24px lucide icons */}
                      {feature.icon}
                    </Box>

                    {/* title */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 0.75 }}
                    >
                      {feature.title}
                    </Typography>

                    {/* description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Inspector Requirements Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                borderColor: "divider",
              }}
            >
              {/* NEW: split into two columns */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                  gap: { xs: 3, md: 4 },
                  alignItems: "center",
                }}
              >
                {/* Left: text + bullets + CTA */}
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1.5 }}>
                    Inspector Requirements
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Minimum Requirements to Join as Inspector
                  </Typography>

                  <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
                    {[
                      "ICC Certification (required for all disciplines)",
                      "ACI Certification (required for RC)",
                      "Valid photo ID",
                      "Subscription payment: $49.99/month",
                      "Service area selection (state/city)",
                      "Optional: reference letters, resume",
                    ].map((line, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            mt: "2px",
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: "text.disabled",
                            }}
                          />
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          {line}
                        </Typography>
                      </Stack>
                    ))}

                    <MotionButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={buttonSpring}
                      size="large"
                      variant="contained"
                      endIcon={<ArrowRight size={20} />}
                      onClick={handleStartApplication}
                      sx={{ mt: 2, alignSelf: "flex-start" }}
                    >
                      Start Application
                    </MotionButton>
                  </Stack>
                </Box>

                {/* Right: image with small overlay */}
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={inspectorRequirementsImage}
                    alt="Certified inspector reviewing documents on site"
                    loading="lazy"
                    sx={{
                      width: "100%",
                      display: "block",
                      borderRadius: 3,
                      boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                      objectFit: "cover",
                      aspectRatio: { xs: "4 / 3", md: "5 / 4" },
                    }}
                  />

                  {/* Optional overlay badge */}
                  <Paper
                    elevation={0}
                    sx={{
                      position: "absolute",
                      left: 12,
                      bottom: 12,
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Verified: ICC • ACI
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Trust & Transparency */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                Trust & Transparency
              </Typography>
              <Typography color="text.secondary">
                We operate with verified certifications and rigorous oversight
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {[
                {
                  icon: <BadgeCheck size={24} />,
                  title: "ICC / ACI certified",
                },
                { icon: <CreditCard size={24} />, title: "Stripe verified" },
                {
                  icon: <Building2 size={24} />,
                  title: "Compliant with local building departments",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  title: "Admin-reviewed profiles",
                },
              ].map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transition: "all .25s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(255,255,255,0.06)"
                          : "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {item.title}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mb: 4, px: { xs: 1, sm: 0 } }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                Testimonials
              </Typography>
              <Typography color="text.secondary">
                What our users say about InspectConnect
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {[
                {
                  quote: "I saved days finding a reliable inspector!",
                  author: "Client",
                  rating: 5,
                },
                {
                  quote: "This app sends me steady work every week.",
                  author: "Inspector",
                  rating: 5,
                },
              ].map((t, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all .25s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <Stack spacing={1.25}>
                    <Rating value={t.rating} max={5} readOnly size="small" />
                    <Typography variant="h6" sx={{ lineHeight: 1.4 }}>
                      “{t.quote}”
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      — {t.author}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "2fr 1fr 1fr 1fr",
              },
              gap: { xs: 3, md: 6 },
            }}
          >
            {/* Brand + Blurb */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{ mb: 2 }}
              >
                <Avatar
                  src={Logos.small}
                  alt="InspectConnect"
                  sx={{ width: { xs: 40, md: 40 }, height: { xs: 40, md: 40 } }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
                   Quality Inspections & Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    InspectConnect is your platform for seamless collaboration
                    between clients and inspectors. We simplify engagement,
                    ensure compliance, and help projects thrive.
                  </Typography>
                </Box>
              </Stack>
               
            </Box>

            {/* Information */}
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
                Information
              </Typography>
              <Stack spacing={1}>
               
                <Link href="/terms" underline="hover" color="text.secondary">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" underline="hover" color="text.secondary">
                  Privacy Policy
                </Link>
                <Link href="/faq" underline="hover" color="text.secondary">
                  FAQ
                </Link>
              </Stack>
            </Box>

            {/* Contact Us */}
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
                Contact Us
              </Typography>
              <Stack spacing={1}>
              <Link href="/about" underline="hover" color="text.secondary">
                  About Us
                </Link>
                <Link href="/contact" underline="hover" color="text.secondary">
                  Contact Us
                </Link>
              <Typography variant="body2">
                Email:{" "}
                <Link href="mailto:support@inspectconnect.com">
                  support@inspectconnect.com
                </Link>
              </Typography>
                </Stack>
            </Box>

            {/* Follow Us */}
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
                Follow Us
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Stay updated on the latest inspection trends and opportunities!
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <IconButton aria-label="Facebook">
                  <Facebook size={18} />
                </IconButton>
                <IconButton aria-label="Instagram">
                  <Instagram size={18} />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* Bottom bar */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              InspectConnect • © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
