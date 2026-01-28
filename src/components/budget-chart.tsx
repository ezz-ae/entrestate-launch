'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';

interface BudgetChartProps {
  budget: number;
  baseCpc: number;
}

interface BudgetChartPoint {
  budget: number;
  clicks: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/10 p-3 rounded-lg shadow-lg">
        <p className="text-xs text-zinc-400">{`Budget: ${label} AED`}</p>
        <p className="text-sm font-bold text-white">{`Est. Clicks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function BudgetChart({ budget, baseCpc }: BudgetChartProps) {
  const data = useMemo(() => {
    const points: BudgetChartPoint[] = [];
    for (let i = 50; i <= 500; i += 25) {
      const cpc = baseCpc + (i / 1000);
      const clicks = Math.floor(i / cpc);
      points.push({ budget: i, clicks });
    }
    return points;
  }, [baseCpc]);

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="budget" 
            tick={{ fill: '#a1a1aa', fontSize: 10 }} 
            axisLine={{ stroke: '#a1a1aa' }}
            tickLine={{ stroke: '#a1a1aa' }}
            unit=" AED"
          />
          <YAxis 
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
            axisLine={{ stroke: '#a1a1aa' }}
            tickLine={{ stroke: '#a1a1aa' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }} />
          <ReferenceDot x={budget} y={Math.floor(budget / (baseCpc + (budget / 1000)))} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} ifOverflow="extendDomain" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
