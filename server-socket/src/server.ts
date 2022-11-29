import express from "express";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import User from "./api/User";
import Booking from "./api/Booking";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = process.env.PORT || 5432;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
	origin:true,
	credentials:true,
	methods:["GET","POST"]
  }
});

// Middlewares
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json())
app.use(cors());

// Routes
app.use('/api/users', User)
app.use('/api/bookings', Booking)

// Idle
app.get('/', ( req: express.Request, res: express.Response ) => {
	res.send('Hello World!')
})


io.on("connection", (socket: Socket) => {
	console.log("new user connected");
	socket.on("sendMessage",(messageInfo) => {
		console.log("sending message");
		socket.broadcast.emit("receiveMessage", messageInfo);
	});
});
httpServer.listen(3000);


// Database
mongoose.connect('mongodb://0.0.0.0/users', { useNewUrlParser : true } as ConnectOptions)
	.then(() => {
		// tslint:disable-next-line:no-console
        app.listen(port, () => console.log("Server corriendo en el puerto " + port));
	})
	.catch((err) => {
		// tslint:disable-next-line:no-console
		console.log(err);
	});
