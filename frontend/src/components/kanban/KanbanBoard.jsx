'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllTaskList,
  updateTask,
  selectAllTaskList,
} from '@/store/features/in-project/TaskSlice'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statuses = ['Planned', 'In Progress', 'Completed']

export default function KanbanBoard() {
  const dispatch = useDispatch()
  const allTasks = useSelector(selectAllTaskList)

  const [tasksByStatus, setTasksByStatus] = useState({
    Planned: [],
    'In Progress': [],
    Completed: [],
  })

  useEffect(() => {
    dispatch(getAllTaskList())
  }, [dispatch])

  useEffect(() => {
    const grouped = {
      Planned: [],
      'In Progress': [],
      Completed: [],
    }

    allTasks.forEach((task) => {
      grouped[task.status]?.push(task)
    })

    setTasksByStatus(grouped)
  }, [allTasks])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const sourceStatus = findStatus(active.id)
    const destStatus = findStatus(over.id)

    if (!sourceStatus || !destStatus) return

    const sourceTasks = [...tasksByStatus[sourceStatus]]
    const destTasks = [...tasksByStatus[destStatus]]

    const taskIndex = sourceTasks.findIndex((t) => t.task_id === active.id)
    const [movedTask] = sourceTasks.splice(taskIndex, 1)

    if (sourceStatus !== destStatus) {
      movedTask.status = destStatus
      destTasks.splice(0, 0, movedTask)
      dispatch(updateTask(movedTask))
    } else {
      sourceTasks.splice(
        destTasks.findIndex((t) => t.task_id === over.id),
        0,
        movedTask
      )
    }

    setTasksByStatus((prev) => ({
      ...prev,
      [sourceStatus]: sourceTasks,
      [destStatus]: destTasks,
    }))
  }

  const findStatus = (taskId) => {
    return Object.keys(tasksByStatus).find((status) =>
      tasksByStatus[status].some((t) => t.task_id === taskId)
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {statuses.map((status) => (
          <div key={status} className="bg-gray-50 rounded-lg p-3 border shadow-sm min-h-[400px]">
            <h2 className="text-lg font-semibold text-green-700 mb-2">{status}</h2>
            <SortableContext
              items={tasksByStatus[status].map((t) => t.task_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <SortableTask key={task.task_id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}

function SortableTask({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.task_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded-md p-3 border shadow-sm cursor-grab"
    >
      <div className="font-semibold text-green-800">{task.title || 'Untitled Task'}</div>
      <div className="text-sm text-gray-600">{task.description || 'No description'}</div>
      <Badge className="mt-2">{task.priority}</Badge>
    </motion.div>
  )
}
