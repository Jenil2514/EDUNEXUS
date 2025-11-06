const { json } = require("express");
const pool = require("../config/db");

const professor_mycourses = async (req,res)=>{

    const ProfessorID = req.query.ID;
    const current_date = new Date();
    const current_year = current_date.getFullYear().toString();
    const current_month = current_date.getMonth() + 1;
    let semester_period;

    if(current_month >= 1 && current_month <=6)
      semester_period = 'Winter';
    else 
      semester_period = 'Autumn';

      try {
        // ProfessorID may be a numeric prof_id or a faculty SID like 'F001'.
        // If it's not an integer, attempt to map the SID to a prof_id using professors.prof_sid.
        let profIdToUse = null;
        const maybeInt = parseInt(ProfessorID, 10);
        if (!isNaN(maybeInt)) {
          profIdToUse = maybeInt;
        } else {
          // Ensure prof_sid column exists (idempotent)
          await pool.query(`ALTER TABLE professors ADD COLUMN IF NOT EXISTS prof_sid VARCHAR(50);`).catch(()=>{});

          // Try to find a professor with this prof_sid
          const findRes = await pool.query(`SELECT prof_id FROM professors WHERE prof_sid = $1`, [ProfessorID]);
          if (findRes.rows.length > 0) {
            profIdToUse = findRes.rows[0].prof_id;
          } else {
            // If no prof_sid mapping exists yet, create a simple mapping for existing professors
            const haveMappings = await pool.query(`SELECT COUNT(*) as cnt FROM professors WHERE prof_sid IS NOT NULL`);
            if (haveMappings.rows[0].cnt === '0') {
              const profs = await pool.query(`SELECT prof_id FROM professors ORDER BY prof_id`);
              for (let i = 0; i < profs.rows.length; i++) {
                const pid = profs.rows[i].prof_id;
                const sid = `F${String(i+1).padStart(3,'0')}`; // F001, F002...
                await pool.query(`UPDATE professors SET prof_sid = $1 WHERE prof_id = $2 AND prof_sid IS NULL`, [sid, pid]).catch(()=>{});
              }
            }

            // Try finding again after creating mappings
            const findRes2 = await pool.query(`SELECT prof_id FROM professors WHERE prof_sid = $1`, [ProfessorID]);
            if (findRes2.rows.length > 0) {
              profIdToUse = findRes2.rows[0].prof_id;
            }
          }
        }

        if (!profIdToUse) {
          res.status(400).json({ message: 'Invalid professor identifier' });
          return;
        }

        const courses = await pool.query(`SELECT cid , course_code FROM course 
            WHERE prof_id = $1 AND YEAR = $2 AND semester = $3 `,[profIdToUse,current_year,semester_period]);

        if(courses.rows.length === 0){
           res.status(200).json({message : "No courses assigned this year to professor"})
           return;
        }
    
        res.json({mycourses : courses.rows})
        
      } catch (error) {
        console.error("Error: An error occured while listing courses from database",error);
        res.status(500).json({Error : "An error occured while listing courses from database"});
      } 

}

const listenrolled_students = async(req,res)=>{

    const CID = req.params.CourseId;
    try {
        
        const students = await pool.query(`SELECT sid FROM course_enrolled_list WHERE cid = $1`,[parseInt(CID)]);

        if(students.rows.length === 0){
          res.status(200).json({message : "No student enrolled to this course yet!"})
          return;
       }
        res.json({students : students.rows});
        
    } catch (error) {
        console.error("Error: An error occured while listing students from database",error);
        res.status(500).json({ Error: "An error occured while listing students from database" });
        
    }
   
}

module.exports = {professor_mycourses,listenrolled_students}