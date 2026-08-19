import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitAppointment } from '../services/appointmentService'
import { telHref, whatsappHref } from '../data/clinicInfo'
import { Eyebrow, FadeIn, SoundWave } from './SignatureMotifs'

const SERVICE_OPTIONS = [
  { value: 'hearing-aid', label: 'Hearing Aid', icon: '🎧' },
  { value: 'audiometry', label: 'Hearing Test / Audiometry', icon: '👂' },
  { value: 'speech-therapy', label: 'Speech Therapy', icon: '🗣️' },
]

const INITIAL_STATE = {
  fullName: '',
  mobile: '',
  age: '',
  city: '',
  preferredContact: 'WhatsApp',
  service: '',
  // hearing aid fields
  haFor: '',
  haCurrentUser: '',
  haCurrentType: '',
  haConcern: '',
  haAppointmentType: '',
  // audiometry fields
  audReason: '',
  audPreviousTest: '',
  // speech therapy fields
  stFor: '',
  stConcern: '',
  stLanguage: '',
  // final step
  preferredDate: '',
  preferredTime: '',
  message: '',
  consent: false,
}

const TOTAL_STEPS = 4

export default function EnquiryForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_STATE)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const update = (field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const selectService = (value) => {
    setForm((f) => ({ ...f, service: value }))
    setErrors((er) => ({ ...er, service: undefined }))
  }

  function validateStep(current) {
    const next = {}
    if (current === 1) {
      if (!form.fullName.trim()) next.fullName = 'Please enter your name'
      if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) next.mobile = 'Enter a valid 10-digit mobile number'
      if (!form.age.trim()) next.age = 'Please enter age'
    }
    if (current === 2) {
      if (!form.service) next.service = 'Please select what you need help with'
    }
    if (current === 4) {
      if (!form.consent) next.consent = 'Please accept to proceed'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep(4)) return
    setStatus('submitting')
    try {
      await submitAppointment(form)
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  const progressPct = useMemo(() => (step / TOTAL_STEPS) * 100, [step])

  if (status === 'success') {
    return (
      <section id="enquiry" className="py-20 md:py-28 bg-white scroll-mt-20">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <FadeIn>
            <div className="mx-auto h-16 w-16 rounded-full bg-teal-50 flex items-center justify-center text-3xl">✅</div>
            <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-navy-800">
              Thank you! Your enquiry has been received.
            </h2>
            <p className="mt-3 text-navy-700/75">
              Our team will contact you shortly on {form.preferredContact === 'Phone Call' ? 'a phone call' : 'WhatsApp'}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappHref(`Hi, I just submitted an enquiry (${form.fullName}) for ${labelFor(form.service)}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3.5 shadow-soft transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full bg-navy-600 hover:bg-navy-700 text-white font-semibold px-6 py-3.5 shadow-soft transition-colors"
              >
                Call Now
              </a>
            </div>
            <button
              onClick={() => {
                setForm(INITIAL_STATE)
                setStep(1)
                setStatus('idle')
              }}
              className="mt-6 text-sm font-semibold text-navy-700/60 hover:text-navy-700 underline underline-offset-4"
            >
              Submit another enquiry
            </button>
          </FadeIn>
        </div>
      </section>
    )
  }

  return (
    <section id="enquiry" className="py-20 md:py-28 bg-white scroll-mt-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <FadeIn className="text-center">
          <Eyebrow>Patient Enquiry</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-[2.4rem] font-extrabold text-navy-800 leading-tight">
            Request an appointment
          </h2>
          <p className="mt-3 text-navy-700/70">
            Tell us a little about your needs and we'll get back to you quickly.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <div className="rounded-3xl md:rounded-4xl bg-mist border border-navy-50 shadow-soft p-5 sm:p-8 md:p-10">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-navy-700/60 mb-2">
                <span>Step {step} of {TOTAL_STEPS}</span>
                <SoundWave bars={5} className="h-3.5" barClassName="bg-teal-500" />
              </div>
              <div className="h-1.5 rounded-full bg-navy-100 overflow-hidden">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && <StepPatientDetails form={form} update={update} errors={errors} />}
                  {step === 2 && <StepServiceSelect form={form} selectService={selectService} errors={errors} />}
                  {step === 3 && <StepServiceDetails form={form} update={update} />}
                  {step === 4 && <StepFinal form={form} update={update} errors={errors} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-9 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full px-5 py-3 font-semibold text-sm text-navy-700 bg-white ring-1 ring-navy-100 hover:bg-navy-50 transition-colors"
                  >
                    Back
                  </button>
                ) : <span />}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-full px-6 py-3 font-semibold text-sm text-white bg-navy-600 hover:bg-navy-700 shadow-card transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="rounded-full px-6 py-3 font-semibold text-sm text-white bg-teal-500 hover:bg-teal-600 shadow-card transition-colors disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Submitting…' : 'Request Appointment'}
                  </button>
                )}
              </div>
              {status === 'error' && (
                <p className="mt-4 text-sm font-semibold text-red-600 text-center">
                  Something went wrong. Please call {' '}
                  <a href={telHref} className="underline">us directly</a> instead.
                </p>
              )}
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function labelFor(value) {
  return SERVICE_OPTIONS.find((s) => s.value === value)?.label || value
}

/* ---------- Step 1 ---------- */
function StepPatientDetails({ form, update, errors }) {
  return (
    <div>
      <h3 className="font-display font-bold text-lg text-navy-800 mb-5">Patient Details</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            value={form.fullName}
            onChange={update('fullName')}
            placeholder="e.g. Rajesh Deshmukh"
            className={inputClass(errors.fullName)}
          />
        </Field>
        <Field label="Mobile Number" required error={errors.mobile}>
          <input
            type="tel"
            inputMode="numeric"
            value={form.mobile}
            onChange={update('mobile')}
            placeholder="10-digit mobile number"
            className={inputClass(errors.mobile)}
          />
        </Field>
        <Field label="Age" required error={errors.age}>
          <input
            type="number"
            min="0"
            max="120"
            value={form.age}
            onChange={update('age')}
            placeholder="e.g. 58"
            className={inputClass(errors.age)}
          />
        </Field>
        <Field label="City / Area">
          <input
            type="text"
            value={form.city}
            onChange={update('city')}
            placeholder="e.g. Savedi, Ahilyanagar"
            className={inputClass()}
          />
        </Field>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-navy-800 mb-2.5">Preferred Contact Method</p>
        <div className="flex gap-3">
          {['WhatsApp', 'Phone Call'].map((opt) => (
            <PillToggle
              key={opt}
              active={form.preferredContact === opt}
              onClick={() => update('preferredContact')(opt)}
            >
              {opt}
            </PillToggle>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Step 2 ---------- */
function StepServiceSelect({ form, selectService, errors }) {
  return (
    <div>
      <h3 className="font-display font-bold text-lg text-navy-800 mb-1.5">What do you need help with?</h3>
      <p className="text-sm text-navy-700/60 mb-5">Select one option that best fits your need.</p>
      <div className="grid sm:grid-cols-3 gap-3.5">
        {SERVICE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => selectService(opt.value)}
            className={`text-left rounded-2xl p-5 border-2 transition-all ${
              form.service === opt.value
                ? 'border-teal-500 bg-teal-50 shadow-glow'
                : 'border-navy-100 bg-white hover:border-teal-200'
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <p className="mt-3 font-bold text-navy-800 text-sm leading-snug">{opt.label}</p>
          </button>
        ))}
      </div>
      {errors.service && <p className="mt-3 text-sm font-semibold text-red-600">{errors.service}</p>}
    </div>
  )
}

/* ---------- Step 3 ---------- */
function StepServiceDetails({ form, update }) {
  if (form.service === 'hearing-aid') {
    return (
      <div>
        <h3 className="font-display font-bold text-lg text-navy-800 mb-5">A little more about the hearing aid need</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Who needs the hearing aid?">
            <select value={form.haFor} onChange={update('haFor')} className={inputClass()}>
              <option value="">Select</option>
              {['Self', 'Parent', 'Spouse', 'Child', 'Other'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Do you currently use a hearing aid?">
            <div className="flex gap-3 pt-1">
              {['Yes', 'No'].map((opt) => (
                <PillToggle key={opt} active={form.haCurrentUser === opt} onClick={() => update('haCurrentUser')(opt)}>
                  {opt}
                </PillToggle>
              ))}
            </div>
          </Field>
          {form.haCurrentUser === 'Yes' && (
            <Field label="If yes, what type?" className="sm:col-span-2">
              <input
                type="text"
                value={form.haCurrentType}
                onChange={update('haCurrentType')}
                placeholder="e.g. Behind-the-ear, brand if known"
                className={inputClass()}
              />
            </Field>
          )}
          <Field label="Main concern" className="sm:col-span-2">
            <select value={form.haConcern} onChange={update('haConcern')} className={inputClass()}>
              <option value="">Select</option>
              {[
                'Difficulty hearing conversations',
                'Difficulty hearing TV',
                'Difficulty hearing in groups',
                'Hearing aid not working properly',
                'Want to upgrade hearing aid',
                'Want to try a hearing aid',
                'Other',
              ].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Preferred appointment type" className="sm:col-span-2">
            <select value={form.haAppointmentType} onChange={update('haAppointmentType')} className={inputClass()}>
              <option value="">Select</option>
              {['Hearing evaluation', 'Hearing aid consultation', 'Hearing aid trial', 'Hearing aid programming/service'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    )
  }

  if (form.service === 'audiometry') {
    return (
      <div>
        <h3 className="font-display font-bold text-lg text-navy-800 mb-5">A little more about your hearing test</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Reason for hearing test" className="sm:col-span-2">
            <select value={form.audReason} onChange={update('audReason')} className={inputClass()}>
              <option value="">Select</option>
              {[
                'Difficulty hearing',
                'Routine hearing check',
                'Ear-related concern',
                'Doctor recommended hearing test',
                'Hearing aid evaluation',
                'Other',
              ].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Previous hearing test?" className="sm:col-span-2">
            <div className="flex gap-3">
              {['Yes', 'No', 'Not sure'].map((opt) => (
                <PillToggle key={opt} active={form.audPreviousTest === opt} onClick={() => update('audPreviousTest')(opt)}>
                  {opt}
                </PillToggle>
              ))}
            </div>
          </Field>
        </div>
      </div>
    )
  }

  if (form.service === 'speech-therapy') {
    return (
      <div>
        <h3 className="font-display font-bold text-lg text-navy-800 mb-5">A little more about the speech therapy need</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Who needs speech therapy?">
            <div className="flex gap-3">
              {['Child', 'Adult'].map((opt) => (
                <PillToggle key={opt} active={form.stFor === opt} onClick={() => update('stFor')(opt)}>
                  {opt}
                </PillToggle>
              ))}
            </div>
          </Field>
          <Field label="Preferred language">
            <select value={form.stLanguage} onChange={update('stLanguage')} className={inputClass()}>
              <option value="">Select</option>
              {['Marathi', 'Hindi', 'English'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Main concern" className="sm:col-span-2">
            <select value={form.stConcern} onChange={update('stConcern')} className={inputClass()}>
              <option value="">Select</option>
              {[
                'Speech delay',
                'Difficulty pronouncing words',
                'Difficulty communicating',
                'Language development concern',
                'Other',
              ].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </div>
    )
  }

  return null
}

/* ---------- Step 4 ---------- */
function StepFinal({ form, update, errors }) {
  return (
    <div>
      <h3 className="font-display font-bold text-lg text-navy-800 mb-5">Almost done</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Preferred Date">
          <input type="date" value={form.preferredDate} onChange={update('preferredDate')} className={inputClass()} />
        </Field>
        <Field label="Preferred Time">
          <input type="time" value={form.preferredTime} onChange={update('preferredTime')} className={inputClass()} />
        </Field>
        <Field label="Additional Message" className="sm:col-span-2">
          <textarea
            rows={3}
            value={form.message}
            onChange={update('message')}
            placeholder="Anything else you'd like us to know?"
            className={inputClass()}
          />
        </Field>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-navy-700/80 cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={update('consent')}
          className="mt-0.5 h-4 w-4 rounded border-navy-300 text-teal-600 focus:ring-teal-500"
        />
        <span>
          I agree to be contacted by Nagar Hearing And Speech Centre via call or WhatsApp regarding my enquiry.
        </span>
      </label>
      {errors.consent && <p className="mt-2 text-sm font-semibold text-red-600">{errors.consent}</p>}
    </div>
  )
}

/* ---------- Shared bits ---------- */
function Field({ label, required, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-navy-800">
        {label} {required && <span className="text-teal-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-navy-800 placeholder:text-navy-700/35 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors outline-none ${
    error ? 'border-red-400' : 'border-navy-100'
  }`
}

function PillToggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold border-2 transition-colors ${
        active ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-navy-100 bg-white text-navy-700/70 hover:border-teal-200'
      }`}
    >
      {children}
    </button>
  )
}
