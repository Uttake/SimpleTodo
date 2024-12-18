

export type todo = {
    id: string,
    title: string,
    tasks: task[]
    user_id?: string
    position?: number
}

export type task = {
    id: string,
    todo: string,
    completed: boolean
    position?:number
}



export type TodoState = {
    todos: todo[]; 
    history: todo[]; 
    loading: boolean;
    error: string | null
  };