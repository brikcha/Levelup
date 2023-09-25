const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log(`New User connected: ${socket.id}`);

  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    console.log("Connected users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  //NOTIFICATION :
  socket.on("addNewNotification", function (data) {
    io.emit("newNotification", data);
    console.log("Notification is working===" + JSON.stringify(data));
  });

  //NOTIFICATION :
  socket.on("addNewNotificationShipper", function (data) {
    io.emit("newNotificationShipper", data);
    console.log("Notification Shipper is working===" + JSON.stringify(data));
  });

  socket.on("addNewNotificationOrderToPatient", function (data) {
    io.emit("newNotificationShipperOrderToPatient", data);
    console.log(
      "Notification OrderToPatient is working===" + JSON.stringify(data)
    );
  });

  socket.on("addNewNotificationOrderToPharmacy", function (data) {
    io.emit("newNotificationShipperOrderToPharmacy", data);
    console.log(
      "Notification OrderToPharmacy is working===" + JSON.stringify(data)
    );
  });
});
