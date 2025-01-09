"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"

import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
import { Trash, Tags, Landmark } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  categories: any;
  bankaccounts: any;
  selectedCount: number; // New prop to receive selected row count
  onDelete: () => void; // Example action
  onBulkUpdateCategory: () => void; // New prop
  onBulkUpdateBankAccount: () => void; // New prop


}


export function DataTableToolbar<TData>({
  table,
  categories,
  bankaccounts,
  selectedCount,
  onDelete,
  onBulkUpdateCategory,
  onBulkUpdateBankAccount

}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn("concept")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {table.getColumn("bankaccount") && (
          <DataTableFacetedFilter
            column={table.getColumn("bankaccount")}
            title="Bank account"
            options={bankaccounts}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Conditionally render action buttons based on selection */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={onBulkUpdateCategory}>
            <Tags className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={onBulkUpdateBankAccount}>
            <Landmark className="h-4 w-4" />
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}    
      </div>
  )
}