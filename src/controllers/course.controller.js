import Course from "../models/Course";
import * as jwt from 'jsonwebtoken';
import config from '../config'
import User from "../models/User";

export const createCourse = async (req, res) => {
  const { name, code, group, level } = req.body;

  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    console.log(req.userId)

    const user = await User.findById(req.userId)
    console.log(user)
    if (!user) return res.status(404).json({ message: "No user found" });

    const newCourse = new Course({ name, code, group, level });
    const courseSaved = await newCourse.save();

    user.courses.push(courseSaved._id);
    await user.save();

    res.status(201).json(courseSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getCoursesByUserId = async (req, res) => {

  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    
    const user = await User.findById(req.userId)
    console.log(user)
    if (!user) return res.status(404).json({ message: "No user found" });

    const courses = await Course.find({ _id: { $in: user.courses } });
    res.status(200).json(courses); 
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

