const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
suite("Functional Tests", function () {
  var issue;
  test("Create an issue with every field", (done) => {
    chai
      .request(server)
      .post("/api/issues/akshay")
      .send({
        issue_title: "nothign",
        issue_text: "test",
        created_by: "Don",
        status_text: "good",
        assigned_to: "me",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "nothign");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "Don");
        assert.equal(res.body.assigned_to, "me");
        assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, "good");
        issue = res.body;
        done();
      });
  });
  test("Create an issue with only required fields", (done) => {
    chai
      .request(server)
      .post("/api/issues/akshay")
      .send({
        issue_title: "nothign",
        issue_text: "test",
        created_by: "Don",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "nothign");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "Don");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, "");
        done();
      });
  });
  test("Create an issue with missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/issues/akshay")
      .send({
        issue_title: "nothign",
        issue_text: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  test("View issues on a project", (done) => {
    chai
      .request(server)
      .get("/api/issues/akshay")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isArray(res.body);

        done();
      });
  });
	test("View issues on a project with one filter",(done)=>{
		chai
		.request(server)
		.get('/api/issues/akshay/?open=false')
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.isArray(res.body)
      done();
    })
	})
	test("View issues on a project with multiple filters",(done)=>{
		chai
		.request(server)
		.get('/api/issues/akshay/?open=true&issue_title=nothign')
		.end((err,res)=>{
			assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isArray(res.body);
        done();
      })
	})
  test("Update one field on an issue",(done)=>{
		chai
		.request(server)
		.put('/api/issues/akshay')
    .send({
      _id: issue._id,
      open: false
    })
		.end((err,res)=>{
      assert.equal(res.body.result,"successfully updated");
      assert.equal(res.body._id,issue._id);
      done();
    })
	})
  test("Update multiple fields on an issue",(done)=>{
		chai
		.request(server)
		.put('/api/issues/akshay')
    .send({
      _id: issue._id,
      open: true,
      issue_title: "new"
    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.result,"successfully updated")
      assert.equal(res.body._id, issue._id);
      done();
    })
	})
  test("Update an issue with missing _id",(done)=>{
		chai
		.request(server)
		.put('/api/issues/akshay')
    .send({
      open: false,
      issue_title: "errr"
    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, "missing _id")
      done();
    })
	})
  test("Update an issue with no fields to update",(done)=>{
		chai
		.request(server)
		.put('/api/issues/akshay')
    .send({
      _id: issue._id
    })
		.end((err,res)=>{
      assert.equal(res.status,200);
      assert.equal(res.body.error,"no update field(s) sent");
      assert.equal(res.body._id, issue._id);
      done();
    })
	})
  test("Update an issue with an invalid _id",(done)=>{
		chai
		.request(server)
		.put('/api/issues/akshay')
    .send({
      _id:"thisisainvalidid",
      open: false,
      issue_title: "errr"
    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, "could not update");
      assert.equal(res.body._id, "thisisainvalidid");
      done();
    })
	})
  test("Delete an issue",(done)=>{
		chai
		.request(server)
		.delete('/api/issues/akshay')
    .send({
      _id: issue._id
    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.result, "successfully deleted");
      assert.equal(res.body._id,issue._id);
      done();
    })
	})
  test("Delete an issue with an invalid _id",(done)=>{
		chai
		.request(server)
		.delete('/api/issues/akshay')
    .send({
      _id: 'kajdflasjlkflsdjlkflsdkajfur987349'
    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error, "could not delete")
      assert.equal(res.body._id, 'kajdflasjlkflsdjlkflsdkajfur987349');
      done();
    })
	})
  test("Delete an issue with missing _id",(done)=>{
		chai
		.request(server)
		.delete('/api/issues/akshay')
    .send({

    })
		.end((err,res)=>{
      assert.equal(res.status, 200);
      assert.equal(res.body.error,"missing _id");
      done();
    })
	})
});
