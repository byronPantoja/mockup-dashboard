// Public demo lead shape (fake portfolio inbound contacts)
export interface DemoLead {
  id: string;
  name: string;
  company: string;
  role: string;
  status: "New" | "Replied" | "Meeting" | "Closed";
  date: string;
  avatar: string;
  value?: string;
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

export type DemoSortField = "date";
export type AdminSortField = "created_at" | "name";
export type SortDir = "asc" | "desc";
export type DemoStatus = DemoLead["status"] | "All";
export type AdminStatus = Lead["status"] | "All";
