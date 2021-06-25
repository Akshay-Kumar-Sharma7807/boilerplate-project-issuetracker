"use strict";
const Issue = require("../Issue");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let query = req.query;
      query.project = project;
      Issue.find(query, (err, doc) => {
        if (err) return res.json([]);
        if (doc < 1) {
          return res.json([]);
        }
        res.json(doc);
      });
    })

    .post(function (req, res) {
      // console.log(req.body);
      let project = req.params.project;

      let { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (
        issue_title === undefined ||
        issue_text === undefined ||
        created_by === undefined
      ) {
        return res.json({ error: "required field(s) missing" });
      }
      Issue.find({ project: project }, (err, doc) => {
        // if (err) return console.log(err);
        let newissue = new Issue({
          project,
          open: true,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        });
        // console.log(newproject)
        newissue.save(function (err, data) {
          // console.log("data:" + data);
          if (err) return console.error(err);
          res.json({
            assigned_to: data.assigned_to,
            status_text: data.status_text,
            open: data.open,
            _id: data.id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_by: data.created_by,
            created_on: data.created_on,
            updated_on: data.updated_on,
          });
        });
      });
      // let newproject = new Project({
      //   project,
      //   issues:[{
      //     issue_title,
      //     issue_text,
      //     created_by,
      //     assigned_to,
      //     status_text
      //   }]
      // })
      // // console.log(newproject)
      // newproject.save(function(err, data) {
      //   console.log("data:"+data)
      //   if (err) return console.error(err);
      //   res.json(data)
      // })
    })

    .put(function (req, res) {
      // let project = req.params.project;
      // console.log(req.body);
      let id = req.body._id;
      if (id === undefined) {
        return res.json({ error: "missing _id" });
      }
      if (
        req.body.issue_text === undefined &&
        req.body.issue_title === undefined &&
        req.body.open === undefined &&
        req.body.created_by === undefined &&
        req.body.assigned_to === undefined &&
        req.body.status_text === undefined
      ) {
        return res.json({ error: "no update field(s) sent", _id: id });
      }
      let update = {
        issue_title: req.body.issue_title || "",
        issue_text: req.body.issue_text || "",
        created_by: req.body.created_by || "",
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        updated_on: new Date().toISOString(),
      };
      if (req.body.open === "true") {
        update.open = true;
      } else if (req.body.open === "false") {
        update.open = false;
      } else {
        //nothing
      }
      Issue.findByIdAndUpdate(id, update, (err, data) => {
        if (err) {
          return res.json({ error: "could not update", _id: id });
        }
        if (!data) {
          return res.json({ error: "could not update", _id: id });
        }
        res.json({ result: "successfully updated", _id: id });
      });
    })

    .delete(function (req, res) {
      let id = req.body._id;
      if (id === undefined) {
        return res.json({ error: "missing _id" });
      }

      Issue.findByIdAndDelete(id, (err, data) => {
        if (err) {
          return res.json({ error: "could not delete", _id: id });
        }
        console.log(data);
        if (!data) {
          return res.json({ error: "could not delete", _id: id });
        }
        res.json({ result: "successfully deleted", _id: id });
      });
    });
};
