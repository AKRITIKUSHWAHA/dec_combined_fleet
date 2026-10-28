// Phase 9 Specialized Types
import { UserRole } from './index';

export type PaymentStatus = 'paid' | 'part-paid' | 'unpaid' | 'failed' | 'refunded';

export interface AirportFlightBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  passengerCount: number;
  luggageCount: number;
  vehicleCategory: 'Saloon' | 'Executive' | 'MPV' | 'Wheelchair Accessible (WAV)' | 'Minibus';
  
  // Flight Specifics
  airport: string; // e.g. "London Luton (LTN)", "London Heathrow (LHR)"
  terminal: string; // e.g. "Terminal 2", "Terminal 5"
  flightNumber: string; // e.g. "BA 2490", "EK 029"
  airline: string;
  scheduledLanding: string; // e.g. "14:15"
  actualLanding: string; // e.g. "15:40"
  flightStatus: 'On Time' | 'Delayed' | 'Landed' | 'Diverted';
  flightDelayMinutes: number;
  
  // Timings & Buffer
  landingBufferMinutes: number; // e.g. 30, 45, 60
  agreedCollectionTime: string; // Calculated: actualLanding + landingBufferMinutes (e.g. "16:25")
  
  // Clash Detection
  hasClashWithSchoolRun: boolean;
  clashDetails?: {
    schoolRouteId: string;
    schoolRouteName: string;
    driverId: string;
    driverName: string;
    schoolRunStartTime: string;
    clashOverlapMinutes: number;
  };

  // Meet & Greet Nameboard
  meetAndGreet: {
    enabled: boolean;
    nameboardText: string;
    meetPoint: string;
    contactPhone: string;
  };

  // Return Journey Pairing
  hasLinkedReturn: boolean;
  linkedReturnRef?: string;
  returnPickupTime?: string;
  
  // Chauffeur Hourly / Day Options
  chauffeurDetails?: {
    bookingType: 'by_journey' | 'hourly' | 'daily';
    contractedHours?: number; // e.g. 4h, 8h, 10h
    includedMileage: number; // e.g. 50, 100
    overtimeRatePerHour: number; // £45.00
    excessMileageRate: number; // £2.50
  };

  fareGbp: number;
  totalGbp: number;
  paymentStatus: PaymentStatus;
  status: 'unallocated' | 'allocated' | 'en_route' | 'arrived' | 'pob' | 'completed' | 'cancelled' | 'no_show';
  assignedDriverId?: string;
  assignedDriverName?: string;
}

export interface TariffRule {
  id: string;
  name: string;
  companyId: string;
  vehicleCategory: string;
  baseDropFareGbp: number;
  includedMiles: number; // miles included in base drop
  perMileRateGbp: number;
  minimumFareGbp: number;
  waitingChargePerMinuteGbp: number;
  waitingFreeBufferMinutes: number;
  extraStopChargeGbp: number;
  airportDropFeeGbp: number;
  meetAndGreetFeeGbp: number;
  nightSurchargeMultiplier: number;
  bankHolidayMultiplier: number;
  version: string;
  effectiveFrom: string;
  status: 'active' | 'draft' | 'archived';
}

export interface FixedRouteTariff {
  id: string;
  routeName: string;
  fromLocation: string;
  toLocation: string;
  fromPostcodeArea: string;
  toPostcodeArea: string;
  vehicleCategory: string;
  fixedPassengerPriceGbp: number;
  driverPayoutGbp: number;
  companyCommissionGbp: number;
}

export interface CorporateAccount {
  id: string;
  accountName: string;
  accountCode: string; // e.g. "CORP-ASTRA-01"
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  billingAddress: string;
  creditLimitGbp: number;
  currentBalanceGbp: number;
  poNumberMandatory: boolean;
  costCentres: string[]; // e.g. ["CC-EXEC-101", "CC-LEGAL-204", "CC-RND-301"]
  paymentTermsDays: number; // e.g. 30
  status: 'active' | 'on_hold' | 'credit_warning';
  discountPercent: number;
}

export interface InvoiceItem {
  id: string;
  bookingRef: string;
  journeyDate: string;
  passengerName: string;
  routeDescription: string;
  poNumber?: string;
  costCentre?: string;
  fareGbp: number;
  extrasGbp: number;
  vatGbp: number;
  totalGbp: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0891"
  accountId: string;
  accountName: string;
  accountCode: string;
  billingPeriod: string; // e.g. "October 2026 (Week 4)"
  issueDate: string;
  dueDate: string;
  subtotalGbp: number;
  vatAmountGbp: number;
  totalDueGbp: number;
  paymentStatus: 'paid' | 'unpaid' | 'overdue' | 'part_paid';
  items: InvoiceItem[];
  creditNotes?: Array<{
    creditNoteRef: string;
    amountGbp: number;
    reason: string;
    issueDate: string;
  }>;
}

export interface DriverWeeklySettlement {
  driverId: string;
  driverName: string;
  staffId: string;
  vehicleReg: string;
  weekEndingDate: string; // e.g. "25/10/2026"
  completedJobsCount: number;
  grossFaresGbp: number;
  operatorCommissionPercent: number; // 20%
  operatorCommissionGbp: number;
  vehicleRentWeeklyGbp: number; // £120.00
  cashFaresCollectedByDriverGbp: number; // Deducted from payout
  fuelOrChargesAllowanceGbp: number;
  netBankTransferPayoutGbp: number;
  paymentStatus: 'pending_approval' | 'authorized_for_transfer' | 'settled';
}

export interface RecurringBookingTemplate {
  id: string;
  templateName: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  pickupPostcode: string;
  destinationAddress: string;
  destinationPostcode: string;
  vehicleCategory: string;
  scheduledTime: string;
  recurringPattern: 'Monday to Friday' | 'Weekly Saturday' | 'Daily Split (AM/PM)' | 'Bi-Weekly';
  contractClient?: string;
  fixedFareGbp: number;
  active: boolean;
  nextScheduledDate: string;
}

export interface LostPropertyItem {
  id: string;
  reference: string; // e.g. "LP-2026-104"
  dateFound: string;
  timeFound: string;
  vehicleReg: string;
  driverFinderName: string;
  category: 'Electronics' | 'Luggage & Bags' | 'Clothing / Coats' | 'Wallet / Cards' | 'Keys / Personal';
  itemTitle: string;
  description: string;
  locationInVehicle: 'Rear Row Seat' | 'Boot Compartment' | 'Door Pocket' | 'Floor Well';
  passengerClaimStatus: 'unclaimed' | 'contacted_passenger' | 'verified_for_pickup' | 'returned_closed';
  matchedBookingRef?: string;
  claimantName?: string;
  returnedDate?: string;
}

export interface CustomerComplaint {
  id: string;
  complaintRef: string; // e.g. "CMP-2026-052"
  bookingRef: string;
  complainantName: string;
  customerPhone: string;
  driverName?: string;
  vehicleReg?: string;
  category: 'Late Arrival / Delay' | 'Driver Conduct / Courtesy' | 'Vehicle Cleanliness / Smell' | 'Fare Dispute' | 'Dangerous Driving / Speeding';
  severity: 'minor' | 'moderate' | 'critical_safety';
  loggedDate: string;
  slaDeadline: string; // 48h / 72h
  incidentSummary: string;
  investigationStatus: 'open' | 'under_investigation' | 'driver_interviewed' | 'resolved_closed';
  resolutionNotes?: string;
  councilNotified: boolean;
}

export interface DispatchChatMessage {
  id: string;
  senderType: 'office' | 'driver' | 'pa';
  senderName: string;
  recipientStaffId: string;
  recipientStaffName: string;
  text: string;
  timestamp: string;
  deliveryStatus: 'queued' | 'sent' | 'delivered' | 'failed';
  isBroadcast?: boolean;
}

export interface AutoDispatchZone {
  id: string;
  name: string;
  code: string;
  radiusMiles: number;
  defaultBufferMinutes: number;
  isAirportQueueZone: boolean;
  activeDriversInZone: number;
}

export interface AutoDispatchQueueItem {
  driverId: string;
  driverName: string;
  vehicleReg: string;
  vehicleTier: string;
  queuePosition: number;
  checkInTime: string;
  waitingMinutes: number;
}

export interface AutoDispatchConfig {
  autoDispatchActive: boolean;
  offerDeadlineSeconds: number; // e.g. 25 seconds
  maxRadiusMiles: number; // e.g. 6 miles
  maxConsecutiveRejections: number; // e.g. 3
  rejectionCooldownMinutes: number;
  escalationStrategy: 'alert_controller_desk' | 'auto_reassign_next' | 'broadcast_available';
  vehicleMatchingMode: 'strict_class_only' | 'allow_free_upgrade_saloon_to_exec';
  manualOverridesTodayCount: number;
}

export interface ManualDispatchOverrideLog {
  id: string;
  timestamp: string;
  bookingRef: string;
  suggestedDriverName: string;
  assignedDriverName: string;
  controllerName: string;
  mandatoryReason: string;
}
