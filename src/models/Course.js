import {Schema, model} from 'mongoose'

const courseSchema = new Schema({
    name: String,
    code: String,
    group: String,
    level: String,
},{
    timestamps: true,
    versionKey: false
})

export default model("Course", courseSchema)
