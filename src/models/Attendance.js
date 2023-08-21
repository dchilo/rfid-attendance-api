import { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    codeRfid: {
        type: String,
    },
    student: {
        ref: "Student",
        type: Schema.Types.ObjectId
    },
    course: {
        ref: "Course",
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Attendance", attendanceSchema)