import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  const [notifications, setNotifications] = useState({
    emailOnEscrowUpdate: true,
    emailOnTransaction: true,
    emailOnDispute: true,
    emailMarketing: false,
    pushNotifications: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications],
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // TODO: Save profile to backend
      console.log("Saving profile:", formData);
      // Show success toast
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="p-8">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar */}
                <div className="space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload New
                    </Button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Save Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/40">
                      <div>
                        <p className="font-medium">Escrow Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when escrow status changes
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailOnEscrowUpdate}
                        onCheckedChange={() => handleNotificationChange("emailOnEscrowUpdate")}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/40">
                      <div>
                        <p className="font-medium">Transaction Confirmations</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails for all transactions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailOnTransaction}
                        onCheckedChange={() => handleNotificationChange("emailOnTransaction")}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/40">
                      <div>
                        <p className="font-medium">Dispute Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when disputes are opened
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailOnDispute}
                        onCheckedChange={() => handleNotificationChange("emailOnDispute")}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailMarketing}
                        onCheckedChange={() => handleNotificationChange("emailMarketing")}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Enable Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive real-time notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={() => handleNotificationChange("pushNotifications")}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button>Save Preferences</Button>
                  <Button variant="outline">Reset to Default</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Enable Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View Active Sessions
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
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
