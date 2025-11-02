import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useThreeCX } from "./ThreeCXContext";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  User,
  Clock,
  Mail,
  Building2,
  FileText,
  Briefcase,
  Copy
} from "lucide-react";
import { useEffect, useState } from "react";

export function ActiveCallPanel() {
  const { 
    activeCall, 
    endCall, 
    holdCall, 
    resumeCall, 
    muteCall, 
    unmuteCall,
    isConnected,
    isMuted,
    isOnHold
  } = useThreeCX();

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!activeCall || !isConnected) {
      setDuration(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeCall.startTime.getTime()) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall, isConnected]);

  if (!activeCall) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (activeCall.status) {
      case "ringing":
        return "bg-gradient-to-br from-yellow-500 to-orange-500";
      case "connected":
        return "bg-gradient-to-br from-green-500 to-emerald-500";
      case "on-hold":
        return "bg-gradient-to-br from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  const getStatusText = () => {
    switch (activeCall.status) {
      case "ringing":
        return "Calling...";
      case "connected":
        return "Connected";
      case "on-hold":
        return "On Hold";
      default:
        return "Call Active";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 animate-in slide-in-from-bottom-5" style={{ zIndex: 10000 }}>
      <Card className="bg-white/95 backdrop-blur-xl border-2 border-white/40 shadow-2xl w-[360px] rounded-xl overflow-hidden">
        {/* Status Header - Full Width */}
        <div className={`${getStatusColor()} text-white px-4 py-2.5 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">{getStatusText()}</span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(duration)}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Contact Info */}
          <div className="space-y-2">
            {activeCall.contactName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" />
                <span className="font-semibold text-gray-900">{activeCall.contactName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700 bg-slate-100 p-2 rounded-lg border">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-mono flex-1 select-all text-sm">{activeCall.phoneNumber}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(activeCall.phoneNumber);
                    // Use a simple alert instead of toast to avoid conflicts
                    const btn = document.activeElement as HTMLButtonElement;
                    if (btn) {
                      const originalText = btn.innerHTML;
                      btn.innerHTML = '✓ Copied';
                      setTimeout(() => {
                        btn.innerHTML = originalText;
                      }, 2000);
                    }
                  } catch (err) {
                    console.error("Copy failed", err);
                  }
                }}
                className="h-7 px-2"
                title="Copy phone number"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Call Controls */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Mute/Unmute */}
            <Button
              variant="outline"
              size="sm"
              onClick={isMuted ? unmuteCall : muteCall}
              disabled={!isConnected}
              className={`h-12 ${
                isMuted 
                  ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            {/* Hold/Resume */}
            <Button
              variant="outline"
              size="sm"
              onClick={isOnHold ? resumeCall : holdCall}
              disabled={!isConnected}
              className={`h-12 ${
                isOnHold 
                  ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>

            {/* End Call */}
            <Button
              size="sm"
              onClick={endCall}
              className="h-12 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions Hint */}
          <div className="text-xs text-center text-gray-500 pt-1">
            {isConnected ? (
              <span>Call in progress - Don't forget to log call notes</span>
            ) : (
              <span>Connecting to {activeCall.phoneNumber}...</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
