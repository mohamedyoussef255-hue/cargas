import React, { useState, useEffect } from 'react';
import { Header, ActiveTabType } from './components/Header';
import { CameraMonitoringSession } from './components/CameraMonitoringSession';
import { SessionsList } from './components/SessionsList';
import { MobileOnlyMap } from './components/MobileOnlyMap';
import { CngFeasibilityAnalytics } from './components/CngFeasibilityAnalytics';
import { ConversionFleetCalculator } from './components/ConversionFleetCalculator';
import { CngTechnicalGuide } from './components/CngTechnicalGuide';
import { AdminControlPanel } from './components/AdminControlPanel';
import { DepartmentReviewsWorkflow } from './components/DepartmentReviewsWorkflow';
import { StationExecutionTracker } from './components/StationExecutionTracker';
import { NewSessionModal } from './components/NewSessionModal';
import { DepartmentPortalLanding } from './components/DepartmentPortalLanding';
import { DepartmentWorkspaceView } from './components/DepartmentWorkspaceView';
import { MarketingSurveyDispatcherModal } from './components/MarketingSurveyDispatcherModal';
import { RequestFormChangeModal } from './components/RequestFormChangeModal';
import { LandownerSurveyApplicationModal } from './components/LandownerSurveyApplicationModal';
import { ClientLandownerSurveyPortal } from './components/ClientLandownerSurveyPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { DepartmentLoginModal } from './components/DepartmentLoginModal';
import { CargasNgvLogo } from './components/CargasNgvLogo';
import { MonitoringSession, CNGStation, PlatformMasterSettings, FuelPricing, DepartmentRole, CustomFormField, FormChangeRequest, LandownerApplication } from './types';
import { INITIAL_SESSIONS, INITIAL_CNG_STATIONS } from './data/initialData';
import { loadPlatformSettings, savePlatformSettings } from './data/defaultSettings';
import { INITIAL_CUSTOM_FORM_FIELDS, INITIAL_FORM_CHANGE_REQUESTS, DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from './data/departmentCustomFields';
import { DEFAULT_LANDOWNER_APPLICATIONS } from './data/defaultLandownerApplications';
import { DepartmentTeamInviteModal } from './components/DepartmentTeamInviteModal';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  clearAdminAuth,
  isDeptAuthenticated,
  setDeptAuthenticated,
  clearDeptAuth
} from './data/authCredentials';

export default function App() {
  // Check URL parameters for direct WhatsApp deep links
  const [urlParams] = useState<URLSearchParams | null>(() => {
    try {
      return new URLSearchParams(window.location.search);
    } catch {
      return null;
    }
  });

  const roleParam = urlParams?.get('role') as DepartmentRole | null;
  const userTypeParam = (urlParams?.get('userType') as 'gm' | 'staff') || 'gm';
  const userNameParam = urlParams?.get('userName') || null;
  const isDirectLink = Boolean(roleParam && (roleParam === 'surveyor' || DEPARTMENTS_METADATA[roleParam]));

  const [userType] = useState<'gm' | 'staff'>(userTypeParam);
  const [userName] = useState<string | null>(userNameParam);

  // Department Role State (Null shows the Landing Portal)
  const [currentRole, setCurrentRole] = useState<DepartmentRole | null>(() => {
    if (roleParam && (roleParam === 'surveyor' || DEPARTMENTS_METADATA[roleParam])) {
      // If department or admin is passed, check if authenticated
      if (roleParam === 'admin') {
        return isAdminAuthenticated() ? 'admin' : null;
      }
      if (roleParam !== 'surveyor') {
        return isDeptAuthenticated(roleParam) ? roleParam : null;
      }
      return roleParam;
    }
    
    try {
      const saved = localStorage.getItem('cng_department_role');
      if (saved && (saved === 'surveyor' || DEPARTMENTS_METADATA[saved as DepartmentRole])) {
        if (saved === 'admin') {
          return isAdminAuthenticated() ? 'admin' : null;
        }
        if (saved !== 'surveyor') {
          return isDeptAuthenticated(saved as DepartmentRole) ? (saved as DepartmentRole) : null;
        }
        return saved as DepartmentRole;
      }
    } catch {}
    return null;
  });

  // Admin Live Preview State (allows Super Admin to view the app as a specific GM before sending invite)
  const [adminPreviewRole, setAdminPreviewRole] = useState<DepartmentRole | null>(null);

  // Super Admin login modal state
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(() => {
    if (roleParam === 'admin' && !isAdminAuthenticated()) {
      return true;
    }
    return false;
  });

  // Department password login modal state (for direct deep links or landing selections)
  const [deptLoginRole, setDeptLoginRole] = useState<DepartmentRole | null>(() => {
    if (roleParam && roleParam !== 'admin' && roleParam !== 'surveyor') {
      if (!isDeptAuthenticated(roleParam)) {
        return roleParam;
      }
    }
    return null;
  });

  // Admin Control Panel sub-tab navigation (when jumping from preview to edit schema)
  const [adminInitialTab, setAdminInitialTab] = useState<'pricing' | 'contacts' | 'form_builder' | 'queries' | 'datamgmt' | 'analytics' | 'feasibility' | 'technical' | 'historical' | 'invitations'>('pricing');
  const [selectedFormBuilderDept, setSelectedFormBuilderDept] = useState<DepartmentRole>('operations');

  // General Manager Team WhatsApp Invite Modal
  const [isTeamInviteModalOpen, setIsTeamInviteModalOpen] = useState<boolean>(false);

  // Effective Role (Preview overrides current role for UI isolation)
  const effectiveRole = adminPreviewRole || currentRole;
  const isAdminPreview = Boolean(adminPreviewRole);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    if (roleParam && (roleParam === 'surveyor' || DEPARTMENTS_METADATA[roleParam])) {
      return DEPARTMENT_ROLE_SPECS[roleParam]?.primaryTab || 'departments';
    }
    if (currentRole === 'surveyor') return 'camera';
    if (currentRole && currentRole !== 'admin') return 'departments';
    return 'camera';
  });

  // Strict Tab Authorization Guard: if effectiveRole is a department (not admin), activeTab is strictly within its allowedTabs
  useEffect(() => {
    if (effectiveRole && effectiveRole !== 'admin') {
      const spec = DEPARTMENT_ROLE_SPECS[effectiveRole];
      if (spec && !spec.allowedTabs.includes(activeTab)) {
        setActiveTab(spec.primaryTab);
      }
    }
  }, [effectiveRole, activeTab]);

  // Master Platform Settings (Fuel pricing, Feasibility defaults, Technical Guide items)
  const [settings, setSettings] = useState<PlatformMasterSettings>(() => loadPlatformSettings());

  // Save settings when modified
  const handleUpdateSettings = (newSettings: PlatformMasterSettings) => {
    setSettings(newSettings);
    savePlatformSettings(newSettings);
  };

  const handleUpdatePricing = (newPricing: FuelPricing) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        pricing: newPricing,
        lastUpdated: new Date().toISOString()
      };
      savePlatformSettings(updated);
      return updated;
    });
  };

  // Sessions state with LocalStorage persistence
  const [sessions, setSessions] = useState<MonitoringSession[]>(() => {
    try {
      const saved = localStorage.getItem('cng_platform_sessions_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_SESSIONS;
  });

  // Active Monitoring Session (currently being recorded in camera)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const found = INITIAL_SESSIONS.find(s => s.status === 'active');
    return found ? found.id : INITIAL_SESSIONS[0]?.id || null;
  });

  // Stations List
  const [stations, setStations] = useState<CNGStation[]>(INITIAL_CNG_STATIONS);

  // Custom Form Fields State
  const [customFields, setCustomFields] = useState<CustomFormField[]>(() => {
    try {
      const saved = localStorage.getItem('cng_custom_fields_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CUSTOM_FORM_FIELDS;
  });

  // Form Change Requests State
  const [changeRequests, setChangeRequests] = useState<FormChangeRequest[]>(() => {
    try {
      const saved = localStorage.getItem('cng_form_change_requests_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FORM_CHANGE_REQUESTS;
  });

  // Modal States
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState<boolean>(false);
  const [isDispatcherModalOpen, setIsDispatcherModalOpen] = useState<boolean>(false);
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState<boolean>(false);
  const [isLandownerModalOpen, setIsLandownerModalOpen] = useState<boolean>(false);

  // Client Landowner Self-Service Survey Portal (from WhatsApp direct link)
  const isLandownerSurveyAction = urlParams?.get('action') === 'landowner_survey' || urlParams?.has('client_token');
  const clientTokenFromUrl = urlParams?.get('client_token') || null;
  const clientNameFromUrl = urlParams?.get('client_name') || undefined;
  const clientPhoneFromUrl = urlParams?.get('client_phone') || undefined;

  const [isClientPortalOpen, setIsClientPortalOpen] = useState<boolean>(() => Boolean(isLandownerSurveyAction));
  const [clientPortalTargetApp, setClientPortalTargetApp] = useState<LandownerApplication | null>(() => {
    if (clientTokenFromUrl) {
      try {
        const saved = localStorage.getItem('cng_landowner_apps_v1');
        if (saved) {
          const parsed: LandownerApplication[] = JSON.parse(saved);
          const found = parsed.find(a => a.id === clientTokenFromUrl);
          if (found) return found;
        }
      } catch {}
      return DEFAULT_LANDOWNER_APPLICATIONS.find(a => a.id === clientTokenFromUrl) || null;
    }
    return null;
  });

  // Landowner Site Inspection Applications State
  const [landownerApps, setLandownerApps] = useState<LandownerApplication[]>(() => {
    try {
      const saved = localStorage.getItem('cng_landowner_apps_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LANDOWNER_APPLICATIONS;
  });

  const handleSaveClientLandownerApp = (updatedApp: LandownerApplication) => {
    setLandownerApps(prev => {
      const exists = prev.some(a => a.id === updatedApp.id);
      if (exists) {
        return prev.map(a => a.id === updatedApp.id ? updatedApp : a);
      }
      return [updatedApp, ...prev];
    });
  };

  // Mobile View Simulator State (for Map requirement: "لا تظهر بعد نشر التطبيق إلا على الموبايل")
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cng_platform_sessions_v1', JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('cng_landowner_apps_v1', JSON.stringify(landownerApps));
    } catch {}
  }, [landownerApps]);

  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('cng_department_role', currentRole);
    } else {
      localStorage.removeItem('cng_department_role');
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem('cng_custom_fields_v1', JSON.stringify(customFields));
    } catch {}
  }, [customFields]);

  useEffect(() => {
    try {
      localStorage.setItem('cng_form_change_requests_v1', JSON.stringify(changeRequests));
    } catch {}
  }, [changeRequests]);

  // Current active session object
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // Handlers
  const handleUpdateSession = (updatedSession: MonitoringSession) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleCompleteSession = (completedSession: MonitoringSession) => {
    setSessions(prev => prev.map(s => s.id === completedSession.id ? completedSession : s));
    setActiveTab(currentRole === 'surveyor' ? 'camera' : 'sessions');
  };

  const handleStartSession = (newSession: MonitoringSession) => {
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setActiveTab('camera');
  };

  const handleResumeSession = (session: MonitoringSession) => {
    const resumed: MonitoringSession = {
      ...session,
      status: 'active',
    };
    handleUpdateSession(resumed);
    setActiveSessionId(session.id);
    setActiveTab('camera');
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining[0]?.id || null);
    }
  };

  // If a direct department link was opened via WhatsApp and user is not yet authenticated, show ONLY that department's login screen!
  if (roleParam && roleParam !== 'admin' && roleParam !== 'surveyor' && !isDeptAuthenticated(roleParam)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <DepartmentLoginModal
          isOpen={true}
          onClose={() => {
            try {
              window.history.replaceState({}, '', window.location.pathname);
            } catch {}
            setDeptLoginRole(null);
          }}
          department={roleParam}
          onSuccess={() => {
            setDeptAuthenticated(roleParam, true);
            setCurrentRole(roleParam);
            setActiveTab(DEPARTMENT_ROLE_SPECS[roleParam]?.primaryTab || 'departments');
            setDeptLoginRole(null);
          }}
        />
      </div>
    );
  }

  // If a direct admin link was opened and user is not yet authenticated, show ONLY Super Admin login screen!
  if (roleParam === 'admin' && !isAdminAuthenticated()) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <AdminLoginModal
          isOpen={true}
          onClose={() => {
            try {
              window.history.replaceState({}, '', window.location.pathname);
            } catch {}
            setIsAdminLoginModalOpen(false);
          }}
          onSuccess={() => {
            setAdminAuthenticated(true);
            setCurrentRole('admin');
            setActiveTab('admin');
            setIsAdminLoginModalOpen(false);
          }}
        />
      </div>
    );
  }

  // If no role selected, render the Department Portal Landing
  if (!currentRole) {
    return (
      <>
        <DepartmentPortalLanding
          isAdminLoggedIn={isAdminAuthenticated()}
          onSelectRole={(role) => {
            if (role === 'admin') {
              if (isAdminAuthenticated()) {
                setCurrentRole('admin');
                setActiveTab('admin');
              } else {
                setIsAdminLoginModalOpen(true);
              }
            } else {
              if (isDeptAuthenticated(role)) {
                setCurrentRole(role);
                setActiveTab(DEPARTMENT_ROLE_SPECS[role]?.primaryTab || 'departments');
              } else {
                setDeptLoginRole(role);
              }
            }
          }}
          onOpenAdminLogin={() => {
            if (isAdminAuthenticated()) {
              setCurrentRole('admin');
              setActiveTab('admin');
            } else {
              setIsAdminLoginModalOpen(true);
            }
          }}
          onOpenDeptLogin={(role) => {
            if (isDeptAuthenticated(role)) {
              setCurrentRole(role);
              setActiveTab(DEPARTMENT_ROLE_SPECS[role]?.primaryTab || 'departments');
            } else {
              setDeptLoginRole(role);
            }
          }}
        />

        {/* Super Admin Login Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          onSuccess={() => {
            setAdminAuthenticated(true);
            setCurrentRole('admin');
            setActiveTab('admin');
            setIsAdminLoginModalOpen(false);
          }}
        />

        {/* Department Password Login Modal */}
        {deptLoginRole && (
          <DepartmentLoginModal
            isOpen={true}
            onClose={() => setDeptLoginRole(null)}
            department={deptLoginRole}
            onSuccess={() => {
              setDeptAuthenticated(deptLoginRole, true);
              setCurrentRole(deptLoginRole);
              setActiveTab(DEPARTMENT_ROLE_SPECS[deptLoginRole]?.primaryTab || 'departments');
              setDeptLoginRole(null);
            }}
          />
        )}
      </>
    );
  }

  // Standalone Client Landowner Survey Portal View (accessed via WhatsApp direct link or test preview)
  if (isClientPortalOpen) {
    return (
      <ClientLandownerSurveyPortal
        initialApp={clientPortalTargetApp}
        clientPhoneFromUrl={clientPhoneFromUrl}
        clientNameFromUrl={clientNameFromUrl}
        onSaveApplication={(app) => {
          handleSaveClientLandownerApp(app);
          setClientPortalTargetApp(app);
        }}
        onClose={() => {
          setIsClientPortalOpen(false);
          // If came from WhatsApp direct client link without role, set role to marketing
          if (!currentRole) {
            setCurrentRole('marketing');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Platform Header with Role Display and Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSession={activeSession}
        onNewSession={() => setIsNewSessionModalOpen(true)}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
        currentRole={effectiveRole}
        onSwitchDepartment={() => {
          setAdminPreviewRole(null);
          setActiveTab('portal');
        }}
        hotline={settings.general.hotline || '19544'}
        isAdminPreview={isAdminPreview}
        onExitPreview={() => {
          setAdminPreviewRole(null);
          setCurrentRole('admin');
          setActiveTab('admin');
        }}
        onCustomizeDepartment={(dept) => {
          setAdminPreviewRole(null);
          setCurrentRole('admin');
          setActiveTab('admin');
          setAdminInitialTab('form_builder');
          setSelectedFormBuilderDept(dept);
        }}
        onOpenTeamInvite={() => setIsTeamInviteModalOpen(true)}
        onOpenLandownerApplications={() => setIsLandownerModalOpen(true)}
        userType={userType}
        userName={userName}
        isDirectLink={isDirectLink}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {activeTab === 'portal' && (
          <div className="py-2">
            <DepartmentPortalLanding
              isAdminLoggedIn={isAdminAuthenticated()}
              onSelectRole={(role) => {
                if (role === 'admin') {
                  setCurrentRole('admin');
                  setActiveTab('admin');
                } else {
                  if (isDeptAuthenticated(role)) {
                    setCurrentRole(role);
                    setActiveTab(DEPARTMENT_ROLE_SPECS[role]?.primaryTab || 'departments');
                  } else {
                    setDeptLoginRole(role);
                  }
                }
              }}
              onOpenAdminLogin={() => {
                setCurrentRole('admin');
                setActiveTab('admin');
              }}
              onOpenDeptLogin={(role) => {
                if (isDeptAuthenticated(role)) {
                  setCurrentRole(role);
                  setActiveTab(DEPARTMENT_ROLE_SPECS[role]?.primaryTab || 'departments');
                } else {
                  setDeptLoginRole(role);
                }
              }}
            />
          </div>
        )}

        {activeTab === 'camera' && (
          <CameraMonitoringSession
            session={activeSession}
            onUpdateSession={handleUpdateSession}
            onCompleteSession={handleCompleteSession}
            onStartNewSession={() => setIsNewSessionModalOpen(true)}
            allSessions={sessions}
            onSelectOtherSession={(s) => {
              setActiveSessionId(s.id);
            }}
            onCancelSession={() => {
              setActiveTab(effectiveRole === 'marketing' ? 'departments' : 'sessions');
            }}
          />
        )}

        {activeTab === 'sessions' && (
          <SessionsList
            sessions={sessions}
            onSelectSession={(session) => {
              setActiveSessionId(session.id);
            }}
            onResumeSession={handleResumeSession}
            onDeleteSession={handleDeleteSession}
            onStartNewSession={() => setIsNewSessionModalOpen(true)}
            onUpdateSession={handleUpdateSession}
          />
        )}

        {activeTab === 'map' && (
          <MobileOnlyMap
            sessions={sessions}
            stations={stations}
            onUpdateStations={setStations}
            onSelectSession={(session) => {
              setActiveSessionId(session.id);
              setActiveTab('sessions');
            }}
          />
        )}

        {activeTab === 'feasibility' && (
          <CngFeasibilityAnalytics 
            sessions={sessions} 
            pricing={settings.pricing}
            feasibilityDefaults={settings.feasibility}
            onNavigateToAdmin={() => setActiveTab('admin')}
            onNavigateToDepartments={() => setActiveTab('departments')}
          />
        )}

        {/* Departments View: Role-Isolated Workspace OR Super Admin Comprehensive Review */}
        {activeTab === 'departments' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {/* If Current User is Super Admin (and not in preview): Show Unified Multi-Department Review */}
            {effectiveRole === 'admin' ? (
              <>
                {/* Site selector if multiple sessions exist */}
                {sessions.length > 1 && (
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <span className="text-xs font-semibold text-slate-300">اختر الموقع / الجلسة المطلوب العمل عليها:</span>
                    <select
                      value={activeSession?.id || sessions[0].id}
                      onChange={(e) => setActiveSessionId(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {sessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code} - {s.title} ({s.locationName}، {s.governorate})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {activeSession ? (
                  <DepartmentReviewsWorkflow
                    session={activeSession}
                    onUpdateSession={handleUpdateSession}
                    onNavigateToFeasibility={() => setActiveTab('feasibility')}
                    onNavigateToAdmin={() => setActiveTab('admin')}
                    onNavigateToExecution={() => setActiveTab('execution')}
                  />
                ) : (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                    <p className="text-slate-400 text-sm">يرجى بدء جلسة رصد أولاً أو اختيار موقع من السجل لمراجعته.</p>
                  </div>
                )}
              </>
            ) : (
              /* If Current User is a specific Department or Super Admin in Live Preview: Show Isolated Department Workspace */
              <DepartmentWorkspaceView
                department={effectiveRole || 'operations'}
                sessions={sessions}
                activeSession={activeSession}
                onSelectSession={(session) => setActiveSessionId(session.id)}
                onUpdateSession={handleUpdateSession}
                customFields={customFields}
                onSubmitFormChangeRequest={(newReq) => setChangeRequests(prev => [newReq, ...prev])}
                changeRequests={changeRequests}
                onNavigateToAdmin={() => {
                  setAdminPreviewRole(null);
                  setCurrentRole('admin');
                  setActiveTab('admin');
                }}
                onSwitchDepartment={() => {
                  if (isAdminPreview) {
                    setAdminPreviewRole(null);
                    setCurrentRole('admin');
                    setActiveTab('admin');
                  } else {
                    setCurrentRole(null);
                  }
                }}
                onOpenLandownerApplications={() => setIsLandownerModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Execution Stage & Daily Periodic Reporting */}
        {activeTab === 'execution' && (
          <div className="space-y-4">
            {sessions.length > 1 && (
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-300">المحطة الجاري متابعة تنفيذها الميداني وتقاريرها:</span>
                <select
                  value={activeSession?.id || sessions[0].id}
                  onChange={(e) => setActiveSessionId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.title} ({s.locationName}، {s.governorate})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeSession ? (
              <StationExecutionTracker
                session={activeSession}
                onUpdateSession={handleUpdateSession}
                onNavigateToFeasibility={() => setActiveTab('feasibility')}
                onNavigateToDepartments={() => setActiveTab('departments')}
                onNavigateToAdmin={() => setActiveTab('admin')}
              />
            ) : (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-slate-400 text-sm">يرجى اختيار موقع معتمد لمتابعة أعمال التنفيذ والإنشاء.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculator' && (
          <ConversionFleetCalculator 
            pricing={settings.pricing}
            onUpdatePricing={handleUpdatePricing}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'guide' && (
          <CngTechnicalGuide 
            centers={settings.centers}
            cylinders={settings.cylinders}
            systems={settings.systems}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminControlPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            sessions={sessions}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
            stations={stations}
            onUpdateStations={setStations}
            onBack={() => setActiveTab('portal')}
            onClearSessions={() => {
              setSessions([]);
              setActiveSessionId(null);
            }}
            onRestoreDefaultSessions={() => {
              setSessions(INITIAL_SESSIONS);
              setActiveSessionId(INITIAL_SESSIONS[0]?.id || null);
            }}
            onImportSessions={(newSessions) => {
              setSessions(prev => [...newSessions, ...prev]);
              if (newSessions.length > 0) {
                setActiveSessionId(newSessions[0].id);
              }
            }}
            onSelectSession={(session) => {
              setActiveSessionId(session.id);
              setActiveTab('sessions');
            }}
            customFields={customFields}
            onUpdateFields={setCustomFields}
            changeRequests={changeRequests}
            onUpdateChangeRequests={setChangeRequests}
            onPreviewDepartment={(dept) => {
              setAdminPreviewRole(dept);
              const targetSpec = DEPARTMENT_ROLE_SPECS[dept];
              setActiveTab(targetSpec?.primaryTab || 'departments');
            }}
            initialTab={adminInitialTab}
            selectedFormBuilderDept={selectedFormBuilderDept}
            onNavigateToPortal={() => setActiveTab('portal')}
          />
        )}
      </main>

      {/* New Session Creation Modal */}
      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onStartSession={handleStartSession}
      />

      {/* Marketing Survey Dispatcher Modal */}
      <MarketingSurveyDispatcherModal
        isOpen={isDispatcherModalOpen}
        onClose={() => setIsDispatcherModalOpen(false)}
      />

      {/* General Manager WhatsApp Team Invite Modal */}
      {effectiveRole && effectiveRole !== 'admin' && (
        <DepartmentTeamInviteModal
          isOpen={isTeamInviteModalOpen}
          onClose={() => setIsTeamInviteModalOpen(false)}
          department={effectiveRole}
        />
      )}

      {/* Request Form Change Modal (Sent to Super Admin) */}
      <RequestFormChangeModal
        isOpen={isChangeRequestModalOpen}
        onClose={() => setIsChangeRequestModalOpen(false)}
        department={currentRole || 'operations'}
        onSubmitRequest={(newReq) => setChangeRequests(prev => [newReq, ...prev])}
      />

      {/* Landowner Survey Inspection Request Form & Applications Modal (Exclusively for Marketing) */}
      <LandownerSurveyApplicationModal
        isOpen={isLandownerModalOpen}
        onClose={() => setIsLandownerModalOpen(false)}
        applications={landownerApps}
        onAddApplication={(newApp) => setLandownerApps(prev => [newApp, ...prev])}
        onUpdateApplicationStatus={(id, status, score) => {
          setLandownerApps(prev => prev.map(a => a.id === id ? { ...a, status, marketingEvaluationScore: score ?? a.marketingEvaluationScore } : a));
        }}
        onDispatchSurveyor={(app) => {
          setIsLandownerModalOpen(false);
          setIsDispatcherModalOpen(true);
        }}
        onOpenClientSurveyPortal={(app) => {
          setClientPortalTargetApp(app || null);
          setIsLandownerModalOpen(false);
          setIsClientPortalOpen(true);
        }}
        currentRole={effectiveRole || 'marketing'}
      />

      {/* Footer / System status */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CargasNgvLogo size="sm" showText={true} subtitle="الشركة المصرية الدولية لتكنولوجيا الغاز • CARGAS" />
          </div>
          <div className="text-center md:text-left flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-3 text-slate-300 font-medium">
              <span>الخط الساخن: <strong className="font-mono text-emerald-400">{settings.general.hotline || '19544'}</strong></span>
              <span>•</span>
              <span>طوارئ الغاز: <strong className="font-mono text-rose-400">{settings.general.emergencyHotline || '129'}</strong></span>
              <span>•</span>
              <span>واتساب: <strong className="font-mono text-green-400">{settings.general.whatsappNumber || '+201019544000'}</strong></span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              فئات الرصد: ملاكي • أجرة ميكروباص • أجرة تاكسي • سوزوكي فان • بيجو ستيشن
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
