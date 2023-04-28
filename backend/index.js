const express = require("express");
// const connectToMongo = require("./database/db");
const cors = require("cors");

const app = express();
const port = 3000;

// app.use(cors);
app.use(express.json());

//Routes
app.use("/api", require("./routes/sos"));
// app.use("/api", require("./routes/tasks"));

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
