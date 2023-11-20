//jshint esversion:6

"use strict";

import dotenv from "dotenv/config"
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import db from "./src/utility.js";
import { home, updateItem, deleteItem, addItem } from "./src/routes.js"

const app = express();
const port = process.env.PORT || 3999;
const server = app.listen(port, () => {
    console.debug(`Listening to port: ${port}`);
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), "public");

// ----------------- Middlewear ------------------------------------//

// To enable express to serve-up static files.
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: ["application/json", "text/plain"] }));
app.use(cookieParser());

// SETTING-UP EJS: This tells app to use 'ejs' as our view-engine
app.set("view engine", "ejs");

// ----------------- Middlewear ----------------------------------//

app.get("/", home);

app.post("/add-item", addItem);

app.post("/delete-item", deleteItem);

app.post("/update", updateItem);

const cleanup = () => {
    server.close(() => {
        console.debug("shutting down the server");
        db.end();
        process.exit(0);
    });

    setTimeout(() => {
        console.debug("couldn't close in-time, force shutting down");
        process.exit(-1);
    });
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
