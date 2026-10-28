import {
  CustomerBookingRecord,
  CustomerTrackingData,
  CorporateCostCentre,
  ParentChildJourney,
  TermCalendarItem,
  StudentAbsenceRecord,
  ReplacementStaffCandidate,
  FailedHandoverCase
} from '../types/phase12';

export const mockCustomerBookings: CustomerBookingRecord[] = [
  {
    id: 'CBK-001',
    bookingRef: 'DEC-BK-8841',
    customerName: 'Dr. Alistair Finch',
    customerEmail: 'a.finch@biotech-innovations.co.uk',
    customerPhone: '07700 900543',
    pickupAddress: 'Luton Airport Parkway Station, Parkway Road',
    pickupPostcode: 'LU1 3JW',
    destinationAddress: 'London Heathrow Airport Terminal 5',
    destinationPostcode: 'TW6 2GA',
    dateTime: '29/10/2026 09:30',
    vehicleCategory: 'Executive Chauffeur',
    passengerCount: 2,
    luggageCount: 2,
    accessibility: {
      wheelchairRequired: false,
      rampRequired: false,
      lowStepVehicle: false,
      assistanceDog: false,
      hearingLoop: true,
      driverAssistanceNeeded: true,
      additionalNotes: 'Passenger has slight hearing impairment; please communicate clearly at meet-and-greet.'
    },
    flightDetails: {
      airline: 'British Airways',
      flightNumber: 'BA1482',
      airport: 'London Heathrow (LHR)',
      terminal: 'Terminal 5',
      landingTime: '09:00',
      landingBufferMinutes: 45,
      meetAndGreet: true,
      nameboardText: 'Dr. Alistair Finch / AstraZeneca'
    },
    inclusions: [
      { title: 'Flight Delay Buffer', included: true, detail: '45 mins complimentary waiting time after verified actual landing' },
      { title: 'Meet & Greet Service', included: true, detail: 'Driver waiting inside arrivals hall with personalised nameboard' },
      { title: 'Airport Terminal Barrier Fees', included: true, detail: 'Heathrow T5 barrier drop-off/pick-up charge (£6.50) fully covered' },
      { title: 'Bottled Mineral Water & Wi-Fi', included: true, detail: 'Executive chauffeur vehicle amenities included' },
      { title: 'Live GPS Tracking Link', included: true, detail: 'Direct SMS link with live driver ETA and vehicle position' }
    ],
    quoteGbp: 115.00,
    state: 'confirmed',
    paymentMethod: 'card_online',
    trackingLinkUrl: '/track/DEC-BK-8841',
    createdAt: '28/10/2026 14:10'
  },
  {
    id: 'CBK-002',
    bookingRef: 'DEC-BK-8842',
    customerName: 'Harriet Walker',
    customerEmail: 'harriet.walker@gmail.com',
    customerPhone: '07700 900821',
    pickupAddress: '18 West Street, Dunstable',
    pickupPostcode: 'LU6 1TA',
    destinationAddress: 'Luton & Dunstable University Hospital, Lewsey Road',
    destinationPostcode: 'LU4 0DZ',
    dateTime: '30/10/2026 11:15',
    vehicleCategory: 'WAV Wheelchair Accessible',
    passengerCount: 1,
    luggageCount: 1,
    accessibility: {
      wheelchairRequired: true,
      rampRequired: true,
      lowStepVehicle: true,
      assistanceDog: false,
      hearingLoop: false,
      driverAssistanceNeeded: true,
      additionalNotes: 'Requires manual wheelchair ramp loading with 4-point floor tie-downs.'
    },
    inclusions: [
      { title: 'Certified WAV Vehicle', included: true, detail: 'Low-gradient ramp and approved 4-point inertia reel straps' },
      { title: 'Driver Passenger Assistance', included: true, detail: 'Trained passenger escort to hospital reception' },
      { title: 'Door-to-Door Service', included: true, detail: 'Assistance from inside residence to clinic lobby' }
    ],
    quoteGbp: 28.50,
    state: 'request_received',
    paymentMethod: 'pay_on_completion',
    trackingLinkUrl: '/track/DEC-BK-8842',
    createdAt: '28/10/2026 16:45'
  },
  {
    id: 'CBK-003',
    bookingRef: 'DEC-BK-8830',
    customerName: 'Amazon Logistics UK Ltd',
    customerEmail: 'dispatch@amazon-luton.co.uk',
    customerPhone: '01582 898000',
    pickupAddress: 'Amazon Fulfillment Centre LTN1, Boundary Way, Hemel Hempstead',
    pickupPostcode: 'HP2 7EQ',
    destinationAddress: 'London Luton Airport Terminal',
    destinationPostcode: 'LU2 9LY',
    dateTime: '27/10/2026 15:00',
    vehicleCategory: 'Minibus 8-Seater',
    passengerCount: 6,
    luggageCount: 8,
    accessibility: {
      wheelchairRequired: false,
      rampRequired: false,
      lowStepVehicle: false,
      assistanceDog: false,
      hearingLoop: false,
      driverAssistanceNeeded: false
    },
    inclusions: [
      { title: 'High-Capacity Luggage Bay', included: true, detail: 'Dedicated rear luggage cage for 8 large transit cases' },
      { title: 'Direct Corporate Invoicing', included: true, detail: 'Billed to Amazon Net-30 master account (PO: AMZ-UK-9912)' }
    ],
    quoteGbp: 75.00,
    state: 'confirmed',
    paymentMethod: 'corporate_account',
    corporatePoNumber: 'AMZ-UK-9912',
    corporateCostCentre: 'SUPPLY-CHAIN-OPS',
    trackingLinkUrl: '/track/DEC-BK-8830',
    createdAt: '27/10/2026 09:15'
  }
];

export const mockCustomerTrackingData: CustomerTrackingData = {
  bookingRef: 'DEC-BK-8841',
  customerName: 'Dr. Alistair Finch',
  status: 'en_route',
  isLinkExpired: false,
  linkExpiryNotice: 'This tracking link remains active during your journey and automatically invalidates 60 minutes after drop-off for privacy.',
  driverFirstName: 'Tariq',
  vehicleMakeModel: 'Mercedes-Benz V-Class Chauffeur',
  vehicleReg: 'KU23 EWX',
  vehicleColor: 'Obsidian Black',
  pickupAddress: 'Luton Airport Parkway Station, Parkway Road, LU1 3JW',
  destinationAddress: 'Heathrow Airport Terminal 5, TW6 2GA',
  currentEtaMinutes: 8,
  distanceRemainingMiles: 2.4,
  liveStatusText: 'Driver Tariq is 2.4 miles away, navigating A505 towards Parkway Station.'
};

export const mockExpiredTrackingData: CustomerTrackingData = {
  bookingRef: 'DEC-BK-8799',
  customerName: 'Harriet Walker',
  status: 'completed',
  isLinkExpired: true,
  linkExpiryNotice: 'SECURITY NOTICE: This tracking session expired on 28/10/2026 at 14:00 (60 minutes post-completion). Live telematics are terminated.',
  driverFirstName: 'Tariq',
  vehicleMakeModel: 'Mercedes-Benz V-Class',
  vehicleReg: 'KU23 EWX',
  vehicleColor: 'Obsidian Black',
  pickupAddress: '18 West Street, Dunstable',
  destinationAddress: 'Luton Hospital, LU4 0DZ',
  currentEtaMinutes: 0,
  distanceRemainingMiles: 0,
  liveStatusText: 'Journey concluded. Tracking session closed.'
};

export const mockCorporateCostCentres: CorporateCostCentre[] = [
  {
    id: 'CC-01',
    code: 'AZ-ONCOLOGY-RD',
    name: 'Oncology Research & Trials',
    department: 'Clinical Operations',
    monthlyBudgetGbp: 10000,
    currentSpendGbp: 5380,
    activeBookingsCount: 14
  },
  {
    id: 'CC-02',
    code: 'AZ-EXEC-GLOBAL',
    name: 'Global Executive Board Transport',
    department: 'Executive Office',
    monthlyBudgetGbp: 12000,
    currentSpendGbp: 8200,
    activeBookingsCount: 19
  },
  {
    id: 'CC-03',
    code: 'AZ-LUTON-FACILITIES',
    name: 'Manufacturing & Depot Logistics',
    department: 'Supply Chain',
    monthlyBudgetGbp: 5000,
    currentSpendGbp: 1420,
    activeBookingsCount: 5
  }
];

export const mockParentChildJourney: ParentChildJourney = {
  studentId: 'STU-CHILTERN-01',
  childFirstName: 'Liam',
  schoolName: 'Chiltern Special School, Dunstable',
  routeRef: 'SEN-ROUTE-04B',
  driverFirstName: 'Tariq',
  paFirstName: 'Elena',
  journeyType: 'morning_run',
  status: 'in_transit',
  etaTimestamp: '08:42',
  minutesRemaining: 11,
  lastCheckpoint: 'Passed Houghton Regis Green at 08:31',
  escortContactNumber: '07700 900981'
};

export const mockTermCalendar: TermCalendarItem[] = [
  {
    id: 'TRM-01',
    name: 'Autumn Term 1',
    startDate: '02/09/2026',
    endDate: '23/10/2026',
    type: 'term_time',
    schoolAffected: 'All Central Beds & Luton Schools'
  },
  {
    id: 'TRM-02',
    name: 'October Half Term Holiday',
    startDate: '26/10/2026',
    endDate: '30/10/2026',
    type: 'half_term',
    schoolAffected: 'All Council SEN Routes Suspended'
  },
  {
    id: 'TRM-03',
    name: 'Autumn Term 2',
    startDate: '02/11/2026',
    endDate: '18/12/2026',
    type: 'term_time',
    schoolAffected: 'All Central Beds & Luton Schools'
  },
  {
    id: 'TRM-04',
    name: 'Staff Training Inset Day',
    startDate: '04/11/2026',
    endDate: '04/11/2026',
    type: 'inset_day',
    schoolAffected: 'Chiltern Special School (SEN-04B Suspended for Day)'
  }
];

export const mockStudentAbsences: StudentAbsenceRecord[] = [
  {
    id: 'ABS-01',
    studentId: 'STU-CHILTERN-02',
    studentName: 'Maya Patel',
    routeRef: 'SEN-ROUTE-04B',
    absenceDate: '28/10/2026',
    reason: 'hospital_appointment',
    reportedBy: 'Mrs. Sunita Patel (Mother)',
    reportedAt: '27/10/2026 19:40',
    status: 'route_updated_skipped'
  },
  {
    id: 'ABS-02',
    studentId: 'STU-CHILTERN-05',
    studentName: 'Joshua Taylor',
    routeRef: 'SEN-ROUTE-02A',
    absenceDate: '28/10/2026',
    reason: 'medical_illness',
    reportedBy: 'Central Beds SEN Transport Team',
    reportedAt: '28/10/2026 07:15',
    status: 'route_updated_skipped'
  }
];

export const mockReplacementStaffCandidates: ReplacementStaffCandidate[] = [
  {
    id: 'STAFF-REP-01',
    name: 'Sarah Jenkins',
    role: 'driver',
    phone: '07700 900112',
    dbsStatus: 'cleared_enhanced',
    councilBadgeValid: true,
    safeguardingCertified: true,
    eligibleForSen: true
  },
  {
    id: 'STAFF-REP-02',
    name: 'Marcus Thorne',
    role: 'driver',
    phone: '07700 900334',
    dbsStatus: 'pending',
    councilBadgeValid: true,
    safeguardingCertified: true,
    eligibleForSen: false,
    ineligibilityReason: 'BLOCKED: 6 penalty points on driving licence & DBS consent renewal required. Disqualified from school transport.'
  },
  {
    id: 'STAFF-REP-03',
    name: 'Chloe Bennett',
    role: 'pa',
    phone: '07700 900556',
    dbsStatus: 'cleared_enhanced',
    councilBadgeValid: true,
    safeguardingCertified: true,
    eligibleForSen: true
  },
  {
    id: 'STAFF-REP-04',
    name: 'David Miller',
    role: 'pa',
    phone: '07700 900778',
    dbsStatus: 'cleared_enhanced',
    councilBadgeValid: false,
    safeguardingCertified: true,
    eligibleForSen: false,
    ineligibilityReason: 'BLOCKED: Council Escort Badge expired on 15/10/2026. Cannot attend vulnerable children without badge.'
  }
];

export const mockFailedHandoverCases: FailedHandoverCase[] = [
  {
    id: 'FHO-01',
    caseRef: 'FHO-2026-001',
    studentName: 'Liam Davies',
    routeRef: 'SEN-ROUTE-04B',
    dropoffAddress: '14 Hill Rise, Dunstable, LU6 3RT',
    timestamp: '27/10/2026 15:45',
    parentContactPhone: '07700 900129',
    stage: 'resolved',
    designatedSafeHoldingPoint: 'Dunstable Depot Safe Room / Chiltern School Office',
    controllerLog: 'Driver knocked and called primary contact with no answer. Controller contacted secondary guardian (Grandmother) who arrived at residence within 8 minutes. Handover completed safely.'
  }
];

