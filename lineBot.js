const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

const getReplyText = (message) => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  // 定義每個星期幾對應的上班和下班客製化訊息
  const customMessagesByWeekday = {
    0: "沒有加班費喔",
    1: { onDuty: "吃早餐了嗎", offDuty: "工作沒做完就想走啊" },
    2: { onDuty: "呷飽未?", offDuty: "掰哺" },
    3: { onDuty: "呷飽未?", offDuty: "不準下班" },
    4: { onDuty: "哈囉你好嗎?", offDuty: "工作沒做完就想走啊" },
    5: { onDuty: "禮拜五上班好痛苦喔", offDuty: "放假囉" },
    6: { onDuty: "沒有加班費喔", offDuty: "沒有加班費喔" },
  };

  // 根據每一天回覆不同的訊息
  let replyText = "";

  // 判斷使用者是否今天已經打過上班或下班卡
  if (dayOfWeek in customMessagesByWeekday) {
    if (message.includes("上班")) {
      replyText = customMessagesByWeekday[dayOfWeek].onDuty;
    } else if (message.includes("下班")) {
      replyText = customMessagesByWeekday[dayOfWeek].offDuty;
    } else {
      replyText = "不要再混了";
    }
  } else {
    replyText = "今天不用上班，請好好休息！";
  }

  return replyText;
};

const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type === "text") {
    const message = event.message.text;

    const replyText = getReplyText(message);
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
  }
};

const getProfile = async (userId) => {
  try {
    const profile = await client.getProfile(userId);
    return profile;
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return null;
  }
};

module.exports = { client, handleEvent, getReplyText, getProfile };
