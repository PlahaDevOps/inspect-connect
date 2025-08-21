import {   Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react'; 
import {  Clock, Users, DollarSign, Podcast } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import ScheduleGantt from '../users/ScheduleGantt';

const AdminDashboard: React.FC = () => { 
    const navigate = useNavigate();

    const stats = [
      { icon: <Users size={24} />, title: "Users", description: "View all users", to: "/admin/users", count: 1280 },
      { icon: <Clock size={24} />, title: "Requests", description: "View all requests", to: "/admin/requests", count: 342 },
      { icon: <DollarSign size={24} />, title: "Payments", description: "View all payments", to: "/admin/payments", count: 89 },
      { icon: <Podcast  size={24} />, title: "Subscriptions", description: "View all subscriptions", to: "/admin/subscriptions", count: 57 },
    ] as const;

    return (
        <Box sx={{ mt: 2, }}>
           <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 3
            }}>

            {stats.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all .25s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  
                  <Box sx={{ textAlign: "left" }}>
                    {/* icon tile */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "grey.100"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "primary.main",
                        mb: 1.5,
                      }}
                    >
                      {/* keep your 24px lucide icons */}
                      {feature.icon}
                    </Box>

                    {/* count */}
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                      {feature.count}
                    </Typography>

                    {/* title */}
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.75 }}>
                      {feature.title}
                    </Typography>

                    {/* description */}
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>

                    <Button
                      size="small"
                      variant="text"
                      sx={{ mt: 1, px: 0, textTransform: 'none', fontWeight: 700 }}
                      onClick={() => navigate(feature.to)}
                    >
                      View All
                    </Button>
                  </Box>
                </Paper>

              </motion.div>
            ))}
          </Box>
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
    );
};

export default AdminDashboard;


 