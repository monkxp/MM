import useChannelId from "@/app/hooks/useChannelId";
import useChannelMessageChange from "@/features/channels/api/useChannelMessageChange";
import useGetChannelMessage from "@/features/channels/api/useGetChannelMessage";
export default function MessageList() {
  const channelId = useChannelId();
  const { data, isError, isPending } = useGetChannelMessage(channelId);
  useChannelMessageChange();
  console.log("messages data: ", data);
  return <div className="overflow-y-auto">{JSON.stringify(data?.data)}</div>;
}
