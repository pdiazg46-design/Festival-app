import { Rocket } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-12 border-t border-neutral-900 bg-neutral-950 text-center">
            <div className="flex flex-col items-center gap-2 text-neutral-500 text-sm">
                <div className="flex items-center gap-2">
                    <span>Created by</span>
                    <span className="inline-flex items-center gap-2">
                        <img
                            src="/atsit-logo-white.png"
                            alt="AT-SIT"
                            className="h-5 w-auto"
                        />
                        <span className="text-neutral-300 font-bold tracking-widest">AT-SIT</span>
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                    <Rocket size={12} />
                    <span>Powered for Future Developments</span>
                </div>
            </div>
        </footer>
    );
}
