const readLine = require("readline");
const { promisify } = require("util");
const { exec } = require("child_process");
const execPromise = promisify(exec);
const io = require("socket.io-client");
const chalk = require('chalk');

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

// Use an async function to install packages
const installPackages = async () => {
  try {
    console.log("Installing packages...");
    // Use execPromise to run the npm install command
    await execPromise("npm install socket.io-client chalk");
    console.log("Packages installed successfully.");
  } catch (error) {
    console.error("Error installing packages:", error.message);
  }
};

// Call the installPackages function
installPackages().then(() => {
  // Now that packages are installed, continue with the rest of the script

  const socket = io("http://137.184.95.99:3000");

  socket.on("connect", async () => {
    console.log(chalk.bgWhite("\n Connected to server... \n\n"));

    // Handle events from the server
    socket.on("chat-message", (data) => {
      console.log(chalk.bgBlue(data));
    });

    while (true) {
      await chat(); // Start the chat
    }
  });

  socket.on("disconnect", () => {
    console.log(chalk.bgRed("\n Disconnected from server"));
    rl.close(); // Close readline interface on disconnect
  });

  async function chat() {
    const response = await promptUser("");
    socket.emit("send-message", response);
  }
});
