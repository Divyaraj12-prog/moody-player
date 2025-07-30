require('dotenv').config();
const app = require('./src/app');
const ConnectDb = require('./src/db/db');

ConnectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});