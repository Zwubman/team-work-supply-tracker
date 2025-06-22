import userService from "../services/userService.js";
import db from "../models/index.js";

const { User } = db;

export const signUp = async (req, res) => {
  try {
    const user = await userService.createUser(User, req.body);
    res.status(200).json({ message: "User signed up successfully.", user });
  } catch (error) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, user } = await userService.loginUser(
      User,
      email,
      password
    );

    res.cookie("accessToken", token, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).json({
      message: "Logged in successfully.",
      token: token ,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    const code =
      error.message === "User not found"
        ? 404
        : error.message === "Invalid credentials"
        ? 401
        : 500;
    res.status(code).json({ message: error.message });
  }
};
