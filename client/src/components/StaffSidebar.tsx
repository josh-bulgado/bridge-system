import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  CreditCard,
  Download,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Building,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Zap,
} from 'lucide-react';

interface PendingCounts {
  requests: number;
  verifications: number;
  generations: number;
}

interface StaffSidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  pendingCounts: PendingCounts;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge?: number;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({
  activeRoute,
  onNavigate,
  pendingCounts,
  className,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pulsingBadges, setPulsingBadges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pulse animation for new badges
  useEffect(() => {
    const newPulsingBadges: string[] = [];
    if (pendingCounts.requests > 0) newPulsingBadges.push('requests');
    if (pendingCounts.verifications > 0) newPulsingBadges.push('verification');
    if (pendingCounts.generations > 0) newPulsingBadges.push('generation');
    
    setPulsingBadges(newPulsingBadges);
    
    // Stop pulsing after 3 seconds
    const timer = setTimeout(() => {
      setPulsingBadges([]);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [pendingCounts]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/staff',
    },
    {
      id: 'requests',
      label: 'All Requests',
      icon: FileText,
      route: '/staff/requests',
      badge: pendingCounts.requests > 0 ? pendingCounts.requests : undefined,
    },
    {
      id: 'verification',
      label: 'Payment Verification',
      icon: CreditCard,
      route: '/staff/payment-verification',
      badge: pendingCounts.verifications > 0 ? pendingCounts.verifications : undefined,
    },
    {
      id: 'generation',
      label: 'Document Generation',
      icon: Download,
      route: '/staff/document-generation',
      badge: pendingCounts.generations > 0 ? pendingCounts.generations : undefined,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      route: '/staff/reports',
    },
  ];

  const bottomItems: NavigationItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      route: '/staff/settings',
    },
    {
      id: 'help',
      label: 'Get Help',
      icon: HelpCircle,
      route: '/staff/help',
    },
  ];

  const handleItemClick = (route: string, itemId?: string) => {
    setIsLoading(true);
    
    // Add loading state animation
    setTimeout(() => {
      onNavigate(route);
      setIsMobileOpen(false); // Close mobile menu on navigation
      setIsLoading(false);
    }, 200);

    // Clear pulsing badge for clicked item
    if (itemId && pulsingBadges.includes(itemId)) {
      setPulsingBadges(prev => prev.filter(badge => badge !== itemId));
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemHover = (itemId: string | null) => {
    setHoveredItem(itemId);
  };

  const renderNavigationItem = (item: NavigationItem, isActive: boolean) => {
    const isHovered = hoveredItem === item.id;
    const isPulsing = pulsingBadges.includes(item.id);
    const hasNewActivity = item.badge && item.badge > 0;
    
    return (
      <div
        key={item.id}
        className="relative group"
        onMouseEnter={() => handleItemHover(item.id)}
        onMouseLeave={() => handleItemHover(null)}
      >
        <button
          onClick={() => handleItemClick(item.route, item.id)}
          disabled={isLoading}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
            'transition-all duration-300 ease-out transform-gpu',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isActive && [
              'bg-gradient-to-r from-green-100 to-green-50',
              'text-green-800 font-semibold shadow-sm border-l-4 border-green-500',
              'scale-[1.02]'
            ],
            !isActive && [
              'text-gray-700 hover:text-gray-900',
              isHovered && 'scale-[1.01] shadow-sm bg-gray-50'
            ],
            isCollapsed && 'justify-center px-2',
            isLoading && 'animate-pulse'
          )}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
        >
          {/* Icon with hover animation */}
          <div className="relative">
            <item.icon 
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-all duration-300',
                isActive && 'text-green-600',
                isHovered && !isActive && 'scale-110 text-blue-600',
                hasNewActivity && 'animate-bounce duration-1000'
              )} 
            />
            
            {/* Activity indicator */}
            {hasNewActivity && !isCollapsed && (
              <div className={cn(
                'absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full',
                'animate-ping duration-1000',
                isPulsing ? 'opacity-100' : 'opacity-0'
              )} />
            )}
          </div>

          {!isCollapsed && (
            <>
              <span className={cn(
                'flex-1 truncate transition-all duration-300',
                isHovered && !isActive && 'translate-x-1'
              )}>
                {item.label}
              </span>
              
              {/* Enhanced badge with animations */}
              {item.badge && (
                <div className="relative">
                  <span className={cn(
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5',
                    'bg-red-500 text-white text-xs font-medium rounded-full',
                    'transition-all duration-300 transform-gpu',
                    isPulsing && 'animate-pulse scale-110',
                    isHovered && 'scale-110 shadow-lg',
                    isActive && 'bg-red-600'
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                  
                  {/* Ripple effect for new notifications */}
                  {isPulsing && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  )}
                </div>
              )}
            </>
          )}

          {/* Collapsed badge with enhanced animations */}
          {isCollapsed && item.badge && (
            <div className="absolute -top-1 -right-1">
              <span className={cn(
                'flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full',
                'transition-all duration-300 transform-gpu',
                isPulsing && 'animate-bounce scale-110',
                isHovered && 'scale-125 shadow-lg'
              )}>
                {item.badge > 9 ? '9+' : item.badge}
              </span>
              {isPulsing && (
                <span className="absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75" />
              )}
            </div>
          )}
        </button>

        {/* Tooltip for collapsed state */}
        {isCollapsed && isHovered && (
          <div className={cn(
            'absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50',
            'px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg',
            'opacity-0 animate-in fade-in-0 zoom-in-95 duration-200',
            'pointer-events-none whitespace-nowrap',
            isHovered && 'opacity-100'
          )}>
            {item.label}
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-xs rounded-full">
                {item.badge}
              </span>
            )}
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        )}

        {/* Progress indicator for active loading */}
        {isLoading && isActive && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 animate-pulse rounded-full w-full" />
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className={cn(
        'p-4 border-b border-gray-200 transition-all duration-300',
        isCollapsed && 'px-2'
      )}>
        <div className="flex items-center gap-3">
          {/* Animated Logo */}
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 cursor-pointer',
            'bg-gradient-to-br from-green-500 to-green-700 shadow-lg',
            'hover:shadow-xl hover:scale-110 hover:rotate-3 transform-gpu',
            'group'
          )}>
            <Building className={cn(
              'h-5 w-5 text-white transition-all duration-300',
              'group-hover:scale-110'
            )} />
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-lg bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
          
          {/* Animated Text */}
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className={cn(
                'text-lg font-bold text-gray-900 transition-all duration-300',
                'hover:text-green-700 cursor-default'
              )}>
                BRIDGE
              </h1>
              <p className={cn(
                'text-xs text-gray-500 transition-all duration-300',
                'hover:text-gray-700'
              )}>
                Staff Panel
              </p>
            </div>
          )}
          
          {/* Activity pulse for notifications */}
          {(pendingCounts.requests + pendingCounts.verifications + pendingCounts.generations) > 0 && (
            <div className="relative ml-auto">
              <Bell className={cn(
                'h-4 w-4 text-gray-400 transition-all duration-300',
                pulsingBadges.length > 0 && 'text-red-500 animate-bounce'
              )} />
              {pulsingBadges.length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = activeRoute === item.route;
          return renderNavigationItem(item, isActive);
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const isActive = activeRoute === item.route;
          return renderNavigationItem(item, isActive);
        })}
        
        {/* Enhanced Logout Button */}
        <div className="relative group">
          <button
            onClick={() => handleItemClick('/sign-in')}
            onMouseEnter={() => handleItemHover('logout')}
            onMouseLeave={() => handleItemHover(null)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
              'transition-all duration-300 ease-out transform-gpu',
              'text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-[1.02]',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
              'group-hover:shadow-md',
              isCollapsed && 'justify-center px-2',
              hoveredItem === 'logout' && 'bg-gradient-to-r from-red-50 to-red-25'
            )}
            aria-label="Logout"
          >
            <LogOut className={cn(
              'h-5 w-5 flex-shrink-0 transition-all duration-300',
              hoveredItem === 'logout' && 'scale-110 rotate-12'
            )} />
            {!isCollapsed && (
              <span className={cn(
                'transition-all duration-300',
                hoveredItem === 'logout' && 'translate-x-1 font-medium'
              )}>
                Logout
              </span>
            )}
          </button>

          {/* Logout tooltip for collapsed state */}
          {isCollapsed && hoveredItem === 'logout' && (
            <div className={cn(
              'absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50',
              'px-3 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg',
              'opacity-0 animate-in fade-in-0 zoom-in-95 duration-200',
              'pointer-events-none whitespace-nowrap',
              'opacity-100'
            )}>
              Logout
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Desktop Collapse Toggle */}
      <div className="hidden lg:block p-2 border-t border-gray-200">
        <button
          onClick={toggleCollapse}
          onMouseEnter={() => handleItemHover('collapse')}
          onMouseLeave={() => handleItemHover(null)}
          className={cn(
            'w-full flex items-center justify-center p-2 rounded-lg transition-all duration-300',
            'hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50',
            'hover:shadow-sm hover:scale-105 transform-gpu',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
            'group'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="relative">
            {isCollapsed ? (
              <ChevronRight className={cn(
                'h-4 w-4 text-gray-500 transition-all duration-300',
                'group-hover:text-blue-600 group-hover:scale-110'
              )} />
            ) : (
              <ChevronLeft className={cn(
                'h-4 w-4 text-gray-500 transition-all duration-300',
                'group-hover:text-blue-600 group-hover:scale-110'
              )} />
            )}
            
            {/* Pulse effect on hover */}
            <div className={cn(
              'absolute inset-0 rounded-full bg-blue-400 opacity-0',
              'group-hover:opacity-20 group-hover:animate-ping transition-opacity duration-300'
            )} />
          </div>
        </button>

        {/* Collapse tooltip */}
        {hoveredItem === 'collapse' && (
          <div className={cn(
            'absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50',
            'px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg',
            'opacity-0 animate-in fade-in-0 zoom-in-95 duration-200',
            'pointer-events-none whitespace-nowrap',
            'opacity-100'
          )}>
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Enhanced Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg border transition-all duration-300',
          'transform-gpu hover:scale-110 focus:scale-105',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          isMobileOpen 
            ? 'bg-green-600 border-green-600 text-white shadow-green-200 rotate-90' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-xl'
        )}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileOpen}
      >
        <div className="relative">
          {isMobileOpen ? (
            <X className={cn(
              'h-5 w-5 transition-all duration-300',
              'animate-in spin-in-180 zoom-in-75'
            )} />
          ) : (
            <Menu className={cn(
              'h-5 w-5 transition-all duration-300',
              'animate-in fade-in-0 zoom-in-95'
            )} />
          )}
          
          {/* Activity indicator for mobile */}
          {!isMobileOpen && (pendingCounts.requests + pendingCounts.verifications + pendingCounts.generations) > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" />
            </div>
          )}
        </div>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30',
          'bg-white border-r border-gray-200 shadow-lg backdrop-blur-sm',
          'transition-all duration-500 ease-in-out transform-gpu',
          isCollapsed ? 'lg:w-16' : 'lg:w-60',
          'hover:shadow-xl',
          className
        )}
        aria-label="Staff navigation"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(249,250,251,0.95))'
        }}
      >
        <div className={cn(
          'absolute inset-0 bg-gradient-to-b from-green-50/20 to-transparent opacity-0',
          'transition-opacity duration-300',
          (pendingCounts.requests + pendingCounts.verifications + pendingCounts.generations) > 0 && 'opacity-100'
        )} />
        <SidebarContent />
      </aside>

      {/* Enhanced Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200',
          'bg-white/95 backdrop-blur-md shadow-2xl',
          'transform transition-all duration-500 ease-out',
          isMobileOpen 
            ? 'translate-x-0 shadow-green-200/50' 
            : '-translate-x-full shadow-none'
        )}
        aria-label="Staff navigation"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(249,250,251,0.98))'
        }}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">BRIDGE</h1>
              <p className="text-xs text-gray-500">Staff Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.route)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-green-100 text-green-800 font-semibold shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-green-600')} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-medium rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          {bottomItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.route)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-green-100 text-green-800 font-semibold shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-green-600')} />
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            );
          })}
          
          {/* Mobile Logout Button */}
          <button
            onClick={() => handleItemClick('/sign-in')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Spacer for Desktop */}
      <div className={cn('hidden lg:block', isCollapsed ? 'lg:w-16' : 'lg:w-60')} />
    </>
  );
};

export default StaffSidebar;