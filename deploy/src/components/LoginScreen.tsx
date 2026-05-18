import { useState } from "react";
import { Target, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setError(null);
    setSuccess(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setSuccess(null);
    setLoadingProvider("email");
    try {
      if (mode === "signin") {
        const err = await signInWithEmail(email, password);
        if (err) setError(err);
      } else {
        const err = await signUpWithEmail(email, password);
        if (err) setError(err);
        else setSuccess("Account created! Check your email to confirm, then sign in.");
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    setError(null);
    try {
      const err = provider === "google" ? await signInWithGoogle() : await signInWithGitHub();
      if (err) setError(err);
    } catch (e) {
      setError(e instanceof Error ? e.message : "OAuth sign-in failed");
    } finally {
      setLoadingProvider(null);
    }
  };

  const busy = !!loadingProvider;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="bg-destructive p-3 rounded-xl inline-flex">
            <Target className="w-8 h-8 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-primary font-mono">NEET PG War Plan</h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">Sign in to save your progress across devices</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 text-sm font-mono rounded-md transition-colors ${
              mode === "signin"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-sm font-mono rounded-md transition-colors ${
              mode === "signup"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full px-4 py-3 pr-12 bg-card border border-border rounded-xl text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{success}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-mono font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === "email" && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* OAuth */}
        <div className="space-y-2">
          <button
            onClick={() => handleOAuth("google")}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === "github" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitHubIcon />}
            Continue with GitHub
          </button>
        </div>

        {/* Guest */}
        <button
          onClick={continueAsGuest}
          className="w-full text-center text-xs font-mono text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Continue as Guest — data stays on this device only
        </button>

      </div>
    </div>
  );
}
