export type LicenceCheckStatus = 'ready' | 'due_soon' | 'blocked' | 'verification_pending';

export interface LicenceEndorsement {
  code: string;
  points: number;
  date: string;
  description: string;
  expiry: string;
}

export interface LicenceCheckRecord {
  id: string;
  driverId: string;
  driverName: string;
  licenceNumber: string;
  lastCheckDate: string; // DD/MM/YYYY
  nextCheckDue: string;  // DD/MM/YYYY
  annualDeclarationDate: string;
  declarationStatus: 'valid' | 'expired' | 'due_soon';
  points: number;
  endorsements: LicenceEndorsement[];
  status: LicenceCheckStatus;
  hasChangedResult: boolean;
  changedResultNote?: string;
  lastDvlaGatewayResponse: 'pass' | 'failed' | 'pending' | 'timeout';
  dvlaAuditRef: string;
}

export interface DbsRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: 'driver' | 'pa' | 'dual_driver_pa';
  certificateReference: string; // Masked for controllers
  issueDate: string; // DD/MM/YYYY
  level: 'Enhanced with Children & Adults Barred List' | 'Standard' | 'Basic';
  updateServiceConsent: 'valid_consent' | 'consent_withdrawn' | 'renewal_required';
  latestStatus: 'no_information_recorded' | 'certificate_flagged' | 'under_review' | 'awaiting_recheck';
  nextReviewDate: string; // DD/MM/YYYY
  suitabilityDecision: 'approved_sen' | 'under_safeguarding_review' | 'restricted_non_vulnerable' | 'rejected';
  suitabilityNotes?: string; // Masked for controllers
  operationalClearance: 'cleared' | 'pending' | 'restricted'; // Visible to Controllers
}

export interface DbsAccessLogEntry {
  id: string;
  timestamp: string; // DD/MM/YYYY HH:mm
  viewerName: string;
  viewerRole: string;
  recordStaffName: string;
  action: 'VIEW_CERTIFICATE' | 'EXPORT_AUDIT' | 'SUITABILITY_UPDATE';
  reason: string;
}

export interface VehicleServiceHistoryItem {
  id: string;
  serviceDate: string; // DD/MM/YYYY
  odometerMiles: number;
  serviceType: 'minor_interim' | 'major_annual' | 'gearbox_fluid' | 'brake_fluid';
  workshopGarage: string;
  invoiceRef: string;
  technicianNotes: string;
  costGbp: number;
}

export interface VehicleServiceSchedule {
  vehicleReg: string;
  makeModel: string;
  currentOdometerMiles: number;
  lastOdometerUpdateDate: string; // DD/MM/YYYY
  isMileageStale: boolean; // e.g. > 7 days without update
  lastServiceDate: string;
  lastServiceMileage: number;
  serviceIntervalMonths: number;
  serviceIntervalMiles: number;
  nextServiceDateDue: string;
  nextServiceMileageDue: number;
  limitingFactor: 'earlier_by_date' | 'earlier_by_mileage';
  calculatedNextService: string;
  reminderMilestone: '1_month' | '14_days' | '7_days' | '1_day' | '1000_miles' | '500_miles' | 'overdue' | 'ok';
  history: VehicleServiceHistoryItem[];
}

export interface CostLedgerItem {
  id: string;
  jobId: string;
  jobRef: string;
  vehicleReg: string;
  category: 'routine_service' | 'brake_overhaul' | 'tyre_replacement' | 'mot_repairs' | 'bodywork_accident' | 'inspection';
  quoteCostGbp: number;
  approvedCostGbp: number;
  actualInvoicedCostGbp: number;
  partsCostGbp: number;
  labourCostGbp: number;
  vatAmountGbp: number;
  invoiceRef: string;
  creditNoteRef?: string;
  approvalStatus: 'pending_approval' | 'approved_controller' | 'approved_director' | 'rejected';
  approvedBy?: string;
  spendingTier: 'under_250_controller' | 'over_250_director';
  notes: string;
}

export type ExpenseCategory = 'fuel_diesel' | 'fuel_petrol' | 'ev_charging' | 'adblue' | 'parking_tolls';

export interface DriverExpenseRecord {
  id: string;
  driverId: string;
  driverName: string;
  vehicleReg: string;
  category: ExpenseCategory;
  amountGbp: number;
  litresOrKwh?: number;
  date: string; // DD/MM/YYYY HH:mm
  receiptPhotoUrl: string;
  status: 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  reviewedBy?: string;
  reviewNotes?: string;
  reimbursementBatchRef?: string;
}

export interface AccidentIncidentReport {
  id: string;
  reportRef: string;
  dateTime: string; // DD/MM/YYYY HH:mm
  driverId: string;
  driverName: string;
  vehicleReg: string;
  location: string;
  drivableStatus: 'drivable' | 'vor_towed' | 'impounded';
  policeRefCAD: string;
  thirdPartyVehicle: {
    reg: string;
    makeModel: string;
    driverName: string;
    contactPhone: string;
    insurer: string;
    policyNumber: string;
  };
  witnesses: Array<{
    name: string;
    phone: string;
    statementSummary: string;
  }>;
  photoCount: number;
  photoUrls: string[];
  injuryDetails: {
    hasInjuries: boolean;
    severity: 'none' | 'minor_first_aid' | 'hospitalised' | 'fatal';
    restrictedMedicalSummary: string; // Restricted to HR & Director only
  };
  investigationStatus: 'open_investigating' | 'awaiting_insurer' | 'closed';
}

export interface GreyFleetRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: 'driver' | 'pa' | 'escort';
  registration: string;
  makeModel: string;
  motStatus: 'valid' | 'due_soon' | 'expired';
  motExpiryDate: string; // DD/MM/YYYY
  taxStatus: 'taxed' | 'untaxed' | 'sorn';
  taxExpiryDate: string; // DD/MM/YYYY
  businessInsuranceStatus: 'verified_class_1' | 'verified_hire_reward' | 'pending_certificate' | 'expired';
  insuranceExpiryDate: string; // DD/MM/YYYY
  councilBadgeApproved: boolean;
}

export interface ReminderNotificationItem {
  id: string;
  category: 'dvsa_mot' | 'council_6m' | 'service_mileage' | 'licence_add_check' | 'dbs_review' | 'insurance_expiry';
  targetEntity: string;
  dueDeadline: string; // DD/MM/YYYY
  daysRemaining: number;
  urgency: 'critical_today' | 'urgent_7d' | 'advance_30d' | 'overdue';
  recipientRole: string;
  assignedManager: string;
  alternativeEscalationManager: string;
  state: 'queued' | 'sent' | 'failed' | 'acknowledged';
  sentAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  escalated: boolean;
  escalationReason?: string;
}

