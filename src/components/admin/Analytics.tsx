
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample analytics data
const userGrowthData = [
  { name: 'Jan', users: 100 },
  { name: 'Feb', users: 120 },
  { name: 'Mar', users: 150 },
  { name: 'Apr', users: 170 },
  { name: 'May', users: 200 },
  { name: 'Jun', users: 220 },
  { name: 'Jul', users: 270 },
];

const subscriptionData = [
  { name: 'Jan', free: 70, basic: 20, premium: 10 },
  { name: 'Feb', free: 80, basic: 25, premium: 15 },
  { name: 'Mar', free: 90, basic: 35, premium: 25 },
  { name: 'Apr', free: 100, basic: 40, premium: 30 },
  { name: 'May', free: 110, basic: 50, premium: 40 },
  { name: 'Jun', free: 120, basic: 55, premium: 45 },
  { name: 'Jul', free: 130, basic: 60, premium: 80 },
];

const platformStats = [
  { title: "Total Users", value: "1,234", change: "+12% from last month" },
  { title: "Active Users", value: "923", change: "+5% from last month" },
  { title: "Paying Subscribers", value: "185", change: "+18% from last month" },
  { title: "Average Session", value: "24m", change: "+2m from last month" }
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Monthly user growth over the past 7 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  name="Total Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
            <CardDescription>
              Distribution of subscription plans over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="premium" name="Premium" stackId="a" fill="#8884d8" />
                <Bar dataKey="basic" name="Basic" stackId="a" fill="#82ca9d" />
                <Bar dataKey="free" name="Free" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Conversion Rate</CardTitle>
          <CardDescription>
            Percentage of users converting to paid plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">15.2%</div>
              <p className="text-sm text-muted-foreground">Overall conversion rate</p>
              <div className="mt-4 flex justify-center gap-8">
                <div>
                  <div className="text-2xl font-bold">8.4%</div>
                  <p className="text-xs text-muted-foreground">Free to Basic</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">6.8%</div>
                  <p className="text-xs text-muted-foreground">Basic to Premium</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
