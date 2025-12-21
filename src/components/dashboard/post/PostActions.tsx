
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, Clock, Gauge, MoreHorizontal, Send, Sparkles, Wand2 } from "lucide-react";

interface PostActionsProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  handleSchedulePost: () => void;
  handlePostNow: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
}

const PostActions: React.FC<PostActionsProps> = ({
  date,
  setDate,
  time,
  setTime,
  handleSchedulePost,
  handlePostNow,
  setActiveTab,
  setPostContent
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <div className="flex items-center flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-l-full rounded-r-none border-r-0 gap-1">
              <CalendarIcon className="h-4 w-4" /> Schedule
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="text-sm h-8"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Gauge className="h-3 w-3 text-green-500" /> 
                7 PM recommended (30% higher engagement)
              </div>
              <Button 
                className="w-full mt-2 bg-postpulse-blue hover:bg-blue-600" 
                size="sm"
                onClick={handleSchedulePost}
              >
                Schedule
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" className="rounded-none border-l-0 border-r-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-l-none rounded-r-full">
              <Wand2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-[300px]">
            <div className="space-y-2">
              <h3 className="font-medium">AI Assistant</h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setPostContent("Just published a new blog post on digital marketing trends in 2025. Check it out at the link in bio! #DigitalMarketing #ContentStrategy");
                }}
              >
                <Sparkles className="mr-2 h-3.5 w-3.5 text-postpulse-orange" /> 
                Generate Blog Post Announcement
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setPostContent("🔥 FLASH SALE 🔥 24 hours only! Use code FLASH25 for 25% off everything. Shop now!");
                }}
              >
                <Sparkles className="mr-2 h-3.5 w-3.5 text-postpulse-orange" /> 
                Generate Promotional Post
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => {
                  // Switch to AI tab
                  setActiveTab('generate');
                }}
              >
                <Sparkles className="mr-2 h-3.5 w-3.5 text-postpulse-orange" /> 
                Custom AI Generation
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Button onClick={handlePostNow} className="bg-gradient-to-r from-postpulse-orange to-postpulse-orange/80 text-white hover:opacity-90">
        <Send className="mr-2 h-4 w-4" /> Post Now
      </Button>
    </div>
  );
};

export default PostActions;
