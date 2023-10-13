import { Socket, Server } from "socket.io";

// Import from classes
import { SEListenerObjectsType } from "classes/MySocket";

export type CreateSEListenerWrapperCallback =
  (io: Server, socket: Socket, o: SEListenerObjectsType) => (...args: Array<any>) => void

/**
 * Use this function to create a event listener wrapper.
 * @param name 
 * @param listener 
 * @returns 
 */
export function createSEListenerWrapper(cb: CreateSEListenerWrapperCallback) {
  return cb;
}