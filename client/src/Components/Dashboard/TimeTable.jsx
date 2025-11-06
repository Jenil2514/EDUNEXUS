import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function createData(time, monday, tuesday, wednesday, thursday, friday) {
  return { time, monday, tuesday, wednesday, thursday, friday };
}

export default function TimeTable({ TableData }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (TableData && Object.keys(TableData).length > 0) {
      const transformedData = transformData(TableData);
      setRows(transformedData);
      setIsLoading(false);
    }
  }, [TableData]);

  const transformData = (data) => {
    const times = {};

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
      const daySlots = data[day] || [];
      daySlots.forEach(slot => {
        const { time, course } = slot;
        if (!times[time]) {
          times[time] = { time };
        }
        times[time][day.toLowerCase()] = course || "Free Slot";
      });
    });

    return Object.keys(times).map(time => createData(
      time,
      times[time].monday || "Free Slot",
      times[time].tuesday || "Free Slot",
      times[time].wednesday || "Free Slot",
      times[time].thursday || "Free Slot",
      times[time].friday || "Free Slot"
    ));
  };

  if (isLoading) {
  return <div>Loading timetable...</div>;
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TableContainer
        component={Paper}
        sx={{ width: '100%', maxHeight: '300px', overflowY: 'auto', borderRadius: '20px', scrollbarWidth: 'thin' }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', zIndex:0 }}>Time</TableCell>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <TableCell key={day} align="right" sx={{ fontWeight: 'bold', zIndex:0 }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.time} sx={{ height: '55px' }}>
                <TableCell component="th" scope="row" sx={{zIndex:0}}>
                  {row.time}
                </TableCell>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                  <TableCell align="right" key={day}  sx={{zIndex:0}}>
                    {row[day]} 
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
  
}
