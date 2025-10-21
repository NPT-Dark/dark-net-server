import * as mediasoup from "mediasoup";
export type PeerTransports = {
  send: mediasoup.types.WebRtcTransport | null;
  recv: mediasoup.types.WebRtcTransport | null;
};

export type RoomInfo = {
  router: mediasoup.types.Router;
  transports: Map<string, PeerTransports>;
  producers: Map<string, mediasoup.types.Producer<mediasoup.types.AppData>[]>;
  consumers: Map<string, mediasoup.types.Consumer<mediasoup.types.AppData>[]>;
};

export enum TransportTypeEnum {
  SEND = "send",
  RECV = "recv",
};