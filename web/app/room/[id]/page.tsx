import { RoomEditor } from "@/components/room/RoomEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  return <RoomEditor roomId={id} />;
}
