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
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 py-16 px-4">
            {/* Header Sección - Alto Contraste */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 rounded-full text-black text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles size={14} />
                    Versión Full Solamente
                </div>
                <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Análisis de Afinidad <span className="text-amber-500">Histórica</span>
                </h2>
                <p className="text-white text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
                    Pega el enlace de tu obra. Nuestro sistema escanea automáticamente la metadata de YouTube
                    para contrastarla con el ADN artístico de los festivales clase A.
                </p>
            </div>

            {/* Formulario y Meta de Obra */}
            <div className="space-y-6">
                <form onSubmit={handleAnalyze} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 rounded-2xl blur-md opacity-20 group-focus-within:opacity-60 transition duration-1000"></div>
                    <div className="relative flex flex-col md:flex-row items-stretch bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-2 gap-2">
                        <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                            <Youtube className="text-red-500 mr-4 shrink-0" size={32} />
                            <input
                                type="text"
                                placeholder="Pega el link de YouTube aquí..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 text-xl font-bold"
                            />
                            {fetchingMetadata && <Loader2 size={24} className="animate-spin text-amber-500 ml-2" />}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="px-8 py-5 bg-white text-black font-black text-lg rounded-xl hover:bg-amber-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Analizar Obra
                                    <ChevronRight size={24} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Obra Detectada - Gran Legibilidad */}
                {(title || author) && (
                    <div className="animate-in fade-in zoom-in duration-500 flex flex-col md:flex-row items-center gap-6 px-8 py-6 bg-white border-2 border-amber-500 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.15)] max-w-3xl mx-auto relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 bg-amber-500 text-black font-black text-[9px] uppercase tracking-widest px-3 rounded-bl-xl">
                            Obra Detectada
                        </div>
                        <div className="p-4 bg-black rounded-2xl text-amber-500 shadow-xl">
                            <Clapperboard size={44} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <h4 className="text-black text-2xl md:text-3xl font-black leading-tight">
                                {title || "Cargando título..."}
                            </h4>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
                                <p className="text-neutral-700 text-lg font-bold">
                                    Director: <span className="text-black">{author || "Autor detectado"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Estados de Carga y Resultados */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                        <Brain size={80} className="text-white relative animate-bounce" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white font-black text-2xl tracking-tight uppercase">Analizando Estructura Narrativa</p>
                        <p className="text-amber-500 font-bold text-sm tracking-[0.3em] uppercase animate-pulse">Comparando con base de datos histórica...</p>
                    </div>
                </div>
            )}

            {results && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {results.map((rec, i) => (
                        <div
                            key={rec.festivalId}
                            className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-8 space-y-6 hover:border-amber-500/50 transition-all group relative overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-start">
                                <div className="h-12 w-12 bg-white text-black rounded-xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:bg-amber-500 transition-colors">
                                    {i + 1}
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black text-white">{rec.affinityScore}%</div>
                                    <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Afinidad</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white leading-[1.1]">
                                    {rec.festivalName}
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-amber-400 text-xs font-bold uppercase tracking-wider">
                                    Línea: {rec.matchingWinner?.theme}
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-white text-lg font-medium leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
                                    "{rec.technicalReasoning}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-neutral-800 space-y-3">
                                <div className="flex items-center gap-2 text-white">
                                    <div className="p-1 bg-amber-500 rounded">
                                        <AlertTriangle size={14} className="text-black" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Ajuste Sugerido</span>
                                </div>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed bg-neutral-800/50 p-3 rounded-xl">
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
