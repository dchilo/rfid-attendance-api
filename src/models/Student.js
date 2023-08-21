import {model, Schema} from 'mongoose'

const studentScheme = new Schema({
    name: String,
    lastname: String,
    register: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    codeRfid: {
        type: String,
        unique: true
    },
    courses: [{
        ref: "Course",
        type: Schema.Types.ObjectId,
    }],
    attendance: [{
        ref: "Attendance",
        type: Schema.Types.ObjectId
    }],
    user: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
}, {
    timestamps: true,
    versionKey: false
})

export default model('Student', studentScheme)