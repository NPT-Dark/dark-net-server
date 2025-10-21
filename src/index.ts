import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { Server } from "socket.io";
require("dotenv").config();

// 🧠 Internal modules
import connectDatabase from "./config/db";
import initializeSocketServer from "./sockets/index";
import { routers } from "./routers/index";

// ⚙️ App Config
const configCors = {
    origin: [
        // "http://localhost:3000",
        "https://6lrzd3l3-3000.asse.devtunnels.ms"
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
}

const app = express();

app.use(helmet());
app.use(cors(configCors));
app.use(morgan("dev"));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);

// 🔌 Connect to Database
connectDatabase();

// ⚙️ Initialize Socket Server 
const io = new Server(server, {
    cors: configCors,
});

initializeSocketServer({ io });


// ⚡ Routers
app.use("/api/", routers);

// 🚀 Server Activation
server.listen(process.env.PORT || 2401, () => {
    console.log(
        "🚀 Mediasoup server listening on port " + process.env.PORT || 2401
    );
});

