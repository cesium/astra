import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import getSocket from "./socket";


export default function useSubscribeToExchanges() {
    const queryClient = useQueryClient();
    useEffect(() => {

        const socket = getSocket();
        // ALL THAT REFERRING TO LANGUAGE WILL CHANGED FOR THE EXCHANGE CHANNALS AND TOPICS
        socket.subscribeToTopic("language:lobby", {}, {
            lang: (payload) => {
                const queryKey = ["exchanges", payload?.user_id].filter(Boolean)
                queryClient.setQueryData(queryKey, {"language": payload?.language});
                queryClient.invalidateQueries({ queryKey });
            }
        });

        return () => {
            socket.unsubscribeToTopic("language:lobby");
        };
    }, [queryClient]);

}