import NoteViewClient from "./NoteViewClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteViewClient id={id} />;
}