const Firestore = require("@google-cloud/firestore");
const db = new Firestore({
  projectId: "community-305403",
});
module.exports = db;
