const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const collection = db.collection("posts");
  const documents = await collection.get();
  let docArray = [];
  try {
    documents.forEach((doc) => docArray.push(doc.data()));
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error");
  }
  res.status(200).send(docArray);
});

module.exports = router;
