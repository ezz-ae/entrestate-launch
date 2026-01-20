import React from 'react';

interface DashboardStatsProps {
  views: number;
  leads: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ views, leads }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
      <div style={{ flex: 1, padding: '16px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '4px' }}>TOTAL VIEWS</div>
        <div style={{ fontSize: '24px', fontWeight: '800' }}>{views.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>+12% ↗</div>
      </div>
      <div style={{ flex: 1, padding: '16px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '4px' }}>TOTAL LEADS</div>
        <div style={{ fontSize: '24px', fontWeight: '800' }}>{leads.toLocaleString()}</div>
        <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>+5% ↗</div>
      </div>
    </div>
  );
};

export default DashboardStats;