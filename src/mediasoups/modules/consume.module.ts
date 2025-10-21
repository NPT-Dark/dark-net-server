import { RoomInfo } from "types/mediasoup";

async function consumeTrack({
    listRoomOnServer,
    roomId,
    userId,
    producerId,
    rtpCapabilities,
}: {
    listRoomOnServer: Map<string, RoomInfo>;
    roomId: string;
    userId: string;
    producerId: string;
    rtpCapabilities: any;
}) {
    try {
        const room = listRoomOnServer.get(roomId);
        if (!room) return null;

        const { transports, consumers, router, producers } = room;
        const transportCurrent = transports.get(userId);

        if (!transportCurrent?.recv) return null;

        const allProducers = Array.from(producers.values()).flat();
        const targetProducer = allProducers.find((p) => p.id === producerId);
        if (!targetProducer) return null;

        if (!router.canConsume({ producerId, rtpCapabilities })) {
            return null;
        }

        const consumer = await transportCurrent.recv.consume({
            producerId,
            rtpCapabilities,
            paused: false,
            appData: { producerUserId: targetProducer.appData.userId },
        });

        await consumer.resume();

        if (!consumers.has(userId)) consumers.set(userId, []);

        consumers.get(userId)!.push(consumer);

        console.log(`✅ Consumer created: ${consumer.id} for producer ${producerId}`);

        return {
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            producerId,
        }

    } catch (err) {
        console.error("❌ Consume track error:", err);
        return null
    }
}

export { consumeTrack }