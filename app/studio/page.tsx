"use client";

import { useState } from "react";
import { ArrowLeft, Clapperboard, Film, Users, MapPin, DollarSign, Target, Sparkles, Copy, MonitorPlay, Trophy, Check, X, Trash2, Plus, Edit2, FileDown } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import UpgradeModal from "../components/UpgradeModal";
import { Lock } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { cn } from "../lib/utils";

export default function StudioPage() {
    const { language, t } = useLanguage();
    const { isPremium } = useUser();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // If not premium, block completely
    if (!isPremium) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <LanguageSwitcher />
                {showUpgradeModal && <UpgradeModal />}
                <div className="text-center space-y-6 max-w-lg">
                    <div className="mx-auto w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800 shadow-xl shadow-amber-900/10">
                        <Lock size={40} className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600 mb-2">
                            {language === 'en' ? 'Technical Director Studio' : 'Estudio de Dirección Técnica'}
                        </h1>
                        <p className="text-neutral-400">
                            {language === 'en'
                                ? 'This advanced tool is available for Premium users only.'
                                : 'Esta herramienta avanzada está disponible solo para usuarios Premium.'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    >
                        {language === 'en' ? 'Unlock Studio' : 'Desbloquear Estudio'}
                    </button>
                    <Link href="/" className="block text-sm text-neutral-600 hover:text-neutral-400">
                        {language === 'en' ? 'Return to Dashboard' : 'Volver al Inicio'}
                    </Link>
                </div>
            </div>
        );
    }

    // Granular Controls State
    const [pacing, setPacing] = useState(50); // 0 (Slow) to 100 (Fast)
    const [contrast, setContrast] = useState(50); // 0 (Natural) to 100 (Stylized)
    const [sceneCount, setSceneCount] = useState(3); // Manual scene count (fallback)
    const [scriptText, setScriptText] = useState(""); // Full script content
    const [duration, setDuration] = useState(10); // Duration in minutes

    // Base Script Data Enhanced (Full Story Evolution)
    const getDetailedScript = (isEsp: boolean, script: string, pacingVal: number, contrastVal: number, scManualCount: number) => {
        const paceNote = pacingVal < 40 ? (isEsp ? "Toma larga, estática" : "Long take, static") : pacingVal > 70 ? (isEsp ? "Corte rápido, nervioso" : "Quick cut, nervous") : (isEsp ? "Giro suave" : "Smooth pan");
        const lightNote = contrastVal > 60 ? (isEsp ? "Clarioscuro fuerte, sombras duras" : "High contrast, hard shadows") : (isEsp ? "Luz suave, naturalista" : "Soft, natural light");

        const inputContent = script || customVision;
        const hasVision = inputContent && inputContent.trim().length > 0;

        // --- CUSTOM SCRIPT / VISION LOGIC ---
        if (hasVision) {
            // Scene extraction logic: Look for ESC or SCENE patterns
            const sceneHeaders = inputContent.match(/(?:ESC|ESCENA|SCENE)\s*(\d+)/gi) || [];
            const detectedSceneCount = sceneHeaders.length > 0 ? sceneHeaders.length : scManualCount;

            const snippets = inputContent.split('.').filter((s: string) => s.trim().length > 0);
            const act1 = snippets[0] || (isEsp ? "Introducción del conflicto" : "Conflict intro");
            const act2 = snippets[1] || (isEsp ? "Escalada de tensión" : "Tension escalation");
            const act3 = snippets[2] || (isEsp ? "Clímax y resolución" : "Climax and resolution");

            // Analyze Tone/Genre for Ending Suggestion
            const lowerVision = inputContent.toLowerCase();
            let endingProposal = { title: "", desc: "" };

            if (lowerVision.includes("miedo") || lowerVision.includes("asesino") || lowerVision.includes("oscur") || lowerVision.includes("horror") || lowerVision.includes("kill") || lowerVision.includes("dark")) {
                endingProposal = {
                    title: isEsp ? "El Giro Nihilista" : "The Nihilistic Twist",
                    desc: isEsp
                        ? "El protagonista cree haber escapado, pero revelamos que todo este tiempo ha estado atrapado en el lugar donde empezó. El 'monstruo' es interno."
                        : "Protagonist thinks they escaped, but we reveal they've been trapped where they started all along. The 'monster' is internal."
                };
            } else if (lowerVision.includes("amor") || lowerVision.includes("pareja") || lowerVision.includes("love") || lowerVision.includes("relationship")) {
                endingProposal = {
                    title: isEsp ? "La Separación Necesaria" : "The Necessary Separation",
                    desc: isEsp
                        ? "En lugar de un reencuentro feliz, ambos aceptan que deben seguir caminos separados para crecer. Un final agridulce pero maduro."
                        : "Instead of a happy reunion, both accept they must part ways to grow. A bittersweet but mature ending."
                };
            } else if (lowerVision.includes("futuro") || lowerVision.includes("ia ") || lowerVision.includes("robot") || lowerVision.includes("tech")) {
                endingProposal = {
                    title: isEsp ? "El Bucle Recursivo" : "The Recursive Loop",
                    desc: isEsp
                        ? "La última toma revela que el protagonista es en realidad una simulación reviviendo el mismo recuerdo una y otra vez."
                        : "The final shot reveals the protagonist is actually a simulation reliving the same memory over and over."
                };
            } else {
                endingProposal = {
                    title: isEsp ? "La Ambigüedad Poética" : "The Poetic Ambiguity",
                    desc: isEsp
                        ? "Corte a negro justo antes de la resolución. Dejamos a la audiencia con la duda de si logró su objetivo, forzando la reflexión."
                        : "Cut to black right before resolution. Leave the audience wondering if they succeeded, forcing reflection."
                };
            }

            // Simple keyword extractor for title (mock)
            const keywords = inputContent.split(' ').filter((w: string) => w.length > 5);
            const titleKeyword = keywords[0] ? keywords[0].toUpperCase() : (isEsp ? "PROYECTO NUEVO" : "NEW PROJECT");

            return {
                title: isEsp ? `PROYECTO: ${titleKeyword}` : `PROJECT: ${titleKeyword}`,
                logline: isEsp
                    ? `Cuando un ${inputContent.toLowerCase().includes('mujer') ? 'mujer' : 'personaje'} se enfrenta a "${inputContent.substring(0, 50)}...", deberá luchar contra lo imposible para lograr su objetivo principal antes de que sea demasiado tarde.`
                    : `When a ${inputContent.toLowerCase().includes('woman') ? 'woman' : 'character'} faces "${inputContent.substring(0, 50)}...", they must fight against the odds to achieve their goal before it's too late.`,
                ref: isEsp ? "Ref: Estilo visual adaptado al input del usuario." : "Ref: Visual style adapted to user input.",

                // AI SUGGESTED ENDING
                suggestedEnding: endingProposal,

                // RESTORED: STORY STRUCTURE (ESCALETA)
                escaleta: [
                    { time: "0-2 min", title: isEsp ? "El Detonante" : "The Trigger", desc: act1 },
                    { time: "2-5 min", title: isEsp ? "Desarrollo / Complicación" : "Development / Complication", desc: isEsp ? `La situación se complica: ${act2}` : `The situation gets complicated: ${act2}` },
                    { time: "5-8 min", title: isEsp ? "El Punto de No Retorno" : "Point of No Return", desc: isEsp ? "El protagonista debe tomar una decisión drástica." : "The protagonist must make a drastic decision." },
                    { time: "8-10 min", title: isEsp ? "Desenlace" : "Resolution", desc: act3 }
                ],

                // DETAILED TECHNICAL SCRIPT (SHOT LIST) - One shot per detected scene as a starting point
                shotList: Array.from({ length: detectedSceneCount }).map((_, i) => {
                    const sceneNum = i + 1;
                    const timePerSc = (duration * 60) / detectedSceneCount;
                    const elapsed = i * timePerSc;
                    const timeStr = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(Math.floor(elapsed % 60)).toString().padStart(2, '0')}`;

                    return {
                        id: (i + 1).toString(),
                        scene: sceneNum.toString(),
                        time: timeStr,
                        type: "MASTER SHOT",
                        lens: "35mm",
                        subject: isEsp ? `Apertura de Escena ${sceneNum}` : `Opening of Scene ${sceneNum}`,
                        description_detail: isEsp ? "Plano general de situación basado en el guion." : "Master shot based on the script.",
                        audio: isEsp ? "Ambiente sincronizado" : "Synchronized ambience",
                        props: "",
                        detail_shot: "",
                        actors: "",
                        note: `${lightNote}. ${paceNote}.`
                    };
                })
            };
        }

        // --- DEFAULT SILENT MODE LOGIC ---
        return {
            title: isEsp ? "MODO SILENCIO" : "SILENT MODE",
            logline: isEsp
                ? `Un joven intenta cenar con su madre, pero descubre que ella solo responde a través de mensajes de texto. La realidad física se deteriora.`
                : `A young man tries to have dinner with his mother, but discovers she only responds via text messages. Physical reality decays.`,
            ref: "Ref: 'The Menu' (Food prep sounds), 'Hereditary' (Wide shots).",

            // FULL STRUCTURE
            escaleta: [
                { time: "0-2 min", title: isEsp ? "La Espera" : "The Wait", desc: isEsp ? "Lucas prepara dinner. Absolute silence." : "Lucas prepares dinner. Absolute silence." },
                { time: "2-4 min", title: isEsp ? "Conexión Perdida" : "Lost Connection", desc: isEsp ? "Madre entra. No habla. Solo responde por WhatsApp." : "Mother enters. Doesn't speak. Only answers via WhatsApp." },
                { time: "4-7 min", title: isEsp ? "La Glitch" : "The Glitch", desc: isEsp ? "Lucas ve a través de su cámara que su madre sonríe falsamente." : "Lucas sees through his camera that his mother is smiling falsely." },
                { time: "9-10 min", title: isEsp ? "Rendición" : "Surrender", desc: isEsp ? "Lucas accepts the simulation." : "Lucas accepts the simulation." }
            ],

            // DETAILED TECHNICAL SCRIPT
            shotList: [
                { id: "1A", time: "00:00", type: "INSERT / MACRO", lens: "100mm", subject: isEsp ? "Vapor saliendo de la sopa caliente" : "Steam rising from hot soup", audio: isEsp ? "Sonido amplificado de burbujeo" : "Amplified bubbling sound", note: `${paceNote}.` },
                { id: "1B", time: "00:15", type: "ECU (Extreme Close Up)", lens: "85mm", subject: isEsp ? "Ojos de LUCAS mirando el reloj" : "LUCAS's eyes checking the clock", audio: isEsp ? "Tic-tac del reloj muy fuerte" : "Loud clock ticking", note: isEsp ? "La mirada denota ansiedad." : "Look shows anxiety." },
                { id: "2", time: "00:30", type: "WIDE / MASTER", lens: "24mm", subject: isEsp ? "El comedor perfectamente puesto, silla vacía" : "Perfectly set dining room, empty chair", audio: isEsp ? "Zumbido eléctrico (Room Tone)" : "Electric hum (Room Tone)", note: `${lightNote}. ${isEsp ? "Simetría Kubrickiana." : "Kubrickian symmetry."}` },
                { id: "3", time: "00:50", type: "MEDIUM", lens: "50mm", subject: isEsp ? "Lucas coloca los DOS celulares en la mesa" : "Lucas places BOTH phones on table", audio: isEsp ? "Golpe seco del vidrio contra madera" : "Sharp thud of glass on wood", note: isEsp ? "Acción ritualística." : "Ritualistic action." },
                { id: "4", time: "01:20", type: "POV / HANDHELD", lens: "35mm", subject: isEsp ? "Desde atrás de Lucas hacia la puerta oscura" : "From behind Lucas towards dark door", audio: isEsp ? "Sonido de notificación distante" : "Distant notification sound", note: `${pacingVal > 70 ? "Cámara en mano temblorosa" : "Dolly in superlento"}` },
                { id: "5", time: "01:45", type: "CLOSE UP", lens: "50mm", subject: isEsp ? "La notificación ilumina su rostro" : "Notification lights up his face", audio: isEsp ? "Silencio súbito" : "Sudden silence", note: `${lightNote}. Ref: 'Euphoria' aesthetics.` }
            ]
        };
    };

    const [generatedConcept, setGeneratedConcept] = useState<null | { title: string, logline: string, ref: string, escaleta?: any[], shotList?: any[], isCustom?: boolean, suggestedEnding?: { title: string, desc: string } }>(null);

    const handleGenerate = () => {
        const finalInput = scriptText || customVision;
        if (finalInput.length < 5) return;
        const isEsp = language !== 'en';
        const newScript = getDetailedScript(isEsp, finalInput, pacing, contrast, sceneCount) as any;
        setGeneratedConcept(newScript);
        setActiveTab("concept"); // Reset to Concept to show the storage evolution first
        setRefinementStep(0);
        setAdvisorNote(isEsp
            ? "He estructurado tu idea completa. Revisa el flujo narrativo en 'Estructura' antes de pasar al 'Guion Técnico'."
            : "I've structured your full idea. Review the narrative flow in 'Structure' before moving to the 'Shot List'.");
    };

    // Update script when sliders change
    const updateAtmosphere = (newPacing: number, newContrast: number) => {
        setPacing(newPacing);
        setContrast(newContrast);
        if (generatedConcept) {
            // Auto-switch to Shot List to show the real-time changes
            if (activeTab !== "shotlist") {
                setActiveTab("shotlist");
            }
            const isEsp = language !== 'en';
            setGeneratedConcept(getDetailedScript(isEsp, scriptText, newPacing, newContrast, sceneCount) as any);
        }
    };

    // The following states and functions are no longer used based on the new functionality
    const [vibe, setVibe] = useState("Drama");
    const [customVision, setCustomVision] = useState("");
    const [activeTab, setActiveTab] = useState("concept");
    const [refinementStep, setRefinementStep] = useState(0); // 0: Base, 1: Arthouse, 2: Genre/Horror
    const [advisorNote, setAdvisorNote] = useState("");

    // Shot List Editing State
    const [editingShotIndex, setEditingShotIndex] = useState<number | null>(null);

    // Shot Actions
    const handleAddShot = () => {
        if (!generatedConcept) return;
        const newShot = {
            id: `${generatedConcept.shotList?.length ? generatedConcept.shotList.length + 1 : 1}`,
            scene: "1",
            time: "00:00",
            type: "WIDE",
            lens: "35mm",
            subject: language === 'en' ? "New Shot Description..." : "Descripción del nuevo plano...",
            description_detail: "",
            audio: language === 'en' ? "Audio notes..." : "Notas de audio...",
            props: "",
            detail_shot: "",
            actors: "",
            note: language === 'en' ? "Director's note..." : "Nota del director..."
        };
        const updatedList = [...(generatedConcept.shotList || []), newShot];
        setGeneratedConcept({ ...generatedConcept, shotList: updatedList });
        setEditingShotIndex(updatedList.length - 1); // Auto-focus new shot
    };

    const handleDeleteShot = (index: number) => {
        if (!generatedConcept || !generatedConcept.shotList) return;
        const updatedList = generatedConcept.shotList.filter((_, i) => i !== index);
        setGeneratedConcept({ ...generatedConcept, shotList: updatedList });
        if (editingShotIndex === index) setEditingShotIndex(null);
    };

    const handleUpdateShot = (index: number, field: string, value: string) => {
        if (!generatedConcept || !generatedConcept.shotList) return;
        const updatedList = [...generatedConcept.shotList];
        updatedList[index] = { ...updatedList[index], [field]: value };
        setGeneratedConcept({ ...generatedConcept, shotList: updatedList });
    };

    // Export PDF Function
    const handleExportPDF = async () => {
        if (!generatedConcept || !generatedConcept.shotList) return;

        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
            const isEsp = language !== 'en';

            // Title
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text(generatedConcept.title, 14, 20);

            // Logline
            doc.setFontSize(12);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            const splitLogline = doc.splitTextToSize(generatedConcept.logline, 260); // Wider for landscape
            doc.text(splitLogline, 14, 30);

            // Director's Note / Context
            let currentY = 30 + (splitLogline.length * 5) + 10;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);
            doc.text(isEsp ? "NOTA DEL DIRECTOR / CONTEXTO:" : "DIRECTOR'S NOTE / CONTEXT:", 14, currentY);
            currentY += 5;
            doc.setFont("helvetica", "italic");
            doc.setTextColor(80);
            const noteText = advisorNote || (isEsp ? "Generado por Antigravity Studio." : "Generated by Antigravity Studio.");
            const splitNote = doc.splitTextToSize(noteText, 260); // Wider for landscape
            doc.text(splitNote, 14, currentY);

            // Table
            currentY += (splitNote.length * 4) + 10;

            const tableColumn = isEsp
                ? ["ID", "Esc", "Tiempo", "Encuadre", "Lente", "Acción", "Descripción Plano", "Sonido/EFX", "Utilería", "Detalle", "Actores", "Notas", "Storyboard / Boceto"]
                : ["ID", "Sc", "Time", "Type", "Lens", "Action", "Description Shot", "Audio/SFX", "Props", "Detail", "Actors", "Notes", "Storyboard / Sketch"];

            const tableRows = generatedConcept.shotList.map(shot => [
                shot.id,
                shot.scene || "",
                shot.time,
                shot.type,
                shot.lens,
                shot.subject,
                shot.description_detail || "",
                shot.audio,
                shot.props || "",
                shot.detail_shot || "",
                shot.actors || "",
                shot.note,
                "" // Empty space for Storyboard drawing
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [tableColumn],
                body: tableRows,
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    minCellHeight: 35, // Space for drawing
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 8 },  // ID
                    1: { cellWidth: 8 },  // Esc
                    2: { cellWidth: 15 }, // Time
                    3: { cellWidth: 20 }, // Type
                    4: { cellWidth: 12 }, // Lens
                    5: { cellWidth: 30 }, // Action
                    6: { cellWidth: 30 }, // Description
                    7: { cellWidth: 20 }, // Audio
                    8: { cellWidth: 15 }, // Props
                    9: { cellWidth: 15 }, // Detail
                    10: { cellWidth: 15 }, // Actors
                    11: { cellWidth: 20 }, // Notes
                    12: { cellWidth: 45 }  // Storyboard (Largest)
                },
                headStyles: { fillColor: [245, 158, 11] }, // Amber 500
                alternateRowStyles: { fillColor: [250, 250, 250] },
                margin: { left: 10, right: 10 }
            });

            doc.save("Script_Antigravity.pdf");

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(language === 'en' ? "Error generating PDF" : "Error al generar el PDF");
        }
    };

    // Base Script Data (The "Silent Mode" Project) - This is replaced by getDetailedScript
    const baseScript = (isEsp: boolean, vision: string) => ({
        title: isEsp ? "MODO SILENCIO" : "SILENT MODE",
        logline: isEsp
            ? `Un joven intenta cenar con su madre, pero descubre que ella solo responde a través de mensajes de texto. La realidad física se deteriora.${vision ? ` (Idea: ${vision})` : ''}`
            : `A young man tries to have dinner with his mother, but discovers she only responds via text messages. Physical reality decays.${vision ? ` (Idea: ${vision})` : ''}`,
        ref: "Ref: 'Black Mirror', 'Hereditary'.",
        escaleta: [
            { time: "0-2 min", title: isEsp ? "La Espera" : "The Wait", desc: isEsp ? "Lucas prepara dinner. Absolute silence." : "Lucas prepares dinner. Absolute silence." },
            { time: "2-4 min", title: isEsp ? "Conexión Perdida" : "Lost Connection", desc: isEsp ? "Madre entra. No habla. Solo responde por WhatsApp." : "Mother enters. Doesn't speak. Only answers via WhatsApp." },
            { time: "4-7 min", title: isEsp ? "La Glitch" : "The Glitch", desc: isEsp ? "Lucas ve a través de su cámara que su madre sonríe falsamente." : "Lucas sees through his camera that his mother is smiling falsely." },
            { time: "9-10 min", title: isEsp ? "Rendición" : "Surrender", desc: isEsp ? "Lucas accepts the simulation." : "Lucas accepts the simulation." }
        ],
        shotList: [
            { id: 1, type: isEsp ? "Detalle" : "Detail", subject: isEsp ? "Vapor de la sopa" : "Soup Steam", note: isEsp ? "Audio ASMR" : "ASMR Audio" },
            { id: 2, type: isEsp ? "General" : "Wide", subject: isEsp ? "Comedor oscuro" : "Dark Dining Room", note: isEsp ? "Aislamiento" : "Isolation" },
            { id: 3, type: isEsp ? "Medio" : "Medium", subject: isEsp ? "Madre con celular" : "Mother with phone", note: isEsp ? "Luz Azul" : "Blue Light" },
            { id: 4, type: isEsp ? "POV" : "POV", subject: isEsp ? "Pantalla de Lucas" : "Lucas' Screen", note: isEsp ? "Filtro Feliz" : "Happy Filter" },
            { id: 5, type: isEsp ? "Primer Plano" : "Close Up", subject: isEsp ? "Reacción Lucas" : "Lucas Reaction", note: isEsp ? "Terror" : "Terror" },
        ]
    });

    // This function is no longer used as the refinement logic is removed
    const applyRefinement = (type: 'arthouse' | 'horror' | 'budget') => {
        if (!generatedConcept) return;
        const isEsp = language !== 'en';
        let newScript = { ...generatedConcept };

        if (type === 'arthouse') {
            newScript.title = isEsp ? "SILENCIO_01" : "SILENCE_01";
            newScript.logline = isEsp ? "Sin diálogos. Una exploración visual de la desconexión." : "No dialogue. A visual exploration of disconnection.";
            newScript.escaleta![1].desc = isEsp ? "Madre entra. Lucas intenta hablar. Ella sube el volumen de su música." : "Mother enters. Lucas tries to speak. She turns up her music.";
            newScript.shotList = [
                { id: 1, type: isEsp ? "Plano Secuencia (2 min)" : "Sequence Shot (2 min)", subject: isEsp ? "La cena completa sin cortes" : "Entire dinner without cuts", note: isEsp ? "Estilo Haneke. Tensión estática." : "Haneke style. Static tension." },
                { id: 2, type: isEsp ? "Detalle Extremo" : "Extreme Detail", subject: isEsp ? "Ojo de la madre no parpadea" : "Mother's eye doesn't blink", note: "Macro lens." },
                { id: 3, type: isEsp ? "General Distante" : "Distant Wide", subject: isEsp ? "Ambos en extremos de la mesa" : "Both at ends of the table", note: isEsp ? "Simetría perfecta." : "Perfect symmetry." }
            ];
            setAdvisorNote(isEsp
                ? "💡 ESTRATEGIA: El 'Cine Lento' tiene un 40% más de probabilidad de selección en festivales Clase A (Cannes/Berlin) que el terror convencional."
                : "💡 STRATEGY: 'Slow Cinema' has a 40% higher selection rate in Class A festivals than conventional horror.");
            setRefinementStep(1);
        }

        if (type === 'horror') {
            newScript.title = isEsp ? "NOTIFICACIÓN FINAL" : "FINAL NOTIFICATION";
            newScript.logline = isEsp ? "La adicción se vuelve posesión demoníaca digital." : "Addiction becomes digital demonic possession.";
            newScript.escaleta![3].desc = isEsp ? "La madre empieza a sangrar píxeles negros por los ojos." : "Mother starts bleeding black pixels from her eyes.";
            newScript.shotList!.push({ id: 6, type: "Dutch Angle", subject: isEsp ? "Madre gritando estática" : "Mother screaming static", note: isEsp ? "Distorsión de lente." : "Lens distortion." });
            setAdvisorNote(isEsp
                ? "🩸 ESTRATEGIA: Para Sitges/Midnight, el impacto visual final lo es todo. Sacrificamos sutileza por memorabilidad."
                : "🩸 STRATEGY: For Sitges/Midnight, the final visual impact is everything. We sacrifice subtlety for memorability.");
            setRefinementStep(2);
        }

        if (type === 'budget') {
            newScript.title = isEsp ? "MODO SILENCIO (Low Cost)" : "SILENT MODE (Low Cost)";
            newScript.shotList = [
                { id: 1, type: isEsp ? "Trípode Fijo" : "Fixed Tripod", subject: isEsp ? "Toda la acción en un plano" : "All action in one shot", note: isEsp ? "Sin operador de cámara necesario." : "No camera operator needed." },
                { id: 2, type: isEsp ? "POV Celular" : "Phone POV", subject: isEsp ? "Grabado con el mismo teléfono" : "Shot with the same phone", note: isEsp ? "Estilo Found Footage." : "Found Footage style." }
            ];
            setAdvisorNote(isEsp
                ? "💰 ESTRATEGIA: Menos cortes = Menos días de rodaje. 'Tangerine' ganó Sundance grabada solo con iPhones."
                : "💰 STRATEGY: Fewer cuts = Fewer shooting days. 'Tangerine' won Sundance shot entirely on iPhones.");
            setRefinementStep(3);
        }

        setGeneratedConcept(newScript);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
            <LanguageSwitcher />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center gap-4 border-b border-neutral-800 pb-6">
                    <Link href="/" className="p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <Clapperboard className="text-amber-500" size={32} />
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600">
                                {language === 'en' ? 'Technical Director Studio' : 'Estudio de Dirección Técnica'}
                            </h1>
                        </div>
                        <p className="text-neutral-400 mt-1">
                            {language === 'en' ? 'Interactive scene breakdown.' : 'Desglose de escena interactivo.'}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Sinopsis Input */}
                        <section className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-neutral-400 uppercase tracking-wider">
                                <Sparkles size={14} />
                                {language === 'en' ? 'Synopsis' : 'Sinopsis'}
                            </h2>
                            <textarea
                                value={scriptText}
                                onChange={(e) => setScriptText(e.target.value)}
                                placeholder={language === 'en' ? "Paste your full screenplay here (e.g. ESC 1 / EXT / CAR - NIGHT...)" : "Pega tu guion completo aquí (ej. ESC 1 / EXT / AUTO - NOCHE...)"}
                                className="w-full h-24 bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm focus:border-amber-500 outline-none resize-none placeholder:text-neutral-600 mb-4"
                            />

                            <div className="space-y-3 mb-6 bg-amber-500/5 p-4 rounded-lg border border-amber-500/10">
                                <h3 className="text-[10px] font-black uppercase text-amber-500/60 tracking-tighter">
                                    {language === 'en' ? 'Quick Plot Idea (Optional)' : 'Idea Rápida / Sinopsis (Opcional)'}
                                </h3>
                                <textarea
                                    value={customVision}
                                    onChange={(e) => setCustomVision(e.target.value)}
                                    placeholder={language === 'en' ? "Short summary if no script provided..." : "Resumen corto si no tienes el guion..."}
                                    className="w-full h-16 bg-transparent border-none p-0 text-xs focus:ring-0 outline-none resize-none placeholder:text-neutral-700"
                                />
                            </div>

                            {/* Duration Selector */}
                            <div className="space-y-3 mb-6">
                                <label className="text-xs text-neutral-400 uppercase font-bold flex justify-between">
                                    <span>{language === 'en' ? 'Target Duration' : 'Duración Estimada'}</span>
                                    <span className="text-amber-500">{duration} min</span>
                                </label>
                                <input
                                    type="range" min="1" max="210" value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <p className="text-[10px] text-neutral-500 italic">
                                    {language === 'en' ? 'From short films (7s) to features (210m).' : 'Desde cortos (7s) hasta largometrajes (210m).'}
                                </p>
                            </div>

                            {/* Scene Count Selector */}
                            <div className="space-y-3 mb-6">
                                <label className="text-xs text-neutral-400 uppercase font-bold flex justify-between">
                                    <span>{language === 'en' ? 'Scenes' : 'Escenas'}</span>
                                    <span className="text-amber-500">{sceneCount}</span>
                                </label>
                                <input
                                    type="range" min="1" max="15" value={sceneCount}
                                    onChange={(e) => setSceneCount(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <p className="text-[10px] text-neutral-500 italic">
                                    {language === 'en' ? 'Determines the number of AI-generated scenes.' : 'Determina el número de escenas generadas por la IA.'}
                                </p>
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg font-bold text-neutral-950 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm"
                            >
                                {language === 'en' ? 'Generate Opening Sc.' : 'Generar Apertura'}
                            </button>
                        </section>

                        {/* ATMOSPHERE CONTROLS */}
                        {generatedConcept && (
                            <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-8 animate-in fade-in slide-in-from-left-4">
                                <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                    <Target size={16} className="text-amber-500" />
                                    {language === 'en' ? 'Atmosphere' : 'Atmósfera'}
                                </h2>

                                {/* Pacing Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-neutral-400 uppercase font-mono">
                                        <span>{language === 'en' ? 'Slow / Tension' : 'Lento / Tensión'}</span>
                                        <span>{language === 'en' ? 'Fast / Chaos' : 'Rápido / Caos'}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" value={pacing}
                                        onChange={(e) => updateAtmosphere(parseInt(e.target.value), contrast)}
                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="text-xs text-center text-amber-500 font-mono">{pacing}% {language === 'en' ? 'Pacing' : 'Ritmo'}</div>
                                </div>

                                {/* Contrast Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-neutral-400 uppercase font-mono">
                                        <span>{language === 'en' ? 'Natural' : 'Natural'}</span>
                                        <span>{language === 'en' ? 'Stylized' : 'Estilizado'}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" value={contrast}
                                        onChange={(e) => updateAtmosphere(pacing, parseInt(e.target.value))}
                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="text-xs text-center text-indigo-400 font-mono">{contrast}% {language === 'en' ? 'Contrast' : 'Contraste'}</div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: The Detailed Shot List */}
                    <div className="lg:col-span-9">
                        {generatedConcept ? (
                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden min-h-[600px] flex flex-col relative">

                                {advisorNote && (
                                    <div className="bg-indigo-500/10 border-b border-indigo-500/20 p-3 text-sm text-indigo-200 flex items-start gap-2">
                                        <div className="mt-0.5"><Users size={16} /></div>
                                        <p>{advisorNote}</p>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="p-8 border-b border-neutral-800 bg-neutral-900/30">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Film size={14} />
                                                {language === 'en' ? 'Project Overview' : 'Resumen del Proyecto'}
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-white mb-2">{generatedConcept.title}</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="flex border-b border-neutral-800 bg-neutral-900/50 px-8 gap-6">
                                    <button
                                        onClick={() => setActiveTab('concept')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'concept' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Sparkles size={14} />
                                        {language === 'en' ? 'Concept' : 'Concepto'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('structure')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'structure' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Trophy size={14} />
                                        {language === 'en' ? 'Structure' : 'Estructura'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shotlist')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'shotlist' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Clapperboard size={14} />
                                        {language === 'en' ? 'Shot List' : 'Guion Técnico'}
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 space-y-4 overflow-y-auto bg-neutral-950 flex-1">

                                    {/* CONCEPT TAB */}
                                    {activeTab === 'concept' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                            <div>
                                                <h3 className="text-neutral-500 text-sm font-mono uppercase mb-2">Logline</h3>
                                                <p className="text-2xl text-white leading-relaxed font-serif italic border-l-4 border-amber-500 pl-4">
                                                    "{generatedConcept.logline}"
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-neutral-500 text-sm font-mono uppercase mb-2">{language === 'en' ? 'Visual References' : 'Referencias Visuales'}</h3>
                                                <p className="text-neutral-300">{generatedConcept.ref}</p>
                                            </div>
                                            <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-xl">
                                                <h3 className="text-emerald-500 text-sm font-bold mb-2 flex items-center gap-2">
                                                    <Target size={14} />
                                                    {language === 'en' ? 'Director\'s Note' : 'Nota del Director'}
                                                </h3>
                                                <p className="text-emerald-200/80 text-sm leading-relaxed">
                                                    {language === 'en'
                                                        ? "The structure focuses on establishing atmosphere before introducing the central conflict. This slow-burn approach is highly effective for festival circuits like Sundance or Berlin."
                                                        : "La estructura se centra en establecer la atmósfera antes de introducir el conflicto central. Este enfoque 'slow-burn' es muy efectivo para circuitos de festivales como Sundance o Berlín."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* STRUCTURE TAB */}
                                    {activeTab === 'structure' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="space-y-4">
                                                {generatedConcept.escaleta?.map((beat: any, i: number) => (
                                                    <div key={i} className="flex gap-4 p-5 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-amber-500/30 transition-all items-start">
                                                        <div className="text-amber-500 font-mono text-xs font-bold whitespace-nowrap pt-1 w-20 bg-amber-500/10 py-1 px-2 rounded text-center">{beat.time}</div>
                                                        <div>
                                                            <h4 className="font-bold text-white mb-1 text-lg">{beat.title}</h4>
                                                            <p className="text-neutral-400 text-sm leading-relaxed">{beat.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* AI ENDING PROPOSAL */}
                                            {generatedConcept.suggestedEnding && (
                                                <div className="mt-4 p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-neutral-900 rounded-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Sparkles size={120} />
                                                    </div>

                                                    <h4 className="text-amber-500 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                        <Sparkles size={16} />
                                                        {language === 'en' ? 'AI Suggestion: Alternate Ending' : 'Sugerencia IA: Final Alternativo'}
                                                    </h4>

                                                    <h3 className="text-xl font-serif text-white italic mb-2">
                                                        "{generatedConcept.suggestedEnding.title}"
                                                    </h3>
                                                    <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl relative z-10">
                                                        {generatedConcept.suggestedEnding.desc}
                                                    </p>

                                                    <div className="mt-4 flex gap-3">
                                                        <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold rounded-lg transition-colors border border-amber-500/20">
                                                            {language === 'en' ? 'Adopt this Ending' : 'Adoptar este Final'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* SHOT LIST TAB */}
                                    {activeTab === 'shotlist' && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            {generatedConcept.shotList?.map((shot: any, index: number) => (
                                                <div key={index} className={cn(
                                                    "group border rounded-lg p-5 transition-all flex gap-6 items-start",
                                                    editingShotIndex === index
                                                        ? "bg-neutral-900 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                                                        : "bg-neutral-900/50 border-neutral-800 hover:border-amber-500/40 hover:bg-neutral-900"
                                                )}>

                                                    {/* EDIT MODE */}
                                                    {editingShotIndex === index ? (
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="w-16 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'ID' : 'ID'}</label>
                                                                    <input
                                                                        value={shot.id}
                                                                        onChange={(e) => handleUpdateShot(index, 'id', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-white text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-16 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Scene' : 'Escena'}</label>
                                                                    <input
                                                                        value={shot.scene}
                                                                        onChange={(e) => handleUpdateShot(index, 'scene', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-amber-500 text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-24 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Lens' : 'Lente'}</label>
                                                                    <input
                                                                        value={shot.lens}
                                                                        onChange={(e) => handleUpdateShot(index, 'lens', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs font-mono text-neutral-300 text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-32 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Type' : 'Encuadre'}</label>
                                                                    <input
                                                                        value={shot.type}
                                                                        onChange={(e) => handleUpdateShot(index, 'type', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-emerald-900/50 rounded px-2 py-1 text-xs font-bold text-emerald-400 uppercase"
                                                                    />
                                                                </div>
                                                                <div className="w-24 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Time' : 'Tiempo'}</label>
                                                                    <input
                                                                        value={shot.time}
                                                                        onChange={(e) => handleUpdateShot(index, 'time', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs font-mono text-neutral-400"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Subject / Action' : 'Acción'}</label>
                                                                    <textarea
                                                                        value={shot.subject}
                                                                        onChange={(e) => handleUpdateShot(index, 'subject', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white resize-none h-20 focus:border-amber-500 outline-none"
                                                                        placeholder={language === 'en' ? "What happens in this shot..." : "Qué sucede en este plano..."}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Shot Description' : 'Descripción plano'}</label>
                                                                    <textarea
                                                                        value={shot.description_detail}
                                                                        onChange={(e) => handleUpdateShot(index, 'description_detail', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white resize-none h-20 focus:border-amber-500 outline-none"
                                                                        placeholder={language === 'en' ? "Visual composition, framing details..." : "Composición visual, detalles de encuadre..."}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Audio / SFX' : 'Sonido/ Efectos'}</label>
                                                                    <input
                                                                        value={shot.audio}
                                                                        onChange={(e) => handleUpdateShot(index, 'audio', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Props' : 'Utilería'}</label>
                                                                    <input
                                                                        value={shot.props}
                                                                        onChange={(e) => handleUpdateShot(index, 'props', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Detail' : 'Detalle'}</label>
                                                                    <input
                                                                        value={shot.detail_shot}
                                                                        onChange={(e) => handleUpdateShot(index, 'detail_shot', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Actors' : 'Actores'}</label>
                                                                    <input
                                                                        value={shot.actors}
                                                                        onChange={(e) => handleUpdateShot(index, 'actors', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Director Note' : 'Nota del Director'}</label>
                                                                <input
                                                                    value={shot.note}
                                                                    onChange={(e) => handleUpdateShot(index, 'note', e.target.value)}
                                                                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-amber-200/70"
                                                                />
                                                            </div>

                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <button
                                                                    onClick={() => setEditingShotIndex(null)}
                                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Check size={14} /> {language === 'en' ? 'Save' : 'Guardar'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // VIEW MODE
                                                        <>
                                                            {/* ID & Lens */}
                                                            <div className="flex flex-col items-center justify-center w-16 shrink-0 gap-2">
                                                                <div className="text-2xl font-black text-neutral-700 group-hover:text-amber-500/50 transition-colors">{shot.id}</div>
                                                                <div className="px-2 py-1 bg-neutral-950 rounded text-xs font-mono text-neutral-400 border border-neutral-800">{shot.lens}</div>
                                                            </div>

                                                            {/* Shot Details */}
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                                    <span className="text-amber-500 font-bold text-xs bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40">SC {shot.scene || "1"}</span>
                                                                    <span className="text-emerald-400 font-bold tracking-wide text-sm uppercase bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">{shot.type}</span>
                                                                    <span className="text-neutral-500 text-xs font-mono">{shot.time}</span>
                                                                </div>
                                                                <h3 className="text-lg font-bold text-white leading-snug">{shot.subject}</h3>
                                                                {shot.description_detail && (
                                                                    <p className="text-sm text-neutral-400 mt-1 italic leading-relaxed">{shot.description_detail}</p>
                                                                )}

                                                                {/* Audio, Props, Detail, Actors & Notes */}
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-neutral-800/50">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'AUDIO / SFX' : 'SONIDO/ EFECTOS'}:</span>
                                                                        <span className="text-xs text-neutral-400">{shot.audio}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'PROPS' : 'UTILERÍA'}:</span>
                                                                        <span className="text-xs text-neutral-400">{shot.props || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'DETAIL' : 'DETALLE'}:</span>
                                                                        <span className="text-xs text-indigo-400">{shot.detail_shot || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'ACTORS' : 'ACTORES'}:</span>
                                                                        <span className="text-xs text-emerald-400">{shot.actors || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 md:col-span-2">
                                                                        <span className="text-amber-500/50 uppercase font-black text-[9px]">{language === 'en' ? 'DIRECTOR NOTE' : 'NOTA DIRECTOR'}:</span>
                                                                        <span className="text-xs text-amber-200/70">{shot.note}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                                <button
                                                                    onClick={() => setEditingShotIndex(index)}
                                                                    className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteShot(index)}
                                                                    className="p-2 hover:bg-red-900/30 rounded text-neutral-400 hover:text-red-400 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="flex justify-center pt-8 pb-4 gap-4">
                                                <button
                                                    onClick={handleAddShot}
                                                    className="text-neutral-500 hover:text-amber-500 transition-colors text-sm flex items-center gap-2 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full border border-dashed border-neutral-600 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all">
                                                        <Plus size={16} />
                                                    </div>
                                                    {language === 'en' ? 'Add New Shot' : 'Añadir Nuevo Plano'}
                                                </button>

                                                <button
                                                    onClick={handleExportPDF}
                                                    className="text-neutral-500 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full border border-dashed border-neutral-600 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                                        <FileDown size={16} />
                                                    </div>
                                                    {language === 'en' ? 'Export to PDF' : 'Exportar a PDF'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-neutral-900/20">
                                <Film size={48} className="text-neutral-700 mb-4" />
                                <h3 className="text-xl font-bold text-neutral-500 mb-2">
                                    {language === 'en' ? 'Script Generator' : 'Generador de Guiones'}
                                </h3>
                                <p className="text-neutral-600 max-w-sm">
                                    {language === 'en'
                                        ? 'Enter your vision on the left and generate a complete project breakdown.'
                                        : 'Introduce tu visión a la izquierda y genera un desglose de proyecto completo.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
