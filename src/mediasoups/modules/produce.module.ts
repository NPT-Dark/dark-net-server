import { RoomInfo } from "types/mediasoup";

async function produceTrack({
    kind,
    rtpParameters,
    roomId,
    userId,
    listRoomOnServer,
}: {
    kind: "audio" | "video";
    rtpParameters: any;
    roomId: string;
    userId: string;
    listRoomOnServer: Map<string, RoomInfo>;
}) {
    try {
        const roomCurrent = listRoomOnServer.get(roomId);

        if (!roomCurrent) return null;

        const { transports, producers } = roomCurrent;

        const transport = transports.get(userId);

        if (!transport?.send) return null;

        const producer = await transport.send.produce({
            kind,
            rtpParameters,
            appData: { userId },
        });

        if (!producers.has(userId)) producers.set(userId, []);

        producers.get(userId)!.push(producer);

        console.log(`✅ Producer created: ${producer.id} (${kind})`);

        return producer?.id
    }
    catch (err) {
        console.error("❌ Produce transport error:", err);
        return null
    }
}

export { produceTrack };