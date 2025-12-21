
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Sample payment methods
const paymentMethods = [
  { id: 1, type: "card", name: "Visa", last4: "4242", expMonth: 12, expYear: 2025, isDefault: true },
  { id: 2, type: "paypal", email: "jane@example.com", isDefault: false },
];

// Sample invoice history
const invoices = [
  { id: "INV-001", date: "April 1, 2023", amount: "$19.99", status: "Paid" },
  { id: "INV-002", date: "March 1, 2023", amount: "$19.99", status: "Paid" },
  { id: "INV-003", date: "February 1, 2023", amount: "$19.99", status: "Paid" },
];

const BillingSection = () => {
  const [paymentTab, setPaymentTab] = useState("card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsDialogOpen(false);
      toast.success("Payment method added successfully");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the Free plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">Basic features for personal use</p>
              </div>
            </div>
            <Button onClick={() => window.location.href = "/subscription"}>
              Upgrade Plan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Posts per day</span>
              <span className="text-xl font-bold">3</span>
            </div>
            <div className="flex flex-col p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Storage</span>
              <span className="text-xl font-bold">500 MB</span>
            </div>
            <div className="flex flex-col p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Support</span>
              <span className="text-xl font-bold">Community</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment methods
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Method</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to your account
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={paymentTab} onValueChange={setPaymentTab}>
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
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-6 flex items-center justify-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">PayPal</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to PayPal to complete the setup.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="mpesa" className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input id="phone-number" placeholder="07XX XXX XXX" />
                    </div>
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-700 dark:text-green-400">
                        You'll receive an M-Pesa prompt on your phone to confirm.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Add Payment Method"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`flex items-center justify-between p-3 border rounded-md ${
                method.isDefault ? "bg-muted border-primary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {method.type === "card" ? (
                  <>
                    <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                      Visa
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">•••• {method.last4}</p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                      PP
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">PayPal</p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.email}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your recent invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 p-3 bg-muted font-medium text-sm">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-4 p-3 border-t items-center text-sm">
                <div className="font-medium">{invoice.id}</div>
                <div>{invoice.date}</div>
                <div>{invoice.amount}</div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" /> View All Invoices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingSection;
