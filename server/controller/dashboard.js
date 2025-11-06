const { json } = require("express");
const pool = require("../config/db");
const fs = require('fs');
const path = require('path');

const dashboard = async (req,res)=>{
    
    // console.log("here is the role : ",req.header.role);
    
    const attendance_data = await get_attendance(req,res);
    const upcoming_events_data = await upcoming_events(req,res);
    const notice_board_data = await notice_board(req,res);
    const time_table_data = await time_table(req,res);
   
    res.status(200).json({
        success : true,
        attendance_data: attendance_data,
        upcoming_events_data: upcoming_events_data,
        notice_board_data : notice_board_data,
        time_table_data : time_table_data
    })
}

const get_attendance = async (req,res)=>{
    try {

      const StudentID = req.query.SID;
  
      const current_date = new Date();
      const current_year = current_date.getFullYear().toString();
      const current_month = current_date.getMonth() + 1;
      let semester_period;
    //   console.log(current_year,current_month,current_date);

      if(current_month >= 1 && current_month <=6)
        semester_period = 'Winter';
      else 
        semester_period = 'Autumn';

            let attendance;
            try {
                attendance = await pool.query(`SELECT SUM(total_classes) AS total_classes, SUM(attended_classes) 
                AS attended_classes FROM Course_enrolled_list AS cel JOIN course AS c ON cel.cid = c.cid  WHERE SID = $1 AND c.year = $2 AND c.semester = $3
	GROUP BY SID`,[StudentID,current_year,semester_period]);
            } catch (sqlErr) {
                // If attendance columns/tables are not present in the schema, handle gracefully
                if (sqlErr && sqlErr.code === '42703') {
                    console.warn('Attendance columns missing in DB schema:', sqlErr.message || sqlErr);
                    return { Overall_attendance: '0.00%' };
                }
                throw sqlErr;
            }

            if(!attendance || attendance.rows.length === 0)
            {
                    return {message : "No attedance data found for student"};
            }
      
            const {total_classes, attended_classes} = attendance.rows[0];
            const Overall_attendance = total_classes > 0 ? (attended_classes / total_classes) * 100 : 0;
      
            return {
                    Overall_attendance: Overall_attendance.toFixed(2)+"%"
            };
  
    } catch (error) {
      console.error(error);
      res.status(500);
      return {Error : "An error occured while fetching the attendance data from database"};
    }
  
}

const upcoming_events = async (req, res) => {
    const events_path = path.join(__dirname, './upcoming_events.json');

    return new Promise((resolve,reject)=>{
        fs.readFile(events_path,'utf8',(err,data)=>{

            if(err)
                return reject(err)

            try {
              events = JSON.parse(data)
              resolve(events)
                
            } catch (ParseError) {
                console.error('Error parsing JSON:', ParseError);
                reject('Error parsing events data');
            }
        });
    });
};

const notice_board = async (req,res)=>{
    const Studentid = req.query.SID;
    const current_date = new Date();
    const current_year = current_date.getFullYear().toString();
    const current_month = current_date.getMonth() + 1;
    let semester_period;
    // console.log(current_year,current_month,current_date);

    if(current_month >= 1 && current_month <=6)
      semester_period = 'Winter';
    else 
      semester_period = 'Autumn';

    try {
        const notices = await pool.query(`SELECT c.CID, l.Lab_ID, l.title, l.Description FROM Course c JOIN Lab l ON c.CID = l.CID JOIN Course_enrolled_list ce ON c.CID = ce.CID 
LEFT JOIN Attended_Lab al ON l.Lab_ID = al.Lab_ID AND ce.SID = al.SID 
WHERE c.year = $1 AND c.semester = $2 AND ce.sid = $3 AND al.Submission IS NULL 
AND l.Due_Time > NOW() AND l.Due_Time < NOW() + INTERVAL '1 day'`,[current_year,semester_period,Studentid]);

            if (notices.rows.length === 0) {
                return [{ message: "No notices found for student" }];
            }
            
            return notices.rows;
        
    } catch (error) {
        console.error(error);
        res.status(500);
        return { Error: "An error occured while fetching the notices from database" }; 
        
    }
}

const time_table = (req,res)=>{

    time_table_path = path.join(__dirname,"./time_table.json")

    return new Promise((resolve,reject)=>{
        fs.readFile(time_table_path,'utf8',(err,data)=>{

            try {

                if (err) {
                    reject(err)
                }
                timetable = JSON.parse(data)
                resolve(timetable);
                
            } catch (ParseErr) {

                console.error('Error parsing JSON:', ParseErr);
                reject('Error parsing events data');     
            }

        });
    });
}
  
module.exports = {dashboard,get_attendance,upcoming_events,notice_board,time_table};