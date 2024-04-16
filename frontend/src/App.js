import React, { useEffect, useState } from "react";
import List from "./components/List";
import axios from "axios";
import { baseURL } from "./utils/constant";
import "./index.css"; 

const App = () => {
  // Стан для зберігання значення поля введення
  const [input, setInput] = useState("");
  // Стан для зберігання списку завдань
  const [tasks, setTasks] = useState([]);
  // Стан для зберігання ідентифікатора завдання, яке потрібно оновити
  const [updateId, setUpdateId] = useState(null);
  // Стан для зберігання повідомлення про помилку
  const [errorMessage, setErrorMessage] = useState("");

  // Ефект, який виконується при завантаженні компонента
  useEffect(() => {
    // Отримання списку завдань з сервера
    axios.get(`${baseURL}/get`).then((res) => {
      setTasks(res.data);
    });
  }, []);

  // Функція для додавання завдання
  const addTask = () => {
    // Перевірка на наявність тексту в полі введення
    if (input.trim() === "") {
      setErrorMessage("Please enter a task!"); // Встановлення повідомлення про помилку
      return;
    }

    // Відправка нового завдання на сервер
    axios.post(`${baseURL}/save`, { task: input }).then((res) => {
      setInput(""); // Очищення поля введення
      setErrorMessage(""); // Очищення повідомлення про помилку
      setTasks([...tasks, res.data]); // Додавання нового завдання до списку
    });
  };

  // Функція для встановлення режиму оновлення завдання
  const updateMode = (id, text) => {
    setInput(text); // Встановлення тексту завдання в поле введення
    setUpdateId(id); // Встановлення ідентифікатора завдання для оновлення
  };

  // Функція для оновлення завдання
  const updateTask = () => {
    // Оновлення завдання на сервері
    axios.put(`${baseURL}/update/${updateId}`, { task: input }).then((res) => {
      setUpdateId(null); // Скидання режиму оновлення
      setInput(""); // Очищення поля введення
      // Оновлення списку завдань
      setTasks(tasks.map((task) => (task._id === updateId ? { ...task, task: input } : task)));
    });
  };

  // Функція для видалення завдання
  const removeTask = (id) => {
    // Видалення завдання з сервера
    axios.delete(`${baseURL}/delete/${id}`).then((res) => {
      // Оновлення списку завдань після видалення
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  return (
    <main className="main">
      <h1 className="title">CRUD Operations</h1>
      <div className="input_holder">
        {/* Поле введення */}
        <input
          className={errorMessage ? "input input-error" : "input"}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setErrorMessage(""); // Очищення повідомлення про помилку при введенні
          }}
          placeholder="Enter a task..."
        />
        {/* Повідомлення про помилку */}
        {errorMessage && <span className="input-message">{errorMessage}</span>}
        {/* Кнопка для додавання або оновлення завдання */}
        <button className="btn" type="submit" onClick={updateId ? updateTask : addTask}>
          {updateId ? "Update Task" : "Add Task"}
        </button>
      </div>
      {/* Список завдань */}
      <ul className="task_list">
        {tasks.map((task) => (
          <List key={task._id} id={task._id} task={task.task} updateMode={updateMode} removeTask={removeTask} />
        ))}
      </ul>
    </main>
  );
};

export default App;
