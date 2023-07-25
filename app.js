const express = require("express");
const lineBot = require("./lineBot");
const googleSheets = require("./googleSheets");

const app = express();

app.use(express.json());

app.post("/webhook", line.middleware(lineBot.config), async (req, res) => {
  try {
    const event = req.body.events;
    const profile = await getProfile(event.source.userId);
    for (event of events) {
      await lineBot.handleEvent(event);

      if (event.type === "message" && event.message.type === "text") {
        const message = event.message.text;
        const replyText = lineBot.getReplyText();

        // 紀錄回覆到 Google Sheets
        await googleSheets.addToGoogleSheets(
          event.source.userId,
          profile.displayName,
          message,
        );
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});