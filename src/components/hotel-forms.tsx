"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type AvailableRoom = { slug: string; name: string; type: "room" | "combination"; availableUnits: number; nightlyRateKsh: number; totalKsh: number; nights: number; maxGuests: number };
type ConfirmedReservation = { reference: string; roomName: string; checkIn: string; checkOut: string; guests: number; nights: number; nightlyRateKsh: number; totalKsh: number; email: string; status: string };
type GuestPaymentSubmission = { receiptNumber: string; amountKsh: number; balanceDueKsh: number; availableToRecordKsh: number };
const currency = (amount: number) => new Intl.NumberFormat("en-KE").format(amount);
const hotelToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export function RoomAvailabilityBooking({ roomSlug, roomName, maxGuests }: { roomSlug: string; roomName: string; maxGuests: number }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(String(Math.min(2, maxGuests)));
  const [availableRoom, setAvailableRoom] = useState<AvailableRoom | null>(null);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const guestLimit = Math.max(1, Math.min(maxGuests, 20));

  async function checkAvailability() {
    setBusy(true);
    setMessage("");
    setAvailableRoom(null);
    setChecked(false);
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setMessage("Choose a check-out date after check-in.");
      setBusy(false);
      return;
    }
    try {
      const query = new URLSearchParams({ checkIn, checkOut, guests });
      const response = await fetch(`/api/availability?${query.toString()}`, { cache: "no-store" });
      const result: unknown = await response.json();
      if (!response.ok) {
        const error = result && typeof result === "object" && "error" in result ? result.error : null;
        throw new Error(typeof error === "string" ? error : "Availability could not be checked.");
      }
      const rooms = result && typeof result === "object" && "rooms" in result && Array.isArray(result.rooms)
        ? result.rooms as AvailableRoom[]
        : [];
      const found = rooms.find((room) => room.slug === roomSlug) || null;
      setAvailableRoom(found);
      setChecked(true);
      if (!found) setMessage(`${roomName} is not available for those dates. Try another date or view all available rooms.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Availability could not be checked. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const bookingHref = availableRoom
    ? `/book?${new URLSearchParams({ roomSlug, checkIn, checkOut, guests }).toString()}`
    : `/book?${new URLSearchParams({ checkIn, checkOut, guests }).toString()}`;

  return <section className="room-availability-booking" aria-labelledby="room-availability-title">
    <div className="room-availability-heading">
      <span className="section-kicker">BOOK THIS ACCOMMODATION</span>
      <h2 id="room-availability-title">Check your dates</h2>
      <p>Live availability and rates are confirmed by HappyLand&apos;s booking system.</p>
    </div>
    <div className="room-availability-fields">
      <label>Check-in<input type="date" min={hotelToday()} value={checkIn} onChange={(event) => { setCheckIn(event.target.value); setChecked(false); setAvailableRoom(null); setMessage(""); }} /></label>
      <label>Check-out<input type="date" min={checkIn || hotelToday()} value={checkOut} onChange={(event) => { setCheckOut(event.target.value); setChecked(false); setAvailableRoom(null); setMessage(""); }} /></label>
      <label>Guests<select value={guests} onChange={(event) => { setGuests(event.target.value); setChecked(false); setAvailableRoom(null); setMessage(""); }}>{Array.from({ length: guestLimit }, (_, index) => index + 1).map((count) => <option value={count} key={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
      <button className="gold-button" type="button" onClick={() => void checkAvailability()} disabled={busy}>{busy ? "Checking live availability…" : "Check availability"}</button>
    </div>
    {busy && <p className="room-availability-status" role="status">Checking dates with the hotel…</p>}
    {!busy && message && <p className="room-availability-status" role="status">{message}</p>}
    {!busy && checked && availableRoom && <div className="room-availability-result" role="status">
      <div><span className="availability-pill">Available</span><b>{availableRoom.name}</b><p>Up to {availableRoom.maxGuests} guests · {availableRoom.nights} {availableRoom.nights === 1 ? "night" : "nights"} · KES {currency(availableRoom.nightlyRateKsh)} average per night</p><strong className="room-stay-total">Total for your stay <span>KES {currency(availableRoom.totalKsh)}</span></strong></div>
      <Link className="gold-button" href={bookingHref}>Book now <span aria-hidden="true">→</span></Link>
    </div>}
    {!busy && checked && !availableRoom && <Link className="text-link room-availability-alternatives" href={bookingHref}>See other available rooms <span aria-hidden="true">→</span></Link>}
  </section>;
}

export function EnquiryForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setStatus("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your enquiry could not be saved.");
      setStatus(result.emailSent ? "Your enquiry has been saved and sent to the hotel." : "Your enquiry has been saved. Email notifications are not configured, so please contact the hotel for a prompt reply.");
      formElement.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your enquiry could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Name" /></label>
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
    <label>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Optional" /></label>
    <label>Preferred dates<input name="dates" maxLength={100} placeholder="e.g. 12–16 November" /></label>
    <label className="full">How can we help?<textarea name="message" required minLength={5} maxLength={5000} placeholder="Tell us about your stay or question" /></label>
    <button className="gold-button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span></button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

export function BookingRequestForm({ initialRoomSlug = "", initialCheckIn = "", initialCheckOut = "", initialGuests = "2" }: { initialRoomSlug?: string; initialCheckIn?: string; initialCheckOut?: string; initialGuests?: string }) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(Boolean(initialRoomSlug && initialCheckIn && initialCheckOut));
  const [reservation, setReservation] = useState<ConfirmedReservation | null>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentAvailable, setPaymentAvailable] = useState(0);
  const [lastPaymentSubmission, setLastPaymentSubmission] = useState("");

  useEffect(() => {
    if (!initialRoomSlug || !initialCheckIn || !initialCheckOut) return;
    let active = true;
    const query = new URLSearchParams({ checkIn: initialCheckIn, checkOut: initialCheckOut, guests: initialGuests });
    fetch(`/api/availability?${query.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Availability could not be checked.");
        if (!active) return;
        const foundRooms = Array.isArray(result.rooms) ? result.rooms as AvailableRoom[] : [];
        const selected = foundRooms.find((room) => room.slug === initialRoomSlug);
        setRooms(foundRooms);
        setSelectedRoom(selected ? initialRoomSlug : "");
        setShowGuestDetails(false);
        if (!selected) setStatus("That accommodation is no longer available for these dates. Choose another available option below.");
      })
      .catch((error) => {
        if (active) setStatus(error instanceof Error ? error.message : "Availability could not be checked. Please try again.");
      })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [initialCheckIn, initialCheckOut, initialGuests, initialRoomSlug]);

  function changeStay(update: () => void) {
    update();
    setRooms([]);
    setSelectedRoom("");
    setShowGuestDetails(false);
    setStatus("");
  }

  async function checkAvailability() {
    setBusy(true);
    setStatus("");
    setRooms([]);
    setSelectedRoom("");
    setShowGuestDetails(false);
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setStatus("Choose a check-out date after your check-in date.");
      setBusy(false);
      return;
    }
    try {
      const query = new URLSearchParams({ checkIn, checkOut, guests });
      const response = await fetch(`/api/availability?${query.toString()}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Availability could not be checked.");
      setRooms(result.rooms);
      setShowGuestDetails(false);
      if (!result.rooms.length) setStatus(result.message || "No rooms are available for those dates.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Availability could not be checked. Please try again.");
    } finally {
      setBusy(false);
    }

  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoom) {
      setStatus("Check availability and choose a room first.");
      return;
    }
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: selectedRoom,
          checkIn,
          checkOut,
          guests: Number(guests),
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your reservation could not be created.");
      setReservation(result.reservation);
      setPaymentAvailable(result.reservation.status === "confirmed" ? Number(result.reservation.totalKsh) : 0);
      setStatus(result.emailSent ? "Your booking request is with the hotel team. Check your email for the next update." : "Your booking request is saved. The hotel will review it and confirm your stay. Contact the hotel directly if you need an urgent answer.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your reservation could not be created. Please check availability again.");
      if (responseStatusConflict(error)) {
        setRooms([]);
        setSelectedRoom("");
        setShowGuestDetails(false);
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitGuestPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reservation) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setPaymentBusy(true);
    setPaymentError("");
    setLastPaymentSubmission("");
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationReference: reservation.reference,
          email: reservation.email,
          amountKsh: Number(form.get("amountKsh")),
          transactionReference: form.get("transactionReference"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your payment could not be submitted.");
      const payment = result.payment as GuestPaymentSubmission;
      setPaymentAvailable(Number(payment.availableToRecordKsh));
      setLastPaymentSubmission(`Payment ${currency(payment.amountKsh)} submitted for staff verification. Projected remaining balance after verification: ${currency(payment.balanceDueKsh)}. Keep receipt reference ${payment.receiptNumber}.`);
      formElement.reset();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Your payment could not be submitted. Please try again.");
    } finally {
      setPaymentBusy(false);
    }
  }

  if (reservation) return <section className="booking-confirmation" role="status">
    <span className="section-kicker">{reservation.status === "confirmed" ? "RESERVATION CONFIRMED" : "BOOKING REQUEST RECEIVED"}</span>
    <h2>{reservation.status === "confirmed" ? "Your Diani stay is confirmed." : "The hotel team will review your request."}</h2>
    <p>{reservation.status === "confirmed" ? "Your reservation is confirmed. Keep this booking reference:" : "Your request has been sent for staff review. Keep this reference and wait for the hotel&apos;s confirmation before making a payment:"}</p>
    <strong className="booking-reference">{reservation.reference}</strong>
    <dl><div><dt>Room</dt><dd>{reservation.roomName}</dd></div><div><dt>Dates</dt><dd>{reservation.checkIn} to {reservation.checkOut} · {reservation.nights} nights</dd></div><div><dt>Guests</dt><dd>{reservation.guests}</dd></div><div><dt>Stay total</dt><dd>KES {currency(reservation.totalKsh)}</dd></div><div><dt>Confirmation email</dt><dd>{reservation.email}</dd></div></dl>
    <p className="content-note">{reservation.status === "confirmed" ? <>To make a part-payment, call <a href="tel:+254729896065">+254 729 896 065</a> for current M-Pesa payment details. All submitted M-Pesa transactions are verified by staff.</> : <>Please wait for the hotel to confirm your booking before making a payment. Once confirmed, call <a href="tel:+254729896065">+254 729 896 065</a> for current M-Pesa payment details. All submitted M-Pesa transactions are verified by staff.</>}</p>
    {reservation.status === "confirmed" && paymentAvailable > 0 && <form className="guest-part-payment" onSubmit={(event) => void submitGuestPayment(event)}>
      <div><span className="section-kicker">SECURE YOUR STAY · PART-PAYMENTS WELCOME</span><h3>Submit an M-Pesa payment</h3><p>Booking {reservation.reference} · Remaining amount available to submit: <b>KES {currency(paymentAvailable)}</b></p></div>
      <label>Amount paid (KES)<input name="amountKsh" type="number" min="1" max={paymentAvailable} step="1" required placeholder="Enter the amount you paid"/></label>
      <label>M-Pesa transaction code<input name="transactionReference" required minLength={4} maxLength={120} autoComplete="off" placeholder="e.g. QAB12CD34E"/></label>
      <button className="gold-button" type="submit" disabled={paymentBusy}>{paymentBusy ? "Submitting payment…" : "Submit for verification"} <span aria-hidden="true">→</span></button>
      {lastPaymentSubmission && <p className="guest-payment-success" role="status">{lastPaymentSubmission}</p>}
      {paymentError && <p className="guest-payment-error" role="alert">{paymentError}</p>}
      <small>Submitting a code does not confirm payment. A staff member verifies each M-Pesa transaction before updating your balance.</small>
    </form>}
    {reservation.status === "confirmed" && paymentAvailable <= 0 && <><p className="guest-payment-success">All of the available stay balance has been submitted for payment review.</p>{lastPaymentSubmission && <p className="guest-payment-success" role="status">{lastPaymentSubmission}</p>}</>}
    {status && <p className="form-status">{status}</p>}
  </section>;

  return <form className="booking-steps" onSubmit={submit}>
    <section className="booking-step"><span className="section-kicker">STEP 01 · YOUR STAY</span><h3>When would you like to come?</h3><div className="enquiry-form">
      <label>Check-in<input type="date" name="checkIn" min={hotelToday()} required value={checkIn} onChange={(event) => changeStay(() => setCheckIn(event.target.value))} /></label>
      <label>Check-out<input type="date" name="checkOut" min={checkIn || hotelToday()} required value={checkOut} onChange={(event) => changeStay(() => setCheckOut(event.target.value))} /></label>
      <label>Guests<select name="guests" value={guests} onChange={(event) => changeStay(() => setGuests(event.target.value))}>{Array.from({ length: 20 }, (_, index) => index + 1).map((count) => <option value={count} key={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
      <button className="gold-button availability-check" type="button" onClick={checkAvailability} disabled={busy}>{busy ? "Checking…" : "Check availability"}</button>
    </div>
      {rooms.length > 0 && !selectedRoom && <fieldset className="available-rooms"><legend>Choose an available accommodation</legend>{rooms.map((room) => <label className="available-room" key={room.slug}><input type="radio" name="selectedRoom" value={room.slug} checked={false} onChange={() => { setSelectedRoom(room.slug); setShowGuestDetails(false); }} /><span><b>{room.name}</b><small>{room.type === "combination" ? "Complete 3-bedroom stay" : `${room.availableUnits} available ${room.availableUnits === 1 ? "unit" : "units"}`} · Up to {room.maxGuests} guests</small><small className="available-room-total">{room.nights} {room.nights === 1 ? "night" : "nights"} · KES {currency(room.totalKsh)} total</small></span></label>)}</fieldset>}
      {selectedRoom && (() => {
        const selected = rooms.find((room) => room.slug === selectedRoom);
        if (!selected) return null;
        return <div className="selected-room-summary"><div><span className="availability-pill">Selected stay</span><b>{selected.name}</b><p>{selected.nights} {selected.nights === 1 ? "night" : "nights"} · {guests} {Number(guests) === 1 ? "guest" : "guests"} · KES {currency(selected.nightlyRateKsh)} average per night</p><strong className="room-stay-total">Total for your stay <span>KES {currency(selected.totalKsh)}</span></strong></div><button type="button" className="selected-room-change" onClick={() => { setSelectedRoom(""); setShowGuestDetails(false); }}>Change accommodation</button></div>;
      })()}
      {selectedRoom && !showGuestDetails && <button className="gold-button booking-continue" type="button" onClick={() => setShowGuestDetails(true)}>Continue to guest details <span aria-hidden="true">→</span></button>}
    </section>
    {showGuestDetails && <section className="booking-step"><span className="section-kicker">STEP 02 · YOUR DETAILS</span><h3>Who is staying?</h3><div className="enquiry-form">
      <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Name" /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      <label className="full">Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="e.g. +254 700 000 000" /></label>
    </div></section>}
    {showGuestDetails && <button className="gold-button" type="submit" disabled={busy || !selectedRoom}>{busy ? "Confirming…" : "Confirm reservation"} <span aria-hidden="true">→</span></button>}
    {status && <p className="content-note" role="status">{status}</p>}
  </form>;
}

function responseStatusConflict(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("no longer available");
}
