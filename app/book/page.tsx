"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../src/components/layout/Navbar";
import Footer from "../../src/components/layout/Footer";
import Container from "../../src/components/ui/Container";
import Card from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  notes: "",
};

export default function BookPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.service || form.service === "Select a service...") {
      newErrors.service = "Please select a service.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20">
        <Container>
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Lumina Aesthetics — Raleigh, North Carolina
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Book a Consultation
            </h1>
            <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-slate-600">
              Fill out the form below and a member of our team will be in touch within one business
              day to confirm your visit.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[560px]">
            <Card className="bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] border border-slate-200/80">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-left">
                      <label
                        htmlFor="firstName"
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      {errors.firstName ? (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                      ) : null}
                    </div>
                    <div className="text-left">
                      <label
                        htmlFor="lastName"
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      {errors.lastName ? (
                        <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    {errors.email ? (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    {errors.phone ? (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    ) : null}
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="service"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      I&apos;m interested in<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option>Select a service...</option>
                      <option>Neuromodulators (Botox)</option>
                      <option>Dermal Fillers</option>
                      <option>HydraFacial</option>
                      <option>Microneedling</option>
                      <option>Chemical Peels</option>
                      <option>Laser Hair Removal</option>
                      <option>Body Contouring</option>
                      <option>Acne Treatments</option>
                      <option>Not sure yet — I&apos;d like guidance</option>
                    </select>
                    {errors.service ? (
                      <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                    ) : null}
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="notes"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Anything you&apos;d like us to know?{" "}
                      <span className="text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Skin concerns, past treatments, upcoming events, questions for the provider..."
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <Button type="submit" className="mt-2 w-full justify-center">
                    Request Consultation
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center px-5 py-8 text-center sm:px-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    You&apos;re all set.
                  </h2>
                  <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-slate-600">
                    Thank you for reaching out. A member of the Lumina team will contact you within
                    one business day to confirm your consultation.
                  </p>
                  <Link
                    href="/"
                    className="mt-4 text-xs font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
                  >
                    Back to home
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

