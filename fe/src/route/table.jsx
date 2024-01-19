import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Button,
  Collapse,
  IconButton,
  Alert,
  TextField,
  Card,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { fetchingData, postData, putData } from "../utils/axios";
import { decryptMessage, encryptMessage } from "../utils/saverData";

const TableData = () => {
  const [data, setData] = useState([]);
  const [update, setUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alertState, setAlertState] = useState({
    message: "",
    severity: "",
    isOpen: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    oldNumber: "",
    numberPhone: "",
  });

  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

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

  async function fetchData() {
    try {
      setLoading(true);
      const getData = await fetchingData("getdata");
      const data = JSON.parse(decryptMessage(getData.message));

      setData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchData(); 
  
    const intervalId = setInterval(() => {
      fetchData(); 
    }, 360000); 
    return () => {
      clearInterval(intervalId);
    };
  }, [update]);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleDeleteData = async (data) => {
    try {
      const encryptedMessage = await encryptMessage(data.id);

      await postData(`deletedata`, { encryptedMessage: encryptedMessage });
      setUpdateFormVisible(false);
      setUpdated(true);
    } catch (error) {
      showAlert("error", "error");
    } finally {
      showAlert(`Success deleting data ${data.numberPhone}`, "success");
    }
  };

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(updateFormData.numberPhone)
      if (updateFormData.numberPhone.slice(0, 2) !== "08" && updateFormData.numberPhone.slice(0, 2) !== "62") {
        throw "wrong format use 62 or 08 instead!";
      }
      const encryptedNewNumber = await encryptMessage(
        JSON.stringify(updateFormData)
      );

      await putData(`update-data`, { encryptedMessage: encryptedNewNumber });
      showAlert("Success updating number", "success");
      setUpdateFormVisible(false);
      setUpdated(true);
    } catch (error) {
      console.log(error);
      showAlert(error, "error");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
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
              <CloseIcon />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertState.message}
        </Alert>
      </Collapse>
      <Grid container spacing={2}>
        <div
          style={{
            flex: 1,
            margin: "30px",
            maxHeight: "300px",
            overflowY: "auto",
            borderStyle: "solid",
          }}
        >
          <TableContainer component={Card}>
            <Table variant="" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ top: 0, background: "white" }}>
                    Nomor hp genap
                  </TableCell>
                  <TableCell
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "white",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(
                  (row) =>
                    row.numberPhone % 2 === 0 && (
                      <TableRow key={row.id}>
                        <TableCell>
                          <span style={{ color: "green" }}>
                            {row.numberPhone}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Grid container spacing={2}>
                            <Button
                              onClick={() => handleDeleteData(row)}
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setUpdateFormVisible(true);
                                setUpdateFormData({
                                  oldNumber: row.numberPhone,
                                  numberPhone: "",
                                  id: row.id,
                                });
                              }}
                            >
                              Update
                            </Button>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Second Table */}
        <div
          style={{
            flex: 1,
            margin: "30px",
            maxHeight: "300px",
            overflowY: "auto",
            borderStyle: "solid",
          }}
        >
          <TableContainer component={Card}>
            <Table variant="" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ top: 0, background: "white" }}>
                    Nomor hp ganjil
                  </TableCell>
                  <TableCell
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "white",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(
                  (row) =>
                    row.numberPhone % 2 !== 0 && (
                      <TableRow key={row.id}>
                        <TableCell>
                          <span style={{ color: "green" }}>
                            {row.numberPhone}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Grid container spacing={2}>
                            <Button
                              onClick={() => handleDeleteData(row)}
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setUpdateFormVisible(true);
                                setUpdateFormData({
                                  oldNumber: row.numberPhone,
                                  numberPhone: "",
                                  id: row.id,
                                });
                              }}
                            >
                              Update
                            </Button>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
      {/* Update Number Form */}

      {isUpdateFormVisible && (
        <div style={{ flex: 1, margin: "30px" }}>
          <form onSubmit={handleUpdateFormSubmit}>
            <TextField
              label="Old Number"
              variant="outlined"
              fullWidth
              value={updateFormData.oldNumber}
              disabled
              style={{ marginBottom: "16px" }}
            />
            <TextField
              label="New Number"
              variant="outlined"
              fullWidth
              value={updateFormData.numberPhone}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  numberPhone: e.target.value,
                })
              }
              style={{ marginBottom: "16px" }}
            />
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "16px" }}
                >
                  Update Number
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant="contained"
                  style={{
                    marginTop: "16px",
                    backgroundColor: "red",
                    color: "white",
                  }}
                  onClick={() => {
                    setUpdateFormVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </Box>
  );
};

export default TableData;
