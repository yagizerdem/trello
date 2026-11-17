import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// Centered dialog with a blurred backdrop that animates in and out with GSAP.
// Rendered in a portal because the header's backdrop-filter would otherwise
// become the containing block for position: fixed.
type AnimatedPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  className?: string;
  children?: React.ReactNode;
};

export default function AnimatedPanel({
  open,
  onOpenChange,
  label,
  className,
  children,
}: AnimatedPanelProps) {
  // Stays mounted until the close animation finishes
  const [isMounted, setIsMounted] = useState(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimelineRef = useRef<gsap.core.Timeline>(null);

  if (open && !isMounted) setIsMounted(true);

  useGSAP(
    () => {
      if (!isMounted) return;

      if (open) {
        // Reopened mid-close: stop the timeline so it does not unmount the panel
        closeTimelineRef.current?.kill();

        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power1.out" },
        );
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 24, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
        );
        panelRef.current?.focus();
        return;
      }

      closeTimelineRef.current = gsap
        .timeline({ onComplete: () => setIsMounted(false) })
        .to(panelRef.current, {
          opacity: 0,
          y: 16,
          scale: 0.97,
          duration: 0.2,
          ease: "power2.in",
        })
        .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "<");
    },
    { dependencies: [open, isMounted] },
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "w-full max-w-lg rounded-2xl border bg-background/80 p-6 shadow-2xl backdrop-blur-xl outline-none",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
