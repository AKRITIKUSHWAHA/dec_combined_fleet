import {
  BusyZoneSurge,
  JobBidTender,
  DestinationModeConfig,
  SplitPaymentSession,
  PassengerLocationPrivacySetting,
  CarPlayNavState
} from '../types/phase13';

export const initialBusyZones: BusyZoneSurge[] = [
  {
    id: 'zone-ltn-1',
    name: 'Luton Airport Terminal & Drop-off',
    zoneCode: 'LTN-T1',
    postcode: 'LU2 9QT',
    surgeMultiplier: 1.5,
    demandIntensity: 'surge_critical',
    activeDriversInZone: 4,
    unassignedPassengerCount: 14,
    avgWaitTimeMinutes: 4,
    surgeReason: 'Evening holiday flight wave: 7 European arrivals in next 35 mins. High executive demand.',
    coordinates: { lat: 51.8763, lng: -0.3717 },
    validUntil: '19:30'
  },
  {
    id: 'zone-bfd-1',
    name: 'Bedford Railway Station & Interchange',
    zoneCode: 'BFD-STN',
    postcode: 'MK40 1AS',
    surgeMultiplier: 1.3,
    demandIntensity: 'high_demand',
    activeDriversInZone: 3,
    unassignedPassengerCount: 8,
    avgWaitTimeMinutes: 6,
    surgeReason: 'Thameslink & EMR commuter wave arriving from London St Pancras. Queue exceeding rank capacity.',
    coordinates: { lat: 52.1368, lng: -0.4789 },
    validUntil: '19:15'
  },
  {
    id: 'zone-mk-1',
    name: 'Milton Keynes Hub & Central Station',
    zoneCode: 'MK-HUB',
    postcode: 'MK9 1LA',
    surgeMultiplier: 1.4,
    demandIntensity: 'surge_critical',
    activeDriversInZone: 2,
    unassignedPassengerCount: 11,
    avgWaitTimeMinutes: 5,
    surgeReason: 'Avanti West Coast mainline delay clearance + Arena MK corporate conference discharge.',
    coordinates: { lat: 52.0345, lng: -0.7745 },
    validUntil: '19:45'
  },
  {
    id: 'zone-dun-1',
    name: 'Dunstable High Street & Quadrant',
    zoneCode: 'DUN-CTR',
    postcode: 'LU6 1BS',
    surgeMultiplier: 1.2,
    demandIntensity: 'moderate',
    activeDriversInZone: 5,
    unassignedPassengerCount: 4,
    avgWaitTimeMinutes: 3,
    surgeReason: 'Grove Theatre event discharge & local evening leisure trade.',
    coordinates: { lat: 51.8860, lng: -0.5215 },
    validUntil: '20:00'
  },
  {
    id: 'zone-crn-1',
    name: 'Cranfield University & Aerospace Tech Park',
    zoneCode: 'CRN-TECH',
    postcode: 'MK43 0AL',
    surgeMultiplier: 1.3,
    demandIntensity: 'high_demand',
    activeDriversInZone: 2,
    unassignedPassengerCount: 6,
    avgWaitTimeMinutes: 7,
    surgeReason: 'Clean Aviation symposium hotel transfers to Woburn & Bedford executive accommodations.',
    coordinates: { lat: 52.0722, lng: -0.6278 },
    validUntil: '19:00'
  }
];

export const initialJobBidTenders: JobBidTender[] = [
  {
    id: 'tender-101',
    tenderRef: 'TND-2026-881',
    pickupAddress: 'Luton Airport Terminal 1 Express Priority',
    pickupPostcode: 'LU2 9QT',
    destinationAddress: 'Cambridge Science Park, Milton Rd, Cambridge',
    destinationPostcode: 'CB4 0GF',
    distanceMiles: 41.2,
    estDurationMinutes: 52,
    vehicleCategory: 'Executive E-Class',
    pickupTime: '18:30 (Today)',
    baseFareGbp: 95.0,
    guideBidGbp: 112.0,
    currentLowestBidGbp: 104.0,
    bidsCount: 3,
    secondsRemaining: 54,
    status: 'bidding_open',
    flightNumber: 'EZY2144 (Milan Malpensa)',
    notes: 'Meet & greet with tablet nameboard at arrival barrier. Premium executive booking.'
  },
  {
    id: 'tender-102',
    tenderRef: 'TND-2026-882',
    pickupAddress: 'Bedford High St (Opposite Swan Hotel)',
    pickupPostcode: 'MK40 1AR',
    destinationAddress: 'London Heathrow Airport Terminal 5 Chauffeur Lane',
    destinationPostcode: 'TW6 2GA',
    distanceMiles: 58.6,
    estDurationMinutes: 70,
    vehicleCategory: 'Standard Saloon',
    pickupTime: '19:15 (Today)',
    baseFareGbp: 115.0,
    guideBidGbp: 130.0,
    currentLowestBidGbp: 122.5,
    bidsCount: 5,
    secondsRemaining: 92,
    status: 'bidding_open',
    flightNumber: 'BA028 (Departing to Hong Kong)',
    notes: '2 large suitcases + 2 cabin bags. Strict non-smoking vehicle requested.'
  },
  {
    id: 'tender-103',
    tenderRef: 'TND-2026-883',
    pickupAddress: 'Milton Keynes Central Station Forecourt',
    pickupPostcode: 'MK9 1LA',
    destinationAddress: 'The Sculpture Gallery, Woburn Abbey Estate',
    destinationPostcode: 'MK17 9WA',
    distanceMiles: 12.8,
    estDurationMinutes: 22,
    vehicleCategory: '8-Seater Minibus',
    pickupTime: '18:45 (Today)',
    baseFareGbp: 52.0,
    guideBidGbp: 64.0,
    currentLowestBidGbp: 58.0,
    bidsCount: 2,
    secondsRemaining: 118,
    status: 'bidding_open',
    notes: 'Corporate dinner party of 6 delegates. Return journey booked separately for 22:30.'
  },
  {
    id: 'tender-104',
    tenderRef: 'TND-2026-880',
    pickupAddress: 'Cranfield Innovation Centre, MK43 0BT',
    pickupPostcode: 'MK43 0BT',
    destinationAddress: 'London St Pancras International Eurostar',
    destinationPostcode: 'N1C 4QL',
    distanceMiles: 52.4,
    estDurationMinutes: 68,
    vehicleCategory: 'Executive E-Class',
    pickupTime: '17:45 (Completed)',
    baseFareGbp: 138.0,
    guideBidGbp: 150.0,
    currentLowestBidGbp: 142.0,
    bidsCount: 6,
    secondsRemaining: 0,
    status: 'bid_awarded',
    notes: 'Awarded to Driver Tariq Hussain (Mercedes E300e BD24 TYU).'
  }
];

export const initialDestinationModeConfig: DestinationModeConfig = {
  isEnabled: false,
  destinationAddress: '42 Goldington Road, Bedford',
  destinationPostcode: 'MK40 3EA',
  targetArrivalTime: '19:15',
  maxDetourMinutes: 10,
  corridorAngleDegrees: 25,
  activeFiltersCount: 3,
  filteredJobsTodayCount: 5,
  distanceToDestinationMiles: 14.2,
  statusText: 'Filter mode paused. Toggle on to only accept jobs along your route to Bedford.'
};

export const initialSplitPaymentSession: SplitPaymentSession = {
  bookingRef: 'DEC-SPLIT-9921',
  pickup: 'Luton Airport Terminal 1',
  destination: 'The Swan Hotel, The Embankment, Bedford',
  totalFareGbp: 56.0,
  passengerCount: 4,
  splitMode: 'equal',
  passengers: [
    {
      id: 'pax-1',
      passengerIndex: 1,
      name: 'Liam Henderson (Lead)',
      allocatedAmountGbp: 14.0,
      paymentMethod: 'apple_pay',
      status: 'paid',
      authCode: 'AUTH-9428-AP',
      receiptRecipient: '07700 900122',
      receiptSent: true,
      timestamp: '18:02'
    },
    {
      id: 'pax-2',
      passengerIndex: 2,
      name: 'Marcus Vance',
      allocatedAmountGbp: 14.0,
      paymentMethod: 'contactless_nfc',
      status: 'paid',
      authCode: 'AUTH-9429-NFC',
      receiptRecipient: 'marcus.v@acme-corp.co.uk',
      receiptSent: true,
      timestamp: '18:03'
    },
    {
      id: 'pax-3',
      passengerIndex: 3,
      name: 'Sophie Chen',
      allocatedAmountGbp: 14.0,
      paymentMethod: 'chip_pin',
      status: 'pending',
      receiptRecipient: '07700 900551',
      receiptSent: false
    },
    {
      id: 'pax-4',
      passengerIndex: 4,
      name: 'Oliver James',
      allocatedAmountGbp: 14.0,
      paymentMethod: 'google_pay',
      status: 'pending',
      receiptRecipient: 'oliver.j@cloudnet.co.uk',
      receiptSent: false
    }
  ],
  terminalStatus: 'ready',
  tipGbp: 4.0,
  grandTotalGbp: 60.0,
  allPaid: false
};

export const initialPassengerLocationPrivacy: PassengerLocationPrivacySetting = {
  mode: 'precise_live_gps',
  explanation: 'Share real-time GPS telemetry with driver during pickup window for precision kerbside navigation.',
  accuracyRadiusMeters: 5,
  allowDriverWalkingGuidance: true,
  autoExpireOnDropoff: true,
  gdprCompliantNotice: 'Location telemetry is end-to-end encrypted and completely erased immediately when your trip reaches "Completed" status. Never shared with third parties.',
  updatedAt: '2026-10-28 17:45'
};

export const initialCarPlayNavState: CarPlayNavState = {
  currentMph: 28,
  speedLimitMph: 30,
  nextInstruction: 'In 180m Turn Left onto A505 Dunstable Road',
  distanceToTurnMeters: 180,
  turnDirection: 'left',
  currentStreet: 'Airport Way',
  nextStreet: 'A505 Dunstable Road',
  estimatedArrival: '18:14',
  remainingMinutes: 12,
  isVoiceMuted: false,
  isHighContrastMode: true
};

