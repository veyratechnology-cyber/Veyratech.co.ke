import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Insight | VeyraTech Admin" };

export default function InsightDetailPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="insights" id={params.id} />;
}
