
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import PaymentHistory from "@/components/subscription/PaymentHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("plans");
  
  // Sample subscription details - this would come from your backend in a real app
  const subscription = {
    plan: "Free",
    status: "Active",
    renewalDate: "N/A",
    paymentMethod: null
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Details about your current subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Plan</dt>
              <dd className="text-lg font-semibold">{subscription.plan}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-lg font-semibold">{subscription.status}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Next Renewal</dt>
              <dd className="text-lg font-semibold">{subscription.renewalDate}</dd>
            </div>
            <div className="space-y-1 md:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
              <dd className="text-lg">
                {subscription.paymentMethod ? (
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    {subscription.paymentMethod}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No payment method on file</span>
                )}
              </dd>
            </div>
            <div className="md:col-span-3">
              <Button variant="outline">Manage Payment Methods</Button>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <SubscriptionPlans />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscription;
