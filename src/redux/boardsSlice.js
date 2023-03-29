import { createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

const boardsSlice = createSlice({
  name: "boards",
  initialState: data.boards,
  reducers: {
    addBoard: (state, action) => {
      const isActive = state.length > 0 ? false : true;
      const payload = action.payload;
      const board = {
        name: payload.name,
        isActive,
        columns: [],
      };
      board.columns = payload.newColumns;
      state.push(board);
    },
    editBoard: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      board.name = payload.name;
      board.columns = payload.newColumns;
    },
    deleteBoard: (state) => {
      const board = state.find((board) => board.isActive);
      state.splice(state.indexOf(board), 1);
    },
    setBoardActive: (state, action) => {
      state.map((board, index) => {
        index === action.payload.index
          ? (board.isActive = true)
          : (board.isActive = false);
        return board;
      });
    },
    addTask: (state, action) => {
      const { title, status, description, subtasks, newColIndex } =
        action.payload;
      const task = { title, description, subtasks, status };
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === newColIndex);
      column.tasks.push(task);
    },
    editTask: (state, action) => {
      const {
        title,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex,
      } = action.payload;
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === prevColIndex);
      const task = column.tasks.find((task, index) => index === taskIndex);
      task.title = title;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;
      if (prevColIndex === newColIndex) return;
      column.tasks = column.tasks.filter((task, index) => index !== taskIndex);
      const newCol = board.columns.find((col, index) => index === newColIndex);
      newCol.tasks.push(task);
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const prevCol = board.columns.find((col, i) => i === prevColIndex);
      const task = prevCol.tasks.splice(taskIndex, 1)[0];
      board.columns.find((col, i) => i === colIndex).tasks.push(task);
    },
    setSubtaskCompleted: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      const subtask = task.subtasks.find((subtask, i) => i === payload.index);
      subtask.isCompleted = !subtask.isCompleted;
    },
    setTaskStatus: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const columns = board.columns;
      const col = columns.find((col, i) => i === payload.colIndex);
      if (payload.colIndex === payload.newColIndex) return;
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      task.status = payload.status;
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      const newCol = columns.find((col, i) => i === payload.newColIndex);
      newCol.tasks.push(task);
    },
    deleteTask: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
    },
  },
});

export default boardsSlice;
