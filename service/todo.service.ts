import api from '../api/api';
import Todo from '../models/todo.model';

export const updateTodo = async (id: string, todo: Todo) => {
    const resp = await api.patch(`/todos/${id}`, todo);
    const updatedTodo = resp.data?.data;
    return updatedTodo;
}

export const getTodo = async (id: string) => {
    const resp = await api.get(`/todos/${id}`);
    const todo = resp.data?.data;
    return todo;

}

export const createTodo = async (todo: Todo) => {
    console.log("function called")
    const resp = await api.post('/todos', todo);
    const newTodo = resp.data?.data;
    return newTodo;
}

export const getTodos = async (): Promise<Todo[]> => {
    const resp = await api.get('/todos');
    const todos = resp.data?.data || [];
    return todos;
}

export const getAllTodos = async (projectId: string) => {    
    const resp = await api.get(`/todos/all/${projectId}`);
    const todos = resp.data?.data || [];
    console.log(todos, "todos");
    return todos;
}
export const deleteTodo = async (id: string) => {
    const resp = await api.delete(`/todos/${id}`);
    if (resp.data.message === "Deleted") {
        return true;
    } else {
        return false;
    }
}

export const deleteTodosByMeetingId = async (id: string) => {
    const resp = await api.delete(`/todos/meeting/${id}`);
    if (resp.data.message === "Deleted") {
        return true;
    } else {
        return false;
    }
}

export const getTodosByMeetingId = async (meetingId: string) => {
    const resq = await api.get(`/todos?meetingId=${meetingId}`);
    const todos = resq.data?.data || [];
    return todos;
}

export const updateTodoStatus = async (id: string, data) => {
    const resp = await api.patch(`/todos/${id}`, data);
    const updatedTodo = resp.data?.data;
    return updatedTodo;
}