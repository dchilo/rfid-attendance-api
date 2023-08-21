import {Router} from 'express'

import {
    createAttendance,
    getAttendance,
    getAttendanceByDate,
    getAttendanceByDateInterval,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
} from '../controllers/attendance.controller'

import {verifyToken, isModerator} from '../middlewares/authJwt'

const router = Router()

router.get('/', getAttendance)

router.post('/date', getAttendanceByDate)

router.post('/dateinterval', getAttendanceByDateInterval)

router.post('/', createAttendance)

router.get('/:id', getAttendanceById)

router.put('/', [verifyToken, isModerator], updateAttendance)

router.delete('/:', [verifyToken, isModerator], deleteAttendance)

export default router;