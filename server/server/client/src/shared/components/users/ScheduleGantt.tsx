import * as React from 'react';
import { Box, Paper, Typography,   Divider } from '@mui/material';

type TaskItem = {
  name: string;
  start: Date | string;
  end: Date | string;
  color?: string;
};

type TaskGroup = {
  name: string;
  tasks: TaskItem[];
};

interface ScheduleGanttProps {
  groups: TaskGroup[];
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffInDays(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function ScheduleGantt({ groups }: ScheduleGanttProps) {
  const dayWidth = 88; // px per day
  const rowHeight = 40; // px per row

  const { rangeStart, rangeEnd } = React.useMemo(() => {
    const allDates: Date[] = [];
    groups.forEach((g) => {
      g.tasks.forEach((t) => {
        allDates.push(toDate(t.start));
        allDates.push(toDate(t.end));
      });
    });
    const min = allDates.length ? allDates.reduce((a, b) => (a < b ? a : b)) : new Date();
    const max = allDates.length ? allDates.reduce((a, b) => (a > b ? a : b)) : new Date();
    return { rangeStart: startOfDay(min), rangeEnd: startOfDay(max) };
  }, [groups]);

  const totalDays = Math.max(1, diffInDays(rangeStart, rangeEnd) + 1);

  const days = React.useMemo(() => {
    return new Array(totalDays).fill(0).map((_, i) => {
      const d = new Date(rangeStart);
      d.setDate(d.getDate() + i);
      const short = d.toLocaleDateString(undefined, { weekday: 'short' });
      const day = d.toLocaleDateString(undefined, { day: 'numeric' });
      return { date: d, label: `${short}, ${day}` };
    });
  }, [rangeStart, totalDays]);

  const rows = React.useMemo(() => {
    // number of rows including group headers
    return groups.reduce((acc, g) => acc + 1 + g.tasks.length, 0);
  }, [groups]);

  const gridWidth = totalDays * dayWidth;
  const gridHeight = rows * rowHeight;

  let runningRow = 0;

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
        Schedule
      </Typography>

      <Box sx={{ position: 'relative', overflowX: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '240px 1fr', alignItems: 'stretch', minWidth: 640 }}>
          {/* Left header cell */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              Name
            </Typography>
          </Box>
          {/* Days header */}
          <Box sx={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${totalDays}, ${dayWidth}px)` }}>
              {days.map((d, i) => (
                <Box key={i} sx={{ px: 1, py: 1.5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={700}>
                    {d.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '240px 1fr', minWidth: 640 }}>
          {/* Left names column */}
          <Box>
            {groups.map((group, gi) => (
              <React.Fragment key={gi}>
                <Box sx={{ px: 2, height: rowHeight, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {group.name}
                  </Typography>
                </Box>
                {group.tasks.map((t, ti) => (
                  <Box key={ti} sx={{ px: 2, height: rowHeight, display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">{t.name}</Typography>
                  </Box>
                ))}
                {gi < groups.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>

          {/* Right timeline grid */}
          <Box sx={{ position: 'relative' }}>
            {/* Vertical day grid lines */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${totalDays}, ${dayWidth}px)`, pointerEvents: 'none' }}>
              {days.map((_, i) => (
                <Box key={i} sx={{ borderRight: '1px solid', borderColor: 'divider' }} />
              ))}
            </Box>

            {/* Rows background separators */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`, pointerEvents: 'none' }}>
              {new Array(rows).fill(0).map((_, r) => (
                <Box key={r} sx={{ borderTop: r === 0 ? 'none' : '1px solid', borderColor: 'divider' }} />
              ))}
            </Box>

            {/* Bars layer */}
            <Box sx={{ position: 'relative', width: gridWidth, height: gridHeight }}>
              {groups.map((group, gi) => {
                // group header consumes one row
                const headerRow = runningRow;
                runningRow += 1;
                return (
                  <React.Fragment key={gi}>
                    {group.tasks.map((t, ti) => {
                      const start = startOfDay(toDate(t.start));
                      const end = startOfDay(toDate(t.end));
                      const offsetDays = diffInDays(rangeStart, start);
                      const spanDays = Math.max(1, diffInDays(start, end) + 1);
                      const top = (runningRow + ti) * rowHeight + 6; // 6px padding
                      const left = offsetDays * dayWidth + 4;
                      const width = spanDays * dayWidth - 8;
                      const color = t.color || (gi % 2 === 0 ? '#F6AD55' : '#34D399');
                      const translucent = `${color}33`;
                      return (
                        <Box
                          key={ti}
                          sx={{
                            position: 'absolute',
                            top,
                            left,
                            width,
                            height: rowHeight - 12,
                            borderRadius: 1.5,
                            bgcolor: translucent,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                          }}
                        >
                          <Typography variant="caption" fontWeight={700} sx={{ color: 'text.primary' }}>
                            {t.name}
                          </Typography>
                        </Box>
                      );
                    })}
                    {/* advance rows past tasks */}
                    {(() => {
                      runningRow += group.tasks.length;
                      return null;
                    })()}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}


