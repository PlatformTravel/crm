import React from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Phone, Lock, User, Clock } from 'lucide-react';

interface NumberClaimIndicatorProps {
  phoneNumber: string;
  isNumberClaimed: (phone: string) => boolean;
  isClaimedByMe: (phone: string) => boolean;
  getClaimInfo: (phone: string) => any;
  variant?: 'badge' | 'inline';
}

export function NumberClaimIndicator({
  phoneNumber,
  isNumberClaimed,
  isClaimedByMe,
  getClaimInfo,
  variant = 'badge'
}: NumberClaimIndicatorProps) {
  const claimed = isNumberClaimed(phoneNumber);
  const claimedByMe = isClaimedByMe(phoneNumber);
  const claimInfo = getClaimInfo(phoneNumber);

  if (!claimed) {
    return null;
  }

  const getTimeRemaining = () => {
    if (!claimInfo) return '';
    const now = Date.now();
    const remaining = claimInfo.expiresAt - now;
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 1) return 'expires soon';
    return `${minutes}m remaining`;
  };

  if (variant === 'inline') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs ${
              claimedByMe 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-orange-100 text-orange-700 border border-orange-300'
            }`}>
              {claimedByMe ? (
                <>
                  <Phone className="h-3 w-3" />
                  <span>You're calling this</span>
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  <span>In use by {claimInfo?.claimedByName}</span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{claimInfo?.claimedByName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{getTimeRemaining()}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {claimedByMe ? (
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0">
              <Phone className="h-3 w-3 mr-1" />
              Calling
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
              <Lock className="h-3 w-3 mr-1" />
              In Use
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>{claimInfo?.claimedByName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
