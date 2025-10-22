import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ServerHealthCheckProps {
  onDismiss?: () => void;
}

export function ServerHealthCheck({ onDismiss }: ServerHealthCheckProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [teamEndpointStatus, setTeamEndpointStatus] = useState<string>('');

  const checkHealth = async () => {
    setStatus('checking');
    setErrorDetails('');
    setTeamEndpointStatus('');
    
    try {
      // Test main health endpoint (silently)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'ok') {
          setStatus('online');
          // Auto-dismiss after 5 seconds if online
          setTimeout(() => {
            onDismiss?.();
          }, 5000);
        } else {
          setStatus('offline');
        }
      } else {
        setStatus('offline');
      }
    } catch (error: any) {
      // Server not available
      setStatus('offline');
      setErrorDetails(error.message || 'Connection failed');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (status === 'online') {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">Server Online</AlertTitle>
        <AlertDescription className="text-green-700 space-y-1">
          <p>Successfully connected to the backend server.</p>
          {teamEndpointStatus && (
            <p className="text-sm text-green-600">✓ {teamEndpointStatus}</p>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'checking') {
    return (
      <Alert className="border-blue-500 bg-blue-50">
        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertTitle className="text-blue-900">Checking Server...</AlertTitle>
        <AlertDescription className="text-blue-700">
          Verifying backend connection...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-red-500 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-900">❌ Server Offline</AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-red-700">
          <strong>Backend server is not responding.</strong> The application requires the backend server to be deployed and running.
        </p>
        {errorDetails && (
          <div className="bg-red-100 border border-red-300 p-3 rounded">
            <p className="text-sm text-red-800 font-semibold mb-1">Error Details:</p>
            <code className="text-xs text-red-700 block">{errorDetails}</code>
          </div>
        )}
        <div className="bg-red-100 border border-red-300 p-3 rounded">
          <p className="text-sm text-red-800 font-semibold mb-2">
            Deploy the backend server:
          </p>
          <code className="text-xs bg-red-200 px-2 py-1 rounded block font-mono">
            supabase functions deploy make-server-8fff4b3c
          </code>
        </div>
        <div className="space-y-2 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          <p className="font-semibold">🔧 Troubleshooting:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Ensure Supabase CLI is installed</li>
            <li>Verify you're logged into Supabase</li>
            <li>Check that the project is linked correctly</li>
            <li>Deploy the server function using the command above</li>
          </ul>
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={checkHealth} 
            size="sm" 
            variant="outline"
            className="border-red-400 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry Connection
          </Button>
          <Button
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
            size="sm"
            variant="outline"
            className="border-red-400 text-red-700 hover:bg-red-100"
          >
            Open Supabase Dashboard
          </Button>
          {onDismiss && (
            <Button 
              onClick={onDismiss} 
              size="sm" 
              variant="ghost"
              className="text-red-700 hover:bg-red-100"
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
