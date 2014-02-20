var assert = require("assert");
var nock = require("nock");

var utils = require("../lib/utils.js");


describe("utils", function() {

  describe("request", function() {

    var nockMock;
    var fixture = "http://www.google.com";

    it("accepts a url string and a callback", function(done) {
      nockMock = nock(fixture).get("/").reply(200, '{"Super": "Cool", "Stuff": "Man"}');

      utils.request(fixture, function(err, res) {
        assert.equal(err, null);
        done();
      });
    });

    it("calls back with an error if not given a string url", function(done) {
      utils.request({}, function(err, res) {
        assert.equal(err instanceof Error, true);
        done();
      });
    });

    it("throws if the callback param is not a function", function(done) {
      assert.throws(function() {
        utils.request("");
      });
      done();
    });

    it("returns the response as an object", function(done) {
      nockMock = nock(fixture).get("/").reply(200, '{"Super": "Cool", "Stuff": "Man"}');

      utils.request(fixture, function(err, res) {
        assert.equal(err, null);
        assert.deepEqual(res, {Super: "Cool", Stuff: "Man"});
        done();
      });
    });

    it("returns an error if response is not valid json", function(done) {
      nockMock = nock(fixture).get("/").reply(200, "not valid json");

      utils.request(fixture, function(err, res) {
        assert.equal(err instanceof Error, true);
        done();
      });
    });

  });
});
