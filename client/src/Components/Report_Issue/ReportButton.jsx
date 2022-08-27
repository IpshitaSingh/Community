import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import "../../App.css";
import { Typography } from "@material-ui/core";
import myTheme from "./MyTheme";
import { ThemeProvider } from "@material-ui/core/styles";
import CardModal from "./Modal";
import "./form.css";

const ReportButton = ({ show, setShow }) => {
  const handleClick = () => setShow(true);

  return (
    <div className="overlayHolder">
      <ThemeProvider theme={myTheme}>
        <Button
          variant="contained"
          color="secondary"
          id="newIssueButton"
          onClick={handleClick}
        >
          <Typography variant="h6" style={{ fontFamily: "Patua One" }}>
            New Report
          </Typography>
        </Button>
        <CardModal show={show} setShow={setShow} />
      </ThemeProvider>
    </div>
  );
};

export default ReportButton;
