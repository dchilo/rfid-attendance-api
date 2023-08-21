import { Router } from "express";

import {
    getStudents,
    createStudent,
    updateStudentById,
    deleteStudentById,
    getStudentById,
} from '../controllers/students.controller'

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt";

const router = Router()

router.get('/', getStudents)

router.get('/:studentId', getStudentById)

router.post('/', [verifyToken, isModerator], createStudent)

router.put('/:studentId', [verifyToken, isModerator], updateStudentById)

router.delete('/:studentId', [verifyToken, isAdmin], deleteStudentById)


export default router;