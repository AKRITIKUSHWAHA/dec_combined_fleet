import React, { useState } from 'react';
import { 
  mockRecurringTemplates, 
  mockLostPropertyItems, 
  mockComplaints, 
  mockDispatchChatMessages 
} from '../data/mockDataPhase9';
import { 
  RecurringBookingTemplate, 
  LostPropertyItem, 
  CustomerComplaint, 
  DispatchChatMessage 
} from '../types/phase9';
import { 
  Repeat, 
  PackageSearch, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Plus, 
  Clock, 
  User, 
  Phone, 
  Car, 
  ShieldCheck, 
  Check, 
  Radio, 
  Search,
  Calendar,
  Sparkles
} from 'lucide-react';

export const OfficeExtrasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recurring' | 'lost_property' | 'complaints' | 'chat'>('recurring');

  // Recurring Templates
  const [templates, setTemplates] = useState<RecurringBookingTemplate[]>(mockRecurringTemplates);
  
  // Lost Property
  const [lostItems, setLostItems] = useState<LostPropertyItem[]>(mockLostPropertyItems);
  const [lostSearch, setLostSearch] = useState('');

  // Complaints
  const [complaints, setComplaints] = useState<CustomerComplaint[]>(mockComplaints);

  // Office Chat
  const [messages, setMessages] = useState<DispatchChatMessage[]>(mockDispatchChatMessages);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('drv-01');
  const [isBroadcast, setIsBroadcast] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: DispatchChatMessage = {
      id: `msg-${Date.now()}`,
      senderType: 'office',
      senderName: 'Liam Reynolds (Dispatch Control)',
      recipientStaffId: isBroadcast ? 'all-drivers' : selectedRecipient,
      recipientStaffName: isBroadcast ? 'All On-Duty Drivers' : 'Tariq Mahmood (LT73 XKL)',
      text: newMessageText.trim(),
      timestamp: new Date().toTimeString().substring(0, 5),
      deliveryStatus: 'sent',
      isBroadcast
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessageText('');

    // Simulate auto-delivered status after 1.5s
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, deliveryStatus: 'delivered' } : m));
    }, 1500);
  };

  const filteredLostItems = lostItems.filter(item => 
    item.itemTitle.toLowerCase().includes(lostSearch.toLowerCase()) ||
    item.vehicleReg.toLowerCase().includes(lostSearch.toLowerCase()) ||
    item.reference.toLowerCase().includes(lostSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-bold text-[var(--text)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3FE0C5]" />
            <span>Office Operations &amp; Dispatch Support</span>
            <span className="chip-ready px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
              HQ Extras
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Recurring schedule templates, lost property registry, customer/council complaints log, and real-time staff messaging.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[var(--surface-2)] p-1 rounded-[12px] border border-[var(--border)] overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('recurring')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'recurring' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Recurring Templates</span>
          </button>
          <button
            onClick={() => setActiveTab('lost_property')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lost_property' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <PackageSearch className="w-3.5 h-3.5 text-[#FF9F6B]" />
            <span>Lost Property ({lostItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'complaints' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF5D6C]" />
            <span>Complaints ({complaints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-heading font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat' ? 'bg-[var(--surface)] text-[#3FE0C5] shadow-xs' : 'text-[var(--text-muted)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#3FE0C5]" />
            <span>Staff Chat Inbox</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RECURRING BOOKINGS & TEMPLATES */}
      {activeTab === 'recurring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="nr-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B6F23C] bg-[#B6F23C]/10 px-2 py-0.5 rounded border border-[#B6F23C]/30">
                      {tmpl.recurringPattern}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[var(--text)] mt-1">
                      {tmpl.templateName}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">{tmpl.customerName}</p>
                  </div>

                  <span className="text-sm font-heading font-bold text-[#B6F23C] font-mono">
                    £{tmpl.fixedFareGbp.toFixed(2)}/run
                  </span>
                </div>

                <div className="p-3 bg-[var(--surface-2)] rounded-[12px] text-xs font-mono space-y-1">
                  <p className="truncate"><strong className="text-[var(--text-muted)]">Pick:</strong> {tmpl.pickupAddress}</p>
                  <p className="truncate"><strong className="text-[var(--text-muted)]">Drop:</strong> {tmpl.destinationAddress}</p>
                  <p className="text-[11px] text-[#3FE0C5]">Next Scheduled Run: {tmpl.nextScheduledDate}</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => alert(`1-Click booking spawned from template: ${tmpl.templateName}. Dispatched to next available vehicle.`)}
                    className="btn-primary !text-xs !py-1.5 !px-3 !min-h-[36px] flex-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Spawn Next Booking</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOST PROPERTY LOG */}
      {activeTab === 'lost_property' && (
        <div className="nr-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Lost Property Register (Found in Fleet Vehicles)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Logged items found during end-of-run safety sweeps &amp; daily walkaround checks.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference, item or vehicle..."
                value={lostSearch}
                onChange={(e) => setLostSearch(e.target.value)}
                className="nr-input !h-[36px] pl-9 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ref / Date Found</th>
                  <th className="p-3">Vehicle &amp; Finder</th>
                  <th className="p-3">Category &amp; Item Title</th>
                  <th className="p-3">Location Found</th>
                  <th className="p-3">Matched Passenger</th>
                  <th className="p-3 text-right">Claim Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[11px]">
                {filteredLostItems.map(item => (
                  <tr key={item.id} className="hover:bg-[var(--surface-2)] transition">
                    <td className="p-3 font-bold text-[var(--text)]">
                      {item.reference}
                      <span className="block text-[10px] text-[var(--text-muted)] font-normal">{item.dateFound} {item.timeFound}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-[#3FE0C5] font-bold">{item.vehicleReg}</span>
                      <span className="block text-[10px] text-[var(--text-muted)]">{item.driverFinderName}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-heading font-bold text-[var(--text)]">{item.itemTitle}</span>
                      <span className="block text-[10px] text-[var(--text-muted)] line-clamp-1">{item.description}</span>
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">{item.locationInVehicle}</td>
                    <td className="p-3">
                      {item.claimantName ? (
                        <>
                          <span className="font-bold text-[var(--text)]">{item.claimantName}</span>
                          <span className="block text-[10px] text-[var(--text-muted)]">{item.matchedBookingRef}</span>
                        </>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] italic">Unmatched</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.passengerClaimStatus === 'returned_closed'
                          ? 'bg-[#34D399]/20 text-[#34D399]'
                          : item.passengerClaimStatus === 'verified_for_pickup'
                          ? 'bg-[#B6F23C]/20 text-[#08201C] dark:text-[#B6F23C]'
                          : 'bg-[#FF9F6B]/20 text-[#FF9F6B]'
                      }`}>
                        {item.passengerClaimStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLAINTS LOG WITH SLA DEADLINES */}
      {activeTab === 'complaints' && (
        <div className="nr-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                Passenger &amp; Council Complaints Incident Register
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Logged complaints with statutory SLA investigation deadlines &amp; council compliance reporting.
              </p>
            </div>

            <button
              onClick={() => alert('New complaint intake form initiated.')}
              className="btn-secondary !text-xs !py-1 !px-3 !min-h-[36px]"
            >
              + Log New Complaint
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Complaint Ref</th>
                  <th className="p-3">Complainant / Booking</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">SLA Deadline</th>
                  <th className="p-3">Investigation Status</th>
                  <th className="p-3 text-right">Council Notified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[11px]">
                {complaints.map(cmp => (
                  <tr key={cmp.id} className="hover:bg-[var(--surface-2)] transition">
                    <td className="p-3 font-bold text-[var(--text)]">
                      {cmp.complaintRef}
                      <span className="block text-[10px] text-[var(--text-muted)] font-normal">{cmp.loggedDate}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-heading font-bold text-[var(--text)]">{cmp.complainantName}</span>
                      <span className="block text-[10px] text-[var(--text-muted)]">Booking: {cmp.bookingRef} ({cmp.customerPhone})</span>
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">{cmp.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cmp.severity === 'critical_safety'
                          ? 'bg-[#FF5D6C] text-white'
                          : cmp.severity === 'moderate'
                          ? 'bg-[#FFC24B]/20 text-[#FFC24B]'
                          : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                      }`}>
                        {cmp.severity.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-[#FF5D6C] font-bold">{cmp.slaDeadline}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cmp.investigationStatus === 'resolved_closed'
                          ? 'bg-[#34D399]/20 text-[#34D399]'
                          : 'bg-[#3FE0C5]/20 text-[#3FE0C5]'
                      }`}>
                        {cmp.investigationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {cmp.councilNotified ? (
                        <span className="text-[#34D399] font-bold">YES (Logged)</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">Internal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF MESSAGES INBOX WITH QUEUED / SENT / DELIVERED / FAILED STATES */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Staff Channels (4 Cols) */}
          <div className="lg:col-span-4 nr-card p-4 space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Active Duty Channels
            </h3>

            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => { setSelectedRecipient('drv-01'); setIsBroadcast(false); }}
                className={`w-full p-2.5 rounded-[12px] text-left transition flex items-center justify-between border ${
                  selectedRecipient === 'drv-01' && !isBroadcast
                    ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)]'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <div>
                  <p className="font-heading font-bold text-[var(--text)]">Tariq Mahmood</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">Driver • LT73 XKL</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRecipient('pa-01'); setIsBroadcast(false); }}
                className={`w-full p-2.5 rounded-[12px] text-left transition flex items-center justify-between border ${
                  selectedRecipient === 'pa-01' && !isBroadcast
                    ? 'bg-[#B6F23C]/20 border-[#B6F23C] text-[var(--text)]'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <div>
                  <p className="font-heading font-bold text-[var(--text)]">Sarah Jenkins</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">PA • Chiltern School Route</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              </button>

              <button
                type="button"
                onClick={() => setIsBroadcast(true)}
                className={`w-full p-2.5 rounded-[12px] text-left transition flex items-center justify-between border ${
                  isBroadcast
                    ? 'bg-[#FF9F6B]/20 border-[#FF9F6B] text-[var(--text)]'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <div>
                  <p className="font-heading font-bold text-[#FF9F6B]">Central Broadcast</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">All On-Duty Vehicles</p>
                </div>
                <Radio className="w-3.5 h-3.5 text-[#FF9F6B]" />
              </button>
            </div>
          </div>

          {/* Right Chat History & Sender (8 Cols) */}
          <div className="lg:col-span-8 nr-card p-5 flex flex-col justify-between h-[450px]">
            {/* Header */}
            <div className="pb-3 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-[var(--text)]">
                  {isBroadcast ? 'Central Emergency & Traffic Broadcast' : 'Direct Dispatch Channel: Tariq Mahmood (LT73 XKL)'}
                </h4>
                <p className="text-[10px] font-mono text-[var(--text-muted)]">
                  Telematics Linked • Auto-logged with GPS coordinates
                </p>
              </div>

              <span className="chip-ready text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                Encrypted PTT
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto nr-scrollbar py-3 space-y-3">
              {messages.map(msg => {
                const isFromOffice = msg.senderType === 'office';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isFromOffice ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-[14px] text-xs space-y-1 shadow-sm ${
                        msg.isBroadcast
                          ? 'bg-[#FF9F6B]/20 border border-[#FF9F6B]/40 text-[var(--text)]'
                          : isFromOffice
                          ? 'bg-[#B6F23C] text-[#08201C] font-medium'
                          : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]'
                      }`}
                    >
                      <p className="text-[10px] font-mono font-bold opacity-75">
                        {msg.senderName}
                      </p>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 px-1 text-[9px] font-mono text-[var(--text-muted)]">
                      <span>{msg.timestamp}</span>
                      <span>&bull;</span>
                      <span className={`uppercase font-bold ${
                        msg.deliveryStatus === 'delivered' ? 'text-[#34D399]' :
                        msg.deliveryStatus === 'failed' ? 'text-[#FF5D6C]' :
                        msg.deliveryStatus === 'queued' ? 'text-[#FFC24B]' : 'text-[#3FE0C5]'
                      }`}>
                        {msg.deliveryStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-[var(--border)] flex gap-2">
              <input
                type="text"
                placeholder={isBroadcast ? "Type broadcast announcement to all drivers..." : "Message Tariq Mahmood..."}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="nr-input !h-[42px] flex-1 text-xs"
              />
              <button
                type="submit"
                className="btn-primary !text-xs !py-1 !px-4 !min-h-[42px] shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default OfficeExtrasPage;
