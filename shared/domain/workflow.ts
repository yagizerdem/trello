export interface Task {
  id: string;
  title: string;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
}
