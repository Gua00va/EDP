const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/send-sos", async (req, res) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  console.log(accountSid);
  console.log(authToken);

  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: "Hello from Twilio",
      from: "+16315291930",
      to: "+919855329220",
    })
    .then((message) => console.log(message.sid));

  res.status(200).send("ok");
});

module.exports = router;
