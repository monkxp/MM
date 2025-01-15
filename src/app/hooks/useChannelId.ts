import { useParams } from "next/navigation";

export default function useChannelId() {
  const params = useParams();
  const { channelId } = params;
  return channelId as string;
}
