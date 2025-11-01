import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { WifiOff, Wifi, Database } from 'lucide-react';
import { dataService } from '../utils/dataService';
import { Badge } from './ui/badge';

export function OfflineModeIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const result = await dataService.health();
      setIsOffline(result.status === 'offline' || result.mode === 'localStorage');
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return null; // Don't show anything while checking
  }

  if (!isOffline) {
    return null; // Only show when offline
  }

  return (
    <Alert className="border-blue-300 bg-blue-50/50 backdrop-blur-sm rounded-none border-x-0 border-t-0">
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-900">
            <strong>Offline Mode:</strong> Running with local storage. All data is saved in your browser.
          </span>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
          <WifiOff className="w-3 h-3 mr-1" />
          Local Only
        </Badge>
      </AlertDescription>
    </Alert>
  );
}
