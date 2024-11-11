import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/types/chat';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{data.name}</span>
          <span className="text-2xl">{Math.round(data.main.temp)}°C</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Cloud className="mr-2 h-4 w-4" />
            <span>{data.weather?.[0]?.main}</span>
          </div>
          <div className="flex items-center">
            <Thermometer className="mr-2 h-4 w-4" />
            <span>Feels like {Math.round(data.main.feels_like)}°C</span>
          </div>
          <div className="flex items-center">
            <Droplets className="mr-2 h-4 w-4" />
            <span>Humidity {data.main.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 h-4 w-4" />
            <span>Wind {data.wind.speed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
