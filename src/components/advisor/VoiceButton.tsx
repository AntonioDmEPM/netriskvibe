import { useState, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

interface VoiceButtonProps {
  onTranscript?: (text: string, isAgent: boolean) => void;
}

const VoiceButton = ({ onTranscript }: VoiceButtonProps) => {
  const { lang } = useI18n();
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice agent connected");
    },
    onDisconnect: () => {
      console.log("Voice agent disconnected");
    },
    onMessage: (message: any) => {
      if (message?.type === "user_transcript" && onTranscript) {
        const transcript = message?.user_transcription_event?.user_transcript;
        if (transcript) onTranscript(transcript, false);
      }
      if (message?.type === "agent_response" && onTranscript) {
        const response = message?.agent_response_event?.agent_response;
        if (response) onTranscript(response, true);
      }
    },
    onError: (error) => {
      console.error("Voice error:", error);
    },
  });

  const isActive = conversation.status === "connected";

  const toggleVoice = useCallback(async () => {
    if (isActive) {
      await conversation.endSession();
      return;
    }

    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token"
      );

      if (error || !data?.signed_url) {
        throw new Error("Failed to get voice session token");
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (err) {
      console.error("Failed to start voice:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, isActive]);

  return (
    <button
      onClick={toggleVoice}
      disabled={isConnecting}
      className={`p-2.5 rounded-xl transition-all ${
        isActive
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : "bg-accent text-accent-foreground hover:opacity-90"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
      title={
        isActive
          ? lang === "hu" ? "Hang kikapcsolása" : "Stop voice"
          : lang === "hu" ? "Beszéljen a tanácsadóval" : "Talk to advisor"
      }
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isActive ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};

export default VoiceButton;
