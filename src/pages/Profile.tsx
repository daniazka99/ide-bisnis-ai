import { BusinessIdea } from "@/types";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { History, ChevronRight, Lightbulb, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile({ history }: { history: BusinessIdea[] }) {
  const navigate = useNavigate();

  const clearHistory = () => {
    localStorage.removeItem("businessHistory");
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] soft-shadow border border-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-accent text-2xl font-bold">
          A
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-primary">Admin Bisnis</h2>
          <p className="text-slate-500 text-sm">Pencari Peluang Emas</p>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary font-display font-bold">
            <History size={20} />
            <h3>Riwayat Terakhir</h3>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 size={16} className="mr-1" /> Hapus
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white p-10 rounded-[32px] soft-shadow border border-slate-50 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
              <Lightbulb size={32} />
            </div>
            <p className="text-slate-400 font-medium">Belum ada riwayat ide.</p>
            <Button onClick={() => navigate("/")} className="rounded-xl">Cari Ide Sekarang</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((idea, index) => (
              <motion.div
                key={idea.id + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/detail/${idea.id}`)}
                className="bg-white p-4 rounded-2xl soft-shadow border border-slate-50 flex items-center gap-4 cursor-pointer hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={idea.imageUrl} 
                    alt={idea.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate">{idea.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{idea.location} • {idea.estimatedProfit}</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 text-white p-5 rounded-[24px] soft-shadow space-y-1">
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Total Ide</p>
          <p className="text-3xl font-display font-bold">{history.length}</p>
        </div>
        <div className="bg-accent text-accent-foreground p-5 rounded-[24px] soft-shadow space-y-1">
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Status Akun</p>
          <p className="text-xl font-display font-bold">PREMIUM</p>
        </div>
      </div>
    </div>
  );
}
