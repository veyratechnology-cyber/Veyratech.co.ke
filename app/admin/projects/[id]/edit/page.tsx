import RecordEditor from "@/components/admin/RecordEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Project | VeyraTech Admin" };

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return <RecordEditor resource="projects" id={params.id} />;
}
