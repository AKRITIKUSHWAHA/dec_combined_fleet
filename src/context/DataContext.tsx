import React, { createContext, useContext, useState } from 'react';
import { 
  Vehicle, 
  DriverPAProfile, 
  Booking, 
  VehicleDefect, 
  DailyCheck, 
  SystemNotification,
  JobStatus,
  PendingSyncItem,
  JobOffer,
  DispatchMessage,
  DriverDutyState,
  ChecklistVersion,
  ChecklistTemplateItem,
  WorkshopSlot,
  RequirementTemplate,
  ComplianceReminder,
  OperationalClearance
} from '../types';
import { 
  initialVehicles, 
  initialStaff, 
  initialBookings, 
  initialDefects, 
  initialDailyChecks, 
  initialNotifications,
  initialChecklistVersions,
  initialWorkshopSlots,
  initialRequirementTemplates,
  initialComplianceReminders
} from '../data/mockData';

interface DataContextType {
  vehicles: Vehicle[];
  staff: DriverPAProfile[];
  bookings: Booking[];
  defects: VehicleDefect[];
  dailyChecks: DailyCheck[];
  notifications: SystemNotification[];
  
  // Actions
  updateJobStatus: (bookingId: string, status: JobStatus) => void;
  assignBooking: (bookingId: string, driverId: string, vehicleId: string, paId?: string) => { success: boolean; error?: string };
  createBooking: (data: Omit<Booking, 'id' | 'bookingRef' | 'statusTimestamps'>) => Booking;
  cancelBooking: (bookingId: string, reason?: string) => void;
  markNoShow: (bookingId: string) => void;
  reportDefect: (defect: Omit<VehicleDefect, 'id' | 'defectRef' | 'reportedAt'>) => void;
  verifyAndReleaseVehicle: (defectId: string, verifiedBy: string) => void;
  submitDailyCheck: (check: Omit<DailyCheck, 'id' | 'checkRef' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  simulateGpsUpdates: () => void;
  simulateStaleGps: () => void;
  
  // Phase 4 Driver States & Actions
  driverDutyState: DriverDutyState;
  setDriverDutyState: (state: DriverDutyState) => void;
  jobOffer: JobOffer | null;
  triggerSimulatedOffer: () => void;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string, reason: string) => void;
  pendingSyncItems: PendingSyncItem[];
  logSyncAction: (action: string, bookingRef?: string, details?: string, isOnline?: boolean) => void;
  syncAllPendingItems: () => void;
  advanceJobFlow: (bookingId: string, isOnline?: boolean) => void;
  revertWrongTap: (bookingId: string, reason: string, isOnline?: boolean) => void;
  cancelJobWithReason: (bookingId: string, reason: string, isOnline?: boolean) => void;
  markNoShowWithReason: (bookingId: string, waitMinutes: number, reason: string, isOnline?: boolean) => void;
  dispatchMessages: DispatchMessage[];
  sendDriverMessage: (text: string) => void;
  triggerEmergencySos: (bookingRef?: string) => void;

  // Phase 5 Fleet & Workshop Exports
  checklistVersions: ChecklistVersion[];
  activeChecklist: ChecklistVersion;
  reorderChecklistItems: (items: ChecklistTemplateItem[]) => void;
  publishChecklistVersion: (version: string, author: string, items: ChecklistTemplateItem[]) => void;
  workshopSlots: WorkshopSlot[];
  addWorkshopSlot: (slot: Omit<WorkshopSlot, 'id'>) => void;
  triageDefect: (defectId: string, decision: 'stop_use' | 'garage_before_next_duty' | 'book_by_date' | 'monitor', bookByDate?: string, notes?: string) => void;
  acknowledgeGarageAction: (defectId: string) => void;
  toggleVehicleVor: (vehicleId: string, reason?: string) => void;

  // Phase 6 Workforce & Compliance
  requirementTemplates: RequirementTemplate[];
  complianceReminders: ComplianceReminder[];
  updateStaffClearance: (staffId: string, newClearance: OperationalClearance, reason: string, changedBy: string) => void;
  sendComplianceReminder: (reminderId: string) => void;
  toggleStaffActiveStatus: (staffId: string) => void;
  updateRequirementTemplate: (templateId: string, updated: Partial<RequirementTemplate>) => void;
  updateStaffProfile: (staffId: string, updated: Partial<DriverPAProfile>) => void;

  // Helper Checks
  checkVehicleAvailability: (vehicleId: string) => { isAvailable: boolean; reason?: string };
  checkDriverEligibility: (driverId: string) => { isEligible: boolean; reason?: string };
}

const initialPendingSyncList: PendingSyncItem[] = [
  {
    id: 'sync-01',
    action: 'Walkaround Check Verified: LT73 XKL',
    bookingRef: 'CHECK-2026-90',
    originalTime: '12:45:10',
    receivedTime: '12:45:12',
    status: 'synced',
    details: '0 defects found • 12/12 items checked'
  },
  {
    id: 'sync-02',
    action: 'Arrived at London Luton Airport T1',
    bookingRef: 'DEC-8924',
    originalTime: '13:10:04',
    receivedTime: '13:13:30',
    status: 'synced',
    details: 'Offline queued due to terminal basement tunnel signal drop (+3m26s sync delay)'
  }
];

const initialMessagesList: DispatchMessage[] = [
  {
    id: 'msg-1',
    sender: 'Controller (Luton Central)',
    message: 'Good afternoon Tariq. Flight BA2490 landed 8 mins ahead of schedule at LTN Terminal 1. Meet & Greet sign is ready.',
    timestamp: '13:22',
    isUrgent: false
  },
  {
    id: 'msg-2',
    sender: 'Controller (Luton Central)',
    message: 'ROAD ALERT: Heavy congestion on M1 Junction 10 spur. Recommend using A505 Airport Way via Vauxhall Way if en route.',
    timestamp: '13:35',
    isUrgent: true
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [staff, setStaff] = useState<DriverPAProfile[]>(initialStaff);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [defects, setDefects] = useState<VehicleDefect[]>(initialDefects);
  const [dailyChecks, setDailyChecks] = useState<DailyCheck[]>(initialDailyChecks);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);

  // Phase 4 Driver states
  const [driverDutyState, setDriverDutyState] = useState<DriverDutyState>('on_duty');
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [pendingSyncItems, setPendingSyncItems] = useState<PendingSyncItem[]>(initialPendingSyncList);
  const [dispatchMessages, setDispatchMessages] = useState<DispatchMessage[]>(initialMessagesList);

  // Phase 5 Fleet & Workshop states
  const [checklistVersions, setChecklistVersions] = useState<ChecklistVersion[]>(initialChecklistVersions);
  const activeChecklist = checklistVersions.find(v => v.status === 'active') || checklistVersions[0];
  const [workshopSlots, setWorkshopSlots] = useState<WorkshopSlot[]>(initialWorkshopSlots);

  // Phase 6 Workforce & Compliance states
  const [requirementTemplates, setRequirementTemplates] = useState<RequirementTemplate[]>(initialRequirementTemplates);
  const [complianceReminders, setComplianceReminders] = useState<ComplianceReminder[]>(initialComplianceReminders);

  const checkVehicleAvailability = (vehicleId: string): { isAvailable: boolean; reason?: string } => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return { isAvailable: false, reason: 'Vehicle not found.' };

    if (veh.status === 'blocked_off_road') {
      return { isAvailable: false, reason: veh.isOffRoadReason || 'Vehicle marked off-road due to safety defect.' };
    }
    if (veh.annualDvsaMot.status === 'expired') {
      return { isAvailable: false, reason: 'SAFETY GATE: Annual DVSA MOT is expired. Lawful road use blocked.' };
    }
    if (veh.councilSixMonthInspection.status === 'expired') {
      return { isAvailable: false, reason: 'SAFETY GATE: Council 6-Month Inspection test expired.' };
    }
    return { isAvailable: true };
  };

  const checkDriverEligibility = (driverId: string): { isEligible: boolean; reason?: string } => {
    const drv = staff.find(s => s.id === driverId);
    if (!drv) return { isEligible: false, reason: 'Driver not found.' };

    if (drv.operationalClearance === 'restricted') {
      return { isEligible: false, reason: drv.clearanceReason || 'Driver has restricted clearance.' };
    }
    if (drv.drivingLicence && drv.drivingLicence.dvlaStatus !== 'valid') {
      return { isEligible: false, reason: 'SAFETY GATE: DVLA Driving licence not valid/suspended.' };
    }
    return { isEligible: true };
  };

  const assignBooking = (bookingId: string, driverId: string, vehicleId: string, paId?: string) => {
    const vehCheck = checkVehicleAvailability(vehicleId);
    if (!vehCheck.isAvailable) {
      return { success: false, error: vehCheck.reason };
    }

    const drvCheck = checkDriverEligibility(driverId);
    if (!drvCheck.isEligible) {
      return { success: false, error: drvCheck.reason };
    }

    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return {
          ...bk,
          assignedDriverId: driverId,
          assignedVehicleId: vehicleId,
          assignedPAId: paId,
          status: 'allocated',
          statusTimestamps: {
            ...bk.statusTimestamps,
            allocated: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return bk;
    }));

    return { success: true };
  };

  const updateJobStatus = (bookingId: string, status: JobStatus) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        const timestamps = { ...bk.statusTimestamps };
        if (status === 'en_route') timestamps.enRoute = nowTime;
        if (status === 'arrived') timestamps.arrived = nowTime;
        if (status === 'pob') timestamps.pob = nowTime;
        if (status === 'completed') timestamps.jobClear = nowTime;
        
        return {
          ...bk,
          status,
          statusTimestamps: timestamps
        };
      }
      return bk;
    }));
  };

  const createBooking = (data: Omit<Booking, 'id' | 'bookingRef' | 'statusTimestamps'>): Booking => {
    const id = `bk-${Date.now()}`;
    const bookingRef = `DEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    const newBooking: Booking = {
      ...data,
      id,
      bookingRef,
      status: 'unallocated',
      statusTimestamps: {
        created: nowTime
      }
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send a notification to dispatch
    const nowIso = new Date().toLocaleDateString('en-GB') + ' ' + nowTime;
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'flight_delay_clash',
        title: `New Booking Created: ${bookingRef}`,
        description: `Trip scheduled for ${newBooking.scheduledTime} (${newBooking.customerName}). Allocation pending.`,
        timestamp: nowIso,
        severity: 'info',
        read: false,
        entityLink: '/office/bookings'
      },
      ...prev
    ]);

    return newBooking;
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return {
          ...bk,
          status: 'cancelled',
          statusTimestamps: {
            ...bk.statusTimestamps,
            jobClear: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return bk;
    }));
  };

  const markNoShow = (bookingId: string) => {
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return {
          ...bk,
          status: 'no_show',
          statusTimestamps: {
            ...bk.statusTimestamps,
            jobClear: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return bk;
    }));
  };

  const simulateGpsUpdates = () => {
    const nowIso = new Date().toISOString();
    setStaff(prev => prev.map(s => {
      if (s.currentLocation) {
        // Small random movement
        const deltaLat = (Math.random() - 0.5) * 0.005;
        const deltaLng = (Math.random() - 0.5) * 0.005;
        const speed = Math.floor(20 + Math.random() * 35);
        return {
          ...s,
          currentLocation: {
            ...s.currentLocation,
            lat: s.currentLocation.lat + deltaLat,
            lng: s.currentLocation.lng + deltaLng,
            speedMph: speed,
            lastUpdateIso: nowIso,
            isFresh: true
          }
        };
      }
      return s;
    }));
  };

  const simulateStaleGps = () => {
    // Set first staff location to 110s ago (>60s threshold)
    const staleIso = new Date(Date.now() - 110000).toISOString();
    setStaff(prev => prev.map((s, idx) => {
      if (idx === 0 && s.currentLocation) {
        return {
          ...s,
          currentLocation: {
            ...s.currentLocation,
            lastUpdateIso: staleIso,
            isFresh: false
          }
        };
      }
      return s;
    }));
  };

  const reportDefect = (defectData: Omit<VehicleDefect, 'id' | 'defectRef' | 'reportedAt'>) => {

    const newDefectId = `def-${Date.now()}`;
    const newDefectRef = `DEF-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newDefect: VehicleDefect = {
      ...defectData,
      id: newDefectId,
      defectRef: newDefectRef,
      reportedAt: nowIso
    };

    setDefects(prev => [newDefect, ...prev]);

    // If critical, automatically mark the vehicle as BLOCKED OFF ROAD
    if (defectData.severity === 'critical_safety') {
      setVehicles(prev => prev.map(v => {
        if (v.registration.toUpperCase() === defectData.vehicleReg.toUpperCase()) {
          return {
            ...v,
            status: 'blocked_off_road',
            isOffRoadReason: `CRITICAL SAFETY DEFECT: ${defectData.description}`,
            criticalDefectsCount: v.criticalDefectsCount + 1,
            openDefectsCount: v.openDefectsCount + 1
          };
        }
        return v;
      }));

      // Add safety notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'critical_defect',
          title: `SAFETY GATE: ${defectData.vehicleReg} Blocked Off-Road`,
          description: `Critical defect reported (${defectData.category}). Vehicle allocation blocked until verified release.`,
          timestamp: nowIso,
          severity: 'critical',
          read: false,
          entityLink: '/maintenance'
        },
        ...prev
      ]);
    }
  };

  const verifyAndReleaseVehicle = (defectId: string, verifiedBy: string) => {
    const defect = defects.find(d => d.id === defectId);
    if (!defect) return;

    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        return {
          ...d,
          status: 'verified_released',
          garageAction: {
            ...d.garageAction!,
            verifiedBy: verifiedBy
          }
        };
      }
      return d;
    }));

    // Check if any other critical defects exist on this vehicle
    const otherCritical = defects.filter(d => d.vehicleReg === defect.vehicleReg && d.id !== defectId && d.severity === 'critical_safety' && d.status !== 'verified_released');
    
    if (otherCritical.length === 0) {
      setVehicles(prev => prev.map(v => {
        if (v.registration === defect.vehicleReg) {
          return {
            ...v,
            status: 'available',
            isOffRoadReason: undefined,
            criticalDefectsCount: 0
          };
        }
        return v;
      }));
    }
  };

  const submitDailyCheck = (checkData: Omit<DailyCheck, 'id' | 'checkRef' | 'timestamp'>) => {
    const newCheck: DailyCheck = {
      ...checkData,
      id: `chk-${Date.now()}`,
      checkRef: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setDailyChecks(prev => [newCheck, ...prev]);

    // Update vehicle mileage and check status
    setVehicles(prev => prev.map(v => {
      if (v.registration.toUpperCase() === checkData.vehicleReg.toUpperCase()) {
        return {
          ...v,
          currentMileage: Math.max(v.currentMileage, checkData.odometerReading),
          todayCheckStatus: checkData.status === 'failed' ? 'failed' : 'passed'
        };
      }
      return v;
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Phase 4 Driver Methods
  const logSyncAction = (action: string, bookingRef?: string, details?: string, isOnline: boolean = true) => {
    const originalTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const receivedTime = isOnline ? originalTime : undefined;
    
    const newItem: PendingSyncItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      bookingRef,
      originalTime,
      receivedTime,
      status: isOnline ? 'synced' : 'pending',
      details
    };

    setPendingSyncItems(prev => [newItem, ...prev]);
  };

  const syncAllPendingItems = () => {
    const syncTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setPendingSyncItems(prev => prev.map(item => {
      if (item.status === 'pending') {
        return {
          ...item,
          status: 'synced',
          receivedTime: syncTime + ' (Synced)'
        };
      }
      return item;
    }));
  };

  const advanceJobFlow = (bookingId: string, isOnline: boolean = true) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        let nextStatus: JobStatus = bk.status;
        let actionLabel = '';

        if (bk.status === 'allocated') {
          nextStatus = 'en_route';
          actionLabel = `En Route to Pickup (${bk.pickupPostcode})`;
        } else if (bk.status === 'en_route') {
          nextStatus = 'arrived';
          actionLabel = `Arrived at Pickup (${bk.pickupAddress})`;
        } else if (bk.status === 'arrived') {
          nextStatus = 'pob';
          actionLabel = `Passenger On Board (${bk.customerName})`;
        } else if (bk.status === 'pob') {
          nextStatus = 'completed';
          actionLabel = `Job Clear Completed (£${bk.totalGbp.toFixed(2)})`;
        }

        logSyncAction(actionLabel, bk.bookingRef, `Transitioned from ${bk.status} to ${nextStatus}`, isOnline);

        const timestamps = { ...bk.statusTimestamps };
        if (nextStatus === 'en_route') timestamps.enRoute = nowTime;
        if (nextStatus === 'arrived') timestamps.arrived = nowTime;
        if (nextStatus === 'pob') timestamps.pob = nowTime;
        if (nextStatus === 'completed') timestamps.jobClear = nowTime;

        return {
          ...bk,
          status: nextStatus,
          statusTimestamps: timestamps
        };
      }
      return bk;
    }));
  };

  const revertWrongTap = (bookingId: string, reason: string, isOnline: boolean = true) => {
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        let prevStatus: JobStatus = bk.status;
        if (bk.status === 'arrived') prevStatus = 'en_route';
        else if (bk.status === 'pob') prevStatus = 'arrived';
        else if (bk.status === 'en_route') prevStatus = 'allocated';

        logSyncAction(
          `WRONG TAP REVERTED: ${bk.status} -> ${prevStatus}`,
          bk.bookingRef,
          `Driver reported wrong tap: "${reason}". Status safely restored in audit trail.`,
          isOnline
        );

        return {
          ...bk,
          status: prevStatus
        };
      }
      return bk;
    }));
  };

  const cancelJobWithReason = (bookingId: string, reason: string, isOnline: boolean = true) => {
    cancelBooking(bookingId, reason);
    const bk = bookings.find(b => b.id === bookingId);
    logSyncAction(
      `Job Cancelled by Driver`,
      bk?.bookingRef,
      `Reason: ${reason}`,
      isOnline
    );
  };

  const markNoShowWithReason = (bookingId: string, waitMinutes: number, reason: string, isOnline: boolean = true) => {
    markNoShow(bookingId);
    const bk = bookings.find(b => b.id === bookingId);
    logSyncAction(
      `Passenger No-Show Declared`,
      bk?.bookingRef,
      `Driver waited ${waitMinutes} mins. Reason: ${reason}. Standby fee applied.`,
      isOnline
    );
  };

  const triggerSimulatedOffer = () => {
    const unallocated = bookings.find(b => b.status === 'unallocated') || bookings[0];
    const offerBooking: Booking = unallocated ? {
      ...unallocated,
      bookingRef: `DEC-${Math.floor(2000 + Math.random() * 7000)}`,
      customerName: 'Marcus Sterling',
      customerPhone: '+44 7700 918234',
      pickupAddress: 'London Luton Airport (LTN), Terminal 1 Priority Lane',
      pickupPostcode: 'LU2 9QT',
      destinationAddress: 'The Grove Hotel, Chandlers Cross, Watford',
      destinationPostcode: 'WD3 4TG',
      totalGbp: 78.50,
      fareGbp: 70.00,
      parkingAirportFeesGbp: 8.50,
      scheduledTime: new Date(Date.now() + 25 * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'account_invoice',
      vehicleCategory: 'Executive',
      passengerCount: 2,
      luggageCount: 2,
      requiresWheelchair: false,
      requiresPA: false
    } : bookings[0];

    setJobOffer({
      id: `offer-${Date.now()}`,
      booking: offerBooking,
      secondsRemaining: 30,
      pickupEtaMinutes: 7,
      expiresAt: Date.now() + 30000
    });
  };

  const acceptOffer = (offerId: string) => {
    if (!jobOffer || jobOffer.id !== offerId) return;
    const bk = jobOffer.booking;

    // Update booking in list as allocated to current driver
    setBookings(prev => {
      const exists = prev.some(b => b.id === bk.id);
      if (exists) {
        return prev.map(b => b.id === bk.id ? { ...b, status: 'allocated', assignedDriverId: 'drv-01' } : b);
      }
      return [{ ...bk, status: 'allocated', assignedDriverId: 'drv-01' }, ...prev];
    });

    logSyncAction(`Job Offer Accepted (${bk.bookingRef})`, bk.bookingRef, `Accepted within countdown timer window`);
    setJobOffer(null);
  };

  const rejectOffer = (offerId: string, reason: string) => {
    if (!jobOffer || jobOffer.id !== offerId) return;
    const bk = jobOffer.booking;

    logSyncAction(`Job Offer Rejected (${bk.bookingRef})`, bk.bookingRef, `Driver decline reason: ${reason}`);
    
    // Send alert to dispatch
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'offline_sync',
        title: `Driver Declined Job ${bk.bookingRef}`,
        description: `Reason: ${reason}. Auto-reoffering to next closest driver.`,
        timestamp: new Date().toLocaleTimeString('en-GB'),
        severity: 'warning',
        read: false
      },
      ...prev
    ]);

    setJobOffer(null);
  };

  const sendDriverMessage = (text: string) => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const driverMsg: DispatchMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Driver',
      message: text,
      timestamp: timeNow
    };

    setDispatchMessages(prev => [...prev, driverMsg]);

    // Simulated immediate controller response
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const controllerReply: DispatchMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'Controller (Luton Central)',
        message: `Acknowledged, message received. Controller logged note on booking. Safe driving.`,
        timestamp: replyTime
      };
      setDispatchMessages(prev => [...prev, controllerReply]);
    }, 1800);
  };

  const triggerEmergencySos = (bookingRef?: string) => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logSyncAction(`🚨 EMERGENCY SOS PANIC BEACON`, bookingRef, `Emergency alert triggered by driver. Telemetry broadcasted to Police & Dispatch.`);

    setNotifications(prev => [
      {
        id: `sos-${Date.now()}`,
        type: 'critical_defect',
        title: `🚨 DRIVER EMERGENCY SOS TRIGGERED`,
        description: `Driver Tariq M. activated panic beacon in vehicle LT73 XKL. Coordinates locked: 51.8742° N, 0.4201° W.`,
        timestamp: timeNow,
        severity: 'critical',
        read: false,
        entityLink: '/office/live-map'
      },
      ...prev
    ]);
  };

  // Phase 5 Fleet & Workshop Methods
  const reorderChecklistItems = (items: ChecklistTemplateItem[]) => {
    setChecklistVersions(prev => prev.map(v => v.status === 'active' ? { ...v, items } : v));
  };

  const publishChecklistVersion = (version: string, author: string, items: ChecklistTemplateItem[]) => {
    const newVersion: ChecklistVersion = {
      version,
      status: 'active',
      publishedAt: new Date().toLocaleDateString('en-GB'),
      publishedBy: author,
      items
    };

    setChecklistVersions(prev => [
      newVersion,
      ...prev.map(v => ({ ...v, status: 'archived' as const }))
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'offline_sync',
        title: `New Daily Walkaround Checklist Published (${version})`,
        description: `Author: ${author}. Instant over-the-air deployment to driver mobile fleet devices.`,
        timestamp: new Date().toLocaleTimeString('en-GB'),
        severity: 'info',
        read: false,
        entityLink: '/office/checks'
      },
      ...prev
    ]);
  };

  const addWorkshopSlot = (slot: Omit<WorkshopSlot, 'id'>) => {
    const newSlot: WorkshopSlot = {
      ...slot,
      id: `ws-${Date.now()}`
    };
    setWorkshopSlots(prev => [...prev, newSlot]);
  };

  const triageDefect = (defectId: string, decision: 'stop_use' | 'garage_before_next_duty' | 'book_by_date' | 'monitor', bookByDate?: string, notes?: string) => {
    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        return {
          ...d,
          triageDecision: decision,
          bookByDate,
          decisionNotes: notes,
          status: decision === 'stop_use' ? 'booked_garage' : decision === 'monitor' ? 'monitored' : 'triaged'
        };
      }
      return d;
    }));

    const defect = defects.find(d => d.id === defectId);
    if (defect) {
      if (decision === 'stop_use') {
        // Enforce safety gate on vehicle
        setVehicles(prev => prev.map(v => {
          if (v.registration === defect.vehicleReg) {
            return {
              ...v,
              status: 'blocked_off_road',
              isOffRoadReason: `TRIAGE SAFETY STOP: ${defect.category} defect flagged as critical VOR.`
            };
          }
          return v;
        }));

        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            type: 'critical_defect',
            title: `SAFETY GATE: Vehicle ${defect.vehicleReg} Stopped (VOR)`,
            description: `Triage decision: Stop use immediately. Barred from dispatch until second-person sign-off.`,
            timestamp: new Date().toLocaleTimeString('en-GB'),
            severity: 'critical',
            read: false,
            entityLink: '/office/maintenance'
          },
          ...prev
        ]);
      }
    }
  };

  const acknowledgeGarageAction = (defectId: string) => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        return {
          ...d,
          acknowledgedByGarage: true,
          acknowledgedAt: timeNow,
          status: 'booked_garage'
        };
      }
      return d;
    }));
  };

  const toggleVehicleVor = (vehicleId: string, reason?: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const isBlocked = v.status === 'blocked_off_road';
        return {
          ...v,
          status: isBlocked ? 'available' : 'blocked_off_road',
          isOffRoadReason: isBlocked ? undefined : (reason || 'Manually blocked off-road by fleet controller.')
        };
      }
      return v;
    }));
  };

  // Phase 6 Workforce & Compliance Handlers
  const updateStaffClearance = (staffId: string, newClearance: OperationalClearance, reason: string, changedBy: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const auditEntry = {
          id: `cl-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          previousStatus: s.operationalClearance,
          newStatus: newClearance,
          changedBy,
          reason
        };
        const historyEntry = {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `Operational Clearance set to ${newClearance.toUpperCase()}`,
          actor: changedBy,
          details: reason,
          category: 'clearance' as const
        };

        return {
          ...s,
          operationalClearance: newClearance,
          clearanceReason: reason,
          clearanceDetails: {
            lastReviewedDate: new Date().toLocaleDateString('en-GB'),
            reviewedBy: changedBy,
            auditTrail: [auditEntry, ...(s.clearanceDetails?.auditTrail || [])]
          },
          historyTimeline: [historyEntry, ...(s.historyTimeline || [])]
        };
      }
      return s;
    }));

    if (newClearance === 'restricted') {
      const notif: SystemNotification = {
        id: `notif-${Date.now()}`,
        type: 'licence_points',
        title: `Workforce Clearance Restricted: ${staff.find(s => s.id === staffId)?.name || 'Staff Member'}`,
        description: reason,
        timestamp: 'Just now',
        severity: 'warning',
        read: false,
        entityLink: '/office/workforce'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const sendComplianceReminder = (reminderId: string) => {
    setComplianceReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        return {
          ...r,
          notificationSent: true,
          lastRemindedDate: new Date().toLocaleDateString('en-GB')
        };
      }
      return r;
    }));

    const reminder = complianceReminders.find(r => r.id === reminderId);
    if (reminder) {
      const notif: SystemNotification = {
        id: `notif-${Date.now()}`,
        type: 'licence_points',
        title: `Compliance Reminder Dispatched: ${reminder.staffName}`,
        description: `Statutory reminder dispatched for ${reminder.documentType}. Deadline due in ${reminder.daysRemaining} days.`,
        timestamp: 'Just now',
        severity: reminder.daysRemaining < 0 ? 'critical' : 'warning',
        read: false,
        entityLink: '/office/workforce'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const toggleStaffActiveStatus = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const currentStatus = s.personalDetails?.employmentStatus || 'active';
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        return {
          ...s,
          personalDetails: {
            dob: s.personalDetails?.dob || '',
            address: s.personalDetails?.address || '',
            nationalInsuranceNumber: s.personalDetails?.nationalInsuranceNumber || '',
            emergencyContact: s.personalDetails?.emergencyContact || { name: '', relation: '', phone: '' },
            startDate: s.personalDetails?.startDate || '',
            employmentStatus: newStatus
          }
        };
      }
      return s;
    }));
  };

  const updateRequirementTemplate = (templateId: string, updated: Partial<RequirementTemplate>) => {
    setRequirementTemplates(prev => prev.map(t => t.id === templateId ? { ...t, ...updated } : t));
  };

  const updateStaffProfile = (staffId: string, updated: Partial<DriverPAProfile>) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, ...updated } : s));
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      staff,
      bookings,
      defects,
      dailyChecks,
      notifications,
      updateJobStatus,
      assignBooking,
      createBooking,
      cancelBooking,
      markNoShow,
      reportDefect,
      verifyAndReleaseVehicle,
      submitDailyCheck,
      markNotificationAsRead,
      simulateGpsUpdates,
      simulateStaleGps,
      checkVehicleAvailability,
      checkDriverEligibility,

      // Phase 4 Driver Exports
      driverDutyState,
      setDriverDutyState,
      jobOffer,
      triggerSimulatedOffer,
      acceptOffer,
      rejectOffer,
      pendingSyncItems,
      logSyncAction,
      syncAllPendingItems,
      advanceJobFlow,
      revertWrongTap,
      cancelJobWithReason,
      markNoShowWithReason,
      dispatchMessages,
      sendDriverMessage,
      triggerEmergencySos,

      // Phase 5 Fleet & Workshop Exports
      checklistVersions,
      activeChecklist,
      reorderChecklistItems,
      publishChecklistVersion,
      workshopSlots,
      addWorkshopSlot,
      triageDefect,
      acknowledgeGarageAction,
      toggleVehicleVor,

      // Phase 6 Workforce & Compliance
      requirementTemplates,
      complianceReminders,
      updateStaffClearance,
      sendComplianceReminder,
      toggleStaffActiveStatus,
      updateRequirementTemplate,
      updateStaffProfile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

