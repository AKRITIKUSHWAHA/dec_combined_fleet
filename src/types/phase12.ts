export type CustomerBookingState = 'draft_quote' | 'request_received' | 'confirmed';

export interface AccessibilityOptions {
  wheelchairRequired: boolean;
  rampRequired: boolean;
  lowStepVehicle: boolean;
  assistanceDog: boolean;
  hearingLoop: boolean;
  driverAssistanceNeeded: boolean;
  additionalNotes?: string;
}

export interface CustomerFlightDetails {
  airline: string;
  flightNumber: string;
  airport: string;
  terminal: string;
  landingTime: string;
  landingBufferMinutes: number;
  meetAndGreet: boolean;
  nameboardText: string;
}

export interface QuoteInclusion {
  title: string;
  included: boolean;
  detail: string;
}

export interface CustomerBookingRecord {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  pickupPostcode: string;
  destinationAddress: string;
  destinationPostcode: string;
  dateTime: string;
  vehicleCategory: 'Saloon' | 'Executive Chauffeur' | 'WAV Wheelchair Accessible' | 'Minibus 8-Seater';
  passengerCount: number;
  luggageCount: number;
  accessibility: AccessibilityOptions;
  flightDetails?: CustomerFlightDetails;
  inclusions: QuoteInclusion[];
  quoteGbp: number;
  state: CustomerBookingState;
  paymentMethod: 'card_online' | 'pay_on_completion' | 'corporate_account';
  corporatePoNumber?: string;
  corporateCostCentre?: string;
  trackingLinkUrl: string;
  createdAt: string;
}

export interface CustomerTrackingData {
  bookingRef: string;
  customerName: string;
  status: 'allocated' | 'en_route' | 'arrived' | 'pob' | 'completed';
  isLinkExpired: boolean;
  linkExpiryNotice: string;
  driverFirstName: string;
  vehicleMakeModel: string;
  vehicleReg: string;
  vehicleColor: string;
  pickupAddress: string;
  destinationAddress: string;
  currentEtaMinutes: number;
  distanceRemainingMiles: number;
  liveStatusText: string;
}

export interface CorporateCostCentre {
  id: string;
  code: string;
  name: string;
  department: string;
  monthlyBudgetGbp: number;
  currentSpendGbp: number;
  activeBookingsCount: number;
}

export interface ParentChildJourney {
  studentId: string;
  childFirstName: string;
  schoolName: string;
  routeRef: string;
  driverFirstName: string;
  paFirstName: string;
  journeyType: 'morning_run' | 'afternoon_run';
  status: 'waiting_for_pickup' | 'collected_onboard' | 'in_transit' | 'safely_arrived' | 'handed_over';
  etaTimestamp: string;
  minutesRemaining: number;
  lastCheckpoint: string;
  escortContactNumber: string;
  // Safeguarding: NO other students' data exposed
}

export interface TermCalendarItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'term_time' | 'half_term' | 'inset_day' | 'bank_holiday';
  schoolAffected: string;
}

export interface StudentAbsenceRecord {
  id: string;
  studentId: string;
  studentName: string;
  routeRef: string;
  absenceDate: string;
  reason: 'medical_illness' | 'hospital_appointment' | 'authorized_leave';
  reportedBy: string;
  reportedAt: string;
  status: 'route_updated_skipped';
}

export interface ReplacementStaffCandidate {
  id: string;
  name: string;
  role: 'driver' | 'pa';
  phone: string;
  dbsStatus: 'cleared_enhanced' | 'pending' | 'restricted';
  councilBadgeValid: boolean;
  safeguardingCertified: boolean;
  eligibleForSen: boolean;
  ineligibilityReason?: string;
}

export interface FailedHandoverCase {
  id: string;
  caseRef: string;
  studentName: string;
  routeRef: string;
  dropoffAddress: string;
  timestamp: string;
  parentContactPhone: string;
  stage: 'attempted_contact' | 'controller_alerted' | 'safe_depot_transit' | 'resolved';
  designatedSafeHoldingPoint: string;
  controllerLog: string;
}

