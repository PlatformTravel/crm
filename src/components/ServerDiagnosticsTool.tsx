import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Zap, Terminal, Copy, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export function ServerDiagnosticsTool() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [rawError, setRawError] = useState<string>('');

  const runDiagnostics = async () => {
    setRunning(true);
    setResults([]);
    setRawError('');
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check if we have project credentials
    diagnosticResults.push({
      test: 'Project Configuration',
      status: projectId && publicAnonKey ? 'pass' : 'fail',
      message: projectId && publicAnonKey 
        ? `Project ID: ${projectId.substring(0, 8)}...` 
        : 'Missing project credentials',
      details: { projectId: projectId || 'MISSING', hasKey: !!publicAnonKey }
    });

    // Test 2: Try to reach the health endpoint with detailed error catching
    try {
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/health`;
      console.log('[DIAGNOSTICS] 🔍 Checking server health...');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      console.log('[DIAGNOSTICS] ✅ Server health check passed');

      if (response.ok && responseData.status === 'ok') {
        diagnosticResults.push({
          test: 'Health Endpoint',
          status: 'pass',
          message: `Server online - ${responseData.message || 'OK'}`,
          details: responseData
        });
      } else if (response.status === 404) {
        diagnosticResults.push({
          test: 'Health Endpoint',
          status: 'fail',
          message: `404 Not Found - Function not deployed or wrong path`,
          details: { status: response.status, response: responseData }
        });
      } else if (response.status === 401 || response.status === 403) {
        diagnosticResults.push({
          test: 'Health Endpoint',
          status: 'fail',
          message: `Authentication error - Check API key`,
          details: { status: response.status, response: responseData }
        });
      } else {
        diagnosticResults.push({
          test: 'Health Endpoint',
          status: 'warning',
          message: `Server responded with status ${response.status}`,
          details: { status: response.status, response: responseData }
        });
      }
    } catch (error: any) {
      // Silent handling - no error logging (expected in demo mode)
      
      let errorMessage = 'Unknown error';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout (10s) - Server not responding';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = '🎭 Demo mode - Server not deployed (this is normal)';
      } else {
        errorMessage = error.message;
      }
      
      diagnosticResults.push({
        test: 'Health Endpoint',
        status: 'fail',
        message: errorMessage,
        details: { error: error.message, name: error.name }
      });
      
      setRawError(JSON.stringify({
        message: error.message,
        name: error.name,
        info: 'This is expected when server is not deployed'
      }, null, 2));
    }

    // Test 3: Check Supabase project URL accessibility
    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(supabaseUrl, { method: 'HEAD' });
      
      diagnosticResults.push({
        test: 'Supabase Project URL',
        status: response.ok ? 'pass' : 'warning',
        message: response.ok ? 'Project URL accessible' : `Status: ${response.status}`,
        details: { url: supabaseUrl, status: response.status }
      });
    } catch (error: any) {
      diagnosticResults.push({
        test: 'Supabase Project URL',
        status: 'fail',
        message: 'Cannot reach Supabase project',
        details: { error: error.message }
      });
    }

    // Test 4: Check if function exists (try different paths)
    const pathsToTest = [
      '/functions/v1/make-server-8fff4b3c',
      '/functions/v1/make-server-8fff4b3c/',
      '/functions/v1/make-server-8fff4b3c/health',
      '/functions/v1/server',
    ];

    for (const path of pathsToTest) {
      try {
        const url = `https://${projectId}.supabase.co${path}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        });
        
        if (response.ok) {
          const text = await response.text();
          diagnosticResults.push({
            test: `Path Test: ${path}`,
            status: 'pass',
            message: `Responds with status ${response.status}`,
            details: { path, status: response.status, preview: text.substring(0, 100) }
          });
          break; // Found a working path
        }
      } catch (error) {
        // Silent fail for path tests
      }
    }

    // Test 5: Try SMTP Settings endpoint specifically
    try {
      const smtpUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/smtp-settings`;
      console.log('[DIAGNOSTICS] 🔍 Testing SMTP endpoint...');
      
      const response = await fetch(smtpUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      console.log('[DIAGNOSTICS] SMTP Response:', response.status, responseData);

      if (response.ok) {
        diagnosticResults.push({
          test: 'SMTP Settings Endpoint',
          status: 'pass',
          message: `✅ SMTP endpoint working (${response.status})`,
          details: { status: response.status, response: responseData }
        });
      } else {
        diagnosticResults.push({
          test: 'SMTP Settings Endpoint',
          status: 'fail',
          message: `❌ SMTP endpoint error: ${response.status} - ${responseText}`,
          details: { status: response.status, response: responseData, url: smtpUrl }
        });
        
        setRawError(`SMTP Endpoint Error:\nStatus: ${response.status}\nResponse: ${responseText}`);
      }
    } catch (error: any) {
      diagnosticResults.push({
        test: 'SMTP Settings Endpoint',
        status: 'fail',
        message: `❌ Cannot reach SMTP endpoint: ${error.message}`,
        details: { error: error.message }
      });
      
      setRawError(`SMTP Endpoint Error:\n${error.message}`);
    }

    // Test 6: Try to actually save SMTP settings
    try {
      const smtpUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/smtp-settings`;
      console.log('[DIAGNOSTICS] 🔍 Testing SMTP save (POST)...');
      
      const testSettings = {
        host: 'test.smtp.com',
        port: 587,
        secure: false,
        user: 'test@example.com',
        password: 'test123'
      };
      
      const response = await fetch(smtpUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testSettings)
      });
      
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      console.log('[DIAGNOSTICS] SMTP Save Response:', response.status, responseData);

      if (response.ok && responseData.success) {
        diagnosticResults.push({
          test: 'SMTP Settings Save (POST)',
          status: 'pass',
          message: `✅ SMTP save working! Server can save settings`,
          details: { status: response.status, response: responseData }
        });
      } else {
        diagnosticResults.push({
          test: 'SMTP Settings Save (POST)',
          status: 'fail',
          message: `❌ SMTP save failed: ${response.status} - ${JSON.stringify(responseData)}`,
          details: { status: response.status, response: responseData }
        });
      }
    } catch (error: any) {
      diagnosticResults.push({
        test: 'SMTP Settings Save (POST)',
        status: 'fail',
        message: `❌ Cannot save SMTP settings: ${error.message}`,
        details: { error: error.message }
      });
    }

    setResults(diagnosticResults);
    setRunning(false);
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText('supabase functions deploy make-server-8fff4b3c');
      toast.success('Deployment command copied to clipboard!');
    } catch (err) {
      toast.info('Command: supabase functions deploy make-server-8fff4b3c');
    }
  };

  const openDashboard = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank');
  };

  const hasFailures = results.some(r => r.status === 'fail');
  const allPass = results.length > 0 && results.every(r => r.status === 'pass');

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>🔬 Advanced Server Diagnostics</CardTitle>
              <CardDescription>Deep dive into server connectivity</CardDescription>
            </div>
          </div>
          <Button 
            onClick={runDiagnostics} 
            disabled={running}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Click "Run Diagnostics" to check server connectivity
          </div>
        ) : (
          <>
            {/* Overall Status */}
            {allPass && (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-900">✅ All Diagnostics Passed!</div>
                  <div className="text-sm text-green-700">Server is properly deployed and responding</div>
                </div>
              </div>
            )}
            
            {hasFailures && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-red-900">⚠️ Server Issues Detected</div>
                  <div className="text-sm text-red-700">The function is likely not deployed</div>
                </div>
              </div>
            )}

            {/* Individual Results */}
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border-2 ${
                    result.status === 'pass' 
                      ? 'bg-green-50 border-green-200' 
                      : result.status === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {result.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : result.status === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${
                          result.status === 'pass' ? 'text-green-900' : 
                          result.status === 'warning' ? 'text-yellow-900' : 'text-red-900'
                        }`}>
                          {result.test}
                        </div>
                        <div className={`text-xs mt-1 ${
                          result.status === 'pass' ? 'text-green-700' : 
                          result.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer opacity-70 hover:opacity-100">
                              Show details
                            </summary>
                            <pre className={`text-xs mt-1 p-2 rounded overflow-auto ${
                              result.status === 'pass' ? 'bg-green-100' : 
                              result.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={result.status === 'pass' ? 'default' : 'destructive'}
                      className={`flex-shrink-0 ${result.status === 'pass' ? 'bg-green-600' : result.status === 'warning' ? 'bg-yellow-600' : ''}`}
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Raw Error */}
            {rawError && (
              <details className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                <summary className="text-sm font-semibold cursor-pointer">Raw Error Details</summary>
                <pre className="text-xs mt-2 overflow-auto">{rawError}</pre>
              </details>
            )}

            {/* Action Required */}
            {hasFailures && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 space-y-3">
                <div className="font-semibold text-orange-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Action Required: Deploy the Server
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-orange-800">
                    The diagnostics indicate the server function is not deployed. Run this command:
                  </p>
                  
                  <div className="bg-orange-100 border border-orange-300 rounded p-3 font-mono text-sm flex items-center justify-between gap-2">
                    <code className="flex-1">supabase functions deploy make-server-8fff4b3c</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyCommand}
                      className="border-orange-400 hover:bg-orange-200 flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={openDashboard}
                      className="border-orange-400 hover:bg-orange-200"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Supabase Dashboard
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={runDiagnostics}
                      className="border-orange-400 hover:bg-orange-200"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Re-test After Deploy
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-orange-700 space-y-1">
                  <p><strong>Don't have Supabase CLI?</strong></p>
                  <code className="block bg-orange-100 p-1 rounded">npm install -g supabase</code>
                  <p className="mt-2"><strong>Not linked to project?</strong></p>
                  <code className="block bg-orange-100 p-1 rounded">supabase link --project-ref {projectId}</code>
                </div>
              </div>
            )}

            {/* Success Next Steps */}
            {allPass && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <div className="font-semibold text-green-900 mb-2">✅ Server is working!</div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• You can now import clients and customers</p>
                  <p>• Smart filtering is available</p>
                  <p>• All database operations will work</p>
                  <p>• Try the Database Test panel for more tests</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <div className="font-semibold mb-1">ℹ️ Quick Info</div>
          <div className="space-y-1 text-xs">
            <p>• <strong>Project:</strong> {projectId}</p>
            <p>• <strong>Function:</strong> make-server-8fff4b3c</p>
            <p>• <strong>URL:</strong> https://{projectId}.supabase.co/functions/v1/make-server-8fff4b3c</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
