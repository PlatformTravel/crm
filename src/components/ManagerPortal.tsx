// BTMTravel Manager Portal - Classic View
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Database, Users, Archive, Activity } from "lucide-react";
import { DatabaseManager } from "./DatabaseManager";
import { NumberBankManager } from "./NumberBankManager";
import { ArchiveManager } from "./ArchiveManager";
import { AgentMonitoring } from "./AgentMonitoring";

export function ManagerPortal() {
  const [activeTab, setActiveTab] = useState("agents");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">
            <Activity className="w-4 h-4 mr-2" />
            Agent Monitoring
          </TabsTrigger>
          <TabsTrigger value="numberbank">
            <Users className="w-4 h-4 mr-2" />
            Number Bank
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="archive">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-6">
          <AgentMonitoring />
        </TabsContent>

        <TabsContent value="numberbank" className="mt-6">
          <NumberBankManager />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <DatabaseManager />
        </TabsContent>

        <TabsContent value="archive" className="mt-6">
          <ArchiveManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
