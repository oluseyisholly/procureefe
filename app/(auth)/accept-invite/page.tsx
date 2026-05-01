"use client";

import Link from "next/link";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as yup from "yup";
import { ProcureeLogo } from "@/components/icons/procuree-logo";
import { OnBoardingHeader } from "@/components/onboarding/header";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FormikInput } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/error";
import { useAcceptProcureeInviteSignupMutation } from "@/lib/api/procuree-invites";
import { useSnackbar } from "@/store/hooks/use-snackbar";

type AcceptInviteFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const acceptInviteValidationSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^\d{11}$/, "Enter a valid 11-digit phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useSnackbar();
  const acceptInviteSignupMutation = useAcceptProcureeInviteSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inviteEmail = normalizeEmail(searchParams.get("email") ?? "");
  const invitePhone = normalizePhoneNumber(searchParams.get("phone") ?? "");
  const inviteToken = searchParams.get("token")?.trim() ?? "";
  const hasInviteReference = Boolean(
    inviteToken || inviteEmail || invitePhone,
  );

  const initialValues = useMemo<AcceptInviteFormValues>(
    () => ({
      firstName: "",
      lastName: "",
      email: inviteEmail,
      phone: invitePhone,
      password: "",
      confirmPassword: "",
    }),
    [inviteEmail, invitePhone],
  );

  async function handleSubmit(
    values: AcceptInviteFormValues,
    {
      setStatus,
      setSubmitting,
    }: FormikHelpers<AcceptInviteFormValues>,
  ) {
    setStatus(undefined);

    if (!hasInviteReference) {
      setStatus(
        "This invite link is missing the required invite details. Please request a new link.",
      );
      setSubmitting(false);
      return;
    }

    try {
      const response = await acceptInviteSignupMutation.mutateAsync({
        token: inviteToken,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: normalizeEmail(values.email),
        phone: normalizePhoneNumber(values.phone),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      showSuccess(response.message || "Account created successfully.");
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "Unable to complete your signup right now.",
      );
      setStatus(errorMessage);
      showError(errorMessage, {
        title: "Signup Failed",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full items-center px-6 py-10">
      <div className="w-full space-y-8">
        <ProcureeLogo className="h-[80px]" />

        <OnBoardingHeader
          title="Accept Invitation"
          subtitle="Complete your details and create a password to join your Procuree group."
        />

        <Formik
          initialValues={initialValues}
          validationSchema={acceptInviteValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, status, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormikInput
                  name="firstName"
                  label="First Name"
                  placeholder="enter first name"
                  autoComplete="given-name"
                />

                <FormikInput
                  name="lastName"
                  label="Last Name"
                  placeholder="enter last name"
                  autoComplete="family-name"
                />
              </div>

              <FormikInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="enter email address"
                autoComplete="email"
              />

              <FormikInput
                name="phone"
                label="Phone Number"
                inputMode="numeric"
                maxLength={11}
                placeholder="08012345678"
                autoComplete="tel"
                onChange={(event) => {
                  setFieldValue(
                    "phone",
                    normalizePhoneNumber(event.target.value),
                  );
                }}
              />

              <FormikInput
                name="password"
                label="Create Password"
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                autoComplete="new-password"
                suffix={
                  <PasswordVisibilityButton
                    visible={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                }
              />

              <FormikInput
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="**********"
                autoComplete="new-password"
                suffix={
                  <PasswordVisibilityButton
                    visible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                }
              />

              {typeof status === "string" ? (
                <p className="text-sm text-red-600">{status}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !hasInviteReference ||
                  isSubmitting ||
                  acceptInviteSignupMutation.isPending
                }
              >
                {isSubmitting || acceptInviteSignupMutation.isPending
                  ? "Creating account..."
                  : "Create Account"}
              </Button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-semibold uppercase text-sky-600 hover:underline"
                >
                  Login Here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

function PasswordVisibilityButton({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <IconButton
      label={visible ? "Hide password" : "Show password"}
      onClick={onClick}
      className="inline-flex items-center justify-center text-slate-500 transition-colors hover:text-slate-700"
    >
      {visible ? <EyeIcon /> : <EyeOffIcon />}
    </IconButton>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M1.5 10s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M1.5 10s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z" />
      <circle cx="10" cy="10" r="2.5" />
      <path d="m2 2 16 16" />
    </svg>
  );
}
