import { useState } from "react";
import { Search, Sparkles, TrendingUp, Zap, Users, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateBusinessIdeas } from "@/services/geminiService";
import { BusinessIdea } from "@/types";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Explore({ onIdeasGenerated }: { onIdeasGenerated: (ideas: BusinessIdea[]) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const result = await generateBusinessIdeas(searchQuery);
      setIdeas(result);
      onIdeasGenerated(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: "Cepat Balik Modal", icon: Zap, color: "bg-orange-50 text-orange-600" },
    { label: "Usaha Makanan Viral", icon: TrendingUp, color: "bg-red-50 text-red-600" },
    { label: "Jualan di Desa", icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Modal di Bawah 100rb", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-primary">Explore Ide</h2>
        <p className="text-slate-500 text-sm">Tanyakan apa saja, AI akan mencari peluang terbaik.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          placeholder="Contoh: ide bisnis makanan modal 50rb..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full rounded-2xl h-14 bg-white border-none shadow-md pl-12 pr-20 focus:ring-2 focus:ring-primary outline-none transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <button 
          onClick={() => handleSearch()}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl bg-primary text-white font-bold px-4 text-xs cursor-pointer disabled:opacity-50"
        >
          {loading ? "..." : "CARI"}
        </button>
      </div>

      {/* Categories */}
      {!ideas.length && !loading && (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setQuery(cat.label);
                  handleSearch(cat.label);
                }}
                className="bg-white p-5 rounded-[24px] soft-shadow border border-slate-50 flex flex-col items-center gap-3 text-center group"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <span className="font-bold text-sm text-primary leading-tight">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-primary"
            >
              <Sparkles size={48} />
            </motion.div>
            <p className="text-slate-500 font-medium animate-pulse">Mencari peluang emas...</p>
          </div>
        )}

        {ideas.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-primary">Hasil Pencarian</h3>
              <Button variant="ghost" size="sm" onClick={() => setIdeas([])} className="text-slate-400">Reset</Button>
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
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={idea.imageUrl}
                      alt={idea.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {idea.badges.map((badge) => (
                        <Badge key={badge} className="bg-white/90 backdrop-blur-sm text-primary border-none font-bold text-[10px] uppercase tracking-wider">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-display font-bold text-primary group-hover:text-blue-600 transition-colors">
                      {idea.name}
                    </h4>
                    <p className="text-slate-500 text-xs line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="text-primary font-bold text-xs">
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
    </div>
  );
}
