'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Pogrešan email ili password');
        toast.error('Pogrešan email ili password', { position: 'top-center' });
      } else {
        toast.success('Uspešna prijava', { position: 'top-center' });
        router.push('/gradiliste');
      }
    } catch (err) {
      setError('Došlo je do greške');
      toast.error('Došlo je do greške', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0F1419_0%,#1a2a3a_100%)] flex items-center justify-center p-6 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-[#E67E22]/25 blur-3xl animate-[float_18s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-[#005B99]/20 blur-3xl animate-[floatReverse_22s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-6rem] left-1/4 h-80 w-80 rounded-full bg-[#E67E22]/15 blur-[120px] animate-[float_26s_ease-in-out_infinite]" />
        <div className="absolute top-12 left-1/2 h-48 w-48 rounded-full bg-[#005B99]/25 blur-[90px] animate-[floatReverse_30s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,30,40,0.78)] backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.55)] px-8 py-10 md:px-12 md:py-12">
          <div className="absolute -top-20 -right-16 h-44 w-44 rounded-full bg-[#E67E22]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#005B99]/30 blur-2xl" />

          <div className="relative space-y-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E67E22]/40 bg-[#E67E22]/10 shadow-[0_0_25px_rgba(230,126,34,0.35)] transition-shadow">
                <Lock className="h-8 w-8 text-[#E67E22]" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Admin Prijava</h1>
                <p className="mt-2 text-sm text-white/70 md:text-base">
                  Pristupite sigurnom gradilištu. Vaš račun je zaštićen višeslojnom autentifikacijom.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
                  role="alert"
                  aria-live="polite"
                  id="login-error"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sindikatncr.com"
                  required
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "login-error" : undefined}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#E67E22]/70 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white/80">
                  Lozinka
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pr-12 text-white placeholder:text-white/50 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#E67E22]/70 focus-visible:ring-offset-0"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E67E22]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] text-base font-semibold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(230,126,34,0.6)] focus-visible:ring-2 focus-visible:ring-[#E67E22] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  <>
                    Prijavite se
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -20px, 0); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 20px, 0); }
        }
      `}</style>
    </div>
  );
}