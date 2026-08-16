import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { FarmMap } from './components/map/FarmMap';
import { PalmDetailView } from './components/palm/PalmDetailView';
import { TaskListView } from './components/tasks/TaskListView';
import { WorkersListView } from './components/workers/WorkersListView';
import { QrScannerView } from './components/qr/QrScannerView';
import { QrPrintManager } from './components/qr/QrPrintManager';
import { WorkerHomeView } from './components/worker/WorkerHomeView';
import { IrrigationView } from './components/irrigation/IrrigationView';
import { AssetsView } from './components/assets/AssetsView';
import { AuditLogView } from './components/audit/AuditLogView';

const MainLayout: React.FC = () => {
  const { currentView, currentRole } = useFarm();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'map':
        return <FarmMap />;
      case 'palm_detail':
        return <PalmDetailView />;
      case 'tasks':
        return <TaskListView />;
      case 'workers':
        return <WorkersListView />;
      case 'qr_scanner':
        return <QrScannerView />;
      case 'qr_print':
        return <QrPrintManager />;
      case 'worker_mode':
        return <WorkerHomeView />;
      case 'irrigation':
        return <IrrigationView />;
      case 'assets':
        return <AssetsView />;
      case 'audit_log':
        return <AuditLogView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-container selection:text-white">
      {/* Top Header */}
      <Header onMenuClick={() => setMobileMenuOpen(true)} />

      {/* Main Body container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Global Search Modal */}
      <GlobalSearchModal />
    </div>
  );
};

export function App() {
  return (
    <FarmProvider>
      <MainLayout />
    </FarmProvider>
  );
}

export default App;
