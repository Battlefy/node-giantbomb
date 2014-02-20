//var http = require("http");
var request = require("request");

var _ = require("underscore");

/**
 * Helper function to send requests
 * @param  {String}   reqUrl The url to send the request to.
 * @param  {Function} cb     The callback to be called on error or on request completion
 */
var _request = function(reqUrl, cb) {
  request(reqUrl, function(error, response, body) {
    if (error) {
      cb(error, null);
    } else if (response.statusCode !== 200) {
      cb(new Error("request failed. Response code: " + "response.statusCode"));
    } else {
      var respObj;

      try {
        respObj = JSON.parse(body);
      } catch(e) {
        return cb(new Error("Response was not valid JSON"), null);
      }

      cb(null, respObj);
    }
  });
};

module.exports = {
  request: _request
};
