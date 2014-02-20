var assert = require("assert");
var sinon = require("sinon");

var gbClass = require("../lib/giantbomb.js");
var utils = require("../lib/utils.js");

describe("GiantBomb", function() {

  var gb;
  var mockApiKey = "92394hb484nbu8hd8b38gnr";

  describe("the constructor", function() {

    it("is defined as a function", function() {
      assert.equal(typeof gbClass, "function");
    });

    it("accepts an apiKey as a string and sets it on the instance", function() {
      assert.doesNotThrow(function() {
        gb = new gbClass(mockApiKey);
      });
      assert.equal(gb.apiKey, mockApiKey);
    });

    it("throws if missing apiKey", function() {
      assert.throws(function() {
        new gbClass();
      });
    });

  });


  describe("game", function() {

    var mockCb = function(obj, method, err, res) {
      return sinon.stub(utils, "request", function() {
        var cb = arguments[arguments.length-1];

        if (typeof cb != "function") {
          throw new Error("mockModelCb: the cb called is not a function.");
        }

        cb(err, res);
      });
    };

    it("accepts a query string, an opts object and a callback", function(done) {
      mock = mockCb(utils, "request", null, null);
      gb.game("", {}, function(err, res) {
        assert.equal(err, null);
        done();
      });
    });

    it("accepts a query string, and a callback", function(done) {
      gb.game("", function(err, res) {
        assert.equal(err, null);
        utils.request.restore();
        done();
      });
    });

    it("returns error if query param is not a string", function(done) {
      gb.game({}, {}, function(err, res) {
        assert.equal(err instanceof Error, true);
        done();
      });
    });

    it("returns error if opts param is not an object", function(done) {
      gb.game("", "", function(err, res) {
        assert.equal(err instanceof Error, true);
        done();
      });
    });

    it("throws error if callback param is not an function", function(done) {
      assert.throws(function() {
        gb.game("", {}, "");
      });
      done();
    });
  });

  describe("_buildUrl", function() {

    it("takes a resource string and queryObj as params", function() {
      var urlString = gb._buildUrl("games", {
        field_list: ["name", "image"],
        filter: ["aliases:css", "name:Counter-Strike: Source"],
        offset: 0,
        limit: 1
      });

      assert.equal(typeof urlString, "string");
    });
  });

  describe("buildFilter", function() {

    var fixture = {
      name: "God of War",
      alias: "GOW"
    };

    var resultArray;

    it("Takes an object", function() {
      resultArray = gb.buildFilter(fixture);
    });

    it("returns an Array", function() {
      result = resultArray instanceof Array;
      assert.equal(result, true);
    });

    it("Result array elements are formatted as 'key:value'", function() {
      assert.equal(resultArray[0], "name:God of War");
    });

    it("throws if filter param is not an object", function() {
      assert.throws(function() {
        gb.buildFilter("");
      });
    });
  });

});
