"use client";

import { Calendar, Trophy, TrendingUp, Lightbulb, RefreshCw, BarChart2, Clapperboard, Crown } from "lucide-react";
import Link from "next/link";
import localFestivals from "./data/festivals.json";
import { cn } from "./lib/utils";
import { useLanguage } from "./context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { fetchFestivalsFromSheet, FestivalData } from "./lib/sheetLoader";
import { useUser } from "./context/UserContext";
import UpgradeModal from "./components/UpgradeModal"; // Optional: if we want to add modal here too or just use passive filtering
import YouTubeRecommender from "./components/YouTubeRecommender";

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

function Dashboard() {
  console.log("--- RENDERING DASHBOARD ---");
  const { t, language } = useLanguage();
  const { isPremium } = useUser();
  const [allFestivals, setAllFestivals] = useState<FestivalData[]>(localFestivals as any);
  const [loading, setLoading] = useState(true);

  // Filter for display
  const festivals = isPremium ? allFestivals : allFestivals.filter(f => f.region === "Chile");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const remoteData = await fetchFestivalsFromSheet();
      if (remoteData && remoteData.length > 0) {
        setAllFestivals(remoteData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const upcomingFestivals = festivals.filter((f) => f.status === "Upcoming").length;
  // Calculamos ganadores recientes (asumiendo que winners existe en la estructura)
  const recentWinners = festivals.reduce((acc, f) => acc + (f.winners?.filter(w => w.year >= 2024).length || 0), 0);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <LanguageSwitcher />
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
                {t.title}
              </h1>
              {loading && <RefreshCw className="animate-spin text-amber-500" size={20} />}
            </div>
            <p className="text-neutral-400 mt-2 text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md text-sm font-medium transition-colors">
                  {language === 'en' ? 'Sign In / Register' : 'Iniciar Sesión / Registro'}
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <div className="relative w-24 h-12 md:w-56 md:h-28 shrink-0">
              <img src="/at-sit-logo.png" alt="Portal AT-SIT Estudios" className="object-contain w-full h-full object-right" />
            </div>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar size={100} />
            </div>
            <h3 className="text-neutral-400 font-medium">{language === 'en' ? 'Your Opportunities' : 'Tus Oportunidades'}</h3>
            <p className="text-4xl font-bold mt-2">{upcomingFestivals}</p>
            <Link href="/festivals" className="text-amber-500 text-sm mt-4 inline-block hover:underline">
              {t.view_cal} &rarr;
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={100} />
            </div>
            <h3 className="text-neutral-400 font-medium">{language === 'en' ? 'Local Winners' : 'Ganadores Locales'}</h3>
            <p className="text-4xl font-bold mt-2">{recentWinners}</p>
            <div className="text-sm text-neutral-500 mt-4">{t.analyzed}</div>
            <Link href="/festivals" className="text-amber-500 text-sm mt-4 inline-block hover:underline">
              {t.view_winners} &rarr;
            </Link>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={100} />
            </div>
            <h3 className="text-neutral-400 font-medium">{t.top_trend}</h3>
            <p className="text-2xl font-bold mt-2 text-amber-100">
              {festivals.length > 0 && festivals[0].winners?.[0]?.theme?.[language] || (language === 'en' ? "Conflict & Identity" : "Conflicto e Identidad")}
            </p>
            <Link href="/themes" className="text-amber-500 text-sm mt-4 inline-block hover:underline">
              {t.view_analysis} &rarr;
            </Link>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/festivals" className="block group">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl h-full transition-all hover:bg-neutral-800/50 hover:border-neutral-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300">
                  <Calendar size={32} />
                </div>
                <h2 className="text-2xl font-bold">{t.explorer_title}</h2>
              </div>
              <p className="text-neutral-400">
                {t.explorer_desc}
              </p>
            </div>
          </Link>

          <Link href="/recommend" className="block group">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl h-full transition-all hover:bg-neutral-800/50 hover:border-neutral-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                  <Lightbulb size={32} />
                </div>
                <h2 className="text-2xl font-bold">{t.recommender_title}</h2>
              </div>
              <p className="text-neutral-400">
                {t.recommender_desc}
              </p>
            </div>
          </Link>

          <Link href="/stats" className="block group">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl h-full transition-all hover:bg-neutral-800/50 hover:border-neutral-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                  <BarChart2 size={32} />
                </div>
                <h2 className="text-2xl font-bold">{language === 'en' ? 'Strategy Dashboard' : 'Dashboard Estratégico'}</h2>
              </div>
              <p className="text-neutral-400">
                {language === 'en' ? 'View key metrics and insights about the festival landscape.' : 'Visualiza métricas clave y análisis del panorama de festivales.'}
              </p>
            </div>
          </Link>
        </div>

        {/* Creative Studio Banner */}
        <Link href="/studio" className="block group mt-6">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-900 border border-neutral-800 p-8 rounded-xl relative overflow-hidden transition-all hover:border-amber-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-amber-500/20 rounded-full text-amber-500 group-hover:scale-110 transition-transform">
                  <Clapperboard size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{language === 'en' ? 'Creative Studio' : 'Estudio Creativo'}</h2>
                  <p className="text-neutral-400 max-w-xl">
                    {language === 'en'
                      ? 'Generate winning film concepts based on festival data and your resources. From logline to technical script.'
                      : 'Genera conceptos ganadores basados en datos de festivales y tus recursos. Desde el logline hasta el guion técnico.'}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="px-6 py-3 bg-neutral-800 rounded-full text-neutral-300 font-medium group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  {language === 'en' ? 'Start Project' : 'Iniciar Proyecto'} &rarr;
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Nueva Funcionalidad: Recomendador por Link de YouTube */}
        <section className="mt-12 pt-12 border-t border-neutral-900 relative">
          {!isPremium && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/40 backdrop-blur-[2px] rounded-2xl border border-amber-500/10 transition-all">
              <div className="p-4 bg-neutral-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto">
                <Crown className="text-amber-500 mb-3 animate-pulse" size={40} />
                <h3 className="text-xl font-bold text-white mb-2">Función Premium</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  El análisis científico de afinidad histórica por IA es parte de la versión Full.
                  ¡Desbloquea el poder del algoritmo hoy!
                </p>
                {/* Nota: Aquí podríamos abrir el modal de upgrade si tuviéramos esa función accesible */}
                <Link href="/studio" className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors">
                  Ver Planes de Acceso
                </Link>
              </div>
            </div>
          )}
          <div className={cn("transition-all duration-700", !isPremium && "opacity-20 blur-[1px] pointer-events-none")}>
            <YouTubeRecommender />
          </div>
        </section>
        <div className="mt-12 p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-sm text-neutral-400 leading-relaxed max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={18} className="text-amber-500" />
            <strong className="text-neutral-200 text-lg">{t.insight_label}</strong>
          </div>
          <p className="text-neutral-200 text-lg leading-relaxed">
            {t.insight_text.replace("{highlight}", t.highlight_text).split(t.highlight_text).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-amber-400 font-bold">{t.highlight_text}</span>}
              </span>
            ))}
          </p>
        </div>

        <div className="flex justify-center pt-16 pb-8">
          <Link
            href="https://www.tiktok.com/@pato.diaz84?_r=1&_t=ZM-93B2Kj2yQoK"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
          >
            <span className="flex items-center gap-2 text-neutral-400 text-xs md:text-sm text-center font-medium group-hover:text-amber-400 transition-colors">
              <span>✨ Conoce más proyectos y novedades en TikTok</span>
            </span>

            <div className="flex items-center gap-2 px-5 py-3 md:gap-4 md:px-8 md:py-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl shadow-black/50 group-hover:border-neutral-700 group-hover:shadow-amber-900/10 transition-all max-w-[95vw] justify-center overflow-hidden">
              <span className="text-[10px] md:text-xs text-neutral-500 font-bold tracking-wider uppercase shrink-0">Creado por</span>
              <div className="h-6 md:h-8 w-px bg-neutral-800 shrink-0"></div>
              <img
                src="/atsit-logo-white.png"
                alt="AT-SIT"
                className="h-6 md:h-8 w-auto shrink-0"
              />
              <span className="text-base md:text-xl font-bold tracking-[0.2em] text-white shrink-0">AT-SIT</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return <Dashboard />;
}
