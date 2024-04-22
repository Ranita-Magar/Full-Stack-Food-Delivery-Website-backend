import userModel from "../models/useModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user is available with that email; if available then that account is stored in the variable
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: "User doesn't exist." });
    }

    //if user exists then we match password
    const isMatch = await bcrypt.compare(password, user.password);

    //if password doesn't match
    if (!isMatch) {
      return res.json({ success: true, message: "Invalid Credentials" });
    }

    //if password match, we create token
    const token = createToken(user._id);
    res.json({ success: true, token });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //checking if user already exists
    //if the email is available for any account , that account will be stored in this variable

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exits" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    //checking if our password is less than 8 digits or not
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: success, message: "Error" });
  }
};
export { loginUser, registerUser };
