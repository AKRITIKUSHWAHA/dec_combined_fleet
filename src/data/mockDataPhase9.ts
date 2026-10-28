import {
  AirportFlightBooking,
  TariffRule,
  FixedRouteTariff,
  CorporateAccount,
  InvoiceRecord,
  DriverWeeklySettlement,
  RecurringBookingTemplate,
  LostPropertyItem,
  CustomerComplaint,
  DispatchChatMessage,
  AutoDispatchZone,
  AutoDispatchQueueItem,
  AutoDispatchConfig,
  ManualDispatchOverrideLog
} from '../types/phase9';

export const mockAirportBookings: AirportFlightBooking[] = [
  {
    id: 'air-01',
    bookingRef: 'DEC-LTN-2026-904',
    customerName: 'Marcus Sterling',
    customerPhone: '+44 7700 900881',
    passengerCount: 2,
    luggageCount: 3,
    vehicleCategory: 'Executive',
    airport: 'London Luton (LTN)',
    terminal: 'Main Terminal VIP Arrivals',
    flightNumber: 'BA 2490',
    airline: 'British Airways',
    scheduledLanding: '14:15',
    actualLanding: '15:40',
    flightStatus: 'Delayed',
    flightDelayMinutes: 85,
    landingBufferMinutes: 45,
    agreedCollectionTime: '16:25', // 15:40 + 45 min buffer
    hasClashWithSchoolRun: true,
    clashDetails: {
      schoolRouteId: 'CBC-SEN-ROUTE-01',
      schoolRouteName: 'The Chiltern School SEN Afternoon Run',
      driverId: 'drv-01',
      driverName: 'Tariq Mahmood',
      schoolRunStartTime: '15:30',
      clashOverlapMinutes: 55
    },
    meetAndGreet: {
      enabled: true,
      nameboardText: 'MR M. STERLING / APEX HOLDINGS',
      meetPoint: 'Costa Coffee Arrivals Gate B',
      contactPhone: '+44 7700 900881'
    },
    hasLinkedReturn: true,
    linkedReturnRef: 'DEC-LTN-2026-904-RET',
    returnPickupTime: '31/10/2026 09:30',
    chauffeurDetails: {
      bookingType: 'by_journey',
      includedMileage: 40,
      overtimeRatePerHour: 45.0,
      excessMileageRate: 2.5
    },
    fareGbp: 125.0,
    totalGbp: 145.0, // £125 fare + £15 meet & greet + £5 drop fee
    paymentStatus: 'paid',
    status: 'allocated',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Tariq Mahmood'
  },
  {
    id: 'air-02',
    bookingRef: 'DEC-LHR-2026-118',
    customerName: 'Lady Eleanor Hamilton',
    customerPhone: '+44 7911 123456',
    passengerCount: 1,
    luggageCount: 2,
    vehicleCategory: 'Executive',
    airport: 'London Heathrow (LHR)',
    terminal: 'Terminal 5 First Class Lounge Meet',
    flightNumber: 'EK 029',
    airline: 'Emirates',
    scheduledLanding: '16:00',
    actualLanding: '15:55',
    flightStatus: 'On Time',
    flightDelayMinutes: 0,
    landingBufferMinutes: 60,
    agreedCollectionTime: '16:55',
    hasClashWithSchoolRun: false,
    meetAndGreet: {
      enabled: true,
      nameboardText: 'HAMILTON FAMILY OFFICES',
      meetPoint: 'T5 Chauffeur Meeting Point Pole 4',
      contactPhone: '+44 7911 123456'
    },
    hasLinkedReturn: false,
    chauffeurDetails: {
      bookingType: 'hourly',
      contractedHours: 4,
      includedMileage: 80,
      overtimeRatePerHour: 55.0,
      excessMileageRate: 3.0
    },
    fareGbp: 220.0,
    totalGbp: 240.0,
    paymentStatus: 'paid',
    status: 'allocated',
    assignedDriverId: 'drv-03',
    assignedDriverName: 'David Vance'
  },
  {
    id: 'air-03',
    bookingRef: 'DEC-STN-2026-309',
    customerName: 'TechCorp UK Team',
    customerPhone: '+44 7822 554433',
    passengerCount: 6,
    luggageCount: 6,
    vehicleCategory: 'Minibus',
    airport: 'London Stansted (STN)',
    terminal: 'Main Terminal Arrivals',
    flightNumber: 'FR 9122',
    airline: 'Ryanair',
    scheduledLanding: '17:30',
    actualLanding: '17:30',
    flightStatus: 'Landed',
    flightDelayMinutes: 0,
    landingBufferMinutes: 30,
    agreedCollectionTime: '18:00',
    hasClashWithSchoolRun: false,
    meetAndGreet: {
      enabled: false,
      nameboardText: '',
      meetPoint: 'Short Stay Car Park Orange Zone',
      contactPhone: '+44 7822 554433'
    },
    hasLinkedReturn: true,
    linkedReturnRef: 'DEC-STN-2026-309-RET',
    fareGbp: 165.0,
    totalGbp: 175.0,
    paymentStatus: 'part-paid',
    status: 'unallocated'
  }
];

export const mockTariffRules: TariffRule[] = [
  {
    id: 'tr-01',
    name: 'Executive & VIP Chauffeur Tariff (v2.4)',
    companyId: 'dec-executive',
    vehicleCategory: 'Executive',
    baseDropFareGbp: 12.0,
    includedMiles: 2.0, // First 2 miles included
    perMileRateGbp: 3.2,
    minimumFareGbp: 25.0,
    waitingChargePerMinuteGbp: 0.65,
    waitingFreeBufferMinutes: 15,
    extraStopChargeGbp: 10.0,
    airportDropFeeGbp: 6.0,
    meetAndGreetFeeGbp: 18.0,
    nightSurchargeMultiplier: 1.25, // +25% between 23:00 - 05:00
    bankHolidayMultiplier: 1.5, // +50% Bank holidays
    version: 'v2.4',
    effectiveFrom: '01/10/2026',
    status: 'active'
  },
  {
    id: 'tr-02',
    name: 'Standard Saloon / Private Hire (v3.1)',
    companyId: 'dec-luton-airport',
    vehicleCategory: 'Saloon',
    baseDropFareGbp: 4.8,
    includedMiles: 1.0,
    perMileRateGbp: 2.4,
    minimumFareGbp: 8.5,
    waitingChargePerMinuteGbp: 0.45,
    waitingFreeBufferMinutes: 10,
    extraStopChargeGbp: 5.0,
    airportDropFeeGbp: 5.0,
    meetAndGreetFeeGbp: 12.5,
    nightSurchargeMultiplier: 1.2,
    bankHolidayMultiplier: 1.5,
    version: 'v3.1',
    effectiveFrom: '15/09/2026',
    status: 'active'
  },
  {
    id: 'tr-03',
    name: 'SEN Council Minibus / WAV Ratecard (v1.8)',
    companyId: 'dec-beds-schools',
    vehicleCategory: 'Wheelchair Accessible (WAV)',
    baseDropFareGbp: 15.0,
    includedMiles: 3.0,
    perMileRateGbp: 2.8,
    minimumFareGbp: 30.0,
    waitingChargePerMinuteGbp: 0.4,
    waitingFreeBufferMinutes: 20,
    extraStopChargeGbp: 6.0,
    airportDropFeeGbp: 5.0,
    meetAndGreetFeeGbp: 15.0,
    nightSurchargeMultiplier: 1.15,
    bankHolidayMultiplier: 1.5,
    version: 'v1.8',
    effectiveFrom: '01/09/2026',
    status: 'active'
  }
];

export const mockFixedRoutes: FixedRouteTariff[] = [
  {
    id: 'fx-01',
    routeName: 'Central Luton to London Heathrow T5',
    fromLocation: 'Luton Central (LU1)',
    toLocation: 'Heathrow Airport T5 (TW6)',
    fromPostcodeArea: 'LU1',
    toPostcodeArea: 'TW6',
    vehicleCategory: 'Executive',
    fixedPassengerPriceGbp: 95.0,
    driverPayoutGbp: 76.0,
    companyCommissionGbp: 19.0
  },
  {
    id: 'fx-02',
    routeName: 'Luton Airport (LTN) to Central London (West End)',
    fromLocation: 'London Luton Airport (LU2)',
    toLocation: 'London Mayfair / West End (W1)',
    fromPostcodeArea: 'LU2',
    toPostcodeArea: 'W1',
    vehicleCategory: 'Executive',
    fixedPassengerPriceGbp: 115.0,
    driverPayoutGbp: 92.0,
    companyCommissionGbp: 23.0
  },
  {
    id: 'fx-03',
    routeName: 'Dunstable to Milton Keynes Central Hub',
    fromLocation: 'Dunstable High Street (LU6)',
    toLocation: 'Milton Keynes Central Station (MK9)',
    fromPostcodeArea: 'LU6',
    toPostcodeArea: 'MK9',
    vehicleCategory: 'Saloon',
    fixedPassengerPriceGbp: 38.0,
    driverPayoutGbp: 30.4,
    companyCommissionGbp: 7.6
  }
];

export const mockCorporateAccounts: CorporateAccount[] = [
  {
    id: 'corp-01',
    accountName: 'AstraZeneca UK Operations',
    accountCode: 'CORP-AZ-001',
    contactPerson: 'Fiona Gallagher (Procurement)',
    contactEmail: 'travel.desk@astrazeneca.co.uk',
    contactPhone: '+44 1582 884400',
    billingAddress: 'Silk Road Business Park, Macclesfield / Luton Facility',
    creditLimitGbp: 25000.0,
    currentBalanceGbp: 4820.5,
    poNumberMandatory: true,
    costCentres: ['CC-EXEC-101', 'CC-CLINICAL-202', 'CC-SITE-409'],
    paymentTermsDays: 30,
    status: 'active',
    discountPercent: 12.0
  },
  {
    id: 'corp-02',
    accountName: 'Amazon LCY2 Logistics HQ',
    accountCode: 'CORP-AMZ-002',
    contactPerson: 'David Miller (Station Lead)',
    contactEmail: 'lcy2-transport@amazon.co.uk',
    contactPhone: '+44 1582 331199',
    billingAddress: 'Boundary Way, Hemel Hempstead HP2 7LF',
    creditLimitGbp: 15000.0,
    currentBalanceGbp: 1410.0,
    poNumberMandatory: true,
    costCentres: ['CC-SHIFT-AM', 'CC-SHIFT-NIGHT', 'CC-SAFETY'],
    paymentTermsDays: 14,
    status: 'active',
    discountPercent: 8.0
  },
  {
    id: 'corp-03',
    accountName: 'Central Bedfordshire Council (Children Services)',
    accountCode: 'CORP-CBC-SEN',
    contactPerson: 'Sarah Jenkins (SEN Coordinator)',
    contactEmail: 'sen.transport@centralbedfordshire.gov.uk',
    contactPhone: '+44 300 300 8000',
    billingAddress: 'Priory House, Monks Walk, Chicksands, Shefford SG17 5TQ',
    creditLimitGbp: 50000.0,
    currentBalanceGbp: 18450.0,
    poNumberMandatory: true,
    costCentres: ['CBC-SEN-ROUTE-01', 'CBC-SEN-ROUTE-02', 'CBC-WAV-SPECIAL'],
    paymentTermsDays: 30,
    status: 'active',
    discountPercent: 15.0
  }
];

export const mockInvoices: InvoiceRecord[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0891',
    accountId: 'corp-01',
    accountName: 'AstraZeneca UK Operations',
    accountCode: 'CORP-AZ-001',
    billingPeriod: 'October 2026 (Week 4)',
    issueDate: '26/10/2026',
    dueDate: '25/11/2026',
    subtotalGbp: 1850.0,
    vatAmountGbp: 370.0,
    totalDueGbp: 2220.0,
    paymentStatus: 'unpaid',
    items: [
      {
        id: 'item-1',
        bookingRef: 'DEC-LTN-2026-904',
        journeyDate: '24/10/2026',
        passengerName: 'Marcus Sterling',
        routeDescription: 'Luton Airport T1 -> Canary Wharf, London',
        poNumber: 'PO-AZ-9921',
        costCentre: 'CC-EXEC-101',
        fareGbp: 145.0,
        extrasGbp: 15.0,
        vatGbp: 32.0,
        totalGbp: 192.0
      },
      {
        id: 'item-2',
        bookingRef: 'DEC-LHR-2026-118',
        journeyDate: '25/10/2026',
        passengerName: 'Dr. Aris Thorne',
        routeDescription: 'Heathrow T5 -> Luton Facility Site B',
        poNumber: 'PO-AZ-9922',
        costCentre: 'CC-CLINICAL-202',
        fareGbp: 110.0,
        extrasGbp: 5.0,
        vatGbp: 23.0,
        totalGbp: 138.0
      }
    ],
    creditNotes: [
      {
        creditNoteRef: 'CN-2026-012',
        amountGbp: 30.0,
        reason: 'Refunded airport delay excess fee as goodwill gesture',
        issueDate: '27/10/2026'
      }
    ]
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0892',
    accountId: 'corp-02',
    accountName: 'Amazon LCY2 Logistics HQ',
    billingPeriod: 'October 2026 (Week 3)',
    accountCode: 'CORP-AMZ-002',
    issueDate: '19/10/2026',
    dueDate: '02/11/2026',
    subtotalGbp: 1175.0,
    vatAmountGbp: 235.0,
    totalDueGbp: 1410.0,
    paymentStatus: 'paid',
    items: [
      {
        id: 'item-3',
        bookingRef: 'DEC-SHF-881',
        journeyDate: '18/10/2026',
        passengerName: 'Night Shift Crew (4)',
        routeDescription: 'Dunstable Square -> Boundary Way Site',
        poNumber: 'AMZ-UK-8801',
        costCentre: 'CC-SHIFT-NIGHT',
        fareGbp: 45.0,
        extrasGbp: 0,
        vatGbp: 9.0,
        totalGbp: 54.0
      }
    ]
  }
];

export const mockDriverSettlements: DriverWeeklySettlement[] = [
  {
    driverId: 'drv-01',
    driverName: 'Tariq Mahmood',
    staffId: 'DEC-DRV-01',
    vehicleReg: 'LT73 XKL (V-Class)',
    weekEndingDate: '25/10/2026',
    completedJobsCount: 24,
    grossFaresGbp: 1480.0,
    operatorCommissionPercent: 20.0,
    operatorCommissionGbp: 296.0,
    vehicleRentWeeklyGbp: 120.0, // Weekly executive lease
    cashFaresCollectedByDriverGbp: 180.0, // Retained in hand
    fuelOrChargesAllowanceGbp: 25.0, // Reimbursed clean air fee
    netBankTransferPayoutGbp: 909.0, // 1480 - 296 - 120 - 180 + 25
    paymentStatus: 'authorized_for_transfer'
  },
  {
    driverId: 'drv-03',
    driverName: 'David Vance',
    staffId: 'DEC-DRV-03',
    vehicleReg: 'BP23 ZXC (E-Class)',
    weekEndingDate: '25/10/2026',
    completedJobsCount: 19,
    grossFaresGbp: 1120.0,
    operatorCommissionPercent: 18.0,
    operatorCommissionGbp: 201.6,
    vehicleRentWeeklyGbp: 95.0,
    cashFaresCollectedByDriverGbp: 80.0,
    fuelOrChargesAllowanceGbp: 0.0,
    netBankTransferPayoutGbp: 743.4,
    paymentStatus: 'settled'
  }
];

export const mockRecurringTemplates: RecurringBookingTemplate[] = [
  {
    id: 'tmpl-01',
    templateName: 'The Chiltern School SEN Route 1 AM & PM',
    customerName: 'Central Bedfordshire SEN Transport',
    customerPhone: '+44 300 300 8000',
    pickupAddress: 'The Chiltern School, Kingsland Campus, Dunstable',
    pickupPostcode: 'LU5 4PX',
    destinationAddress: 'Dunstable & Leighton Buzzard Drop Roster',
    destinationPostcode: 'LU7 1AA',
    vehicleCategory: 'Wheelchair Accessible (WAV)',
    scheduledTime: '08:00 & 15:15',
    recurringPattern: 'Monday to Friday',
    contractClient: 'CBC-SEN-ROUTE-01',
    fixedFareGbp: 95.0,
    active: true,
    nextScheduledDate: 'Tomorrow 08:00'
  },
  {
    id: 'tmpl-02',
    templateName: 'Executive Weekly Board Commute to Canary Wharf',
    customerName: 'Marcus Sterling (Apex Holdings)',
    customerPhone: '+44 7700 900881',
    pickupAddress: 'Weston Underwood, Olney',
    pickupPostcode: 'MK46 5JS',
    destinationAddress: 'One Canada Square, Canary Wharf, London',
    destinationPostcode: 'E14 5AA',
    vehicleCategory: 'Executive',
    scheduledTime: '06:45',
    recurringPattern: 'Weekly Saturday',
    fixedFareGbp: 165.0,
    active: true,
    nextScheduledDate: 'Saturday 06:45'
  }
];

export const mockLostPropertyItems: LostPropertyItem[] = [
  {
    id: 'lp-01',
    reference: 'LP-2026-104',
    dateFound: '26/10/2026',
    timeFound: '16:45',
    vehicleReg: 'LT73 XKL',
    driverFinderName: 'Tariq Mahmood',
    category: 'Electronics',
    itemTitle: 'Apple iPhone 15 Pro (Midnight Blue)',
    description: 'Found under the middle executive captain seat. Clear case with British Airways boarding pass stuck inside.',
    locationInVehicle: 'Rear Row Seat',
    passengerClaimStatus: 'verified_for_pickup',
    matchedBookingRef: 'DEC-LTN-2026-904',
    claimantName: 'Marcus Sterling',
    returnedDate: undefined
  },
  {
    id: 'lp-02',
    reference: 'LP-2026-105',
    dateFound: '25/10/2026',
    timeFound: '18:15',
    vehicleReg: 'BP23 ZXC',
    driverFinderName: 'David Vance',
    category: 'Luggage & Bags',
    itemTitle: 'Black Leather Tumi Laptop Briefcase',
    description: 'Contains legal documents and MacBook charger. Left in boot compartment.',
    locationInVehicle: 'Boot Compartment',
    passengerClaimStatus: 'contacted_passenger',
    matchedBookingRef: 'DEC-LHR-2026-118',
    claimantName: 'Lady Eleanor Hamilton'
  },
  {
    id: 'lp-03',
    reference: 'LP-2026-106',
    dateFound: '24/10/2026',
    timeFound: '09:10',
    vehicleReg: 'KX72 YUT',
    driverFinderName: 'John Miller',
    category: 'Keys / Personal',
    itemTitle: 'House Keys with Red Vauxhall Fob',
    description: 'Three Chubb keys with red automotive remote on brass ring.',
    locationInVehicle: 'Floor Well',
    passengerClaimStatus: 'unclaimed'
  }
];

export const mockComplaints: CustomerComplaint[] = [
  {
    id: 'cmp-01',
    complaintRef: 'CMP-2026-052',
    bookingRef: 'DEC-2026-9810',
    complainantName: 'Mrs. Judith Palmer',
    customerPhone: '+44 7700 900331',
    driverName: 'Liam Reynolds',
    vehicleReg: 'WN22 OPL',
    category: 'Late Arrival / Delay',
    severity: 'moderate',
    loggedDate: '26/10/2026 11:20',
    slaDeadline: '28/10/2026 17:00 (SLA 48h)',
    incidentSummary: 'Driver arrived 22 minutes past scheduled airport pickup without advance phone call. Customer incurred priority security fee.',
    investigationStatus: 'under_investigation',
    resolutionNotes: 'GPS tracking audited: M1 Junction 10 roadworks bottleneck caused 18m unannounced delay. Driver issued formal reminder to ping ETA.',
    councilNotified: false
  },
  {
    id: 'cmp-02',
    complaintRef: 'CMP-2026-053',
    bookingRef: 'CBC-SEN-ROUTE-01',
    complainantName: 'Parent Liaison (Dunstable School)',
    customerPhone: '+44 1582 661122',
    driverName: 'Tariq Mahmood',
    vehicleReg: 'LT73 XKL',
    category: 'Vehicle Cleanliness / Smell',
    severity: 'minor',
    loggedDate: '25/10/2026 16:30',
    slaDeadline: '29/10/2026 12:00',
    incidentSummary: 'Rear passenger row had spilled soft drink on booster seat fabric from previous airport journey.',
    investigationStatus: 'resolved_closed',
    resolutionNotes: 'Vehicle Valeting bay completed full steam extraction that evening. Signed off by Depot Foreman.',
    councilNotified: true
  }
];

export const mockDispatchChatMessages: DispatchChatMessage[] = [
  {
    id: 'msg-01',
    senderType: 'office',
    senderName: 'Liam Reynolds (Dispatch Control)',
    recipientStaffId: 'drv-01',
    recipientStaffName: 'Tariq Mahmood',
    text: 'Flight BA2490 delayed by 85 min. Landing rescheduled to 15:40. Hold at Airport Chauffeur Zone until 16:15.',
    timestamp: '14:28',
    deliveryStatus: 'delivered'
  },
  {
    id: 'msg-02',
    senderType: 'driver',
    senderName: 'Tariq Mahmood (LT73 XKL)',
    recipientStaffId: 'user-controller',
    recipientStaffName: 'Liam Reynolds',
    text: 'Understood Liam. Checked into LTN waiting holding bay. Nameboard ready for Marcus Sterling.',
    timestamp: '14:30',
    deliveryStatus: 'delivered'
  },
  {
    id: 'msg-03',
    senderType: 'office',
    senderName: 'Central Dispatch Broadcast',
    recipientStaffId: 'all-drivers',
    recipientStaffName: 'All On-Duty Drivers',
    text: 'M1 Southbound J11A to J10 lane closure due to broken-down HGV. Divert via A505 if en route to LTN airport.',
    timestamp: '14:45',
    deliveryStatus: 'sent',
    isBroadcast: true
  },
  {
    id: 'msg-04',
    senderType: 'office',
    senderName: 'Eleanor Vance (Safeguarding Lead)',
    recipientStaffId: 'pa-01',
    recipientStaffName: 'Sarah Jenkins',
    text: 'Sarah, reminder to verify pupil Mia T. booster harness anchor before departure from Chiltern School.',
    timestamp: '15:05',
    deliveryStatus: 'queued'
  }
];

export const mockAutoDispatchZones: AutoDispatchZone[] = [
  {
    id: 'zone-ltn',
    name: 'London Luton Airport Airside & Holding Zone',
    code: 'ZN-LTN-01',
    radiusMiles: 3.5,
    defaultBufferMinutes: 30,
    isAirportQueueZone: true,
    activeDriversInZone: 4
  },
  {
    id: 'zone-luton-central',
    name: 'Luton Central & Town Hub',
    code: 'ZN-LU-CENTRAL',
    radiusMiles: 4.0,
    defaultBufferMinutes: 15,
    isAirportQueueZone: false,
    activeDriversInZone: 7
  },
  {
    id: 'zone-dunstable',
    name: 'Dunstable & Houghton Regis SEN Corridor',
    code: 'ZN-DUN-CORR',
    radiusMiles: 5.5,
    defaultBufferMinutes: 20,
    isAirportQueueZone: false,
    activeDriversInZone: 3
  }
];

export const mockAirportHoldingQueue: AutoDispatchQueueItem[] = [
  {
    driverId: 'drv-01',
    driverName: 'Tariq Mahmood',
    vehicleReg: 'LT73 XKL',
    vehicleTier: 'Executive (V-Class)',
    queuePosition: 1,
    checkInTime: '13:50',
    waitingMinutes: 45
  },
  {
    driverId: 'drv-03',
    driverName: 'David Vance',
    vehicleReg: 'BP23 ZXC',
    vehicleTier: 'Executive (E-Class)',
    queuePosition: 2,
    checkInTime: '14:05',
    waitingMinutes: 30
  },
  {
    driverId: 'drv-04',
    driverName: 'Rashid Khan',
    vehicleReg: 'KX72 YUT',
    vehicleTier: 'Saloon (Octavia)',
    queuePosition: 3,
    checkInTime: '14:20',
    waitingMinutes: 15
  }
];

export const mockAutoDispatchConfig: AutoDispatchConfig = {
  autoDispatchActive: true,
  offerDeadlineSeconds: 25,
  maxRadiusMiles: 6.0,
  maxConsecutiveRejections: 3,
  rejectionCooldownMinutes: 15,
  escalationStrategy: 'alert_controller_desk',
  vehicleMatchingMode: 'allow_free_upgrade_saloon_to_exec',
  manualOverridesTodayCount: 2
};

export const mockManualOverrides: ManualDispatchOverrideLog[] = [
  {
    id: 'ovr-01',
    timestamp: '26/10/2026 10:14',
    bookingRef: 'DEC-LTN-2026-904',
    suggestedDriverName: 'Rashid Khan (Auto Nearest)',
    assignedDriverName: 'Tariq Mahmood',
    controllerName: 'Liam Reynolds',
    mandatoryReason: 'VIP Corporate Account AstraZeneca requested French/English speaking Executive V-Class driver.'
  },
  {
    id: 'ovr-02',
    timestamp: '26/10/2026 12:40',
    bookingRef: 'DEC-2026-9810',
    suggestedDriverName: 'David Vance',
    assignedDriverName: 'John Miller',
    controllerName: 'Arthur Pendelton',
    mandatoryReason: 'Customer requested luggage assistance for wheelchair hoist.'
  }
];
