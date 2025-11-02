import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./ui/drawer";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { Phone, Star, CheckCircle, Search, Calendar, X, Sparkles, Target, Eye, Info } from "lucide-react";
import { backendService } from "../utils/backendService";
import { useUser } from "./UserContext";
import { useThreeCX } from "./ThreeCXContext";
import { useIsMobile } from "./ui/use-mobile";

interface SpecialAssignment {
  id: string;
  phoneNumber: string;
  purpose: string;
  notes?: string;
  assignedAt: string;
  called: boolean;
  completedAt?: string;
  numberData?: {
    phoneNumber: string;
    name?: string;
    purpose?: string;
    notes?: string;
  };
}

export function SpecialNumbers() {
  const { currentUser } = useUser();
  const { makeCall } = useThreeCX();
  const isMobile = useIsMobile();
  const [assignments, setAssignments] = useState<SpecialAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<SpecialAssignment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [isCompletingCall, setIsCompletingCall] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, [currentUser]);

  const loadAssignments = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const data = await backendService.getAssignments(currentUser.id);
      
      // Filter only special assignments (include both pending and completed for accurate counts)
      const specialAssignments = (data.assignments || [])
        .filter((a: any) => a.type === 'special')
        .map((a: any) => ({
          id: a.id,
          phoneNumber: a.phoneNumber,
          purpose: a.purpose || a.numberData?.purpose || 'Special Number',
          notes: a.notes || a.numberData?.notes || '',
          assignedAt: a.assignedAt,
          called: a.called || false,
          completedAt: a.completedAt,
          numberData: a.numberData
        }));

      setAssignments(specialAssignments);
      console.log(`[SPECIAL NUMBERS] Loaded ${specialAssignments.length} special assignments`);
    } catch (error) {
      console.error('[SPECIAL NUMBERS] Failed to load assignments:', error);
      toast.error('Failed to load special numbers. Please check backend connection.');
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (assignment: SpecialAssignment) => {
    setSelectedAssignment(assignment);
    setCallNotes("");
    setIsDetailsDialogOpen(true);
  };

  const handleCallFromDetails = () => {
    if (!selectedAssignment) return;
    
    // Make the call via 3CX only
    makeCall(selectedAssignment.phoneNumber);
    
    toast.success('Call initiated via 3CX!');
  };

  const handleCompleteCall = async () => {
    if (!selectedAssignment) return;

    try {
      setIsCompletingCall(true);
      
      await backendService.completeSpecialCall(selectedAssignment.id, callNotes);
      
      toast.success('Call completed and number archived!');
      setIsDetailsDialogOpen(false);
      setSelectedAssignment(null);
      setCallNotes("");
      
      // Reload assignments
      await loadAssignments();
    } catch (error: any) {
      console.error('[SPECIAL NUMBERS] Failed to complete call:', error);
      toast.error(error.message || 'Failed to complete call');
    } finally {
      setIsCompletingCall(false);
    }
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(a => {
    const searchLower = searchQuery.toLowerCase();
    return (
      !a.called && (
        a.phoneNumber.toLowerCase().includes(searchLower) ||
        a.purpose.toLowerCase().includes(searchLower) ||
        (a.notes && a.notes.toLowerCase().includes(searchLower))
      )
    );
  });

  const pendingCount = assignments.filter(a => !a.called).length;
  const completedCount = assignments.filter(a => a.called).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Star className="w-6 h-6 text-purple-600" />
                Special Numbers
              </CardTitle>
              <CardDescription>
                High-priority numbers assigned for specific purposes
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by phone number, purpose, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Special Assignments ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading special numbers...
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No matching special numbers found' : 'No special numbers assigned yet'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Special numbers will appear here when assigned by your manager'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-purple-50/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span className="font-mono font-semibold">{assignment.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            {assignment.purpose}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {assignment.notes ? (
                            <p className="text-sm text-gray-600 line-clamp-2" title={assignment.notes}>
                              {assignment.notes}
                            </p>
                          ) : (
                            <span className="text-gray-400 text-sm italic">No notes</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(assignment.assignedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleViewDetails(assignment)}
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog/Drawer - Responsive */}
      {isMobile ? (
        <Drawer open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Special Number Details
              </DrawerTitle>
              <DrawerDescription>
                Review details and initiate call for this special assignment
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[60vh] px-4">
              {selectedAssignment && (
                <div className="space-y-4 pb-4">
                  {/* Assignment Information */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200">
                      <div className="space-y-2.5">
                        {/* Phone Number */}
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Phone Number</div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span className="font-mono font-bold text-purple-900 text-sm break-all">
                              {selectedAssignment.phoneNumber}
                            </span>
                          </div>
                        </div>

                        <Separator className="bg-purple-200" />

                        {/* Purpose */}
                        <div>
                          <div className="text-xs text-gray-600 mb-1.5">Purpose</div>
                          <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-xs px-2 py-0.5">
                            {selectedAssignment.purpose}
                          </Badge>
                        </div>

                        {/* Assignment Date */}
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Assigned Date</div>
                          <div className="flex items-center gap-1.5 text-gray-700 text-sm">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-xs">{new Date(selectedAssignment.assignedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {selectedAssignment.notes && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-amber-900 mb-1">Important Notes</div>
                            <p className="text-xs text-amber-800">{selectedAssignment.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Call Notes - Always visible */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Call Notes (Optional)</label>
                    <Textarea
                      placeholder="Add any notes about this call..."
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      rows={3}
                      className="resize-none text-xs"
                    />
                  </div>
                </div>
              )}
            </ScrollArea>

            <DrawerFooter>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  onClick={handleCallFromDetails}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call Now
                </Button>
                <Button
                  onClick={handleCompleteCall}
                  disabled={isCompletingCall}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {isCompletingCall ? 'Completing...' : 'Complete'}
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Special Number Details
              </DialogTitle>
              <DialogDescription>
                Review details and initiate call for this special assignment
              </DialogDescription>
            </DialogHeader>

            {selectedAssignment && (
              <div className="space-y-6">
                {/* Assignment Information */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                    <div className="space-y-3">
                      {/* Phone Number */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-purple-600" />
                          <span className="font-mono text-lg font-bold text-purple-900">
                            {selectedAssignment.phoneNumber}
                          </span>
                        </div>
                      </div>

                      <Separator className="bg-purple-200" />

                      {/* Purpose */}
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Purpose</div>
                        <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-sm px-3 py-1">
                          {selectedAssignment.purpose}
                        </Badge>
                      </div>

                      {/* Assignment Date */}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Assigned Date</div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(selectedAssignment.assignedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {selectedAssignment.notes && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-amber-900 mb-1">Important Notes</div>
                          <p className="text-sm text-amber-800">{selectedAssignment.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call Notes - Always visible */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Call Notes (Optional)</label>
                  <Textarea
                    placeholder="Add any notes about this call..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsDialogOpen(false)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Close
                  </Button>
                  <Button
                    onClick={handleCallFromDetails}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call Now
                  </Button>
                  <Button
                    onClick={handleCompleteCall}
                    disabled={isCompletingCall}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {isCompletingCall ? 'Completing...' : 'Complete Call'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}


    </div>
  );
}
