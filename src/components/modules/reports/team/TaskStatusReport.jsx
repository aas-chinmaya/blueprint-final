// components/reports/team/TaskStatusReport.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const taskStatus = {
  todo: 8,
  inProgress: 15,
  done: 27,
  blocked: 3,
}

export default function TaskStatusReport() {
  return (
    <Card className="border border-blue-200 shadow-md bg-blue-50">
      <CardHeader><CardTitle className="text-blue-800 text-lg font-bold">Task Status Overview</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(taskStatus).map(([key, value]) => (
          <div key={key} className="flex justify-between text-blue-700 border-b pb-1">
            <span className="capitalize font-medium">{key}</span>
            <span>{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
