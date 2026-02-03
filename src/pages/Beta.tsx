import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { ChipGroup } from '../components/shared';
import { submitBetaSignup } from '../lib/supabase';

const interestOptions = ['Owner decisions', 'Vineyard planning', 'Tasting room', 'Marketing'];
const sizeOptions = ['<$1M', '$1-5M', '$5-10M', '$10M+'];
const pilotOptions = ['Yes', 'Maybe', 'No'];

export default function Beta() {
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState('Owner decisions');
  const [size, setSize] = useState('$1-5M');
  const [wouldTry, setWouldTry] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [winery, setWinery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = interest && wouldTry;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const success = await submitBetaSignup({
      name: name || undefined,
      email: email || undefined,
      winery: winery || undefined,
      primary_interest: interest,
      operation_size: size,
      would_try_pilot: wouldTry,
    });

    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <MobileLayout title="Beta Interest" hideProgress>
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-400/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-cyan-400 animate-check-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">You're on the list</h2>
            <p className="text-slate-400">
              We'll follow up after the conference.
            </p>
          </div>

          <div className="card p-5 text-left space-y-3">
            <h3 className="text-white font-semibold">What happens next</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-semibold">1.</span>
                We'll reach out within 2 weeks of the conference
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-semibold">2.</span>
                Early adopters get priority access and input on features
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-semibold">3.</span>
                No commitment until you see it work for your winery
              </li>
            </ul>
          </div>

          <p className="text-slate-500 text-sm">
            Questions? Find us after the session.
          </p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Beta Interest" hideProgress>
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Early Access</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Help us build the Winery AI Beta
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We're exploring a simple winery assistant that helps with owner decisions,
            tasting room scripts, marketing drafts, and planning checklists.
            If this would save you time, join the early access list.
          </p>
        </div>

        <div className="card p-6 space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-3">
              What matters most to you? <span className="text-wine-400">*</span>
            </h3>
            <ChipGroup options={interestOptions} selected={interest} onChange={setInterest} />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Operation size</h3>
            <ChipGroup options={sizeOptions} selected={size} onChange={setSize} />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Would you try a pilot if it saved 3-5 hours/week? <span className="text-wine-400">*</span>
            </h3>
            <ChipGroup options={pilotOptions} selected={wouldTry} onChange={setWouldTry} />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="text-slate-500 text-sm">Optional contact info</h3>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input-field"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="input-field"
          />

          <input
            type="text"
            value={winery}
            onChange={(e) => setWinery(e.target.value)}
            placeholder="Winery name"
            className="input-field"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-shoofly-900/30 border-t-shoofly-900 rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Join the waitlist'
          )}
        </button>

        <p className="text-slate-500 text-xs text-center">
          No spam. No sales calls. Just product updates.
        </p>
      </div>
    </MobileLayout>
  );
}
