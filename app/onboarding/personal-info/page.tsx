"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useMemo } from "react";
import { OnBoardingHeader } from "@/components/onboarding/header";
import { Button } from "@/components/ui/button";
import { FormikInput } from "@/components/ui/input";
import PhonePrefix from "@/components/ui/phonePrefix";
import { getApiErrorMessage } from "@/lib/api";
import { useCheckPhoneUniqueMutation } from "@/lib/api/users";
import { useOnboardingFlowStore } from "@/store";

type PersonalInfoFormValues = {
  fullName: string;
  phoneNumber: string;
  // contactAddress: string;
  // profilePicture: File | null;
};

const personalInfoValidationSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .test(
      "full-name-two-words",
      "Enter first name and last name",
      (value) => (value?.trim().split(/\s+/).length ?? 0) >= 2,
    ),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("phone-format", "Enter a valid phone number", (value) => {
      const digits = (value ?? "").replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 11;
    }),
  // contactAddress: yup.string().trim().required("Contact address is required"),
  // profilePicture: yup
  //   .mixed<File>()
  //   .nullable()
  //   .required("Please upload your picture")
  //   .test("file-type", "Only JPEG and PNG files are allowed", (value) => {
  //     if (!value) {
  //       return true;
  //     }
  //
  //     return ["image/jpeg", "image/png"].includes(value.type);
  //   }),
});

export default function PersonalInfoPage() {
  const router = useRouter();
  const checkPhoneUniqueMutation = useCheckPhoneUniqueMutation();
  const { onboardingDraft, setOnboardingDraft } = useOnboardingFlowStore();
  const initialValues = useMemo<PersonalInfoFormValues>(
    () => ({
      fullName: onboardingDraft.fullName,
      phoneNumber: onboardingDraft.phoneNumber,
      // contactAddress: onboardingDraft.contactAddress,
      // profilePicture: null,
    }),
    [onboardingDraft.fullName, onboardingDraft.phoneNumber],
  );

  async function handleSubmit(
    values: PersonalInfoFormValues,
    {
      setFieldError,
      setStatus,
      setSubmitting,
    }: FormikHelpers<PersonalInfoFormValues>,
  ) {
    setStatus(undefined);

    const normalizedPhone = values.phoneNumber.replace(/\D/g, "").trim();

    try {
      const phoneCheckResponse =
        await checkPhoneUniqueMutation.mutateAsync(normalizedPhone);

      if (!phoneCheckResponse.data.isUnique) {
        setFieldError(
          "phoneNumber",
          "This phone number is already in use. Try another number.",
        );
        return;
      }

      setOnboardingDraft({
        fullName: values.fullName.trim(),
        phoneNumber: normalizedPhone,
        // contactAddress: values.contactAddress.trim(),
      });
      router.push("/onboarding/business-info");
    } catch (error) {
      setStatus(
        getApiErrorMessage(
          error,
          "We could not verify this phone number right now. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 py-[20px]">
      <OnBoardingHeader
        icon="/personalInfo.svg"
        title="Tell us about yourself"
        subtitle="We need a few details to personalize your experience and set up your admin profile."
      />

      <Formik
        initialValues={initialValues}
        validationSchema={personalInfoValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          setFieldValue,
          status,
        }) => {
          return (
            <Form className="space-y-4">
              <FormikInput
                name="fullName"
                label="Full name"
                placeholder="enter full name"
                autoComplete="name"
              />

              <FormikInput
                name="phoneNumber"
                label="Phone Number"
                placeholder="8123456789"
                autoComplete="tel-national"
                prefix={<PhonePrefix />}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/\D/g, "");
                  setFieldValue("phoneNumber", nextValue);
                }}
              />

              {/* <FormikInput
                name="contactAddress"
                label="Contact Address"
                placeholder="enter contact Address"
                autoComplete="street-address"
              /> */}

              {/* Image upload intentionally disabled: /user/admin does not require it yet.
              <FormikImageUploadInput
                name="profilePicture"
                label="Provide your Picture"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              /> */}

              {typeof status === "string" ? (
                <p className="text-sm text-red-600">{status}</p>
              ) : null}

              <div className="pt-7">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Processing..."
                    : "Next : Business Information"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
