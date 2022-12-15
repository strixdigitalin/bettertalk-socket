const socketUserIdsMap = new Map();
const chat = (io) => {
  io.on("connection", (socket) => {
    console.log("connection");
    let type = socket.handshake.query.userId ? "user" : "doctor";
    let temp = socket.handshake.query.userId
      ? socket.handshake.query.userId
      : socket.handshake.query.docId;
    socketUserIdsMap.set(temp, socket.id);
    let room = socket.handshake.query.appointmentId;
    console.log(type, " with id ", temp, " joined in room ", room);
    socket.join(room);

    // socket.on("private message", ({ message, from, to, fromDoc }) => {
    //   let toDestination = socketUserIdsMap.get(`${to}`);
    //   console.log("the message", message, "sent from", from, "to", to, "at destination", toDestination);
    //   socket.to(toDestination).emit("private message", {
    //     message: message,
    //     from: from,
    //     to: to,
    //     fromDoc: fromDoc,
    //   });
    // });

    socket.on("private message", ({ message, from, to, fromDoc }) => {
      io.in(room).emit("private message", { message, from, to, fromDoc });
    });

    socket.on("accept", ({ state, from, to, id }) => {
      console.log("accept: requested from ", from, "to ", to, "in ", room);
      io.in(room).emit("accept", { state, from, to, id });
      // console.log('to: ', to);
      // console.log('from: ', from);
      // let toDestination = socketUserIdsMap.get(`${to}`);
      // console.log('toDestination: ', toDestination);
      // socket.to(toDestination).emit("accept", {
      //   state: state,
      //   from: from,
      //   to: to,
      //   id: id,
      // });
    });
    socket.on("start", ({ state, from, to, id }) => {
      console.log("start: requested from", from, "to ", to, "in room ", room);
      io.in(room).emit("start", { state, from, to, id });
      // console.log('to: ', to);
      // let toDestination = socketUserIdsMap.get(`${to}`);
      // console.log('toDestination: ', toDestination);
      // socket.to(toDestination).emit("start", {
      //   state: state,
      //   from: from,
      //   to: to,
      //   id: id,
      // });
    });

    socket.on("typing", function ({ isTyping, whoIsTyping }) {
      io.in(room).emit("typing", { isTyping, whoIsTyping });
    });

    // disconnect socket
    socket.on("disconnect", () => {
      console.log(
        "user w/ socket & userid, disconnected",
        socket.id,
        socket.handshake.query.userId
      );
    });
  });
};

export default chat;