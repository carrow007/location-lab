var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LOCATION_COLLECTION = "locations";

var app = express();

// let's get our json on
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// connect to the database server!
var url = 'mongodb://localhost:27017/location'
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app. another way to start a server in express
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

  console.log("Database connection ready");

  // when things go wrong
  function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
      "error": message
    });
  };

  app.get("/locations", function(req, res) {
    // find all character and return them as an array
    db.collection(LOCATION_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get location.");
      } else {
        res.status(200).json(docs);
      };
    });
  });

  // save location to favorites
  app.post("/locations", function(req, res) {
    var newLocation = req.body;
    newLocation.createData = new Date();

    // insert one new character
    db.collection(LOCATION_COLLECTION).insertOne(newLocation, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to add new location.");
      } else {
        res.status(201).json(doc.ops[0]);
      };
    });
  });
// delete by location?
app.delete("/locations/:name", function(req, res) {

  db.collection(LOCATION_COLLECTION).remove({ name: req.params.name }, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(204).end();
    }
  });

});

app.put("/locations/:name", function(req, res) {

  // we can't update the id field so we need remove the prop from the obj
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(LOCATION_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      res.status(204).end();
    }
  });


});

