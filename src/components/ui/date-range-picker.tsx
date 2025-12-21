import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = subDays(to, days);
    onChange?.({ from, to });
    setOpen(false);
  };

  const handleThisMonth = () => {
    const now = new Date();
    onChange?.({ from: startOfMonth(now), to: endOfMonth(now) });
    setOpen(false);
  };

  const handleLastMonth = () => {
    const lastMonth = subMonths(new Date(), 1);
    onChange?.({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
    setOpen(false);
  };

  const handleLastYear = () => {
    const lastYear = subYears(new Date(), 1);
    onChange?.({ from: startOfYear(lastYear), to: endOfYear(lastYear) });
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal h-9 text-sm",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, "MMM dd")} - {format(value.to, "MMM dd")}
                  </>
                ) : (
                  format(value.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Select range</span>
              )}
            </span>
            {value?.from && (
              <X 
                className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col sm:flex-row">
            {/* Quick Presets - with Last Year */}
            <div className="flex flex-row sm:flex-col gap-1 p-2 border-b sm:border-b-0 sm:border-r bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePreset(7)}
                className="justify-start text-xs h-8 px-2 whitespace-nowrap"
              >
                7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePreset(30)}
                className="justify-start text-xs h-8 px-2 whitespace-nowrap"
              >
                30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThisMonth}
                className="justify-start text-xs h-8 px-2 whitespace-nowrap"
              >
                This month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLastMonth}
                className="justify-start text-xs h-8 px-2 whitespace-nowrap"
              >
                Last month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLastYear}
                className="justify-start text-xs h-8 px-2 whitespace-nowrap"
              >
                Last year
              </Button>
            </div>
            
            {/* Calendar - Minimal */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={(range) => {
                onChange?.(range);
                if (range?.from && range?.to) {
                  setOpen(false);
                }
              }}
              numberOfMonths={1}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}