import { Server as SocketIO } from "socket.io";
import mongoose from "mongoose";
import Document from "./Types/Document";

// Connect to DB
mongoose.connect("mongodb://localhost/documents-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const IO = new SocketIO(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

IO.on("connection", (socket) => {
  socket.on("get-document", (documentID) => {
    const tempData = "";
    socket.join(documentID);
    socket.emit("load-document", tempData);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });
  });
});

const findOrCreateDoc = async (docId: string) => {
  if (!docId) {
    return;
  }
  const userDocument = await Document.findById(docId);
  // If the document exists, return it, else create a new one based on the passed in ID
  return userDocument || (await Document.create({ _id: docId, data: "" }));
};
