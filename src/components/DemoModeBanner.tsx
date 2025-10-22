import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Info, ExternalLink, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  const copyDeployCommand = async () => {
    const success = await copyToClipboard('cd backend && deno run --allow-net --allow-env server.tsx');
    if (success) {
      toast.success('Backend command copied! Run it in a new terminal.');
    } else {
      toast.info('Command: cd backend && deno run --allow-net --allow-env server.tsx');
    }
  };

  if (dismissed) return null;

  return (
    <Alert className="border-2 border-purple-400 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 shadow-lg mb-6 animate-in slide-in-from-top-4 duration-500">
      <Info className="h-5 w-5 text-purple-600 animate-pulse" />
      <AlertTitle className="text-purple-900 text-lg">
        🎮 Demo Mode Active - Backend Not Connected
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <div className="text-purple-800">
          <p className="font-semibold">
            ✅ The app is working with demo data! You can explore all features.
          </p>
          <p className="text-sm mt-2">
            ⚠️ Data is temporary and stored in your browser. To use real database, start the backend server.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-green-900 font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            💡 To Enable Real Backend & Database:
          </p>
          <div className="space-y-2">
            <div className="text-xs text-green-800 font-semibold">
              1. Open a NEW terminal window (keep current one running)
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-green-800 font-semibold">2. Run this command:</span>
              <code className="text-xs bg-black text-green-400 px-3 py-1.5 rounded font-mono border border-green-500">
                cd backend && deno run --allow-net --allow-env server.tsx
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyDeployCommand}
                className="h-7 bg-green-600 text-white hover:bg-green-700 border-green-600"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Command
              </Button>
            </div>
            <div className="text-xs text-green-800 font-semibold">
              3. Wait for "Listening on http://localhost:8000/" then refresh this page
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-purple-200">
          <div className="text-xs text-purple-700 font-mono">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
            <span className="font-semibold">Status:</span> Demo Mode | 
            <span className="font-semibold ml-2">Backend:</span> Offline | 
            <span className="font-semibold ml-2">Data:</span> Browser Only
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="text-purple-700 hover:bg-purple-100 h-7"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
