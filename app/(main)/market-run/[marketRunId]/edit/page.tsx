"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api";
import { useMarketRunQuery } from "@/lib/api/market-runs";
import { buildMarketRunEditFlowSeed } from "@/lib/market-run/edit";
import { useMarketRunFlowStore } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EditMarketRunPage() {
  const params = useParams<{ marketRunId: string }>();
  const router = useRouter();
  const { startUpdateMarketRunFlow } = useMarketRunFlowStore();
  const marketRunId = Array.isArray(params.marketRunId)
    ? params.marketRunId[0]
    : params.marketRunId;
  const marketRunQuery = useMarketRunQuery(marketRunId ?? "", {
    enabled: Boolean(marketRunId),
  });
  const hasHydratedRef = useRef(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);

  useEffect(() => {
    if (!marketRunId || !marketRunQuery.data?.data || hasHydratedRef.current) {
      return;
    }

    let isCancelled = false;
    hasHydratedRef.current = true;

    const prepareEditFlow = async () => {
      try {
        const flowSeed = await buildMarketRunEditFlowSeed(
          marketRunQuery.data.data,
        );

        if (isCancelled) {
          return;
        }

        startUpdateMarketRunFlow({
          marketRunId,
          details: flowSeed.details,
          commodityDrafts: flowSeed.commodityDrafts,
        });
        router.replace("/market-run/details");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        hasHydratedRef.current = false;
        setPrepareError(
          getApiErrorMessage(error, "Unable to load this market run for editing."),
        );
      }
    };

    void prepareEditFlow();

    return () => {
      isCancelled = true;
    };
  }, [marketRunId, marketRunQuery.data?.data, router, startUpdateMarketRunFlow]);

  if (
    marketRunQuery.isPending ||
    (marketRunQuery.isSuccess && !prepareError && !hasHydratedRef.current)
  ) {
    return (
      <Card className="rounded-[8px] border border-[#E4E7EC] p-6 shadow-none">
        <p className="text-sm font-medium text-[#667085]">
          Loading market run for editing...
        </p>
      </Card>
    );
  }

  if (marketRunQuery.isError || prepareError) {
    return (
      <Card className="space-y-4 rounded-[8px] border border-[#E4E7EC] p-6 shadow-none">
        <p className="text-sm font-medium text-red-600">
          {prepareError ??
            getApiErrorMessage(
              marketRunQuery.error,
              "Unable to load this market run for editing.",
            )}
        </p>
        <Button type="button" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-[8px] border border-[#E4E7EC] p-6 shadow-none">
      <p className="text-sm font-medium text-[#667085]">
        Preparing market run editor...
      </p>
    </Card>
  );
}
