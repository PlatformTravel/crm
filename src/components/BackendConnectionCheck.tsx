import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2, Server, Terminal } from 'lucide-react';
import { BACKEND_URL } from '../utils/config';

export function BackendConnectionCheck() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkConnection();
    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        console.log('✅ Backend connected:', data);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
      console.error('❌ Backend not reachable:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <Alert className="bg-blue-950/95 border-blue-500/50 backdrop-blur-sm">
          <Server className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-100">
            Checking backend connection...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <Alert className="bg-red-950/95 border-red-500/50 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="space-y-2">
            <div className="text-red-100 font-medium">
              ❌ Backend Server Not Running
            </div>
            <div className="text-red-200 text-sm space-y-1">
              <p className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <span>Open a terminal and run:</span>
              </p>
              <div className="bg-black/30 rounded px-3 py-2 font-mono text-xs text-red-100 border border-red-500/30">
                cd backend && deno run --allow-net --allow-env server.tsx
              </div>
              <p className="text-xs text-red-300 mt-2">
                Looking for backend at: <code className="bg-black/30 px-1 rounded">{BACKEND_URL}</code>
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Connected - show brief success message that fades
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-2 duration-500">
      <Alert className="bg-green-950/95 border-green-500/50 backdrop-blur-sm">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-100">
          ✅ Backend connected at {BACKEND_URL}
        </AlertDescription>
      </Alert>
    </div>
  );
}
