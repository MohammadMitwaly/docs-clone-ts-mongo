const IO = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});
IO.on("connection", (socket) => {
    socket.on("send-changes", (delta) => {
        socket.broadcast.emit("receive-changes", delta);
    });
});
//# sourceMappingURL=server.js.map