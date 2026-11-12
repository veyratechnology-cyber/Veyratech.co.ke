import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Proposal | VeyraTech Admin" };

export default function EditProposalPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="proposals" id={params.id} />;
}
