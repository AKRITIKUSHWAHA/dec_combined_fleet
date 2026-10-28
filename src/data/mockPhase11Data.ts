import { 
  SafeguardingCase, 
  SystemAuditLogEntry, 
  DocumentItem, 
  PolicyAcknowledgement, 
  SubCompanyExtended, 
  IntegrationService, 
  UserAccountItem,
  UserRole
} from '../types';

// ============================================================================
// 1. SAFEGUARDING CASES (STRICTLY RESTRICTED TO SAFEGUARDING OFFICERS)
// ============================================================================

export const initialSafeguardingCases: SafeguardingCase[] = [
  {
    id: 'sg-case-01',
    caseNumber: 'SG-2026-081',
    title: 'Unauthorised Route Deviation & Delayed Drop-off (SEN Pupil SR-01)',
    incidentDate: '2026-10-27T08:45:00Z',
    reportedDate: '2026-10-27T10:15:00Z',
    reportedBy: 'Mrs H. Jenkins (Head of Woodlands SEN Academy)',
    reporterRole: 'School Designated Safeguarding Lead',
    subjectStaffId: 'drv-01',
    subjectStaffName: 'Tariq Mahmood',
    subjectStaffRole: 'driver',
    pupilOrPassenger: {
      name: 'Marcus Davies',
      school: 'Woodlands SEN Academy, Luton',
      vulnerabilities: ['Non-verbal ASD', 'High sensory anxiety', 'Requires 1-to-1 supervision']
    },
    routeCode: 'SR-01 (Woodlands Academy Morning Run)',
    vehicleReg: 'LT24 XAA (Mercedes-Benz V-Class)',
    status: 'lado_referral',
    severity: 'critical_s47',
    narrative: 'Driver deviated 2.4 miles from the prescribed council-approved route without logging reason in driver app or informing dispatcher. Pupil arrived at academy 38 minutes late in a state of extreme distress. Accompanying PA reported driver stopped vehicle near an unauthorised commercial park to take an urgent personal phone call. Confidential Section 47 alert initiated under Working Together to Safeguard Children 2023.',
    deadlines: {
      ladoSlaHours: 24,
      ladoDeadlineIso: '2026-10-28T10:15:00Z',
      internalReviewIso: '2026-10-29T17:00:00Z',
      isOverdue: false
    },
    attachments: [
      {
        id: 'att-01',
        name: 'Telematics_GPS_Breadcrumbs_Trace_SR01.pdf',
        fileType: 'application/pdf',
        sizeKb: 1420,
        uploadedAt: '2026-10-27T11:00:00Z',
        uploadedBy: 'Elena Rostova (Compliance / HR)',
        classification: 'restricted'
      },
      {
        id: 'att-02',
        name: 'School_Incident_Form_Woodlands_SEN.pdf',
        fileType: 'application/pdf',
        sizeKb: 680,
        uploadedAt: '2026-10-27T11:30:00Z',
        uploadedBy: 'Elena Rostova (Compliance / HR)',
        classification: 'confidential'
      },
      {
        id: 'att-03',
        name: 'PA_Witness_Statement_Sarah_Connor.pdf',
        fileType: 'application/pdf',
        sizeKb: 340,
        uploadedAt: '2026-10-27T14:15:00Z',
        uploadedBy: 'Elena Rostova (Compliance / HR)',
        classification: 'confidential'
      }
    ],
    decisions: [
      {
        id: 'dec-01',
        date: '2026-10-27T12:00:00Z',
        decidedBy: 'Elena Rostova (Designated Safeguarding Officer)',
        actionTaken: 'Precautionary Suspension from School Transport Runs',
        rationale: 'Pending formal LADO consultation, driver Tariq Mahmood is suspended specifically from all local authority pupil transport routes. Corporate bookings restricted.',
        reviewDate: '2026-11-03'
      },
      {
        id: 'dec-02',
        date: '2026-10-27T15:30:00Z',
        decidedBy: 'Arthur Pendelton (Owner / Admin)',
        actionTaken: 'Formal LADO Referral Dispatched',
        rationale: 'Statutory obligation fulfilled within 24-hour deadline. Ref LADO-LUT-2026-4491 assigned.',
        reviewDate: '2026-10-30'
      }
    ],
    disclosures: [
      {
        id: 'disc-01',
        date: '2026-10-27T15:20:00Z',
        agency: 'Luton Borough Council - Local Authority Designated Officer (LADO)',
        officerName: 'Clare Montgomery (Senior Safeguarding Advisor)',
        referenceNo: 'LADO-LUT-2026-4491',
        notes: 'Initial formal multi-agency disclosure transmitted securely via Egress email.'
      },
      {
        id: 'disc-02',
        date: '2026-10-27T16:00:00Z',
        agency: 'Central Bedfordshire SEN Transport Commissioning Team',
        officerName: 'Mark Higgins (Contract Compliance Lead)',
        referenceNo: 'SEN-CONTRACT-NOTIF-883',
        notes: 'Council contract officer notified of precautionary driver replacement on SR-01.'
      }
    ]
  },
  {
    id: 'sg-case-02',
    caseNumber: 'SG-2026-094',
    title: 'Wheelchair Clamping & Restraint Procedure Query (Vehicle BU68 YTR)',
    incidentDate: '2026-10-26T15:20:00Z',
    reportedDate: '2026-10-26T16:45:00Z',
    reportedBy: 'Kieran Bell (Parent / Guardian)',
    reporterRole: 'Parent',
    subjectStaffId: 'drv-02',
    subjectStaffName: 'David Chen',
    subjectStaffRole: 'driver',
    pupilOrPassenger: {
      name: 'Oliver Bell',
      school: 'Chiltern Hills SEN Academy',
      vulnerabilities: ['Manual Wheelchair user', 'Cerebral Palsy']
    },
    routeCode: 'SR-02 (Chiltern Hills Afternoon Drop)',
    vehicleReg: 'BU68 YTR (Ford Transit Custom Minibus)',
    status: 'under_investigation',
    severity: 'medium',
    narrative: 'Parent observed pupil chair floor clamps were attached with loose tensioning upon arrival at home address. No injury sustained, but driver did not demonstrate secondary 4-point ratchet check before departure. Vehicle CCTV and walkaround records requested for investigation.',
    deadlines: {
      ladoSlaHours: 48,
      ladoDeadlineIso: '2026-10-28T16:45:00Z',
      internalReviewIso: '2026-10-31T12:00:00Z',
      isOverdue: false
    },
    attachments: [
      {
        id: 'att-04',
        name: 'Parent_Photo_Clamp_Position.jpg',
        fileType: 'image/jpeg',
        sizeKb: 512,
        uploadedAt: '2026-10-26T17:00:00Z',
        uploadedBy: 'Elena Rostova (Compliance / HR)',
        classification: 'confidential'
      }
    ],
    decisions: [
      {
        id: 'dec-03',
        date: '2026-10-27T09:00:00Z',
        decidedBy: 'Elena Rostova (Compliance / HR)',
        actionTaken: 'Mandatory Practical Recertification Booked',
        rationale: 'Driver David Chen scheduled for emergency Q-Straint wheelchair restraint refresher course before next passenger assignment.',
        reviewDate: '2026-10-29'
      }
    ],
    disclosures: [
      {
        id: 'disc-03',
        date: '2026-10-26T17:30:00Z',
        agency: 'Luton Borough Council Passenger Transport Unit',
        officerName: 'David Ward (Fleet Safety Inspector)',
        referenceNo: 'PTU-SAFE-2026-119',
        notes: 'Informed of internal equipment review and re-certification plan.'
      }
    ]
  },
  {
    id: 'sg-case-03',
    caseNumber: 'SG-2026-072',
    title: 'Unattended Vehicle End-of-Run Sweep False Alarm',
    incidentDate: '2026-10-14T09:10:00Z',
    reportedDate: '2026-10-14T09:30:00Z',
    reportedBy: 'Sarah Connor (PA)',
    reporterRole: 'Passenger Assistant',
    subjectStaffId: 'drv-01',
    subjectStaffName: 'Tariq Mahmood',
    subjectStaffRole: 'driver',
    status: 'closed_unsubstantiated',
    severity: 'low',
    narrative: 'PA reported pupil school bag left in rear row after Woodlands academy morning sweep. Physical check performed immediately within 4 minutes, item reunited with school office. Full sweep procedure confirmed.',
    deadlines: {
      ladoSlaHours: 72,
      ladoDeadlineIso: '2026-10-17T09:30:00Z',
      internalReviewIso: '2026-10-15T17:00:00Z',
      isOverdue: false
    },
    attachments: [
      {
        id: 'att-05',
        name: 'Handover_Receipt_Woodlands.pdf',
        fileType: 'application/pdf',
        sizeKb: 180,
        uploadedAt: '2026-10-14T10:00:00Z',
        uploadedBy: 'Elena Rostova (Compliance / HR)',
        classification: 'confidential'
      }
    ],
    decisions: [
      {
        id: 'dec-04',
        date: '2026-10-15T11:00:00Z',
        decidedBy: 'Elena Rostova (Compliance / HR)',
        actionTaken: 'Case Closed - Unsubstantiated',
        rationale: 'Protocol followed correctly. No safeguarding breach occurred.',
        reviewDate: '2026-10-15'
      }
    ],
    disclosures: []
  }
];

// ============================================================================
// 2. AUDIT LOG ENTRIES (SENSITIVE-ACCESS HIGHLIGHTED & PERMISSIONS RESPECTED)
// ============================================================================

export const initialAuditLogs: SystemAuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-28T11:15:22Z',
    actorId: 'usr-admin-01',
    actorName: 'Arthur Pendelton',
    actorRole: 'owner_admin',
    action: 'VIEW_SENSITIVE',
    entityType: 'Safeguarding',
    entityId: 'sg-case-01',
    entityName: 'SG-2026-081',
    isSensitive: true,
    sensitiveTag: 'Child S47 Narrative & Evidence',
    ipAddress: '194.73.112.45',
    details: 'Viewed full restricted Section 47 safeguarding narrative, LADO disclosure notes, and pupil Marcus Davies personal vulnerability records.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-28T10:48:05Z',
    actorId: 'usr-hr-01',
    actorName: 'Elena Rostova',
    actorRole: 'hr_vetting',
    action: 'VIEW_SENSITIVE',
    entityType: 'Driver',
    entityId: 'drv-01',
    entityName: 'Tariq Mahmood',
    isSensitive: true,
    sensitiveTag: 'Enhanced DBS Certificate PII',
    ipAddress: '194.73.112.50',
    details: 'Viewed unredacted DBS Certificate Number (001594832911), Barred List check result, and verified Police National Database disclosure.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-28T10:30:11Z',
    actorId: 'usr-admin-01',
    actorName: 'Arthur Pendelton',
    actorRole: 'owner_admin',
    action: 'EXPORT_DATA',
    entityType: 'Booking',
    entityId: 'export-batch-20261028',
    entityName: 'Weekly Council Billing Ledger',
    isSensitive: true,
    sensitiveTag: 'BACS & Financial PII Export',
    ipAddress: '194.73.112.45',
    details: 'Exported 142 client account invoice lines including council billing contacts, individual pupil journey breakdowns, and bank sorting codes.'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-28T09:42:19Z',
    actorId: 'usr-ctrl-01',
    actorName: 'Dispatcher Control Room 1',
    actorRole: 'controller',
    action: 'UPDATE',
    entityType: 'Booking',
    entityId: 'bk-1029',
    entityName: 'BK-1029 (Luton -> LHR T5)',
    isSensitive: false,
    ipAddress: '194.73.112.48',
    details: 'Assigned driver Tariq Mahmood and vehicle LT24 XAA to executive airport booking.'
  },
  {
    id: 'aud-005',
    timestamp: '2026-10-28T09:12:44Z',
    actorId: 'usr-admin-01',
    actorName: 'Arthur Pendelton',
    actorRole: 'owner_admin',
    action: 'REVOKE_SESSION',
    entityType: 'Session',
    entityId: 'usr-ctrl-02',
    entityName: 'Marcus Bell (Controller)',
    isSensitive: true,
    sensitiveTag: 'Credential & Session Revocation',
    ipAddress: '194.73.112.45',
    details: 'Terminated 2 active controller sessions on device Chrome/Windows due to security audit rotation.'
  },
  {
    id: 'aud-006',
    timestamp: '2026-10-28T08:30:00Z',
    actorId: 'usr-hr-01',
    actorName: 'Elena Rostova',
    actorRole: 'hr_vetting',
    action: 'VIEW_SENSITIVE',
    entityType: 'Driver',
    entityId: 'drv-02',
    entityName: 'David Chen',
    isSensitive: true,
    sensitiveTag: 'DVLA Medical & Endorsements',
    ipAddress: '194.73.112.50',
    details: 'Checked DVLA real-time enquiry service for photocard expiry and speeding penalty endorsements.'
  },
  {
    id: 'aud-007',
    timestamp: '2026-10-27T17:15:33Z',
    actorId: 'usr-admin-01',
    actorName: 'Arthur Pendelton',
    actorRole: 'owner_admin',
    action: 'CREATE',
    entityType: 'SubCompany',
    entityId: 'sub-comp-04',
    entityName: 'Beds County SEN Transport Ltd',
    isSensitive: false,
    ipAddress: '194.73.112.45',
    details: 'Created dedicated legal entity and tenant configuration for Central Bedfordshire SEN routes.'
  },
  {
    id: 'aud-008',
    timestamp: '2026-10-27T14:20:00Z',
    actorId: 'usr-hr-01',
    actorName: 'Elena Rostova',
    actorRole: 'hr_vetting',
    action: 'OFFBOARD',
    entityType: 'Driver',
    entityId: 'drv-05',
    entityName: 'Alan Shearer',
    isSensitive: true,
    sensitiveTag: 'Staff Offboarding & Access Purge',
    ipAddress: '194.73.112.50',
    details: 'Completed formal offboarding: revoked mobile cockpit access, unassigned 4 future bookings, logged council ID badge return.'
  }
];

// ============================================================================
// 3. DOCUMENT LIBRARY (VERSIONED, RETENTION DATE, EXPIRING PRE-SIGNED LINKS)
// ============================================================================

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'Enhanced DBS Certificate - Tariq Mahmood',
    category: 'dbs_certificate',
    linkedType: 'driver',
    linkedEntityId: 'drv-01',
    linkedEntityName: 'Tariq Mahmood',
    version: 'v2.0',
    ownerName: 'Elena Rostova (Compliance)',
    uploadedAt: '2026-03-12T09:00:00Z',
    verifiedStatus: 'verified',
    verifiedBy: 'Elena Rostova',
    retentionDate: '2032-03-12', // 6 years statutory retention
    fileFormat: 'PDF',
    fileSizeBytes: 1845000,
    expiringLinks: [
      {
        id: 'link-01',
        token: 'exp_tkn_88491024_dbs',
        url: 'https://vault.dec-fleet.co.uk/secure/dbs/001594832911?token=exp_tkn_88491024_dbs',
        createdAt: '2026-10-28T09:00:00Z',
        expiresAt: '2026-10-28T13:00:00Z', // 4hr expiry
        createdBy: 'Elena Rostova',
        isRevoked: false
      }
    ]
  },
  {
    id: 'doc-002',
    title: 'VT20 MOT Test Certificate - LT24 XAA',
    category: 'mot_vt20',
    linkedType: 'vehicle',
    linkedEntityId: 'veh-01',
    linkedEntityName: 'LT24 XAA (Mercedes V-Class)',
    version: 'v1.0',
    ownerName: 'Marcus Evans (Garage Lead)',
    uploadedAt: '2026-05-10T14:30:00Z',
    verifiedStatus: 'verified',
    verifiedBy: 'Marcus Evans',
    retentionDate: '2029-05-10', // 3 years retention
    fileFormat: 'PDF',
    fileSizeBytes: 720000,
    expiringLinks: []
  },
  {
    id: 'doc-003',
    title: 'Private Hire Operator Fleet Insurance Schedule 2026/27',
    category: 'insurance',
    linkedType: 'sub_company',
    linkedEntityId: 'sub-comp-01',
    linkedEntityName: 'DEC Executive Cars Ltd',
    version: 'v4.1',
    ownerName: 'Arthur Pendelton (Admin)',
    uploadedAt: '2026-01-01T00:00:00Z',
    verifiedStatus: 'verified',
    verifiedBy: 'Arthur Pendelton',
    retentionDate: '2033-01-01',
    fileFormat: 'PDF',
    fileSizeBytes: 3410000,
    expiringLinks: []
  },
  {
    id: 'doc-004',
    title: 'Luton Borough Council Dual Driver Badge - Tariq Mahmood',
    category: 'council_badge',
    linkedType: 'driver',
    linkedEntityId: 'drv-01',
    linkedEntityName: 'Tariq Mahmood',
    version: 'v3.0',
    ownerName: 'Elena Rostova (Compliance)',
    uploadedAt: '2025-11-15T11:20:00Z',
    verifiedStatus: 'verified',
    verifiedBy: 'Elena Rostova',
    retentionDate: '2031-11-15',
    fileFormat: 'PNG',
    fileSizeBytes: 950000,
    expiringLinks: []
  },
  {
    id: 'doc-005',
    title: 'Passenger Assistant Safeguarding Level 3 Certificate - Sarah Connor',
    category: 'training_cert',
    linkedType: 'pa',
    linkedEntityId: 'pa-01',
    linkedEntityName: 'Sarah Connor',
    version: 'v1.0',
    ownerName: 'Elena Rostova (Compliance)',
    uploadedAt: '2026-02-20T10:00:00Z',
    verifiedStatus: 'verified',
    verifiedBy: 'Elena Rostova',
    retentionDate: '2032-02-20',
    fileFormat: 'PDF',
    fileSizeBytes: 1250000,
    expiringLinks: []
  },
  {
    id: 'doc-006',
    title: 'DVLA DQC Driver CPC Qualification Card - David Chen',
    category: 'driving_licence',
    linkedType: 'driver',
    linkedEntityId: 'drv-02',
    linkedEntityName: 'David Chen',
    version: 'v1.1',
    ownerName: 'David Chen',
    uploadedAt: '2026-10-01T08:00:00Z',
    verifiedStatus: 'pending_verification',
    retentionDate: '2031-10-01',
    fileFormat: 'PDF',
    fileSizeBytes: 890000,
    expiringLinks: []
  }
];

export const initialPolicyAcknowledgements: PolicyAcknowledgement[] = [
  {
    id: 'pol-01',
    policyTitle: 'DEC Fleet Safeguarding & Pupil Escort Code of Conduct 2026',
    policyVersion: 'v2.4',
    requiredFor: 'all_staff',
    staffId: 'drv-01',
    staffName: 'Tariq Mahmood',
    staffRole: 'driver',
    acknowledgedAt: '2026-09-01T07:30:00Z',
    status: 'acknowledged',
    ipAddress: '82.34.119.12',
    signatureHash: 'SHA256:88fa2b419c8821bb49f81'
  },
  {
    id: 'pol-02',
    policyTitle: 'DEC Fleet Safeguarding & Pupil Escort Code of Conduct 2026',
    policyVersion: 'v2.4',
    requiredFor: 'all_staff',
    staffId: 'pa-01',
    staffName: 'Sarah Connor',
    staffRole: 'pa',
    acknowledgedAt: '2026-09-01T08:15:00Z',
    status: 'acknowledged',
    ipAddress: '86.14.204.88',
    signatureHash: 'SHA256:77da31c44b9914cc82a12'
  },
  {
    id: 'pol-03',
    policyTitle: 'Driver Drug, Alcohol & Random Screening Policy (UK Standard)',
    policyVersion: 'v3.0',
    requiredFor: 'driver',
    staffId: 'drv-02',
    staffName: 'David Chen',
    staffRole: 'driver',
    acknowledgedAt: '2026-09-05T12:00:00Z',
    status: 'acknowledged',
    ipAddress: '92.40.18.23',
    signatureHash: 'SHA256:44ef9910ac2219ee54bc7'
  },
  {
    id: 'pol-04',
    policyTitle: 'End-of-Run Mandatory Child Safety Sweep Protocol (CHK-05)',
    policyVersion: 'v1.2',
    requiredFor: 'all_staff',
    staffId: 'drv-03',
    staffName: 'Marcus Evans',
    staffRole: 'driver',
    status: 'pending_signature'
  },
  {
    id: 'pol-05',
    policyTitle: 'Mobile Device Distraction & Handsfree Prohibition on Pupil Duty',
    policyVersion: 'v2.0',
    requiredFor: 'all_staff',
    staffId: 'drv-04',
    staffName: 'Aisha Patel',
    staffRole: 'driver',
    status: 'overdue'
  }
];

// ============================================================================
// 4. EXTENDED SUB-COMPANIES (UNLIMITED, BRANDING, DEPOTS, SHARING RULES)
// ============================================================================

export const initialSubCompaniesExtended: SubCompanyExtended[] = [
  {
    id: 'sub-comp-01',
    name: 'DEC Executive Fleet',
    code: 'DEC',
    operatorLicence: 'PHO/LUT/2022/094',
    council: 'Luton',
    phone: '+44 1582 721100',
    email: 'operations@dec-executive.co.uk',
    vehicleCount: 24,
    driverCount: 18,
    tradingName: 'DEC Executive Chauffeurs & Corporate Fleet',
    registeredEntity: 'DEC Combined Fleet Operations UK Ltd',
    companiesHouseNumber: '11984210',
    branding: {
      primaryColorHex: '#08201C',
      secondaryColorHex: '#B6F23C'
    },
    dispatchPhone: '+44 1582 721101',
    depots: [
      { id: 'dep-01', name: 'Luton Airport Central Depot', address: 'Airport Way, Luton LU2 9LY', capacity: 35 },
      { id: 'dep-02', name: 'Dunstable North Fleet Yard', address: 'High St North, Dunstable LU6 1HX', capacity: 20 }
    ],
    assignedTariffScheme: 'Executive Tier A (Airport & Corporate)',
    isArchived: false,
    sharingRules: {
      allowFleetSharing: true,
      allowDriverSharing: true,
      depotLock: false
    },
    assignmentHistory: [
      { id: 'as-01', date: '2026-10-20', itemType: 'vehicle', itemRef: 'LT24 XAA', action: 'assigned', details: 'Added to DEC Executive active fleet' },
      { id: 'as-02', date: '2026-10-22', itemType: 'driver', itemRef: 'Tariq Mahmood', action: 'assigned', details: 'Assigned as primary senior driver' }
    ]
  },
  {
    id: 'sub-comp-02',
    name: 'Beds County SEN Transport',
    code: 'BCS',
    operatorLicence: 'PHO/CBD/2024/018',
    council: 'Central Bedfordshire',
    phone: '+44 1525 840222',
    email: 'sen@bedscountyfleet.co.uk',
    vehicleCount: 14,
    driverCount: 12,
    tradingName: 'Bedfordshire County Student Transport Services',
    registeredEntity: 'Beds County SEN Logistics Ltd',
    companiesHouseNumber: '13884102',
    branding: {
      primaryColorHex: '#1E1B4B',
      secondaryColorHex: '#38BDF8'
    },
    dispatchPhone: '+44 1525 840229',
    depots: [
      { id: 'dep-03', name: 'Bedford South SEN Hub', address: 'Ampthill Rd, Bedford MK42 9JJ', capacity: 25 }
    ],
    assignedTariffScheme: 'Council SEN Daily Contract Tariff (Rate B)',
    isArchived: false,
    sharingRules: {
      allowFleetSharing: false,
      allowDriverSharing: false,
      depotLock: true
    },
    assignmentHistory: [
      { id: 'as-03', date: '2026-09-01', itemType: 'vehicle', itemRef: 'BU68 YTR', action: 'assigned', details: 'Wheelchair accessible minibus assigned to SEN ring-fenced fleet' }
    ]
  },
  {
    id: 'sub-comp-03',
    name: 'Central Travel Ltd',
    code: 'CTL',
    operatorLicence: 'PHO/HER/2021/331',
    council: 'Hertfordshire',
    phone: '+44 1442 211990',
    email: 'dispatch@centraltravel.co.uk',
    vehicleCount: 10,
    driverCount: 8,
    tradingName: 'Central Regional Travel Solutions',
    registeredEntity: 'Central Travel Group Ltd',
    companiesHouseNumber: '09841209',
    branding: {
      primaryColorHex: '#78350F',
      secondaryColorHex: '#FBBF24'
    },
    dispatchPhone: '+44 1442 211999',
    depots: [
      { id: 'dep-04', name: 'Hemel Hempstead Yard', address: 'Maylands Ave, Hemel HP2 7DF', capacity: 15 }
    ],
    assignedTariffScheme: 'Standard Regional Mileage Tariff',
    isArchived: false,
    sharingRules: {
      allowFleetSharing: true,
      allowDriverSharing: false,
      depotLock: true
    },
    assignmentHistory: []
  },
  {
    id: 'sub-comp-04',
    name: 'Apex Chauffeurs (Archived)',
    code: 'APX',
    operatorLicence: 'PHO/BCK/2019/042',
    council: 'Buckinghamshire',
    phone: '+44 1296 441000',
    email: 'admin@apexchauffeurs.co.uk',
    vehicleCount: 0,
    driverCount: 0,
    tradingName: 'Apex VIP Chauffeurs UK',
    registeredEntity: 'Apex Mobility Services Ltd',
    companiesHouseNumber: '08129481',
    branding: {
      primaryColorHex: '#374151',
      secondaryColorHex: '#9CA3AF'
    },
    dispatchPhone: '+44 1296 441001',
    depots: [],
    assignedTariffScheme: 'Legacy VIP Tariff',
    isArchived: true,
    sharingRules: {
      allowFleetSharing: false,
      allowDriverSharing: false,
      depotLock: true
    },
    assignmentHistory: [
      { id: 'as-04', date: '2026-06-30', itemType: 'vehicle', itemRef: 'All Fleet', action: 'transferred', details: 'Transferred 6 Mercedes vehicles to DEC Executive upon consolidation' }
    ]
  }
];

// ============================================================================
// 5. INTEGRATIONS REGISTER (STATUS, LATENCY, COST, CLEAR MANUAL VERIFICATION)
// ============================================================================

export const initialIntegrations: IntegrationService[] = [
  {
    id: 'int-01',
    name: 'DVLA Driver Licence Verification Service',
    category: 'government',
    purpose: 'Real-time validation of driver photocard validity, penalty points, endorsements, and disqualification orders via DVLA portal.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:30:00Z',
    latencyMs: 142,
    costModel: '£0.15 per automated API check',
    endpointUrl: 'https://driver-enquiry.dvla.gov.uk/api/v2/check'
  },
  {
    id: 'int-02',
    name: 'DVSA MOT History & Expiry Service',
    category: 'government',
    purpose: 'Live checking of annual MOT pass/fail status, test expiry dates, advisories, and mileage history from DVSA official records.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:45:00Z',
    latencyMs: 88,
    costModel: 'Free (UK Government Open Data API)',
    endpointUrl: 'https://beta.check-mot.service.gov.uk/trade/vehicles/v1'
  },
  {
    id: 'int-03',
    name: 'VES (Vehicle Enquiry Service - DVLA)',
    category: 'government',
    purpose: 'Automatic lookup of vehicle road tax status, V5C registration details, fuel type, and engine displacement from VRN.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:40:00Z',
    latencyMs: 95,
    costModel: 'Free (DVLA Open Data)',
    endpointUrl: 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1'
  },
  {
    id: 'int-04',
    name: 'Local Council Licensing & SEN Portals',
    category: 'government',
    purpose: 'Bi-annual verification of private hire vehicle plates, council driver badges, and local authority SEN route specifications.',
    status: 'operational',
    isManualVerification: true,
    manualVerificationLabel: 'Manual verification required (Council portal batch PDF upload)',
    lastSuccessIso: '2026-10-25T16:00:00Z',
    latencyMs: 4200,
    costModel: 'Manual officer portal check (£0 API cost)',
    endpointUrl: 'https://portal.luton.gov.uk/taxi-licensing/verification'
  },
  {
    id: 'int-05',
    name: 'DBS Update Service (Disclosure and Barring)',
    category: 'vetting',
    purpose: 'Annual or periodic status check of Enhanced DBS certificates and Children & Vulnerable Adult Barred Lists.',
    status: 'operational',
    isManualVerification: true,
    manualVerificationLabel: 'Manual verification required (Officer credentials + E-signature)',
    lastSuccessIso: '2026-10-27T14:00:00Z',
    latencyMs: 3100,
    costModel: '£13.00 annual subscription per driver/PA',
    endpointUrl: 'https://secure.crb.homeoffice.gov.uk/dbs-update-service'
  },
  {
    id: 'int-06',
    name: 'Stripe & BACS Merchant Payment Gateway',
    category: 'finance',
    purpose: 'Card pre-authorisations, corporate account invoice auto-charge, and weekly driver settlement BACS payouts.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:50:00Z',
    latencyMs: 230,
    costModel: '1.2% + 20p per transaction / £0.20 per BACS transfer',
    endpointUrl: 'https://api.stripe.com/v1'
  },
  {
    id: 'int-07',
    name: 'Twilio & SendGrid Notification Gateways',
    category: 'telecom',
    purpose: 'Transactional passenger SMS (driver arriving, vehicle reg), driver push alerts, and council PDF invoice transmissions.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:58:00Z',
    latencyMs: 110,
    costModel: '£0.038 per UK SMS / £0.0006 per transactional email',
    endpointUrl: 'https://api.twilio.com/2010-04-01'
  },
  {
    id: 'int-08',
    name: 'Mapbox Navigation & Fleet Telematics API',
    category: 'telematics',
    purpose: 'Map rendering, driver GPS breadcrumbs, route optimization, road traffic matrix, and geofenced pickup arrival detection.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T12:00:00Z',
    latencyMs: 52,
    costModel: '£5.00 per 1,000 active tracking hours',
    endpointUrl: 'https://api.mapbox.com/v4'
  },
  {
    id: 'int-09',
    name: 'AviationStack Live Flight Arrival Telemetry',
    category: 'aviation',
    purpose: 'Real-time flight radar tracking for London Luton (LTN), Heathrow (LHR), Gatwick (LGW) to auto-adjust airport booking dispatch.',
    status: 'operational',
    isManualVerification: false,
    lastSuccessIso: '2026-10-28T11:55:00Z',
    latencyMs: 185,
    costModel: '£49.00 / month flat subscription',
    endpointUrl: 'http://api.aviationstack.com/v1/flights'
  }
];

// ============================================================================
// 6. USER MANAGEMENT & MFA SESSIONS
// ============================================================================

export const initialUserAccounts: UserAccountItem[] = [
  {
    id: 'usr-admin-01',
    name: 'Arthur Pendelton',
    email: 'admin@dec-fleet.co.uk',
    role: 'owner_admin',
    department: 'Head Office Executive',
    mfaStatus: 'enforced',
    activeSessionsCount: 2,
    lastLoginIso: '2026-10-28T11:00:00Z',
    status: 'active',
    assignedDepot: 'Luton Airport Central'
  },
  {
    id: 'usr-hr-01',
    name: 'Elena Rostova',
    email: 'elena.rostova@dec-fleet.co.uk',
    role: 'hr_vetting',
    department: 'Compliance, Vetting & Safeguarding',
    mfaStatus: 'enforced',
    activeSessionsCount: 1,
    lastLoginIso: '2026-10-28T10:30:00Z',
    status: 'active',
    assignedDepot: 'Luton Airport Central'
  },
  {
    id: 'usr-ctrl-01',
    name: 'Dispatcher Room 1',
    email: 'controller@dec-fleet.co.uk',
    role: 'controller',
    department: 'Operations & 24/7 Dispatch',
    mfaStatus: 'enabled',
    activeSessionsCount: 3,
    lastLoginIso: '2026-10-28T09:15:00Z',
    status: 'active',
    assignedDepot: 'Luton Airport Central'
  },
  {
    id: 'usr-mech-01',
    name: 'Marcus Evans',
    email: 'mechanic@dec-fleet.co.uk',
    role: 'mechanic',
    department: 'Fleet Engineering & MOT Workshop',
    mfaStatus: 'enabled',
    activeSessionsCount: 1,
    lastLoginIso: '2026-10-28T08:00:00Z',
    status: 'active',
    assignedDepot: 'Dunstable North Fleet Yard'
  },
  {
    id: 'usr-drv-01',
    name: 'Tariq Mahmood',
    email: 'tariq.driver@dec-fleet.co.uk',
    role: 'driver',
    department: 'Executive Chauffeur Division',
    mfaStatus: 'disabled',
    activeSessionsCount: 1,
    lastLoginIso: '2026-10-28T07:45:00Z',
    status: 'active',
    assignedDepot: 'Luton Airport Central'
  },
  {
    id: 'usr-pa-01',
    name: 'Sarah Connor',
    email: 'sarah.pa@dec-fleet.co.uk',
    role: 'pa',
    department: 'SEN Escort Services',
    mfaStatus: 'disabled',
    activeSessionsCount: 1,
    lastLoginIso: '2026-10-28T08:15:00Z',
    status: 'active',
    assignedDepot: 'Bedford South SEN Hub'
  }
];

// ============================================================================
// 7. ROLES & PERMISSIONS MATRIX CONFIGURATION
// ============================================================================

export interface RoleMatrixPermission {
  key: string;
  category: string;
  name: string;
  description: string;
  allowedRoles: Record<UserRole, boolean>;
}

export const initialRolePermissionsMatrix: RoleMatrixPermission[] = [
  {
    key: 'live_map_dispatch',
    category: 'Dispatch & Operations',
    name: 'View Real-time Driver GPS Map',
    description: 'Access live telemetry, speed, heading, and driver location updates.',
    allowedRoles: {
      owner_admin: true,
      controller: true,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: false
    }
  },
  {
    key: 'manage_bookings',
    category: 'Dispatch & Operations',
    name: 'Create & Allocate Bookings',
    description: 'Dispatch bookings, assign drivers, modify flight details, and cancel jobs.',
    allowedRoles: {
      owner_admin: true,
      controller: true,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: false
    }
  },
  {
    key: 'view_dbs_medical',
    category: 'Compliance & Safeguarding',
    name: 'Access Sensitive DBS & Medical Records',
    description: 'View full unredacted DBS certificates, barred list checks, and medical reviews.',
    allowedRoles: {
      owner_admin: true,
      controller: false, // STRICTLY RESTRICTED FROM CONTROLLERS!
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: true
    }
  },
  {
    key: 'safeguarding_cases',
    category: 'Compliance & Safeguarding',
    name: 'Access Safeguarding Incident Narratives',
    description: 'Manage confidential Section 47 cases, LADO disclosures, and statutory police logs.',
    allowedRoles: {
      owner_admin: true,
      controller: false, // GENERAL CONTROLLERS NEVER SEE THIS
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: true
    }
  },
  {
    key: 'manage_defects_garage',
    category: 'Fleet & Maintenance',
    name: 'Workshop Triage & Defect Sign-off',
    description: 'Record garage repairs, order parts, clear VOR defects, and verify vehicles.',
    allowedRoles: {
      owner_admin: true,
      controller: false,
      driver: false,
      pa: false,
      mechanic: true,
      hr_vetting: false
    }
  },
  {
    key: 'tariffs_finance',
    category: 'Finance & Tariffs',
    name: 'Tariff Engine & Invoicing',
    description: 'Configure corporate pricing rules, download council invoices, and disburse settlements.',
    allowedRoles: {
      owner_admin: true,
      controller: true,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: false
    }
  },
  {
    key: 'sub_company_admin',
    category: 'Governance & Multi-Tenancy',
    name: 'Manage Sub-Companies & Legal Entities',
    description: 'Create, brand, configure sharing rules, and archive sub-companies.',
    allowedRoles: {
      owner_admin: true,
      controller: false,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: false
    }
  },
  {
    key: 'audit_log_access',
    category: 'Governance & Security',
    name: 'View Security Audit Trail & Sensitive Logs',
    description: 'Audit actor activities, export compliance logs, and view sensitive data accesses.',
    allowedRoles: {
      owner_admin: true,
      controller: false,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: true
    }
  },
  {
    key: 'user_session_revoke',
    category: 'Governance & Security',
    name: 'User Management & Session Revocation',
    description: 'Enforce MFA policies, terminate active sessions, and execute staff offboarding.',
    allowedRoles: {
      owner_admin: true,
      controller: false,
      driver: false,
      pa: false,
      mechanic: false,
      hr_vetting: false
    }
  }
];

