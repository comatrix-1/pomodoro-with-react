import React, { useReducer, useState } from "react";
import { greenButtonStyles, textField } from "./customStyles";
import { ITodo, TodoAction } from "./models";

function Todo() {
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (newTodo: string) => {
    const newTodoItem = {
      id: Date.now(),
      title: newTodo,
      complete: false,
    };

    todos.push(newTodoItem);
    setNewTodo("");
  };

  const reducer = (state: ITodo[], action: TodoAction) => {
    switch (action.type) {
      case "COMPLETE":
        return state.map((todo) => {
          if (todo.id === action.id) {
            return { ...todo, complete: !todo.complete };
          } else {
            return todo;
          }
        });
      default:
        return state;
    }
  };
  const [todos, dispatch] = useReducer(reducer, []);

  const handleComplete = (todo: ITodo) => {
    dispatch({ type: "COMPLETE", id: todo.id });
  };

  return (
    <>
      <div className="my-8">
        <h2 className="mb-1">Add an item to your task list:</h2>
        <input
          type="text"
          className={textField}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="button"
          className={`${greenButtonStyles} mt-2`}
          value="Add"
          onClick={() => handleAddTodo(newTodo)}
        />
      </div>
      {/* todos  */}
      <div className="my-4">
        <p className="font-semibold">&#127919; Tasks</p>
        <div className="ml-4 flex flex-col gap-2 mt-2">
          {todos.map((todo) =>
            !todo.complete ? (
              <div key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => handleComplete(todo)}
                  />
                  {todo.title}
                </label>
              </div>
            ) : null
          )}
          {todos.length === 0 && (
            <p className="text-gray-primary">Task list is empty...</p>
          )}
        </div>
      </div>
      {/* done  */}
      <div className="my-4">
        <p className="font-semibold">&#9989; Completed</p>
        <div className="ml-4 flex flex-col gap-2 mt-2">
          {todos.map((todo) =>
            todo.complete ? (
              <div key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => handleComplete(todo)}
                  />
                  {todo.title}
                </label>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}

export default Todo;
