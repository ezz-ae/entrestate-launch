import React, { useState } from 'react';
import EmptyState from '@/components/EmptyState';
import StickyFooter from './StickyFooter';
import DashboardStats from '@/components/DashboardStats';
import LeadDetailsModal from '@/components/LeadDetailsModal';

const MyProjectsScreen = ({ onCreateNew, onSettings, onLeadSelect, onNotifications, onOpenMarketing, onVoiceAssistant, onScanDocument }) => {
  // Refactored to "Execution Units" with Operational Metadata
  const [executionUnits, setExecutionUnits] = useState([
    { id: 1, name: "Downtown Luxury Loft", type: "inventory", subType: "website", status: "Active", intensity: 0.85, throughput: 45, health: 'optimal' },
    { id: 2, name: "October Intent Capture", type: "acquisition", subType: "googleAds", status: "Scaling", intensity: 0.62, throughput: 12, health: 'warning' },
    { id: 3, name: "Marina 2-Bed Operator", type: "operator", subType: "chat", status: "Monitoring", intensity: 0.94, throughput: 12, health: 'optimal' },
    { id: 4, name: "SMS Retention Protocol", type: "acquisition", subType: "sms", status: "Completed", intensity: 0.40, throughput: 5, health: 'idle' }
  ]);

  const inventoryUnits = executionUnits.filter(u => u.type === 'inventory');
  const acquisitionUnits = executionUnits.filter(u => u.type === 'acquisition' || u.type === 'operator');

  const [selectedProject, setSelectedProject] = useState(null);

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullHeight, setPullHeight] = useState(0);
  const startY = React.useRef(0);

  const handlePullStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handlePullMove = (e) => {
    if (window.scrollY === 0 && startY.current > 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        setPullHeight(Math.min(diff * 0.4, 100)); // Add resistance
      }
    }
  };

  const handlePullEnd = () => {
    if (pullHeight > 60) {
      setIsRefreshing(true);
      setPullHeight(60); // Snap to loading height
      // Simulate Refresh API Call
      setTimeout(() => {
        setExecutionUnits(prev => prev.map(p => ({
          ...p,
          views: p.views + Math.floor(Math.random() * 50),
          leads: p.leads + (Math.random() > 0.8 ? 1 : 0)
        })));
        setIsRefreshing(false);
        setPullHeight(0);
      }, 1500);
    } else {
      setPullHeight(0);
    }
    startY.current = 0;
  };

  // Calculate total stats
  const totalThroughput = executionUnits.reduce((acc, p) => acc + (p.throughput || 0), 0);
  const avgIntensity = (executionUnits.reduce((acc, p) => acc + (p.intensity || 0), 0) / executionUnits.length).toFixed(2);

  const handleDelete = (id) => {
    setExecutionUnits(executionUnits.filter(p => p.id !== id));
  };

  const handleProjectClick = (project) => {
    if (project.type === 'email' || project.type === 'sms') {
      onOpenMarketing(project);
    } else {
      setSelectedProject(project);
    }
  };

  // 2. The "Empty State" Logic
  // If the agent has no work saved, we guide them immediately to the action.
  if (executionUnits.length === 0) {
    return (
      <EmptyState 
        title="System Idle"
        message="No active execution units detected. Deploy a new operational unit to begin intent capture."
        actionLabel="Deploy Execution Unit"
        onAction={onCreateNew}
      />
    );
  }

  // 3. The "List State" (If they have data)
  return (
    <div 
      className="screen-container" 
      style={{ padding: '24px', paddingBottom: '100px', minHeight: '80vh' }}
      onTouchStart={handlePullStart}
      onTouchMove={handlePullMove}
      onTouchEnd={handlePullEnd}
    >
      {/* Refresh Indicator */}
      <div style={{ 
        height: `${pullHeight}px`, 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: isRefreshing ? 'height 0.2s' : 'height 0.1s ease-out'
      }}>
        {isRefreshing ? (
          <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
        ) : (
          <span style={{ transform: `rotate(${pullHeight * 3}deg)`, fontSize: '20px', opacity: Math.min(pullHeight / 40, 1) }}>⬇️</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Command Center</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onScanDocument}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            📷
          </button>
          <button 
            onClick={onVoiceAssistant}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            🎙️
          </button>
          <button 
            onClick={onNotifications}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            🔔
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '1px solid white' }}></span>
          </button>
          <button 
            onClick={onSettings}
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              cursor: 'pointer' 
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
      
      {/* Situational Awareness Layer */}
      <DashboardStats views={avgIntensity} leads={totalThroughput} label1="Avg Intensity" label2="Total Throughput" />
      
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          Inventory Command
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {inventoryUnits.map((unit) => (
            <SwipeableProjectItem 
              key={unit.id} 
              project={unit} 
              onDelete={handleDelete} 
              onSelect={() => handleProjectClick(unit)}
            />
          ))}
        </div>

        <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          Demand & Operator Governance
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {acquisitionUnits.map((unit) => (
            <SwipeableProjectItem 
              key={unit.id} 
              project={unit} 
              onDelete={handleDelete} 
              onSelect={() => handleProjectClick(unit)}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <LeadDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onLeadSelect={onLeadSelect}
        />
      )}
      <StickyFooter label="Deploy New Operational Unit" onClick={onCreateNew} />
    </div>
  );
};

// Sub-component for swipe logic
const SwipeableProjectItem = ({ project, onDelete, onSelect }) => {
  const [offset, setOffset] = useState(0);
  const startX = React.useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    // Only allow swiping left (negative diff) up to -80px
    if (diff < 0 && diff > -100) {
      setOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (offset < -40) {
      setOffset(-80); // Snap open
    } else {
      setOffset(0); // Snap close
    }
  };

  const handleClick = () => {
    // Only trigger select if we aren't swiped open
    if (offset === 0) onSelect();
  };

  return (
    <div className="project-item-wrapper">
       <div className="delete-action" onClick={() => onDelete(project.id)}>
         🗑️
       </div>
       <div 
         className="project-item-content"
         style={{ 
           transform: `translateX(${offset}px)`,
           padding: '20px', borderRadius: '16px', backgroundColor: 'white', border: '1px solid #E5E7EB', position: 'relative', zIndex: 2, transition: 'transform 0.2s ease-out'
         }}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
         onClick={handleClick}
       >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0', color: '#111827' }}>{project.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F3F4F6', color: '#4B5563', textTransform: 'uppercase' }}>
                  {project.subType}
                </span>
                <span style={{ fontSize: '12px', color: project.health === 'optimal' ? '#10B981' : '#F59E0B' }}>
                  ● {project.status}
                </span>
              </div>
            </div>
            {project.intensity && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{(project.intensity * 100).toFixed(0)}%</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' }}>Intensity</div>
              </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default MyProjectsScreen;
