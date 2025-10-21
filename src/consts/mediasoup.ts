import os from "os";
import { types } from "mediasoup";

export const mediasoupConfig = {
    // ⚙️ Worker Settings
    workerSettings: {
        rtcMinPort: 40000, // Giới hạn port range
        rtcMaxPort: 49999,
        logLevel: "warn", // "debug" nếu đang dev
        logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
        dtlsCertificateFile: undefined, // để mặc định
        dtlsPrivateKeyFile: undefined,
        numWorkers: Math.max(os.cpus().length - 1, 1), // số core
    } as types.WorkerSettings,

    // ⚙️ Router Settings (codec)
    routerOptions: {
        mediaCodecs: [
            {
                kind: "audio",
                mimeType: "audio/opus",
                clockRate: 48000,
                channels: 2,
            },
            {
                kind: "video",
                mimeType: "video/VP8",
                clockRate: 90000,
                parameters: {
                    "x-google-start-bitrate": 1000,
                },
            },
            // ✅ H.264 – cho Safari, iOS, và Edge
            {
                kind: "video",
                mimeType: "video/H264",
                clockRate: 90000,
                parameters: {
                    "packetization-mode": 1,
                    "level-asymmetry-allowed": 1,
                    "profile-level-id": "42e01f",
                },
            },
        ],
    } as types.RouterOptions,

    // ⚙️ WebRtcTransport Settings
    webRtcTransportOptions: {
        listenIps: [
            {
                ip: "0.0.0.0",
                announcedIp: process.env.PUBLIC_IP || "127.0.0.1"
            },
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate: 1_000_000,
        maxIncomingBitrate: 1_500_000,
    } as types.WebRtcTransportOptions,
};
