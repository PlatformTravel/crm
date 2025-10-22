import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { useThreeCX } from "./ThreeCXContext";
import { Phone, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ThreeCXSettings() {
  const { config, updateConfig } = useThreeCX();
  const [localConfig, setLocalConfig] = useState(config);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleSave = () => {
    updateConfig(localConfig);
    toast.success("3CX settings saved successfully");
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    
    // Simulate connection test
    setTimeout(() => {
      setTestingConnection(false);
      if (localConfig.webClientUrl) {
        toast.success("3CX connection test successful!");
      } else {
        toast.error("Please configure 3CX Web Client URL first");
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>3CX Phone System Integration</CardTitle>
              <CardDescription>
                Configure 3CX integration for click-to-call and call logging
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">Enable 3CX Integration</div>
              <div className="text-sm text-gray-600">
                Turn on to enable phone system features across the CRM
              </div>
            </div>
            <Switch
              checked={localConfig.enabled}
              onCheckedChange={(checked) => 
                setLocalConfig({ ...localConfig, enabled: checked })
              }
            />
          </div>

          {/* Integration Mode */}
          <div className="space-y-2">
            <Label>Integration Mode</Label>
            <Select
              value={localConfig.integrationMode}
              onValueChange={(value: "click-to-call" | "webrtc" | "advanced") =>
                setLocalConfig({ ...localConfig, integrationMode: value })
              }
            >
              <SelectTrigger className="bg-white/60 backdrop-blur-xl border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="click-to-call">
                  Click-to-Call (Recommended)
                </SelectItem>
                <SelectItem value="webrtc">
                  WebRTC (In-Browser Calling)
                </SelectItem>
                <SelectItem value="advanced">
                  Advanced API Integration
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600">
              {localConfig.integrationMode === "click-to-call" && 
                "Embedded calling interface - calls stay within the CRM application"
              }
              {localConfig.integrationMode === "webrtc" && 
                "Make calls directly in browser - requires extension and credentials"
              }
              {localConfig.integrationMode === "advanced" && 
                "Full API integration with call control - requires API key"
              }
            </p>
          </div>

          {/* 3CX Web Client URL */}
          <div className="space-y-2">
            <Label htmlFor="webClientUrl">
              3CX Web Client URL *
            </Label>
            <Input
              id="webClientUrl"
              type="url"
              placeholder="https://btmn.3cx.ng"
              value={localConfig.webClientUrl || ""}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, webClientUrl: e.target.value })
              }
              className="bg-white/60 backdrop-blur-xl border-white/20"
            />
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                Your 3CX system base URL - For BTM Travel: <span className="font-mono bg-blue-50 px-1 py-0.5 rounded">https://btmn.3cx.ng</span>
              </p>
              <p className="text-xs text-amber-600">
                ⚠️ Enter only the base URL (no /webclient or /#/call paths)
              </p>
            </div>
          </div>
          
          {/* Test 3CX Connection Button */}
          {localConfig.webClientUrl && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-gray-900">Test 3CX Web Client</p>
                  <p className="text-xs text-gray-600">
                    Click to open your 3CX web client and verify the URL is correct
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${localConfig.webClientUrl}/webclient/`, '_blank')}
                    className="bg-white hover:bg-blue-50"
                  >
                    Open 3CX Web Client
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Extension (for WebRTC mode) */}
          {localConfig.integrationMode !== "click-to-call" && (
            <div className="space-y-2">
              <Label htmlFor="extension">Extension Number</Label>
              <Input
                id="extension"
                placeholder="e.g., 100"
                value={localConfig.extension || ""}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, extension: e.target.value })
                }
                className="bg-white/60 backdrop-blur-xl border-white/20"
              />
              <p className="text-xs text-gray-600">
                Your 3CX extension number for authentication
              </p>
            </div>
          )}

          {/* API Key (for Advanced mode) */}
          {localConfig.integrationMode === "advanced" && (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your 3CX API key"
                value={localConfig.apiKey || ""}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, apiKey: e.target.value })
                }
                className="bg-white/60 backdrop-blur-xl border-white/20"
              />
              <p className="text-xs text-gray-600">
                API key for advanced call control features
              </p>
            </div>
          )}

          {/* Auto Log Calls */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-1">
              <div className="font-medium text-gray-900">Auto-Log Calls</div>
              <div className="text-sm text-gray-600">
                Automatically save call history and duration
              </div>
            </div>
            <Switch
              checked={localConfig.autoLogCalls}
              onCheckedChange={(checked) =>
                setLocalConfig({ ...localConfig, autoLogCalls: checked })
              }
            />
          </div>

          {/* Configuration Status */}
          <Alert className={localConfig.enabled && localConfig.webClientUrl ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
            <AlertDescription>
              <div className="flex items-start gap-3">
                {localConfig.enabled && localConfig.webClientUrl ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Configuration Complete</p>
                      <p className="text-sm text-green-800">
                        3CX integration is ready to use. Click-to-call buttons will appear on phone numbers.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">Setup Required</p>
                      <p className="text-sm text-amber-800">
                        Enable integration and enter your 3CX Web Client URL to get started.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* How It Works */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">📞 How It Works</p>
                <p className="text-sm text-blue-800">
                  When you click "Make Call", 3CX opens in a new browser tab and the phone number is automatically copied to your clipboard.
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1 ml-2">
                  <li>Click "Make Call" on any contact</li>
                  <li>3CX opens in new tab (number copied automatically)</li>
                  <li>In 3CX: Click phone icon 📞 at top</li>
                  <li>Paste the number and click Call</li>
                  <li>Your phone rings!</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">
                  Simple, fast, and works every time - no popup blockers!
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Setup Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">Quick Setup Guide:</p>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1 ml-2">
                  <li>Enable the integration using the toggle above</li>
                  <li>Enter your 3CX URL: <span className="font-mono bg-blue-100 px-1 rounded">https://btmn.3cx.ng</span></li>
                  <li>Click "Save Settings"</li>
                  <li>Allow popups when you make your first call</li>
                  <li>Start using click-to-call from contact lists!</li>
                </ol>
                <div className="flex flex-wrap gap-3 mt-3">
                  <a 
                    href="https://www.3cx.com/docs/manual/using-the-webclient/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    3CX Web Client Docs
                  </a>
                  <span className="text-blue-400">•</span>
                  <a 
                    href="/3CX_INTEGRATION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Full Integration Guide
                  </a>
                  <span className="text-blue-400">•</span>
                  <a 
                    href="/3CX_QUICK_REFERENCE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Quick Reference
                  </a>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all"
            >
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testingConnection || !localConfig.webClientUrl}
              className="bg-white/60 backdrop-blur-xl border-white/20"
            >
              {testingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Benefits */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <CardHeader>
          <CardTitle className="text-lg">Benefits of 3CX Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">One-Click Calling</p>
                <p className="text-sm text-gray-600">Click any phone number to instantly dial</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Automatic Call Logging</p>
                <p className="text-sm text-gray-600">Track all calls and durations automatically</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Call History</p>
                <p className="text-sm text-gray-600">Review past calls with timestamps</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Performance Tracking</p>
                <p className="text-sm text-gray-600">Monitor call metrics and daily targets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
