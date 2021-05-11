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
  socket.on("get-document", async (documentID) => {
    const userDocument = await findOrCreateDoc(documentID);
    socket.join(documentID);
    socket.emit(
      "load-document",
      userDocument && userDocument["data"] ? userDocument["data"] : ""
    );

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });

    socket.on("save-changes", async (data) => {
      await saveDocument(documentID, data);
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

const saveDocument = async (docId: string, data) => {
  await Document.findByIdAndUpdate(docId, { data });
};
