// src/app/page.tsx (or src/app/todo/page.tsx)
import React from "react";
import TodoList from "@/app/components/TodoList"; // Adjust path if needed

export default function TodoPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <TodoList />
    </main>
  );
}
