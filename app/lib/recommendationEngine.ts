import festivalsData from '../data/festivals.json';

export interface Recommendation {
    festivalId: string;
    festivalName: string;
    affinityScore: number;
    technicalReasoning: string;
    weaknesses: string;
    matchingWinner?: {
        title: string;
        theme: string;
    };
}

export function analyzeYouTubeLink(url: string): Promise<Recommendation[]> {
    // Simulación de análisis técnico y elegante
    return new Promise((resolve) => {
        setTimeout(() => {
            // Extraemos un "ID" ficticio de la URL para dar variedad a las recomendaciones simladas
            const seed = url.length % 5;

            const recommendations: Recommendation[] = festivalsData
                .filter(f => f.winners && f.winners.length > 0)
                .slice(0, 3) // Tomamos 3 para el ejemplo
                .map((fest, index) => {
                    const winner = fest.winners[0];
                    const affinity = 85 + (index * 2) + seed;

                    return {
                        festivalId: fest.id,
                        festivalName: fest.name,
                        affinityScore: Math.min(affinity, 99),
                        technicalReasoning: `La narrativa visual detectada presenta una cadencia rítmica muy similar a "${winner.title}", ganador en ${winner.year}. El uso de la profundidad de campo y el tratamiento cromático sugiere una madurez técnica que resuena con la línea curatorial de ${fest.location}.`,
                        weaknesses: index === 0
                            ? "Se observa una ligera inconsistencia en el diseño sonoro durante las transiciones del segundo acto. Un tratamiento más diegético fortalecería la inmersión."
                            : "La estructura del tercer acto podría beneficiarse de un montaje más elíptico para evitar la redundancia informativa.",
                        matchingWinner: {
                            title: winner.title,
                            theme: winner.theme.es
                        }
                    };
                });

            resolve(recommendations.sort((a, b) => b.affinityScore - a.affinityScore));
        }, 2000); // Simula carga de "análisis científico"
    });
}
