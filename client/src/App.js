import React, { useState } from "react";
import Map from "./Components/Map/Map";
import "./App.css";
import IssuesDrawer from "./Components/Issues_Drawer/IssuesDrawer";
import { BrowserRouter, Route } from "react-router-dom";
import ReportButton from "./Components/Report_Issue/ReportButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import { PinProvider } from "./PinContext.js";

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <PinProvider>
      <BrowserRouter>
        <div className="root">
          <CssBaseline />
          <IssuesDrawer show={show} setShow={setShow} />
          <Map show={show} setShow={setShow} />
          <ReportButton show={show} setShow={setShow} />
        </div>
      </BrowserRouter>
    </PinProvider>
  );
}
