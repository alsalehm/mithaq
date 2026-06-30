type TimelineEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  created_at: string;
};

type CustomerTimelineProps = {
  timeline: TimelineEvent[];
};

export default function CustomerTimeline({ timeline }: CustomerTimelineProps) {
  function eventIcon(type: string) {
    if (type === "customer_created") return "👤";
    if (type === "contract_created") return "📄";
    if (type === "invoice_created") return "🧾";
    if (type === "payment_received") return "💵";
    if (type === "note_added") return "📝";
    return "📌";
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
        سجل نشاط العميل
      </h2>

      {timeline.length === 0 ? (
        <p className="text-gray-500">لا يوجد نشاط مسجل حتى الآن.</p>
      ) : (
        <div className="space-y-4">
          {timeline.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[#B59676]/30 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{eventIcon(event.event_type)}</span>
                <h3 className="font-bold">{event.title}</h3>
              </div>

              {event.description && (
                <p className="mb-2 whitespace-pre-wrap text-sm text-gray-600">
                  {event.description}
                </p>
              )}

              <p className="text-xs text-gray-500">
                {new Date(event.created_at).toLocaleString("ar-SA")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}