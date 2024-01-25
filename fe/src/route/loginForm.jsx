// src/App.js
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,

  Alert,
  IconButton,
} from "@mui/material";
import { postData } from "../utils/axios";
import CloseIcon from '@mui/icons-material/Close';


const EmailPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertState, setAlertState] = useState({
    message: "",
    severity: "",
    isOpen: false,
  });

  const showAlert = (message, severity) => {
    setAlertState({
      message,
      severity,
      isOpen: true,
    });
  };

  const handleCloseAlert = () => {
    setAlertState((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      showAlert("Invalid email format", "error");
      // Handle invalid email logic if needed
      return;
    }

    // Password validation (example: at least 6 characters)
    if (password.length < 6) {
      
      showAlert("Password must be at least 6 characters long", "error");
      // Handle invalid password logic if needed
      return;
    }
    const response = await postData(`loginForm`, {
      email: email,
      password: String(password),
    });

    if (response.redirectUrl) {
      // Redirect the user
      window.location.href = response.redirectUrl;
    } else {
      // Handle other logic if needed
      console.error("Redirect URL not found in the response");
    }
  };

  return (
    <div>
      <Alert
        severity={alertState.severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleCloseAlert}
          >
            <CloseIcon />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {alertState.message}
      </Alert>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
    </div>
  );
};

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8082/api/V1/login";
  };

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={handleGoogleLogin}
    >
      Login with Google
    </Button>
  );
};
const LoginForm = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <EmailPasswordForm />
        <GoogleLoginButton />
      </Paper>
    </Container>
  );
};

export default LoginForm;
