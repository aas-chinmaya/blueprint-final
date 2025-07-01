// components/reports/team/ResourceUtilization.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const resources = [
  { name: "Alice", utilization: "80%" },
  { name: "Bob", utilization: "65%" },
  { name: "Carol", utilization: "92%" },
]

export default function ResourceUtilization() {
  return (
    <Card className="border border-purple-200 shadow-md bg-purple-50">
      <CardHeader><CardTitle className="text-purple-800 text-lg font-bold">Resource Utilization</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {resources.map((r, i) => (
            <li key={i} className="flex justify-between text-purple-700 border-b pb-1">
              <span>{r.name}</span>
              <span>{r.utilization}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

