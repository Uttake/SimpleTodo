export type todo = {
    id: string,
    title: string,
    tasks: task[]
}

export type task = {
    id: string,
    todo: string,
    completed: boolean
}

export type RootState = {
    todos: todo[]
}

export type TodoState = {
    todos: todo[]; 
    history: todo[]; 
  };