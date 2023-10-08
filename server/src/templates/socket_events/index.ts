import { Socket } from "socket.io";

// Import classes
import { EventNames } from "classes/MySocket";

/**
 * Use this function to create a event listener.
 * @param name 
 * @param listener 
 * @returns 
 */
export function createSocketEvent<O>(name: EventNames, listener: (socket: Socket, o: O, ...args: Array<any>) => void) {
  let result: { name: EventNames, listener: (socket: Socket, o: O, ...args: Array<any>) => void } = {
    name: name,
    listener
  };

  return result;
}