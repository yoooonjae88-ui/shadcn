"use client"

import * as React from "react"

import { DataGrid, type ColumnDef } from "@/registry/data-grid/data-grid"

// ─── Sample data ──────────────────────────────────────────────────────────────

type Employee = {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: "active" | "inactive" | "pending"
  joined: string
  score: number
  verified: boolean
}

const EMPLOYEES: Employee[] = [
  { id: 1,  name: "Alice Johnson",  email: "alice@acme.io",   department: "Engineering", role: "Senior Dev",  status: "active",   joined: "Jan 12, 2022", score: 94, verified: true  },
  { id: 2,  name: "Bob Smith",      email: "bob@acme.io",     department: "Design",      role: "UI Lead",     status: "active",   joined: "Mar 3, 2021",  score: 87, verified: true  },
  { id: 3,  name: "Carol White",    email: "carol@acme.io",   department: "Marketing",   role: "Manager",     status: "inactive", joined: "Jul 8, 2020",  score: 42, verified: false },
  { id: 4,  name: "David Brown",    email: "david@acme.io",   department: "Engineering", role: "Junior Dev",  status: "pending",  joined: "Nov 1, 2023",  score: 68, verified: false },
  { id: 5,  name: "Emma Davis",     email: "emma@acme.io",    department: "Sales",       role: "AE",          status: "active",   joined: "Feb 14, 2022", score: 91, verified: true  },
  { id: 6,  name: "Frank Miller",   email: "frank@acme.io",   department: "Engineering", role: "Staff Dev",   status: "active",   joined: "Sep 22, 2019", score: 78, verified: true  },
  { id: 7,  name: "Grace Wilson",   email: "grace@acme.io",   department: "HR",          role: "Recruiter",   status: "inactive", joined: "Apr 5, 2021",  score: 55, verified: false },
  { id: 8,  name: "Henry Moore",    email: "henry@acme.io",   department: "Finance",     role: "Analyst",     status: "active",   joined: "Jun 17, 2020", score: 83, verified: true  },
  { id: 9,  name: "Iris Taylor",    email: "iris@acme.io",    department: "Engineering", role: "Tech Lead",   status: "active",   joined: "Oct 9, 2018",  score: 97, verified: true  },
  { id: 10, name: "Jack Anderson",  email: "jack@acme.io",    department: "Sales",       role: "SDR",         status: "pending",  joined: "Dec 20, 2023", score: 61, verified: false },
  { id: 11, name: "Karen Thomas",   email: "karen@acme.io",   department: "Marketing",   role: "Content",     status: "active",   joined: "Aug 3, 2021",  score: 74, verified: true  },
  { id: 12, name: "Liam Jackson",   email: "liam@acme.io",    department: "Engineering", role: "Intern",      status: "pending",  joined: "Jan 8, 2024",  score: 58, verified: false },
  { id: 13, name: "Mia Harris",     email: "mia@acme.io",     department: "Design",      role: "UX Designer", status: "active",   joined: "May 19, 2022", score: 89, verified: true  },
  { id: 14, name: "Noah Martinez",  email: "noah@acme.io",    department: "Finance",     role: "Controller",  status: "inactive", joined: "Mar 30, 2020", score: 47, verified: false },
  { id: 15, name: "Olivia Garcia",  email: "olivia@acme.io",  department: "Engineering", role: "Senior Dev",  status: "active",   joined: "Nov 11, 2021", score: 92, verified: true  },
  { id: 16, name: "Paul Robinson",  email: "paul@acme.io",    department: "Sales",       role: "Manager",     status: "active",   joined: "Feb 2, 2020",  score: 76, verified: true  },
  { id: 17, name: "Quinn Clark",    email: "quinn@acme.io",   department: "HR",          role: "HRBP",        status: "active",   joined: "Jul 25, 2021", score: 81, verified: true  },
  { id: 18, name: "Rachel Lewis",   email: "rachel@acme.io",  department: "Marketing",   role: "Designer",    status: "pending",  joined: "Oct 14, 2023", score: 65, verified: false },
  { id: 19, name: "Sam Lee",        email: "sam@acme.io",     department: "Engineering", role: "DevOps",      status: "active",   joined: "Jan 30, 2019", score: 88, verified: true  },
  { id: 20, name: "Tina Walker",    email: "tina@acme.io",    department: "Finance",     role: "Auditor",     status: "inactive", joined: "Jun 6, 2022",  score: 39, verified: false },
]

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CLASS: Record<Employee["status"], string> = {
  active:   "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pending:  "inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Employee>[] = [
  // defaultHidden: true — column starts hidden but can be revealed via the panel
  {
    key: "id",
    header: "ID",
    width: 56,
    sortable: true,
    filterable: false,
    editable: false,
    defaultHidden: true,
    cell: (v) => (
      <span className="font-mono text-xs text-muted-foreground">{String(v)}</span>
    ),
  },

  // Main text + subtext: render name (bold) and role (muted) stacked in one cell
  {
    key: "name",
    header: "Name",
    minWidth: 180,
    sortable: true,
    filterable: true,
    editable: false,
    // hideable: false — omit this column from the visibility panel entirely
    hideable: false,
    cell: (v, row) => (
      <div>
        <div className="font-medium leading-snug">{String(v)}</div>
        <div className="text-xs text-muted-foreground">{row.role}</div>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    minWidth: 190,
    sortable: true,
    filterable: true,
    editable: true,
  },
  {
    key: "department",
    header: "Dept.",
    width: 120,
    sortable: true,
    filterable: true,
    editable: true,
  },
  {
    key: "status",
    header: "Status",
    width: 100,
    sortable: true,
    filterable: true,
    editable: false,
    cell: (v) => (
      <span className={STATUS_CLASS[v as Employee["status"]]}>
        {String(v)}
      </span>
    ),
  },
  {
    key: "joined",
    header: "Joined",
    width: 120,
    sortable: true,
    filterable: false,
    editable: false,
  },
  {
    key: "score",
    header: "Score",
    width: 72,
    sortable: true,
    filterable: false,
    editable: true,
    cell: (v) => {
      const n = Number(v)
      return (
        <span
          className={
            n >= 80
              ? "font-semibold text-green-600 dark:text-green-400"
              : n >= 60
              ? "font-medium text-amber-600 dark:text-amber-400"
              : "font-medium text-red-500 dark:text-red-400"
          }
        >
          {String(v)}
        </span>
      )
    },
  },

  // Boolean → read-only checkbox
  {
    key: "verified",
    header: "Verified",
    width: 80,
    sortable: true,
    filterable: false,
    editable: false,
    cell: (v) => (
      <input
        type="checkbox"
        checked={Boolean(v)}
        readOnly
        className="size-4 cursor-default accent-primary"
      />
    ),
  },

  // Button column: key maps to no real data field; use row arg for the action
  {
    key: "_actions",
    header: "",
    width: 80,
    sortable: false,
    filterable: false,
    editable: false,
    // hideable: false — keep actions column out of the visibility panel
    hideable: false,
    cell: (_v, row) => (
      <button
        onClick={(e) => {
          e.stopPropagation()
          alert(`Edit: ${row.name}`)
        }}
        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        Edit
      </button>
    ),
  },
]

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function DataGridDemo() {
  const [data, setData] = React.useState(EMPLOYEES)

  return (
    <div className="w-full">
      <DataGrid
        columns={columns}
        data={data}
        keyField="id"
        features={{
          search: true,
          columnVisibility: true,
          filtering: true,
          sorting: true,
          pagination: true,
          inlineEdit: true,
          rowSelection: "multi",
          cellSelection: "single",
        }}
        title="Employees"
        headerAction={
          <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted">
            + Add employee
          </button>
        }
        onDataChange={setData}
        rowClassName={(row) => (row.status === "inactive" ? "opacity-60" : "")}
        cellClassName={(_v, _row, _ri, key) =>
          key === "score" ? "text-right" : ""
        }
      />
    </div>
  )
}
