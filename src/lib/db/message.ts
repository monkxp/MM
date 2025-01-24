import { createClient } from "../supabase/client";
import { genUUIDv4, sanitizeS3Key } from "../utils";

const supabase = createClient();

export const createMessage = async (
  channelId: string,
  userId: string,
  content: string,
  parentId?: string,
) => {
  
  const contentObj = JSON.parse(content as string);
  if (contentObj.attachments) {
    for (const attachment of contentObj.attachments) {
      if (attachment) {
        const { error } = await supabase.storage
          .from("slack_clone")
          .move(
            attachment.path,
            attachment.path.replace("unused/", "messages/"),
          );
        if (error) {
          throw new Error(error.message);
        }
        attachment.path = attachment.path.replace("unused/", "messages/");
        attachment.publicUrl = attachment.publicUrl.replace(
          "unused/",
          "messages/",
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: userId,
      content: JSON.stringify(contentObj),
      parent_id: parentId,
    })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const uploadFile = async (file: File) => {
  const filePath = `unused/${genUUIDv4()}.${sanitizeS3Key(file?.name)}`;
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data: fileData } = await supabase.storage
    .from("slack_clone")
    .getPublicUrl(data?.path);

  return { ...fileData, ...data };
};

export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const moveFile = async (path: string, newPath: string) => {
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .move(path, newPath);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getChannelMessages = async (channelId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .is("parent_id", null)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: [], error };
  }
  let threadCount = [];
  for(const message of data){
    const res = await getThreadMessages(message.id);
    threadCount.push({id: message.id, count: res?.count || 0});
  }
  return { data, error, threadCount };
};

export const updateMessage = async (messageId: string, content: string) => {
  const { data, error } = await supabase
    .from("messages")
    .update({ content, is_edited: true })
    .eq("id", messageId)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteMessage = async (messageId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }

  const content = JSON.parse(data?.[0]?.content as string);
  if (content.attachments) {
    for (const attachment of content.attachments) {
      await deleteFile(attachment.path);
    }
  }

  const { data: deletedData, error: deletedError } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (deletedError) {
    throw new Error(deletedError.message);
  }

  return deletedData;
};

export const addEmojiToMessage = async (
  messageId: string,
  workspaceId: string,
  userId: string,
  emoji: string,
) => {
  if(!userId){
    throw new Error("Unauthorized");
  }

  const {data} = await supabase
  .from("workspace_members")
  .select("*")
  .eq("workspace_id", workspaceId)
  .eq("user_id", userId);

  if(!data){
    throw new Error("Unauthorized");
  } 

  const {data: messageData} = await supabase.from("messages").select("*").eq("id", messageId);

  if(!messageData){
    throw new Error("Message not found");
  }
  const {data: emojiData} = await supabase
  .from("reactions")
  .select("*")
  .eq("message_id", messageId)
  .eq("reaction", emoji)
  .eq("user_id", userId);
  let reactionData = null;
  if(emojiData && emojiData.length > 0){
    await supabase.from("reactions").delete().eq("id", emojiData[0].id);
  }else {
    const {data: newEmojiData} =  await supabase
    .from("reactions")
    .insert({message_id: messageId, reaction: emoji, user_id: userId})
    .select("*");
    reactionData = newEmojiData;
  }
  return reactionData;
};

export const getEmojis = async (messageId: string) => {
  const {data, error} = await supabase.from("reactions").select("*").eq("message_id", messageId);
  if(error){
    throw new Error(error.message);
  }
  return data;
};

export const getMessageById = async (messageId: string) => {
  if(!messageId){
    return null;
  }
   const currentUser = await supabase.auth.getUser();
   if(!currentUser.data.user){
     return null;
   }

  const {data, error} = await supabase.from("messages").select("*").eq("id", messageId);
  if(error){
    return null;
  }
  return data;
};

export const getThreadMessages = async (messageId: string) => {
  if(!messageId){
    return null;
  }
   const currentUser = await supabase.auth.getUser();
   if(!currentUser.data.user){
     return null;
   }

  const {data, error, count} = await supabase.from("messages").select("*",{count: "exact"}).eq("parent_id", messageId);
  if(error){
    return null;
  }


  return {data, count};
};