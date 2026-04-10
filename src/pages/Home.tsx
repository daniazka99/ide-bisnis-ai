import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Star, MapPin, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateBusinessIdeas } from "@/services/geminiService";
import { BusinessIdea, UserInput } from "@/types";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Home({ onIdeasGenerated }: { onIdeasGenerated: (ideas: BusinessIdea[]) => void }) {
  const [input, setInput] = useState<UserInput>({ modal: "", skill: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const navigate = useNavigate();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateBusinessIdeas(input);
      if (result && result.length > 0) {
        setIdeas(result);
        onIdeasGenerated(result);
      } else {
        setError("AI tidak memberikan ide. Coba input yang berbeda.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat meracik ide. Pastikan koneksi internet stabil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-primary">Cari Ide Bisnis</h2>
        <p className="text-slate-500 text-sm">Input kondisimu, AI akan meracik strategi terbaik.</p>
      </div>

      {/* Input Form */}
      <Card className="premium-card border-none">
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wallet size={14} /> Modal (Contoh: 100rb)
              </Label>
              <input
                placeholder="Contoh: 50 ribu"
                value={input.modal}
                onChange={(e) => setInput({ ...input, modal: e.target.value })}
                className="w-full px-4 rounded-xl h-12 bg-slate-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} /> Keahlian / Skill
              </Label>
              <input
                placeholder="Contoh: masak, desain, jualan"
                value={input.skill}
                onChange={(e) => setInput({ ...input, skill: e.target.value })}
                className="w-full px-4 rounded-xl h-12 bg-slate-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin size={14} /> Lokasi
              </Label>
              <input
                placeholder="Contoh: kampung, kota kecil, online"
                value={input.location}
                onChange={(e) => setInput({ ...input, location: e.target.value })}
                className="w-full px-4 rounded-xl h-12 bg-slate-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#1e293b] text-white font-bold text-lg shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles size={20} />
                  </motion.div>
                  Meracik Ide...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> GAS IDE BISNIS
                </>
              )}
            </button>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-red-500 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-primary">Rekomendasi Untukmu</h3>
              <Badge variant="secondary" className="bg-accent/20 text-primary border-none font-bold">
                {ideas.length} Ide Ditemukan
              </Badge>
            </div>

            <div className="grid gap-6">
              {ideas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/detail/${idea.id}`)}
                  className="premium-card cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={idea.imageUrl}
                      alt={idea.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {idea.badges.map((badge) => (
                        <Badge key={badge} className="bg-white/90 backdrop-blur-sm text-primary border-none font-bold text-[10px] uppercase tracking-wider">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-display font-bold text-primary group-hover:text-blue-600 transition-colors">
                        {idea.name}
                      </h4>
                      <div className="flex items-center gap-1 text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < idea.potential ? "currentColor" : "none"}
                            className={i < idea.potential ? "text-accent" : "text-slate-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <MapPin size={14} /> {idea.location}
                      </div>
                      <div className="text-primary font-bold text-sm">
                        Est. Profit: <span className="text-green-600">{idea.estimatedProfit}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trending Section */}
      {!ideas.length && !loading && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-primary font-display font-bold">
            <TrendingUp size={20} />
            <h3>Sedang Populer</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Jualan Snack Viral", icon: Star },
              { label: "Jasa Desain Canva", icon: Star },
              { label: "Dropship Lokal", icon: Star },
              { label: "Kursus Online", icon: Star }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInput({ modal: "Kecil", skill: item.label, location: "Online" });
                  handleGenerate({ preventDefault: () => {} } as any);
                }}
                className="bg-white p-4 rounded-2xl soft-shadow border border-slate-50 flex flex-col gap-2 cursor-pointer hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-sm text-primary">{item.label}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mudah Jalan</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
