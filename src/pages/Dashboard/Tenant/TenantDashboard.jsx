import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHome from "./DashboardHome";
import MyBookings from "./MyBookings";
import Payments from "./Payments";
import SavedListings from "./SavedListings";
import NewBookingModal from "./NewBookingModal";

export default function TenantDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "John Doe" };
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  // Temporary dynamic data
  const [bookings, setBookings] = useState([
    { id: 1, property: "Ocean View Apartment", date: "2025-10-20", status: "Confirmed", amount: "$1200" },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, property: "Ocean View Apartment", date: "2025-10-05", amount: "$1200", status: "Paid" },
  ]);

  const [savedListings, setSavedListings] = useState([
    { id: 1, title: "Ocean View Apartment", location: "Miami, FL", price: "$1200 / month" },
  ]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "myBookings", label: "My Bookings" },
    { id: "payments", label: "Payments" },
    { id: "savedListings", label: "Saved Listings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Map activePage to component
  const componentsMap = {
    dashboard: (
      <DashboardHome
        user={user}
        bookings={bookings}
        payments={payments}
        savedListings={savedListings}
        setBookings={setBookings}
        setPayments={setPayments}
        setSavedListings={setSavedListings}
        openNewBooking={() => setShowModal(true)}
      />
    ),
    myBookings: <MyBookings bookings={bookings} setBookings={setBookings} />,
    payments: <Payments payments={payments} setPayments={setPayments} />,
    savedListings: <SavedListings savedListings={savedListings} setSavedListings={setSavedListings} />,
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-purple-600">Tenant Menu</h1>
        <ul className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer p-2 rounded hover:bg-purple-100 ${
                activePage === item.id ? "bg-purple-200 font-semibold" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        {componentsMap[activePage]}
      </main>

      {/* New Booking Modal */}
      {showModal && (
        <NewBookingModal
          closeModal={() => setShowModal(false)}
          addBooking={(newBooking) => {
            setBookings([...bookings, newBooking]);
            setPayments([...payments, { id: Date.now(), property: newBooking.property, date: newBooking.date, amount: newBooking.amount, status: "Pending" }]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
