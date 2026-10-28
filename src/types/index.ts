export type UserRole = 
  | 'owner_admin' 
  | 'controller' 
  | 'driver' 
  | 'pa' 
  | 'mechanic' 
  | 'hr_vetting';

export interface SubCompany {
  id: string;
  name: string;
  code: string;
  operatorLicence: string;
  council: 'Luton' | 'Central Bedfordshire' | 'Hertfordshire' | 'Buckinghamshire';
  phone: string;
  email: string;
  vehicleCount: number;
  driverCount: number;
}

export type OperationalClearance = 'cleared' | 'pending' | 'restricted';

export interface WorkforceAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  category: 'clearance' | 'training' | 'vetting' | 'assignment' | 'app';
}

export interface DriverPAProfile {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'pa' | 'dual_driver_pa';
  companyId: string;
  photoUrl?: string;
  assignedDepot: string;
  
  // Operational Status for Controllers
  operationalClearance: OperationalClearance;
  clearanceReason?: string;
  onDuty: boolean;
  dutyStatus: 'off_duty' | 'available' | 'on_job' | 'on_break';
  currentVehicleReg?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    heading: number;
    speedMph: number;
    lastUpdateIso: string;
    isFresh: boolean; // false if older than 60s
  };

  // Personal Details
  personalDetails?: {
    dob: string;
    address: string;
    nationalInsuranceNumber: string; // Restricted / redacted for Controller!
    emergencyContact: {
      name: string;
      relation: string;
      phone: string;
    };
    startDate: string;
    employmentStatus: 'active' | 'inactive' | 'suspended' | 'on_leave';
  };

  // Driver Specific Credentials (Only shown if role is driver/dual)
  drivingLicence?: {
    licenceNumber: string;
    categories: string[];
    photocardExpiry: string; // DD/MM/YYYY
    penaltyPoints: number;
    endorsementsCount: number;
    dvlaLastCheckDate: string;
    dvlaStatus: 'valid' | 'revoked' | 'disqualified';
  };
  taxiBadge?: {
    badgeNumber: string;
    council: string;
    expiryDate: string; // DD/MM/YYYY
  };
  medicalReviewDate?: string;

  // Passenger Assistant Specific Credentials (No driving licence required!)
  paAuthorisation?: {
    authorisationId: string;
    councilApproval: string;
    expiryDate: string;
    pairedSchoolRouteId?: string;
  };

  // Restricted Sensitive Data (HIDDEN from Controllers! Accessible ONLY to HR/Admin)
  dbsCheck?: {
    certificateNumber: string; // Redacted for non-HR
    issueDate: string;
    updateServiceRegistered: boolean;
    lastCheckedDate: string;
    statusResult: 'no_content' | 'reviewed_suitable' | 'requires_decision';
    suitabilityDecision: 'cleared_for_unsupervised_child_work' | 'restricted_adult_only' | 'pending';
    confidentialNotes?: string;
  };
  rightToWork?: {
    shareCode: string;
    status: 'verified_indefinite' | 'time_limited' | 'pending';
    expiryDate?: string;
    verifiedAt: string;
  };

  training: {
    safeguarding: { completed: boolean; expiryDate: string; certNumber?: string };
    firstAid: { completed: boolean; expiryDate: string; certNumber?: string };
    midas: { completed: boolean; expiryDate: string; certificateNo?: string };
    pat: { completed: boolean; expiryDate: string; certNumber?: string };
    wheelchairRestraints: { completed: boolean; expiryDate: string; certNumber?: string };
  };

  safeguardingFlag?: boolean;

  // Assignments & Availability
  assignments?: {
    contractedHoursWeekly: number;
    assignedDefaultVehicleReg?: string;
    regularSchoolRoute?: string;
    preferredShift: 'Morning Peak (AM)' | 'Afternoon Peak (PM)' | 'Full Day Split' | 'Airport Night Shift';
    workingDays: string[];
  };

  // App & Device Acknowledgements
  appDetails?: {
    deviceModel: string;
    osVersion: string;
    appVersion: string;
    lastLoginTimestamp: string;
    pushEnabled: boolean;
    policySignoffs: Array<{
      id: string;
      policyName: string;
      version: string;
      signedAt: string;
    }>;
    offlineSyncStatus: {
      lastSyncTime: string;
      pendingDrafts: number;
      syncHealth: 'healthy' | 'lagging' | 'offline';
    };
  };

  // Operational Clearance Audit Details
  clearanceDetails?: {
    lastReviewedDate: string;
    reviewedBy: string;
    auditTrail: Array<{
      id: string;
      timestamp: string;
      previousStatus: OperationalClearance;
      newStatus: OperationalClearance;
      changedBy: string;
      reason: string;
    }>;
  };

  // History Timeline
  historyTimeline?: WorkforceAuditEntry[];
}

export interface RequirementTemplate {
  id: string;
  roleType: 'driver' | 'pa' | 'dual_driver_pa';
  title: string;
  councilScope: string;
  description: string;
  mandatoryDocuments: Array<{
    code: string;
    label: string;
    renewalCycleMonths: number;
    hardBlockOnExpiry: boolean; // if true, blocks dispatch allocation
    category: 'licence' | 'vetting' | 'training' | 'medical';
  }>;
}

export interface ComplianceReminder {
  id: string;
  staffId: string;
  staffName: string;
  role: 'driver' | 'pa' | 'dual_driver_pa';
  documentType: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'critical_urgent' | 'due_soon' | 'expired' | 'acknowledged';
  notificationSent: boolean;
  lastRemindedDate?: string;
}

export interface Vehicle {
  id: string;
  registration: string; // e.g. "LT24 KLP"
  vin: string;
  make: string;
  model: string;
  year: number;
  seatingCapacity: number;
  wheelchairCapacity: number;
  hasRampOrLift: boolean;
  fuelType: 'Diesel' | 'Electric (EV)' | 'Hybrid' | 'Petrol';
  vehicleCategory?: 'Saloon' | 'Executive' | 'MPV' | 'Wheelchair Accessible (WAV)' | 'Minibus';
  currentMileage: number;
  companyId: string;
  depot: string;
  assignedDriverId?: string;
  
  // Status
  status: 'available' | 'allocated' | 'in_garage' | 'blocked_off_road';
  isOffRoadReason?: string;

  // Two INDEPENDENT deadlines (Requirement VEH-02)
  annualDvsaMot: {
    expiryDate: string; // DD/MM/YYYY
    status: 'valid' | 'due_soon' | 'expired';
    lastTestDate: string;
    advisoriesCount: number;
  };
  councilSixMonthInspection: {
    dueDate: string; // DD/MM/YYYY
    council: string;
    designatedDepotRequired: boolean; // Central Bedfordshire 2026 rule
    status: 'valid' | 'due_soon' | 'expired';
  };

  // Insurance & Council Plate (Phase 5)
  insurancePolicy?: {
    policyNumber: string;
    provider: string;
    expiryDate: string;
    status: 'valid' | 'due_soon' | 'expired';
  };
  councilPlate?: {
    plateNumber: string;
    issuingCouncil: string;
    expiryDate: string;
    status: 'valid' | 'due_soon' | 'expired';
  };

  // Maintenance & Service
  lastServiceDate: string;
  nextServiceDueDate: string;
  nextServiceDueMileage: number;
  openDefectsCount: number;
  criticalDefectsCount: number;
  todayCheckStatus: 'passed' | 'failed' | 'missing' | 'not_scheduled';
}

export type JobStatus = 
  | 'unallocated' 
  | 'allocated' 
  | 'en_route' 
  | 'arrived' 
  | 'pob' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "DEC-8924"
  companyId: string;
  customerName: string;
  customerPhone: string;
  passengerCount: number;
  luggageCount: number;
  pickupAddress: string;
  pickupPostcode: string;
  destinationAddress: string;
  destinationPostcode: string;
  scheduledTime: string; // ISO / UK format
  vehicleCategory: 'Saloon' | 'Executive' | 'MPV' | 'Wheelchair Accessible (WAV)' | 'Minibus';
  requiresWheelchair: boolean;
  requiresPA: boolean;

  // Allocation
  assignedDriverId?: string;
  assignedVehicleId?: string;
  assignedPAId?: string;

  // Lifecycle & Tracking
  status: JobStatus;
  statusTimestamps: {
    created: string;
    allocated?: string;
    enRoute?: string;
    arrived?: string;
    pob?: string;
    jobClear?: string;
  };
  
  // Special Workflows
  isAirportRun?: boolean;
  flightDetails?: {
    flightNumber: string;
    airline: string;
    terminal: string;
    scheduledLanding: string;
    estimatedLanding: string;
    flightStatus: 'On Time' | 'Delayed' | 'Landed' | 'Unknown';
    meetAndGreetName?: string;
  };

  isSchoolRun?: boolean;
  schoolRunDetails?: {
    routeNumber: string;
    contractName: string;
    schoolName: string;
    amOrPm: 'AM' | 'PM';
    sweepCompleted: boolean;
    sweepTimestamp?: string;
  };

  // Pricing (GBP £)
  fareGbp: number;
  parkingAirportFeesGbp: number;
  waitingChargeGbp: number;
  totalGbp: number;
  paymentStatus: 'unpaid' | 'paid_card' | 'paid_cash' | 'account_invoice' | 'refunded';
}

export interface VehicleDefect {
  id: string;
  defectRef: string; // "DEF-104"
  vehicleReg: string;
  reportedByStaffId: string;
  reportedByName: string;
  reportedAt: string;
  severity: 'minor' | 'critical_safety';
  category: 'Brakes' | 'Tyres/Wheels' | 'Lights' | 'Steering' | 'Glass/Mirrors' | 'Ramp/Lift' | 'Bodywork' | 'Fluids';
  description: string;
  photoUrl?: string;
  status: 'reported' | 'triaged' | 'booked_garage' | 'inspected_repaired' | 'verified_released' | 'monitored';
  triageDecision?: 'stop_use' | 'garage_before_next_duty' | 'book_by_date' | 'monitor';
  bookByDate?: string;
  decisionNotes?: string;
  acknowledgedByGarage?: boolean;
  acknowledgedAt?: string;
  garageAction?: {
    garageName: string;
    appointmentDate: string;
    downtimeStart: string;
    downtimeEnd: string;
    costEstimateGbp: number;
    finalCostGbp?: number;
    invoiceRef?: string;
    repairedBy?: string;
    verifiedBy?: string;
  };
}

export interface ChecklistTemplateItem {
  id: string;
  label: string;
  category: 'exterior' | 'mechanical' | 'safety' | 'accessibility';
  requiresPhotoOnFail: boolean;
  wavOnly?: boolean;
}

export interface ChecklistVersion {
  version: string;
  status: 'active' | 'archived' | 'draft';
  publishedAt: string;
  publishedBy: string;
  items: ChecklistTemplateItem[];
}

export interface WorkshopSlot {
  id: string;
  vehicleReg: string;
  bayNumber: number;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "13:00"
  repairType: string;
  technician: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  defectRef?: string;
}

export interface DailyCheck {
  id: string;
  checkRef: string;
  vehicleReg: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  odometerReading: number;
  itemsChecked: number;
  failuresCount: number;
  status: 'passed' | 'failed' | 'offline_synced';
  sweepSignoff?: boolean;
  paSignature?: string;
}

export interface SystemNotification {
  id: string;
  type: 'mot_due' | 'inspection_due' | 'critical_defect' | 'licence_points' | 'flight_delay_clash' | 'offline_sync';
  title: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
  entityLink?: string;
}

export interface PendingSyncItem {
  id: string;
  action: string;
  bookingRef?: string;
  originalTime: string; // client timestamp e.g. "14:22:15"
  receivedTime?: string; // dispatch server timestamp e.g. "14:25:30" or undefined when pending
  status: 'pending' | 'synced';
  details?: string;
}

export interface JobOffer {
  id: string;
  booking: Booking;
  secondsRemaining: number;
  pickupEtaMinutes: number;
  expiresAt: number;
}

export interface DispatchMessage {
  id: string;
  sender: 'Controller (Luton Central)' | 'Driver' | 'System';
  message: string;
  timestamp: string;
  isUrgent?: boolean;
}

export type DriverDutyState = 'on_duty' | 'on_break' | 'off_duty';

// ============================================================================
// PHASE 7: SCHOOL ROUTES, ACCOUNTS & REPORTS
// ============================================================================

export interface Pupil {
  id: string;
  name: string;
  age: number;
  pickupAddress: string;
  dropoffAddress: string;
  specialNeeds: string;
  emergencyContact: { name: string; relation: string; phone: string };
  wheelchairUser: boolean;
  medicalAlert?: string;
  attendanceStatus: 'scheduled' | 'boarded' | 'handed_over' | 'absent';
  absenceReason?: string;
  pickupTimestamp?: string;
  dropoffTimestamp?: string;
  handoverPerson?: string;
}

export interface SchoolRoute {
  id: string;
  routeCode: string; // e.g. "CBC-SCH-01"
  contractRef: string; // e.g. "CBC-SEN-2025-44B"
  contractCouncil: 'Central Bedfordshire' | 'Luton' | 'Hertfordshire';
  schoolName: string;
  amOrPm: 'AM' | 'PM';
  scheduledStartTime: string; // "07:45"
  scheduledEndTime: string; // "09:00"
  
  // Team Allocation: Driver + Vehicle + up to 2 PAs!
  assignedDriverId: string;
  assignedDriverName: string;
  assignedVehicleReg: string;
  assignedPA1Id: string;
  assignedPA1Name: string;
  assignedPA2Id?: string; // Optional 2nd PA
  assignedPA2Name?: string;

  pupils: Pupil[];
  status: 'scheduled' | 'in_progress' | 'pupils_dropped' | 'sweep_pending_pa' | 'completed';
  
  // End of run sweep and PA countersignature
  sweepDetails?: {
    driverCompleted: boolean;
    driverTimestamp?: string;
    paCountersigned: boolean;
    paSignatureName?: string;
    paTimestamp?: string;
    sweepNotes?: string;
    driverFreedForDuties: boolean; // Driver cannot become available until this is true!
  };
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceGbp: number;
  totalGbp: number;
}

export interface AccountInvoice {
  id: string;
  invoiceRef: string; // e.g. "INV-2026-1049"
  clientName: string;
  clientType: 'council_contract' | 'corporate_account' | 'private_customer';
  councilOrCompany: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceLineItem[];
  subtotalGbp: number;
  vatGbp: number;
  totalGbp: number;
  paymentMethod?: string;
  paidAt?: string;
}

export interface DriverSettlement {
  id: string;
  driverId: string;
  driverName: string;
  vehicleReg: string;
  period: string; // "20 Oct 2026 - 27 Oct 2026"
  completedJobsCount: number;
  grossFaresGbp: number;
  commissionRatePercent: number; // e.g. 20%
  operatorCommissionGbp: number;
  airportTollReimbursementsGbp: number;
  fuelAllowanceGbp: number;
  netPayoutGbp: number;
  status: 'pending_settlement' | 'paid_disbursed';
  disbursedAt?: string;
  referenceNumber: string;
}

export interface ReportFilterCriteria {
  reportType: 'fleet_compliance' | 'workforce_audit' | 'school_transport' | 'dispatch_sla' | 'finance_summary';
  dateRange: 'today' | 'last_7_days' | 'month_to_date' | 'custom';
  startDate?: string;
  endDate?: string;
  companyId: string;
  depot: string;
}

export * from './auth';
export * from './phase9';
export * from './phase10';
