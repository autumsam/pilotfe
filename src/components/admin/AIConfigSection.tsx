import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Save, Sparkles, Check, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { adminApi, type APIKey } from "@/services/adminApi";
import authService from "@/services/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AIModel {
  value: string;
  label: string;
  description?: string;
  cost?: string;
}

interface AIProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  models: AIModel[];
  defaultModel: string;
}

const AI_PROVIDERS_BASE = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'AI',
    color: 'bg-green-600',
    description: 'GPT models for content generation and analysis',
    defaultModel: 'gpt-4-turbo-preview'
  },
  {
    id: 'grok',
    name: 'Grok AI (X.AI)',
    icon: 'X',
    color: 'bg-black',
    description: 'X\'s Grok AI for real-time insights',
    defaultModel: 'grok-beta'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: 'C',
    color: 'bg-orange-600',
    description: 'Claude models for advanced reasoning',
    defaultModel: 'claude-3-opus-20240229'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: 'G',
    color: 'bg-blue-500',
    description: 'Google\'s multimodal AI',
    defaultModel: 'gemini-pro'
  }
];

interface AIConfigSectionProps {
  apiKeys: APIKey[];
  onSave: () => void;
}

export const AIConfigSection: React.FC<AIConfigSectionProps> = ({ apiKeys, onSave }) => {
  const [configs, setConfigs] = useState<Record<string, { apiKey: string; model: string; isDefault: boolean; show: boolean }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  // Fetch available models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = authService.getToken();
        const response = await fetch(`${API_BASE_URL}/api/ai/models/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const modelsData = await response.json();
          const providersWithModels = AI_PROVIDERS_BASE.map(provider => ({
            ...provider,
            models: modelsData[provider.id] || []
          }));
          setProviders(providersWithModels);
        } else {
          // Fallback to empty models if API fails
          setProviders(AI_PROVIDERS_BASE.map(p => ({ ...p, models: [] })));
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setProviders(AI_PROVIDERS_BASE.map(p => ({ ...p, models: [] })));
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);

  useEffect(() => {
    // Initialize configs from existing API keys
    const initialConfigs: Record<string, any> = {};
    
    AI_PROVIDERS_BASE.forEach(provider => {
      const existingKey = apiKeys.find(k => k.platform === provider.id && k.field_type === 'api_key');
      initialConfigs[provider.id] = {
        apiKey: existingKey?.masked_value || '',
        model: existingKey?.model_name || provider.defaultModel,
        isDefault: existingKey?.is_default_ai || false,
        show: false
      };
    });
    
    setConfigs(initialConfigs);
  }, [apiKeys]);

  const handleSave = async (providerId: string) => {
    const config = configs[providerId];
    const existingKey = apiKeys.find(k => k.platform === providerId && k.field_type === 'api_key');
    
    // If API key hasn't changed (still masked), we're just updating model/default
    const isKeyUnchanged = config.apiKey.startsWith('****');
    
    if (!isKeyUnchanged && (!config.apiKey || config.apiKey.trim() === '')) {
      toast.error("Please enter a valid API key");
      return;
    }

    setSaving(prev => ({ ...prev, [providerId]: true }));

    try {
      // If setting as default, unset all other defaults first
      if (config.isDefault) {
        const otherDefaults = apiKeys.filter(k => k.is_default_ai && k.platform !== providerId);
        for (const key of otherDefaults) {
          await adminApi.updateAPIKey(key.id, { is_default_ai: false });
        }
      }

      const updateData: any = {
        model_name: config.model,
        is_default_ai: config.isDefault,
        is_active: true
      };
      
      // Only include API key value if it's not masked (i.e., user entered a new one)
      if (!isKeyUnchanged) {
        updateData.value = config.apiKey;
      }

      if (existingKey) {
        // Update existing
        await adminApi.updateAPIKey(existingKey.id, updateData);
      } else {
        // Create new - must have API key
        if (isKeyUnchanged) {
          toast.error("Please enter an API key to create a new configuration");
          return;
        }
        await adminApi.createAPIKey({
          platform: providerId,
          field_type: 'api_key',
          value: config.apiKey,
          model_name: config.model,
          is_default_ai: config.isDefault,
          is_active: true
        });
      }

      const providerName = providers.find(p => p.id === providerId)?.name || providerId;
      toast.success(`${providerName} configuration saved`);
      onSave();
    } catch (error: any) {
      const providerName = providers.find(p => p.id === providerId)?.name || providerId;
      toast.error(`Failed to save ${providerName} configuration: ${error.message || 'Unknown error'}`);
      console.error(error);
    } finally {
      setSaving(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const toggleKeyVisibility = (providerId: string) => {
    setConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        show: !prev[providerId].show
      }
    }));
  };

  const updateConfig = (providerId: string, field: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [field]: value
      }
    }));
  };

  const handleSetDefault = async (providerId: string) => {
    // Check if provider is configured
    const existingKey = apiKeys.find(k => k.platform === providerId && k.field_type === 'api_key');
    if (!existingKey) {
      toast.error(`Please configure ${providerId.toUpperCase()} API key first before setting as default`);
      return;
    }

    setSaving(prev => ({ ...prev, [providerId]: true }));

    try {
      // Unset all other defaults first
      const otherDefaults = apiKeys.filter(k => k.is_default_ai && k.platform !== providerId);
      for (const key of otherDefaults) {
        await adminApi.updateAPIKey(key.id, { is_default_ai: false });
      }

      // Set this one as default
      await adminApi.updateAPIKey(existingKey.id, { 
        is_default_ai: true,
        is_active: true 
      });

      const providerName = providers.find(p => p.id === providerId)?.name || providerId;
      toast.success(`${providerName} set as default AI provider`);
      
      // Update local state
      const newConfigs = { ...configs };
      Object.keys(newConfigs).forEach(key => {
        newConfigs[key] = {
          ...newConfigs[key],
          isDefault: key === providerId
        };
      });
      setConfigs(newConfigs);
      
      // Reload API keys
      onSave();
    } catch (error: any) {
      const providerName = providers.find(p => p.id === providerId)?.name || providerId;
      toast.error(`Failed to set ${providerName} as default: ${error.message || 'Unknown error'}`);
      console.error(error);
    } finally {
      setSaving(prev => ({ ...prev, [providerId]: false }));
    }
  };

  if (loadingModels) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading AI providers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">AI Services Configuration</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Select one as default
        </Badge>
      </div>

      <div className="grid gap-6">
        {providers.map((provider) => {
          const config = configs[provider.id] || { apiKey: '', model: provider.defaultModel, isDefault: false, show: false };
          const existingKey = apiKeys.find(k => k.platform === provider.id && k.field_type === 'api_key');
          const isConfigured = !!existingKey && existingKey.is_active;

          return (
            <Card key={provider.id} className={`border-2 transition-all ${config.isDefault ? 'border-purple-500 shadow-lg' : 'border-border'}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${provider.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{provider.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{provider.name}</h4>
                          {isConfigured && <Badge variant="outline" className="text-xs"><Check className="h-3 w-3 mr-1" />Active</Badge>}
                          {config.isDefault && <Badge className="text-xs bg-purple-500">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {saving[provider.id] && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <Label htmlFor={`default-${provider.id}`} className={`text-sm ${saving[provider.id] ? 'opacity-50' : 'cursor-pointer'}`}>
                        Set as Default
                      </Label>
                      <Switch
                        id={`default-${provider.id}`}
                        checked={config.isDefault}
                        onCheckedChange={() => handleSetDefault(provider.id)}
                        disabled={saving[provider.id] || Object.values(saving).some(s => s)}
                      />
                    </div>
                  </div>

                  {/* API Key Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`api-key-${provider.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`api-key-${provider.id}`}
                          type={config.show ? "text" : "password"}
                          placeholder={`Enter ${provider.name} API Key`}
                          value={config.apiKey}
                          onChange={(e) => updateConfig(provider.id, 'apiKey', e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility(provider.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {config.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <Label htmlFor={`model-${provider.id}`}>Model</Label>
                    <select
                      id={`model-${provider.id}`}
                      value={config.model}
                      onChange={(e) => updateConfig(provider.id, 'model', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      disabled={provider.models.length === 0}
                    >
                      {provider.models.length > 0 ? (
                        provider.models.map((model) => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                            {model.description ? ` - ${model.description}` : ''}
                            {model.cost ? ` (${model.cost})` : ''}
                          </option>
                        ))
                      ) : (
                        <option value={config.model}>{config.model || 'No models available'}</option>
                      )}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      {provider.models.length > 0 
                        ? 'Selected model will be used for all AI operations'
                        : 'Models will be loaded once configured'}
                    </p>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={() => handleSave(provider.id)}
                    disabled={saving[provider.id]}
                    className="w-full"
                  >
                    {saving[provider.id] ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save {provider.name} Configuration
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AIConfigSection;
