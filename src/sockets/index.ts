import { DefaultEventsMap, Server, Socket } from "socket.io";
import { initializeMediaSoupSocket } from "./socketMediaSoup";
import { RoomInfo } from "types/mediasoup";
export default function initializeSocketServer({
    io,
}: {
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}) {
    const listRoomOnServer = new Map<string, RoomInfo>();
    io.on("connection", (socket: Socket) => {
        console.log("🔌 Client connected:", socket.id);

        socket.on("register", (userId: string) => {
            console.log("🟢 User joined room:", userId);
            socket.join(userId);
        });

        socket.on("make-call", (data: any, to: string) => {
            console.log("🟢 Incoming call to:", to);
            socket.to(to).emit("incoming-call", data);
        });

        initializeMediaSoupSocket({
            socket,
            listRoomOnServer
        });

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });
}
