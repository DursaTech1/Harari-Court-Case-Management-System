import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#235467', '#4f7d8f', '#89aebc', '#cfdfe6'];

const CaseAnalytics = ({ stats }) => {
  const data = [
    { name: 'Active Cases', value: stats.activeCases },
    { name: 'Upcoming Hearings', value: stats.upcomingHearings },
    { name: 'Pending Payments', value: stats.pendingPayments },
    { name: 'Unread Messages', value: stats.unreadMessages }
  ];

  return (
    <div className="analytics-card">
      <h2>Case Analytics</h2>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="analytics-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: COLORS[index] }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseAnalytics;
