"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Plus, Trash2 } from "lucide-react";
import { Task } from "@/lib/interface";

// If you don't have a shared type file, uncomment this:
// interface Task {
//   id: string;
//   text: string;
//   completed: boolean;
// }

type Action =
  | { type: "ADD"; text: string }
  | { type: "TOGGLE"; id: string }
  | { type: "DELETE"; id: string }
  | { type: "CLEAR_COMPLETED" };

function tasksReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: crypto.randomUUID(), text: action.text, completed: false },
      ];
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t
      );
    case "DELETE":
      return state.filter((t) => t.id !== action.id);
    case "CLEAR_COMPLETED":
      return state.filter((t) => !t.completed);
    default:
      return state;
  }
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li
      className={`flex items-center justify-between p-3 rounded-md border
        transition-colors duration-200 ${
          task.completed
            ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
        }`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded border-gray-300 dark:border-gray-600
            text-blue-600 focus:ring-blue-500 dark:bg-gray-700
            dark:checked:bg-blue-600 dark:checked:border-blue-600
            cursor-pointer"
        />
        <span
          onClick={() => onToggle(task.id)}
          className={`cursor-pointer transition-all duration-200 ${
            task.completed
              ? "line-through text-gray-500 dark:text-gray-400"
              : "text-gray-800 dark:text-gray-100"
          }`}
        >
          {task.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
        className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500
          dark:hover:text-red-400 focus:outline-none focus:ring-2
          focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          rounded-full transition-colors duration-200"
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
});
TaskItem.displayName = "TaskItem";

export default function TodoList() {
  const [tasks, dispatch] = useReducer(tasksReducer, [], () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tasks");
        return raw ? (JSON.parse(raw) as Task[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(e.target.value);
  }, []);

  const handleAddTask = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = newTaskText.trim();
      if (!text) return;
      dispatch({ type: "ADD", text });
      setNewTaskText("");
      inputRef.current?.focus();
    },
    [newTaskText]
  );

  const handleToggle = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", id });
  }, []);

  const handleDelete = useCallback((id: string) => {
    dispatch({ type: "DELETE", id });
  }, []);

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remainingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900
      rounded-lg shadow-md"
    >
      <h1
        className="text-2xl font-bold mb-6 text-center text-gray-800
        dark:text-gray-100"
      >
        My To-Do List
      </h1>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={newTaskText}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-2 border rounded-md
            border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        />
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white
            rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            transition-colors duration-200"
        >
          <Plus size={18} className="mr-1" /> Add
        </button>
      </form>

      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6
        text-sm text-gray-600 dark:text-gray-400"
      >
        <span>
          {remainingCount} task{remainingCount !== 1 ? "s" : ""} left
        </span>
        <div role="group" aria-label="Filter tasks" className="flex gap-2">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md
                focus:outline-none focus:ring-2 focus:ring-offset-2
                dark:focus:ring-offset-gray-900 transition-colors duration-200 ${
                  filter === f
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {tasks.some((t) => t.completed) && (
          <button
            onClick={handleClearCompleted}
            className="text-red-500 dark:text-red-400 hover:underline
              focus:outline-none focus:ring-2 focus:ring-red-400
              focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Clear Completed
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            {filter === "completed"
              ? "No completed tasks."
              : filter === "active"
              ? "No active tasks."
              : "No tasks yet. Add one!"}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
}
