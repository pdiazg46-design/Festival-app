"use client";

import { useState, useEffect } from "react";
import { Youtube, Sparkles, Brain, AlertTriangle, ChevronRight, Loader2, Clapperboard } from "lucide-react";
import { Recommendation, analyzeYouTubeLink } from "../lib/recommendationEngine";

export default function YouTubeRecommender() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingMetadata, setFetchingMetadata] = useState(false);
    const [results, setResults] = useState<Recommendation[] | null>(null);

    // Función para extraer metadata automáticamente
    const fetchMetadata = async (targetUrl: string) => {
        if (!targetUrl.includes("youtube.com") && !targetUrl.includes("youtu.be")) return;

        setFetchingMetadata(true);
        try {
            const response = await fetch(`https://noembed.com/embed?url=${targetUrl}`);
            const data = await response.json();
            if (data.title) setTitle(data.title);
            if (data.author_name) setAuthor(data.author_name);
        } catch (error) {
            console.error("Error fetching metadata:", error);
        } finally {
            setFetchingMetadata(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (url) fetchMetadata(url);
        }, 800);
        return () => clearTimeout(timer);
    }, [url]);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResults(null);
        try {
            const data = await analyzeYouTubeLink(url, title, author);
            setResults(data);
        } catch (error) {
            console.error("Error analyzing link:", error);
        } finally {
            setLoading(false);
            setUrl(""); // Limpiamos el input después de analizar
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 py-12 px-4">
            {/* Header Sección - Escala más refinada */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 rounded-full text-black text-[9px] font-black uppercase tracking-wider">
                    <Sparkles size={12} />
                    Versión Premium
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Análisis de Afinidad <span className="text-amber-500">Histórica</span>
                </h2>
                <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Nuestro sistema escanea la metadata de YouTube para contrastar tu obra
                    con el ADN artístico de los festivales clase A.
                </p>
            </div>

            {/* Formulario */}
            <div className="space-y-6">
                <form onSubmit={handleAnalyze} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 rounded-2xl blur-md opacity-20 group-focus-within:opacity-60 transition duration-1000"></div>
                    <div className="relative flex flex-col md:flex-row items-stretch bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-1.5 gap-2">
                        <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                            <Youtube className="text-red-500 mr-3 shrink-0" size={28} />
                            <input
                                type="text"
                                placeholder="Link de YouTube..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 text-lg font-bold"
                            />
                            {fetchingMetadata && <Loader2 size={20} className="animate-spin text-amber-500 ml-2" />}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="px-6 py-4 bg-white text-black font-black text-base rounded-xl hover:bg-amber-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    Analizar
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Obra Detectada - Tamaño más elegante */}
                {(title || author) && (
                    <div className="animate-in fade-in zoom-in duration-500 flex flex-col md:flex-row items-center gap-4 px-6 py-4 bg-white border-2 border-amber-500 rounded-2xl shadow-xl max-w-2xl mx-auto relative overflow-hidden">
                        <div className="p-3 bg-black rounded-xl text-amber-500">
                            <Clapperboard size={32} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-black text-xl font-black leading-tight">
                                {title || "Cargando..."}
                            </h4>
                            <p className="text-neutral-700 text-sm font-bold">
                                Director: <span className="text-black">{author}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Carga */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Brain size={60} className="text-white animate-bounce" />
                    <div className="text-center">
                        <p className="text-white font-black text-xl uppercase">Analizando Estructura</p>
                        <p className="text-amber-500 font-bold text-xs uppercase animate-pulse">Consultando histórico...</p>
                    </div>
                </div>
            )}

            {results && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {results.map((rec, i) => (
                        <div
                            key={rec.festivalId}
                            className="bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 space-y-5 hover:border-amber-500 transition-all group flex flex-col"
                        >
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 bg-white text-black rounded-lg flex items-center justify-center text-xl font-black">
                                    {i + 1}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-white">{rec.affinityScore}%</div>
                                    <div className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Afinidad</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white leading-tight">
                                    {rec.festivalName}
                                </h3>
                                <div className="inline-flex items-center px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                    DNA: {rec.matchingWinner?.theme}
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-white text-[15px] font-semibold leading-relaxed border-l-3 border-amber-500 pl-4 py-1">
                                    {rec.technicalReasoning}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-neutral-800 space-y-3">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <AlertTriangle size={16} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Observación Técnica</span>
                                </div>
                                <p className="text-white text-[13px] font-medium leading-relaxed bg-neutral-800/40 p-4 rounded-xl border border-neutral-800">
                                    {rec.weaknesses}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
