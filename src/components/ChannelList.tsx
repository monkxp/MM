"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Channel {
  id: string;
  name: string;
  created_at: string;
}

interface ChannelListProps {
  onSelectChannel: (channelId: string) => void;
  selectedChannelId: string | null;
}

const ChannelList: React.FC<ChannelListProps> = ({
  onSelectChannel,
  selectedChannelId,
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const { user } = useAuth() as AuthContextType;

  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching channels", error);
      } else {
        setChannels(data as Channel[]);
      }
    };
    fetchChannels();

    const channelSubscription = supabase
      .channel("public:channels")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prevChannels) => [
            ...prevChannels,
            payload.new as Channel,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, []);

  const createChannel = async () => {
    if (newChannelName.trim() !== "") {
      const { error } = await supabase
        .from("channels")
        .insert([{ name: newChannelName }]);
      if (error) {
        console.error("Error creating channel", error);
      }
      setNewChannelName("");
      setShowModal(false);
    }
  };

  return (
    <Card className="h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Channels</h2>
        {user && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Create Channel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Channel</DialogTitle>
                <div className="mt-2">
                  <Label htmlFor="newChannel">Channel Name</Label>
                  <Input
                    id="newChannel"
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <Button className="mt-4 w-full" onClick={createChannel}>
                    Create
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <ScrollArea className="flex-grow">
        <ul className="space-y-2">
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={`p-2 rounded-md cursor-pointer hover:bg-muted ${
                selectedChannelId === channel.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectChannel(channel.id)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  );
};

export default ChannelList;
