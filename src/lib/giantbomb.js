var request = require("request");
var url = require("url");
var clone = require("clone");
var _ = require("underscore");
var async = require("async");

var utils = require("./utils.js");

var gb = function(key) {
  if (typeof key !== "string")
    throw new Error("You must provide an api key as a string");

  this.apiKey = key;

  this._baseUrl = {
    protocol: "http:",
    host: "www.giantbomb.com",
    pathname: "/api/",
    query: {
      api_key: this.apiKey,
      format: "json",
      sort: "original_release_date:desc"
    }
  };
};

/**
 * Abstraction to the game resource
 * @param  {[type]}   query [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
gb.prototype.game = function(query, opts, cb) {

  if (typeof query !== "string") {
    return cb(new Error("query param must be of type String"), null);
  }

  if (typeof opts === "function" && cb === undefined) {
    cb = opts;
  } else {
    if (!(opts instanceof Object)) {
      return cb(new Error("opts must be of type Object"), null);
    }
  }

  if (typeof cb !== "function") {
    throw new Error("cb must be of type function");
  }

  var queryObj = {};

  if (opts.fields !== undefined) {
    queryObj.field_list = opts.fields;
  }

  if (opts.filter !== undefined) {
    queryObj.filter = this.buildFilter(opts.filter);
  }

  if (opts.offset !== undefined) {
    queryObj.offset = opts.offset;
  }

  if (opts.limit !== undefined) {
    queryObj.limit = opts.limit;
  }

  var urlString = this._buildUrl("games", queryObj);

  utils.request(urlString, cb);
};

gb.prototype.getAll = function(resource, opts, cb) {
  opts.limit = 1;

  var batchedResults = [];

  var _this = this;
  // make first request to get the number of results
  this[resource]("", opts, function(err, res) {
    if (err) {
      return cb(err);
    }
    //calc the total number of requests that will be needed (limit 100 results per request)
    var numResults = res.number_of_total_results;

    if (numResults !== 0) {
      //push the first result to the batch
      batchedResults.push(res.results[0]);

      var numOfRequiredRequests = Math.ceil(numResults / 100);

      opts.limit = 100;
      opts.offset = 1;

      //array of functions that will make up all the requests to be made
      var flow = [];

      for(var i = 0; i < numOfRequiredRequests; i++) {
        flow.push(function(_cb) {
          // make a request, push the results to the batch
          _this[resource]("", opts, function(err, resultSet) {
            _.each((resultSet && resultSet.results) || [], function(val) {
              batchedResults.push(val);
            });

            opts.offset += 100;
            _cb(err, null);
          });
        })
      }

      async.series(flow, function(err, result) {
        return cb(err, batchedResults);
      });
    } else {
      return cb(null, []);
    }
  });
};

gb.prototype._buildUrl = function(resource, queryObj) {
  var urlObj = clone(this._baseUrl);
  urlObj.pathname += "" + resource + "/";

  _.each(queryObj, function(val, key) {
    if (val instanceof Array) {
      queryObj[key] = val.join();
    }
  });

  _.extend(urlObj.query, queryObj);

  return url.format(urlObj);
};

gb.prototype.buildFilter = function(filterObj) {
  if (!(filterObj instanceof Object)) {
    throw new Error("filter param must be of type Object");
  }

  return _.map(filterObj, function(val, key) {
    return "" + key + ":" + val;
  });
};


module.exports = gb;
