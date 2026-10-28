import {
  LicenceCheckRecord,
  DbsRecord,
  DbsAccessLogEntry,
  VehicleServiceSchedule,
  CostLedgerItem,
  DriverExpenseRecord,
  AccidentIncidentReport,
  GreyFleetRecord,
  ReminderNotificationItem
} from '../types/phase10';

export const mockLicenceChecks: LicenceCheckRecord[] = [
  {
    id: 'LIC-001',
    driverId: 'DEC-DRV-01',
    driverName: 'Tariq Mahmood',
    licenceNumber: 'MAHMO709124TM9UK',
    lastCheckDate: '15/10/2026',
    nextCheckDue: '15/11/2026',
    annualDeclarationDate: '01/06/2026',
    declarationStatus: 'valid',
    points: 3,
    endorsements: [
      {
        code: 'SP30',
        points: 3,
        date: '12/03/2025',
        description: 'Exceeding statutory speed limit on a public road (34 in 30mph zone, Dunstable Road)',
        expiry: '12/03/2028'
      }
    ],
    status: 'ready',
    hasChangedResult: false,
    lastDvlaGatewayResponse: 'pass',
    dvlaAuditRef: 'DVLA-ADD-2026-98812'
  },
  {
    id: 'LIC-002',
    driverId: 'DEC-DRV-02',
    driverName: 'Sarah Jenkins',
    licenceNumber: 'JENKI805041SJ8GB',
    lastCheckDate: '18/10/2026',
    nextCheckDue: '18/11/2026',
    annualDeclarationDate: '10/05/2026',
    declarationStatus: 'valid',
    points: 0,
    endorsements: [],
    status: 'ready',
    hasChangedResult: false,
    lastDvlaGatewayResponse: 'pass',
    dvlaAuditRef: 'DVLA-ADD-2026-98834'
  },
  {
    id: 'LIC-003',
    driverId: 'DEC-DRV-03',
    driverName: 'Marcus Thorne',
    licenceNumber: 'THORN751203MT4UK',
    lastCheckDate: '24/10/2026',
    nextCheckDue: '24/11/2026',
    annualDeclarationDate: '14/02/2026',
    declarationStatus: 'valid',
    points: 6,
    endorsements: [
      {
        code: 'CU80',
        points: 3,
        date: '14/08/2024',
        description: 'Breach of requirements as to control of the vehicle (mobile phone hands-free distraction)',
        expiry: '14/08/2027'
      },
      {
        code: 'SP50',
        points: 3,
        date: '22/10/2026',
        description: 'Exceeding speed limit on a motorway (M1 J10 to J11 southbound)',
        expiry: '22/10/2029'
      }
    ],
    status: 'blocked',
    hasChangedResult: true,
    changedResultNote: 'ALERT: 3 new points endorsed on 22/10/2026 (SP50). Total points now 6. Automatically triggered driver suspension pending manager interview.',
    lastDvlaGatewayResponse: 'pass',
    dvlaAuditRef: 'DVLA-ADD-2026-99002'
  },
  {
    id: 'LIC-004',
    driverId: 'DEC-DRV-04',
    driverName: 'Chloe Bennett',
    licenceNumber: 'BENNE820915CB2UK',
    lastCheckDate: '20/09/2026',
    nextCheckDue: '20/10/2026',
    annualDeclarationDate: '19/10/2025',
    declarationStatus: 'expired',
    points: 0,
    endorsements: [],
    status: 'due_soon',
    hasChangedResult: false,
    changedResultNote: 'Annual Driver Health & Convictions Declaration expired on 19/10/2026. Electronic declaration sign-off required.',
    lastDvlaGatewayResponse: 'pass',
    dvlaAuditRef: 'DVLA-ADD-2026-97645'
  },
  {
    id: 'LIC-005',
    driverId: 'DEC-DRV-05',
    driverName: 'Liam Davies',
    licenceNumber: 'DAVIE880112LD5GB',
    lastCheckDate: '26/10/2026',
    nextCheckDue: '27/10/2026',
    annualDeclarationDate: '12/04/2026',
    declarationStatus: 'valid',
    points: 0,
    endorsements: [],
    status: 'verification_pending',
    hasChangedResult: false,
    changedResultNote: 'DVLA ADD Gateway returned HTTP 504 Gateway Timeout. Re-query scheduled automatically for overnight batch.',
    lastDvlaGatewayResponse: 'timeout',
    dvlaAuditRef: 'DVLA-ADD-2026-ERR-091'
  }
];

export const mockDbsRecords: DbsRecord[] = [
  {
    id: 'DBS-001',
    staffId: 'DEC-DRV-01',
    staffName: 'Tariq Mahmood',
    staffRole: 'driver',
    certificateReference: '001784920194',
    issueDate: '14/06/2024',
    level: 'Enhanced with Children & Adults Barred List',
    updateServiceConsent: 'valid_consent',
    latestStatus: 'no_information_recorded',
    nextReviewDate: '14/06/2027',
    suitabilityDecision: 'approved_sen',
    suitabilityNotes: 'No police cautions, reprimands or barred list entries recorded. Cleared for unsupervised SEN student transport in Central Bedfordshire & Luton.',
    operationalClearance: 'cleared'
  },
  {
    id: 'DBS-002',
    staffId: 'DEC-PA-01',
    staffName: 'Elena Rostova',
    staffRole: 'pa',
    certificateReference: '001839201945',
    issueDate: '11/02/2025',
    level: 'Enhanced with Children & Adults Barred List',
    updateServiceConsent: 'valid_consent',
    latestStatus: 'no_information_recorded',
    nextReviewDate: '11/02/2028',
    suitabilityDecision: 'approved_sen',
    suitabilityNotes: 'Clean certificate. Fully cleared for complex medical and non-verbal pupil passenger assistance.',
    operationalClearance: 'cleared'
  },
  {
    id: 'DBS-003',
    staffId: 'DEC-DRV-03',
    staffName: 'Marcus Thorne',
    staffRole: 'driver',
    certificateReference: '001692019231',
    issueDate: '05/11/2023',
    level: 'Enhanced with Children & Adults Barred List',
    updateServiceConsent: 'renewal_required',
    latestStatus: 'under_review',
    nextReviewDate: '05/11/2026',
    suitabilityDecision: 'under_safeguarding_review',
    suitabilityNotes: 'Update Service direct debit failed at DBS Agency. Consent renewal form dispatched. Recheck pending prior to 05/11/2026 contract audit.',
    operationalClearance: 'pending'
  },
  {
    id: 'DBS-004',
    staffId: 'DEC-PA-02',
    staffName: 'David Miller',
    staffRole: 'pa',
    certificateReference: '001928374612',
    issueDate: '20/08/2024',
    level: 'Enhanced with Children & Adults Barred List',
    updateServiceConsent: 'valid_consent',
    latestStatus: 'no_information_recorded',
    nextReviewDate: '20/08/2027',
    suitabilityDecision: 'approved_sen',
    suitabilityNotes: 'Enhanced certificate verified against Barred Lists. Suitable for SEN escort.',
    operationalClearance: 'cleared'
  }
];

export const mockDbsAccessLogs: DbsAccessLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '28/10/2026 09:14',
    viewerName: 'Eleanor Vance',
    viewerRole: 'HR Compliance Lead',
    recordStaffName: 'Tariq Mahmood',
    action: 'VIEW_CERTIFICATE',
    reason: 'Quarterly Central Bedfordshire Council Contract Compliance Audit'
  },
  {
    id: 'LOG-002',
    timestamp: '27/10/2026 14:32',
    viewerName: 'Arthur Pendergast',
    viewerRole: 'Head Office Admin',
    recordStaffName: 'Marcus Thorne',
    action: 'SUITABILITY_UPDATE',
    reason: 'Flagged Update Service consent renewal deadline'
  },
  {
    id: 'LOG-003',
    timestamp: '25/10/2026 11:05',
    viewerName: 'Eleanor Vance',
    viewerRole: 'HR Compliance Lead',
    recordStaffName: 'Elena Rostova',
    action: 'EXPORT_AUDIT',
    reason: 'Submission of anonymised compliance register to Luton Borough Council'
  }
];

export const mockServiceSchedules: VehicleServiceSchedule[] = [
  {
    vehicleReg: 'BD24 TYU',
    makeModel: 'Ford Transit Custom 9-Seater',
    currentOdometerMiles: 34250,
    lastOdometerUpdateDate: '26/10/2026',
    isMileageStale: false,
    lastServiceDate: '28/04/2026',
    lastServiceMileage: 24000,
    serviceIntervalMonths: 12,
    serviceIntervalMiles: 12000,
    nextServiceDateDue: '28/04/2027',
    nextServiceMileageDue: 36000,
    limitingFactor: 'earlier_by_mileage',
    calculatedNextService: '36,000 miles (1,750 mi remaining)',
    reminderMilestone: '1000_miles',
    history: [
      {
        id: 'SRV-001',
        serviceDate: '28/04/2026',
        odometerMiles: 24000,
        serviceType: 'major_annual',
        workshopGarage: 'Dunstable Fleet Care Workshop Ltd',
        invoiceRef: 'INV-DFCW-8219',
        technicianNotes: 'Full synthetic oil change, fuel filter, pollen filter, front brake pad replacement (8mm remaining).',
        costGbp: 345.00
      },
      {
        id: 'SRV-002',
        serviceDate: '12/10/2025',
        odometerMiles: 12100,
        serviceType: 'minor_interim',
        workshopGarage: 'Dunstable Fleet Care Workshop Ltd',
        invoiceRef: 'INV-DFCW-7640',
        technicianNotes: 'Interim oil and filter, multi-point safety check, tyre pressure check.',
        costGbp: 185.00
      }
    ]
  },
  {
    vehicleReg: 'KU23 EWX',
    makeModel: 'Mercedes-Benz V-Class Chauffeur',
    currentOdometerMiles: 42800,
    lastOdometerUpdateDate: '16/10/2026', // Stale reading (> 7 days)
    isMileageStale: true,
    lastServiceDate: '15/10/2025',
    lastServiceMileage: 31000,
    serviceIntervalMonths: 12,
    serviceIntervalMiles: 15000,
    nextServiceDateDue: '15/10/2026', // Overdue by date
    nextServiceMileageDue: 46000,
    limitingFactor: 'earlier_by_date',
    calculatedNextService: '15/10/2026 (OVERDUE by date)',
    reminderMilestone: 'overdue',
    history: [
      {
        id: 'SRV-003',
        serviceDate: '15/10/2025',
        odometerMiles: 31000,
        serviceType: 'major_annual',
        workshopGarage: 'Mercedes-Benz Van Centre Luton',
        invoiceRef: 'MB-LUT-44910',
        technicianNotes: 'Service B completed. Transmission fluid refreshed, rear diff oil inspected, air conditioning regas.',
        costGbp: 640.00
      }
    ]
  },
  {
    vehicleReg: 'LX72 GHY',
    makeModel: 'Peugeot Boxer Accessible Tail-Lift',
    currentOdometerMiles: 58100,
    lastOdometerUpdateDate: '27/10/2026',
    isMileageStale: false,
    lastServiceDate: '14/11/2025',
    lastServiceMileage: 46500,
    serviceIntervalMonths: 12,
    serviceIntervalMiles: 12500,
    nextServiceDateDue: '14/11/2026', // Due in 17 days
    nextServiceMileageDue: 59000,
    limitingFactor: 'earlier_by_mileage',
    calculatedNextService: '59,000 miles (900 mi remaining)',
    reminderMilestone: '1000_miles',
    history: [
      {
        id: 'SRV-004',
        serviceDate: '14/11/2025',
        odometerMiles: 46500,
        serviceType: 'major_annual',
        workshopGarage: 'Dunstable Fleet Care Workshop Ltd',
        invoiceRef: 'INV-DFCW-7991',
        technicianNotes: 'Engine service plus LOLER certified tail-lift hydraulic inspection and pressure load test.',
        costGbp: 480.00
      }
    ]
  }
];

export const mockCostLedger: CostLedgerItem[] = [
  {
    id: 'CST-001',
    jobId: 'DEF-2026-001',
    jobRef: 'DEF-001 (BD24 TYU)',
    vehicleReg: 'BD24 TYU',
    category: 'brake_overhaul',
    quoteCostGbp: 210.00,
    approvedCostGbp: 210.00,
    actualInvoicedCostGbp: 228.00,
    partsCostGbp: 110.00,
    labourCostGbp: 80.00,
    vatAmountGbp: 38.00,
    invoiceRef: 'INV-DFCW-8841',
    approvalStatus: 'approved_controller',
    approvedBy: 'Samira Khan (Controller)',
    spendingTier: 'under_250_controller',
    notes: 'Front brake discs and pads replaced following daily check squeal report.'
  },
  {
    id: 'CST-002',
    jobId: 'DEF-2026-002',
    jobRef: 'DEF-002 (KU23 EWX)',
    vehicleReg: 'KU23 EWX',
    category: 'routine_service',
    quoteCostGbp: 580.00,
    approvedCostGbp: 580.00,
    actualInvoicedCostGbp: 580.00,
    partsCostGbp: 290.00,
    labourCostGbp: 193.33,
    vatAmountGbp: 96.67,
    invoiceRef: 'INV-MB-44988',
    approvalStatus: 'approved_director',
    approvedBy: 'Arthur Pendergast (Owner / Director)',
    spendingTier: 'over_250_director',
    notes: 'Major Mercedes-Benz executive service B with brake fluid flush. Exceeded £250 controller authority; approved by Director.'
  },
  {
    id: 'CST-003',
    jobId: 'DEF-2026-003',
    jobRef: 'DEF-003 (LX72 GHY)',
    vehicleReg: 'LX72 GHY',
    category: 'inspection',
    quoteCostGbp: 180.00,
    approvedCostGbp: 180.00,
    actualInvoicedCostGbp: 180.00,
    partsCostGbp: 30.00,
    labourCostGbp: 120.00,
    vatAmountGbp: 30.00,
    invoiceRef: 'INV-DFCW-8899',
    approvalStatus: 'approved_controller',
    approvedBy: 'Samira Khan (Controller)',
    spendingTier: 'under_250_controller',
    notes: 'LOLER 6-monthly statutory passenger tail-lift hydraulic certificate inspection.'
  },
  {
    id: 'CST-004',
    jobId: 'DEF-2026-004',
    jobRef: 'DEF-004 (BD24 TYU)',
    vehicleReg: 'BD24 TYU',
    category: 'tyre_replacement',
    quoteCostGbp: 310.00,
    approvedCostGbp: 310.00,
    actualInvoicedCostGbp: 295.00,
    partsCostGbp: 210.00,
    labourCostGbp: 35.83,
    vatAmountGbp: 49.17,
    invoiceRef: 'INV-TYR-9921',
    creditNoteRef: 'CR-TYR-004',
    approvalStatus: 'approved_director',
    approvedBy: 'Arthur Pendergast (Owner / Director)',
    spendingTier: 'over_250_director',
    notes: '2x Michelin CrossClimate front commercial tyres fitted with wheel alignment balance.'
  }
];

export const mockDriverExpenses: DriverExpenseRecord[] = [
  {
    id: 'EXP-001',
    driverId: 'DEC-DRV-01',
    driverName: 'Tariq Mahmood',
    vehicleReg: 'BD24 TYU',
    category: 'fuel_diesel',
    amountGbp: 68.50,
    litresOrKwh: 48.2,
    date: '27/10/2026 18:40',
    receiptPhotoUrl: '/receipts/fuel_shell_01.jpg',
    status: 'submitted',
    reviewNotes: 'Shell Dunstable Road. Odometer 34,250 confirmed on forecourt receipt.'
  },
  {
    id: 'EXP-002',
    driverId: 'DEC-DRV-02',
    driverName: 'Sarah Jenkins',
    vehicleReg: 'KU23 EWX',
    category: 'ev_charging',
    amountGbp: 24.80,
    litresOrKwh: 36.4,
    date: '27/10/2026 14:15',
    receiptPhotoUrl: '/receipts/gridserve_luton.jpg',
    status: 'approved',
    reviewedBy: 'Samira Khan (Controller)',
    reviewNotes: 'Gridserve Ultra-Rapid DC charge prior to London Heathrow VIP pick-up.'
  },
  {
    id: 'EXP-003',
    driverId: 'DEC-DRV-03',
    driverName: 'Marcus Thorne',
    vehicleReg: 'KU23 EWX',
    category: 'parking_tolls',
    amountGbp: 14.50,
    date: '26/10/2026 16:30',
    receiptPhotoUrl: '/receipts/heathrow_parking.jpg',
    status: 'reimbursed',
    reviewedBy: 'Arthur Pendergast',
    reimbursementBatchRef: 'BACS-REIMB-OCT-W4',
    reviewNotes: 'Heathrow Terminal 5 Short Stay Meet & Greet parking ticket.'
  },
  {
    id: 'EXP-004',
    driverId: 'DEC-DRV-01',
    driverName: 'Tariq Mahmood',
    vehicleReg: 'BD24 TYU',
    category: 'adblue',
    amountGbp: 18.99,
    litresOrKwh: 10.0,
    date: '25/10/2026 08:20',
    receiptPhotoUrl: '/receipts/adblue_bp.jpg',
    status: 'approved',
    reviewedBy: 'Samira Khan (Controller)',
    reviewNotes: 'Euro 6 AdBlue top-up prior to morning school run.'
  }
];

export const mockAccidentReports: AccidentIncidentReport[] = [
  {
    id: 'INC-2026-003',
    reportRef: 'INC-ACC-2026-003',
    dateTime: '26/10/2026 11:45',
    driverId: 'DEC-DRV-01',
    driverName: 'Tariq Mahmood',
    vehicleReg: 'BD24 TYU',
    location: 'A505 Poynters Road roundabout, Dunstable, LU5 4TP',
    drivableStatus: 'drivable',
    policeRefCAD: 'CAD-7821-26OCT26',
    thirdPartyVehicle: {
      reg: 'FE19 KPL',
      makeModel: 'Vauxhall Astra Hatchback Blue',
      driverName: 'John Davies',
      contactPhone: '07700 900421',
      insurer: 'Direct Line Insurance Ltd',
      policyNumber: 'DL-889102-M'
    },
    witnesses: [
      {
        name: 'Rachel Adams',
        phone: '07700 900654',
        statementSummary: 'Third party failed to give way entering roundabout, clipping near-side rear wing of minibus.'
      }
    ],
    photoCount: 4,
    photoUrls: [
      '/incidents/bd24_rear_wing.jpg',
      '/incidents/fe19_front_bumper.jpg',
      '/incidents/roundabout_context.jpg',
      '/incidents/tyre_markings.jpg'
    ],
    injuryDetails: {
      hasInjuries: false,
      severity: 'none',
      restrictedMedicalSummary: 'Both drivers assessed at roadside by paramedics. No physical injuries reported. No passengers were in the vehicle (repositioning empty between runs).'
    },
    investigationStatus: 'open_investigating'
  }
];

export const mockGreyFleet: GreyFleetRecord[] = [
  {
    id: 'GRY-001',
    staffId: 'DEC-PA-01',
    staffName: 'Elena Rostova',
    staffRole: 'pa',
    registration: 'LT18 ZXA',
    makeModel: 'Ford Fiesta 1.0 EcoBoost Titanium',
    motStatus: 'valid',
    motExpiryDate: '14/06/2027',
    taxStatus: 'taxed',
    taxExpiryDate: '01/05/2027',
    businessInsuranceStatus: 'verified_class_1',
    insuranceExpiryDate: '28/02/2027',
    councilBadgeApproved: true
  },
  {
    id: 'GRY-002',
    staffId: 'DEC-PA-02',
    staffName: 'David Miller',
    staffRole: 'pa',
    registration: 'HN20 WKL',
    makeModel: 'Vauxhall Corsa 1.2 Turbo Elite',
    motStatus: 'valid',
    motExpiryDate: '22/09/2027',
    taxStatus: 'taxed',
    taxExpiryDate: '01/10/2027',
    businessInsuranceStatus: 'expired',
    insuranceExpiryDate: '15/10/2026', // Expired insurance
    councilBadgeApproved: false
  },
  {
    id: 'GRY-003',
    staffId: 'DEC-DRV-04',
    staffName: 'Chloe Bennett',
    staffRole: 'driver',
    registration: 'VK21 MPX',
    makeModel: 'Toyota Corolla 1.8 Hybrid Touring Sports',
    motStatus: 'due_soon',
    motExpiryDate: '04/11/2026',
    taxStatus: 'taxed',
    taxExpiryDate: '01/12/2026',
    businessInsuranceStatus: 'verified_hire_reward',
    insuranceExpiryDate: '30/06/2027',
    councilBadgeApproved: true
  }
];

export const mockReminders: ReminderNotificationItem[] = [
  {
    id: 'REM-001',
    category: 'council_6m',
    targetEntity: 'BD24 TYU (Ford Transit)',
    dueDeadline: '01/11/2026',
    daysRemaining: 4,
    urgency: 'critical_today',
    recipientRole: 'Controller',
    assignedManager: 'Samira Khan',
    alternativeEscalationManager: 'Arthur Pendergast (Fleet Director)',
    state: 'sent',
    sentAt: '28/10/2026 08:00',
    escalated: false
  },
  {
    id: 'REM-002',
    category: 'dvsa_mot',
    targetEntity: 'KU23 EWX (Mercedes V-Class)',
    dueDeadline: '15/11/2026',
    daysRemaining: 18,
    urgency: 'urgent_7d',
    recipientRole: 'Mechanic / Garage',
    assignedManager: 'Dave Miller (Head Mechanic)',
    alternativeEscalationManager: 'Arthur Pendergast (Fleet Director)',
    state: 'acknowledged',
    sentAt: '25/10/2026 09:00',
    acknowledgedAt: '25/10/2026 11:20',
    acknowledgedBy: 'Dave Miller',
    escalated: false
  },
  {
    id: 'REM-003',
    category: 'dbs_review',
    targetEntity: 'Marcus Thorne (DEC-DRV-03)',
    dueDeadline: '05/11/2026',
    daysRemaining: 8,
    urgency: 'urgent_7d',
    recipientRole: 'HR / Vetting',
    assignedManager: 'Eleanor Vance',
    alternativeEscalationManager: 'Arthur Pendergast (Fleet Director)',
    state: 'failed',
    sentAt: '27/10/2026 10:15',
    escalated: true,
    escalationReason: 'Automated SMS & Email undeliverable to driver. Escalated to Fleet Director Arthur Pendergast.'
  },
  {
    id: 'REM-004',
    category: 'service_mileage',
    targetEntity: 'LX72 GHY (Peugeot Boxer)',
    dueDeadline: '14/11/2026',
    daysRemaining: 17,
    urgency: 'advance_30d',
    recipientRole: 'Mechanic / Garage',
    assignedManager: 'Dave Miller (Head Mechanic)',
    alternativeEscalationManager: 'Samira Khan (Controller)',
    state: 'queued',
    escalated: false
  },
  {
    id: 'REM-005',
    category: 'insurance_expiry',
    targetEntity: 'David Miller (Grey Fleet HN20 WKL)',
    dueDeadline: '15/10/2026',
    daysRemaining: -13,
    urgency: 'overdue',
    recipientRole: 'HR / Vetting',
    assignedManager: 'Eleanor Vance',
    alternativeEscalationManager: 'Arthur Pendergast (Fleet Director)',
    state: 'sent',
    sentAt: '16/10/2026 09:00',
    escalated: true,
    escalationReason: 'Overdue by 13 days. Staff member prohibited from transporting passengers in personal vehicle.'
  }
];

