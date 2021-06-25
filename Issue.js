const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    console.log("mongoose conected");
  }
);
const issueSchema = new mongoose.Schema({
  project: {
    type: String,
  },
  open: Boolean,
  issue_title: { type: String, default: "" },
  issue_text: { type: String, default: "" },
  created_by: { type: String, default: "" },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
});
const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
