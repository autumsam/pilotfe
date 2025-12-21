
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample payment history data
const paymentHistory = [
  { 
    id: "INV-001", 
    date: "2023-07-01", 
    amount: "$29.99", 
    status: "Paid", 
    plan: "Premium", 
    paymentMethod: "Visa •••• 4242"
  },
  { 
    id: "INV-002", 
    date: "2023-06-01", 
    amount: "$29.99", 
    status: "Paid", 
    plan: "Premium", 
    paymentMethod: "Visa •••• 4242"
  },
  { 
    id: "INV-003", 
    date: "2023-05-01", 
    amount: "$9.99", 
    status: "Paid", 
    plan: "Basic", 
    paymentMethod: "Visa •••• 4242"
  },
  { 
    id: "INV-004", 
    date: "2023-04-01", 
    amount: "$9.99", 
    status: "Paid", 
    plan: "Basic", 
    paymentMethod: "M-Pesa •••• 7890"
  },
  { 
    id: "INV-005", 
    date: "2023-03-01", 
    amount: "$9.99", 
    status: "Refunded", 
    plan: "Basic", 
    paymentMethod: "PayPal"
  }
];

const PaymentHistory = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export All
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableCaption>A list of your recent payments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.plan}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invoice {payment.id}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <div className="text-2xl font-bold mb-4">PostPulse</div>
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">Invoice To:</div>
                              <div className="text-sm">Jane Cooper</div>
                              <div className="text-sm">jane@example.com</div>
                            </div>
                            <div>
                              <div className="font-medium">Invoice {payment.id}</div>
                              <div className="text-sm">Date: {payment.date}</div>
                              <div className="text-sm">Status: {payment.status}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="font-medium">Services:</div>
                          <div className="flex justify-between border-b pb-2">
                            <span>{payment.plan} Plan - Monthly Subscription</span>
                            <span>{payment.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="font-bold">{payment.amount}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 border-t pt-4">
                          <div className="font-medium">Payment Details:</div>
                          <div className="text-sm">Method: {payment.paymentMethod}</div>
                          <div className="text-sm">Date: {payment.date}</div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default PaymentHistory;
