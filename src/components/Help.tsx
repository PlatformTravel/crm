import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { 
  BookOpen, Users, Phone, Mail, Settings, BarChart3, ShieldCheck, PlayCircle,
  CheckCircle2, AlertCircle, Lightbulb, Target, Clock, FileText, Megaphone,
  Headphones, Key, UserCircle, MessageSquare, TrendingUp, Calendar, Search,
  Plus, Edit, Trash2, Copy, Eye, Filter, Download, Upload, RefreshCw,
  ChevronRight, Zap, Star, Award, Shield, ArrowLeft, Home, Archive, HelpCircle,
  PhoneCall, PhoneOff, Mic, MicOff, Pause, Play, MousePointerClick, ClipboardCopy,
  Send, Inbox, Server, Database, Lock, Unlock, RotateCcw, CheckCircle, XCircle,
  Smartphone, TabletSmartphone, Monitor, Chrome
} from "lucide-react";

interface HelpProps {
  onBack?: () => void;
}

type HelpSection = 
  | "overview"
  | "getting-started"
  | "crm"
  | "promo-sales"
  | "customer-service"
  | "phone-system"
  | "email-system"
  | "admin-settings"
  | "daily-progress"
  | "archive-manager"
  | "permissions"
  | "call-scripts"
  | "troubleshooting";

export function Help({ onBack }: HelpProps) {
  const [activeSection, setActiveSection] = useState<HelpSection>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: "overview" as HelpSection, icon: Home, label: "Overview", color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "getting-started" as HelpSection, icon: PlayCircle, label: "Getting Started", color: "text-green-600", bgColor: "bg-green-50" },
    { id: "crm" as HelpSection, icon: Users, label: "Prospective Client (CRM)", color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "promo-sales" as HelpSection, icon: Megaphone, label: "Promo Sales", color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: "customer-service" as HelpSection, icon: Headphones, label: "Customer Service", color: "text-green-600", bgColor: "bg-green-50" },
    { id: "phone-system" as HelpSection, icon: Phone, label: "3CX Phone System", color: "text-teal-600", bgColor: "bg-teal-50" },
    { id: "email-system" as HelpSection, icon: Mail, label: "Email System", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { id: "admin-settings" as HelpSection, icon: Settings, label: "Admin Settings", color: "text-orange-600", bgColor: "bg-orange-50" },
    { id: "daily-progress" as HelpSection, icon: Target, label: "Daily Progress Tracking", color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { id: "archive-manager" as HelpSection, icon: Archive, label: "Archive Manager", color: "text-amber-600", bgColor: "bg-amber-50" },
    { id: "permissions" as HelpSection, icon: Shield, label: "Permissions & Roles", color: "text-red-600", bgColor: "bg-red-50" },
    { id: "call-scripts" as HelpSection, icon: MessageSquare, label: "Call Scripts", color: "text-violet-600", bgColor: "bg-violet-50" },
    { id: "troubleshooting" as HelpSection, icon: HelpCircle, label: "Troubleshooting", color: "text-rose-600", bgColor: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-white/30 shadow-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white drop-shadow-lg text-3xl font-extrabold">BTMTravel CRM Help Center</h1>
                  <p className="text-white/90 mt-1">Complete guide to using the platform</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search help topics..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur text-gray-900 placeholder-gray-500 border-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Sidebar + Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="col-span-3">
            <Card className="sticky top-6 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Help Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-1 p-4 pt-0">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? `${item.bgColor} ${item.color} font-semibold shadow-md`
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? item.color : "text-gray-500"}`} />
                          <span className="text-sm text-left flex-1">{item.label}</span>
                          {isActive && <ChevronRight className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="pr-4">
                {activeSection === "overview" && <OverviewContent />}
                {activeSection === "getting-started" && <GettingStartedContent />}
                {activeSection === "crm" && <CRMContent />}
                {activeSection === "promo-sales" && <PromoSalesContent />}
                {activeSection === "customer-service" && <CustomerServiceContent />}
                {activeSection === "phone-system" && <PhoneSystemContent />}
                {activeSection === "email-system" && <EmailSystemContent />}
                {activeSection === "admin-settings" && <AdminSettingsContent />}
                {activeSection === "daily-progress" && <DailyProgressContent />}
                {activeSection === "archive-manager" && <ArchiveManagerContent />}
                {activeSection === "permissions" && <PermissionsContent />}
                {activeSection === "call-scripts" && <CallScriptsContent />}
                {activeSection === "troubleshooting" && <TroubleshootingContent />}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Content
function OverviewContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to BTMTravel CRM Help Center</CardTitle>
          <CardDescription>Your comprehensive guide to mastering the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            Welcome to the BTMTravel CRM platform! This help center provides detailed documentation for all features and functionality.
            Select a topic from the left sidebar to get started.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <PlayCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Get started in 5 minutes with our beginner's guide</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">CRM Basics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Learn to manage your prospective clients</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Phone className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle className="text-lg">Make Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">3CX phone system integration guide</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Mail className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Send Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Email templates and SMTP configuration</p>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Tip:</strong> Use the search bar at the top to quickly find specific topics or features.
            </AlertDescription>
          </Alert>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Platform Overview</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>🌐 Production URL:</strong> https://btmn.3cx.ng</p>
              <p><strong>📱 Phone Format:</strong> +234 XXX XXX XXXX (Nigerian)</p>
              <p><strong>🎯 Daily Call Target:</strong> 30 calls per agent (customizable)</p>
              <p><strong>👥 User Roles:</strong> Admin, Manager, Agent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Getting Started Content
function GettingStartedContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <PlayCircle className="h-8 w-8 text-green-600" />
            Getting Started
          </CardTitle>
          <CardDescription>Everything you need to know to start using BTMTravel CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            {/* First Time Login */}
            <AccordionItem value="first-login">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  First Time Login
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 ml-7">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Your administrator will provide you with login credentials
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Step-by-Step Login Process
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                    <li>Open the BTMTravel CRM application in your browser</li>
                    <li>Enter your username (provided by admin)</li>
                    <li>Enter your password (provided by admin)</li>
                    <li>Click "Login" button</li>
                    <li>You'll be redirected to your dashboard based on your role</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Password Security Tips
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 ml-4">
                    <li>Change your password on first login (ask admin)</li>
                    <li>Use a strong password with letters, numbers, and symbols</li>
                    <li>Don't share your password with anyone</li>
                    <li>Log out when leaving your desk</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dashboard Overview */}
            <AccordionItem value="dashboard-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Dashboard Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 ml-7">
                <div className="space-y-3">
                  <h4 className="font-semibold">Main Navigation Tabs</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Users className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-blue-900">Prospective Client (CRM)</h5>
                        <p className="text-sm text-blue-700">Manage your daily call list, make calls, send emails, and track leads</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Megaphone className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-purple-900">Promo Sales</h5>
                        <p className="text-sm text-purple-700">Manage promotions for adventure.btmtravel.net</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Headphones className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-green-900">Customer Service</h5>
                        <p className="text-sm text-green-700">Handle existing customer inquiries and bookings</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Archive className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-orange-900">Archive (Admin Only)</h5>
                        <p className="text-sm text-orange-700">View and restore archived records</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Settings className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-red-900">Admin (Admin Only)</h5>
                        <p className="text-sm text-red-700">System configuration, user management, and settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* User Roles */}
            <AccordionItem value="user-roles">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Understanding User Roles
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 ml-7">
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r">
                    <h4 className="font-semibold text-red-900 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Admin
                    </h4>
                    <p className="text-sm text-red-700 mt-1">Full system access. Can manage users, settings, permissions, and all data</p>
                    <ul className="list-disc list-inside text-sm text-red-600 mt-2 ml-4">
                      <li>Create and manage users</li>
                      <li>Configure 3CX phone system</li>
                      <li>Set up email SMTP settings</li>
                      <li>Manage call scripts</li>
                      <li>Access all reports and analytics</li>
                      <li>Delete and archive records</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                    <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Manager
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">Team oversight and management capabilities with customizable permissions</p>
                    <ul className="list-disc list-inside text-sm text-blue-600 mt-2 ml-4">
                      <li>View team performance dashboard</li>
                      <li>Access team call history</li>
                      <li>Review team reports</li>
                      <li>Manage call scripts (if permitted)</li>
                      <li>Limited settings access based on permissions</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      Agent
                    </h4>
                    <p className="text-sm text-green-700 mt-1">Front-line user with call and customer management access</p>
                    <ul className="list-disc list-inside text-sm text-green-600 mt-2 ml-4">
                      <li>Make calls to prospects</li>
                      <li>Send emails to clients</li>
                      <li>Log call notes</li>
                      <li>View own call history</li>
                      <li>Use call scripts</li>
                      <li>Track daily progress toward targets</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// CRM Content
function CRMContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Prospective Client (CRM & Contact Management)
          </CardTitle>
          <CardDescription>Complete guide to managing your prospective clients and daily call list</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            {/* Daily Call List */}
            <AccordionItem value="daily-calls">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Daily Call List & 30 Calls Target
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Target className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Daily Target: 30 calls per day (customizable by admin)</strong><br />
                    Track your progress in real-time on the dashboard
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Viewing Your Call List</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                    <li>Navigate to "Prospective Client" tab</li>
                    <li>Your call list displays automatically</li>
                    <li>See call status badges (To Call, Called, Callback, etc.)</li>
                    <li>View total calls made today at the top</li>
                    <li>Track progress toward your daily target</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4" />
                    Quick Tips
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-800 ml-4">
                    <li>Start with "To Call" contacts first</li>
                    <li>Check "Callback" contacts - they're expecting your call</li>
                    <li>Use filters to focus on high-priority leads</li>
                    <li>Review notes before calling</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Adding Contacts */}
            <AccordionItem value="adding-contacts">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Adding New Contacts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Add a New Contact</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                    <li>Click the "Add Contact" button (green button with + icon)</li>
                    <li>Fill in the contact form:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-sm">
                        <li><strong>Name:</strong> Full contact name (required)</li>
                        <li><strong>Email:</strong> Contact email address (required)</li>
                        <li><strong>Phone:</strong> Nigerian format +234 XXX XXX XXXX (required)</li>
                        <li><strong>Company:</strong> Company name (optional)</li>
                        <li><strong>Status:</strong> Initial status (To Call, Interested, etc.)</li>
                        <li><strong>Notes:</strong> Any additional information</li>
                      </ul>
                    </li>
                    <li>Click "Save Contact"</li>
                    <li>Contact appears in your call list immediately</li>
                  </ol>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <strong>Phone Format:</strong> Always use Nigerian format: +234 XXX XXX XXXX
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Editing Contacts */}
            <AccordionItem value="editing-contacts">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-500" />
                  Editing Contact Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Edit a Contact</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                    <li>Find the contact in your list</li>
                    <li>Click the "Edit" button (pencil icon)</li>
                    <li>Update any fields as needed</li>
                    <li>Click "Save Changes"</li>
                    <li>Changes are saved immediately</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Editable Fields</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
                    <li>Name and contact details</li>
                    <li>Status and priority</li>
                    <li>Notes and call history</li>
                    <li>Follow-up dates</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Archiving & Deleting */}
            <AccordionItem value="archiving">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-orange-500" />
                  Archiving & Deleting Contacts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Admin Only:</strong> Only administrators can archive or delete contacts
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Archive vs Delete</h4>
                  <div className="grid gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-1">Archive (Recommended)</h5>
                      <p className="text-sm text-blue-700">Hides contact from main list but keeps data. Can be restored anytime from Archive Manager.</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h5 className="font-semibold text-red-900 mb-1">Delete (Permanent)</h5>
                      <p className="text-sm text-red-700">Permanently removes contact from system. Cannot be undone!</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">How to Archive Multiple Contacts</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Select contacts using checkboxes</li>
                    <li>Or click "Select All" to choose all visible contacts</li>
                    <li>Click "Archive Selected" button</li>
                    <li>Confirm the action</li>
                    <li>Contacts move to Archive Manager</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Search & Filters */}
            <AccordionItem value="search-filter">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-500" />
                  Search & Filter Contacts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Search Functionality</h4>
                  <p className="text-sm text-gray-700">Use the search bar to find contacts by:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Company name</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Status Filters</h4>
                  <p className="text-sm text-gray-700">Filter contacts by status:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-gray-50 rounded border text-sm">To Call</div>
                    <div className="p-2 bg-blue-50 rounded border text-sm">Called</div>
                    <div className="p-2 bg-green-50 rounded border text-sm">Interested</div>
                    <div className="p-2 bg-yellow-50 rounded border text-sm">Callback</div>
                    <div className="p-2 bg-purple-50 rounded border text-sm">Follow-up</div>
                    <div className="p-2 bg-red-50 rounded border text-sm">Not Interested</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Promo Sales Content
function PromoSalesContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-purple-600" />
            Promo Sales
          </CardTitle>
          <CardDescription>Managing promotions for adventure.btmtravel.net</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="promo-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Promo Sales Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  The Promo Sales module allows you to manage promotional campaigns and special offers for your adventure travel packages on adventure.btmtravel.net.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-700 ml-4">
                    <li>Create and manage promotional campaigns</li>
                    <li>Set discount codes and special offers</li>
                    <li>Track promotion performance</li>
                    <li>Target specific customer segments</li>
                    <li>Schedule time-limited promotions</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creating-promos">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Creating Promotions
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Create a Promotion</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                    <li>Click "Add Promotion" button</li>
                    <li>Enter promotion details:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-sm">
                        <li>Promotion name and description</li>
                        <li>Discount percentage or fixed amount</li>
                        <li>Validity period (start and end dates)</li>
                        <li>Target audience or customer segment</li>
                        <li>Terms and conditions</li>
                      </ul>
                    </li>
                    <li>Set promotion status (Active/Inactive)</li>
                    <li>Click "Save Promotion"</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="managing-promos">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-500" />
                  Managing Active Promotions
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Promotion Lifecycle</h4>
                  <div className="grid gap-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900 text-sm mb-1">Active</h5>
                      <p className="text-xs text-green-700">Promotion is live and available to customers</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h5 className="font-semibold text-yellow-900 text-sm mb-1">Scheduled</h5>
                      <p className="text-xs text-yellow-700">Promotion will become active at specified start date</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 text-sm mb-1">Expired</h5>
                      <p className="text-xs text-gray-700">Promotion has passed its end date</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Customer Service Content
function CustomerServiceContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Headphones className="h-8 w-8 text-green-600" />
            Customer Service
          </CardTitle>
          <CardDescription>Handling existing customer inquiries and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="cs-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  Customer Service Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  The Customer Service module is for handling inquiries and support requests from existing customers who have already booked with BTMTravel.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Key Differences from CRM</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>CRM (Prospective Client):</strong> For new leads and potential customers</p>
                    <p><strong>Customer Service:</strong> For existing customers with bookings</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="viewing-customers">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Viewing Customer Records
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Customer Information Displayed</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Customer name and contact details</li>
                    <li>Booking reference numbers</li>
                    <li>Travel dates and destinations</li>
                    <li>Payment status</li>
                    <li>Support ticket history</li>
                    <li>Previous communications</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Use the search bar to quickly find customers by name, booking reference, or phone number
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="managing-customers">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-purple-500" />
                  Managing Customer Records
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Adding Customer Notes</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Open customer record</li>
                    <li>Find the "Notes" section</li>
                    <li>Click "Add Note"</li>
                    <li>Enter details of interaction or issue</li>
                    <li>Select note type (Inquiry, Issue, Resolution, etc.)</li>
                    <li>Save note with timestamp</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Updating Booking Information</h4>
                  <p className="text-sm text-gray-700">When customers request changes:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Update travel dates if modified</li>
                    <li>Change contact information</li>
                    <li>Update payment status</li>
                    <li>Add special requests or requirements</li>
                    <li>Log all changes in notes</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customer-archive">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-orange-500" />
                  Archiving Customer Records
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Admin Only:</strong> Only administrators can archive customer records
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold">When to Archive</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Customer has completed their trip</li>
                    <li>No active bookings for 12+ months</li>
                    <li>Customer requested account closure</li>
                    <li>Duplicate records (keep most recent)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Archived records can be restored anytime from the Archive Manager if the customer returns.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Phone System Content - Will continue in next part...
function PhoneSystemContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Phone className="h-8 w-8 text-teal-600" />
            3CX Phone System Integration
          </CardTitle>
          <CardDescription>Complete guide to using the integrated 3CX phone system</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            {/* 3CX Overview */}
            <AccordionItem value="3cx-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-500" />
                  What is 3CX?
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  3CX is a professional business phone system integrated into BTMTravel CRM. It allows you to make calls directly from the CRM interface with automatic logging and tracking.
                </p>
                
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h4 className="font-semibold text-teal-900 mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-teal-700 ml-4">
                    <li>Click-to-call from CRM</li>
                    <li>Automatic call logging</li>
                    <li>Call duration tracking</li>
                    <li>Active call panel with controls</li>
                    <li>Call history and analytics</li>
                    <li>Integration with call scripts</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Production URL:</strong> https://btmn.3cx.ng
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Making Calls */}
            <AccordionItem value="making-calls">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-green-500" />
                  Making Calls - Step by Step
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Complete Call Workflow</h4>
                  <ol className="list-decimal list-inside space-y-3 text-gray-800">
                    <li className="font-semibold">
                      Click "Make Call" button on contact
                      <p className="text-sm text-gray-600 ml-6 mt-1">Green phone icon button next to phone number</p>
                    </li>
                    <li className="font-semibold">
                      Big toast notification appears
                      <p className="text-sm text-gray-600 ml-6 mt-1">Shows phone number in large format</p>
                      <div className="ml-6 mt-2 p-3 bg-white rounded border">
                        <div className="text-xs text-gray-500">Example Toast:</div>
                        <div className="font-mono text-lg text-blue-600 my-1">+234 803 123 4567</div>
                        <div className="text-xs text-green-600">✅ Number auto-copied!</div>
                        <Button size="sm" className="bg-green-600 mt-2 text-xs">📋 Copy Number</Button>
                      </div>
                    </li>
                    <li className="font-semibold">
                      3CX opens in new browser tab
                      <p className="text-sm text-gray-600 ml-6 mt-1">Automatic - no popup blockers!</p>
                    </li>
                    <li className="font-semibold">
                      Copy number (multiple methods):
                      <ul className="list-disc ml-10 mt-2 space-y-1 text-sm font-normal text-gray-600">
                        <li>Auto-copied (if "✅ Number auto-copied!" appears)</li>
                        <li>Click "Copy Number" button in toast</li>
                        <li>Copy from call panel (bottom-right)</li>
                        <li>Select and copy manually</li>
                      </ul>
                    </li>
                    <li className="font-semibold">
                      Switch to 3CX tab
                      <p className="text-sm text-gray-600 ml-6 mt-1">Press Ctrl+Tab or Alt+Tab, or click the tab</p>
                    </li>
                    <li className="font-semibold">
                      Find and click phone icon (📞)
                      <p className="text-sm text-gray-600 ml-6 mt-1">Usually at top of 3CX window or in People section</p>
                    </li>
                    <li className="font-semibold">
                      Paste number in dialpad
                      <p className="text-sm text-gray-600 ml-6 mt-1">Press Ctrl+V to paste</p>
                    </li>
                    <li className="font-semibold">
                      Click green "Call" button
                      <p className="text-sm text-gray-600 ml-6 mt-1 text-green-600">📞 Your desk phone rings!</p>
                    </li>
                    <li className="font-semibold">
                      Pick up your desk phone
                      <p className="text-sm text-gray-600 ml-6 mt-1">The call connects to the customer</p>
                    </li>
                  </ol>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <strong>Important:</strong> You must have a desk phone connected to 3CX. The system calls your desk phone first, then connects you to the customer.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Active Call Panel */}
            <AccordionItem value="call-panel">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  Active Call Panel
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  When you make a call, an Active Call Panel appears at the bottom-right of your screen showing call details and controls.
                </p>

                <div className="bg-white rounded-lg p-4 border-2 border-green-500 space-y-3">
                  <div className="flex items-center justify-between bg-green-100 px-3 py-2 rounded">
                    <span className="font-semibold text-green-900 flex items-center gap-2">
                      <PhoneCall className="h-4 w-4" />
                      Connected
                    </span>
                    <span className="font-mono text-sm">⏱ 02:15</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">John Smith</div>
                    <div className="font-mono text-gray-600">+234 803 123 4567</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Mic className="h-3 w-3 mr-1" />
                      Mute
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Pause className="h-3 w-3 mr-1" />
                      Hold
                    </Button>
                    <Button size="sm" className="bg-red-600 text-xs">
                      <PhoneOff className="h-3 w-3 mr-1" />
                      End Call
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Call Panel Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li><strong>Call Timer:</strong> Real-time duration tracking</li>
                    <li><strong>Contact Info:</strong> Name and phone number displayed</li>
                    <li><strong>Mute Button:</strong> Mute/unmute your microphone</li>
                    <li><strong>Hold Button:</strong> Put caller on hold</li>
                    <li><strong>End Call:</strong> Terminate the call</li>
                    <li><strong>Copy Number:</strong> Click phone number to copy</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Call Scripts */}
            <AccordionItem value="call-scripts-usage">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Using Call Scripts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  If your administrator has enabled call scripts, a draggable script dialog appears when you make a call to guide your conversation.
                </p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Script Dialog Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-700 ml-4">
                    <li><strong>Draggable:</strong> Move anywhere on screen</li>
                    <li><strong>Resizable:</strong> Adjust size as needed</li>
                    <li><strong>Step-by-step prompts:</strong> Guided conversation flow</li>
                    <li><strong>Next button:</strong> Move through script steps</li>
                    <li><strong>Notes field:</strong> Take notes during call</li>
                    <li><strong>Close button:</strong> Dismiss when finished</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">How to Use Scripts</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Script dialog appears automatically when call connects</li>
                    <li>Read the prompt to customer</li>
                    <li>Listen to their response</li>
                    <li>Take notes in the notes field</li>
                    <li>Click "Next" to proceed to next step</li>
                    <li>Repeat until script complete</li>
                    <li>Close dialog when call ends</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* After Call */}
            <AccordionItem value="after-call">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  After the Call - Logging Notes
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Always log your calls!</strong> Notes help you and your team follow up effectively.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Call Details Dialog</h4>
                  <p className="text-sm text-gray-700">After ending a call, a dialog appears automatically:</p>
                  
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Review call information (duration, time, etc.)</li>
                    <li>Select call outcome:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li><strong>Successful:</strong> Good conversation, potential sale</li>
                        <li><strong>Callback:</strong> Need to call back later</li>
                        <li><strong>Not Interested:</strong> Not interested at this time</li>
                        <li><strong>No Answer:</strong> Didn't pick up</li>
                        <li><strong>Wrong Number:</strong> Incorrect contact</li>
                      </ul>
                    </li>
                    <li>Add detailed notes about the conversation</li>
                    <li>Set follow-up date if needed</li>
                    <li>Click "Save" to log the call</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">What to Include in Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-4">
                    <li>Customer's main concerns or interests</li>
                    <li>Products or services discussed</li>
                    <li>Any objections raised</li>
                    <li>Next steps agreed upon</li>
                    <li>Best time to follow up</li>
                    <li>Personal details to remember (preferences, etc.)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Call History */}
            <AccordionItem value="call-history">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Viewing Call History
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  Access your complete call history to review past conversations and track your performance.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">How to Access Call History</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Go to Admin Settings (Admins) or check contact records</li>
                    <li>View all calls made to each contact</li>
                    <li>See call duration, outcome, and notes</li>
                    <li>Filter by date range or outcome</li>
                    <li>Export call data for reports</li>
                  </ol>
                </div>

                <div className="bg-slate-50 border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Call History Includes:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>• Date and time</div>
                    <div>• Call duration</div>
                    <div>• Contact name</div>
                    <div>• Phone number</div>
                    <div>• Call outcome</div>
                    <div>• Agent name</div>
                    <div>• Call notes</div>
                    <div>• Follow-up status</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Troubleshooting */}
            <AccordionItem value="3cx-troubleshooting">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-rose-500" />
                  3CX Troubleshooting
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h5 className="font-semibold text-red-900 text-sm">My desk phone doesn't ring</h5>
                    <ul className="list-disc list-inside text-xs text-red-700 mt-2 ml-4">
                      <li>Check that your desk phone is connected</li>
                      <li>Verify your extension is configured in 3CX</li>
                      <li>Make sure phone is not on DND (Do Not Disturb)</li>
                      <li>Contact your admin to verify 3CX settings</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">Number doesn't auto-copy</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Use "Copy Number" button in toast notification</li>
                      <li>Try clicking phone number in Active Call Panel</li>
                      <li>Manually select and copy from toast</li>
                      <li>Check browser clipboard permissions</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                    <h5 className="font-semibold text-yellow-900 text-sm">3CX tab blocked by popup blocker</h5>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 ml-4">
                      <li>Look for popup blocker icon in address bar</li>
                      <li>Click to allow popups from this site</li>
                      <li>Add CRM domain to browser's allowed list</li>
                      <li>Try clicking "Make Call" again</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <h5 className="font-semibold text-blue-900 text-sm">Can't find phone icon in 3CX</h5>
                    <ul className="list-disc list-inside text-xs text-blue-700 mt-2 ml-4">
                      <li>Check top navigation bar for phone icon</li>
                      <li>Look for "People" or "Contacts" section</li>
                      <li>Try clicking your profile icon</li>
                      <li>Refresh the 3CX page if needed</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Due to size, I'll split the remaining sections into a separate continuation message
// Email System Content
function EmailSystemContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Mail className="h-8 w-8 text-indigo-600" />
            Email System
          </CardTitle>
          <CardDescription>Email templates, SMTP configuration, and sending emails</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="email-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-500" />
                  Email System Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  BTMTravel CRM includes a full-featured email system for sending personalized emails to prospects and customers. The system uses SMTP for reliable email delivery.
                </p>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700 ml-4">
                    <li>Send emails directly from CRM</li>
                    <li>Pre-built email templates</li>
                    <li>Custom template creation</li>
                    <li>Variable substitution (name, company, etc.)</li>
                    <li>SMTP configuration (Admin only)</li>
                    <li>Email tracking and history</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Server className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Admin Setup Required:</strong> SMTP settings must be configured by an administrator before sending emails
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sending-emails">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-500" />
                  Sending Emails to Contacts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Send an Email</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Find contact in CRM or Customer Service</li>
                    <li>Click "Send Email" button (envelope icon)</li>
                    <li>Email dialog opens with contact info pre-filled</li>
                    <li>Choose a template or compose custom email:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li>Select from template dropdown</li>
                        <li>Or write your own subject and message</li>
                      </ul>
                    </li>
                    <li>Review email (variables auto-filled with contact data)</li>
                    <li>Click "Send Email"</li>
                    <li>Confirmation appears when sent</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Email Best Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-4">
                    <li>Personalize with contact's name</li>
                    <li>Keep subject line clear and concise</li>
                    <li>Include clear call-to-action</li>
                    <li>Proofread before sending</li>
                    <li>Follow up within 24-48 hours</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="email-templates">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Email Templates
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  Templates save time by providing pre-written emails for common scenarios. Use variables to automatically insert contact information.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Available Variables</h4>
                  <div className="bg-slate-50 border rounded p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>{'{{name}}'} - Contact name</div>
                      <div>{'{{email}}'} - Email address</div>
                      <div>{'{{company}}'} - Company name</div>
                      <div>{'{{phone}}'} - Phone number</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Example Template</h4>
                  <div className="bg-white border rounded p-3 text-xs">
                    <div className="font-semibold mb-1">Subject: Exciting Travel Opportunities for {'{{company}}'}</div>
                    <div className="text-gray-600">
                      Hi {'{{name}}'},<br/><br/>
                      I hope this email finds you well. I wanted to reach out regarding some exciting travel packages...<br/><br/>
                      Best regards,<br/>
                      BTMTravel Team
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="smtp-setup">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  SMTP Configuration (Admin Only)
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <Lock className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Admin Only:</strong> Only administrators can configure SMTP settings
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Configuring SMTP</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Go to Admin Settings → SMTP Settings</li>
                    <li>Enter SMTP server details:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li><strong>SMTP Host:</strong> Your email server (e.g., smtp.gmail.com)</li>
                        <li><strong>SMTP Port:</strong> Usually 587 or 465</li>
                        <li><strong>Username:</strong> Your email address</li>
                        <li><strong>Password:</strong> App password or email password</li>
                        <li><strong>From Name:</strong> Sender name displayed to recipients</li>
                        <li><strong>From Email:</strong> Email address emails will be sent from</li>
                      </ul>
                    </li>
                    <li>Click "Test Connection" to verify settings</li>
                    <li>If successful, click "Save Settings"</li>
                    <li>Users can now send emails</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Common SMTP Providers</h4>
                  <div className="space-y-2 text-xs text-yellow-800">
                    <div><strong>Gmail:</strong> smtp.gmail.com:587 (requires app password)</div>
                    <div><strong>Outlook:</strong> smtp-mail.outlook.com:587</div>
                    <div><strong>Office 365:</strong> smtp.office365.com:587</div>
                    <div><strong>Custom Domain:</strong> Check with your hosting provider</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Continue with remaining content sections...
// I'll add the rest in the final part to complete the file

function AdminSettingsContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Settings className="h-8 w-8 text-orange-600" />
            Admin Settings
          </CardTitle>
          <CardDescription>System configuration and administrative controls</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="admin-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  Admin Panel Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <Lock className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Admin Only:</strong> Only users with Admin role can access these settings
                  </AlertDescription>
                </Alert>

                <p className="text-gray-700">
                  The Admin Settings panel is your control center for managing users, system configuration, and all administrative functions.
                </p>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Users className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Users Tab</h5>
                      <p className="text-sm text-blue-700">Create, edit, and manage user accounts and daily targets</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Shield className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-purple-900">Permissions Tab</h5>
                      <p className="text-sm text-purple-700">Assign granular permissions to managers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Database className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-green-900">Contacts Tab</h5>
                      <p className="text-sm text-green-700">Bulk contact management and import</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <Phone className="h-5 w-5 text-teal-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-teal-900">3CX Settings Tab</h5>
                      <p className="text-sm text-teal-700">Configure 3CX phone system integration</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Mail className="h-5 w-5 text-indigo-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-indigo-900">SMTP Settings Tab</h5>
                      <p className="text-sm text-indigo-700">Configure email sending via SMTP</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg border border-violet-200">
                    <MessageSquare className="h-5 w-5 text-violet-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-violet-900">Call Scripts Tab</h5>
                      <p className="text-sm text-violet-700">Create and manage call scripts for agents</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="user-management">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  User Management
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Creating a New User</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Go to Admin Settings → Users tab</li>
                    <li>Click "Add User" button</li>
                    <li>Fill in user details:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li><strong>Username:</strong> Unique login name</li>
                        <li><strong>Full Name:</strong> User's display name</li>
                        <li><strong>Email:</strong> User's email address</li>
                        <li><strong>Password:</strong> Initial password (user should change)</li>
                        <li><strong>Role:</strong> Admin, Manager, or Agent</li>
                        <li><strong>Daily Target:</strong> Custom call target (optional)</li>
                      </ul>
                    </li>
                    <li>Click "Create User"</li>
                    <li>Share credentials with the new user</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Daily Target System</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
                    <li><strong>Global Default:</strong> 30 calls per day (applies to all users)</li>
                    <li><strong>Custom Targets:</strong> Set individual targets for specific users</li>
                    <li><strong>Manager Targets:</strong> Managers don't have call targets (supervisory role)</li>
                    <li><strong>Report Calculation:</strong> Reports use each user's assigned target</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="permissions-mgmt">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Permission Management
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  Assign granular permissions to managers to control what they can access and modify.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">How to Assign Permissions</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Go to Admin Settings → Permissions tab</li>
                    <li>Find the manager you want to configure</li>
                    <li>Click "Edit Permissions" button</li>
                    <li>Check/uncheck permissions by category</li>
                    <li>Click "Save Permissions"</li>
                  </ol>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Available Permissions (12 total)</h4>
                  <div className="space-y-2 text-xs text-purple-700">
                    <div><strong>Team:</strong> View performance, View agents, Assign agents</div>
                    <div><strong>CRM:</strong> Manage contacts</div>
                    <div><strong>Customer Service:</strong> Manage customers, View details, Edit notes</div>
                    <div><strong>Promotions:</strong> Manage promotions, Manage campaigns</div>
                    <div><strong>Security:</strong> View audit logs</div>
                    <div><strong>Reporting:</strong> Generate reports, Export data</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3cx-config">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-500" />
                  3CX Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Configuring 3CX Integration</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Go to Admin Settings → 3CX Settings</li>
                    <li>Enable 3CX integration toggle</li>
                    <li>Enter your 3CX Web Client URL (e.g., https://btmn.3cx.ng)</li>
                    <li>Click "Save Settings"</li>
                    <li>Click "Test Connection" to verify</li>
                  </ol>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <strong>Note:</strong> Users must have 3CX accounts and desk phones configured by your 3CX administrator
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function DailyProgressContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Target className="h-8 w-8 text-cyan-600" />
            Daily Progress Tracking
          </CardTitle>
          <CardDescription>Monitor your daily call targets and achievements with real-time progress indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="progress-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-500" />
                  Daily Progress Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  The BTMTravel CRM automatically tracks your call progress throughout the day, helping you stay on target and achieve your daily goals.
                </p>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Progress Card (Visible in ClientCRM)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-cyan-700 ml-4">
                    <li><strong>Daily Target:</strong> Your assigned call goal (default: 30 calls)</li>
                    <li><strong>Calls Made Today:</strong> Total calls completed</li>
                    <li><strong>Progress Bar:</strong> Visual representation of completion</li>
                    <li><strong>Percentage:</strong> Your current completion rate</li>
                    <li><strong>Motivational Badges:</strong> Achievements when you hit milestones</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Progress updates automatically after each call - no need to refresh!
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="badges">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievement Badges
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  Earn motivational badges as you progress toward your daily target:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-900">25% Complete - Good Start!</div>
                      <div className="text-xs text-green-700">Keep up the momentum</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">50% Complete - Halfway There!</div>
                      <div className="text-xs text-blue-700">You're doing great</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Star className="h-6 w-6 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-yellow-900">75% Complete - Almost Done!</div>
                      <div className="text-xs text-yellow-700">Final push!</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Award className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-semibold text-purple-900">100% Complete - Target Achieved!</div>
                      <div className="text-xs text-purple-700">Excellent work today!</div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tracking">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  How Progress is Tracked
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Automatic Call Counting</h4>
                  <p className="text-sm text-gray-700">
                    Calls are automatically counted when:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>You click "Make Call" button (call initiates)</li>
                    <li>Call is logged in the system</li>
                    <li>Progress updates in real-time</li>
                    <li>Data syncs with backend automatically</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border rounded p-4">
                  <h4 className="font-semibold text-sm mb-2">Progress Calculation</h4>
                  <div className="font-mono text-xs bg-white p-2 rounded">
                    Progress % = (Completed Calls ÷ Daily Target) × 100
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Example: 15 calls completed ÷ 30 target = 50% progress
                  </p>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Progress resets automatically at midnight for a fresh start each day
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function ArchiveManagerContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Archive className="h-8 w-8 text-amber-600" />
            Archive Manager
          </CardTitle>
          <CardDescription>Managing archived records and restoring data</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="archive-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-amber-500" />
                  Archive Manager Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <strong>Admin Only:</strong> Only administrators can access the Archive Manager
                  </AlertDescription>
                </Alert>

                <p className="text-gray-700">
                  The Archive Manager is a centralized hub where administrators can view all archived records from both ClientCRM and Customer Service in one dedicated interface.
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 ml-4">
                    <li>View all archived records in one place</li>
                    <li>Search across all archived data</li>
                    <li>One-click restore functionality</li>
                    <li>Click-to-call for callbacks</li>
                    <li>Separate tabs for CRM and Customer Service archives</li>
                    <li>Glassmorphism confirmation dialogs</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="viewing-archives">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Viewing Archived Records
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Accessing the Archive Manager</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Click "Archive" tab in main navigation (admin only)</li>
                    <li>Choose between two tabs:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li><strong>CRM Archives:</strong> Archived prospective clients</li>
                        <li><strong>Customer Service Archives:</strong> Archived customer records</li>
                      </ul>
                    </li>
                    <li>View complete list of archived records</li>
                    <li>Use search to find specific records</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Information Displayed</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
                    <li>Contact/Customer name</li>
                    <li>Email and phone number</li>
                    <li>Archive date</li>
                    <li>Original status</li>
                    <li>Last contact date</li>
                    <li>Notes and history</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="restoring">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-green-500" />
                  Restoring Archived Records
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Restore a Record</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Find the archived record you want to restore</li>
                    <li>Click the "Restore" button (green button with restore icon)</li>
                    <li>Glassmorphism confirmation dialog appears</li>
                    <li>Review the record details</li>
                    <li>Click "Confirm Restore"</li>
                    <li>Record is immediately moved back to active list</li>
                    <li>Toast notification confirms successful restore</li>
                  </ol>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Restored records retain all their original data, notes, and history
                  </AlertDescription>
                </Alert>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">When to Restore</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 ml-4">
                    <li>Customer returns after inactive period</li>
                    <li>Contact shows renewed interest</li>
                    <li>Record was archived by mistake</li>
                    <li>Need to follow up after all</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="archive-callbacks">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-500" />
                  Making Callbacks from Archive
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  Even from the Archive Manager, you can make calls to archived contacts without restoring them first.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">How to Call from Archive</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Find the archived record</li>
                    <li>Click the phone icon button next to phone number</li>
                    <li>3CX integration activates (same as regular calls)</li>
                    <li>Make your call</li>
                    <li>If successful, consider restoring the record</li>
                  </ol>
                </div>

                <Alert className="bg-teal-50 border-teal-200">
                  <Lightbulb className="h-4 w-4 text-teal-600" />
                  <AlertDescription>
                    <strong>Tip:</strong> Use this feature for re-engagement campaigns or follow-ups with dormant leads
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="archive-search">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-500" />
                  Searching Archives
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  The Archive Manager includes a powerful real-time search feature to quickly find archived records.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">Search Capabilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Search by name</li>
                    <li>Search by email</li>
                    <li>Search by phone number</li>
                    <li>Search by company name</li>
                    <li>Real-time results (no need to press Enter)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Tip:</strong> Search works across all visible fields in the current tab (CRM or Customer Service)
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionsContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            Permissions & Roles
          </CardTitle>
          <CardDescription>Understanding the flexible role-based permission system</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="permission-system">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Permission System Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  BTMTravel CRM uses a comprehensive, granular permission system that allows administrators to assign specific capabilities to managers beyond the basic three-tier role structure.
                </p>

                <div className="grid gap-3">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r">
                    <h4 className="font-semibold text-red-900 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Admins
                    </h4>
                    <p className="text-sm text-red-700 mt-1">Have all permissions by default - superuser access to everything</p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                    <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Managers
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">Have customizable permissions assigned by admins - flexible access control</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      Agents
                    </h4>
                    <p className="text-sm text-green-700 mt-1">Have standard access - no special permissions needed</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="permission-list">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  12 Available Permissions
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Management (3 permissions)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
                      <li><strong>view_team_performance:</strong> View team metrics and performance dashboards</li>
                      <li><strong>view_all_agents:</strong> See all agents and their activities</li>
                      <li><strong>assign_agents:</strong> Assign tasks and contacts to agents</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      CRM - Client Relationship Management (1 permission)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-4">
                      <li><strong>manage_contacts:</strong> Add, edit, and delete CRM contacts</li>
                    </ul>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Customer Service (3 permissions)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-teal-700 ml-4">
                      <li><strong>manage_customers:</strong> Add, edit, and delete customer records</li>
                      <li><strong>view_customer_details:</strong> Access detailed customer information</li>
                      <li><strong>edit_customer_notes:</strong> Modify customer notes and history</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      Promotions (2 permissions)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-purple-700 ml-4">
                      <li><strong>manage_promotions:</strong> Create and edit promotional content</li>
                      <li><strong>manage_promo_campaigns:</strong> Full campaign management and analytics</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Security (1 permission)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-orange-700 ml-4">
                      <li><strong>view_audit_logs:</strong> Access login and security audit logs</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Reporting (2 permissions)
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700 ml-4">
                      <li><strong>generate_reports:</strong> Create and export system reports</li>
                      <li><strong>export_data:</strong> Export contacts, customers, and reports</li>
                    </ul>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="assigning-permissions">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  How to Assign Permissions (Admin)
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Step-by-Step Guide</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Navigate to Admin Settings → Permissions tab</li>
                    <li>Find the manager you want to configure</li>
                    <li>Click "Edit Permissions" button</li>
                    <li>Permission dialog opens with 6 categories</li>
                    <li>Check/uncheck desired permissions by category</li>
                    <li>Click "Save Permissions"</li>
                    <li>Changes take effect immediately</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Best Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 ml-4">
                    <li><strong>Start Minimal:</strong> Grant only necessary permissions initially</li>
                    <li><strong>Review Regularly:</strong> Audit manager permissions quarterly</li>
                    <li><strong>Document Decisions:</strong> Keep track of why permissions were granted</li>
                    <li><strong>Test Access:</strong> Have managers verify their access after changes</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="checking-permissions">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Checking Your Permissions
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-sm text-gray-700">
                  As a manager, you can see which permissions you have by observing which features and tabs are available to you.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">How Permissions Affect Access</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Tabs and buttons appear/disappear based on permissions</li>
                    <li>Features you can't access are hidden from view</li>
                    <li>Manager Dashboard shows only if you have team permissions</li>
                    <li>Export buttons show only with export_data permission</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    If you need additional permissions, contact your administrator
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function CallScriptsContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-violet-600" />
            Call Scripts
          </CardTitle>
          <CardDescription>Creating and managing call scripts for agents to use during calls</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="scripts-overview">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-violet-500" />
                  Call Scripts Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <p className="text-gray-700">
                  Call scripts provide agents with structured conversation guides during phone calls. Managers can create, edit, and manage scripts from the Admin Settings panel.
                </p>

                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                  <h4 className="font-semibold text-violet-900 mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-violet-700 ml-4">
                    <li>Create unlimited custom scripts</li>
                    <li>Step-by-step conversation prompts</li>
                    <li>Draggable and resizable script dialog</li>
                    <li>Appears automatically when agents make calls</li>
                    <li>Easy to edit and update</li>
                    <li>Helps maintain consistency in messaging</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Scripts help new agents get started and ensure all team members deliver consistent messaging
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creating-scripts">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Creating Call Scripts (Admin/Manager)
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <Lock className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Permission Required:</strong> Only admins and managers with script management permission can create scripts
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">How to Create a Call Script</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Go to Admin Settings → Call Scripts tab</li>
                    <li>Click "Create Script" button</li>
                    <li>Enter script details:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li><strong>Script Name:</strong> Descriptive name (e.g., "Initial Outreach")</li>
                        <li><strong>Description:</strong> When to use this script</li>
                        <li><strong>Script Content:</strong> Step-by-step conversation prompts</li>
                      </ul>
                    </li>
                    <li>Format script with clear steps or bullet points</li>
                    <li>Click "Save Script"</li>
                    <li>Script becomes available to all agents immediately</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Script Writing Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-4">
                    <li>Use clear, conversational language</li>
                    <li>Break script into logical steps</li>
                    <li>Include common objection handling</li>
                    <li>Add notes for tone and pacing</li>
                    <li>Keep it concise but comprehensive</li>
                    <li>Test with actual agents before deploying</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="using-scripts">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  Using Call Scripts (Agents)
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How Agents Use Scripts</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Agent clicks "Make Call" button</li>
                    <li>If scripts enabled, draggable script dialog appears automatically</li>
                    <li>Agent can:
                      <ul className="list-disc ml-10 mt-1 space-y-1 text-xs">
                        <li>Move dialog anywhere on screen</li>
                        <li>Resize to preferred size</li>
                        <li>Read prompts while talking</li>
                        <li>Click "Next" to move through steps</li>
                        <li>Take notes in the notes field</li>
                      </ul>
                    </li>
                    <li>Close dialog when call ends</li>
                  </ol>
                </div>

                <div className="bg-white border-2 border-violet-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-violet-900">Example: Call Script Dialog</h5>
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 bg-violet-100 rounded">← Prev</button>
                      <button className="text-xs px-2 py-1 bg-violet-600 text-white rounded">Next →</button>
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded p-3 text-sm">
                    <div className="font-semibold mb-2">Step 1: Opening</div>
                    <p className="text-gray-700 mb-2">
                      "Good [morning/afternoon], my name is [Your Name] from BTMTravel. 
                      Am I speaking with [Contact Name]?"
                    </p>
                    <div className="text-xs text-gray-600 italic">
                      Wait for confirmation, then proceed to next step
                    </div>
                  </div>
                  <div className="mt-3">
                    <textarea 
                      className="w-full text-xs p-2 border rounded" 
                      placeholder="Take notes here..."
                      rows={2}
                    />
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <strong>Tip:</strong> Scripts are guides, not strict rules. Adjust tone and wording to match the conversation naturally
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="editing-scripts">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-orange-500" />
                  Editing & Managing Scripts
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">How to Edit a Script</h4>
                  <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 text-sm">
                    <li>Go to Admin Settings → Call Scripts tab</li>
                    <li>Find the script you want to edit</li>
                    <li>Click "Edit" button</li>
                    <li>Make your changes</li>
                    <li>Click "Save Changes"</li>
                    <li>Updated script is immediately available to agents</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Deleting Scripts</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Find script in Call Scripts tab</li>
                    <li>Click "Delete" button</li>
                    <li>Confirm deletion</li>
                    <li>Script is permanently removed</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Best Practice:</strong> Review and update scripts quarterly based on agent feedback and performance data
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function TroubleshootingContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-rose-600" />
            Troubleshooting
          </CardTitle>
          <CardDescription>Common issues and solutions for BTMTravel CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            
            <AccordionItem value="login-issues">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-red-500" />
                  Login Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h5 className="font-semibold text-red-900 text-sm">❌ "Invalid username or password"</h5>
                    <ul className="list-disc list-inside text-xs text-red-700 mt-2 ml-4">
                      <li>Double-check username spelling (case-sensitive)</li>
                      <li>Verify password is correct</li>
                      <li>Ensure Caps Lock is off</li>
                      <li>Contact admin to reset password if forgotten</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">⚠️ Page won't load after login</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Clear browser cache and cookies</li>
                      <li>Try refreshing the page (F5)</li>
                      <li>Try a different browser</li>
                      <li>Check your internet connection</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                    <h5 className="font-semibold text-yellow-900 text-sm">⚠️ Session expires too quickly</h5>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 ml-4">
                      <li>Browser may be blocking cookies - check settings</li>
                      <li>Don't use Incognito/Private browsing mode</li>
                      <li>Ensure browser allows cookies from this site</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="3cx-issues">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-500" />
                  3CX Phone System Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h5 className="font-semibold text-red-900 text-sm">📞 Desk phone doesn't ring</h5>
                    <ul className="list-disc list-inside text-xs text-red-700 mt-2 ml-4">
                      <li>Check that desk phone is connected and powered on</li>
                      <li>Verify your extension is configured in 3CX</li>
                      <li>Make sure phone is not on DND (Do Not Disturb)</li>
                      <li>Check physical network cable connection</li>
                      <li>Contact admin to verify 3CX settings</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">🚫 3CX tab blocked by popup blocker</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Look for popup blocker icon in browser address bar</li>
                      <li>Click icon and select "Always allow popups from this site"</li>
                      <li>Add CRM domain to browser's popup exception list</li>
                      <li>Try clicking "Make Call" button again</li>
                      <li>For Chrome: Settings → Privacy → Site Settings → Popups</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                    <h5 className="font-semibold text-yellow-900 text-sm">📋 Number doesn't auto-copy</h5>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 ml-4">
                      <li>Use "Copy Number" button in toast notification</li>
                      <li>Click phone number in Active Call Panel to copy</li>
                      <li>Manually select number and copy (Ctrl+C)</li>
                      <li>Check browser clipboard permissions</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <h5 className="font-semibold text-blue-900 text-sm">❓ Can't find phone icon in 3CX</h5>
                    <ul className="list-disc list-inside text-xs text-blue-700 mt-2 ml-4">
                      <li>Check top navigation bar for phone/dialpad icon</li>
                      <li>Look for "People" or "Contacts" section</li>
                      <li>Try clicking your profile icon</li>
                      <li>Refresh the 3CX page (F5)</li>
                      <li>Try logging out and back into 3CX</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                    <h5 className="font-semibold text-purple-900 text-sm">🔇 No audio during call</h5>
                    <ul className="list-disc list-inside text-xs text-purple-700 mt-2 ml-4">
                      <li>Check if muted in Active Call Panel - click "Unmute"</li>
                      <li>Verify desk phone volume is turned up</li>
                      <li>Check if phone handset is properly seated</li>
                      <li>Try unplugging and replugging handset</li>
                      <li>Contact IT if problem persists</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="email-issues">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-500" />
                  Email System Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h5 className="font-semibold text-red-900 text-sm">❌ "Email not configured" error</h5>
                    <ul className="list-disc list-inside text-xs text-red-700 mt-2 ml-4">
                      <li>SMTP settings not configured - contact admin</li>
                      <li>Admin must set up SMTP in Admin Settings</li>
                      <li>Cannot send emails until configured</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">📧 Emails not sending</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Check SMTP configuration in Admin Settings</li>
                      <li>Verify SMTP credentials are correct</li>
                      <li>Test SMTP connection using "Test Connection" button</li>
                      <li>Check if email provider requires app-specific password</li>
                      <li>Verify firewall isn't blocking SMTP port (587 or 465)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                    <h5 className="font-semibold text-yellow-900 text-sm">⏱️ Email sending slow</h5>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 ml-4">
                      <li>Normal - SMTP can take 10-30 seconds</li>
                      <li>Don't click "Send" multiple times</li>
                      <li>Wait for confirmation toast</li>
                      <li>Check internet connection speed</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="browser-issues">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-blue-500" />
                  Browser & Performance Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">🐌 CRM running slow</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Close unnecessary browser tabs</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Restart your browser</li>
                      <li>Check if other programs are using resources</li>
                      <li>Try using Chrome or Edge (recommended browsers)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <h5 className="font-semibold text-blue-900 text-sm">🖥️ Recommended Browser Settings</h5>
                    <ul className="list-disc list-inside text-xs text-blue-700 mt-2 ml-4">
                      <li>Use latest version of Chrome, Edge, or Firefox</li>
                      <li>Enable JavaScript</li>
                      <li>Allow cookies from this site</li>
                      <li>Disable ad blockers for CRM domain</li>
                      <li>Allow popups for 3CX integration</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h5 className="font-semibold text-green-900 text-sm">✨ Page not displaying correctly</h5>
                    <ul className="list-disc list-inside text-xs text-green-700 mt-2 ml-4">
                      <li>Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)</li>
                      <li>Clear cache and reload</li>
                      <li>Check browser zoom level (should be 100%)</li>
                      <li>Try different browser</li>
                      <li>Disable browser extensions temporarily</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-issues">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Data & Record Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h5 className="font-semibold text-red-900 text-sm">❌ Can't save contact/customer</h5>
                    <ul className="list-disc list-inside text-xs text-red-700 mt-2 ml-4">
                      <li>Check all required fields are filled</li>
                      <li>Verify phone number format: +234 XXX XXX XXXX</li>
                      <li>Ensure email address is valid</li>
                      <li>Try refreshing and saving again</li>
                      <li>Check internet connection</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-orange-900 text-sm">🔍 Can't find a record</h5>
                    <ul className="list-disc list-inside text-xs text-orange-700 mt-2 ml-4">
                      <li>Use search bar - search by name, email, or phone</li>
                      <li>Clear any active filters</li>
                      <li>Check if record was archived (admins: check Archive Manager)</li>
                      <li>Verify you're in correct tab (CRM vs Customer Service)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
                    <h5 className="font-semibold text-yellow-900 text-sm">📊 Progress not updating</h5>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-2 ml-4">
                      <li>Refresh the page (F5)</li>
                      <li>Ensure call was properly logged</li>
                      <li>Check if call was made today (progress is daily)</li>
                      <li>Wait 5-10 seconds for sync</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="need-help">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-500" />
                  Still Need Help?
                </div>
              </AccordionTrigger>
              <AccordionContent className="ml-7 space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Contact Support</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    If you've tried the troubleshooting steps and still experiencing issues:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                    <li><strong>Contact your Administrator</strong> - They can check system settings and logs</li>
                    <li><strong>Provide details:</strong>
                      <ul className="list-circle ml-6 mt-1 space-y-1 text-xs">
                        <li>What you were trying to do</li>
                        <li>Exact error message (if any)</li>
                        <li>Browser and version you're using</li>
                        <li>When the issue started</li>
                        <li>Steps to reproduce the problem</li>
                      </ul>
                    </li>
                    <li><strong>Take a screenshot</strong> if you see an error message</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Tip:</strong> Most issues can be resolved by clearing cache, refreshing the page, or logging out and back in
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
