import Attendance from '../models/Attendance'
import Student from '../models/Student'
import Course from '../models/Course'

export const createAttendance = async (req, res) => {
    const { codeRfid, course } = req.body;
    try {
        const student = await Student.findOne({ codeRfid });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const courseExist = await Course.findById(course);
        console.log(courseExist)
        if (!courseExist) return res.status(404).json({message: 'Course not found'})

        if (!student.courses.includes(courseExist._id)) {
            return res.status(400).json({ message: 'Student is not registered for this course' });
        }

        const newAttendance = new Attendance({
            codeRfid,
            course: courseExist._id,
            student: student._id
        })

        const savedAttendance = await newAttendance.save()
        
        student.attendance.push(savedAttendance._id)
        await student.save()

        return res.status(201).json(savedAttendance);
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getAttendance = async (req, res) => {
    const attendances = await Attendance.find();
    return res.json(attendances)
}

export const getAttendanceByDate = async (req, res) => {
    const { date, courseId } = req.body
    console.log(date, courseId)
    const dateObj = new Date(date);

    const attendances = await Attendance.find( {course: courseId }).populate('student');
    const filteredAttendances = attendances.filter(attendance => {
        return attendance.createdAt.getTime() > dateObj.getTime();
    })
    return res.json(filteredAttendances)
}

export const getAttendanceByDateInterval = async (req, res) => {
    const { startDate, endDate, courseId } = req.body

    console.log(startDate, endDate, courseId)

    if (startDate > endDate) return res.status(400).json({message: 'Start date must be before end date'})

    if (startDate === endDate) {
        const attendances = await Attendance.find( {course: courseId }).populate('student');
        const filteredAttendances = attendances.filter(attendance => {
            const newAttendanceDate = attendance.createdAt.toISOString().substring(0, 10)
            return newAttendanceDate === startDate;
        })
        return res.json(filteredAttendances)
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    const attendances = await Attendance.find( {course: courseId }).populate('student');
    const filteredAttendances = attendances.filter(attendance => {
        if (endDate === attendance.createdAt.toISOString().substring(0, 10)){
            const endDatePlusOneDay = addDays(endDate, 1)
            const endDatePlusOneDayObj = new Date(endDatePlusOneDay)
            return attendance.createdAt.getTime() >= startDateObj.getTime() && attendance.createdAt.getTime() <= endDatePlusOneDayObj.getTime(); 
        }
        return attendance.createdAt.getTime() >= startDateObj.getTime() && attendance.createdAt.getTime() <= endDateObj.getTime()
    })

    return res.json(filteredAttendances)
}


export const updateAttendance = async (req, res) => {
    return res.json('update attendance')
}

export const deleteAttendance = async (req, res) => {
    return res.json('delete attendance')

}

export const getAttendanceById = async (req, res) => {
    return res.json('get attendance by id')
}