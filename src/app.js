import express, { json } from "express";
import morgan from 'morgan'

const cors = require('cors')

import studentsRoutes from './routes/students.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import attendanceRoutes from './routes/attendance.routes'
import courseRoutes from './routes/course.routes'

const app = express()

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.get('/', (req,res) => {
    res.json({
        author: "dch",
        description: "",
        version: "1.0.0"
    })
}) 

// Routes

app.use('/api/students', studentsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/attendances', attendanceRoutes)
app.use('/api/courses', courseRoutes)

export default app;
