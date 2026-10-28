import React, { createContext, useContext, useState } from 'react';
import { 
  Vehicle, 
  DriverPAProfile, 
  Booking, 
  VehicleDefect, 
  DailyCheck, 
  SystemNotification,
  JobStatus 
} from '../types';
import { 
  initialVehicles, 
  initialStaff, 
  initialBookings, 
  initialDefects, 
  initialDailyChecks, 
  initialNotifications 
} from '../data/mockData';

interface DataContextType {
  vehicles: Vehicle[];
  staff: DriverPAProfile[];
  bookings: Booking[];
  defects: VehicleDefect[];
  dailyChecks: DailyCheck[];
  notifications: SystemNotification[];
  
  // Actions
  updateJobStatus: (bookingId: string, status: JobStatus) => void;
  assignBooking: (bookingId: string, driverId: string, vehicleId: string, paId?: string) => { success: boolean; error?: string };
  reportDefect: (defect: Omit<VehicleDefect, 'id' | 'defectRef' | 'reportedAt'>) => void;
  verifyAndReleaseVehicle: (defectId: string, verifiedBy: string) => void;
  submitDailyCheck: (check: Omit<DailyCheck, 'id' | 'checkRef' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Helper Checks
  checkVehicleAvailability: (vehicleId: string) => { isAvailable: boolean; reason?: string };
  checkDriverEligibility: (driverId: string) => { isEligible: boolean; reason?: string };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [staff, setStaff] = useState<DriverPAProfile[]>(initialStaff);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [defects, setDefects] = useState<VehicleDefect[]>(initialDefects);
  const [dailyChecks, setDailyChecks] = useState<DailyCheck[]>(initialDailyChecks);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);

  const checkVehicleAvailability = (vehicleId: string): { isAvailable: boolean; reason?: string } => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return { isAvailable: false, reason: 'Vehicle not found.' };

    if (veh.status === 'blocked_off_road') {
      return { isAvailable: false, reason: veh.isOffRoadReason || 'Vehicle marked off-road due to safety defect.' };
    }
    if (veh.annualDvsaMot.status === 'expired') {
      return { isAvailable: false, reason: 'SAFETY GATE: Annual DVSA MOT is expired. Lawful road use blocked.' };
    }
    if (veh.councilSixMonthInspection.status === 'expired') {
      return { isAvailable: false, reason: 'SAFETY GATE: Council 6-Month Inspection test expired.' };
    }
    return { isAvailable: true };
  };

  const checkDriverEligibility = (driverId: string): { isEligible: boolean; reason?: string } => {
    const drv = staff.find(s => s.id === driverId);
    if (!drv) return { isEligible: false, reason: 'Driver not found.' };

    if (drv.operationalClearance === 'restricted') {
      return { isEligible: false, reason: drv.clearanceReason || 'Driver has restricted clearance.' };
    }
    if (drv.drivingLicence && drv.drivingLicence.dvlaStatus !== 'valid') {
      return { isEligible: false, reason: 'SAFETY GATE: DVLA Driving licence not valid/suspended.' };
    }
    return { isEligible: true };
  };

  const assignBooking = (bookingId: string, driverId: string, vehicleId: string, paId?: string) => {
    const vehCheck = checkVehicleAvailability(vehicleId);
    if (!vehCheck.isAvailable) {
      return { success: false, error: vehCheck.reason };
    }

    const drvCheck = checkDriverEligibility(driverId);
    if (!drvCheck.isEligible) {
      return { success: false, error: drvCheck.reason };
    }

    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return {
          ...bk,
          assignedDriverId: driverId,
          assignedVehicleId: vehicleId,
          assignedPAId: paId,
          status: 'allocated',
          statusTimestamps: {
            ...bk.statusTimestamps,
            allocated: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return bk;
    }));

    return { success: true };
  };

  const updateJobStatus = (bookingId: string, status: JobStatus) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        const timestamps = { ...bk.statusTimestamps };
        if (status === 'en_route') timestamps.enRoute = nowTime;
        if (status === 'arrived') timestamps.arrived = nowTime;
        if (status === 'pob') timestamps.pob = nowTime;
        if (status === 'completed') timestamps.jobClear = nowTime;
        
        return {
          ...bk,
          status,
          statusTimestamps: timestamps
        };
      }
      return bk;
    }));
  };

  const reportDefect = (defectData: Omit<VehicleDefect, 'id' | 'defectRef' | 'reportedAt'>) => {
    const newDefectId = `def-${Date.now()}`;
    const newDefectRef = `DEF-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newDefect: VehicleDefect = {
      ...defectData,
      id: newDefectId,
      defectRef: newDefectRef,
      reportedAt: nowIso
    };

    setDefects(prev => [newDefect, ...prev]);

    // If critical, automatically mark the vehicle as BLOCKED OFF ROAD
    if (defectData.severity === 'critical_safety') {
      setVehicles(prev => prev.map(v => {
        if (v.registration.toUpperCase() === defectData.vehicleReg.toUpperCase()) {
          return {
            ...v,
            status: 'blocked_off_road',
            isOffRoadReason: `CRITICAL SAFETY DEFECT: ${defectData.description}`,
            criticalDefectsCount: v.criticalDefectsCount + 1,
            openDefectsCount: v.openDefectsCount + 1
          };
        }
        return v;
      }));

      // Add safety notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'critical_defect',
          title: `SAFETY GATE: ${defectData.vehicleReg} Blocked Off-Road`,
          description: `Critical defect reported (${defectData.category}). Vehicle allocation blocked until verified release.`,
          timestamp: nowIso,
          severity: 'critical',
          read: false,
          entityLink: '/maintenance'
        },
        ...prev
      ]);
    }
  };

  const verifyAndReleaseVehicle = (defectId: string, verifiedBy: string) => {
    const defect = defects.find(d => d.id === defectId);
    if (!defect) return;

    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        return {
          ...d,
          status: 'verified_released',
          garageAction: {
            ...d.garageAction!,
            verifiedBy: verifiedBy
          }
        };
      }
      return d;
    }));

    // Check if any other critical defects exist on this vehicle
    const otherCritical = defects.filter(d => d.vehicleReg === defect.vehicleReg && d.id !== defectId && d.severity === 'critical_safety' && d.status !== 'verified_released');
    
    if (otherCritical.length === 0) {
      setVehicles(prev => prev.map(v => {
        if (v.registration === defect.vehicleReg) {
          return {
            ...v,
            status: 'available',
            isOffRoadReason: undefined,
            criticalDefectsCount: 0
          };
        }
        return v;
      }));
    }
  };

  const submitDailyCheck = (checkData: Omit<DailyCheck, 'id' | 'checkRef' | 'timestamp'>) => {
    const newCheck: DailyCheck = {
      ...checkData,
      id: `chk-${Date.now()}`,
      checkRef: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setDailyChecks(prev => [newCheck, ...prev]);

    // Update vehicle mileage and check status
    setVehicles(prev => prev.map(v => {
      if (v.registration.toUpperCase() === checkData.vehicleReg.toUpperCase()) {
        return {
          ...v,
          currentMileage: Math.max(v.currentMileage, checkData.odometerReading),
          todayCheckStatus: checkData.status === 'failed' ? 'failed' : 'passed'
        };
      }
      return v;
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      staff,
      bookings,
      defects,
      dailyChecks,
      notifications,
      updateJobStatus,
      assignBooking,
      reportDefect,
      verifyAndReleaseVehicle,
      submitDailyCheck,
      markNotificationAsRead,
      checkVehicleAvailability,
      checkDriverEligibility
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

