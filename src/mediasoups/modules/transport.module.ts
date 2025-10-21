import { PeerTransports, RoomInfo, TransportTypeEnum } from "../../types/mediasoup";
import { mediasoupConfig } from "../../consts/mediasoup";

async function createTransport({
    direction,
    roomId,
    userId,
    listRoomOnServer,
}: {
    direction: TransportTypeEnum;
    roomId: string;
    userId: string;
    listRoomOnServer: Map<string, RoomInfo>;
}) {
    try {
        const roomCurrent = listRoomOnServer.get(roomId);
        if (!roomCurrent) return null

        const { router, transports } = roomCurrent;

        const transportCreated = await router.createWebRtcTransport(mediasoupConfig.webRtcTransportOptions);
        const info = {
            id: transportCreated.id,
            iceParameters: transportCreated.iceParameters,
            iceCandidates: transportCreated.iceCandidates,
            dtlsParameters: transportCreated.dtlsParameters,
        };

        const dataTransport: PeerTransports = {
            send: transports.get(userId)?.send || null,
            recv: transports.get(userId)?.recv || null,
        };

        if (direction === TransportTypeEnum.SEND) dataTransport.send = transportCreated;
        if (direction === TransportTypeEnum.RECV) dataTransport.recv = transportCreated;

        transports.set(userId, dataTransport);

        console.log(`✅ Transport (${direction}) created for user ${userId}`);

        return info
    }
    catch (err) {
        console.error(`❌ Create transport (${direction}) error:`, err?.message);
        return null
    }
}

async function connectTransport({
    dtlsParameters,
    direction,
    roomId,
    userId,
    listRoomOnServer,
}: {
    dtlsParameters: any;
    direction: TransportTypeEnum;
    roomId: string;
    userId: string;
    listRoomOnServer: Map<string, RoomInfo>;
}) {
    try {
        const roomCurrent = listRoomOnServer.get(roomId);
        if (!roomCurrent) return null;

        const transportCurrent = roomCurrent.transports.get(userId);
        if (!transportCurrent) return null;

        if (direction === TransportTypeEnum.SEND && transportCurrent.send) {
            await transportCurrent.send.connect({ dtlsParameters });
            console.log(`✅ Send transport connected (${userId})`);
        }

        if (direction === TransportTypeEnum.RECV && transportCurrent.recv) {
            await transportCurrent.recv.connect({ dtlsParameters });
            console.log(`✅ Recv transport connected (${userId})`);
        }

        return true
    }
    catch (err) {
        console.error("❌ Connect transport error:", err);
        return null;
    }
}

export { createTransport, connectTransport }