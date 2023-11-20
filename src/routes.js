"use strict";

import { executeQuery } from "./utility.js";
import { getDate as localDate } from "./utility.js";

const appinfo = { year: new Date().getFullYear() };

const home = async (req, res, next) => {
  let todolist = [],
    error = null;
  try {
    todolist = await executeQuery("./src/getTodo.sql");
    todolist = todolist.rows;
  } catch (err) {
    error = "couldn't fetch todolist at the moment";
    todolist = [];
    console.error(err);
  }

  res.status(200).render("index", {
    appinfo: appinfo,
    title: localDate(),
    todoList: todolist,
    error: error,
  });
};

const addItem = async (req, res, next) => {
  if (req.body.item) {
    try {
      await executeQuery("./src/insertTodo.sql", req.body.item.trim());
    } catch (err) {
      console.error(err);
    }
  }

  res.status(301).redirect("/");
};

const updateItem = async (req, res, next) => {
  if (req.body.id && req.body.item) {
    try {
      await executeQuery(
        "./src/updateTodo.sql",
        parseInt(req.body.id),
        req.body.item.trim(),
      );
    } catch (err) {
      console.error(err);
    }
  }
  res.status(301).redirect("/");
};

const deleteItem = async (req, res, next) => {
  if (req.body.id) {
    try {
      await executeQuery("./src/deleteTodo.sql", parseInt(req.body.id));
    } catch (err) {
      console.error(err);
    }
  }

  res.status(301).redirect("/");
};

export { home, updateItem, addItem, deleteItem }