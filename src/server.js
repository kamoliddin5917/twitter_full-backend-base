const express = require("express");
const cors = require("cors");
const port = require("./config/server");

const app = express();

app.use(express.json());
app.use(cors());
app.use(require("./middlevare/auth").AUTH);
app.use("/", require("./routes/router"));

app.listen(port.PORT, () =>
  console.log(`Server has been started on port: ${port.PORT}`)
);
