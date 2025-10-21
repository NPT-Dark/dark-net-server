import type { Socket } from "socket.io";
import { PeerTransports, RoomInfo, TransportTypeEnum } from "../types/mediasoup";
import * as mediasoupService from "../mediasoups/index";
import { callbackError, callbackSuccess } from "../utils/response";



export async function initializeMediaSoupSocket({
    socket,
    listRoomOnServer
}: {
    socket: Socket;
    listRoomOnServer: Map<string, RoomInfo>;
}) {
    // 🟢 Tạo room + router
    socket.on("create-room-router", async ({ roomId }: { roomId: string }, cb) => {
        const result = await mediasoupService.createInitMediaSoup({
            roomId,
            listRoomOnServer,
            socket
        })
        if (!result) return cb(callbackError("Create room failed or Room already exists"));
        return cb(callbackSuccess<string>("Room created " + roomId));
    });

    // 🟢 Tạo transport
    socket.on(
        "create-transport",
        async (
            {
                direction,
                roomId,
                userId,
            }: {
                direction: TransportTypeEnum;
                roomId: string;
                userId: string;
            },
            cb
        ) => {
            const info = await mediasoupService.createTransport({
                direction,
                roomId,
                userId,
                listRoomOnServer,
            });
            if (!info) return cb(callbackError(`❌ Create transport (${direction}) failed`));
            return cb(callbackSuccess({
                id: info.id,
                iceCandidates: info.iceCandidates,
                iceParameters: info.iceParameters,
                dtlsParameters: info.dtlsParameters,
            }));
        }
    );

    // 🟢 Lấy rtpCapabilities
    socket.on("get-rtp-capabilities", async ({ roomId }, cb) => {
        const rtpCapabilities = await mediasoupService.getRtpCapabilities({
            roomId,
            listRoomOnServer,
        });

        if (!rtpCapabilities) return cb(callbackError("❌ Get rtp capabilities failed"));
        return cb(callbackSuccess(rtpCapabilities));
    });

    // 🟢 Connect transport
    socket.on(
        "connect-transport",
        async ({ dtlsParameters, direction, roomId, userId }, cb) => {
            const result = await mediasoupService.connectTransport({
                dtlsParameters,
                direction,
                roomId,
                userId,
                listRoomOnServer,
            });
            if (!result) return cb(callbackError("❌ Connect transport failed"));
            return cb(callbackSuccess("Transport connected"));
        }
    );

    // 🟢 Produce
    socket.on("produce", async ({ kind, rtpParameters, roomId, userId }, cb) => {
        const producerId = await mediasoupService.produceTrack({
            kind,
            rtpParameters,
            roomId,
            userId,
            listRoomOnServer,
        });
        if (!producerId) return cb(callbackError("❌ Produce transport failed"));
        return cb(callbackSuccess(producerId));
    });

    // 🟢 Get all producers
    socket.on("get-all-producers", async ({ roomId }, cb) => {
        const result = await mediasoupService.getAllProducersInRoom({ roomId, listRoomOnServer });

        if (!result) return cb(callbackError("❌ Get all producers failed"));

        return cb(callbackSuccess(result));
    });

    // 🟢 Consume
    socket.on("consume", async ({ producerId, rtpCapabilities, roomId, userId }, cb) => {
        const result = await mediasoupService.consumeTrack({
            producerId,
            rtpCapabilities,
            roomId,
            userId,
            listRoomOnServer,
        });
        if (!result) return cb(callbackError("❌ Consume transport failed"));
        return cb(callbackSuccess(result));
    });

    // 🟢 Accept join room
    socket.on("ping-room-new-user", async ({ roomId, userId }) => {
        const result = await mediasoupService.notifyNewProducers({ roomId, userId, listRoomOnServer });
        if (!result) {
            return console.log(`❌ Notified room ${roomId} about new producers of ${userId} failed`)
        }
        socket.to(roomId).emit("new-producer", result);
        return console.log(`📢 Notified room ${roomId} about new producers of ${userId}`);
    });
}
