import {
    generate_a_random_course,
    generate_a_random_user,
    generate_a_random_lesson,
    generateMultipleUsers,
    generateMultipleCourses,
    generateMultipleLessons
} from "./faker.js";
import { dbClose, dbConnect } from "../database/dbConnect.js"
import { UserModel } from "../schema/user.js";
import { CourseModel } from "../schema/course.js";
import { LessonModel } from "../schema/lesson.js";


const seed_users = async (number, status, usertype) => {
    try {
        await dbConnect()
        if (number > 1) {
            const users = await generateMultipleUsers(number, status, usertype)
            const saved_users = await UserModel.insertMany(users)
            return saved_users
        } else {
            const user = await generate_a_random_user(number, status, usertype)
            const saved_user = await UserModel.create(user)
            return saved_user
        }
    } catch (error) {
        console.log(error.message)
    }
}

// await seed_users(1, "active", "admin")


const seed_courses = async (number, instructor_id) => {
    try {
        await dbConnect()
        if (instructor_id) {
            //generate courses
            const courses = await generateMultipleCourses(number, instructor_id)
            //save courses
            const saved_courses = await CourseModel.insertMany(courses)
            //get the user
            const user = await UserModel.findById(instructor_id)
            //add courses to user
            user.courses.push(...saved_courses)
            await user.save()
            return ({ user, saved_courses })

        } else {
            //create a random instructor and generate courses
            const instructor = await seed_users(1, "active", "admin")
            //generate courses for the instructor
            const courses = await generateMultipleCourses(number, instructor.id)
            //save courses
            const saved_courses = await CourseModel.insertMany(courses)
            //get the user
            const user = await UserModel.findById(instructor_id)
            //add courses to user
            user.courses.push(...saved_courses)
            await user.save()
            return ({ user, saved_courses })

        }
    } catch (error) {
        console.log(error.message)
    } finally {
        dbClose()
    }
}

// console.log(await seed_courses(7, "67bb77cc0db8adf94a059545"))

const seed_lessons = async (number, course_id) => {
    try {
        await dbConnect()
        if (course_id) {
            //get course by course id
            const course = await CourseModel.findById(course_id)
            //generate lessons for the course
            const lessons = await generateMultipleLessons(number, course.instructor, course_id)
            //save lessons
            const saved_lessons = await LessonModel.insertMany(lessons)
            //push lessons into course
            course.lessons.push(...saved_lessons)
            //save course
            await course.save()
            //return course and lessons
            return ({ course, saved_lessons })
        }
        else {
            const user = await seed_users(1, "active", "instructor")
            const course = await seed_courses(1, user._id)
            //generate lessons for the course
            const lessons = await generateMultipleLessons(number, user._id, course.saved_courses[0]._id)
            //save lessons
            const saved_lessons = await LessonModel.insertMany(lessons)
            //push lessons into course
            course.lessons.push(...saved_lessons)
            //save course
            await course.save()
            //return course and lessons
            return ({ course, saved_lessons })
        }

    } catch (error) {
        console.log(error.message)
    } finally {
        dbClose()
    }
}

console.log(await seed_lessons(2, "67bb8420273675dd0662c1dd"))






