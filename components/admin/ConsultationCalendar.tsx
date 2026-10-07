"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Badge } from '@/components/shared';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Mail } from 'lucide-react';

interface ConsultationEvent {
  id: string;
  name: string;
  email: string;
  company?: string;
  actualScheduledAt: Date;
  status: string;
  googleMeetLink?: string;
}

export default function ConsultationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ConsultationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchEvents();
  }, [currentDate, view]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/consultations?scheduled=true`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.consultations || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.actualScheduledAt);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">
          {monthNames[month]} {year}
        </h2>
        
        <div className="flex items-center space-x-4">
          {/* View Switcher */}
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 capitalize ${
                  view === v
                    ? 'bg-primary text-white'
                    : 'bg-background-dark text-text-secondary hover:bg-background-light'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg bg-background-dark hover:bg-background-light text-text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-background-dark hover:bg-background-light text-text-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === 'month' && (
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-text-secondary py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells before first day */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 bg-background-dark/50 rounded-lg" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dayEvents = getEventsForDate(date);
            const isToday =
              date.toDateString() === new Date().toDateString();

            return (
              <Card
                key={day}
                className={`min-h-24 p-2 ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-semibold mb-1 ${
                    isToday ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1 flex-1 overflow-y-auto">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                        title={`${event.name} - ${event.company || 'No company'}`}
                      >
                        <Clock className="inline w-3 h-3 mr-1" />
                        {new Date(event.actualScheduledAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-text-secondary">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Event List View */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-text-primary mb-4">
          Upcoming Consultations
        </h3>
        
        <div className="space-y-3">
          {events
            .filter(e => new Date(e.actualScheduledAt) >= new Date())
            .sort((a, b) => 
              new Date(a.actualScheduledAt).getTime() - new Date(b.actualScheduledAt).getTime()
            )
            .slice(0, 10)
            .map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">
                          {event.name}
                        </span>
                        {event.company && (
                          <span className="text-text-secondary text-sm">
                            - {event.company}
                          </span>
                        )}
                        <Badge>{event.status}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(event.actualScheduledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(event.actualScheduledAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{event.email}</span>
                        </div>
                      </div>
                    </div>

                    {event.googleMeetLink && (
                      <a
                        href={event.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

          {events.filter(e => new Date(e.actualScheduledAt) >= new Date()).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No upcoming consultations</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
