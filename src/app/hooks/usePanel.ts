import { useQueryState } from 'nuqs';

export default function usePanel() {
    const [threadId, setThreadId] = useQueryState('threadid');
    const openThread = (messageId: string) => {
        setThreadId(messageId);
    }

    const closeThread = () => {
        setThreadId(null);
    }

    return { openThread, closeThread, threadId };
}