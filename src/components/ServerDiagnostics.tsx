import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export function ServerDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Health Check
    try {
      const healthResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/health`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );
      
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        diagnosticResults.push({
          name: 'Server Health Check',
          status: 'success',
          message: 'Server is responding',
          details: JSON.stringify(data)
        });
      } else {
        diagnosticResults.push({
          name: 'Server Health Check',
          status: 'error',
          message: `Server returned status ${healthResponse.status}`,
          details: await healthResponse.text()
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Server Health Check',
        status: 'error',
        message: 'Failed to connect to server',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 2: Team Performance Test Endpoint
    try {
      const testResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/test-team`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (testResponse.ok) {
        const data = await testResponse.json();
        diagnosticResults.push({
          name: 'Team Performance Test',
          status: 'success',
          message: 'Test endpoint is responding',
          details: JSON.stringify(data)
        });
      } else {
        diagnosticResults.push({
          name: 'Team Performance Test',
          status: 'error',
          message: `Test endpoint returned status ${testResponse.status}`,
          details: await testResponse.text()
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Team Performance Test',
        status: 'error',
        message: 'Failed to connect to test endpoint',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 3: Actual Team Performance Endpoint
    try {
      const teamResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/team-performance`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (teamResponse.ok) {
        const data = await teamResponse.json();
        diagnosticResults.push({
          name: 'Team Performance Endpoint',
          status: 'success',
          message: 'Endpoint is responding',
          details: JSON.stringify(data, null, 2)
        });
      } else {
        const errorText = await teamResponse.text();
        diagnosticResults.push({
          name: 'Team Performance Endpoint',
          status: 'error',
          message: `Endpoint returned status ${teamResponse.status}`,
          details: errorText
        });
      }
    } catch (error) {
      diagnosticResults.push({
        name: 'Team Performance Endpoint',
        status: 'error',
        message: 'Failed to connect to team performance endpoint',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 4: CORS Check
    try {
      const corsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/health`,
        {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'GET',
          }
        }
      );
      
      diagnosticResults.push({
        name: 'CORS Configuration',
        status: corsResponse.ok ? 'success' : 'warning',
        message: corsResponse.ok ? 'CORS is properly configured' : 'CORS may have issues',
        details: `Status: ${corsResponse.status}`
      });
    } catch (error) {
      diagnosticResults.push({
        name: 'CORS Configuration',
        status: 'warning',
        message: 'Could not test CORS',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    };
    return variants[status] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Diagnostics</CardTitle>
        <CardDescription>
          Test server connectivity and endpoint availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={isRunning}>
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Server URL:</strong></p>
                  <code className="text-xs bg-muted p-2 block rounded">
                    https://{projectId}.supabase.co/functions/v1/make-server-8fff4b3c/
                  </code>
                </div>
              </AlertDescription>
            </Alert>

            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <CardTitle className="text-base">{result.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusBadge(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{result.message}</p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">
                        {result.details}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <Alert>
            <AlertDescription>
              Click "Run Diagnostics" to test server connectivity
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
