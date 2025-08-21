import { Box } from "@mui/material" 
import ScheduleGantt from "../ScheduleGantt";



const InspectorDashboard = () => {
    return (
        <>
            <Box  >

                <Box sx={{ mt: 4 }}>
                    <ScheduleGantt
                        groups={[
                            {
                                name: 'Design',
                                tasks: [
                                    { name: 'User research', start: '2025-07-31', end: '2025-08-02', color: '#F6AD55' },
                                    { name: 'Design system', start: '2025-08-01', end: '2025-08-03', color: '#F6AD55' },
                                    { name: 'Prototype', start: '2025-08-03', end: '2025-08-07', color: '#F6AD55' },
                                ],
                            },
                            {
                                name: 'Development',
                                tasks: [
                                    { name: 'Infra architecture', start: '2025-08-05', end: '2025-08-14', color: '#34D399' },
                                    { name: 'Develop core modules', start: '2025-08-05', end: '2025-08-09', color: '#60A5FA' },
                                    { name: 'Integrate modules', start: '2025-08-10', end: '2025-08-12', color: '#60A5FA' },
                                ],
                            },
                        ]}
                    />
                </Box>
            </Box>
        </>
    )
}

export default InspectorDashboard;