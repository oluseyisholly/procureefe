import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Active bulk orders",
    metric: "8 ongoing",
    description: "Groups are negotiating better rates across grains, produce, and household supplies.",
  },
  {
    title: "Interested patrons",
    metric: "142 patrons",
    description: "Shoppers subscribed to updates this week — nurture them with transparent updates.",
  },
  {
    title: "Fulfilment success",
    metric: "96% on-time",
    description: "Maintain consistency by confirming logistics partners two days before dispatch.",
  },
];

const upcoming = [
  {
    name: "Northern Grain Coalition",
    focus: "Maize + Sorghum",
    date: "Closes in 2 days",
  },
  {
    name: "Lekki Farmers Collective",
    focus: "Vegetable bundle",
    date: "Closes in 5 days",
  },
  {
    name: "Port Harcourt Household Club",
    focus: "Cleaning essentials",
    date: "Closes in 8 days",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">This week’s momentum</h1>
            <p className="text-sm text-emerald-600">
              Track how your collective is growing and where patrons are leaning in.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Invite patrons</Button>
            <Button>Launch new request</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">{item.title}</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-900">{item.metric}</p>
              <p className="mt-2 text-sm text-emerald-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-emerald-900">Upcoming group requests</h2>
          <div className="space-y-3">
            {upcoming.map((group) => (
              <div key={group.name} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">{group.name}</p>
                    <p className="text-xs text-emerald-500">{group.focus}</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{group.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-emerald-900">Quick actions</h2>
          <div className="space-y-3 text-sm text-emerald-600">
            <p className="rounded-2xl bg-emerald-50 p-4">
              Share updates to keep patrons informed about fulfilment timelines and delivery hubs.
            </p>
            <p className="rounded-2xl bg-emerald-50 p-4">
              Sync with suppliers to confirm available stock and update price bands in your offers.
            </p>
            <p className="rounded-2xl bg-emerald-50 p-4">
              Review patron feedback to identify additional items that could be bundled this month.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
