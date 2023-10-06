import PostModel from "./post";

import Utils from "utils";

export default class Temp_ADB {
  static isConnected = false;
  Post!: PostModel;

  constructor() {
    this.Post = new PostModel();
  }

  static async connect() {
    if(Temp_ADB.isConnected) return true;
    await Utils.Other.wait(() => { console.log("Connecting...") }, 1000);
    await Utils.Other.wait(() => { console.log("Database has been connected.") }, 500);
    return true;
  }
}