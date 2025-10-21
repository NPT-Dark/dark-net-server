import { Socket } from "socket.io";
import { mediasoupConfig } from "../../consts/mediasoup";
import { createWorker } from "mediasoup";
import { RoomInfo } from "types/mediasoup";

async function createInitMediaSoup({
    roomId,
    listRoomOnServer,
    socket
}: {
    roomId: string;
    listRoomOnServer: Map<string, RoomInfo>;
    socket: Socket;
}) {
    try {
        const worker = await createWorker({
            logLevel: "warn",
            logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
        });

        console.log("✅ Mediasoup worker created.");

        const router = await worker.createRouter({
            mediaCodecs: mediasoupConfig.routerOptions.mediaCodecs,
        });

        console.log("✅ Mediasoup router created.");

        // 🛑 Close worker on exit
        process.on("exit", () => {
            console.log("🛑 Closing Mediasoup worker...");
            worker.close();
        });

        if (listRoomOnServer.has(roomId)) {
            return null
        }

        listRoomOnServer.set(roomId, {
            router,
            transports: new Map(),
            producers: new Map(),
            consumers: new Map(),
        });

        socket.join(roomId);

        console.log(`✅ Room ${roomId} created`);

        return true
    }
    catch (err) {
        console.error("❌ Create room error:", err);
        return null
    }
}

async function getRtpCapabilities({
    roomId,
    listRoomOnServer,
}: {
    roomId: string;
    listRoomOnServer: Map<string, RoomInfo>;
}) {
    try {
        const roomCurrent = listRoomOnServer.get(roomId);

        console.log(roomCurrent);


        if (!roomCurrent) return null;

        return roomCurrent?.router?.rtpCapabilities

    } catch (err: any) {
        console.error("❌ Get rtp capabilities error:", err);
        return null
    }
}

async function getAllProducersInRoom({
    listRoomOnServer,
    roomId,
}: {
    listRoomOnServer: Map<string, RoomInfo>;
    roomId: string;
}
) {
    try {
        const room = listRoomOnServer.get(roomId);

        if (!room) return null;

        const result = Object.fromEntries(
            Array.from(room.producers.entries()).map(([userId, producerList]) => [
                userId,
                producerList.map((p) => ({
                    id: p.id,
                    kind: p.kind,
                })),
            ])
        );
        console.log("🟢 Get all users in room sucess");
        return result
    } catch (err: any) {
        console.error("❌ Get all users in room error:", err);
        return null
    }
}

async function notifyNewProducers({
    listRoomOnServer,
    roomId,
    userId,
}: {
    listRoomOnServer: Map<string, RoomInfo>;
    roomId: string;
    userId: string;
}) {
    try {
        const roomCurrent = await listRoomOnServer.get(roomId);
        if (!roomCurrent) return null;

        const userProducers = await roomCurrent.producers.get(userId) || [];
        if (userProducers.length === 0) {
            console.log(`⚠️ User ${userId} has no producers`);
            return null;
        }

        const arrProducer = await userProducers.map((producer) => ({
            id: producer.id,
            userId,
            kind: producer.kind,
            appData: producer.appData.userId,
        }));

        console.log(`📢 Notified room ${roomId} about new producers of ${userId}`);

        return arrProducer
    } catch (err: any) {
        console.error("❌ Accept join room error:", err);
        return null
    }
}

export { createInitMediaSoup, getRtpCapabilities, getAllProducersInRoom, notifyNewProducers };