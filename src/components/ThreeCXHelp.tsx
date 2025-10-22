import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Phone, PhoneCall, Clock, Download, Settings, HelpCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function ThreeCXHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          3CX Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            3CX Phone System Guide
          </DialogTitle>
          <DialogDescription>
            Quick reference for using 3CX integration features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Quick Start */}
          <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">🚀 Quick Start</p>
                <p className="text-sm text-blue-800">
                  Look for green <strong>"Call"</strong> buttons next to phone numbers. Click to instantly dial!
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Key Features</h4>
            
            <div className="grid gap-3">
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <PhoneCall className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Click-to-Call</p>
                  <p className="text-sm text-green-800">
                    Click any phone number to dial instantly. 3CX Web Client opens automatically.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">Auto Call Logging</p>
                  <p className="text-sm text-purple-800">
                    All calls are automatically logged with duration and timestamp.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Call Controls</p>
                  <p className="text-sm text-blue-800">
                    Use the floating panel to mute, hold, or end calls during conversations.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Download className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Call History</p>
                  <p className="text-sm text-orange-800">
                    View complete call history and export to CSV for reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Make a Call */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">How to Make a Call</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <p className="text-sm text-gray-800">
                  <strong>Find a contact</strong> in your call list or customer database
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <p className="text-sm text-gray-800">
                  <strong>Click the green "Call" button</strong> next to their phone number
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <p className="text-sm text-gray-800">
                  <strong>3CX Web Client opens</strong> in a new window and dials automatically
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  4
                </div>
                <p className="text-sm text-gray-800">
                  <strong>Use the call panel</strong> (bottom-right) to control the call
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  5
                </div>
                <p className="text-sm text-gray-800">
                  <strong>Click "End Call"</strong> when finished - call is logged automatically
                </p>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Active Call Panel Controls</h4>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    🎤
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mute/Unmute</p>
                    <p className="text-sm text-gray-600">Control your microphone during the call</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    ⏸️
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hold/Resume</p>
                    <p className="text-sm text-gray-600">Place call on hold or resume conversation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">End Call</p>
                    <p className="text-sm text-gray-600">Hang up and automatically log call duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">💡 Pro Tips</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  <strong>Allow pop-ups</strong> in your browser for the CRM domain
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  <strong>Keep 3CX Web Client tab open</strong> for faster subsequent calls
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  <strong>Add call notes</strong> in the CRM immediately after ending calls
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  <strong>Check Call History</strong> to review past conversations and durations
                </p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">❓ Troubleshooting</h4>
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 space-y-2">
              <p className="font-medium text-amber-900">Call button not working?</p>
              <ul className="text-sm text-amber-800 space-y-1 ml-4">
                <li>• Check if 3CX integration is enabled (Admin Settings)</li>
                <li>• Verify browser allows pop-ups</li>
                <li>• Ensure 3CX Web Client URL is correct</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
          </div>

          {/* Admin Settings Link */}
          <Alert className="bg-gray-50 border-gray-200">
            <AlertDescription>
              <p className="text-sm text-gray-700">
                <strong>Need to configure 3CX?</strong> Admins can manage settings in 
                <strong> Admin Settings → 3CX Phone</strong>
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
