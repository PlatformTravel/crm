import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Resizable } from 're-resizable';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';

interface DraggableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export function DraggableDialog({
  isOpen,
  onClose,
  title,
  children,
  defaultWidth = 700,
  defaultHeight = 600,
  minWidth = 400,
  minHeight = 300
}: DraggableDialogProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState({ 
    position: { x: 0, y: 0 }, 
    size: { width: defaultWidth, height: defaultHeight } 
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Center dialog on mount
  useEffect(() => {
    if (isOpen && !isDragging && position.x === 0 && position.y === 0) {
      const centerX = (window.innerWidth - defaultWidth) / 2;
      const centerY = Math.max(50, (window.innerHeight - defaultHeight) / 2);
      setPosition({ x: centerX, y: centerY });
    }
  }, [isOpen, defaultWidth, defaultHeight]);

  // Handle window resize to keep dialog in bounds
  useEffect(() => {
    const handleResize = () => {
      if (!isMaximized) {
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        setPosition(prev => ({
          x: Math.min(prev.x, Math.max(0, maxX)),
          y: Math.min(prev.y, Math.max(0, maxY))
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size, isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep dialog within viewport bounds
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, size]);

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous state
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
      setIsMaximized(false);
    } else {
      // Save current state and maximize
      setPreMaximizeState({ position, size });
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMaximized(true);
    }
  };

  if (!isOpen) return null;

  const dialogContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div
        ref={dialogRef}
        className="fixed"
        style={{
          left: isMaximized ? 0 : position.x,
          top: isMaximized ? 0 : position.y,
          width: isMaximized ? '100vw' : 'auto',
          height: isMaximized ? '100vh' : 'auto',
          zIndex: 9999,
        }}
      >
        <Resizable
          size={isMaximized ? { width: '100%', height: '100%' } : size}
          onResizeStop={(e, direction, ref, d) => {
            if (!isMaximized) {
              setSize({
                width: size.width + d.width,
                height: size.height + d.height
              });
            }
          }}
          minWidth={isMaximized ? '100%' : minWidth}
          minHeight={isMaximized ? '100%' : minHeight}
          enable={isMaximized ? false : {
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          }}
          className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        >
          {/* Header - Draggable */}
          <div
            className="drag-handle flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <h3 className="font-semibold pointer-events-none">{title}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaximize}
                className="hover:bg-white/20 text-white h-8 w-8 p-0"
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-white/20 text-white h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </Resizable>
      </div>
    </>
  );

  // Render in a portal to ensure it's at the top level of the DOM
  return createPortal(dialogContent, document.body);
}

