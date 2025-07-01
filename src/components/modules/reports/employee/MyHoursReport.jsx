// components/reports/employee/MyHoursReport.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const hours = {
  logged: 32,
  expected: 40,
}

export default function MyHoursReport() {
  return (
    <Card>
      <CardHeader><CardTitle>My Logged Hours</CardTitle></CardHeader>
      <CardContent>
        <p>{hours.logged} hrs logged out of {hours.expected} expected</p>
      </CardContent>
    </Card>
  )
}