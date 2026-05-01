"use client";

import { getApiErrorMessage } from "@/lib/api/error";
import {
  getProcureeInvitePreview,
  useCreateProcureeInviteMutation,
} from "@/lib/api/procuree-invites";
import { Button } from "@/components/ui/button";
import { FormikInput, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Form,
  Formik,
  type FormikHelpers,
  useFormikContext,
} from "formik";
import { useEffect, useState, type SetStateAction } from "react";
import * as yup from "yup";

type InviteFormValues = {
  phoneNumber: string;
};

const inviteInitialValues: InviteFormValues = {
  phoneNumber: "",
};

const inviteValidationSchema = yup.object({
  phoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Enter a valid 11-digit phone number"),
});

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function isPreviewReadyPhoneNumber(value: string) {
  return /^\d{11}$/.test(value);
}

function CopyInviteButton({
  inviteLink,
}: {
  inviteLink: string;
}) {
  const [copyLabel, setCopyLabel] = useState("Copy");

  useEffect(() => {
    setCopyLabel("Copy");
  }, [inviteLink]);

  async function handleCopyInviteLink() {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1500);
    } catch {
      setCopyLabel("Copy");
    }
  }

  return (
    <Button
      type="button"
      color="blue"
      size="sm"
      onClick={handleCopyInviteLink}
      className={cn("h-9 rounded-[10px] text-sm font-semibold")}
    >
      <span className="inline-flex items-center gap-1.5">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.625 2.25H10.95C12.6302 2.25 13.4702 2.25 14.112 2.57698C14.6765 2.8646 15.1354 3.32354 15.423 3.88803C15.75 4.52976 15.75 5.36984 15.75 7.05V12.375M4.65 15.75H10.725C11.5651 15.75 11.9851 15.75 12.306 15.5865C12.5882 15.4427 12.8177 15.2132 12.9615 14.931C13.125 14.6101 13.125 14.1901 13.125 13.35V7.275C13.125 6.43492 13.125 6.01488 12.9615 5.69401C12.8177 5.41177 12.5882 5.1823 12.306 5.03849C11.9851 4.875 11.5651 4.875 10.725 4.875H4.65C3.80992 4.875 3.38988 4.875 3.06901 5.03849C2.78677 5.1823 2.5573 5.41177 2.41349 5.69401C2.25 6.01488 2.25 6.43492 2.25 7.275V13.35C2.25 14.1901 2.25 14.6101 2.41349 14.931C2.5573 15.2132 2.78677 15.4427 3.06901 15.5865C3.38988 15.75 3.80992 15.75 4.65 15.75Z"
            stroke="white"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {copyLabel}
      </span>
    </Button>
  );
}

function InviteFormContent() {
  const [inviteLink, setInviteLink] = useState("");
  const [previewErrorMessage, setPreviewErrorMessage] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const {
    values,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldTouched,
    setFieldError,
  } = useFormikContext<InviteFormValues>();
  const createProcureeInviteMutation = useCreateProcureeInviteMutation();
  const normalizedPhoneNumber = normalizePhoneNumber(values.phoneNumber);
  const canGenerateInviteLink =
    isPreviewReadyPhoneNumber(normalizedPhoneNumber);
  const isGenerateLinkLoading =
    createProcureeInviteMutation.isPending || isPreviewLoading;
  const shouldShowLinkSection =
    isGenerateLinkLoading || Boolean(inviteLink) || Boolean(previewErrorMessage);

  async function handleGenerateLink() {
    if (!canGenerateInviteLink) {
      setFieldTouched("phoneNumber", true, false);
      setFieldError("phoneNumber", "Enter a valid 11-digit phone number");
      return;
    }

    setPreviewErrorMessage("");
    setInviteLink("");
    setIsPreviewLoading(true);

    try {
      const createInviteResponse = await createProcureeInviteMutation.mutateAsync({
        phone: normalizedPhoneNumber,
      });

      let nextInviteLink = createInviteResponse.data?.inviteLink ?? "";

      try {
        const previewResponse = await getProcureeInvitePreview({
          phone: normalizedPhoneNumber,
        });
        nextInviteLink =
          nextInviteLink || previewResponse.data?.inviteLink || "";
      } catch (previewError) {
        if (!nextInviteLink) {
          throw previewError;
        }
      }

      if (!nextInviteLink) {
        setPreviewErrorMessage(
          "Invite link could not be generated right now. Please try again.",
        );
        return;
      }

      setInviteLink(nextInviteLink);
    } catch (error) {
      setPreviewErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to generate the invite link right now.",
        ),
      );
    } finally {
      setIsPreviewLoading(false);
    }
  }

  return (
    <Form className="space-y-5">
      <FormikInput
        name="phoneNumber"
        label="Enter Phone Number"
        inputMode="numeric"
        maxLength={11}
        autoComplete="tel-national"
        placeholder="08012345678"
        helperText="Enter the member's 11-digit phone number to generate the invite link."
        onChange={(event) => {
          const nextPhoneNumber = normalizePhoneNumber(event.target.value);

          if (nextPhoneNumber !== normalizedPhoneNumber) {
            setInviteLink("");
            setPreviewErrorMessage("");
          }

          setFieldValue("phoneNumber", nextPhoneNumber);
        }}
        className="h-[40px] rounded-[8px] border-[#D1D5DB] focus-within:border-[#B4BBC6] focus-within:ring-[#E5E7EB]"
        suffix_1={
          <Button
            type="button"
            color="blue"
            size="sm"
            onClick={handleGenerateLink}
            disabled={
              !canGenerateInviteLink || isGenerateLinkLoading || isSubmitting
            }
            className="h-[40px] min-w-[132px] rounded-[8px] px-4"
          >
            {isGenerateLinkLoading ? "Generating..." : "Generate Link"}
          </Button>
        }
      />

      <Button
        type="submit"
        disabled={!isValid || isSubmitting || isGenerateLinkLoading || !inviteLink}
        className="h-[54px] w-full rounded-[10px] text-base font-semibold"
      >
        {isSubmitting ? "Sending..." : "Send Invitation"}
      </Button>

      {shouldShowLinkSection ? (
        <>
          <div className="flex items-center gap-4 py-3">
            <span className="h-px flex-1 bg-[#C5CDD8]" />
            <span className="text-sm font-semibold uppercase text-[#9CA3AF]">
              or
            </span>
            <span className="h-px flex-1 bg-[#C5CDD8]" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#9CA3AF]">
              Copy Link below
            </p>

            {isGenerateLinkLoading ? (
              <div className="rounded-[10px] border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#667085]">
                Generating invite link...
              </div>
            ) : previewErrorMessage ? (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {previewErrorMessage}
              </div>
            ) : inviteLink ? (
              <Input
                readOnly
                value={inviteLink}
                className="border-[#D1D5DB] bg-white p-[10px]"
                suffix={<CopyInviteButton inviteLink={inviteLink} />}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </Form>
  );
}

export function Invite({
  setIsInviteModalOpen,
}: {
  setIsInviteModalOpen: (value: SetStateAction<boolean>) => void;
}) {
  function handleSendInviteSubmit(
    _values: InviteFormValues,
    { setSubmitting, resetForm }: FormikHelpers<InviteFormValues>,
  ) {
    setSubmitting(false);
    resetForm();
    setIsInviteModalOpen(false);
  }

  return (
    <Formik
      initialValues={inviteInitialValues}
      validationSchema={inviteValidationSchema}
      onSubmit={handleSendInviteSubmit}
      validateOnMount
    >
      <InviteFormContent />
    </Formik>
  );
}
