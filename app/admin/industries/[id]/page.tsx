import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Industry | VeyraTech Admin" };

export default function IndustryDetailPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="industries" id={params.id} />;
}
