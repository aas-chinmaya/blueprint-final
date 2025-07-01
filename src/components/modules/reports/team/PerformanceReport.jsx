// components/reports/team/PerformanceReport.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

const data = [
  { name: "Alice", tasksCompleted: 22, hoursLogged: 40, efficiency: "88%" },
  { name: "Bob", tasksCompleted: 18, hoursLogged: 42, efficiency: "76%" },
]

export default function PerformanceReport() {
  return (
    <Card className="border border-green-200 shadow-md bg-green-50">
      <CardHeader><CardTitle className="text-green-800 text-lg font-bold">Team Performance</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-green-100">
            <TableRow>
              <TableHead className="text-green-700">Member</TableHead>
              <TableHead className="text-green-700">Tasks</TableHead>
              <TableHead className="text-green-700">Hours</TableHead>
              <TableHead className="text-green-700">Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.tasksCompleted}</TableCell>
                <TableCell>{row.hoursLogged}</TableCell>
                <TableCell>{row.efficiency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
