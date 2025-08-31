const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Listing.deleteMany({}).then((res) =>{
//   console.log(res);
// })

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({...obj, owner: "68a95603f609774e4f06f6ff",}));
  await Listing.insertMany(initData.data); // if in data.js there is multiple data stored in mulltiple array so importing 
                                           // particular data can be convenient initData.data2
  console.log("data was initialized");
};

initDB();