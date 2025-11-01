import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, Server, Wifi, WifiOff } from 'lucide-react';
import { BACKEND_URL } from '../utils/config';

export function BackendStatusBanner() {
  const [status, setStatus] = useState<{
    connected: boolean;
    corsConfigured: boolean;
    mongoConnected: boolean;
    version: string | null;
  }>({
    connected: false,
    corsConfigured: false,
    mongoConnected: false,
    version: null,
  });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          cache: 'no-cache',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Check CORS headers
          const corsConfigured = 
            response.headers.get('access-control-allow-origin') !== null &&
            response.headers.get('access-control-allow-methods') !== null;

          setStatus({
            connected: true,
            corsConfigured,
            mongoConnected: data.mongodb === 'connected' || data.status === 'ok',
            version: data.version || null,
          });
        } else {
          setStatus(prev => ({ ...prev, connected: false }));
        }
      } catch (error) {
        setStatus(prev => ({ ...prev, connected: false }));
      }
    };

    // GRACE PERIOD: Wait 3 seconds before first check to give backend time to start
    // This banner only shows when backend IS connected (success state), so no rush
    const initialCheckTimeout = setTimeout(() => {
      checkBackend();
    }, 3000);

    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000);

    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(interval);
    };
  }, []);

  // Only show if backend is connected (don't show error banner - BackendRequiredModal handles that)
  if (!status.connected) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="border-2 border-green-500 bg-green-50 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {status.mongoConnected ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Server className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <AlertDescription>
              <p className="font-semibold text-green-900 mb-1 flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Backend Server Status
              </p>
              <div className="space-y-1 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>Server: {status.connected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.corsConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>CORS: {status.corsConfigured ? 'Configured ✅' : 'Checking...'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.mongoConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span>MongoDB: {status.mongoConnected ? 'Connected' : 'Initializing...'}</span>
                </div>
                {status.version && (
                  <div className="text-xs text-green-700 mt-1 font-mono">
                    {status.version}
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}
