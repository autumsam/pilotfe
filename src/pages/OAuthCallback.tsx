import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { socialConnectionsApi } from "@/services/socialConnectionsApi";
import { toast } from "sonner";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Check for OAuth errors
      if (error) {
        setStatus('error');
        setMessage(`Authorization failed: ${error}`);
        toast.error(`Failed to connect: ${error}`);
        
        setTimeout(() => {
          navigate('/user-settings?tab=integrations');
        }, 3000);
        return;
      }

      if (!code || !state || !platform) {
        setStatus('error');
        setMessage('Missing required parameters');
        toast.error('Invalid callback parameters');
        
        setTimeout(() => {
          navigate('/user-settings?tab=integrations');
        }, 3000);
        return;
      }

      // Verify state matches what we stored
      const storedState = sessionStorage.getItem('oauth_state');
      const storedPlatform = sessionStorage.getItem('oauth_platform');

      if (state !== storedState || platform !== storedPlatform) {
        setStatus('error');
        setMessage('Invalid state parameter - possible security issue');
        toast.error('Security verification failed');
        
        setTimeout(() => {
          navigate('/user-settings?tab=integrations');
        }, 3000);
        return;
      }

      // Exchange code for tokens
      setMessage(`Completing ${platform} connection...`);
      
      await socialConnectionsApi.handleOAuthCallback(platform, code, state);

      setStatus('success');
      setMessage(`${platform} account connected successfully!`);
      toast.success(`${platform} account connected!`);

      // Redirect to settings after a short delay
      setTimeout(() => {
        navigate('/user/settings?tab=integrations');
      }, 2000);

    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to connect account');
      toast.error('Failed to complete connection');
      
      setTimeout(() => {
        navigate('/user/settings?tab=integrations');
      }, 3000);
    }
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      'twitter': 'Twitter/X',
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'linkedin': 'LinkedIn',
      'tiktok': 'TikTok',
      'threads': 'Threads',
    };
    return names[platform] || platform;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'processing' && 'Connecting Account'}
            {status === 'success' && 'Connection Successful'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {status === 'processing' && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-lg">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you back to settings...
                  </p>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-lg">Connection Failed</p>
                  <p className="text-sm text-muted-foreground">{message}</p>
                  <p className="text-xs text-muted-foreground">
                    Redirecting you back to settings...
                  </p>
                </div>
              </>
            )}
          </div>

          {platform && (
            <div className="text-center text-sm text-muted-foreground">
              Platform: <span className="font-medium">{getPlatformName(platform)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
