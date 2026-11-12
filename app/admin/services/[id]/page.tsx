import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service | VeyraTech Admin" };

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="services" id={params.id} />;
}
