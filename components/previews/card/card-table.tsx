"use client"

import {
  Card,
  CardHeader,
  CardTable,
  CardTitle,
} from "@/registry/card/card"

// The accent surface variant with a full-bleed table.
export function CardTableExample() {
  return (
    <Card variant="accent" className="w-full max-w-sm">
      <CardHeader separator>
        <CardTitle>Recent invoices</CardTitle>
      </CardHeader>
      <CardTable className="mt-6">
        <table>
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-6 py-2 font-medium">Invoice</th>
              <th className="px-6 py-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-2">INV-001</td>
              <td className="px-6 py-2">$250.00</td>
            </tr>
            <tr>
              <td className="px-6 py-2">INV-002</td>
              <td className="px-6 py-2">$150.00</td>
            </tr>
          </tbody>
        </table>
      </CardTable>
    </Card>
  )
}
