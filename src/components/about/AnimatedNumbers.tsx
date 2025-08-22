'use client'
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export const AnimatedNumbers = ({
    value,
    className,
}: {
    value: number;
    className?: string;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 3000 });
    const isInView = useInView(ref, { once: false });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        } else {
            motionValue.set(0);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(0);
            }
        });
        springValue.on("animationComplete", () => {
            if (ref.current) {
                ref.current.textContent = value.toString();
            }
        });
    }, [springValue, value]);

    return <span className={className} ref={ref} />;
};