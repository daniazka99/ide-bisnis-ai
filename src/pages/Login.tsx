import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isLoggedIn", "true");
        onLogin();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-accent mb-4 soft-shadow">
            <Lightbulb size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">IdeaBisnis AI</h1>
          <p className="text-slate-500 mt-2">Wujudkan ide bisnismu sekarang</p>
        </div>

        <Card className="rounded-[20px] border-none soft-shadow overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-display">Login Admin</CardTitle>
            <CardDescription>Masukkan kredensial untuk mengakses sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 rounded-xl h-12 border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 rounded-xl h-12 border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-500 font-medium"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#1e293b] hover:bg-slate-800 text-white font-semibold text-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "LOGIN"}
              </button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
