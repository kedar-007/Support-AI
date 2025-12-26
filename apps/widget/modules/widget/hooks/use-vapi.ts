import Vapi from "@vapi-ai/web";
import { error } from "console";
import { useEffect,useState } from "react";


interface TranscriptMessage{
    role:"user"| "assistant";
    text:string
}


export const useVapi = () =>{
    const [vapi,setVapi] = useState<Vapi | null>(null);
    const [isConnected,setIsConnected] = useState(false);
    const [isConnecting,setIsConnecting] = useState(false);
    const [isSpeaking,setIsSpeaking] = useState(false);
    const [transcript,setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() =>{
        //Only for the testing the vapi api otherwise customer will provide there own api keys
        const vapiInstance = new Vapi("");
        setVapi(vapiInstance);
        vapiInstance.on("call-start",() =>{
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        });
        vapiInstance.on("call-end",() =>{
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapiInstance.on("speech-start",() =>{
            setIsSpeaking(true);
        })

        vapiInstance.on("call-end",() =>{
            setIsSpeaking(false);
        })

        vapiInstance.on("error",(error) =>{
            console.log(error,"VAPI ERROR");
            setIsConnecting(false);
        });
        vapiInstance.on("message",(message) =>{
            if(message.type === "transcript" && message.transcriptType === "final"){
                setTranscript((prev) => [
                    ...prev,
                    {
                        role:message.role === "user" ? "user" : "assistant",
                        text:message.transcript,
                    }
                ])
            }

        });
        return () =>{
            vapiInstance?.stop();
        }
        
    },[]);

    const startCall = () =>{
        setIsConnected(true);

        if(vapi){
            //Only for the testing the vapi api otherwise customer will provide there own api keys
            vapi.start("");
        }
    };

    const endCall = () =>{
        if(vapi){
            vapi.stop();
        }
    };

    return {
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall
    }
};