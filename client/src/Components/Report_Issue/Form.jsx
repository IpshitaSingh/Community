import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { ThemeProvider } from "@material-ui/core/styles";
import myTheme from "./MyTheme";
import ReactMapGL from "react-map-gl";
import "./form.css";
import MarkerItem from "../Map/Markers";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { v4 as uuidv4 } from "uuid";

const Form = ({ show, setShow }) => {
  const [uploadedFile, setUploadedFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    triedTitle: false,
    triedDescription: false,
    finishedFile: false,
    imgURL: "",
    type: "",
  });

  const [viewport, setViewport] = useState({
    width: "50vw",
    height: "50vh",
    latitude: 32.8801,
    longitude: -117.234,
    zoom: 12,
  });

  const {
    title,
    description,
    triedTitle,
    triedDescription,
    type,
    imgURL,
    finishedFile,
  } = formData;

  const uploadFile = async (fileData) => {
    setUploadedFile(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formData2 = new FormData();
    formData2.append("image", fileData);
    const result = await axios.post("/api/upload", formData2, config);
    setFileName("Uploaded: "+fileData.name);
    setFormData({...formData, imgURL: result.data.url, finishedFile: true});
  };

  const titleTried = () => {
    setFormData({ ...formData, triedTitle: true });
  };
  const descriptionTried = () => {
    setFormData({ ...formData, triedDescription: true });
  };
  const onChangeTitle = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };
  const onChangeDescription = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };
  const onChangeType = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };
  const checkTitle = () => {
    console.log(title);
    return title && title.length > 0;
  };
  const checkDescription = () => {
    return description && description.length > 0;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (checkTitle() && checkDescription()) {
      const newItem = {};
      newItem.id = uuidv4();
      newItem.title = title;
      newItem.description = description;
      newItem.coordinates = {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      };
      newItem.type = type;
      newItem.imageURL = imgURL;
      newItem.upvotes = 0;
      newItem.resolved = 0;
      await axios.post("/api/create-event", newItem, config);
      setUploadedFile(false);
      setFormData({ ...formData, finishedFile: false });
      setFileName("");
    } else {
      setFormData({ ...formData, triedTitle: true, triedDescription: true });
    }
    setShow(false);
  };

  return (
    <div className="Modal">
      <Card id="reportCard" className="Form">
        <Typography
          variant="h4"
          style={{ fontFamily: "Patua One", marginBottom: 15 }}
        >
          New Report:
        </Typography>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <div id="form-inputs">
            <Box pb={1.87} width="100%">
              <TextField
                id="title"
                value={title}
                required
                label="Title"
                variant="outlined"
                onChange={(e) => onChangeTitle(e)}
                error={!checkTitle() && triedTitle}
                onBlur={titleTried}
                fullWidth={true}
              />
            </Box>
            <Box pb={1.87} width="100%">
              <TextField
                id="Description"
                required
                label="Description"
                variant="outlined"
                onChange={(e) => onChangeDescription(e)}
                onBlur={descriptionTried}
                error={!checkDescription() && triedDescription}
                fullWidth={true}
              />
            </Box>
          </div>

          <div className="Map">
            <ReactMapGL
              {...viewport}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
            >
              <MarkerItem />
            </ReactMapGL>
          </div>

          <br />

          <div className="Buttons">
            {uploadedFile ? (
              (finishedFile ? <Typography variant="h7">{fileName}</Typography> : <CircularProgress />)
            ) : (
              <ThemeProvider theme={myTheme}>
                <input
                  id="input"
                  name="image"
                  type="file"
                  hidden
                  onChange={(result) => uploadFile(result.target.files[0])}
                />
                <span
                  onClick={() =>
                    global.document.getElementById("input").click()
                  }
                >
                  <Button variant="contained" color="primary" id="upload">
                    Upload Image
                  </Button>
                </span>
              </ThemeProvider>
            )}

            {"     "}

            <ThemeProvider theme={myTheme}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                id="next"
              >
                Submit
              </Button>
            </ThemeProvider>
          </div>
          {uploadedFile ? (
            <div className="typeInput">
              <Typography variant="h6">Type: </Typography>
              <FormControl>
                <Select
                  value={formData.type}
                  onChange={onChangeType}
                  displayEmpty
                >
                  <MenuItem value="Natural Disasters">
                    Natural Disasters
                  </MenuItem>
                  <MenuItem value="Public Disturbances">
                    Public Disturbances
                  </MenuItem>
                  <MenuItem value="Vaccination Centers">
                    Vaccination Centers
                  </MenuItem>
                  <MenuItem value="Food Services">Food Services</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            <div></div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Form;
