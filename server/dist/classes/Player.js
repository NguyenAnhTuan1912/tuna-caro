"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
;
/**
 * Use this class to create an object that can manage Player in game.
 */
class Player {
  static __hasArgsDefaultConstruct__(o, _) {
    o.id = _.id ? _.id : "";
    o.name = _.name ? _.name : `Player[${_.id}]`;
    for (let key in _) {
      if (_[key] && typeof _[key] !== "function")
      o[key] = _[key];
    }
    return o;
  }
  constructor(generic, name, isWinner, score, socketId) {
    if (typeof generic === "object")
    Player.__hasArgsDefaultConstruct__(this, generic);else

    Player.__hasArgsDefaultConstruct__(this, { id: generic, name, isWinner, score, socketId });
  }
  /**
   * Use this method to set information for player.
   * @param player
   */
  setPlayer(player) {
    for (let prop in player) {
      let key = prop;
      if (prop !== "id" && player[key]) {
        this[key] = player[key];
      }
    }
  }
  reset() {
    this.score = 0;
    this.isWinner = false;
  }
}
exports.Player = Player;