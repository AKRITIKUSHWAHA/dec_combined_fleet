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

  training: {
    safeguarding: { completed: boolean; expiryDate: string };
    firstAid: { completed: boolean; expiryDate: string };
    midas: { completed: boolean; expiryDate: string; certificateNo?: string };
    pat: { completed: boolean; expiryDate: string };
    wheelchairRestraints: { completed: boolean; expiryDate: string };
  };

  safeguardingFlag?: boolean;
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

