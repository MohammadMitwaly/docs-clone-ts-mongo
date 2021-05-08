const IO = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

IO.on("connection", (socket) => {});
