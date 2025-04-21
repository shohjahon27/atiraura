'use client';
import { useState } from "react";
import { FaUser, FaComment, FaPaperPlane } from "react-icons/fa";
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "+998", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: "guest-" + Math.random().toString(36).substring(2),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Xabar Muvaffaqiyatli Yuborildi!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setForm({ name: "", phone: "+998", message: "" }); // Reset phone to "+998"
      } else {
        console.error("Xabar yuborilmadi. Iltimos, keyinroq qayta urinib ko‘ring.:", data.error);
        toast.error(`Xabar yuborilmadi. Iltimos, keyinroq qayta urinib ko‘ring.: ${data.error}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Xabar yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaPaperPlane className="mr-2 text-pink-600" /> Bizga Xabar Yuboring
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Ismingiz</label>
          <div className="mt-1 flex items-center">
            <FaUser className="absolute left-3 text-pink-400 opacity-70" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Telefon Raqamingiz</label>
          <div className="mt-1">
            <PhoneInput
              country={'uz'}
              value={form.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 4rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                lineHeight: '1.5rem',
              }}
              buttonStyle={{
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem 0 0 0.5rem',
                background: '#f9fafb',
              }}
              containerStyle={{
                marginTop: '0.25rem',
              }}
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Xabar (Optional)</label>
          <div className="mt-1 flex items-start">
            <FaComment className="absolute left-3 top-8 text-pink-400 opacity-70" />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
              placeholder="bu yerni to'ldirish ixtiyoriy agar xohlasangiz Yashash manzilingizni qoldirishingiz mumkin"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isSubmitting
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 transform hover:scale-105'
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Yuborilyabdi...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-2" /> Xabarni Yuborish
            </>
          )}
        </button>
      </form>
    </div>
  );
}