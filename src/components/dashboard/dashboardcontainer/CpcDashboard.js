"use client";
import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";


export default function CpcDashboard() {






  return (
    <div className="space-y-6">
  <SectionCards />

  <div className="px-4 lg:px-6">
    <ChartAreaInteractive />
  </div>

  <DataTable />
</div>

  );
}
