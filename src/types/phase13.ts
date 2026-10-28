// Phase 13 Types: Enhancements Suite
// 1. Bidding / Busy-Zone Map
// 2. Destination Mode
// 3. CarPlay-style Large-Control Driver Screen
// 4. Contactless / Split Payment Screen
// 5. Optional Passenger Location Sharing with Non-Sharing Option

export type DemandIntensity = 'surge_critical' | 'high_demand' | 'moderate' | 'steady';

export interface BusyZoneSurge {
  id: string;
  name: string;
  zoneCode: string;
  postcode: string;
  surgeMultiplier: number; // e.g. 1.5x
  demandIntensity: DemandIntensity;
  activeDriversInZone: number;
  unassignedPassengerCount: number;
  avgWaitTimeMinutes: number;
  surgeReason: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  validUntil: string;
}

export type TenderStatus = 'bidding_open' | 'bid_awarded' | 'expired';

export interface JobBidTender {
  id: string;
  tenderRef: string;
  pickupAddress: string;
  pickupPostcode: string;
  destinationAddress: string;
  destinationPostcode: string;
  distanceMiles: number;
  estDurationMinutes: number;
  vehicleCategory: 'Executive E-Class' | 'Standard Saloon' | '8-Seater Minibus' | 'WAV Accessible';
  pickupTime: string;
  baseFareGbp: number;
  guideBidGbp: number;
  currentLowestBidGbp?: number;
  bidsCount: number;
  secondsRemaining: number;
  status: TenderStatus;
  flightNumber?: string;
  notes?: string;
  mySubmittedBidGbp?: number;
}

export interface DestinationModeConfig {
  isEnabled: boolean;
  destinationAddress: string;
  destinationPostcode: string;
  targetArrivalTime: string; // e.g. "18:45"
  maxDetourMinutes: number; // e.g. 10
  corridorAngleDegrees: number; // e.g. 25
  activeFiltersCount: number;
  filteredJobsTodayCount: number;
  distanceToDestinationMiles: number;
  statusText: string;
}

export type SplitPaymentMethod = 'contactless_nfc' | 'apple_pay' | 'google_pay' | 'chip_pin' | 'cash';

export type SplitPaymentStatus = 'paid' | 'pending' | 'processing' | 'declined';

export interface SplitPaymentPassenger {
  id: string;
  passengerIndex: number;
  name: string;
  allocatedAmountGbp: number;
  paymentMethod: SplitPaymentMethod;
  status: SplitPaymentStatus;
  authCode?: string;
  receiptRecipient?: string; // phone or email
  receiptSent: boolean;
  timestamp?: string;
}

export interface SplitPaymentSession {
  bookingRef: string;
  pickup: string;
  destination: string;
  totalFareGbp: number;
  passengerCount: number;
  splitMode: 'equal' | 'custom';
  passengers: SplitPaymentPassenger[];
  terminalStatus: 'ready' | 'card_presented' | 'authorising' | 'approved' | 'declined';
  tipGbp: number;
  grandTotalGbp: number;
  allPaid: boolean;
}

export type PassengerLocationMode = 'precise_live_gps' | 'privacy_fixed_pin';

export interface PassengerLocationPrivacySetting {
  mode: PassengerLocationMode;
  explanation: string;
  accuracyRadiusMeters: number;
  allowDriverWalkingGuidance: boolean;
  autoExpireOnDropoff: boolean;
  gdprCompliantNotice: string;
  updatedAt: string;
}

export interface CarPlayNavState {
  currentMph: number;
  speedLimitMph: number;
  nextInstruction: string;
  distanceToTurnMeters: number;
  turnDirection: 'left' | 'right' | 'straight' | 'roundabout_2nd' | 'destination';
  currentStreet: string;
  nextStreet: string;
  estimatedArrival: string;
  remainingMinutes: number;
  isVoiceMuted: boolean;
  isHighContrastMode: boolean;
}

