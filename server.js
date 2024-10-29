// server.js
require("dotenv").config();
const { http } = require("./app");
const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log(`Server is running on PORT# ${PORT}`);
});
