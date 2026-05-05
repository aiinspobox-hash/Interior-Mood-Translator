import { RoomEditor } from "@/components/room/RoomEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

/**
 * GitHub Pages 靜態匯出時不產生 room 動態頁，
 * 以避免 export 模式要求預先列舉所有 id。
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  return [];
}

export const dynamicParams = false;

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  return <RoomEditor roomId={id} />;
}
