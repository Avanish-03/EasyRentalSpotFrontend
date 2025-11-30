import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Thanks ${name}! We'll get back to you at ${email}.`);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section className="relative h-[600px]">
      {/* Map Background */}
      <iframe
        title="EasyRentalSpot Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.447243402187!2d72.8418050749173!3d21.179422586112477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dfc37f1b0b7%3A0x8c59e0edb77a4b9f!2sSurat!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
        className="absolute inset-0 w-full h-full object-cover filter brightness-75"
        allowFullScreen=""
        loading="lazy"
      ></iframe>

      {/* Contact Form */}
      <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 z-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Send us a message and we’ll get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
