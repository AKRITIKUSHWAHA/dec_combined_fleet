import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useCompany } from '../../context/CompanyContext';
import { Booking } from '../../types';
import { 
  X, 
  MapPin, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Luggage, 
  Car, 
  Accessibility, 
  GraduationCap, 
  Plane, 
  PoundSterling, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText
} from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const { createBooking } = useData();
  const { subCompanies } = useCompany();

  // Wizard Step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [pickupAddress, setPickupAddress] = useState('London Luton Airport (LTN), Terminal 1 Meet & Greet');
  const [pickupPostcode, setPickupPostcode] = useState('LU2 9QT');
  const [destinationAddress, setDestinationAddress] = useState('Hilton London Bankside, 2-8 Great Suffolk St, London');
  const [destinationPostcode, setDestinationPostcode] = useState('SE1 0UG');
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('16:00');
  
  // Airport Run Details
  const [isAirportRun, setIsAirportRun] = useState(true);
  const [flightNumber, setFlightNumber] = useState('BA2490');
  const [airline, setAirline] = useState('British Airways');
  const [terminal, setTerminal] = useState('Terminal 1');
  const [meetAndGreetName, setMeetAndGreetName] = useState('David Harrison & Family');

  // School Run Details
  const [isSchoolRun, setIsSchoolRun] = useState(false);
  const [schoolRouteNumber, setSchoolRouteNumber] = useState('CBC-SEN-ROUTE-03');
  const [schoolName, setSchoolName] = useState('The Chiltern School');
  const [amOrPm, setAmOrPm] = useState<'AM' | 'PM'>('PM');

  // Passenger & Vehicle
  const [passengerCount, setPassengerCount] = useState(3);
  const [luggageCount, setLuggageCount] = useState(2);
  const [vehicleCategory, setVehicleCategory] = useState<'Saloon' | 'Executive' | 'MPV' | 'Wheelchair Accessible (WAV)' | 'Minibus'>('Executive');
  const [requiresWheelchair, setRequiresWheelchair] = useState(false);
  const [requiresPA, setRequiresPA] = useState(false);

  // Customer & Pricing
  const [customerName, setCustomerName] = useState('David Harrison');
  const [customerPhone, setCustomerPhone] = useState('+44 7922 443321');
  const [companyId, setCompanyId] = useState(subCompanies[0]?.id || 'dec-executive');
  const [fareGbp, setFareGbp] = useState(135.00);
  const [parkingAirportFeesGbp, setParkingAirportFeesGbp] = useState(12.50);
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid_card' | 'account_invoice'>('account_invoice');

  if (!isOpen) return null;

  const handleAddStop = () => {
    setIntermediateStops([...intermediateStops, '']);
  };

  const handleUpdateStop = (index: number, val: string) => {
    const updated = [...intermediateStops];
    updated[index] = val;
    setIntermediateStops(updated);
  };

  const handleRemoveStop = (index: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
  };

  const totalGbp = fareGbp + parkingAirportFeesGbp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      companyId,
      customerName,
      customerPhone,
      passengerCount,
      luggageCount,
      pickupAddress,
      pickupPostcode,
      destinationAddress,
      destinationPostcode,
      scheduledTime,
      vehicleCategory,
      requiresWheelchair,
      requiresPA,
      status: 'unallocated',
      isAirportRun,
      flightDetails: isAirportRun ? {
        flightNumber,
        airline,
        terminal,
        scheduledLanding: '15:40',
        estimatedLanding: '15:40',
        flightStatus: 'On Time',
        meetAndGreetName
      } : undefined,
      isSchoolRun,
      schoolRunDetails: isSchoolRun ? {
        routeNumber: schoolRouteNumber,
        contractName: `${schoolName} ${amOrPm} Transport`,
        schoolName,
        amOrPm,
        sweepCompleted: false
      } : undefined,
      fareGbp,
      parkingAirportFeesGbp,
      waitingChargeGbp: 0,
      totalGbp,
      paymentStatus
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Dispatch Booking
            </h2>
            <p className="text-xs text-slate-500">
              Interactive dispatch stepper with automated rate calculation & safety gates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/60 px-5 py-3 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, title: 'Route & Time' },
            { num: 2, title: 'Passengers & WAV' },
            { num: 3, title: 'Customer & Rates' },
            { num: 4, title: 'Confirm & Dispatch' }
          ].map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStep(st.num as any)}
              className={`flex items-center gap-1.5 transition ${
                currentStep === st.num
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : currentStep > st.num
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === st.num
                  ? 'bg-blue-600 text-white'
                  : currentStep > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {currentStep > st.num ? '✓' : st.num}
              </span>
              <span className="hidden sm:inline">{st.title}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* STEP 1: ROUTE & TIME */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Pickup Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pickup Location & Postcode</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Full pickup address..."
                    required
                    className="sm:col-span-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={pickupPostcode}
                    onChange={(e) => setPickupPostcode(e.target.value.toUpperCase())}
                    placeholder="Postcode"
                    required
                    className="sm:col-span-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Intermediate Stops */}
              {intermediateStops.map((stop, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-500">
                      Via Stop #{idx + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="text-rose-500 text-[10px] hover:underline flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => handleUpdateStop(idx, e.target.value)}
                    placeholder="Intermediate stop address..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddStop}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Intermediate Via Stop</span>
              </button>

              {/* Destination Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Destination Location & Postcode</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Full drop-off address..."
                    required
                    className="sm:col-span-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={destinationPostcode}
                    onChange={(e) => setDestinationPostcode(e.target.value.toUpperCase())}
                    placeholder="Postcode"
                    required
                    className="sm:col-span-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Scheduled Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Service Sub-Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {subCompanies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Airport Run Details Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-amber-500" />
                    <span>Flight Tracking / Airport Run</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isAirportRun}
                    onChange={(e) => {
                      setIsAirportRun(e.target.checked);
                      if (e.target.checked) setIsSchoolRun(false);
                    }}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                </div>

                {isAirportRun && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Flight Number</span>
                      <input
                        type="text"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. BA2490"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Airline</span>
                      <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        placeholder="e.g. British Airways"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400">Meet & Greet Board Name</span>
                      <input
                        type="text"
                        value={meetAndGreetName}
                        onChange={(e) => setMeetAndGreetName(e.target.value)}
                        placeholder="Name displayed on terminal arrival placard"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: PASSENGERS & ACCESSIBILITY */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Passengers & Luggage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Passengers</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Luggage Bags</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={luggageCount}
                    onChange={(e) => setLuggageCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Vehicle Category Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-blue-500" />
                  <span>Required Vehicle Category</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { cat: 'Saloon', seats: '4 seats' },
                    { cat: 'Executive', seats: 'VIP luxury' },
                    { cat: 'MPV', seats: '6 seats' },
                    { cat: 'Wheelchair Accessible (WAV)', seats: 'Ramp / Lift' },
                    { cat: 'Minibus', seats: '8-16 seats' }
                  ].map((v) => (
                    <button
                      key={v.cat}
                      type="button"
                      onClick={() => setVehicleCategory(v.cat as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        vehicleCategory === v.cat
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{v.cat}</p>
                      <span className="text-[10px] text-slate-400">{v.seats}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility Toggles */}
              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Wheelchair Accessible (WAV) Required
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Dispatches only vehicles fitted with certified ramp or hydraulic tail lift.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requiresWheelchair}
                    onChange={(e) => {
                      setRequiresWheelchair(e.target.checked);
                      if (e.target.checked) setVehicleCategory('Wheelchair Accessible (WAV)');
                    }}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                </div>

                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Requires Passenger Assistant (PA) Escort
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Mandatory for SEN school contracts and vulnerable passenger care.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requiresPA}
                    onChange={(e) => setRequiresPA(e.target.checked)}
                    className="h-4 w-4 rounded text-amber-600"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CUSTOMER & PRICING */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Lead Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <PoundSterling className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Base Mileage Fare (£)</span>
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={fareGbp}
                    onChange={(e) => setFareGbp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <PoundSterling className="w-3.5 h-3.5 text-blue-500" />
                    <span>Airport / Toll Fees (£)</span>
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={parkingAirportFeesGbp}
                    onChange={(e) => setParkingAirportFeesGbp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Total Customer Charge:
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  £{totalGbp.toFixed(2)}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Account Type
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="account_invoice">Account Invoice (Corporate / Council)</option>
                  <option value="paid_card">Card Payment (Prepaid Terminal)</option>
                  <option value="unpaid">Cash / Driver Collect</option>
                </select>
              </div>

            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold uppercase tracking-wider text-slate-400">
                    Booking Summary Preview
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    £{totalGbp.toFixed(2)}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400">Customer:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{customerName} ({customerPhone})</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-slate-400">Scheduled Time:</p>
                    <p className="font-bold text-slate-900 dark:text-white">{scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Vehicle Category:</p>
                    <p className="font-bold text-slate-900 dark:text-white">{vehicleCategory}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400">Pickup:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{pickupAddress} ({pickupPostcode})</p>
                </div>

                <div>
                  <p className="text-slate-400">Destination:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{destinationAddress} ({destinationPostcode})</p>
                </div>

                {requiresWheelchair && (
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    ✓ WAV Ramp / Tail Lift Requirement Active
                  </p>
                )}
                {requiresPA && (
                  <p className="text-amber-600 dark:text-amber-400 font-bold">
                    ✓ Passenger Assistant (PA) Escort Requirement Active
                  </p>
                )}
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300">
                This booking will immediately enter the <strong>Unallocated</strong> column on the dispatch board ready for intelligent driver allocation.
              </div>

            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Create Booking</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
