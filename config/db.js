import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://ranitamagar10:MMufNO1l2YYme30N@cluster0.yfyoxvc.mongodb.net/food-delivery"
    )
    .then(() => {
      console.log("DB connected.");
    });
};
