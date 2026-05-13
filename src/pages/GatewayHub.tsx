import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getToken, setSession } from "@/lib/api";
import { toast } from "sonner";

const GatewayHub = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "GatewayHub — Admin Login";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    const desc = document.createElement("meta");
    desc.name = "description";
    desc.content = "Private admin sign-in for the NelliDESiGN GatewayHub portfolio manager.";
    document.head.appendChild(desc);
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = window.location.origin + "/gatewayhub";
    document.head.appendChild(canonical);
    if (getToken()) nav("/gatewayhub/admin", { replace: true });
    if (new URLSearchParams(window.location.search).get("expired") === "1") {
      toast.error("Your session expired — please sign in again.");
    }
    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(desc);
      document.head.removeChild(canonical);
    };
  }, [nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, csrfToken } = await api.login(email.trim(), password);
      setSession(token, csrfToken);
      toast.success("Welcome back");
      nav("/gatewayhub/admin", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 font-display text-xl font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-accent" aria-hidden />
            GatewayHub
          </div>
          <p className="text-sm text-muted-foreground mt-2">Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={200}
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default GatewayHub;
