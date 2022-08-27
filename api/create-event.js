const express = require("express");
const router = express.Router();
const db = require("../db");
const vision = require("@google-cloud/vision");

router.post("/", async (req, res) => {
  const doc = db.collection("posts").doc();
  try {
    await doc.set(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error");
  }
  res.status(200).send("Added Post");
});

router.get("/vision", async (req, res) => {
  const uri = req.body.uri;
  const imageClient = new vision.ImageAnnotatorClient();
  const visionRequest = {
    image: {
      source: {
        imageUri: uri,
      },
    },
  };

  const [visionResult] = await imageClient
    .labelDetection(visionRequest)
    .catch((err) => {
      console.error(err);
      res.status(500).send("There was a problem with the server");
    });
  const label = visionResult.labelAnnotations;
  res.status(200).send(label);
});

module.exports = router;
