import Student from '../models/Student'
import User from '../models/User'
import Role from '../models/Role'

export const createStudent = async (req, res) => {

    const { name, lastname, register, email, courses, codeRfid, roles } = req.body;
    console.log(req.body)
    try {

      const foundUser = await User.findOne({ email: email  });

      if(!foundUser) {
        const newUser = new User({
          name,
          lastname,
          username: lastname,
          email,
          codeRfid,
          password: register,
        });

        if (roles) {
          const foundRoles = await Role.find({ name: { $in: roles } });
          newUser.roles = foundRoles.map((role) => role._id);
        } else {
          const role = await Role.findOne({ name: "user" });
          newUser.roles = [role._id];
        }
    
        newUser.password = await User.encryptPassword(newUser.password);

        const savedUser = await newUser.save();

        const newStudent = new Student({
          name: name,
          lastname: lastname,
          register: register,
          email: email,
          codeRfid,
          courses: courses,
          user: savedUser._id,
        });
        const studentSaved = await newStudent.save();
  
        res.status(201).json(studentSaved);
      } else {
        const newStudent = new Student({
          name: foundUser.name,
          lastname: foundUser.lastname,
          register,
          email: foundUser.email,
          codeRfid,
          courses,
          user: foundUser._id
        })
        const studentSaved = await newStudent.save();

        res.status(201).json(studentSaved);
      }   

    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
}

export const getStudents = async (req, res) => {
    const students = await Student.find();
    return res.json(students);
    
}


export const getStudentById = async (req, res) => {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    res.status(200).json(student);
}

export const updateStudentById = async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.studentId,
        req.body,
        {
          new: true,
        }
      );
    res.status(204).json(updatedStudent); 
}

export const deleteStudentById = async (req, res) => {
    const { studentId } = req.params;

    await Student.findByIdAndDelete(studentId);
  
    // code 200 is ok too
    res.status(204).json();
    
}