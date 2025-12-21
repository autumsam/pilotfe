
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Globe, BellRing, Lock, CreditCard } from "lucide-react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const form = useForm({
    defaultValues: {
      siteName: "PostPulse",
      siteUrl: "https://postpulse.com",
      supportEmail: "support@postpulse.com",
    },
  });

  const handleSaveGeneral = (data) => {
    console.log("Saved general settings:", data);
    toast.success("General settings saved successfully");
  };
  
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>
              Configure general site settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveGeneral)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Site name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your site as it appears to users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The full URL of your site.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email address for support inquiries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Manage API keys and integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input value="sk_live_•••••••••••••••••••••••••••" readOnly />
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This is your private API key. Keep it secure and never share it publicly.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input placeholder="https://your-site.com/webhook" />
              <p className="text-sm text-muted-foreground">
                URL where system notifications will be sent.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save API Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Email Notifications
            </CardTitle>
            <CardDescription>
              Configure system email notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user-notifications">User notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send emails when users register, update profiles, etc.
                </p>
              </div>
              <Switch 
                id="user-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails">Marketing emails</Label>
                <p className="text-sm text-muted-foreground">
                  Send promotional emails to users.
                </p>
              </div>
              <Switch 
                id="marketing-emails" 
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Notification settings saved")}>
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" /> System Alerts
            </CardTitle>
            <CardDescription>
              Configure system alert thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Storage alert threshold (%)</Label>
              <Input type="number" defaultValue="80" />
            </div>
            <div className="space-y-2">
              <Label>API rate limit alert threshold (%)</Label>
              <Input type="number" defaultValue="90" />
            </div>
            <div className="space-y-2">
              <Label>Alert recipients</Label>
              <Input placeholder="admin@example.com, tech@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Alert Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Security Settings
            </CardTitle>
            <CardDescription>
              Configure security options for your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require all users to set up 2FA for added security.
                </p>
              </div>
              <Switch 
                id="two-factor" 
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Password policy</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="pwd-length" defaultChecked />
                  <Label htmlFor="pwd-length">Minimum 8 characters</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="pwd-uppercase" defaultChecked />
                  <Label htmlFor="pwd-uppercase">Require uppercase letters</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="pwd-number" defaultChecked />
                  <Label htmlFor="pwd-number">Require numbers</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="pwd-special" defaultChecked />
                  <Label htmlFor="pwd-special">Require special characters</Label>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Session timeout (minutes)</Label>
              <Input type="number" defaultValue="60" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Security settings saved")}>
              Save Security Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="billing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Billing Settings
            </CardTitle>
            <CardDescription>
              Configure billing and subscription options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default currency</Label>
              <select className="w-full p-2 border rounded">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="kes">KES (KSh)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Payment Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="payment-card" defaultChecked />
                  <Label htmlFor="payment-card">Credit/Debit Cards</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="payment-paypal" defaultChecked />
                  <Label htmlFor="payment-paypal">PayPal</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="checkbox" className="w-4 h-4" id="payment-mpesa" defaultChecked />
                  <Label htmlFor="payment-mpesa">M-Pesa</Label>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Company Details</Label>
              <Input placeholder="Company Name" />
              <Input placeholder="VAT/Tax ID" />
              <Input placeholder="Billing Address" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Billing settings saved")}>
              Save Billing Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Settings;
