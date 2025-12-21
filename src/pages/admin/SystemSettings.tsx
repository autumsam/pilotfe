
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Settings2, Shield, Globe, Mail, Database, Key, Cpu, Copy, Eye, EyeOff, Loader2, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type APIKey, type APIKeyCreate, type Platform } from "@/services/adminApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AIConfigSection from "@/components/admin/AIConfigSection";

const SystemSettings = () => {
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showAddPlatformDialog, setShowAddPlatformDialog] = useState(false);
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    apiKey: '',
    apiSecret: ''
  });

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Load API keys on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setLoading(true);
        const [keys, availablePlatforms] = await Promise.all([
          adminApi.getAllAPIKeys(),
          adminApi.getAvailablePlatforms()
        ]);
        setApiKeys(keys);
        setPlatforms(availablePlatforms);
      } catch (error) {
        toast.error("Failed to load API keys");
        console.error("Error loading API keys:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApiKeys();
  }, []);
  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  const handleSaveAPI = () => {
    toast.success("API settings saved successfully");
  };

  const handleSaveEmail = () => {
    toast.success("Email settings saved successfully");
  };

  const handleSaveApiKey = async (platform: string, fieldType: string, value: string) => {
    if (!value || value.trim() === '') {
      toast.error("API key value cannot be empty");
      return;
    }

    try {
      // Check if key already exists
      const existingKey = apiKeys.find(
        k => k.platform === platform && k.field_type === fieldType
      );

      if (existingKey) {
        // Update existing key
        await adminApi.updateAPIKey(existingKey.id, { value });
        toast.success(`${existingKey.field_type_display} updated successfully`);
      } else {
        // Create new key
        await adminApi.createAPIKey({
          platform,
          field_type: fieldType,
          value,
          is_active: true
        });
        toast.success(`${fieldType} added successfully`);
      }

      // Reload keys
      const keys = await adminApi.getAllAPIKeys();
      setApiKeys(keys);
    } catch (error) {
      toast.error("Failed to save API key");
      console.error("Error saving API key:", error);
    }
  };

  const handleDeleteApiKey = async (keyId: number) => {
    try {
      await adminApi.deleteAPIKey(keyId);
      toast.success("API key deleted successfully");
      
      // Reload keys
      const keys = await adminApi.getAllAPIKeys();
      setApiKeys(keys);
    } catch (error) {
      toast.error("Failed to delete API key");
      console.error("Error deleting API key:", error);
    }
  };

  const handleAddCustomPlatform = async () => {
    if (!newPlatform.name.trim()) {
      toast.error("Platform name is required");
      return;
    }

    try {
      const keysToCreate: APIKeyCreate[] = [];

      if (newPlatform.apiKey.trim()) {
        keysToCreate.push({
          platform: 'custom',
          platform_display_name: newPlatform.name,
          field_type: 'api_key',
          value: newPlatform.apiKey,
          is_active: true
        });
      }

      if (newPlatform.apiSecret.trim()) {
        keysToCreate.push({
          platform: 'custom',
          platform_display_name: newPlatform.name,
          field_type: 'api_secret',
          value: newPlatform.apiSecret,
          is_active: true
        });
      }

      if (keysToCreate.length === 0) {
        toast.error("Please provide at least one API key or secret");
        return;
      }

      await adminApi.bulkCreateAPIKeys(keysToCreate);
      toast.success(`${newPlatform.name} platform added successfully`);
      
      // Reload keys
      const keys = await adminApi.getAllAPIKeys();
      setApiKeys(keys);
      
      // Reset form and close dialog
      setNewPlatform({ name: '', apiKey: '', apiSecret: '' });
      setShowAddPlatformDialog(false);
    } catch (error) {
      toast.error("Failed to add platform");
      console.error("Error adding platform:", error);
    }
  };

  const getKeyValue = (platform: string, fieldType: string): string => {
    const key = apiKeys.find(k => k.platform === platform && k.field_type === fieldType);
    return key?.masked_value || '';
  };

  const getKeyForInput = (platform: string, fieldType: string): APIKey | undefined => {
    return apiKeys.find(k => k.platform === platform && k.field_type === fieldType);
  };

  const [keyInputs, setKeyInputs] = useState<{[key: string]: string}>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const getKeyId = (platform: string, fieldType: string) => `${platform}_${fieldType}`;

  const handleKeyInputChange = (platform: string, fieldType: string, value: string) => {
    const keyId = getKeyId(platform, fieldType);
    setKeyInputs(prev => ({ ...prev, [keyId]: value }));
  };

  const handleSaveIndividualKey = async (platform: string, fieldType: string) => {
    const keyId = getKeyId(platform, fieldType);
    const value = keyInputs[keyId];

    if (!value || value.trim() === '') {
      toast.error("Please enter a value");
      return;
    }

    try {
      setSavingKey(keyId);
      await handleSaveApiKey(platform, fieldType, value);
      
      // Clear input after save
      setKeyInputs(prev => ({ ...prev, [keyId]: '' }));
      
      // Reload keys
      const keys = await adminApi.getAllAPIKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Error saving key:", error);
    } finally {
      setSavingKey(null);
    }
  };

  const renderKeyInput = (
    platform: string,
    fieldType: string,
    label: string,
    placeholder: string
  ) => {
    const keyId = getKeyId(platform, fieldType);
    const existingKey = getKeyForInput(platform, fieldType);
    const inputValue = keyInputs[keyId] || '';
    const isSaving = savingKey === keyId;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type={showKeys[keyId] ? "text" : "password"}
              placeholder={existingKey ? existingKey.masked_value : placeholder}
              value={inputValue}
              onChange={(e) => handleKeyInputChange(platform, fieldType, e.target.value)}
              disabled={isSaving}
            />
            {existingKey && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleKeyVisibility(keyId)}
                >
                  {showKeys[keyId] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>
          {existingKey ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSaveIndividualKey(platform, fieldType)}
                disabled={isSaving || !inputValue}
                className="shrink-0"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteApiKey(existingKey.id)}
                disabled={isSaving}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => handleSaveIndividualKey(platform, fieldType)}
              disabled={isSaving || !inputValue}
              className="bg-purple-600 hover:bg-purple-700 shrink-0"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          )}
        </div>
        {existingKey && (
          <p className="text-xs text-muted-foreground">
            Current: {existingKey.masked_value} • Last updated: {new Date(existingKey.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>API Settings</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Application Name</label>
                  <Input defaultValue="PostPulse" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (GMT)</SelectItem>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-muted-foreground">Make the application temporarily unavailable to users</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Debug Mode</h4>
                    <p className="text-sm text-muted-foreground">Enable detailed error messages and logging</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">User Registration</h4>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch id="user-registration" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Announcement Message</label>
                  <Textarea 
                    placeholder="Enter a system-wide announcement message" 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveGeneral}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch id="require-2fa" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Failed Login Lockout</h4>
                    <p className="text-sm text-muted-foreground">Lock accounts after 5 failed login attempts</p>
                  </div>
                  <Switch id="login-lockout" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Password Expiration</h4>
                    <p className="text-sm text-muted-foreground">Force password reset every 90 days</p>
                  </div>
                  <Switch id="password-expiration" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input type="number" defaultValue="30" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Minimum Length</label>
                  <Input type="number" defaultValue="8" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed IP Addresses</label>
                  <Textarea 
                    placeholder="Enter IP addresses separated by commas" 
                    defaultValue="0.0.0.0/0"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to allow all IP addresses</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveSecurity}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Enable API Access</h4>
                    <p className="text-sm text-muted-foreground">Allow external applications to access API</p>
                  </div>
                  <Switch id="enable-api" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">API Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">Limit number of API calls per minute</p>
                  </div>
                  <Switch id="rate-limiting" defaultChecked />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate Limit (calls per minute)</label>
                  <Input type="number" defaultValue="60" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key Expiration (days)</label>
                  <Input type="number" defaultValue="90" />
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 flex gap-4 items-center">
                  <Key className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-medium">System API Key</h4>
                    <p className="text-sm font-mono text-muted-foreground truncate">sk_live_51N8gsiEc5c7C6VfhXVsMn0UoRbP0vq...</p>
                  </div>
                  <Button variant="outline" size="sm">Reset Key</Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">CORS Allowed Origins</label>
                  <Textarea 
                    placeholder="Enter domains separated by commas"
                    defaultValue="https://example.com,https://api.example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveAPI}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading API keys...</span>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>API Keys Management</CardTitle>
                <CardDescription>Configure API keys for social media platforms and AI services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
              {/* Security Warning */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm text-amber-800 dark:text-amber-200">Security Notice</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      These API keys grant access to external services and user data. Store them securely and never share them publicly.
                      Consider using environment variables in production and rotating keys regularly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media API Keys */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Social Media Platforms</h3>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddPlatformDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Custom Platform
                  </Button>
                </div>

                <div className="grid gap-6">
                  {/* X (Twitter) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">X</span>
                      </div>
                      <div>
                        <h4 className="font-medium">X (Twitter)</h4>
                        <p className="text-sm text-muted-foreground">Required for Twitter/X account connections and post analysis</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('twitter', 'api_key', 'API Key', 'Enter X API Key')}
                      {renderKeyInput('twitter', 'api_secret', 'API Secret', 'Enter X API Secret')}
                    </div>
                  </div>

                  {/* Meta (Facebook) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">f</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Meta (Facebook)</h4>
                        <p className="text-sm text-muted-foreground">Required for Facebook account connections and insights</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('facebook', 'app_id', 'App ID', 'Enter Facebook App ID')}
                      {renderKeyInput('facebook', 'app_secret', 'App Secret', 'Enter Facebook App Secret')}
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📷</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Instagram</h4>
                        <p className="text-sm text-muted-foreground">Required for Instagram account connections and media analysis</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('instagram', 'access_token', 'Access Token', 'Enter Instagram Access Token')}
                      {renderKeyInput('instagram', 'client_secret', 'Client Secret', 'Enter Instagram Client Secret')}
                    </div>
                  </div>

                  {/* Threads */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">@</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Threads</h4>
                        <p className="text-sm text-muted-foreground">Required for Threads account connections and post tracking</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('threads', 'app_id', 'App ID', 'Enter Threads App ID')}
                      {renderKeyInput('threads', 'app_secret', 'App Secret', 'Enter Threads App Secret')}
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">TT</span>
                      </div>
                      <div>
                        <h4 className="font-medium">TikTok</h4>
                        <p className="text-sm text-muted-foreground">Required for TikTok account connections and video analytics</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('tiktok', 'api_key', 'App Key', 'Enter TikTok App Key')}
                      {renderKeyInput('tiktok', 'api_secret', 'App Secret', 'Enter TikTok App Secret')}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">in</span>
                      </div>
                      <div>
                        <h4 className="font-medium">LinkedIn</h4>
                        <p className="text-sm text-muted-foreground">Required for LinkedIn account connections and professional networking</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                      {renderKeyInput('linkedin', 'client_id', 'Client ID', 'Enter LinkedIn Client ID')}
                      {renderKeyInput('linkedin', 'client_secret', 'Client Secret', 'Enter LinkedIn Client Secret')}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Services Configuration */}
              <AIConfigSection 
                apiKeys={apiKeys}
                onSave={async () => {
                  // Reload API keys after save
                  const keys = await adminApi.getAllAPIKeys();
                  setApiKeys(keys);
                }}
              />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Add Custom Platform Dialog */}
        <Dialog open={showAddPlatformDialog} onOpenChange={setShowAddPlatformDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Platform</DialogTitle>
              <DialogDescription>
                Add API keys for a custom platform or service
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="platform-name" className="text-sm font-medium">Platform Name</label>
                <Input
                  id="platform-name"
                  placeholder="e.g., Custom API Service"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium">API Key (Optional)</label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API Key"
                  value={newPlatform.apiKey}
                  onChange={(e) => setNewPlatform(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="api-secret" className="text-sm font-medium">API Secret (Optional)</label>
                <Input
                  id="api-secret"
                  type="password"
                  placeholder="Enter API Secret"
                  value={newPlatform.apiSecret}
                  onChange={(e) => setNewPlatform(prev => ({ ...prev, apiSecret: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPlatformDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomPlatform} className="bg-purple-600 hover:bg-purple-700">
                Add Platform
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure system email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Host</label>
                  <Input defaultValue="smtp.example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMTP Port</label>
                  <Input type="number" defaultValue="587" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP Username</label>
                    <Input defaultValue="noreply@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP Password</label>
                    <Input type="password" defaultValue="••••••••••••" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Email</label>
                  <Input defaultValue="noreply@postpulse.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Name</label>
                  <Input defaultValue="PostPulse" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Use SMTP Encryption</h4>
                    <p className="text-sm text-muted-foreground">Enable TLS for email sending</p>
                  </div>
                  <Switch id="smtp-encryption" defaultChecked />
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Test Email Settings</h4>
                      <p className="text-xs text-muted-foreground mb-3">Send a test email to verify your settings are working correctly</p>
                      <div className="flex gap-2 items-center">
                        <Input placeholder="Enter email address" className="max-w-xs" />
                        <Button size="sm" variant="outline">Send Test</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSaveEmail}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
