import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const taskData = {
  completed: 12,
  total: 15,
}

export default function MyTaskReport() {
  const progress = Math.round((taskData.completed / taskData.total) * 100)

  return (
    <Card>
      <CardHeader><CardTitle>My Task Completion</CardTitle></CardHeader>
      <CardContent>
        <p>{taskData.completed} of {taskData.total} tasks completed</p>
        <Progress value={progress} className="mt-2" />
      </CardContent>
    </Card>
  )
}
