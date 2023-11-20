//jshint esversion:6

"use strict";

import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import localeDate from "./utility.js";

// ----------------- Middlewear ------------------------------------//

const app = express();
const port = 3999;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), "public");

// To enable express to serve-up static files.
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(cookieParser());

// uncomment it during deployment

// app.use(cors());

// SETTING-UP EJS: This tells app to use 'ejs' as our view-engine
app.set("view engine", "ejs");

// ----------------- Middlewear ----------------------------------//

let todoList = new Set();
let workList = new Set();
const sectionPaths = {
  home: "/",
  work: "/work",
};
Object.freeze(sectionPaths);

app.get("/", (req, res) => {
  console.log("Cookies: ", req.cookies);
  console.log("signed cookies: ", req.signedCookies);

  res.status(200).render("index", {
    title: localeDate(),
    todoList: todoList,
    siteSection: "home",
  });
});

app.post("/add-item", (req, res) => {
  let item = req.body.inputTodo;
  let siteSection = req.body.section;
  if (item != undefined && item != null && Boolean(item.trim())) {
    switch (true) {
      case siteSection.toLowerCase() == "home": {
        todoList.add(req.body.inputTodo.toLowerCase());
        break;
      }

      case siteSection.toLowerCase() == "work": {
        workList.add(req.body.inputTodo.toLowerCase());
        break;
      }
    }
  }
  res.redirect(sectionPaths[siteSection.toLowerCase()]);
});

app.post("/delete-item", (req, res) => {
  let siteSection = req.body.section;
  switch (true) {
    case siteSection.toLowerCase() == "home": {
      todoList.delete(req.body.deleteItem.toLowerCase());
      break;
    }

    case siteSection.toLowerCase() == "work": {
      workList.delete(req.body.deleteItem.toLowerCase());
      break;
    }
  }

  res.redirect(sectionPaths[siteSection.toLowerCase()]);
});

app.post("/update", (req, res) => {
  console.log("Update");
  console.log(req.body);
  res.status(301).redirect("/");
});

app.get("/work", (req, res) => {
  res.render("index", {
    title: "Work List",
    todoList: workList,
    siteSection: "work",
  });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
