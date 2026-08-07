"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Stage = "circle" | "check" | "text" | "hold" | "exit";

// AMS wordmark bounding box measured directly from public/bg_logo.png
// (1216 x 1294): x=[120,1090] y=[898,1210]. Used to clip the mask to just
// the lettering so nothing else from the source artwork (icon, padding)
// bleeds in. The circle+check icon above it is drawn as vector shapes
// instead (see below), not cropped from the PNG.
const TEXT_BOX = { x: 120, y: 898, width: 970, height: 312 };

export default function LoadingScreen({
    onComplete,
}: {
    onComplete?: () => void;
}) {
    const reduceMotion = useReducedMotion();
    const [stage, setStage] = useState<Stage>("circle");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (reduceMotion) setStage("hold");
    }, [reduceMotion]);

    useEffect(() => {
        if (stage !== "text") return;
        const t = setTimeout(() => setStage("hold"), 280);
        return () => clearTimeout(t);
    }, [stage]);

    useEffect(() => {
        if (stage !== "hold") return;
        const t = setTimeout(() => setStage("exit"), 150);
        return () => clearTimeout(t);
    }, [stage]);

    useEffect(() => {
        if (stage !== "exit") return;
        const t = setTimeout(() => {
            setVisible(false);
            onComplete?.();
        }, 250);
        return () => clearTimeout(t);
    }, [stage, onComplete]);

    const showText = stage === "text" || stage === "hold" || stage === "exit";
    const showCheck =
        stage === "check" || stage === "text" || stage === "hold" || stage === "exit";

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="status"
                    aria-label="Loading AMS"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-50 dark:bg-black"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div
                        className="relative w-[min(38vw,170px)]"
                        style={{ aspectRatio: "1216 / 1294" }}
                    >
                        {/* icon: vector circle + tick marks + checkmark, stays as the final mark */}
                        <svg
                            viewBox="0 0 1216 1294"
                            className="absolute inset-0 h-full w-full text-foreground"
                        >
                            <defs>
                                {/* carves a circular gap where the checkmark's tail crosses the ring, so
                                    the tail reads as passing through rather than merging into it. The
                                    cutout starts fully transparent (ring reads as an unbroken sweep
                                    while it's still drawing in) and only turns opaque as the checkmark
                                    begins.
                                    The 4 clock-position marks deliberately get NO gap: they are the
                                    same currentColor as the ring and simply overlap it, so they read as
                                    part of the circle. Cutting a gap for them left a sliver of
                                    background showing on either side (the gaps were 64-70 units wide
                                    against a 44-unit mark), which looked like a dark outline around
                                    each mark.
                                    NOTE: this mask is applied to the ring circle below, which has its
                                    own transform="rotate(-90 635 457)" (needed so the draw-in animation
                                    starts at 12 o'clock). SVG applies a mask in the masked element's own
                                    local coordinate system, i.e. AFTER that rotation - so the gap here
                                    is pre-rotated +90 deg around (635,457) to land where it visually
                                    looks correct; its un-rotated position would be (892,219). */}
                                <mask id="ring-tick-gaps" maskUnits="userSpaceOnUse" x="0" y="0" width="1216" height="1294">
                                    <rect x="0" y="0" width="1216" height="1294" fill="white" />
                                    {!reduceMotion ? (
                                        <motion.circle cx="873" cy="714" r="48" fill="black" initial={{ opacity: 0 }} animate={{ opacity: showCheck ? 1 : 0 }} transition={{ duration: 0.1 }} />
                                    ) : (
                                        <circle cx="873" cy="714" r="48" fill="black" />
                                    )}
                                </mask>
                                {/* cutout of the AMS wordmark from the real artwork. Uses a pre-baked
                                    luminance mask (public/bg_logo-alpha-mask.png: the original's alpha
                                    channel painted as white-on-black) rather than masking the original
                                    PNG directly by alpha - browser support for SVG mask-type="alpha" on
                                    <mask> turned out inconsistent and rendered the letters as a uniform
                                    gray instead of a crisp cutout. Standard luminance masking against
                                    this derived asset is universally supported and pixel-exact. */}
                                <mask id="ams-text-alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1216" height="1294">
                                    <image href="/bg_logo-alpha-mask.png" x="0" y="0" width="1216" height="1294" />
                                </mask>
                            </defs>
                            <motion.circle
                                cx={635}
                                cy={457}
                                r={350}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={48}
                                strokeLinecap="round"
                                transform="rotate(-90 635 457)"
                                mask="url(#ring-tick-gaps)"
                                initial={{ pathLength: reduceMotion ? 1 : 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                onAnimationComplete={() =>
                                    setStage((s) => (s === "circle" ? "check" : s))
                                }
                            />
                            {/* clock-face marks: drawn in the same currentColor as the ring and simply
                                overlapping it (no mask gap), so they read as part of the circle.
                                Each outer endpoint sits at radius 352, not 374: strokeLinecap="round"
                                adds a semicircular cap of strokeWidth/2 (22) BEYOND the endpoint, so
                                ending at 374 actually pushed the visible edge out to 396 - the marks
                                were poking past the circumference. At 352 the cap's edge lands exactly
                                on the ring's outer edge (374). Inner ends stay at radius 230, extruding
                                well into the dial's open interior. */}
                            {!reduceMotion &&
                                [
                                    { d: "M635,105 L635,227", delay: 0.6 }, // 12 o'clock (sweep origin, lands last)
                                    { d: "M865,457 L987,457", delay: 0.15 }, // 3 o'clock
                                    { d: "M635,687 L635,809", delay: 0.3 }, // 6 o'clock
                                    { d: "M283,457 L405,457", delay: 0.45 }, // 9 o'clock
                                ].map((tick) => (
                                    <motion.path
                                        key={tick.d}
                                        d={tick.d}
                                        stroke="currentColor"
                                        strokeWidth={44}
                                        strokeLinecap="round"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1, delay: tick.delay }}
                                    />
                                ))}
                            {reduceMotion && (
                                <>
                                    <path d="M635,105 L635,227" stroke="currentColor" strokeWidth={44} strokeLinecap="round" />
                                    <path d="M865,457 L987,457" stroke="currentColor" strokeWidth={44} strokeLinecap="round" />
                                    <path d="M635,687 L635,809" stroke="currentColor" strokeWidth={44} strokeLinecap="round" />
                                    <path d="M283,457 L405,457" stroke="currentColor" strokeWidth={44} strokeLinecap="round" />
                                </>
                            )}
                            {showCheck && (
                                <motion.path
                                    d="M485,495 L605,585 L945,150"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={46}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    onAnimationComplete={() =>
                                        setStage((s) => (s === "check" ? "text" : s))
                                    }
                                />
                            )}

                            {/* AMS wordmark: a tight, pixel-exact crop of just the lettering (no
                                icon/padding bleed) via the alpha mask above, filled with currentColor
                                so it's pixel-identical to the icon in both themes, and slid up as one
                                rigid <g> so the letters translate into place instead of being wiped
                                into view. */}
                            <motion.g
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 150 }}
                                animate={
                                    showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }
                                }
                                transition={{ duration: 0.32, ease: "easeOut", delay: 0.05 }}
                            >
                                <rect
                                    {...TEXT_BOX}
                                    fill="currentColor"
                                    mask="url(#ams-text-alpha)"
                                />
                            </motion.g>
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
