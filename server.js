const SMTPServer = require("smtp-server").SMTPServer;

// This example starts a SMTP server using TLS with your own certificate and key
const server = new SMTPServer({
  onAuth(auth, session, callback) {
    if (auth.username !== "abc" || auth.password !== "def") {
      return callback(new Error("Invalid username or password"));
    }
    callback(null, { user: 123 }); // where 123 is the user id or similar property
  },
  onClose(session) {
    console.log("connection closed for:", JSON.stringify(session));
  },
  onMailFrom(address, session, callback) {
    console.log("address:", JSON.stringify(address));
    console.log("session:", JSON.stringify(session));
    return callback(); // Accept the address
  },
  onData(stream, session, callback) {
    console.log("session:", JSON.stringify(session));
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk.toString();
    });
    stream.on("close", () => {
      console.log("stream closed for session", JSON.stringify(session));
      console.log("data:", JSON.stringify("data"));
      data = "";
    });
  },
  logger: true,
});

server.listen(465);

server.on("error", (err) => {
  console.log("Error %s", err.message);
  console.log("error", JSON.stringify(err));
});
