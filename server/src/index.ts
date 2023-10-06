/**
 * This is the main file of struct_01.
 * This file used to setup, configure something before starting.
 */
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const Server = require("./classes/Server");
// const ServerBuilder = require("./classes/ServerBuilder");

// const PostRouter = require("./modules/post");
import bodyParser from "body-parser";
import cors from "cors";

import MyServer from "classes/MyServer";
import ServerBuilder from "classes/ServerBuilder";

// DBs
import Temp_ADB from "db/temp_a";

import PostRouter from "modules/post";

const ExpressServer = new MyServer({ port: process.env.PORT || "3000" });
const builder = new ServerBuilder({ server: ExpressServer });

/**
 * The order of build actions is not important.
 */

// Build something before start
// Build middle-wares
builder.buildMiddleWare(cors({ origin: "*" }));
builder.buildMiddleWare(bodyParser.json());
builder.buildMiddleWare(bodyParser.urlencoded({ extended: true }));

// Build API
// http://localhost:3000/api/post?id=post_01
// http://localhost:3000/api/posts
let base = "/api";
builder.buildAPI(base, PostRouter);

// Connect to DB
builder.buildDBConnection(Temp_ADB.connect());

// Start new server.
ExpressServer.start();