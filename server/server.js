import { Receiver } from 'codesys-client';
import iec from 'iec-61131-3';

import express from 'express';
import {Server} from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;

let res=false;
let res1=false;
let res2=false;
let res3=false;
let res4=false;
// import util from 'util'; //util needed only for demo purposes

//Setting up new receiver
const receiver = new Receiver({
  LocalAddress:'0.0.0.0',  //IP address of Laptop or system on which Program will run
  ListeningPort: 1202 //UDP port defined in PLC (see above)
});

const NVL = iec.STRUCT({
	RESULT_NVL:  iec.BOOL,
  RESULT1_NVL: iec.BOOL,
	RESULT2_NVL: iec.BOOL,
  RESULT3_NVL: iec.BOOL,
  RESULT4_NVL: iec.BOOL,
});

//Adding data handler(s)
receiver.addHandler(12, NVL, (data) => {
  //data is now as object that matches ST_DataToSend
  //Using util.inspect to display the whole object for demo purposes
  console.log(new Date(),`Data Recieved `, data);
  res = data["RESULT_NVL"];
  res1 = data["RESULT1_NVL"];
  res2 = data["RESULT2_NVL"];
  res3 = data["RESULT3_NVL"];
  res4 = data["RESULT4_NVL"];
  io.emit("result", data);
});

//Starting to listen for incoming data
receiver.listen()
  .then(res => console.log(`Listening UDP now to:`, res))
  .catch(err => console.log(`Failed to start listening. Error:`, err));


io.on("connection", (socket) => {
    console.log("Client connected");
    io.emit("result", {RESULT_NVL: res, RESULT1_NVL: res1, RESULT2_NVL: res2, RESULT3_NVL: res3, RESULT4_NVL: res4}); 
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
});
  
server.listen(PORT, () => {
    console.log(`MainControl server listening on port ${PORT}`);
});