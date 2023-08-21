import User from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/Role'

export const signupHandler = async (req, res) => {
    try {
      const { name, lastname, username, email, password, roles } = req.body;
  
      // Creating a new User Object
      const newUser = new User({
        name,
        lastname,
        username,
        email,
        password,
      });
  
      // checking for roles
      if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        newUser.roles = foundRoles.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "user" });
        newUser.roles = [role._id];
      }

      newUser.password = await User.encryptPassword(newUser.password);
  
      // Saving the User Object in Mongodb
      const savedUser = await newUser.save();
  
      // Create a token
      const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
        expiresIn: 86400, // 24 hours
      });
  
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
};

export const signinHandler = async (req, res) => {
    try {
      // Request body email can be an email or username
      const userFound = await User.findOne({ email: req.body.email }).populate(
        "roles"
      );

      console.log(req.body.email, req.body.password)

      console.log(userFound);
  
      if (!userFound) return res.status(400).json({ message: "User Not Found" });
  
      const matchPassword = await User.comparePassword(
        req.body.password,
        userFound.password
      );
  
      if (!matchPassword)
        return res.status(401).json({
          token: null,
          message: "Invalid Password",
        });
  
      const token = jwt.sign({ id: userFound._id }, config.SECRET, {
        expiresIn: 86400, // 24 hours
      });

      const data = {
        token,
        name: userFound.name,
        lastname: userFound.lastname,
        username: userFound.username,
        email: userFound.email,
      }
  
      res.json({ data });
    } catch (error) {
      console.log(error);
    }
};

export const verifyToken = async (req, res) => {

  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    const data = {
      token,
      valid: true,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
    }

    return res.status(200).json({data })
  } catch (error) {
    if (error.name === "TokenExpiredError"){
      return res.status(401).json({valid: false, message: "Expired Token" });
    } else return res.status(401).json({ valid: false,message: "Unauthorized!" });
  }
};