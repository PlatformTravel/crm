// BTMTravel Manager Portal - Classic View
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Database, Users, Archive, BarChart3 } from "lucide-react";
import { ManagerDashboard } from "./ManagerDashboard";
import { DatabaseManager } from "./DatabaseManager";
import { NumberBankManager } from "./NumberBankManager";
import { ArchiveManager } from "./ArchiveManager";

export function ManagerPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Manager Dashboard
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database Manager
          </TabsTrigger>
          <TabsTrigger value="numberbank">
            <Users className="w-4 h-4 mr-2" />
            Number Bank Manager
          </TabsTrigger>
          <TabsTrigger value="archive">
            <Archive className="w-4 h-4 mr-2" />
            Archive Manager
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <ManagerDashboard />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <DatabaseManager />
        </TabsContent>

        <TabsContent value="numberbank" className="mt-6">
          <NumberBankManager />
        </TabsContent>

        <TabsContent value="archive" className="mt-6">
          <ArchiveManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
