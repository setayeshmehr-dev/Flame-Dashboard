"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  GripVertical,
  CalendarDays,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react"
import { format } from "date-fns"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Calendar } from "@/components/ui/calendar"
import { kanbanColumns, kanbanTasks } from "@/data/kanban"

const AUTO_SCROLL_EDGE = 80
const AUTO_SCROLL_MIN_SPEED = 2
const AUTO_SCROLL_MAX_SPEED = 14

const priorityStyles = {
  High: "bg-red-500/10 text-red-500 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const emptyForm = {
  title: "",
  description: "",
  category: "",
  priority: "Medium",
  date: undefined,
  column: "backlog",
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState(kanbanTasks)
  const [drag, setDrag] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const columnsRef = useRef({})
  const cardsRef = useRef({})
  const dragRef = useRef(null)
  const originalPositionRef = useRef(null)
  const tasksRef = useRef(tasks)
  const autoScrollFrameRef = useRef(null)

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const columns = useMemo(() => {
    return kanbanColumns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column === column.id),
    }))
  }, [tasks])

  const updateDragTarget = (x, y) => {
    const current = dragRef.current
    if (!current) return

    const target = getDropTarget(x, y, current.taskId)

    current.x = x
    current.y = y
    current.target = target

    setDrag({ ...current })
  }

  const getScrollParent = () => {
    const firstColumn = Object.values(columnsRef.current)[0]
    if (!firstColumn) return null

    let element = firstColumn.parentElement

    while (element && element !== document.body) {
      const style = window.getComputedStyle(element)

      const canScroll =
        /(auto|scroll)/.test(style.overflowY) &&
        element.scrollHeight > element.clientHeight

      if (canScroll) return element

      element = element.parentElement
    }

    return null
  }

  const scrollContainer = (container, speed) => {
    if (!container) return

    if (container === document.documentElement) {
      window.scrollBy(0, speed)
      return
    }

    container.scrollTop += speed
  }

  const autoScroll = () => {
    const current = dragRef.current

    if (!current) {
      autoScrollFrameRef.current = null
      return
    }

    const y = current.y
    const viewportHeight = window.innerHeight

    let direction = 0
    let distance = 0

    if (y < AUTO_SCROLL_EDGE) {
      direction = -1
      distance = AUTO_SCROLL_EDGE - y
    } else if (y > viewportHeight - AUTO_SCROLL_EDGE) {
      direction = 1
      distance = y - (viewportHeight - AUTO_SCROLL_EDGE)
    }

    if (direction !== 0) {
      const progress = Math.min(
        distance / AUTO_SCROLL_EDGE,
        1
      )

      const speed =
        AUTO_SCROLL_MIN_SPEED +
        (AUTO_SCROLL_MAX_SPEED - AUTO_SCROLL_MIN_SPEED) *
          progress

      const container = getScrollParent()

      if (container) {
        const previousScrollTop = container.scrollTop

        scrollContainer(
          container,
          direction * speed
        )

        if (container.scrollTop !== previousScrollTop) {
          updateDragTarget(current.x, current.y)
        }
      } else {
        const previousScrollY = window.scrollY

        window.scrollBy(0, direction * speed)

        if (window.scrollY !== previousScrollY) {
          updateDragTarget(current.x, current.y)
        }
      }
    }

    autoScrollFrameRef.current =
      requestAnimationFrame(autoScroll)
  }

  useEffect(() => {
    if (!drag) return

    const handlePointerMove = (event) => {
      const current = dragRef.current
      if (!current) return

      current.x = event.clientX
      current.y = event.clientY

      const target = getDropTarget(
        event.clientX,
        event.clientY,
        current.taskId
      )

      current.target = target

      setDrag({ ...current })
    }

    const handlePointerUp = () => {
      const current = dragRef.current
      if (!current) return

      if (current.target) {
        commitDrop(current)
      } else {
        restoreOriginalPosition(current.taskId)
      }

      dragRef.current = null
      originalPositionRef.current = null
      setDrag(null)

      if (autoScrollFrameRef.current) {
        cancelAnimationFrame(autoScrollFrameRef.current)
        autoScrollFrameRef.current = null
      }

      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    document.body.style.userSelect = "none"
    document.body.style.cursor = "grabbing"

    autoScrollFrameRef.current =
      requestAnimationFrame(autoScroll)

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      )

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      )

      if (autoScrollFrameRef.current) {
        cancelAnimationFrame(autoScrollFrameRef.current)
        autoScrollFrameRef.current = null
      }

      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [drag])

  const startDrag = (event, task) => {
    event.preventDefault()
    event.stopPropagation()

    const cardElement = cardsRef.current[task.id]
    if (!cardElement) return

    const rect = cardElement.getBoundingClientRect()

    const columnTasks = tasksRef.current.filter(
      (item) => item.column === task.column
    )

    const originalIndex = columnTasks.findIndex(
      (item) => item.id === task.id
    )

    originalPositionRef.current = {
      columnId: task.column,
      index: originalIndex,
    }

    dragRef.current = {
      taskId: task.id,
      task,
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      height: rect.height,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      target: null,
    }

    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== task.id)
    )

    setDrag({
      ...dragRef.current,
    })
  }

  const getDropTarget = (x, y, taskId) => {
    let targetColumn = null

    for (const [columnId, element] of Object.entries(
      columnsRef.current
    )) {
      if (!element) continue

      const rect = element.getBoundingClientRect()

      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        targetColumn = columnId
        break
      }
    }

    if (!targetColumn) return null

    const columnTasks = tasksRef.current.filter(
      (task) =>
        task.column === targetColumn &&
        task.id !== taskId
    )

    if (columnTasks.length === 0) {
      return {
        columnId: targetColumn,
        index: 0,
      }
    }

    for (
      let index = 0;
      index < columnTasks.length;
      index++
    ) {
      const task = columnTasks[index]
      const element = cardsRef.current[task.id]

      if (!element) continue

      const rect = element.getBoundingClientRect()
      const middle = rect.top + rect.height / 2

      if (y < middle) {
        return {
          columnId: targetColumn,
          index,
        }
      }

      if (y >= middle && y <= rect.bottom) {
        return {
          columnId: targetColumn,
          index: index + 1,
        }
      }
    }

    return {
      columnId: targetColumn,
      index: columnTasks.length,
    }
  }

  const commitDrop = (current) => {
    const target = current.target
    const movedTask = current.task

    setTasks((currentTasks) => {
      const columnTasks = currentTasks.filter(
        (task) => task.column === target.columnId
      )

      const safeIndex = Math.max(
        0,
        Math.min(target.index, columnTasks.length)
      )

      const result = []
      let inserted = false

      for (let index = 0; index < currentTasks.length; index++) {
        const task = currentTasks[index]

        if (
          task.column === target.columnId &&
          columnTasks.indexOf(task) === safeIndex
        ) {
          result.push({
            ...movedTask,
            column: target.columnId,
          })

          inserted = true
        }

        result.push(task)
      }

      if (!inserted) {
        result.push({
          ...movedTask,
          column: target.columnId,
        })
      }

      return result
    })
  }

  const restoreOriginalPosition = (taskId) => {
    const original = originalPositionRef.current
    const currentDrag = dragRef.current

    if (!original || !currentDrag) return

    setTasks((currentTasks) => {
      const columnTasks = currentTasks.filter(
        (task) => task.column === original.columnId
      )

      const safeIndex = Math.min(
        original.index,
        columnTasks.length
      )

      const result = [...currentTasks]

      if (safeIndex >= columnTasks.length) {
        result.push({
          ...currentDrag.task,
          column: original.columnId,
        })

        return result
      }

      let columnIndex = 0

      for (let index = 0; index < result.length; index++) {
        if (
          result[index].column !== original.columnId
        ) {
          continue
        }

        if (columnIndex === safeIndex) {
          result.splice(index, 0, {
            ...currentDrag.task,
            column: original.columnId,
          })

          return result
        }

        columnIndex++
      }

      result.push({
        ...currentDrag.task,
        column: original.columnId,
      })

      return result
    })
  }

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    )
  }

  const handleCreateTask = () => {
    if (!formData.title.trim()) return

    const newTask = {
      id: `TASK-${Date.now()}`,
      column: formData.column,
      category: formData.category || "General",
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      date: formData.date
        ? format(formData.date, "yyyy-MM-dd")
        : "",
      assignee: "AS",
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ])

    setFormData(emptyForm)
    setCreateOpen(false)
  }

  const handleFormChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Kanban
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage tasks and track progress across your workflow.
          </p>
        </div>

        <Dialog
          open={createOpen}
          onOpenChange={setCreateOpen}
        >
          <DialogTrigger
            render={
              <Button>
                <Plus className="size-4" />
                Create Task
              </Button>
            }
          />

          <DialogContent className="sm:max-w-140">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>

              <DialogDescription>
                Create a new task and add it to your workflow.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-2">
              <div className="space-y-2">
                <Label htmlFor="task-title">
                  Title
                </Label>

                <Input
                  id="task-title"
                  value={formData.title}
                  onChange={(event) =>
                    handleFormChange(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Enter task title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">
                  Description
                </Label>

                <Textarea
                  id="task-description"
                  value={formData.description}
                  onChange={(event) =>
                    handleFormChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the task..."
                  className="min-h-24 resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>

                  <Input
                    value={formData.category}
                    onChange={(event) =>
                      handleFormChange(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Frontend UX"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>

                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleFormChange(
                        "priority",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="High">
                        High
                      </SelectItem>

                      <SelectItem value="Medium">
                        Medium
                      </SelectItem>

                      <SelectItem value="Low">
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Column</Label>

                  <Select
                    value={formData.column}
                    onValueChange={(value) =>
                      handleFormChange(
                        "column",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>

                    <SelectContent>
                      {kanbanColumns.map((column) => (
                        <SelectItem
                          key={column.id}
                          value={column.id}
                        >
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>

                  <Popover>
                    <PopoverTrigger
                      type="button"
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "w-full justify-between font-normal",
                      })}
                    >
                      {formData.date
                        ? format(formData.date, "PPP")
                        : "Select a date"}

                      <CalendarIcon className="size-4 opacity-50" />
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) =>
                          handleFormChange(
                            "date",
                            date
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  AS
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Amirali Setayeshmehr
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>

              <Button
                disabled={!formData.title.trim()}
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const placeholderIndex =
            drag?.target?.columnId === column.id
              ? drag.target.index
              : null

          const isDropColumn =
            placeholderIndex !== null

          return (
            <div
              key={column.id}
              ref={(element) => {
                columnsRef.current[column.id] = element
              }}
              className={[
                "min-w-0 rounded-xl border p-3 transition-colors duration-150",
                isDropColumn
                  ? "border-primary/50 bg-primary/4"
                  : "border-border/60 bg-muted/20",
              ].join(" ")}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">
                    {column.title}
                  </h2>

                  <span className="text-xs text-muted-foreground">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              <div className="min-h-30 space-y-3">
                {column.tasks.map((task, index) => (
                  <div key={task.id}>
                    {placeholderIndex === index &&
                      drag && (
                        <DragPlaceholder
                          height={drag.height}
                        />
                      )}

                    <KanbanCard
                      task={task}
                      cardRef={(element) => {
                        cardsRef.current[task.id] = element
                      }}
                      onDragStart={startDrag}
                      onDelete={deleteTask}
                    />
                  </div>
                ))}

                {placeholderIndex ===
                  column.tasks.length &&
                  drag && (
                    <DragPlaceholder
                      height={drag.height}
                    />
                  )}

                {column.tasks.length === 0 &&
                  placeholderIndex === null && (
                    <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
                      Drop task here
                    </div>
                  )}
              </div>
            </div>
          )
        })}
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-9999"
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
            width: drag.width,
          }}
        >
          <div
            style={{
              transform: `rotate(${
                drag.taskId.charCodeAt(
                  drag.taskId.length - 1
                ) %
                  2
                  ? -2
                  : 2
              }deg) scale(1.02)`,
            }}
          >
            <KanbanCard
              task={drag.task}
              isDragPreview
            />
          </div>
        </div>
      )}
    </div>
  )
}

function KanbanCard({
  task,
  cardRef,
  onDragStart,
  onDelete,
  isDragPreview = false,
}) {
  if (!task) return null

  return (
    <Card
      ref={cardRef}
      className={[
        "group relative overflow-hidden p-4",
        isDragPreview
          ? "cursor-grabbing shadow-2xl"
          : "transition-all duration-150 hover:border-border hover:shadow-sm",
      ].join(" ")}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge
            variant="outline"
            className="mb-2 h-5 w-auto rounded-md px-2 text-[10px] font-medium uppercase tracking-wide"
          >
            {formatCategory(task.category)}
          </Badge>

          <h3 className="text-sm font-medium leading-5">
            {task.title}
          </h3>
        </div>

        {!isDragPreview && (
          <button
            type="button"
            aria-label={`Move ${task.title}`}
            onPointerDown={(event) =>
              onDragStart(event, task)
            }
            className="-mt-1 flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
        )}
      </div>

      <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={[
              "h-6 w-auto rounded-md px-2 text-[10px]",
              priorityStyles[task.priority],
            ].join(" ")}
          >
            {task.priority}
          </Badge>

          {task.date && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3.5" />
              <span>{task.date}</span>
            </div>
          )}
        </div>

        {task.assignee && (
          <div className="flex items-center gap-1">
            {!isDragPreview && (
              <button
                type="button"
                aria-label={`Delete ${task.title}`}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={() =>
                  onDelete?.(task.id)
                }
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}

            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
              {task.assignee}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function DragPlaceholder({ height }) {
  return (
    <div
      style={{ height }}
      className="mb-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
    />
  )
}

function formatCategory(category) {
  if (!category) return ""

  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/frontendux/i, "Frontend UX")
    .replace(/designux/i, "Design UX")
    .replace(/backendsecurity/i, "Backend Security")
    .replace(/backendbilling/i, "Backend Billing")
    .replace(/securityfrontend/i, "Security Frontend")
    .replace(/backendperformance/i, "Backend Performance")
}