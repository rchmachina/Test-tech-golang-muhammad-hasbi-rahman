import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Collapse,
  IconButton,
  Alert,

} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { decryptMessage, encryptMessage } from "../utils/saverData";
import { postData } from "../utils/axios";

const Contact = () => {
  const [alertState, setAlertState] = useState({
    message: "",
    severity: "",
    isOpen: false,
  });



  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

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
    

  const [formData, setFormData] = useState({
    noHp: "",
  });



  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (formData.noHp.slice(0, 2) !== "08" && formData.noHp.slice(0, 2) !== "62") {
        throw "wrong format use 62 or 08 instead!";
      }
      const encryptedMessage = encryptMessage(formData.noHp);

      await postData(`postHP`, { encryptedMessage });
      console.log(decryptMessage(encryptedMessage));
      showAlert(`Success adding ${formData.noHp}`, 'success');
    } catch (error) {

      //error === error?.response?.data?.message ? error.response.data.message : error;

      showAlert(error, 'error');
    }
  };

  const handleRandom = async () => {
    try {
      const data = "true";
      const encryptedMessage = encryptMessage(data);

      await postData(`postHPBulk`, { isValid: encryptedMessage });

      showAlert('Success adding new 25 numbers', 'success');
    } catch (error) {
      console.log(error);
      showAlert('Something went wrong', 'error');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Collapse in={alertState.isOpen}>
        <Alert
          severity={alertState.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlert}
            >
              <CloseIcon/>
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertState.message}
        </Alert>
      </Collapse>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter phone number"
          type="number"
          variant="outlined"
          fullWidth
          name="noHp"
          value={formData.noHp}
          onChange={handleChange}
          margin="normal"
        />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "16px" }}
          >
            Submit
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={handleRandom}
          >
            Random
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Contact;
