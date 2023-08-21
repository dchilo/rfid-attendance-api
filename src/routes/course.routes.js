import {Router} from 'express'

import {createCourse, getCoursesByUserId} from '../controllers/course.controller'
import { isModerator, verifyToken } from '../middlewares/authJwt';

const router = Router()

router.post('/', [verifyToken, isModerator], createCourse)
router.get('/', [verifyToken, isModerator], getCoursesByUserId)

export default router;