import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { InstallButton } from '@/components/InstallButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, Copy, CheckCircle, Clock, AlertCircle, Gift, Users, TrendingUp } from 'lucide-react';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      console.log('Saving profile:', formData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
          </div>
          <InstallButton variant="outline" size="sm" showText={true} />
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            <Card className="p-8">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar */}
                <div className="space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>{formData.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Avatar
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
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">KYC Verification Status</h3>
                  <div className="space-y-4">
                    {/* Level 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold">Level 1: Basic Verification</h4>
                        <p className="text-sm text-muted-foreground mt-1">Email and phone verified</p>
                        <Badge className="mt-2 bg-green-500/20 text-green-700">Completed</Badge>
                      </div>
                    </div>

                    {/* Level 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/50">
                      <Clock className="w-5 h-5 text-yellow-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold">Level 2: Identity Verification</h4>
                        <p className="text-sm text-muted-foreground mt-1">Submit government ID and selfie</p>
                        <Button size="sm" className="mt-2">Start Verification</Button>
                      </div>
                    </div>

                    {/* Level 3 */}
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/50">
                      <AlertCircle className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold">Level 3: Advanced Verification</h4>
                        <p className="text-sm text-muted-foreground mt-1">Bank account and income verification</p>
                        <Badge variant="outline" className="mt-2">Locked</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <p className="text-sm text-muted-foreground">
                    Higher KYC levels unlock increased transaction limits and exclusive features.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Referral Program</h3>
                  <p className="text-muted-foreground mb-6">Earn rewards by inviting friends to FLATRA</p>
                </div>

                {/* Referral Link */}
                <div className="space-y-2">
                  <Label>Your Referral Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value="https://flatra.app/ref/john-doe-12345"
                      readOnly
                      className="bg-muted"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Referral Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-card/50">
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-sm text-muted-foreground">Friends Invited</p>
                  </Card>
                  <Card className="p-4 bg-card/50">
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-sm text-muted-foreground">Signed Up</p>
                  </Card>
                  <Card className="p-4 bg-card/50">
                    <div className="text-2xl font-bold">$240</div>
                    <p className="text-sm text-muted-foreground">Earned</p>
                  </Card>
                </div>

                {/* Recent Referrals */}
                <div>
                  <h4 className="font-semibold mb-4">Recent Referrals</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Alice Johnson', date: '2 days ago', status: 'Active' },
                      { name: 'Bob Smith', date: '1 week ago', status: 'Active' },
                      { name: 'Carol White', date: '2 weeks ago', status: 'Pending' },
                    ].map((ref, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-xs text-muted-foreground">{ref.date}</p>
                        </div>
                        <Badge variant={ref.status === 'Active' ? 'default' : 'secondary'}>
                          {ref.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6 mt-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rewards Dashboard</h3>
                  <p className="text-muted-foreground mb-6">Track your earned rewards and benefits</p>
                </div>

                {/* Total Rewards */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Total Rewards Earned</p>
                  <div className="text-4xl font-bold">$1,240.50</div>
                  <p className="text-sm text-muted-foreground mt-2">Available to withdraw</p>
                </div>

                {/* Reward Tiers */}
                <div>
                  <h4 className="font-semibold mb-4">Loyalty Tiers</h4>
                  <div className="space-y-4">
                    {[
                      { tier: 'Bronze', current: true, cashback: '0.5%', perks: ['Basic rewards'] },
                      { tier: 'Silver', current: false, cashback: '1%', perks: ['Enhanced rewards', 'Priority support'] },
                      { tier: 'Gold', current: false, cashback: '2%', perks: ['Premium rewards', 'VIP support', 'Exclusive events'] },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          t.current
                            ? 'border-primary bg-primary/5'
                            : 'border-border/40 bg-card/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold">{t.tier}</h5>
                          {t.current && <Badge>Current</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Cashback: {t.cashback}</p>
                        <div className="flex flex-wrap gap-1">
                          {t.perks.map((perk, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {perk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reward History */}
                <div>
                  <h4 className="font-semibold mb-4">Recent Rewards</h4>
                  <div className="space-y-2">
                    {[
                      { type: 'Referral Bonus', amount: '+$50', date: '3 days ago' },
                      { type: 'Transaction Cashback', amount: '+$12.50', date: '1 week ago' },
                      { type: 'Loyalty Bonus', amount: '+$25', date: '2 weeks ago' },
                    ].map((reward, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Gift className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{reward.type}</p>
                            <p className="text-xs text-muted-foreground">{reward.date}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">{reward.amount}</p>
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
