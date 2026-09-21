import {
  DepartmentRole,
  MonitoringSession,
  FormChangeRequest,
  StationExecutionData,
  ExecutionWorkItem
} from '../types';
import { createDefaultStationExecutionData } from './executionDefaults';

export interface PendingFormChangeRequestItem {
  id: string;
  department: DepartmentRole;
  departmentName: string;
  requesterName: string;
  requestType: FormChangeRequest['requestType'];
  fieldLabel: string;
  fieldType?: string;
  fieldKey?: string;
  justification: string;
  proposedSection?: string;
  submittedAt: string;
  hoursPending: number;
  formattedElapsed: string;
  isOver48Hours: boolean;
  status: 'pending';
}

export interface OverdueStationMilestoneItem {
  sessionId: string;
  sessionCode: string;
  stationTitle: string;
  locationName: string;
  governorate?: string;
  milestoneId: string;
  milestoneTitle: string;
  category: string;
  departmentName: string;
  targetDepartments: DepartmentRole[];
  assignedEngineer: string;
  contractorName?: string;
  targetEndDate: string;
  progressPercent: number;
  status: ExecutionWorkItem['status'];
  hoursOverdue: number;
  formattedOverdue: string;
  isOver48Hours: boolean;
  isDailyLogOverdue: boolean;
  lastUpdateDate?: string;
  reason: string;
  notes?: string;
}

export interface DepartmentTaskNotificationsSummary {
  department: DepartmentRole;
  pendingRequests: PendingFormChangeRequestItem[];
  overdueMilestones: OverdueStationMilestoneItem[];
  urgentPendingRequestsCount: number;
  urgentMilestonesCount: number;
  totalUrgentCount: number;
  hasUrgentItems: boolean;
}

/**
 * Robustly parses various date formats (ISO, space-separated datetime, or YYYY-MM-DD)
 */
export function parseDateSafe(dateStr?: string): number {
  if (!dateStr) return 0;
  // Normalize string: e.g. "2026-09-17 11:30" -> "2026-09-17T11:30:00"
  let cleanStr = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(cleanStr)) {
    cleanStr = cleanStr.replace(/\s+/, 'T') + ':00';
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
    cleanStr = `${cleanStr}T23:59:59`;
  }
  const timestamp = new Date(cleanStr).getTime();
  return isNaN(timestamp) ? 0 : timestamp;
}

/**
 * Format elapsed hours into friendly Arabic text
 */
export function formatHoursDurationArabic(hours: number): string {
  if (hours <= 0) return 'الآن';
  if (hours < 24) return `${hours} ساعة`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) {
    return days === 1 ? 'يوم واحد' : days === 2 ? 'يومان' : `${days} أيام`;
  }
  return `${days} ${days <= 10 ? 'أيام' : 'يوم'} و ${remainingHours} س (${hours} ساعة)`;
}

/**
 * Maps work item categories & titles to relevant department roles
 */
export function getDepartmentsForWorkItem(item: ExecutionWorkItem): DepartmentRole[] {
  const roles: Set<DepartmentRole> = new Set();
  const cat = (item.category || '').toLowerCase();
  const deptName = (item.departmentName || '').toLowerCase();
  const title = (item.title || '').toLowerCase();

  // Category based matching
  if (cat === 'civil') {
    roles.add('projects');
  } else if (cat === 'equipment') {
    roles.add('operations');
    roles.add('technical');
  } else if (cat === 'hse') {
    roles.add('hse');
  } else if (cat === 'licensing') {
    roles.add('licensing');
    roles.add('legal');
  } else if (cat === 'legal') {
    roles.add('legal');
    roles.add('licensing');
  } else if (cat === 'financial') {
    roles.add('financial');
  } else if (cat === 'automation' || cat === 'piping') {
    roles.add('technical');
    roles.add('operations');
  }

  // Name / keyword based matching
  if (deptName.includes('مشروعات') || title.includes('خرسان') || title.includes('مظلة') || title.includes('حفر')) {
    roles.add('projects');
  }
  if (deptName.includes('تشغيل') || title.includes('ضاغط') || title.includes('موزع') || title.includes('اسطوان')) {
    roles.add('operations');
  }
  if (deptName.includes('سلامة') || deptName.includes('hse') || title.includes('حريق') || title.includes('صد') || title.includes('أمان')) {
    roles.add('hse');
  }
  if (deptName.includes('غاز') || deptName.includes('شبك') || title.includes('خط الغاز') || title.includes('مواسير') || title.includes('drs')) {
    roles.add('technical');
  }
  if (deptName.includes('ترخيص') || deptName.includes('موافق') || title.includes('رخصة') || title.includes('حي') || title.includes('تصريح')) {
    roles.add('licensing');
  }
  if (deptName.includes('قانون') || title.includes('عقد') || title.includes('شهر عقاري')) {
    roles.add('legal');
  }
  if (deptName.includes('مالي') || title.includes('مستخلص') || title.includes('دفعة') || title.includes('صرف')) {
    roles.add('financial');
  }
  if (deptName.includes('تسويق') || title.includes('حصر') || title.includes('مرور')) {
    roles.add('marketing');
  }

  return Array.from(roles);
}

/**
 * Calculates the comprehensive task notifications summary for a department
 */
export function getDepartmentTaskNotificationsSummary(
  department: DepartmentRole,
  sessions: MonitoringSession[],
  changeRequests: FormChangeRequest[],
  referenceDate: Date = new Date('2026-09-21T12:00:00') // Defaults to current system date 2026-09-21
): DepartmentTaskNotificationsSummary {
  const nowMs = referenceDate.getTime();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

  // 1. Pending FormChangeRequests for this department
  const pendingRequests: PendingFormChangeRequestItem[] = [];
  changeRequests.forEach(req => {
    if (req.status === 'pending' && req.department === department) {
      const submittedMs = parseDateSafe(req.submittedAt);
      const diffMs = Math.max(0, nowMs - submittedMs);
      const hoursPending = Math.round(diffMs / (1000 * 60 * 60));
      const isOver48Hours = diffMs >= FORTY_EIGHT_HOURS_MS;

      pendingRequests.push({
        id: req.id,
        department: req.department,
        departmentName: req.departmentName,
        requesterName: req.requesterName,
        requestType: req.requestType,
        fieldLabel: req.fieldLabel,
        fieldType: req.fieldType,
        fieldKey: req.fieldKey,
        justification: req.justification,
        proposedSection: req.proposedSection,
        submittedAt: req.submittedAt,
        hoursPending,
        formattedElapsed: formatHoursDurationArabic(hoursPending),
        isOver48Hours,
        status: 'pending'
      });
    }
  });

  // Sort pending requests by hours elapsed descending (oldest pending first)
  pendingRequests.sort((a, b) => b.hoursPending - a.hoursPending);

  // 2. Overdue station milestones (> 48 hours)
  const overdueMilestones: OverdueStationMilestoneItem[] = [];

  sessions.forEach(session => {
    const executionData: StationExecutionData = session.executionData ||
      createDefaultStationExecutionData(session.title, session.departmentReviews?.financial?.financialAudit?.totalCapexAudited || 38500000);

    // Latest daily site log check
    let latestLogDate: string | undefined;
    let latestLogMs = 0;
    if (executionData.dailyLogs && executionData.dailyLogs.length > 0) {
      executionData.dailyLogs.forEach(log => {
        const logMs = parseDateSafe(log.date);
        if (logMs > latestLogMs) {
          latestLogMs = logMs;
          latestLogDate = log.date;
        }
      });
    }

    const hoursSinceLastLog = latestLogMs > 0 ? Math.round((nowMs - latestLogMs) / (1000 * 60 * 60)) : 999;
    const isStationLogOverdue = hoursSinceLastLog >= 48;

    // Evaluate work items for this department
    executionData.workItems.forEach(item => {
      // Completed items are not overdue
      if (item.status === 'completed') return;

      const targetDepts = getDepartmentsForWorkItem(item);
      const isRelevantToDepartment = targetDepts.includes(department);

      if (!isRelevantToDepartment) return;

      const targetMs = parseDateSafe(item.targetEndDate);
      const isPastTarget = targetMs > 0 && targetMs < nowMs;
      const hoursPastTarget = isPastTarget ? Math.round((nowMs - targetMs) / (1000 * 60 * 60)) : 0;
      const isTargetOverdue48h = hoursPastTarget >= 48;
      const isStatusDelayed = item.status === 'delayed';

      // Check if item has not had an update for > 48h
      const isNoUpdate48h = (isStationLogOverdue && (item.status === 'in_progress' || item.status === 'delayed')) || isTargetOverdue48h;

      if (isTargetOverdue48h || isStatusDelayed || isNoUpdate48h) {
        let reason = '';
        let hoursOverdue = 0;

        if (isTargetOverdue48h) {
          hoursOverdue = hoursPastTarget;
          reason = `تجاوز الموعد المستهدف للتسليم بـ ${formatHoursDurationArabic(hoursPastTarget)}`;
        } else if (isStatusDelayed) {
          hoursOverdue = Math.max(hoursPastTarget, hoursSinceLastLog > 0 && hoursSinceLastLog < 500 ? hoursSinceLastLog : 48);
          reason = item.notes ? item.notes : 'المرحلة مصنفة كمتأخرة عن الجدول الزمني وتتطلب تحديث الموقف';
        } else if (isStationLogOverdue) {
          hoursOverdue = hoursSinceLastLog;
          reason = `لم يتم تسجيل أي تقرير يومي للموقع منذ ${formatHoursDurationArabic(hoursSinceLastLog)}`;
        }

        overdueMilestones.push({
          sessionId: session.id,
          sessionCode: session.code || 'CNG-STATION',
          stationTitle: session.title,
          locationName: session.locationName,
          governorate: session.governorate,
          milestoneId: item.id,
          milestoneTitle: item.title,
          category: item.category,
          departmentName: item.departmentName,
          targetDepartments: targetDepts,
          assignedEngineer: item.assignedEngineer,
          contractorName: item.contractorName,
          targetEndDate: item.targetEndDate,
          progressPercent: item.progressPercent,
          status: item.status,
          hoursOverdue,
          formattedOverdue: formatHoursDurationArabic(hoursOverdue),
          isOver48Hours: hoursOverdue >= 48 || isTargetOverdue48h || isStatusDelayed,
          isDailyLogOverdue: isStationLogOverdue,
          lastUpdateDate: latestLogDate,
          reason,
          notes: item.notes
        });
      }
    });
  });

  // Sort overdue milestones by hours overdue descending
  overdueMilestones.sort((a, b) => b.hoursOverdue - a.hoursOverdue);

  const urgentPendingRequestsCount = pendingRequests.filter(r => r.isOver48Hours).length;
  const urgentMilestonesCount = overdueMilestones.filter(m => m.isOver48Hours).length;
  const totalUrgentCount = urgentPendingRequestsCount + urgentMilestonesCount;

  return {
    department,
    pendingRequests,
    overdueMilestones,
    urgentPendingRequestsCount,
    urgentMilestonesCount,
    totalUrgentCount,
    hasUrgentItems: totalUrgentCount > 0
  };
}
