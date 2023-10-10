import React from 'react';

// Import classes
import { MySocket } from "src/apis/socket";

/**
 * Use this hook to use socket.
 */
export function useSocket() {
  const socket = React.useMemo(() => new MySocket(), []);
  const EventNames = MySocket.EventNames;
  return {
    socket,
    EventNames
  }
}