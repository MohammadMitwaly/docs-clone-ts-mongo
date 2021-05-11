import { Server as SocketIO } from "socket.io";

const IO = new SocketIO(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

IO.on("connection", (socket) => {
  socket.on("get-document", (documentID) => {
    // TODO: Update with data fetch
    const tempData = "";
    socket.join(documentID);
    socket.emit("load-document", tempData);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });
  });
});
