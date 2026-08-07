"use client";

import { useState } from "react";
import LoadingScreen from "@/components/loading-screen";

export default function AppBootGate({ children }: { children: React.ReactNode }) {
    const [booted, setBooted] = useState(false);

    return (
        <>
            {children}
            {!booted && <LoadingScreen onComplete={() => setBooted(true)} />}
        </>
    );
}
