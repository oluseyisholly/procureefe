"use client";

import { CalenderIcon } from "@/components/icons/calender";
import { MarketRunHeader } from "@/components/marketRun/header-marketrun";
import { Button } from "@/components/ui/button";
import { FormikInput } from "@/components/ui/input";
import { Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useMarketRunFlowStore } from "@/store";
import * as yup from "yup";

type MarketRunDetailsFormValues = {
  description: string;
  bookingEndDate: string;
  marketRunDate: string;
};

function parseISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

const detailsValidationSchema = yup.object({
  description: yup.string().trim().required("Description is required"),
  bookingEndDate: yup
    .string()
    .required("Booking end date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Select a valid booking end date")
    .test("valid-booking-date", "Enter a valid booking end date", (value) => {
      if (!value) {
        return false;
      }
      return Boolean(parseISODate(value));
    }),
  marketRunDate: yup
    .string()
    .required("Market run date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Select a valid market run date")
    .test("valid-market-date", "Enter a valid market run date", (value) => {
      if (!value) {
        return false;
      }
      return Boolean(parseISODate(value));
    })
    .test(
      "market-run-after-booking-end",
      "Market run date must be on or after booking end date",
      function (value) {
        const bookingEndDate = this.parent.bookingEndDate as string;
        if (!value || !bookingEndDate) {
          return true;
        }

        const bookingDate = parseISODate(bookingEndDate);
        const marketDate = parseISODate(value);

        if (!bookingDate || !marketDate) {
          return true;
        }

        return marketDate >= bookingDate;
      },
    ),
});

export default function DashboardPage() {
  const router = useRouter();
  const { marketRunDetailsDraft, setMarketRunDetailsDraft } =
    useMarketRunFlowStore();
  const initialValues = useMemo<MarketRunDetailsFormValues>(
    () => ({
      description: marketRunDetailsDraft.description,
      bookingEndDate: marketRunDetailsDraft.bookingEndDate,
      marketRunDate: marketRunDetailsDraft.marketRunDate,
    }),
    [marketRunDetailsDraft],
  );

  function handleSubmit(
    values: MarketRunDetailsFormValues,
    { setSubmitting }: FormikHelpers<MarketRunDetailsFormValues>,
  ) {
    setMarketRunDetailsDraft({
      description: values.description.trim(),
      bookingEndDate: values.bookingEndDate,
      marketRunDate: values.marketRunDate,
    });
    setSubmitting(false);
    router.push("/market-run/item");
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-[540px]">
        <MarketRunHeader
          title="Market Run details"
          subtitle="Enter details of your market runs"
        />
      </div>

      <div className="w-full max-w-[540px]">
        <Formik
          initialValues={initialValues}
          validationSchema={detailsValidationSchema}
          onSubmit={handleSubmit}
          validateOnMount
          enableReinitialize
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-4">
              <FormikInput
                name="description"
                label="Description"
                placeholder="Enter market run description"
              />

              <FormikInput
                name="bookingEndDate"
                label="Booking End Date"
                type="date"
                suffix={<CalenderIcon className="h-4 w-4" />}
              />

              <FormikInput
                name="marketRunDate"
                label="Market Run Date"
                type="date"
                suffix={<CalenderIcon className="h-4 w-4" />}
              />

              <div className="pt-6">
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-end gap-5">
                    <Button
                      type="button"
                      color="slate"
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Next : Items"}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
