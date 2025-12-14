import React from "react";
import {
    Home,
    Building,
    Wallet,
    User,
    Calendar,
    Bookmark,
    Bell,
    Settings,
    LogOut,
    Monitor,
} from "lucide-react";

export default function Sidebar({ role, activeTab, setActiveTab }) {

    const menu = {
        Owner: [
            { id: "home", label: "Dashboard", icon: <Home size={18} /> },
            { id: "properties", label: "My Properties", icon: <Building size={18} /> },
            { id: "bookings", label: "Bookings", icon: <Calendar size={18} /> },
            { id: "payments", label: "Payments", icon: <Wallet size={18} /> },
            { id: "visits", label: "Visits", icon: <Bookmark size={18} /> },
            { id: "reviews", label: "Reviews", icon: <Bell size={18} /> },
            { id: "profile", label: "Profile", icon: <User size={18} /> },
        ],

        Tenant: [
            { id: "home", label: "Dashboard", icon: <Home size={18} /> },
            { id: "bookings", label: "My Bookings", icon: <Calendar size={18} /> },
            { id: "payments", label: "My Payments", icon: <Wallet size={18} /> },
            { id: "wishlist", label: "Wishlist", icon: <Bookmark size={18} /> },
            { id: "profile", label: "Profile", icon: <User size={18} /> },
        ],

        Admin: [
            { id: "home", label: "Dashboard", icon: <Monitor size={18} /> },
            { id: "users", label: "Users", icon: <User size={18} /> },
            { id: "properties", label: "Properties", icon: <Building size={18} /> },
            { id: "bookings", label: "Bookings", icon: <Calendar size={18} /> },
            { id: "reports", label: "Reports", icon: <Settings size={18} /> },
            { id: "support", label: "Support Tickets", icon: <Bell size={18} /> },
            { id: "profile", label: "Profile", icon: <User size={18} /> },
        ],
    };

    // 🔥 Logout inside Sidebar (Fully Working)
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col py-6 px-3 shadow-lg fixed">

            <h2 className="text-2xl font-bold text-center mb-8">
                {role} Panel
            </h2>

            <nav className="flex-1 space-y-2">
                {menu[role]?.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition 
                            ${activeTab === item.id ? "bg-purple-600 shadow-md" : "hover:bg-gray-700"}`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

        </div>
    );
}
