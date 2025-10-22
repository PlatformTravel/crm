import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, Terminal, Copy, RefreshCw, CheckCircle2, Zap, Server } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';
import { BACKEND_URL } from '../utils/config';

export function DeploymentRequired() {
  const [testing, setTesting] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [autoRetrying, setAutoRetrying] = useState(true);
  const [secondsUntilRetry, setSecondsUntilRetry] = useState(5);

  const copyCommand = async (command: string) => {
    const success = await copyToClipboard(command);
    if (success) {
      toast.success('Command copied to clipboard!');
    } else {
      toast.info(`Command: ${command}`);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setIsOnline(true);
          toast.success('🎉 Backend is online! Refreshing page...');
          setTimeout(() => window.location.reload(), 1000);
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setTesting(false);
    }
  };

  // Auto-retry every 5 seconds
  useState(() => {
    if (!autoRetrying) return;

    const interval = setInterval(async () => {
      setSecondsUntilRetry((prev) => {
        if (prev <= 1) {
          testConnection();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Auto-retry banner */}
        {autoRetrying && (
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="font-semibold">
                Auto-checking every 5 seconds... Next check in {secondsUntilRetry}s
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRetrying(false)}
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                Stop Auto-Check
              </Button>
            </div>
          </div>
        )}

        {/* Main Alert */}
        <Card className="border-4 border-red-500 shadow-2xl bg-slate-800/90 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Server className="w-12 h-12 text-red-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-4xl font-bold">⚠️ ACTION REQUIRED!</CardTitle>
                <CardDescription className="text-red-100 text-xl mt-2 font-semibold">
                  You must start the backend server first!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Current Status */}
            <div className="bg-red-950/50 border-2 border-red-500 rounded-lg p-6">
              <h3 className="font-bold text-red-100 text-xl mb-4 flex items-center gap-2">
                <Terminal className="w-6 h-6" />
                Current Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-red-200">Backend URL:</span>
                  <code className="bg-black/50 px-3 py-1 rounded text-red-100 border border-red-500/30">
                    {BACKEND_URL}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-red-200">Status:</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded font-bold">
                    NOT RUNNING
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-red-200">Error:</span>
                  <code className="bg-black/50 px-3 py-1 rounded text-red-100 text-xs border border-red-500/30">
                    Failed to fetch (Connection refused)
                  </code>
                </div>
              </div>
            </div>

            {/* Start Instructions */}
            <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-2 border-blue-500 rounded-lg p-6">
              <h3 className="font-bold text-blue-100 text-xl mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                🚀 Start Backend Server (30 Seconds!)
              </h3>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-blue-100">Open a new terminal</div>
                      <div className="text-sm text-blue-200">
                        Keep your current terminal running, open a NEW terminal window
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 - MOST IMPORTANT */}
                <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-4 border-green-500 rounded-lg p-6 shadow-2xl animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                      2
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="font-bold text-green-100 text-2xl">
                        🎯 COPY AND RUN THIS COMMAND NOW!
                      </div>
                      <div className="bg-black/70 text-green-400 font-mono text-lg p-5 rounded flex items-center justify-between shadow-md border-2 border-green-500/50">
                        <code className="font-bold select-all">cd backend && deno run --allow-net --allow-env server.tsx</code>
                        <Button
                          size="lg"
                          onClick={() => {
                            copyCommand('cd backend && deno run --allow-net --allow-env server.tsx');
                            toast.info('✅ Command copied! Now paste it in your terminal!', { duration: 5000 });
                          }}
                          className="ml-3 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        >
                          <Copy className="w-5 h-5 mr-2" />
                          Copy Command
                        </Button>
                      </div>
                      <div className="text-base text-green-100 bg-green-950/50 p-4 rounded border-2 border-green-500/30 font-semibold">
                        ⚡ After running this command, this page will automatically refresh and the CRM will load!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-blue-100">Wait for "Server running" message</div>
                      <div className="bg-black/70 text-green-400 font-mono text-sm p-3 rounded border border-slate-600">
                        🚀 BTM Travel CRM Server running on MongoDB!<br/>
                        📊 Database: btm_travel_crm @ cluster0.vlklc6c.mongodb.net<br/>
                        ✅ All Supabase dependencies removed!<br/>
                        Listening on http://localhost:8000/
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-blue-100">Test the Connection</div>
                      <Button
                        onClick={testConnection}
                        disabled={testing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {testing ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Testing Connection...
                          </>
                        ) : isOnline ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Server Online! Refreshing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Test Connection (Click After Starting Server)
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Don't Have Deno? */}
            <div className="bg-yellow-950/50 border-2 border-yellow-500 rounded-lg p-6">
              <h3 className="font-bold text-yellow-100 text-lg mb-3">
                🔧 Don't Have Deno Installed?
              </h3>
              <div className="space-y-3 text-yellow-100">
                <p className="text-sm">Install Deno first (takes 1 minute):</p>
                
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Windows (PowerShell):</div>
                  <div className="bg-black/70 text-green-400 font-mono text-sm p-3 rounded flex items-center justify-between">
                    <code>irm https://deno.land/install.ps1 | iex</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCommand('irm https://deno.land/install.ps1 | iex')}
                      className="ml-2 bg-slate-800"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-sm">Mac/Linux:</div>
                  <div className="bg-black/70 text-green-400 font-mono text-sm p-3 rounded flex items-center justify-between">
                    <code>curl -fsSL https://deno.land/install.sh | sh</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCommand('curl -fsSL https://deno.land/install.sh | sh')}
                      className="ml-2 bg-slate-800"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-yellow-200 mt-2">
                  After installation, restart your terminal and run the backend command from Step 2
                </div>
              </div>
            </div>

            {/* Help Resources */}
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
              <h4 className="font-semibold text-slate-100 mb-2">📚 Documentation</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <code className="bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-700">
                  QUICK_START.md
                </code>
                <code className="bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-700">
                  START_HERE.md
                </code>
                <code className="bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-700">
                  /backend/README.md
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-500 bg-blue-950/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-bold text-blue-100">30 Seconds</div>
              <div className="text-sm text-blue-300">Total Time</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-500 bg-green-950/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🟢</div>
              <div className="font-bold text-green-100">1 Command</div>
              <div className="text-sm text-green-300">To Start</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-500 bg-purple-950/50 backdrop-blur">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-bold text-purple-100">Local Dev</div>
              <div className="text-sm text-purple-300">No Deployment</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
