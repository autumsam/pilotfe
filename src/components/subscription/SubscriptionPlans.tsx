
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for personal use",
    price: 0,
    features: [
      "3 posts per day",
      "Basic analytics",
      "Single user account",
      "Community support"
    ],
    cta: "Current Plan"
  },
  {
    id: "basic",
    name: "Basic",
    description: "Everything in Free plus more features",
    price: 9.99,
    features: [
      "10 posts per day",
      "Advanced analytics",
      "3 user accounts",
      "Priority support",
      "AI post suggestions"
    ],
    cta: "Upgrade"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Professional features for growing businesses",
    price: 29.99,
    features: [
      "Unlimited posts",
      "Premium analytics",
      "10 user accounts",
      "24/7 priority support",
      "Advanced AI tools",
      "Custom branding"
    ],
    cta: "Upgrade"
  }
];

const SubscriptionPlans = () => {
  const [currentPlan] = useState("free");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckout = () => {
    toast.success(`Successfully upgraded to ${selectedPlan.name} plan!`);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${currentPlan === plan.id ? "border-primary shadow-md" : ""}`}
          >
            <CardHeader className={currentPlan === plan.id ? "bg-primary/10" : ""}>
              {currentPlan === plan.id && (
                <div className="mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                    Current Plan
                  </span>
                </div>
              )}
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentPlan !== plan.id ? (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade(plan)}
                  disabled={plan.id === "free"}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Subscribe to the {selectedPlan?.name} plan for ${selectedPlan?.price}/month
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
              <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="John Doe" />
              </div>
            </TabsContent>
            
            <TabsContent value="paypal" className="py-4">
              <div className="text-center space-y-4">
                <div className="rounded-lg bg-blue-50 p-6 flex items-center justify-center">
                  <div className="text-2xl font-bold text-blue-600">PayPal</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to PayPal to complete your payment.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="mpesa" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="07XX XXX XXX" />
                </div>
                <div className="rounded-lg bg-green-50 p-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700">
                    You'll receive an M-Pesa prompt on your phone to complete the payment.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 space-y-2">
            <Button className="w-full" onClick={handleCheckout}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${selectedPlan?.price}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By confirming your subscription, you allow PostPulse to charge your card for this payment and future payments in accordance with their terms.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
