
import { useState, useEffect } from "react";

export const useMockData = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for charts
  const socialApiData = [
    { name: "Jan", facebook: 65, twitter: 45, instagram: 70, youtube: 20 },
    { name: "Feb", facebook: 59, twitter: 49, instagram: 60, youtube: 25 },
    { name: "Mar", facebook: 80, twitter: 90, instagram: 85, youtube: 40 },
    { name: "Apr", facebook: 81, twitter: 56, instagram: 55, youtube: 30 },
    { name: "May", facebook: 56, twitter: 65, instagram: 40, youtube: 45 },
    { name: "Jun", facebook: 55, twitter: 40, instagram: 45, youtube: 50 },
    { name: "Jul", facebook: 40, twitter: 30, instagram: 20, youtube: 25 },
  ];
  
  const aiApiData = [
    { name: "Jan", content: 140, image: 50, analysis: 30 },
    { name: "Feb", content: 120, image: 45, analysis: 25 },
    { name: "Mar", content: 174, image: 60, analysis: 45 },
    { name: "Apr", content: 165, image: 70, analysis: 50 },
    { name: "May", content: 190, image: 80, analysis: 60 },
    { name: "Jun", content: 210, image: 90, analysis: 70 },
    { name: "Jul", content: 250, image: 100, analysis: 85 },
  ];
  
  const performanceData = [
    { name: "Jan", latency: 120, success: 98, errors: 2 },
    { name: "Feb", latency: 132, success: 97, errors: 3 },
    { name: "Mar", latency: 101, success: 99, errors: 1 },
    { name: "Apr", latency: 134, success: 96, errors: 4 },
    { name: "May", latency: 90, success: 99, errors: 1 },
    { name: "Jun", latency: 85, success: 100, errors: 0 },
    { name: "Jul", latency: 95, success: 98, errors: 2 },
  ];
  
  // Platform usage stats
  const socialPlatformUsage = [
    { name: "Facebook", calls: 1250, quota: 2000, color: "#1877F2" },
    { name: "Twitter", calls: 980, quota: 1500, color: "#1DA1F2" },
    { name: "Instagram", calls: 1420, quota: 1500, color: "#C13584" },
    { name: "YouTube", calls: 340, quota: 500, color: "#FF0000" },
  ];
  
  const aiApiUsage = [
    { name: "Content Generation", calls: 450, quota: 500, color: "#5D5FEF" },
    { name: "Image Analysis", calls: 320, quota: 500, color: "#3ABFF8" },
    { name: "Text Analysis", calls: 210, quota: 300, color: "#36D399" },
  ];

  return {
    loading,
    socialApiData,
    aiApiData,
    performanceData,
    socialPlatformUsage,
    aiApiUsage
  };
};
