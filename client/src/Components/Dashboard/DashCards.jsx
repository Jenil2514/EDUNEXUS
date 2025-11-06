import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import TimeTable from './TimeTable';
import Events from './Events';
import ProgressBar from './ProgressBar';
import '../../CSS/DashCards.css';
import DashCourse from './DashCourse';
import axios from 'axios';
import DashNotice from './DashNotice';
import Calendar from './Calendar';


const ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export default function DashCards() {
    const SID = JSON.parse(localStorage.getItem("userInfo")).SID;


    const Api = `${ENDPOINT}/api/user/dashboard?SID=${SID}`;
    const [attendance, setattendance] = useState("100%");
    const [notice, setnotice] = useState("");
    const [event, setevent] = useState("");
    const [TableData, setTableData] = useState([]);
    const [error, setError] = useState(null);


    const fetchApiData = async () => {
        const SID = JSON.parse(localStorage.getItem("userInfo")).SID;
        const role = JSON.parse(localStorage.getItem("userInfo")).role;
        // console.log(SID);
        // console.log(role);
        try {
            const response = await axios.get(Api, {
                SID: SID,
                role: role
            });
            // console.log(response.data);
            setattendance(response.data?.attendance_data?.Overall_attendance);
            setnotice(response.data?.notice_board_data);
            // console.log(response.data?.notice_board_data);
            setevent(response.data?.upcoming_events_data);
            setTableData(response.data?.time_table_data);
        }
        catch (e) {
            setError(e);
            console.log(error);
        }


    }

    useEffect(() => {
        fetchApiData();
    }, []);



    return (
        <Box>
            <h2>Welcome Students!</h2>

            <Grid container spacing={3}>
                <Grid item md={8}>
                    <Box>
                        <Box sx={{  height: '100%',m:1 }}>
                            <Grid container spacing={1}>
                                <Grid item md={6}>
                                    <Paper sx={{ borderRadius: '20px', padding: '10px' }}>
                                        <DashCourse />
                                    </Paper>
                                </Grid>
                                <Grid item md={6}>
                                    <ProgressBar attendance={attendance} />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{m:1}}>
                            <Paper sx={{ borderRadius: '20px', padding: '10px' }}>
                                <h2>Class Time Table</h2>
                            <TimeTable TableData={TableData} />
                            </Paper>
                        </Box>
                        <Box sx={{m:1}}>
                            <Paper sx={{ borderRadius: '20px', padding: '10px' }}>
                                    <h2>Exam Time Table</h2>
                            <TimeTable TableData={TableData} />
                            </Paper>
                        </Box>
                    </Box>

                </Grid>
                <Grid item md={4}>
                    <Box sx={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ m: 1 }}>
                            <Paper sx={{ borderRadius: '20px', padding: '10px',height:'260px' }}>

                                <DashNotice notice={notice} />
                            </Paper>
                        </Box>
                        <Box sx={{ m: 1 }}>
                            <Paper sx={{ borderRadius: '20px', padding: '10px' }}>

                                <Calendar />
                            </Paper>
                        </Box>
                        <Box sx={{ m: 1 }}>
                            <Paper sx={{ borderRadius: '20px', padding: '10px' }}>

                                <Events height={'320px'} event={event} />
                            </Paper>
                        </Box>

                    </Box>
                </Grid>
            </Grid>


        </Box >
    );
}