// Public demo lead shape (matches current mock data)
export interface DemoLead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: "Qualified" | "Negotiation" | "Closed";
  date: string;
  avatar: string;
}

// Real lead from Supabase (employer contacts)
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string | null;
  status: "New" | "Reviewed" | "Contacted" | "Archived";
  read: boolean;
  is_seed: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  completed: boolean;
}

export interface ToastData {
  id: string;
  message: string;
  exiting: boolean;
}

export type DemoSortField = "value" | "date";
export type AdminSortField = "created_at" | "name";
export type SortDir = "asc" | "desc";
export type DemoStatus = DemoLead["status"] | "All";
export type AdminStatus = Lead["status"] | "All";
