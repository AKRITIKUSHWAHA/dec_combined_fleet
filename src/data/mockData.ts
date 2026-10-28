import { 
  SubCompany, 
  Vehicle, 
  DriverPAProfile, 
  Booking, 
  VehicleDefect, 
  DailyCheck, 
  SystemNotification 
} from '../types';

export const initialSubCompanies: SubCompany[] = [
  {
    id: 'dec-head-office',
    name: 'DEC Group Head Office',
    code: 'DEC-HQ',
    operatorLicence: 'UK-DEC-HQ-001',
    council: 'Luton',
    phone: '+44 1582 998877',
    email: 'operations@decgroup.co.uk',
    vehicleCount: 28,
    driverCount: 34
  },
  {
    id: 'dec-luton-airport',
    name: 'DEC Luton Airport Transfers Ltd',
    code: 'DEC-LTN',
    operatorLicence: 'PHO-LTN-2024-411',
    council: 'Luton',
    phone: '+44 1582 445566',
    email: 'dispatch@decluton.co.uk',
    vehicleCount: 12,
    driverCount: 16
  },
  {
    id: 'dec-beds-schools',
    name: 'DEC Central Beds School Transport',
    code: 'DEC-SCH',
    operatorLicence: 'CBC-PHV-2025-108',
    council: 'Central Bedfordshire',
    phone: '+44 1525 332211',
    email: 'schools@decbeds.co.uk',
    vehicleCount: 10,
    driverCount: 12
  },
  {
    id: 'dec-executive',
    name: 'DEC Executive & Chauffeur Services',
    code: 'DEC-EXEC',
    operatorLicence: 'PHO-LTN-2023-889',
    council: 'Luton',
    phone: '+44 207 946 0199',
    email: 'vip@decexecutive.co.uk',
    vehicleCount: 6,
    driverCount: 6
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'veh-01',
    registration: 'LT73 XKL',
    vin: 'SJNFAAJ11U1234567',
    make: 'Mercedes-Benz',
    model: 'V-Class Executive Extra-Long',
    year: 2023,
    seatingCapacity: 7,
    wheelchairCapacity: 1,
    hasRampOrLift: true,
    fuelType: 'Diesel',
    currentMileage: 42150,
    companyId: 'dec-executive',
    depot: 'Luton Central Depot',
    assignedDriverId: 'drv-01',
    status: 'allocated',
    annualDvsaMot: {
      expiryDate: '28/11/2026', // Approaching 1 month reminder!
      status: 'due_soon',
      lastTestDate: '29/11/2025',
      advisoriesCount: 1
    },
    councilSixMonthInspection: {
      dueDate: '15/12/2026',
      council: 'Luton Council',
      designatedDepotRequired: false,
      status: 'valid'
    },
    lastServiceDate: '15/06/2026',
    nextServiceDueDate: '15/12/2026',
    nextServiceDueMileage: 50000,
    openDefectsCount: 0,
    criticalDefectsCount: 0,
    todayCheckStatus: 'passed'
  },
  {
    id: 'veh-02',
    registration: 'CB22 WPR',
    vin: 'WF0XXXTTFXKP87654',
    make: 'Ford',
    model: 'Transit Custom Minibus (WAV)',
    year: 2022,
    seatingCapacity: 8,
    wheelchairCapacity: 2,
    hasRampOrLift: true,
    fuelType: 'Diesel',
    currentMileage: 68420,
    companyId: 'dec-beds-schools',
    depot: 'Dunstable Depot',
    assignedDriverId: 'drv-02',
    status: 'blocked_off_road',
    isOffRoadReason: 'CRITICAL DEFECT: Front brake pads worn below 1.5mm + fluid weeping.',
    annualDvsaMot: {
      expiryDate: '10/04/2027',
      status: 'valid',
      lastTestDate: '11/04/2026',
      advisoriesCount: 0
    },
    councilSixMonthInspection: {
      dueDate: '30/11/2026', // 1 month reminder! Central Bedfordshire designated depot
      council: 'Central Bedfordshire',
      designatedDepotRequired: true,
      status: 'due_soon'
    },
    lastServiceDate: '12/04/2026',
    nextServiceDueDate: '12/10/2026',
    nextServiceDueMileage: 70000,
    openDefectsCount: 1,
    criticalDefectsCount: 1,
    todayCheckStatus: 'failed'
  },
  {
    id: 'veh-03',
    registration: 'BD24 TYU',
    vin: 'WP0ZZZ97ZKS112233',
    make: 'Skoda',
    model: 'Superb Estate SE L',
    year: 2024,
    seatingCapacity: 4,
    wheelchairCapacity: 0,
    hasRampOrLift: false,
    fuelType: 'Hybrid',
    currentMileage: 18940,
    companyId: 'dec-luton-airport',
    depot: 'Luton Airport Base',
    assignedDriverId: 'drv-03',
    status: 'available',
    annualDvsaMot: {
      expiryDate: '01/03/2027',
      status: 'valid',
      lastTestDate: '01/03/2024',
      advisoriesCount: 0
    },
    councilSixMonthInspection: {
      dueDate: '20/02/2027',
      council: 'Luton Council',
      designatedDepotRequired: false,
      status: 'valid'
    },
    lastServiceDate: '01/09/2026',
    nextServiceDueDate: '01/03/2027',
    nextServiceDueMileage: 30000,
    openDefectsCount: 1,
    criticalDefectsCount: 0,
    todayCheckStatus: 'passed'
  },
  {
    id: 'veh-04',
    registration: 'VA73 STU',
    vin: 'WVWZZZ3CZNE998877',
    make: 'Volkswagen',
    model: 'ID.4 Pro Performance (EV)',
    year: 2023,
    seatingCapacity: 4,
    wheelchairCapacity: 0,
    hasRampOrLift: false,
    fuelType: 'Electric (EV)',
    currentMileage: 34100,
    companyId: 'dec-luton-airport',
    depot: 'Luton Central Depot',
    assignedDriverId: 'drv-04',
    status: 'allocated',
    annualDvsaMot: {
      expiryDate: '15/09/2027',
      status: 'valid',
      lastTestDate: '15/09/2024',
      advisoriesCount: 0
    },
    councilSixMonthInspection: {
      dueDate: '12/01/2027',
      council: 'Luton Council',
      designatedDepotRequired: false,
      status: 'valid'
    },
    lastServiceDate: '10/08/2026',
    nextServiceDueDate: '10/02/2027',
    nextServiceDueMileage: 45000,
    openDefectsCount: 0,
    criticalDefectsCount: 0,
    todayCheckStatus: 'passed'
  }
];

export const initialStaff: DriverPAProfile[] = [
  {
    id: 'drv-01',
    staffId: 'DEC-DRV-01',
    name: 'Tariq Mahmood',
    email: 'tariq.m@decgroup.co.uk',
    phone: '+44 7700 900123',
    role: 'driver',
    companyId: 'dec-executive',
    assignedDepot: 'Luton Central Depot',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'on_job',
    currentVehicleReg: 'LT73 XKL',
    currentLocation: {
      lat: 51.8745,
      lng: -0.3725,
      heading: 140,
      speedMph: 28,
      lastUpdateIso: new Date().toISOString(),
      isFresh: true
    },
    drivingLicence: {
      licenceNumber: 'MAHMO801024T99JK',
      categories: ['B', 'B+E', 'D1'],
      photocardExpiry: '14/08/2030',
      penaltyPoints: 0,
      endorsementsCount: 0,
      dvlaLastCheckDate: '25/10/2026',
      dvlaStatus: 'valid'
    },
    taxiBadge: {
      badgeNumber: 'LBC-PHD-8821',
      council: 'Luton Council',
      expiryDate: '30/06/2027'
    },
    medicalReviewDate: '12/04/2028',
    dbsCheck: {
      certificateNumber: '001598234120',
      issueDate: '15/05/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '15/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '15/05/2027' },
      firstAid: { completed: true, expiryDate: '12/09/2027' },
      midas: { completed: true, expiryDate: '20/01/2028', certificateNo: 'MIDAS-2024-991' },
      pat: { completed: true, expiryDate: '20/01/2028' },
      wheelchairRestraints: { completed: true, expiryDate: '14/06/2027' }
    }
  },
  {
    id: 'drv-02',
    staffId: 'DEC-DRV-02',
    name: 'Marcus Bell',
    email: 'marcus.b@decgroup.co.uk',
    phone: '+44 7700 900456',
    role: 'dual_driver_pa', // DUAL ROLE Driver + Passenger Assistant!
    companyId: 'dec-beds-schools',
    assignedDepot: 'Dunstable Depot',
    operationalClearance: 'restricted',
    clearanceReason: 'DVLA automated check flagged 6 points (SP30 speeding); assigned vehicle CB22 WPR is also VOR Off-Road.',
    onDuty: false,
    dutyStatus: 'off_duty',
    currentVehicleReg: 'CB22 WPR',
    drivingLicence: {
      licenceNumber: 'BELLM750212M44YZ',
      categories: ['B', 'D1'],
      photocardExpiry: '10/01/2028',
      penaltyPoints: 6,
      endorsementsCount: 2,
      dvlaLastCheckDate: '27/10/2026',
      dvlaStatus: 'valid'
    },
    taxiBadge: {
      badgeNumber: 'CBC-PHD-3041',
      council: 'Central Bedfordshire',
      expiryDate: '15/11/2026' // Expiring soon!
    },
    paAuthorisation: {
      authorisationId: 'CBC-PA-9921',
      councilApproval: 'Central Bedfordshire Council SEN Escort',
      expiryDate: '28/02/2027',
      pairedSchoolRouteId: 'SCH-ROUTE-04'
    },
    dbsCheck: {
      certificateNumber: '001478952310',
      issueDate: '10/02/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '26/10/2026',
      statusResult: 'reviewed_suitable',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '10/02/2027' },
      firstAid: { completed: true, expiryDate: '14/11/2026' },
      midas: { completed: true, expiryDate: '11/03/2027', certificateNo: 'MIDAS-2023-112' },
      pat: { completed: true, expiryDate: '11/03/2027' },
      wheelchairRestraints: { completed: true, expiryDate: '11/03/2027' }
    }
  },
  {
    id: 'pa-01',
    staffId: 'DEC-PA-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@decgroup.co.uk',
    phone: '+44 7700 900789',
    role: 'pa', // Passenger Assistant Only (NO driving licence required!)
    companyId: 'dec-beds-schools',
    assignedDepot: 'Dunstable Depot',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'available',
    paAuthorisation: {
      authorisationId: 'CBC-PA-8842',
      councilApproval: 'Central Bedfordshire Council Education Authority',
      expiryDate: '31/08/2027',
      pairedSchoolRouteId: 'SCH-ROUTE-01'
    },
    dbsCheck: {
      certificateNumber: '001689451203',
      issueDate: '01/09/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '20/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '01/09/2027' },
      firstAid: { completed: true, expiryDate: '01/09/2027' },
      midas: { completed: false, expiryDate: 'N/A' }, // PAs do not need driver MiDAS, but PAT
      pat: { completed: true, expiryDate: '15/10/2027' }, // Passenger Assistant Training
      wheelchairRestraints: { completed: true, expiryDate: '15/10/2027' }
    }
  },
  {
    id: 'drv-03',
    staffId: 'DEC-DRV-03',
    name: 'David O\'Connor',
    email: 'david.oc@decgroup.co.uk',
    phone: '+44 7700 900334',
    role: 'driver',
    companyId: 'dec-luton-airport',
    assignedDepot: 'Luton Airport Base',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'available',
    currentVehicleReg: 'BD24 TYU',
    currentLocation: {
      lat: 51.8795,
      lng: -0.3762,
      heading: 90,
      speedMph: 0,
      lastUpdateIso: new Date(Date.now() - 45000).toISOString(),
      isFresh: true
    },
    drivingLicence: {
      licenceNumber: 'OCONN820914D11KL',
      categories: ['B'],
      photocardExpiry: '19/04/2029',
      penaltyPoints: 0,
      endorsementsCount: 0,
      dvlaLastCheckDate: '20/10/2026',
      dvlaStatus: 'valid'
    },
    taxiBadge: {
      badgeNumber: 'LBC-PHD-9014',
      council: 'Luton Council',
      expiryDate: '14/09/2027'
    },
    medicalReviewDate: '28/05/2028',
    dbsCheck: {
      certificateNumber: '001554433221',
      issueDate: '18/06/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '18/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '18/06/2027' },
      firstAid: { completed: true, expiryDate: '20/10/2027' },
      midas: { completed: true, expiryDate: '05/02/2028' },
      pat: { completed: false, expiryDate: 'N/A' },
      wheelchairRestraints: { completed: true, expiryDate: '05/02/2028' }
    }
  },
  {
    id: 'drv-04',
    staffId: 'DEC-DRV-04',
    name: 'Kamran Haque',
    email: 'kamran.h@decgroup.co.uk',
    phone: '+44 7700 900551',
    role: 'driver',
    companyId: 'dec-luton-airport',
    assignedDepot: 'Luton Central Depot',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'on_job',
    currentVehicleReg: 'VA73 STU',
    currentLocation: {
      lat: 51.8821,
      lng: -0.4112,
      heading: 260,
      speedMph: 45,
      lastUpdateIso: new Date(Date.now() - 110000).toISOString(),
      isFresh: false // Stale warning: location > 60 seconds old!
    },
    drivingLicence: {
      licenceNumber: 'HAQUE881210K77OP',
      categories: ['B'],
      photocardExpiry: '11/11/2031',
      penaltyPoints: 3,
      endorsementsCount: 1,
      dvlaLastCheckDate: '12/10/2026',
      dvlaStatus: 'valid'
    },
    taxiBadge: {
      badgeNumber: 'LBC-PHD-7731',
      council: 'Luton Council',
      expiryDate: '10/03/2027'
    },
    dbsCheck: {
      certificateNumber: '001601245781',
      issueDate: '22/07/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '22/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '22/07/2027' },
      firstAid: { completed: true, expiryDate: '22/07/2027' },
      midas: { completed: false, expiryDate: 'N/A' },
      pat: { completed: false, expiryDate: 'N/A' },
      wheelchairRestraints: { completed: false, expiryDate: 'N/A' }
    }
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'bk-01',
    bookingRef: 'DEC-2026-8910',
    companyId: 'dec-executive',
    customerName: 'Lord Alistair Sterling',
    customerPhone: '+44 7911 123456',
    passengerCount: 2,
    luggageCount: 3,
    pickupAddress: 'Luton Airport Terminal 1, Meet & Greet Arrivals',
    pickupPostcode: 'LU2 9QT',
    destinationAddress: 'The Connaught Hotel, Carlos Place, Mayfair, London',
    destinationPostcode: 'W1K 2AL',
    scheduledTime: '13:30',
    vehicleCategory: 'Executive',
    requiresWheelchair: false,
    requiresPA: false,
    assignedDriverId: 'drv-01',
    assignedVehicleId: 'veh-01',
    status: 'en_route',
    statusTimestamps: {
      created: '11:00',
      allocated: '12:15',
      enRoute: '12:45'
    },
    isAirportRun: true,
    flightDetails: {
      flightNumber: 'EZY2144',
      airline: 'easyJet',
      terminal: 'Main Terminal',
      scheduledLanding: '13:00',
      estimatedLanding: '13:20',
      flightStatus: 'Delayed',
      meetAndGreetName: 'Lord Sterling & Guest'
    },
    fareGbp: 185.00,
    parkingAirportFeesGbp: 12.50,
    waitingChargeGbp: 0.00,
    totalGbp: 197.50,
    paymentStatus: 'account_invoice'
  },
  {
    id: 'bk-02',
    bookingRef: 'DEC-2026-8911',
    companyId: 'dec-beds-schools',
    customerName: 'Central Bedfordshire Council - SEN Team',
    customerPhone: '+44 1525 842000',
    passengerCount: 4,
    luggageCount: 2,
    pickupAddress: 'The Chiltern School, Kingsland Campus, Dunstable',
    pickupPostcode: 'LU5 4TD',
    destinationAddress: 'Multiple Student Drops: Houghton Regis & Leighton Buzzard',
    destinationPostcode: 'LU5 5DY',
    scheduledTime: '15:15',
    vehicleCategory: 'Wheelchair Accessible (WAV)',
    requiresWheelchair: true,
    requiresPA: true,
    assignedDriverId: undefined, // UNALLOCATED because CB22 WPR is VOR Off-Road!
    assignedVehicleId: undefined,
    assignedPAId: 'pa-01',
    status: 'unallocated',
    statusTimestamps: {
      created: '09:30'
    },
    isSchoolRun: true,
    schoolRunDetails: {
      routeNumber: 'CBC-SEN-ROUTE-01',
      contractName: 'Chiltern School Afternoon SEN Run',
      schoolName: 'The Chiltern School',
      amOrPm: 'PM',
      sweepCompleted: false
    },
    fareGbp: 140.00,
    parkingAirportFeesGbp: 0.00,
    waitingChargeGbp: 0.00,
    totalGbp: 140.00,
    paymentStatus: 'account_invoice'
  },
  {
    id: 'bk-03',
    bookingRef: 'DEC-2026-8912',
    companyId: 'dec-luton-airport',
    customerName: 'Priya Sharma',
    customerPhone: '+44 7822 554433',
    passengerCount: 1,
    luggageCount: 1,
    pickupAddress: 'Station Road, Harpenden',
    pickupPostcode: 'AL5 4ST',
    destinationAddress: 'London Luton Airport, Drop-off Zone',
    destinationPostcode: 'LU2 9LY',
    scheduledTime: '12:50',
    vehicleCategory: 'Saloon',
    requiresWheelchair: false,
    requiresPA: false,
    assignedDriverId: 'drv-04',
    assignedVehicleId: 'veh-04',
    status: 'pob',
    statusTimestamps: {
      created: '11:40',
      allocated: '12:00',
      enRoute: '12:10',
      arrived: '12:35',
      pob: '12:42'
    },
    fareGbp: 38.00,
    parkingAirportFeesGbp: 5.00,
    waitingChargeGbp: 0.00,
    totalGbp: 43.00,
    paymentStatus: 'paid_card'
  },
  {
    id: 'bk-04',
    bookingRef: 'DEC-2026-8913',
    companyId: 'dec-luton-airport',
    customerName: 'Dr. Jeremy Wright',
    customerPhone: '+44 7799 443322',
    passengerCount: 3,
    luggageCount: 2,
    pickupAddress: 'Luton Central Rail Station, Station Road',
    pickupPostcode: 'LU1 2LT',
    destinationAddress: 'Cranfield University Campus, College Road',
    destinationPostcode: 'MK43 0AL',
    scheduledTime: '14:00',
    vehicleCategory: 'Saloon',
    requiresWheelchair: false,
    requiresPA: false,
    status: 'unallocated',
    statusTimestamps: {
      created: '12:10'
    },
    fareGbp: 52.00,
    parkingAirportFeesGbp: 0.00,
    waitingChargeGbp: 0.00,
    totalGbp: 52.00,
    paymentStatus: 'unpaid'
  }
];

export const initialDefects: VehicleDefect[] = [
  {
    id: 'def-01',
    defectRef: 'DEF-104',
    vehicleReg: 'CB22 WPR',
    reportedByStaffId: 'DEC-DRV-02',
    reportedByName: 'Marcus Bell',
    reportedAt: '28/10/2026 07:45',
    severity: 'critical_safety',
    category: 'Brakes',
    description: 'Front nearside brake pad metal-to-metal scraping noise, spongy pedal travel and brake fluid warning light illuminated on dashboard.',
    status: 'booked_garage',
    garageAction: {
      garageName: 'Dunstable Fleet Care Workshop Ltd',
      appointmentDate: '28/10/2026 14:00',
      downtimeStart: '28/10/2026 08:00',
      downtimeEnd: '29/10/2026 12:00',
      costEstimateGbp: 320.00,
      repairedBy: 'John Miller (Master Tech)'
    }
  },
  {
    id: 'def-02',
    defectRef: 'DEF-105',
    vehicleReg: 'BD24 TYU',
    reportedByStaffId: 'DEC-DRV-03',
    reportedByName: 'David O\'Connor',
    reportedAt: '27/10/2026 16:30',
    severity: 'minor',
    category: 'Glass/Mirrors',
    description: 'Offside wing mirror indicator casing cracked, light still functioning. Stone chip on passenger lower windscreen out of direct line of sight.',
    status: 'monitored',
    garageAction: {
      garageName: 'Luton Auto Glaze & Bodywork',
      appointmentDate: '02/11/2026 09:30',
      downtimeStart: '02/11/2026 09:30',
      downtimeEnd: '02/11/2026 11:30',
      costEstimateGbp: 85.00
    }
  }
];

export const initialDailyChecks: DailyCheck[] = [
  {
    id: 'chk-01',
    checkRef: 'CHK-9921',
    vehicleReg: 'LT73 XKL',
    driverId: 'drv-01',
    driverName: 'Tariq Mahmood',
    timestamp: '28/10/2026 06:30',
    odometerReading: 42150,
    itemsChecked: 18,
    failuresCount: 0,
    status: 'passed'
  },
  {
    id: 'chk-02',
    checkRef: 'CHK-9922',
    vehicleReg: 'CB22 WPR',
    driverId: 'drv-02',
    driverName: 'Marcus Bell',
    timestamp: '28/10/2026 07:45',
    odometerReading: 68420,
    itemsChecked: 18,
    failuresCount: 2,
    status: 'failed'
  },
  {
    id: 'chk-03',
    checkRef: 'CHK-9923',
    vehicleReg: 'BD24 TYU',
    driverId: 'drv-03',
    driverName: 'David O\'Connor',
    timestamp: '28/10/2026 08:00',
    odometerReading: 18940,
    itemsChecked: 18,
    failuresCount: 0,
    status: 'passed'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-01',
    type: 'critical_defect',
    title: 'SAFETY GATE: Vehicle CB22 WPR Blocked Off-Road',
    description: 'Critical brake defect reported by Marcus Bell. Vehicle automatically blocked from all dispatch and school allocations.',
    timestamp: '28/10/2026 07:46',
    severity: 'critical',
    read: false,
    entityLink: '/maintenance'
  },
  {
    id: 'notif-02',
    type: 'mot_due',
    title: '1-Month MOT Expiry Notice: LT73 XKL',
    description: 'Annual DVSA MOT expires on 28/11/2026. Notification triggered exactly 1 calendar month in advance.',
    timestamp: '28/10/2026 08:00',
    severity: 'warning',
    read: false,
    entityLink: '/fleet'
  },
  {
    id: 'notif-03',
    type: 'flight_delay_clash',
    title: 'Airport Flight Delayed: EasyJet EZY2144',
    description: 'Landing pushed to 13:20 (+20m). Assigned driver Tariq Mahmood buffer re-calculated; no school clashes.',
    timestamp: '28/10/2026 12:20',
    severity: 'info',
    read: true,
    entityLink: '/bookings'
  },
  {
    id: 'notif-04',
    type: 'licence_points',
    title: 'DVLA Alert: 6 Penalty Points on Marcus Bell',
    description: 'Automated licence sync identified SP30 endorsements. Driver operational clearance switched to Restricted.',
    timestamp: '27/10/2026 19:15',
    severity: 'warning',
    read: false,
    entityLink: '/compliance'
  }
];

