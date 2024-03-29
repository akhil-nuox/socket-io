const readLine = require("readline");
const io = require("socket.io-client");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptUser = async (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const socket = io("http://localhost:3000");

socket.on("connect", async () => {
  console.log("\n Connected to server... \n\n");

  // Handle events from the server
  socket.on("chat-message", (data) => {
    console.log("user: "+data);
  });

  while(true){
    await chat(); // Start the chat
  }
});

socket.on("disconnect", () => {
  console.log("\n Disconnected from server");
  rl.close(); // Close readline interface on disconnect
});

async function chat() {
  const response = await promptUser("");
  socket.emit("send-message", response);
}