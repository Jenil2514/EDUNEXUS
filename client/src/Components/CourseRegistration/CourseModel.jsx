// src/Components/CourseModel.jsx
import React from 'react';
import '../../CSS/CR.css'; // Include any required CSS for modal styling
import { Paper } from '@mui/material';

const CourseModel = ({ course, onClose }) => {
  if (!course) return null; // If no course is passed, don't render anything

  return (
    <>
      <div
        className="course-modal-overlay"
        onClick={onClose}
        data-testid="course-modal-overlay"
      ></div>
      <Paper>
        <div className="course-modal">
          <button className="course-modal-close" onClick={onClose}>
            &times;
          </button>
          <h2>{course.course_name}</h2>
          <div>{course.course_description}</div>
          <div className="course-info">
            <span>Course ID: {course.course_code}</span>
            <span>Semester: {course.semester}</span>
            <span>Year: {course.year}</span>
            <span>Credit: {course.credit}</span>
            <span>Professor: {course.prof_id}</span>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default CourseModel;