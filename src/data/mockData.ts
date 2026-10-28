import { 
  SubCompany, 
  Vehicle, 
  DriverPAProfile, 
  Booking, 
  VehicleDefect, 
  DailyCheck, 
  SystemNotification,
  ChecklistVersion,
  WorkshopSlot,
  RequirementTemplate,
  ComplianceReminder
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
    insurancePolicy: {
      policyNumber: 'AV-FLT-88910',
      provider: 'Aviva Fleet Commercial',
      expiryDate: '31/03/2027',
      status: 'valid'
    },
    councilPlate: {
      plateNumber: 'LBC-PHV-1049',
      issuingCouncil: 'Luton Borough Council',
      expiryDate: '30/06/2027',
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
    insurancePolicy: {
      policyNumber: 'QBE-SCH-33120',
      provider: 'QBE UK Public Liability',
      expiryDate: '15/01/2027',
      status: 'valid'
    },
    councilPlate: {
      plateNumber: 'CBC-PHV-0884',
      issuingCouncil: 'Central Bedfordshire Council',
      expiryDate: '30/11/2026',
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
    insurancePolicy: {
      policyNumber: 'AXA-FLT-55210',
      provider: 'AXA Corporate Fleet',
      expiryDate: '28/02/2027',
      status: 'valid'
    },
    councilPlate: {
      plateNumber: 'LBC-PHV-2011',
      issuingCouncil: 'Luton Borough Council',
      expiryDate: '20/02/2027',
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
    insurancePolicy: {
      policyNumber: 'AV-EV-99214',
      provider: 'Aviva Green Fleet',
      expiryDate: '10/05/2027',
      status: 'valid'
    },
    councilPlate: {
      plateNumber: 'LBC-PHV-1876',
      issuingCouncil: 'Luton Borough Council',
      expiryDate: '15/05/2027',
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
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
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
    personalDetails: {
      dob: '14/08/1982',
      address: '18 Westbourne Road, Luton, LU4 8JD',
      nationalInsuranceNumber: 'JH 42 19 88 C',
      emergencyContact: {
        name: 'Amina Mahmood',
        relation: 'Spouse',
        phone: '+44 7700 900124'
      },
      startDate: '12/03/2021',
      employmentStatus: 'active'
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
      council: 'Luton Borough Council',
      expiryDate: '30/06/2027'
    },
    medicalReviewDate: '12/04/2028',
    dbsCheck: {
      certificateNumber: '001598234120',
      issueDate: '15/05/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '15/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work',
      confidentialNotes: 'Annual Update Service status check clean. No barring indicators.'
    },
    rightToWork: {
      shareCode: 'RTW-9912-GBR',
      status: 'verified_indefinite',
      verifiedAt: '12/03/2021'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '15/05/2027', certNumber: 'SG-2024-8891' },
      firstAid: { completed: true, expiryDate: '12/09/2027', certNumber: 'FA-2024-1102' },
      midas: { completed: true, expiryDate: '20/01/2028', certificateNo: 'MIDAS-2024-991' },
      pat: { completed: true, expiryDate: '20/01/2028', certNumber: 'PAT-2024-331' },
      wheelchairRestraints: { completed: true, expiryDate: '14/06/2027', certNumber: 'WAV-2024-044' }
    },
    assignments: {
      contractedHoursWeekly: 40,
      assignedDefaultVehicleReg: 'LT73 XKL',
      preferredShift: 'Airport Night Shift',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    appDetails: {
      deviceModel: 'Samsung Galaxy S23 (Enterprise Knox)',
      osVersion: 'Android 14',
      appVersion: 'v2.4.1 (Build 412)',
      lastLoginTimestamp: '2026-10-28 07:15',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'DEC Driver Operations Handbook 2026', version: 'v3.2', signedAt: '15/01/2026' },
        { id: 'pol-2', policyName: 'Safeguarding Children & Vulnerable Adults Policy', version: 'v4.0', signedAt: '15/05/2025' },
        { id: 'pol-3', policyName: 'Drug, Alcohol & Fatigue Governance', version: 'v2.1', signedAt: '15/01/2026' }
      ],
      offlineSyncStatus: {
        lastSyncTime: '2 mins ago',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '25/10/2026',
      reviewedBy: 'Rachel Adams (HR Compliance Manager)',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-25 09:30', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'System (DVLA API Check)', reason: 'Periodic 6-month DVLA audit: 0 points confirmed.' },
        { id: 'cl-2', timestamp: '2026-05-15 14:00', previousStatus: 'pending', newStatus: 'cleared', changedBy: 'Rachel Adams', reason: 'DBS Update Service verified clean.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-28 07:15', action: 'Shift Login & Daily Check Passed', actor: 'Tariq Mahmood', details: 'Vehicle LT73 XKL 12/12 items verified with zero defects.', category: 'app' },
      { id: 'h-2', timestamp: '2026-10-25 09:30', action: 'DVLA Automated Audit Check Passed', actor: 'DVLA Gateway', details: 'Clean photocard licence confirmed. 0 penalty points.', category: 'clearance' },
      { id: 'h-3', timestamp: '2026-09-12 11:20', action: 'First Aid Recertification Uploaded', actor: 'Rachel Adams', details: 'St John Ambulance 3-Year Emergency First Aid cert FA-2024-1102 logged.', category: 'training' }
    ]
  },
  {
    id: 'drv-02',
    staffId: 'DEC-DRV-02',
    name: 'Marcus Bell',
    email: 'marcus.b@decgroup.co.uk',
    phone: '+44 7700 900456',
    role: 'dual_driver_pa', // DUAL ROLE Driver + Passenger Assistant!
    companyId: 'dec-beds-schools',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    assignedDepot: 'Dunstable Depot',
    operationalClearance: 'restricted',
    clearanceReason: 'DVLA automated check flagged 6 points (SP30 speeding); assigned vehicle CB22 WPR is also VOR Off-Road.',
    onDuty: false,
    dutyStatus: 'off_duty',
    currentVehicleReg: 'CB22 WPR',
    personalDetails: {
      dob: '12/02/1975',
      address: '44 Church Street, Dunstable, LU5 4RU',
      nationalInsuranceNumber: 'NZ 55 88 12 B',
      emergencyContact: {
        name: 'Clare Bell',
        relation: 'Spouse',
        phone: '+44 7700 900457'
      },
      startDate: '01/09/2022',
      employmentStatus: 'active'
    },
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
      council: 'Central Bedfordshire Council',
      expiryDate: '15/11/2026' // Expiring in 18 days!
    },
    paAuthorisation: {
      authorisationId: 'CBC-PA-9921',
      councilApproval: 'Central Bedfordshire Council SEN Escort',
      expiryDate: '28/02/2027',
      pairedSchoolRouteId: 'SCH-ROUTE-04'
    },
    medicalReviewDate: '10/02/2028',
    dbsCheck: {
      certificateNumber: '001478952310',
      issueDate: '10/02/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '26/10/2026',
      statusResult: 'reviewed_suitable',
      suitabilityDecision: 'cleared_for_unsupervised_child_work',
      confidentialNotes: 'Reviewed by HR Vetting panel. SP30 speeding penalty declared & logged on transport register.'
    },
    rightToWork: {
      shareCode: 'RTW-4411-GBR',
      status: 'verified_indefinite',
      verifiedAt: '01/09/2022'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '10/02/2027', certNumber: 'SG-2024-4412' },
      firstAid: { completed: true, expiryDate: '14/11/2026', certNumber: 'FA-2023-9901' }, // Due in 17 days
      midas: { completed: true, expiryDate: '11/03/2027', certificateNo: 'MIDAS-2023-112' },
      pat: { completed: true, expiryDate: '11/03/2027', certNumber: 'PAT-2023-011' },
      wheelchairRestraints: { completed: true, expiryDate: '11/03/2027', certNumber: 'WAV-2023-882' }
    },
    assignments: {
      contractedHoursWeekly: 35,
      assignedDefaultVehicleReg: 'CB22 WPR',
      regularSchoolRoute: 'SCH-ROUTE-04 (Weatherfield Academy SEN)',
      preferredShift: 'Full Day Split',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    appDetails: {
      deviceModel: 'Apple iPhone 13 Pro',
      osVersion: 'iOS 17.5',
      appVersion: 'v2.4.0',
      lastLoginTimestamp: '2026-10-27 18:40',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'DEC Driver & PA Handbook 2026', version: 'v3.2', signedAt: '05/01/2026' },
        { id: 'pol-2', policyName: 'Central Beds Council SEN Escort Code of Practice', version: 'v2.0', signedAt: '10/02/2025' }
      ],
      offlineSyncStatus: {
        lastSyncTime: 'Yesterday 18:42',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '27/10/2026',
      reviewedBy: 'Rachel Adams (HR Vetting)',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-27 10:15', previousStatus: 'cleared', newStatus: 'restricted', changedBy: 'System (DVLA API Check)', reason: 'Flagged 6 penalty points. Required HR review under council 6+ points policy.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-27 10:15', action: 'Operational Clearance Set to Restricted', actor: 'Rachel Adams (HR)', details: 'Speeding endorsement flagged. Clearance restricted pending supervisory sign-off.', category: 'clearance' },
      { id: 'h-2', timestamp: '2026-10-20 16:30', action: 'Defect Report Intake: CB22 WPR', actor: 'Marcus Bell', details: 'Reported brake grinding noise. Vehicle taken VOR Off-Road.', category: 'assignment' }
    ]
  },
  {
    id: 'pa-01',
    staffId: 'DEC-PA-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@decgroup.co.uk',
    phone: '+44 7700 900789',
    role: 'pa', // Passenger Assistant Only (NO driving licence required!)
    companyId: 'dec-beds-schools',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    assignedDepot: 'Dunstable Depot',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'available',
    personalDetails: {
      dob: '29/03/1988',
      address: '9 High Street South, Dunstable, LU6 3HS',
      nationalInsuranceNumber: 'PL 89 22 40 A',
      emergencyContact: {
        name: 'Mark Jenkins',
        relation: 'Brother',
        phone: '+44 7700 900790'
      },
      startDate: '01/09/2023',
      employmentStatus: 'active'
    },
    // PA ONLY: NO driving licence, NO DVLA checks, NO taxi badge!
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
      suitabilityDecision: 'cleared_for_unsupervised_child_work',
      confidentialNotes: 'Enhanced Child Workforce DBS check certified. Update Service active.'
    },
    rightToWork: {
      shareCode: 'RTW-7711-GBR',
      status: 'verified_indefinite',
      verifiedAt: '01/09/2023'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '01/09/2027', certNumber: 'SG-2025-1192' },
      firstAid: { completed: true, expiryDate: '01/09/2027', certNumber: 'PFA-2025-004' },
      midas: { completed: false, expiryDate: 'N/A' }, // PAs do not need driver MiDAS, but PAT
      pat: { completed: true, expiryDate: '15/10/2027', certNumber: 'PAT-2025-442' }, // Passenger Assistant Training
      wheelchairRestraints: { completed: true, expiryDate: '15/10/2027', certNumber: 'WAV-2025-901' }
    },
    assignments: {
      contractedHoursWeekly: 25,
      regularSchoolRoute: 'SCH-ROUTE-01 (Priory Academy SEN AM/PM)',
      preferredShift: 'Morning Peak (AM)',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    appDetails: {
      deviceModel: 'Google Pixel 7',
      osVersion: 'Android 14',
      appVersion: 'v2.4.1',
      lastLoginTimestamp: '2026-10-28 08:00',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'Passenger Assistant Code of Conduct', version: 'v3.0', signedAt: '01/09/2025' },
        { id: 'pol-2', policyName: 'Child Safeguarding & Medical Emergency Protocol', version: 'v4.1', signedAt: '01/09/2025' }
      ],
      offlineSyncStatus: {
        lastSyncTime: '5 mins ago',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '20/10/2026',
      reviewedBy: 'Rachel Adams (HR Compliance Manager)',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-20 11:00', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'Rachel Adams', reason: 'Annual DBS Update Service check confirmed no change.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-28 08:45', action: 'Pupil Attendance AM Completed', actor: 'Sarah Jenkins', details: 'All 4 pupils on route SCH-ROUTE-01 boarded safely and harnessed.', category: 'app' },
      { id: 'h-2', timestamp: '2026-10-15 14:00', action: 'PAT (Passenger Assistant Training) Refreshed', actor: 'David Evans', details: 'PAT Certificate PAT-2025-442 issued for 2 years.', category: 'training' }
    ]
  },
  {
    id: 'drv-03',
    staffId: 'DEC-DRV-03',
    name: 'David O\'Connor',
    email: 'david.oc@decgroup.co.uk',
    phone: '+44 7700 900334',
    role: 'driver',
    companyId: 'dec-luton-airport',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
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
    personalDetails: {
      dob: '14/09/1982',
      address: '11 Park Street, Luton, LU1 3EP',
      nationalInsuranceNumber: 'KC 11 90 42 D',
      emergencyContact: {
        name: 'Sinead O\'Connor',
        relation: 'Spouse',
        phone: '+44 7700 900335'
      },
      startDate: '10/05/2020',
      employmentStatus: 'active'
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
      council: 'Luton Borough Council',
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
    rightToWork: {
      shareCode: 'RTW-8812-GBR',
      status: 'verified_indefinite',
      verifiedAt: '10/05/2020'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '18/06/2027', certNumber: 'SG-2024-9092' },
      firstAid: { completed: true, expiryDate: '20/10/2027', certNumber: 'FA-2024-3321' },
      midas: { completed: true, expiryDate: '05/02/2028', certificateNo: 'MIDAS-2024-511' },
      pat: { completed: false, expiryDate: 'N/A' },
      wheelchairRestraints: { completed: true, expiryDate: '05/02/2028', certNumber: 'WAV-2024-118' }
    },
    assignments: {
      contractedHoursWeekly: 40,
      assignedDefaultVehicleReg: 'BD24 TYU',
      preferredShift: 'Airport Night Shift',
      workingDays: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon']
    },
    appDetails: {
      deviceModel: 'Samsung Galaxy A54',
      osVersion: 'Android 13',
      appVersion: 'v2.4.1',
      lastLoginTimestamp: '2026-10-28 10:15',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'DEC Driver Handbook', version: 'v3.2', signedAt: '10/01/2026' }
      ],
      offlineSyncStatus: {
        lastSyncTime: '10 mins ago',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '18/10/2026',
      reviewedBy: 'Rachel Adams',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-18 10:00', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'System', reason: 'DBS Update check verified.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-28 12:45', action: 'Walkaround Inspection Completed', actor: 'David O\'Connor', details: 'Vehicle BD24 TYU check passed with zero advisories.', category: 'app' }
    ]
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
    personalDetails: {
      dob: '10/12/1988',
      address: '55 Dunstable Road, Luton, LU1 1AL',
      nationalInsuranceNumber: 'TR 22 77 91 C',
      emergencyContact: {
        name: 'Farah Haque',
        relation: 'Spouse',
        phone: '+44 7700 900552'
      },
      startDate: '15/07/2023',
      employmentStatus: 'active'
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
      council: 'Luton Borough Council',
      expiryDate: '10/03/2027'
    },
    medicalReviewDate: '15/07/2028',
    dbsCheck: {
      certificateNumber: '001601245781',
      issueDate: '22/07/2025',
      updateServiceRegistered: true,
      lastCheckedDate: '22/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    rightToWork: {
      shareCode: 'RTW-3319-GBR',
      status: 'verified_indefinite',
      verifiedAt: '15/07/2023'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '22/07/2027', certNumber: 'SG-2025-771' },
      firstAid: { completed: true, expiryDate: '22/07/2027', certNumber: 'FA-2025-102' },
      midas: { completed: false, expiryDate: 'N/A' },
      pat: { completed: false, expiryDate: 'N/A' },
      wheelchairRestraints: { completed: false, expiryDate: 'N/A' }
    },
    assignments: {
      contractedHoursWeekly: 37.5,
      assignedDefaultVehicleReg: 'VA73 STU',
      preferredShift: 'Morning Peak (AM)',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    appDetails: {
      deviceModel: 'OnePlus 11 5G',
      osVersion: 'Android 14',
      appVersion: 'v2.4.1',
      lastLoginTimestamp: '2026-10-28 09:10',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'DEC Driver Handbook', version: 'v3.2', signedAt: '20/07/2025' }
      ],
      offlineSyncStatus: {
        lastSyncTime: 'Just now',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '22/10/2026',
      reviewedBy: 'Rachel Adams',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-22 15:00', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'Rachel Adams', reason: 'DBS Update check verified.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-28 11:20', action: 'En Route to London Luton Airport T1', actor: 'Kamran Haque', details: 'Assigned booking DEC-2026-9042.', category: 'assignment' }
    ]
  },
  {
    id: 'pa-02',
    staffId: 'DEC-PA-02',
    name: 'Fatima Al-Mansoor',
    email: 'fatima.m@decgroup.co.uk',
    phone: '+44 7700 900662',
    role: 'pa', // Passenger Assistant Only (NO driving licence!)
    companyId: 'dec-beds-schools',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    assignedDepot: 'Luton Central Depot',
    operationalClearance: 'cleared',
    onDuty: true,
    dutyStatus: 'available',
    personalDetails: {
      dob: '05/06/1990',
      address: '32 Bury Park Road, Luton, LU1 1HB',
      nationalInsuranceNumber: 'WE 90 12 34 B',
      emergencyContact: {
        name: 'Zaid Al-Mansoor',
        relation: 'Spouse',
        phone: '+44 7700 900663'
      },
      startDate: '01/09/2024',
      employmentStatus: 'active'
    },
    paAuthorisation: {
      authorisationId: 'CBC-PA-9104',
      councilApproval: 'Central Bedfordshire Council Education Authority',
      expiryDate: '31/08/2028',
      pairedSchoolRouteId: 'SCH-ROUTE-02'
    },
    dbsCheck: {
      certificateNumber: '001712093845',
      issueDate: '01/08/2024',
      updateServiceRegistered: true,
      lastCheckedDate: '15/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work',
      confidentialNotes: 'Enhanced Child Workforce DBS verified. Full SEN clearance.'
    },
    rightToWork: {
      shareCode: 'RTW-5509-GBR',
      status: 'verified_indefinite',
      verifiedAt: '01/08/2024'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '01/08/2027', certNumber: 'SG-2024-998' },
      firstAid: { completed: true, expiryDate: '01/08/2027', certNumber: 'PFA-2024-881' },
      midas: { completed: false, expiryDate: 'N/A' },
      pat: { completed: true, expiryDate: '01/08/2027', certNumber: 'PAT-2024-109' },
      wheelchairRestraints: { completed: true, expiryDate: '01/08/2027', certNumber: 'WAV-2024-332' }
    },
    assignments: {
      contractedHoursWeekly: 20,
      regularSchoolRoute: 'SCH-ROUTE-02 (Oak Bank SEN School)',
      preferredShift: 'Afternoon Peak (PM)',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    appDetails: {
      deviceModel: 'Apple iPhone 14',
      osVersion: 'iOS 17.6',
      appVersion: 'v2.4.1',
      lastLoginTimestamp: '2026-10-28 07:45',
      pushEnabled: true,
      policySignoffs: [
        { id: 'pol-1', policyName: 'Passenger Assistant Code of Conduct', version: 'v3.0', signedAt: '01/09/2024' }
      ],
      offlineSyncStatus: {
        lastSyncTime: '12 mins ago',
        pendingDrafts: 0,
        syncHealth: 'healthy'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '15/10/2026',
      reviewedBy: 'Rachel Adams',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-15 09:00', previousStatus: 'cleared', newStatus: 'cleared', changedBy: 'Rachel Adams', reason: 'Annual review passed.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-28 08:30', action: 'Pupil Run Completed Safely', actor: 'Fatima Al-Mansoor', details: 'SCH-ROUTE-02 morning drop-off recorded with signature.', category: 'app' }
    ]
  },
  {
    id: 'drv-05',
    staffId: 'DEC-DRV-05',
    name: 'Arthur Pendelton',
    email: 'arthur.p@decgroup.co.uk',
    phone: '+44 7700 900882',
    role: 'driver',
    companyId: 'dec-executive',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    assignedDepot: 'Luton Central Depot',
    operationalClearance: 'restricted',
    clearanceReason: 'DVLA Group 2 Medical Examination expired on 15/10/2026 (-13 days). Dispatch allocation hard-blocked.',
    onDuty: false,
    dutyStatus: 'off_duty',
    personalDetails: {
      dob: '22/01/1958',
      address: '8 Old Bedford Road, Luton, LU2 7NX',
      nationalInsuranceNumber: 'JK 66 11 09 A',
      emergencyContact: {
        name: 'Dorothy Pendelton',
        relation: 'Spouse',
        phone: '+44 7700 900883'
      },
      startDate: '10/01/2018',
      employmentStatus: 'suspended'
    },
    drivingLicence: {
      licenceNumber: 'PENDE580122A09ZZ',
      categories: ['B', 'D1'],
      photocardExpiry: '22/01/2027',
      penaltyPoints: 0,
      endorsementsCount: 0,
      dvlaLastCheckDate: '15/10/2026',
      dvlaStatus: 'valid'
    },
    taxiBadge: {
      badgeNumber: 'LBC-PHD-5510',
      council: 'Luton Borough Council',
      expiryDate: '15/01/2027'
    },
    medicalReviewDate: '15/10/2026', // EXPIRED!
    dbsCheck: {
      certificateNumber: '001429019284',
      issueDate: '12/03/2024',
      updateServiceRegistered: true,
      lastCheckedDate: '15/10/2026',
      statusResult: 'no_content',
      suitabilityDecision: 'cleared_for_unsupervised_child_work'
    },
    rightToWork: {
      shareCode: 'RTW-1102-GBR',
      status: 'verified_indefinite',
      verifiedAt: '10/01/2018'
    },
    training: {
      safeguarding: { completed: true, expiryDate: '12/03/2027', certNumber: 'SG-2024-118' },
      firstAid: { completed: true, expiryDate: '12/03/2027', certNumber: 'FA-2024-902' },
      midas: { completed: true, expiryDate: '15/04/2027', certificateNo: 'MIDAS-2023-441' },
      pat: { completed: false, expiryDate: 'N/A' },
      wheelchairRestraints: { completed: true, expiryDate: '15/04/2027', certNumber: 'WAV-2023-110' }
    },
    assignments: {
      contractedHoursWeekly: 0,
      preferredShift: 'Morning Peak (AM)',
      workingDays: []
    },
    appDetails: {
      deviceModel: 'Samsung Galaxy A32',
      osVersion: 'Android 12',
      appVersion: 'v2.3.9',
      lastLoginTimestamp: '2026-10-14 17:30',
      pushEnabled: false,
      policySignoffs: [
        { id: 'pol-1', policyName: 'DEC Driver Handbook', version: 'v3.1', signedAt: '15/01/2025' }
      ],
      offlineSyncStatus: {
        lastSyncTime: '14 days ago',
        pendingDrafts: 0,
        syncHealth: 'offline'
      }
    },
    clearanceDetails: {
      lastReviewedDate: '15/10/2026',
      reviewedBy: 'Rachel Adams (HR Compliance Manager)',
      auditTrail: [
        { id: 'cl-1', timestamp: '2026-10-15 08:00', previousStatus: 'cleared', newStatus: 'restricted', changedBy: 'System (Medical Expiry Gate)', reason: 'Statutory Group 2 medical review expired. Hard stop enforced under council PHV conditions.' }
      ]
    },
    historyTimeline: [
      { id: 'h-1', timestamp: '2026-10-15 08:00', action: 'Hard Dispatch Block Applied (Expired Medical)', actor: 'Safety Engine', details: 'Group 2 D4 medical expired on 15/10/2026. Driver barred from booking allocation.', category: 'clearance' }
    ]
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

export const initialChecklistVersions: ChecklistVersion[] = [
  {
    version: 'v2.4',
    status: 'active',
    publishedAt: '15/10/2026',
    publishedBy: 'Alan Cooper (Fleet Compliance Manager)',
    items: [
      { id: 'chk-i1', label: 'Tyres, Pressure & Legal Tread Depth (min 1.6mm)', category: 'mechanical', requiresPhotoOnFail: true },
      { id: 'chk-i2', label: 'Service Brakes, Handbrake & ABS Warning Dashboard Lights', category: 'mechanical', requiresPhotoOnFail: false },
      { id: 'chk-i3', label: 'Exterior Headlights, Sidelights, Brake Lights & Indicators', category: 'exterior', requiresPhotoOnFail: true },
      { id: 'chk-i4', label: 'Windscreen, Wipers, Washers & All Mirrors', category: 'exterior', requiresPhotoOnFail: false },
      { id: 'chk-i5', label: 'Wheelchair Ramp / Hydraulic Tail Lift Certified Operation', category: 'accessibility', requiresPhotoOnFail: true, wavOnly: true },
      { id: 'chk-i6', label: 'Wheelchair Floor Tracking & 4-Point Tie-Down Restraints', category: 'accessibility', requiresPhotoOnFail: true, wavOnly: true },
      { id: 'chk-i7', label: 'Fire Extinguisher (In-Date Pressure Gauge) & First Aid Kit', category: 'safety', requiresPhotoOnFail: true },
      { id: 'chk-i8', label: 'Council Private Hire Vehicle Licence Plates & Roof Sign', category: 'exterior', requiresPhotoOnFail: false }
    ]
  },
  {
    version: 'v2.3',
    status: 'archived',
    publishedAt: '01/08/2026',
    publishedBy: 'Alan Cooper (Fleet Compliance Manager)',
    items: [
      { id: 'chk-v23-1', label: 'Tyres & Brakes Pre-Use Verification', category: 'mechanical', requiresPhotoOnFail: true },
      { id: 'chk-v23-2', label: 'Exterior Lights & Warning Markers', category: 'exterior', requiresPhotoOnFail: false },
      { id: 'chk-v23-3', label: 'Wheelchair Ramp Emergency Deploy', category: 'accessibility', requiresPhotoOnFail: true, wavOnly: true },
      { id: 'chk-v23-4', label: 'Safety Equipment & Hi-Vis Vests', category: 'safety', requiresPhotoOnFail: false }
    ]
  }
];

export const initialWorkshopSlots: WorkshopSlot[] = [
  {
    id: 'ws-01',
    vehicleReg: 'CB22 WPR',
    bayNumber: 1,
    date: '2026-10-28',
    startTime: '14:00',
    endTime: '17:30',
    repairType: 'Emergency Brake Pads & Fluid Overhaul (Critical VOR)',
    technician: 'Dave Reynolds (Master Tech)',
    status: 'scheduled',
    defectRef: 'DEF-104'
  },
  {
    id: 'ws-02',
    vehicleReg: 'LT73 XKL',
    bayNumber: 2,
    date: '2026-10-29',
    startTime: '09:00',
    endTime: '11:00',
    repairType: 'Pre-DVSA MOT Headlamp Alignment & Advisory Check',
    technician: 'Chris Evans',
    status: 'scheduled'
  },
  {
    id: 'ws-03',
    vehicleReg: 'VA73 STU',
    bayNumber: 3,
    date: '2026-10-30',
    startTime: '13:00',
    endTime: '15:30',
    repairType: 'EV High-Voltage Inverter Check & Cabin Filter',
    technician: 'Elec-Tech Services',
    status: 'scheduled'
  }
];

export const initialRequirementTemplates: RequirementTemplate[] = [
  {
    id: 'req-tpl-01',
    roleType: 'driver',
    title: 'Statutory Private Hire Driver (Luton & Central Beds)',
    councilScope: 'Luton Borough Council & Central Bedfordshire Council',
    description: 'Mandatory standard compliance bundle required for all PHV drivers operating under DEC operator licences.',
    mandatoryDocuments: [
      { code: 'DVLA_PHOTO', label: 'DVLA Photocard Driving Licence (Cat B/D1)', renewalCycleMonths: 120, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'DVLA_POINTS', label: 'DVLA Electronic Driving Record Check (<9 pts)', renewalCycleMonths: 6, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'COUNCIL_BADGE', label: 'Council Private Hire Driver Badge', renewalCycleMonths: 36, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'ENHANCED_DBS', label: 'Enhanced DBS Check & Update Service Verification', renewalCycleMonths: 12, hardBlockOnExpiry: true, category: 'vetting' },
      { code: 'GROUP2_MED', label: 'DVLA Group 2 Medical Examination (Form D4)', renewalCycleMonths: 60, hardBlockOnExpiry: true, category: 'medical' },
      { code: 'SAFEGUARDING', label: 'Safeguarding Children & Vulnerable Adults', renewalCycleMonths: 36, hardBlockOnExpiry: true, category: 'training' },
      { code: 'FIRST_AID', label: 'Emergency First Aid at Work (EFAW)', renewalCycleMonths: 36, hardBlockOnExpiry: false, category: 'training' },
      { code: 'MIDAS_ACC', label: 'MiDAS Accessible Minibus Driver Certificate', renewalCycleMonths: 48, hardBlockOnExpiry: false, category: 'training' }
    ]
  },
  {
    id: 'req-tpl-02',
    roleType: 'pa',
    title: 'Passenger Assistant / SEN Escort (Council Education Standard)',
    councilScope: 'Central Bedfordshire Council & Luton Education Authority',
    description: 'Standards for non-driving escorts accompanying Special Educational Needs (SEN) pupils. NO driving licence or taxi badge required.',
    mandatoryDocuments: [
      { code: 'PA_AUTH', label: 'Council Passenger Assistant Authorisation & ID', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'ENHANCED_CHILD_DBS', label: 'Enhanced Child Workforce DBS + Barred List Check', renewalCycleMonths: 12, hardBlockOnExpiry: true, category: 'vetting' },
      { code: 'PAT_TRAINING', label: 'PAT (Passenger Assistant Training Scheme)', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'training' },
      { code: 'SEN_SAFEGUARD', label: 'SEN Transport Safeguarding & Child Protection', renewalCycleMonths: 12, hardBlockOnExpiry: true, category: 'training' },
      { code: 'PAED_FIRST_AID', label: 'Paediatric & Emergency First Aid', renewalCycleMonths: 24, hardBlockOnExpiry: false, category: 'training' },
      { code: 'RESTRAINT_WAV', label: 'Wheelchair Harness & Floor Tracking Restraints', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'training' }
    ]
  },
  {
    id: 'req-tpl-03',
    roleType: 'dual_driver_pa',
    title: 'Dual-Role (Driver & Passenger Assistant Combined)',
    councilScope: 'All Consortia Authorities',
    description: 'Complete cross-functional compliance profile enabling both sole driving and dedicated SEN child accompaniment.',
    mandatoryDocuments: [
      { code: 'DVLA_PHOTO', label: 'DVLA Photocard Driving Licence (Cat B/D1)', renewalCycleMonths: 120, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'COUNCIL_BADGE', label: 'Council Private Hire Driver Badge', renewalCycleMonths: 36, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'PA_AUTH', label: 'Council PA Authorisation Badge', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'licence' },
      { code: 'ENHANCED_DBS', label: 'Enhanced Child & Adult DBS with Update Service', renewalCycleMonths: 12, hardBlockOnExpiry: true, category: 'vetting' },
      { code: 'GROUP2_MED', label: 'DVLA Group 2 Medical Form D4', renewalCycleMonths: 60, hardBlockOnExpiry: true, category: 'medical' },
      { code: 'PAT_TRAINING', label: 'PAT Passenger Assistant Training', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'training' },
      { code: 'SAFEGUARDING', label: 'Safeguarding Children & Vulnerable Adults', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'training' },
      { code: 'RESTRAINT_WAV', label: 'Wheelchair Tie-Downs & Occupant Restraints', renewalCycleMonths: 24, hardBlockOnExpiry: true, category: 'training' }
    ]
  }
];

export const initialComplianceReminders: ComplianceReminder[] = [
  {
    id: 'rem-01',
    staffId: 'drv-02',
    staffName: 'Marcus Bell',
    role: 'dual_driver_pa',
    documentType: 'Council Private Hire Badge (CBC-PHD-3041)',
    expiryDate: '15/11/2026',
    daysRemaining: 18,
    status: 'due_soon',
    notificationSent: true,
    lastRemindedDate: '26/10/2026'
  },
  {
    id: 'rem-02',
    staffId: 'drv-02',
    staffName: 'Marcus Bell',
    role: 'dual_driver_pa',
    documentType: 'Emergency First Aid at Work (FA-2023-9901)',
    expiryDate: '14/11/2026',
    daysRemaining: 17,
    status: 'critical_urgent',
    notificationSent: true,
    lastRemindedDate: '27/10/2026'
  },
  {
    id: 'rem-03',
    staffId: 'drv-05',
    staffName: 'Arthur Pendelton',
    role: 'driver',
    documentType: 'DVLA Group 2 Medical Examination (Form D4)',
    expiryDate: '15/10/2026',
    daysRemaining: -13,
    status: 'expired',
    notificationSent: true,
    lastRemindedDate: '15/10/2026'
  },
  {
    id: 'rem-04',
    staffId: 'drv-01',
    staffName: 'Tariq Mahmood',
    role: 'driver',
    documentType: 'Annual Enhanced DBS Update Service Check',
    expiryDate: '15/12/2026',
    daysRemaining: 48,
    status: 'due_soon',
    notificationSent: false
  }
];



