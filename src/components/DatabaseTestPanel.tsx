import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Database, Zap } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DatabaseTestPanel() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runTests = async () => {
    setTesting(true);
    const testResults: any[] = [];

    // Test 1: Health endpoint
    try {
      const healthRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/health`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const healthData = await healthRes.json();
      testResults.push({
        name: 'Health Check',
        status: healthRes.ok && healthData.status === 'ok' ? 'pass' : 'fail',
        details: healthData,
        statusCode: healthRes.status
      });
    } catch (error: any) {
      testResults.push({
        name: 'Health Check',
        status: 'fail',
        details: { error: error.message },
        statusCode: 0
      });
    }

    // Test 2: Get clients
    try {
      const clientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const clientsData = await clientsRes.json();
      testResults.push({
        name: 'Get Clients',
        status: clientsRes.ok && clientsData.success ? 'pass' : 'fail',
        details: clientsData,
        statusCode: clientsRes.status
      });
    } catch (error: any) {
      testResults.push({
        name: 'Get Clients',
        status: 'fail',
        details: { error: error.message },
        statusCode: 0
      });
    }

    // Test 3: Get customers
    try {
      const customersRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/customers`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const customersData = await customersRes.json();
      testResults.push({
        name: 'Get Customers',
        status: customersRes.ok && customersData.success ? 'pass' : 'fail',
        details: customersData,
        statusCode: customersRes.status
      });
    } catch (error: any) {
      testResults.push({
        name: 'Get Customers',
        status: 'fail',
        details: { error: error.message },
        statusCode: 0
      });
    }

    // Test 4: Get call scripts
    try {
      const scriptsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/call-scripts`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const scriptsData = await scriptsRes.json();
      testResults.push({
        name: 'Get Call Scripts',
        status: scriptsRes.ok && scriptsData.success ? 'pass' : 'fail',
        details: scriptsData,
        statusCode: scriptsRes.status
      });
    } catch (error: any) {
      testResults.push({
        name: 'Get Call Scripts',
        status: 'fail',
        details: { error: error.message },
        statusCode: 0
      });
    }

    setResults(testResults);
    setTesting(false);
  };

  const allPassed = results.length > 0 && results.every(r => r.status === 'pass');
  const someFailed = results.some(r => r.status === 'fail');

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Database Connection Test</CardTitle>
              <CardDescription>Test all backend endpoints</CardDescription>
            </div>
          </div>
          <Button 
            onClick={runTests} 
            disabled={testing}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Click "Run Tests" to check database connection
          </div>
        ) : (
          <div className="space-y-3">
            {/* Overall Status */}
            {allPassed && (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">✅ All Tests Passed!</div>
                  <div className="text-sm text-green-700">Database is fully operational</div>
                </div>
              </div>
            )}
            
            {someFailed && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">⚠️ Some Tests Failed</div>
                  <div className="text-sm text-red-700">Server may not be deployed correctly</div>
                </div>
              </div>
            )}

            {/* Individual Test Results */}
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === 'pass' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.status === 'pass' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${
                        result.status === 'pass' ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.name}
                      </span>
                    </div>
                    <Badge 
                      variant={result.status === 'pass' ? 'default' : 'destructive'}
                      className={result.status === 'pass' ? 'bg-green-600' : ''}
                    >
                      {result.statusCode || 'No Response'}
                    </Badge>
                  </div>
                  <div className={`text-sm font-mono p-2 rounded ${
                    result.status === 'pass' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.status === 'pass' ? (
                      <div className="text-green-700">
                        ✓ {result.details.message || 'Success'}
                        {result.details.records && ` (${result.details.records.length} records)`}
                        {result.details.clients && ` (${result.details.clients.length} clients)`}
                        {result.details.customers && ` (${result.details.customers.length} customers)`}
                        {result.details.scripts && ` (${result.details.scripts.length} scripts)`}
                      </div>
                    ) : (
                      <div className="text-red-700">
                        ✗ {result.details.error || JSON.stringify(result.details)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {someFailed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="font-semibold text-yellow-900 mb-2">🔧 Fix Required:</div>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p>The server needs to be deployed. Run this command:</p>
                  <code className="block bg-yellow-100 p-2 rounded text-xs">
                    supabase functions deploy make-server-8fff4b3c
                  </code>
                  <p className="text-xs">See DEPLOY_NOW.md for detailed instructions</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
