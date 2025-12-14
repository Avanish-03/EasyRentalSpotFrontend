import React, { useState } from "react";
import {
  initiatePayment,
  confirmPaymentClient,
} from "../../../api/tenantApi";

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    try {
      setProcessing(true);

      // 1️⃣ Initiate payment
      const res = await initiatePayment({
        bookingId: booking._id,
        amount: booking.totalAmount,
        paymentMethod: "UPI",
      });

      const paymentId = res.data.payment.id;

      // 2️⃣ Fake UPI processing delay
      setTimeout(async () => {
        await confirmPaymentClient({
          paymentId,
          providerTransactionId: "UPI_TXN_" + Date.now(),
          status: "success",
        });

        setProcessing(false);
        setSuccess(true);

        // auto close after success
        setTimeout(() => {
          setSuccess(false);
          onClose();
          onSuccess();
        }, 2000);
      }, 2500);

    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 space-y-5">

          {/* PROPERTY INFO */}
          <div>
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-semibold text-gray-800">
              {booking.property?.title}
            </p>
          </div>

          {/* AMOUNT */}
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-indigo-600">
              ₹{booking.totalAmount}
            </p>
          </div>

          {/* UPI CARD */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                💳
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  UPI Payment
                </p>
                <p className="text-sm text-gray-500">
                  Google Pay, PhonePe, Paytm
                </p>
              </div>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {processing ? "Processing Payment..." : `Pay ₹${booking.totalAmount}`}
          </button>
        </div>
      </div>

      {/* ================= PROCESSING OVERLAY ================= */}
      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="font-medium text-gray-800">
              Processing your payment
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please don’t close this window
            </p>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              ✅
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Payment Successful
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your booking is confirmed 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
