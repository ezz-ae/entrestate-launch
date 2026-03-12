'use client';

import { Table } from '@mantine/core';
import React from 'react';

interface PricingTableProps {
  headers: string[];
  data: (string | number)[][];
}

export function PricingTable({ headers, data }: PricingTableProps) {
  const rows = data.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
