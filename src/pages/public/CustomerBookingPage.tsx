import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  MapPin, 
  Plane, 
  Car, 
  Accessibility, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ChevronRight, 
  AlertCircle,
  History,
  Phone,
  Mail,
  User,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockCustomerBookings } from '../../data/mockDataPhase12';
import { 
  CustomerBookingRecord, 
  CustomerBookingState, 
  AccessibilityOptions 
} from '../../types/phase12';

export const CustomerBookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new_booking' | 'booking_history'>('new_booking');
  const [bookingsList, setBookingsList] = useState<CustomerBookingRecord[]>(mockCustomerBookings);

  // Booking Form State
  const [pickupAddress, setPickupAddress] = useState('Luton Airport Parkway Station, Parkway Road');
  const [pickupPostcode, setPickupPostcode] = useState('LU1 3JW');
  const [destinationAddress, setDestinationAddress] = useState('London Heathrow Airport Terminal 5');
  const [destinationPostcode, setDestinationPostcode] = useState('TW6 2GA');
  const [date, setDate] = useState('29/10/2026');
  const [time, setTime] = useState('09:30');
  const [vehicleCategory, setVehicleCategory] = useState<'Saloon' | 'Executive Chauffeur' | 'WAV Wheelchair Accessible' | 'Minibus 8-Seater'>('Executive Chauffeur');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);

  // Flight Details
  const [hasFlight, setHasFlight] = useState(true);
  const [airline, setAirline] = useState('British Airways');
  const [flightNumber, setFlightNumber] = useState('BA1482');
  const [terminal, setTerminal] = useState('Terminal 5');
  const [landingBuffer, setLandingBuffer] = useState(45);
  const [meetAndGreet, setMeetAndGreet] = useState(true);
  const [nameboardText, setNameboardText] = useState('Dr. Alistair Finch');

  // Accessibility Needs
  const [accessibility, setAccessibility] = useState<AccessibilityOptions>({
    wheelchairRequired: false,
    rampRequired: false,
    lowStepVehicle: false,
    assistanceDog: false,
    hearingLoop: true,
    driverAssistanceNeeded: true,
    additionalNotes: 'Passenger has slight hearing impairment; please communicate clearly at meet-and-greet.'
  });

  // Contact & Payment Details
  const [customerName, setCustomerName] = useState('Dr. Alistair Finch');
  const [customerEmail, setCustomerEmail] = useState('a.finch@biotech-innovations.co.uk');
  const [customerPhone, setCustomerPhone] = useState('07700 900543');
  const [locationSharingMode, setLocationSharingMode] = useState<'precise_live_gps' | 'privacy_fixed_pin'>('precise_live_gps');
  const [paymentMethod, setPaymentMethod] = useState<'card_online' | 'pay_on_completion' | 'corporate_account'>('card_online');
  const [corporatePo, setCorporatePo] = useState('');

  // Submitted Confirmation State
  const [submittedBooking, setSubmittedBooking] = useState<CustomerBookingRecord | null>(null);

  // Dynamic Quote Calculation
  const calculateQuote = () => {
    let base = 25.00;
    if (vehicleCategory === 'Executive Chauffeur') base = 65.00;
    if (vehicleCategory === 'WAV Wheelchair Accessible') base = 35.00;
    if (vehicleCategory === 'Minibus 8-Seater') base = 55.00;

    const estMiles = 36; // Heathrow distance approx
    const mileageCharge = estMiles * 2.10;
    const airportCharge = hasFlight ? 15.00 : 0.00;
    return (base + mileageCharge + airportCharge);
  };

  const currentQuote = calculateQuote();

  const handleBookingSubmit = (e: React.FormEvent, forceState?: CustomerBookingState) => {
    e.preventDefault();

    // Determine state: if corporate or standard online card, can be confirmed or request received
    const assignedState: CustomerBookingState = forceState || (paymentMethod === 'card_online' ? 'confirmed' : 'request_received');
    const newRef = `DEC-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: CustomerBookingRecord = {
      id: `CBK-${Date.now()}`,
      bookingRef: newRef,
      customerName,
      customerEmail,
      customerPhone,
      pickupAddress,
      pickupPostcode,
      destinationAddress,
      destinationPostcode,
      dateTime: `${date} ${time}`,
      vehicleCategory,
      passengerCount: passengers,
      luggageCount: luggage,
      accessibility,
      flightDetails: hasFlight ? {
        airline,
        flightNumber,
        airport: 'Heathrow (LHR)',
        terminal,
        landingTime: '08:45',
        landingBufferMinutes: landingBuffer,
        meetAndGreet,
        nameboardText
      } : undefined,
      inclusions: [
        { title: 'Included Mileage Allowance', included: true, detail: '36.5 direct transit miles included in fixed quote' },
        { title: 'Flight Delay Waiting Buffer', included: hasFlight, detail: `${landingBuffer} mins free waiting after actual landing` },
        { title: 'Terminal Barrier Drop-off Fee', included: hasFlight, detail: 'Heathrow barrier charge (£6.50) fully covered' },
        { title: 'Accessibility Specification', included: accessibility.wheelchairRequired || accessibility.hearingLoop, detail: 'Vehicle pre-dispatched matching accessibility profile' },
        { title: 'Zero Card Processing Fee', included: true, detail: 'No hidden checkout or surcharge fees' }
      ],
      quoteGbp: currentQuote,
      state: assignedState,
      paymentMethod,
      corporatePoNumber: corporatePo || undefined,
      trackingLinkUrl: `/track/${newRef}`,
      createdAt: 'Just now'
    };

    setSubmittedBooking(newBooking);
    setBookingsList([newBooking, ...bookingsList]);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text)] tracking-tight">
            Book Your Journey
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Instant transparent quotes, certified accessibility options, and executive flight transfers.
          </p>
        </div>

        {/* View Switcher: New Booking vs Booking History */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[14px] border border-[var(--border)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('new_booking'); setSubmittedBooking(null); }}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition nr-focus ${
              activeTab === 'new_booking' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            New Booking Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('booking_history')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-heading font-bold transition nr-focus ${
              activeTab === 'booking_history' ? 'bg-[#B6F23C] text-[#08201C] shadow-lime-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            My Bookings ({bookingsList.length})
          </button>
        </div>
      </div>

      {/* CONFIRMED / REQUEST RECEIVED STATE SCREEN */}
      {submittedBooking ? (
        <div className="nr-card p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 border-2 border-[var(--border)] shadow-2xl">
          
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              submittedBooking.state === 'confirmed'
                ? 'bg-[#34D399]/20 text-[#34D399] border-2 border-[#34D399]'
                : 'bg-[#FFC24B]/20 text-[#D97706] dark:text-[#FFC24B] border-2 border-[#FFC24B]'
            }`}>
              {submittedBooking.state === 'confirmed' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Clock className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-block ${
                submittedBooking.state === 'confirmed' ? 'chip-ready' : 'chip-due-soon'
              }`}>
                {submittedBooking.state === 'confirmed' ? 'Booking Confirmed • Auto-Allocated' : 'Booking Request Received • Controller Review'}
              </span>

              <h2 className="text-2xl font-heading font-extrabold text-[var(--text)]">
                {submittedBooking.state === 'confirmed' ? 'Your Journey is Confirmed!' : 'Request Received — Reviewing Dispatch Availability'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                {submittedBooking.state === 'confirmed'
                  ? 'A dedicated driver and vehicle have been allocated. You will receive SMS alerts as your driver approaches.'
                  : 'Our dispatch team is confirming your specialist requirements. You will receive an SMS confirmation within 15 minutes.'}
              </p>
            </div>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-[var(--surface-2)] p-5 rounded-[16px] border border-[var(--border)] space-y-4 max-w-xl mx-auto text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">Booking Reference</span>
                <span className="font-mono font-extrabold text-lg text-[var(--text)]">{submittedBooking.bookingRef}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">Total Fixed Fare</span>
                <span className="font-mono font-extrabold text-lg text-[#34D399]">£{submittedBooking.quoteGbp.toFixed(2)} GBP</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-semibold">Pick-Up Address</span>
                <span className="font-heading font-bold text-[var(--text)]">{submittedBooking.pickupAddress}</span>
                <span className="font-mono text-[#3FE0C5] text-[11px] block">{submittedBooking.pickupPostcode}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-semibold">Destination Drop-Off</span>
                <span className="font-heading font-bold text-[var(--text)]">{submittedBooking.destinationAddress}</span>
                <span className="font-mono text-[#FF9F6B] text-[11px] block">{submittedBooking.destinationPostcode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Date &amp; Time</span>
                <span className="font-semibold text-[var(--text)]">{submittedBooking.dateTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Vehicle Tier</span>
                <span className="font-semibold text-[var(--text)]">{submittedBooking.vehicleCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Payment Mode</span>
                <span className="font-mono font-bold text-[#34D399] capitalize">{submittedBooking.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={submittedBooking.trackingLinkUrl}
              className="btn-primary w-full sm:w-auto !min-h-[48px] !px-6 !text-xs"
            >
              <MapPin className="w-4 h-4" />
              <span>Track Live Journey Status</span>
            </Link>

            <button
              type="button"
              onClick={() => { setSubmittedBooking(null); setActiveTab('new_booking'); }}
              className="btn-secondary w-full sm:w-auto !min-h-[48px] !px-6 !text-xs"
            >
              Book Another Ride
            </button>
          </div>

        </div>
      ) : activeTab === 'new_booking' ? (
        
        /* NEW BOOKING FORM (Responsive, WCAG AA, Keyboard Friendly) */
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          {/* Main 2 Columns: Locations, Flight, Accessibility, Contact */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Journey Route & Schedule */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">1</span>
                <span>Route &amp; Date Selection</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup" className="font-heading font-semibold text-[var(--text)] block mb-1">
                    Pick-up Address <span className="text-[#FF5D6C]">*</span>
                  </label>
                  <input
                    id="pickup"
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="nr-input font-medium"
                    placeholder="e.g. 14 High Street or Train Station"
                  />
                </div>
                <div>
                  <label htmlFor="pickup_postcode" className="font-heading font-semibold text-[var(--text)] block mb-1">
                    Pick-up Postcode <span className="text-[#FF5D6C]">*</span>
                  </label>
                  <input
                    id="pickup_postcode"
                    type="text"
                    required
                    value={pickupPostcode}
                    onChange={(e) => setPickupPostcode(e.target.value)}
                    className="nr-input font-mono font-bold uppercase"
                    placeholder="e.g. LU1 3JW"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dest" className="font-heading font-semibold text-[var(--text)] block mb-1">
                    Destination Drop-off <span className="text-[#FF5D6C]">*</span>
                  </label>
                  <input
                    id="dest"
                    type="text"
                    required
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="nr-input font-medium"
                    placeholder="e.g. London Heathrow Airport T5"
                  />
                </div>
                <div>
                  <label htmlFor="dest_postcode" className="font-heading font-semibold text-[var(--text)] block mb-1">
                    Destination Postcode <span className="text-[#FF5D6C]">*</span>
                  </label>
                  <input
                    id="dest_postcode"
                    type="text"
                    required
                    value={destinationPostcode}
                    onChange={(e) => setDestinationPostcode(e.target.value)}
                    className="nr-input font-mono font-bold uppercase"
                    placeholder="e.g. TW6 2GA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label htmlFor="date" className="font-heading font-semibold text-[var(--text)] block mb-1">Date (DD/MM/YYYY)</label>
                  <input
                    id="date"
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="nr-input font-mono font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="font-heading font-semibold text-[var(--text)] block mb-1">Pick-up Time</label>
                  <input
                    id="time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="nr-input font-mono font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="passengers" className="font-heading font-semibold text-[var(--text)] block mb-1">Passengers</label>
                  <input
                    id="passengers"
                    type="number"
                    min="1"
                    max="16"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                    className="nr-input font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="luggage" className="font-heading font-semibold text-[var(--text)] block mb-1">Large Bags</label>
                  <input
                    id="luggage"
                    type="number"
                    min="0"
                    max="16"
                    value={luggage}
                    onChange={(e) => setLuggage(parseInt(e.target.value) || 0)}
                    className="nr-input font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Step 2: Vehicle Selection */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">2</span>
                <span>Select Vehicle Class</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Vehicle classes">
                {[
                  { name: 'Saloon', desc: 'Standard 4-door saloon. Up to 4 passengers & 2 suitcases.', tier: 'Economy & City' },
                  { name: 'Executive Chauffeur', desc: 'Mercedes E-Class / V-Class with leather seats, Wi-Fi & meet-and-greet.', tier: 'VIP & Corporate' },
                  { name: 'WAV Wheelchair Accessible', desc: 'Certified wheelchair ramp, low-gradient entry & 4-point floor tie-downs.', tier: 'Accessible & NHS' },
                  { name: 'Minibus 8-Seater', desc: 'Spacious 8/9-seat passenger transit with high-capacity rear luggage cage.', tier: 'Group & Event' }
                ].map(v => {
                  const isSelected = vehicleCategory === v.name;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setVehicleCategory(v.name as any)}
                      className={`p-4 rounded-[16px] text-left border transition-all duration-180 flex flex-col justify-between space-y-2 nr-focus ${
                        isSelected
                          ? 'border-[#B6F23C] bg-[var(--surface-2)] shadow-lime-glow ring-2 ring-[#B6F23C]/20'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-heading font-bold text-sm text-[var(--text)] block">{v.name}</span>
                          <span className="text-[10px] font-mono text-[#3FE0C5] font-semibold">{v.tier}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#B6F23C] bg-[#B6F23C] text-[#08201C]' : 'border-[var(--border)]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Flight Tracking Details */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">3</span>
                  <span>Flight &amp; Airport Meet-and-Greet (Optional)</span>
                </h2>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={hasFlight}
                    onChange={(e) => setHasFlight(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B6F23C] focus:ring-0"
                  />
                  <span>Connecting to a Flight</span>
                </label>
              </div>

              {hasFlight && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-heading font-semibold text-[var(--text)] block mb-1">Airline</label>
                      <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        className="nr-input"
                        placeholder="e.g. British Airways"
                      />
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-[var(--text)] block mb-1">Flight Number</label>
                      <input
                        type="text"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        className="nr-input font-mono font-bold uppercase"
                        placeholder="e.g. BA1482"
                      />
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-[var(--text)] block mb-1">Airport Terminal</label>
                      <input
                        type="text"
                        value={terminal}
                        onChange={(e) => setTerminal(e.target.value)}
                        className="nr-input font-medium"
                        placeholder="e.g. Terminal 5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[var(--surface-2)] rounded-[14px] border border-[var(--border)]">
                    <div>
                      <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                        Landing Buffer: <strong className="text-[#3FE0C5] font-mono">{landingBuffer} minutes</strong>
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="90"
                        step="15"
                        value={landingBuffer}
                        onChange={(e) => setLandingBuffer(parseInt(e.target.value))}
                        className="w-full accent-[#B6F23C]"
                      />
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                        Driver meets passenger {landingBuffer} mins after verified landing time.
                      </span>
                    </div>

                    <div>
                      <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                        Terminal Nameboard Text
                      </label>
                      <input
                        type="text"
                        value={nameboardText}
                        onChange={(e) => setNameboardText(e.target.value)}
                        className="nr-input !h-[38px] font-medium"
                        placeholder="e.g. Dr. Alistair Finch / Company"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Accessibility Requirements */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">4</span>
                <span>Accessibility &amp; Special Assistance</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'wheelchairRequired', label: 'Wheelchair user remaining in chair' },
                  { key: 'rampRequired', label: 'Mechanical wheelchair ramp required' },
                  { key: 'lowStepVehicle', label: 'Low step / easy-entry vehicle' },
                  { key: 'hearingLoop', label: 'Vehicle equipped with hearing loop' },
                  { key: 'assistanceDog', label: 'Travelling with registered assistance dog' },
                  { key: 'driverAssistanceNeeded', label: 'Door-to-door passenger assistance' }
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer hover:border-[#B6F23C] transition">
                    <input
                      type="checkbox"
                      checked={(accessibility as any)[opt.key]}
                      onChange={(e) => setAccessibility({ ...accessibility, [opt.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-[#B6F23C] focus:ring-0"
                    />
                    <span className="font-heading font-semibold text-xs text-[var(--text)]">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="font-heading font-semibold text-[var(--text)] block mb-1">
                  Additional Accessibility Notes for Driver
                </label>
                <textarea
                  rows={2}
                  value={accessibility.additionalNotes}
                  onChange={(e) => setAccessibility({ ...accessibility, additionalNotes: e.target.value })}
                  placeholder="e.g. Pupil travels with soft harness; please allow 5 extra minutes for quiet loading."
                  className="w-full p-2.5 rounded-[12px] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs focus:border-[#B6F23C] outline-none"
                />
              </div>
            </div>

            {/* Step 5: Passenger Live Location Sharing vs Privacy (Enhancement) */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">5</span>
                  <span>Pickup Telemetry &amp; Location Privacy</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C] border border-[#B6F23C]/40 uppercase">
                  Enhancement
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationSharingMode('precise_live_gps')}
                  className={`p-4 rounded-[16px] text-left border transition flex flex-col justify-between space-y-2 ${
                    locationSharingMode === 'precise_live_gps'
                      ? 'border-[#B6F23C] bg-[var(--surface-2)] ring-2 ring-[#B6F23C]/30 shadow-lime-glow'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#3FE0C5]" />
                      <span>Share Precise Live GPS</span>
                    </span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      locationSharingMode === 'precise_live_gps' ? 'border-[#B6F23C] bg-[#B6F23C] text-[#08201C]' : 'border-[var(--border)]'
                    }`}>
                      {locationSharingMode === 'precise_live_gps' && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Broadcasts high-accuracy walking telemetry to driver during pickup window. Perfect for busy airport drop-offs and train stations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationSharingMode('privacy_fixed_pin')}
                  className={`p-4 rounded-[16px] text-left border transition flex flex-col justify-between space-y-2 ${
                    locationSharingMode === 'privacy_fixed_pin'
                      ? 'border-[#FF9F6B] bg-[var(--surface-2)] ring-2 ring-[#FF9F6B]/30'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                      <EyeOff className="w-4 h-4 text-[#FF9F6B]" />
                      <span>Privacy Mode (Fixed Pin Only)</span>
                    </span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      locationSharingMode === 'privacy_fixed_pin' ? 'border-[#FF9F6B] bg-[#FF9F6B] text-[#08201C]' : 'border-[var(--border)]'
                    }`}>
                      {locationSharingMode === 'privacy_fixed_pin' && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Driver navigates strictly to your booked address/postcode pin. Zero device GPS telemetry transmitted.
                  </p>
                </button>
              </div>

              <div className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-2)] p-2.5 rounded-[10px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>GDPR Safe: Telemetry expires instantly when job completes. No third-party data tracking.</span>
              </div>
            </div>

            {/* Step 6: Contact & Payment Step */}
            <div className="nr-card p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B6F23C] text-[#08201C] font-mono font-bold text-xs flex items-center justify-center">6</span>
                <span>Passenger Contact &amp; Payment Step</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-heading font-semibold text-[var(--text)] block mb-1">Full Name <span className="text-[#FF5D6C]">*</span></label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="nr-input font-medium"
                  />
                </div>
                <div>
                  <label className="font-heading font-semibold text-[var(--text)] block mb-1">Email (For e-ticket) <span className="text-[#FF5D6C]">*</span></label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="nr-input font-medium"
                  />
                </div>
                <div>
                  <label className="font-heading font-semibold text-[var(--text)] block mb-1">Mobile Phone (For SMS Tracking) <span className="text-[#FF5D6C]">*</span></label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="nr-input font-mono font-bold"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2">
                <label className="font-heading font-semibold text-[var(--text)] block">Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'card_online', label: 'Debit / Credit Card', sub: 'Instant confirmation & receipt' },
                    { key: 'pay_on_completion', label: 'Pay on Completion', sub: 'Cash / Card terminal in vehicle' },
                    { key: 'corporate_account', label: 'Corporate Billed Account', sub: 'PO reference invoice' }
                  ].map(pm => (
                    <label key={pm.key} className={`p-3 rounded-[12px] border cursor-pointer flex flex-col justify-between transition ${
                      paymentMethod === pm.key ? 'border-[#B6F23C] bg-[var(--surface-2)] shadow-sm' : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === pm.key}
                          onChange={() => setPaymentMethod(pm.key as any)}
                          className="w-4 h-4 text-[#B6F23C] focus:ring-0"
                        />
                        <span className="font-heading font-bold text-xs text-[var(--text)]">{pm.label}</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] mt-1">{pm.sub}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'corporate_account' && (
                  <div className="p-3 bg-[var(--surface-2)] rounded-[12px] border border-[var(--border)] space-y-2">
                    <label className="font-heading font-semibold text-[var(--text)] block">
                      Mandatory Purchase Order (PO) Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PO-AZ-2026-981"
                      value={corporatePo}
                      onChange={(e) => setCorporatePo(e.target.value)}
                      className="nr-input !h-[38px] font-mono font-bold uppercase text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Quote Summary & Inclusions */}
          <div className="space-y-4">
            <div className="nr-card p-5 sm:p-6 space-y-4 sticky top-20 shadow-xl border border-[var(--border)]">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                Transparent Journey Quote
              </span>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-mono font-extrabold text-[#34D399]">
                    £{currentQuote.toFixed(2)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] ml-1">GBP</span>
                </div>
                <span className="chip-ready px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                  Fixed Fare Guarantee
                </span>
              </div>

              {/* Inclusions Matrix (Requirement 1: Quote with inclusions shown) */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <span className="font-heading font-bold text-[11px] text-[var(--text)] block">
                  Included in this Quote:
                </span>

                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span className="text-[var(--text)]">Direct door-to-door transit (approx. 36.5 mi)</span>
                  </div>
                  {hasFlight && (
                    <div className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span className="text-[var(--text)]">Flight tracking with {landingBuffer}m free waiting buffer</span>
                    </div>
                  )}
                  {hasFlight && (
                    <div className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span className="text-[var(--text)]">Heathrow T5 barrier drop-off charge (£6.50)</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span className="text-[var(--text)]">Luggage allowance: up to {luggage} checked bags</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span className="text-[var(--text)]">Zero card fees &amp; instant VAT invoice</span>
                  </div>
                </div>
              </div>

              {/* Explicit State Buttons for testing */}
              <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={(e) => handleBookingSubmit(e, 'confirmed')}
                  className="btn-primary w-full !min-h-[48px] !text-xs !font-bold font-heading"
                >
                  <span>Confirm &amp; Book Now (£{currentQuote.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleBookingSubmit(e, 'request_received')}
                  className="btn-secondary w-full !min-h-[44px] !text-xs"
                >
                  Submit as "Request Received"
                </button>

                <p className="text-[10px] text-center text-[var(--text-muted)] pt-1">
                  Compliant with WCAG AA accessibility standards. 256-bit encrypted checkout.
                </p>
              </div>

            </div>
          </div>

        </form>

      ) : (

        /* BOOKING HISTORY VIEW (Requirement 1) */
        <div className="nr-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--text)]">
                Booking History &amp; Active Journeys
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Review past receipts and track active journeys.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {bookingsList.map(bk => (
              <div key={bk.id} className="p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[var(--text)]">{bk.bookingRef}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      bk.state === 'confirmed' ? 'chip-ready' : 'chip-due-soon'
                    }`}>
                      {bk.state === 'confirmed' ? 'Confirmed' : 'Request Received'}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">• {bk.createdAt}</span>
                  </div>

                  <p className="font-heading font-semibold text-[var(--text)]">
                    {bk.pickupAddress} &rarr; {bk.destinationAddress}
                  </p>

                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-3">
                    <span>{bk.dateTime}</span>
                    <span>•</span>
                    <span>{bk.vehicleCategory}</span>
                    <span>•</span>
                    <span className="font-mono text-[#34D399] font-bold">£{bk.quoteGbp.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={bk.trackingLinkUrl}
                    className="btn-primary !text-xs !py-1.5 !px-3"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Track Journey</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

      )}

    </div>
  );
};

