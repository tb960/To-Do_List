const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

let listTitle = "";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-jonathan:Test123@cluster0-tmjin.mongodb.net/todolistDB", {useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false});

const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  const day = date.getDate();

  List.find(function(err, lists) {

    if (err) {
      console.log(err);
    }
    else {
      res.render("index", {
        day: day,
        lists: lists
      });
    }

  });

});

app.post("/", function(req, res) {

  if (req.body.status === "createList") {
    listTitle = _.capitalize(req.body.listTitle);

    // Create a new list in DB
    const newList = new List({
      name: listTitle,
      items: [] // Initialise empty array
    });

    newList.save();

    res.render("list", {
      listTitle: newList.name,
      listItems: newList.items
    });

  } else if (req.body.status === "addItems") {

    // Add items if list exists
    const newItem = new Item({
      name: req.body.listItem
    });

    List.findOne({name: listTitle}, function(err, foundList) {

      if (err) {
        console.log(err);
      }
      else {
        foundList.items.push(newItem);
      }

      foundList.save();

      res.render("list", {
        listTitle: foundList.name,
        listItems: foundList.items
      });

    });
  }

});

app.post("/save", function(req, res) {
  res.redirect("/");
});

app.get("/lists/:requestedList", function(req, res) {

  listTitle = _.capitalize(req.params.requestedList);

  List.findOne({name: listTitle}, function(err, foundList) {

    if (err) {
      console.log(err);
    }
    else {

      res.render("list", {
        listTitle: foundList.name,
        listItems: foundList.items
      });

    }

  });

});

app.post("/delete", function(req, res) {

  const checkedItemId = req.body.checkbox;

  List.findOneAndUpdate({name: listTitle}, {$pull: {items: {_id: checkedItemId}}}, function(err) {
    if (err){
      console.log(err);
    }
    else {
      res.redirect("/lists/" + listTitle);
    }
  });

});

app.post("/delete-list", function(req, res) {

  const listId = req.body.delete;

  List.findOneAndRemove({_id: listId}, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is listening at port");
});
