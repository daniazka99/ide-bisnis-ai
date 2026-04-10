import { useParams, useNavigate } from "react-router-dom";
import { BusinessIdea } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Target, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Info, 
  Calendar,
  DollarSign,
  BarChart3
} from "lucide-react";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";

export default function Detail({ history }: { history: BusinessIdea[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const idea = history.find((i) => i.id === id);

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-slate-500">Ide tidak ditemukan.</p>
        <Button onClick={() => navigate("/")}>Kembali ke Home</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-full bg-white soft-shadow"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-display font-bold text-primary">Detail Strategi</h2>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-[32px] overflow-hidden soft-shadow">
        <img 
          src={idea.imageUrl} 
          alt={idea.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {idea.badges.map(badge => (
              <Badge key={badge} className="bg-accent text-accent-foreground border-none font-bold">
                {badge}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{idea.name}</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[24px] soft-shadow border border-slate-50 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor Kelayakan</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-display font-bold text-primary">{idea.feasibilityScore}</span>
            <span className="text-slate-400 font-medium mb-1">/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${idea.feasibilityScore}%` }}
              className="h-full bg-green-500"
            />
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] soft-shadow border border-slate-50 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Profit</p>
          <p className="text-2xl font-display font-bold text-green-600">{idea.estimatedProfit}</p>
          <p className="text-[10px] text-slate-400 font-medium">Per bulan (awal)</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-[24px] soft-shadow border border-slate-50 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Info size={20} className="text-blue-500" />
          <h3 className="font-display font-bold">Tentang Bisnis Ini</h3>
        </div>
        <p className="text-slate-600 leading-relaxed text-sm">
          {idea.description}
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Target size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Market</p>
              <p className="text-sm font-medium text-slate-700">{idea.targetMarket}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strategi Jualan</p>
              <p className="text-sm font-medium text-slate-700">{idea.sellingStrategy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Steps */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary px-2">
          <CheckCircle2 size={20} className="text-green-500" />
          <h3 className="font-display font-bold">Langkah Eksekusi</h3>
        </div>
        <div className="space-y-3">
          {idea.executionSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-slate-50 soft-shadow">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-slate-700 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Day Plan */}
      <div className="bg-primary text-white p-6 rounded-[32px] soft-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-accent" />
            <h3 className="font-display font-bold text-lg">Rencana 7 Hari (Gas Langsung)</h3>
          </div>
          <Badge className="bg-accent text-accent-foreground border-none font-bold">MODE CEPAT</Badge>
        </div>
        <div className="space-y-4">
          {idea.sevenDayPlan.map((plan, index) => (
            <div key={index} className="flex gap-4 items-start group">
              <div className="w-10 text-xs font-bold text-slate-400 pt-1">HARI {index + 1}</div>
              <div className="flex-1 pb-4 border-l border-white/10 pl-4 relative">
                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-accent" />
                <p className="text-sm font-medium leading-relaxed">{plan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profit Simulation */}
      <div className="bg-white p-6 rounded-[32px] soft-shadow border border-slate-50 space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 size={20} className="text-purple-500" />
          <h3 className="font-display font-bold">Simulasi Profit</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Jual</p>
            <p className="text-lg font-bold text-primary">Rp {idea.profitSimulation.sellingPrice.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Jual/Bln</p>
            <p className="text-lg font-bold text-primary">{idea.profitSimulation.targetSales} Unit</p>
          </div>
        </div>
        <Separator className="bg-slate-100" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Omzet</p>
            <p className="text-lg font-bold text-blue-600">Rp {idea.profitSimulation.estimatedRevenue.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Profit</p>
            <p className="text-lg font-bold text-green-600">Rp {idea.profitSimulation.estimatedProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 p-6 rounded-[24px] border border-yellow-100 space-y-4">
        <div className="flex items-center gap-2 text-yellow-700">
          <TrendingUp size={20} />
          <h3 className="font-display font-bold">Tips Profesional</h3>
        </div>
        <ul className="space-y-3">
          {idea.tips.map((tip, index) => (
            <li key={index} className="flex gap-3 items-start text-sm text-yellow-800 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Button 
        className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg soft-shadow hover:bg-slate-800 transition-all active:scale-95"
        onClick={() => window.open(`https://wa.me/628551994060?text=Halo,%20saya%20tertarik%20dengan%20ide%20bisnis%20${encodeURIComponent(idea.name)}.%20Bisa%20bantu%20cetak%20stempel/brosur?`, "_blank")}
      >
        MULAI EKSEKUSI SEKARANG
      </Button>
    </motion.div>
  );
}
