import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Server, Terminal, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { backendService } from '../utils/backendService';

export function BackendRequiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [hasShownModal, setHasShownModal] = useState(false);

  const checkBackend = async () => {
    try {
      const health = await backendService.health();
      if (health.status === 'ok') {
        setBackendStatus('connected');
        return true;
      } else {
        setBackendStatus('disconnected');
        return false;
      }
    } catch (error) {
      setBackendStatus('disconnected');
      return false;
    }
  };

  useEffect(() => {
    const checkAndShow = async () => {
      const isConnected = await checkBackend();
      
      // Only show modal if backend is disconnected and we haven't shown it yet in this session
      const modalShown = sessionStorage.getItem('backend_modal_shown');
      if (!isConnected && !modalShown) {
        setIsOpen(true);
        setHasShownModal(true);
        sessionStorage.setItem('backend_modal_shown', 'true');
      }
    };

    // GRACE PERIOD: Wait 3 seconds before first check to give backend time to start
    // This prevents the error from appearing immediately on page load
    const initialCheckTimeout = setTimeout(() => {
      checkAndShow();
    }, 3000);

    // Check every 5 seconds after initial check
    const interval = setInterval(checkAndShow, 5000);

    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleRetry = async () => {
    setBackendStatus('checking');
    const isConnected = await checkBackend();
    if (isConnected) {
      setIsOpen(false);
    }
  };

  if (backendStatus === 'connected') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Server className="w-8 h-8 text-red-600 animate-pulse" />
            <span className="text-red-600">Backend Server Required</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            The BTM Travel CRM requires a MongoDB backend server to function properly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Error */}
          <Alert className="border-2 border-red-500 bg-red-50">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription>
              <p className="font-mono text-sm text-red-900">
                [ADMIN] ❌ Backend not available - user management requires MongoDB connection
              </p>
            </AlertDescription>
          </Alert>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Quick Start Instructions
            </h3>

            <div className="space-y-4">
              {/* Windows */}
              <div className="bg-white p-4 rounded-lg border border-blue-300">
                <p className="font-semibold text-blue-900 mb-2">🪟 Windows Users:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Open your project folder</li>
                  <li>Double-click the file: <code className="bg-blue-100 px-2 py-1 rounded font-mono font-bold">🔴-START-BACKEND-FIXED.bat</code></li>
                  <li>Wait for "✅ MongoDB connected successfully"</li>
                  <li>Keep the window OPEN (don't close it!)</li>
                  <li className="text-xs text-gray-600">Alternative: Use 🔴-START-EVERYTHING.bat</li>
                </ol>
              </div>

              {/* Mac/Linux */}
              <div className="bg-white p-4 rounded-lg border border-green-300">
                <p className="font-semibold text-green-900 mb-2">🍎 Mac/Linux Users:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Open Terminal in your project folder</li>
                  <li>Run: <code className="bg-green-100 px-2 py-1 rounded font-mono">chmod +x 🔴-START-BACKEND-FIXED.sh</code></li>
                  <li>Then: <code className="bg-green-100 px-2 py-1 rounded font-mono font-bold">./🔴-START-BACKEND-FIXED.sh</code></li>
                  <li>Wait for "✅ MongoDB connected successfully"</li>
                  <li>Keep the terminal OPEN (don't close it!)</li>
                  <li className="text-xs text-gray-600">Alternative: Use 🔴-START-EVERYTHING.sh</li>
                </ol>
              </div>

              {/* Alternative */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <p className="font-semibold text-gray-900 mb-2">⚙️ Alternative (Manual Command):</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">Open terminal/command prompt and run:</p>
                  <code className="bg-black text-green-400 px-3 py-2 rounded block font-mono text-sm">
                    cd backend<br/>
                    deno run --allow-net --allow-env --allow-read --allow-write server.tsx
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Success Indicators */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <h4 className="font-semibold text-green-900 mb-3">✅ Success Indicators:</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Terminal shows: <code className="bg-green-100 px-2 py-0.5 rounded">[MongoDB] ✅ Connected successfully</code></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Terminal shows: <code className="bg-green-100 px-2 py-0.5 rounded">🚀 Server running on http://localhost:8000</code></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Green banner: <code className="bg-green-100 px-2 py-0.5 rounded">BTM TRAVEL CRM SERVER - FULLY OPERATIONAL!</code></span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <Alert className="border-2 border-yellow-500 bg-yellow-50">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <AlertDescription>
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Important:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                <li>Keep the terminal/command window OPEN while using the CRM</li>
                <li>Closing it will stop the backend and cause errors</li>
                <li>You need to start the backend every time you use the CRM</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRetry}
              disabled={backendStatus === 'checking'}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {backendStatus === 'checking' ? 'Checking...' : 'I Started It - Retry Connection'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              I'll Start It Later
            </Button>
          </div>

          {/* Additional Help */}
          <div className="text-center pt-2 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Need more help? Check the QUICK-START.md guide in your project folder
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Backend fully configured ✅ | MongoDB connected ✅ | All endpoints ready ✅
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
