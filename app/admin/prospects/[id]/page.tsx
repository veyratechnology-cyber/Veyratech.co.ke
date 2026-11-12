import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prospect | VeyraTech Admin" };

export default function ProspectDetailPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="prospects" id={params.id} />;
}
