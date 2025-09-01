import { PhoenixWebsocket } from "phoenix-websocket";

let socket: PhoenixWebsocket | null = null;

export default function getSocket() {
    if (!socket) {
        socket = new PhoenixWebsocket("ws://localhost:4000/socket");
        socket.connect();
    }
    return socket;
}