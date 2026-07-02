import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Lock, Smartphone, Bell, Trash2, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => toggleTheme?.()}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/5'
                          : 'border-border/40 hover:border-border/60'
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => toggleTheme?.()}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/5'
                          : 'border-border/40 hover:border-border/60'
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-medium">Dark</p>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing and font sizes</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                {/* Password */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Two-Factor Authentication</p>
                          {twoFAEnabled && (
                            <Badge className="bg-green-500/20 text-green-700">Enabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {twoFAEnabled
                            ? 'Your account is protected with 2FA'
                            : 'Add an extra layer of security'}
                        </p>
                      </div>
                      <Switch
                        checked={twoFAEnabled}
                        onCheckedChange={setTwoFAEnabled}
                      />
                    </div>

                    {/* Biometric Login */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium">Biometric Login</p>
                        <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                      </div>
                      <Switch
                        checked={biometricEnabled}
                        onCheckedChange={setBiometricEnabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="pt-4 border-t border-border/40">
                  <h4 className="font-semibold mb-4">Active Sessions</h4>
                  <div className="space-y-2">
                    {[
                      { device: 'Chrome on MacOS', location: 'San Francisco, CA', current: true },
                      { device: 'Safari on iPhone', location: 'San Francisco, CA', current: false },
                      { device: 'Chrome on Windows', location: 'New York, NY', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/40">
                        <div>
                          <p className="font-medium text-sm">{session.device}</p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.current && <Badge variant="secondary">Current</Badge>}
                          <Button variant="ghost" size="sm">
                            <LogOut className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connected Devices</h3>
                  <p className="text-muted-foreground mb-6">Manage devices that have access to your account</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'MacBook Pro', type: 'Desktop', lastActive: 'Now', trusted: true },
                    { name: 'iPhone 14 Pro', type: 'Mobile', lastActive: '2 hours ago', trusted: true },
                    { name: 'iPad Air', type: 'Tablet', lastActive: '1 day ago', trusted: false },
                    { name: 'Windows PC', type: 'Desktop', lastActive: '3 days ago', trusted: false },
                  ].map((device, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50">
                      <div className="flex items-center gap-4">
                        <Smartphone className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.type} • Last active: {device.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.trusted && (
                          <Badge className="bg-green-500/20 text-green-700">Trusted</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                </div>

                {/* Email Notifications */}
                <div>
                  <h4 className="font-semibold mb-4">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Escrow Updates', description: 'Notify me about escrow status changes' },
                      { label: 'Transaction Alerts', description: 'Notify me about incoming/outgoing transfers' },
                      { label: 'Security Alerts', description: 'Notify me about account security events' },
                      { label: 'Marketing Emails', description: 'Receive promotional offers and updates' },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{notif.label}</p>
                          <p className="text-xs text-muted-foreground">{notif.description}</p>
                        </div>
                        <Switch defaultChecked={i < 3} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="pt-4 border-t border-border/40">
                  <h4 className="font-semibold mb-4">Push Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Urgent Alerts', description: 'Critical account notifications' },
                      { label: 'Transaction Notifications', description: 'Real-time transaction updates' },
                      { label: 'Promotional', description: 'Special offers and announcements' },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{notif.label}</p>
                          <p className="text-xs text-muted-foreground">{notif.description}</p>
                        </div>
                        <Switch defaultChecked={i < 2} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
