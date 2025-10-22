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
      <Card className="bg-white/95 backdrop-blur-xl border-2 border-white/40 shadow-2xl w-[450px] rounded-2xl overflow-hidden">
        {/* Status Header - Full Width */}
        <div className={`${getStatusColor()} text-white px-6 py-3 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-lg font-semibold">{getStatusText()}</span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-1.5 text-lg font-mono">
                <Clock className="w-4 h-4" />
                {formatDuration(duration)}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Contact Info */}
          <div className="space-y-3">
            {activeCall.contactName && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-violet-600" />
                <span className="text-xl font-semibold text-gray-900">{activeCall.contactName}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700 bg-slate-100 p-3 rounded-lg border">
              <Phone className="w-4 h-4" />
              <span className="text-lg font-mono flex-1 select-all">{activeCall.phoneNumber}</span>
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
                className="h-8 px-2"
                title="Copy phone number"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Call Controls */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {/* Mute/Unmute */}
            <Button
              variant="outline"
              size="lg"
              onClick={isMuted ? unmuteCall : muteCall}
              disabled={!isConnected}
              className={`h-14 ${
                isMuted 
                  ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {/* Hold/Resume */}
            <Button
              variant="outline"
              size="lg"
              onClick={isOnHold ? resumeCall : holdCall}
              disabled={!isConnected}
              className={`h-14 ${
                isOnHold 
                  ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>

            {/* End Call */}
            <Button
              size="lg"
              onClick={endCall}
              className="h-14 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions Hint */}
          <div className="text-sm text-center text-gray-500 pt-2">
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
