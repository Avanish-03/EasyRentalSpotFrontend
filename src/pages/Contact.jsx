import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // For now just show data — later connect to backend API
    alert(`Thanks ${name}! We'll get back to you at ${email}.`);
    setName(''); setEmail(''); setMessage('');
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" rows={5} required />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send message</button>
        </div>
      </form>
    </div>
  );
}