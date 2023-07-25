const { GoogleSpreadsheet } = require("google-spreadsheet");

const config = {
  googleCredentials: require("./credentials.json"), // 載入 Google Sheets 的 credentials.json 憑證
};

const addToGoogleSheets = async (userId, displayName, message) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(config.googleCredentials);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    Timestamp: new Date().toLocaleString(),
    UID: userId,
    Name: displayName,
    Message: message,
  });
};

module.exports = { addToGoogleSheets };