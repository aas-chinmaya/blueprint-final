
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Clock } from 'lucide-react';
import MeetingCalendar from './MeetingCalendar';
import SlotsManager from './SlotsManager';

export default function CalendarContainer() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <Card className="w-full  mx-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Schedule Manager
          </h2>
        </div>
        <ToggleGroup
          type="single"
          value={activeTab}
          onValueChange={(value) => value && setActiveTab(value)}
          className="absolute cursor-pointer  top-4 right-6 flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <ToggleGroupItem
            value="calendar"
            aria-label="Calendar View"
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform ${
              activeTab === 'calendar'
                ? 'bg-green-600 text-white dark:bg-green-500 scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </ToggleGroupItem>
          <ToggleGroupItem
            value="slots"
            aria-label="Slots View"
            className={`cursor-pointer  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform ${
              activeTab === 'slots'
                ? 'bg-green-600 text-white dark:bg-green-500 scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Slots
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <CardContent className="p-0  bg-white dark:bg-gray-900">
        {activeTab === 'calendar' ? <MeetingCalendar /> : <SlotsManager />}
      </CardContent>
    </Card>
  );
}