"use client";
import {
  motion,
  VariantLabels,
  Target,
  TargetAndTransition,
  Transition,
  useInView,
} from "motion/react";
import { useRef } from "react";

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
    exit: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
  };

  onAnimationComplete?: () => void;
};

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.1,
  getExitDelay = (i) => i * 0.1 + 0.2,
  className,
  transition = { ease: "easeIn" },
  variants,
  onAnimationComplete,
}: TextRollProps) {
  const defaultVariants = {
    enter: {
      initial: { rotateX: 0 },
      animate: { rotateX: 90 },
    },
    exit: {
      initial: { rotateX: 90 },
      animate: { rotateX: 0 },
    },
  } as const;

  const ref = useRef(null);

  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Split text into words and then letters
  const words = children.split(" ");

  // Track total letter count for onAnimationComplete
  const totalLetters = children.replace(/\s/g, "").length;
  let letterCounter = 0;

  return (
    <span className={className} ref={ref}>
      {words.map((word, wordIndex) => {
        const letters = word.split("");

        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap mr-[0.25em]"
          >
            {letters.map((letter, letterIndex) => {
              letterCounter++;
              const isLastLetter = letterCounter === totalLetters;

              return (
                <span
                  key={letterIndex}
                  className="relative inline-block [perspective:10000px] [transform-style:preserve-3d] [width:auto]"
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_25%]"
                    initial={
                      variants?.enter?.initial ?? defaultVariants.enter.initial
                    }
                    animate={
                      isInView
                        ? variants?.enter?.animate ??
                          defaultVariants.enter.animate
                        : variants?.enter?.initial ??
                          defaultVariants.enter.initial
                    }
                    transition={{
                      ...transition,
                      duration,
                      delay: getEnterDelay(letterCounter - 1),
                    }}
                  >
                    {letter}
                  </motion.span>
                  <motion.span
                    className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_100%]"
                    initial={
                      variants?.exit?.initial ?? defaultVariants.exit.initial
                    }
                    animate={
                      isInView
                        ? variants?.exit?.animate ??
                          defaultVariants.exit.animate
                        : variants?.exit?.initial ??
                          defaultVariants.exit.initial
                    }
                    transition={{
                      ...transition,
                      duration,
                      delay: getExitDelay(letterCounter - 1),
                    }}
                    onAnimationComplete={
                      isLastLetter ? onAnimationComplete : undefined
                    }
                  >
                    {letter}
                  </motion.span>
                  <span className="invisible">{letter}</span>
                </span>
              );
            })}
          </span>
        );
      })}
      <span className="sr-only">{children}</span>
    </span>
  );
}
