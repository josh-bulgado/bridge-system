import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StaffSidebar from '@/components/StaffSidebar';

const StaffSidebarDemo: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('/staff');
  const [pendingCounts, setPendingCounts] = useState({
    requests: 12,
    verifications: 5,
    generations: 8,
  });

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    console.log('Navigating to:', route);
  };

  const updateCount = (type: keyof typeof pendingCounts, value: number) => {
    setPendingCounts(prev => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Sidebar */}
      <StaffSidebar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        pendingCounts={pendingCounts}
      />
      
      {/* Demo Content */}
      <main className="lg:pl-60 min-h-screen">
        <div className="pt-16 lg:pt-0 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Staff Sidebar Demo
              </h1>
              <p className="text-gray-600">
                Interactive demo of the reusable StaffSidebar component with all features.
              </p>
            </div>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Component Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">✅ Implemented Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Fixed 240px width sidebar (60px when collapsed)</li>
                      <li>• BRIDGE logo with building icon</li>
                      <li>• Active state styling (green background)</li>
                      <li>• Hover effects and smooth transitions</li>
                      <li>• Badge counts for pending items</li>
                      <li>• Desktop collapse/expand functionality</li>
                      <li>• Mobile hamburger menu with overlay</li>
                      <li>• Accessibility support (ARIA labels)</li>
                      <li>• Logout button (red styling)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🎨 Design Elements:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Clean white background with subtle borders</li>
                      <li>• Lucide React icons (20px)</li>
                      <li>• Green accent color for active states</li>
                      <li>• Red badges for pending counts</li>
                      <li>• Responsive design for all screen sizes</li>
                      <li>• Smooth animations and transitions</li>
                      <li>• Focus states for accessibility</li>
                      <li>• Professional spacing and typography</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Controls */}
            <Card>
              <CardHeader>
                <CardTitle>🎮 Interactive Demo Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current State */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current State:</h4>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm">
                      <strong>Active Route:</strong> <code className="bg-white px-2 py-1 rounded">{activeRoute}</code>
                    </p>
                  </div>
                </div>

                {/* Badge Controls */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Badge Count Controls:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="requests">All Requests</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="requests"
                          type="number"
                          min="0"
                          value={pendingCounts.requests}
                          onChange={(e) => updateCount('requests', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCount('requests', 0)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="verifications">Payment Verification</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="verifications"
                          type="number"
                          min="0"
                          value={pendingCounts.verifications}
                          onChange={(e) => updateCount('verifications', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCount('verifications', 0)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="generations">Document Generation</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="generations"
                          type="number"
                          min="0"
                          value={pendingCounts.generations}
                          onChange={(e) => updateCount('generations', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCount('generations', 0)}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveRoute('/staff')}
                    >
                      Set Dashboard Active
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveRoute('/staff/document-generation')}
                    >
                      Set Document Generation Active
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPendingCounts({ requests: 25, verifications: 12, generations: 15 })}
                    >
                      High Badge Counts
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPendingCounts({ requests: 0, verifications: 0, generations: 0 })}
                    >
                      Clear All Badges
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>📖 Usage Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Desktop Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Click items in the sidebar to see active state changes</li>
                      <li>• Use the collapse button at the bottom to minimize the sidebar</li>
                      <li>• Hover over items to see hover effects</li>
                      <li>• Badge counts show pending items (red circles)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mobile Features:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Resize browser window to &lt;1024px to see mobile version</li>
                      <li>• Click hamburger menu button (top-left) to open sidebar</li>
                      <li>• Click overlay or X button to close mobile menu</li>
                      <li>• Sidebar automatically closes when navigation occurs</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🔧 Component Props:</h4>
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap">
{`interface StaffSidebarProps {
  activeRoute: string;           // Current active route
  onNavigate: (route: string) => void;  // Navigation handler
  pendingCounts: {               // Badge counts
    requests: number;
    verifications: number;
    generations: number;
  };
  className?: string;            // Optional CSS classes
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffSidebarDemo;