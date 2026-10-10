"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { hotelPhone, hotelPhoneDisplay } from "@/lib/hotel-content";

type PaymentBooking = {
  reference: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  totalChargesKsh: number;
  paidKsh: number;
  pendingKsh: number;
  balanceDueKsh: number;
  availableToRecordKsh: number;
};

type GuestPaymentResponse = {
  receiptNumber: string;
  amountKsh: number;
  balanceDueKsh: number;
  availableToRecordKsh: number;
};

const currency = (amount: number) => new Intl.NumberFormat("en-KE").format(amount);

export function GuestPaymentPortal({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = useState(initialReference);
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<PaymentBooking | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastSubmission, setLastSubmission] = useState("");

  async function lookup(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setLookupBusy(true);
    setError("");
    setLastSubmission("");
    try {
      const response = await fetch("/api/payments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationReference: reference, email }),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Booking balance could not be loaded.");
      setBooking(result.booking as PaymentBooking);
    } catch (lookupError) {
      setBooking(null);
      setError(lookupError instanceof Error ? lookupError.message : "Booking balance could not be loaded.");
    } finally {
      setLookupBusy(false);
    }
  }

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setPaymentBusy(true);
    setError("");
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationReference: booking.reference,
          email,
          amountKsh: Number(form.get("amountKsh")),
          transactionReference: form.get("transactionReference"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your payment could not be submitted.");
      const payment = result.payment as GuestPaymentResponse;
      setBooking((current) => current ? {
        ...current,
        pendingKsh: current.pendingKsh + payment.amountKsh,
        availableToRecordKsh: payment.availableToRecordKsh,
      } : current);
      setLastSubmission(`KSh ${currency(payment.amountKsh)} submitted for staff verification. Keep receipt reference ${payment.receiptNumber}. Your remaining available amount is KSh ${currency(payment.availableToRecordKsh)}.`);
      formElement.reset();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Your payment could not be submitted.");
    } finally {
      setPaymentBusy(false);
    }
  }

  return <section className="guest-payment-portal">
    <div className="guest-payment-portal-heading"><span className="section-kicker">HAPPYLAND · PAYMENT PORTAL</span><h2>Pay at your own pace</h2><p>Look up your confirmed booking, then submit one or more partial M-Pesa payments for hotel verification.</p></div>
    <form className="guest-payment-lookup" onSubmit={(event) => void lookup(event)}>
      <label>Booking reference<input value={reference} onChange={(event) => { setReference(event.target.value.toUpperCase()); setBooking(null); setLastSubmission(""); }} required minLength={6} maxLength={80} placeholder="HLD-2026-XXXXXXXXXX" autoComplete="off"/></label>
      <label>Booking email<input type="email" value={email} onChange={(event) => { setEmail(event.target.value.trim()); setBooking(null); setLastSubmission(""); }} required maxLength={254} placeholder="The email used for your booking" autoComplete="email"/></label>
      <button className="gold-button" type="submit" disabled={lookupBusy}>{lookupBusy ? "Checking booking…" : booking ? "Refresh balance" : "Find my booking"} <span aria-hidden="true">→</span></button>
    </form>
    {error && <p className="guest-payment-error" role="alert">{error}</p>}
    {booking && <div className="guest-payment-booking">
      <div className="guest-payment-stay"><span className="availability-pill">Booking found</span><h3>{booking.roomName}</h3><p>{booking.reference} · {booking.checkIn} to {booking.checkOut}</p></div>
      <dl className="guest-payment-balance">
        <div><dt>Total charges</dt><dd>KES {currency(booking.totalChargesKsh)}</dd></div>
        <div><dt>Verified payments</dt><dd>KES {currency(booking.paidKsh)}</dd></div>
        <div><dt>Pending verification</dt><dd>KES {currency(booking.pendingKsh)}</dd></div>
        <div className="guest-payment-due"><dt>Balance due</dt><dd>KES {currency(booking.balanceDueKsh)}</dd></div>
      </dl>
      {booking.availableToRecordKsh > 0 ? <form className="guest-part-payment" onSubmit={(event) => void submitPayment(event)}>
        <div><span className="section-kicker">PART-PAYMENTS WELCOME</span><h3>Submit an M-Pesa payment</h3><p>Before paying, call <a href={`tel:${hotelPhone}`}>{hotelPhoneDisplay}</a> to confirm current M-Pesa payment details. Available to submit: <b>KES {currency(booking.availableToRecordKsh)}</b></p></div>
        <label>Amount paid (KES)<input name="amountKsh" type="number" min="1" max={booking.availableToRecordKsh} step="1" required placeholder="Enter the amount you paid"/></label>
        <label>M-Pesa transaction code<input name="transactionReference" required minLength={4} maxLength={120} autoComplete="off" placeholder="e.g. QAB12CD34E"/></label>
        <button className="gold-button" type="submit" disabled={paymentBusy}>{paymentBusy ? "Submitting payment…" : "Submit for verification"} <span aria-hidden="true">→</span></button>
        {lastSubmission && <p className="guest-payment-success" role="status">{lastSubmission}</p>}
        <small>Submitting a code does not confirm payment. A staff member verifies every transaction before it counts as paid.</small>
      </form> : <p className="guest-payment-success" role="status">No further amount is currently available to submit. Pending amounts remain subject to staff verification.</p>}
        {lastSubmission && booking.availableToRecordKsh === 0 && <p className="guest-payment-success" role="status">{lastSubmission}</p>}
    </div>}
  </section>;
}
