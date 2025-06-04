import dotenv from "dotenv";
import { DataType } from "./utils/dataConverter";
import readExcel from "./utils/excelReader";
// import mongoose from "mongoose";
dotenv.config();

// mongoose
//     .connect(process.env.MONGODB_ATLAS_CONNECTION_STRING)
//     .then(() => console.log("Connection successful"))
//     .catch((error) => console.log(error));

readExcel("social_media.xlsx", "Sheet1", [
    { name: "Studio", type: DataType.String },
    { name: "Website", type: DataType.String },
    { name: "X", type: DataType.String },
    { name: "Facebook", type: DataType.String },
    { name: "Instagram", type: DataType.String },
    { name: "LinkedIn", type: DataType.String },
    { name: "Threads", type: DataType.String },
    { name: "Pinterest", type: DataType.String },

])
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
