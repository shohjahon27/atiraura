"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
// import toast from "react-hot-toast";

export default function ReviewForm({ productId }: { productId: string }) {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, productId }),
    });

    setLoading(false);
    if (res.ok) {
        alert("Sharhingiz yuborildi!");
        setForm({ name: "", rating: 5, comment: "" });
      } else {
        const data = await res.json();
        alert(`Xatolik: ${data.message}`);
      }
      
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-6 mt-12 rounded-xl shadow-md space-y-5 max-w-xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        ✍️ Sharh qoldiring
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ismingiz
        </label>
        <input
          type="text"
          placeholder="Masalan: Jasur"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
      </div>

      <div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setForm({ ...form, rating: star })}
              className={`p-1 transition ${
                form.rating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-label={`Rate ${star} stars`}
            >
              <Star fill={form.rating >= star ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Fikr-mulohaza (maks. 35 belgidan)
  </label>
  <textarea
    placeholder="Mahsulot haqida fikringiz..."
    value={form.comment}
    onChange={(e) => {
      if (e.target.value.length <= 35) {
        setForm({ ...form, comment: e.target.value });
      }
    }}
    maxLength={35}
    className="w-full border rounded-lg px-4 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
    required
  />
  <div className="text-sm text-gray-500 mt-1 text-right">
    {form.comment.length}/35
  </div>
</div>


      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Yuborilmoqda..." : "Sharhni yuborish"}
      </button>
    </form>
  );
}
