"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export type StepperStep = {
  id?: string;
  label: string;
  href?: string;
};

export type StepperProps = {
  steps: Array<StepperStep | string>;
  currentStep: number;
  className?: string;
  ariaLabel?: string;
  onStepClick?: (step: StepperStep, index: number) => void;
};

function normalizeSteps(steps: Array<StepperStep | string>): StepperStep[] {
  return steps.map((step, index) =>
    typeof step === "string" ? { id: `step-${index + 1}`, label: step } : step
  );
}

function formatStepNumber(stepNumber: number): string {
  return stepNumber < 10 ? `0${stepNumber}` : String(stepNumber);
}

function StepDoneIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 6.2 4.7 8.4 9.5 3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stepper({
  steps,
  currentStep,
  className,
  ariaLabel = "Progress",
  onStepClick,
}: StepperProps) {
  const normalizedSteps = normalizeSteps(steps);
  const totalSteps = normalizedSteps.length;
  const safeCurrentStep =
    totalSteps === 0 ? 0 : Math.max(1, Math.min(currentStep, totalSteps));

  if (!totalSteps) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ol className="flex items-start">
        {normalizedSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < safeCurrentStep;
          const isActive = stepNumber === safeCurrentStep;
          const isLast = index === totalSteps - 1;
          const isClickable = isCompleted || isActive;
          const key = step.id ?? `step-${stepNumber}`;
          const wrapperClassName = cn(
            "flex flex-col",
            isClickable ? "cursor-pointer" : "cursor-default",
          );

          const stepContent = (
            <>
              <div className="flex items-center">
                <span
                  className={cn(
                    "inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isCompleted && "border-[#2E7DAF] bg-[#2E7DAF] text-white",
                    isActive && "border-[#2E7DAF] bg-white text-[#2E7DAF]",
                    !isCompleted && !isActive && "border-[#B8C2CC] bg-white text-[#6B7785]"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? <StepDoneIcon /> : formatStepNumber(stepNumber)}
                </span>

                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mx-2 w-[32px]  h-0 flex-1  border-t-[4px] border-dotted",
                      stepNumber < safeCurrentStep
                        ? "border-[#2E7DAF]"
                        : "border-[#B8C2CC]"
                    )}
                  />
                ) : null}
              </div>

              <span
                className={cn(
                  "mt-2 inline-flex w-[32px] justify-center whitespace-nowrap text-sm font-medium",
                  isActive || isCompleted ? "text-[#2E7DAF]" : "text-[#4B5563]"
                )}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <li key={key} className={cn("flex flex-col", isLast ? "w-fit" : "flex-1")}>
              {isClickable && step.href ? (
                <Link href={step.href} className={wrapperClassName}>
                  {stepContent}
                </Link>
              ) : isClickable && onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(step, index)}
                  className={wrapperClassName}
                >
                  {stepContent}
                </button>
              ) : (
                <div className={wrapperClassName}>{stepContent}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
