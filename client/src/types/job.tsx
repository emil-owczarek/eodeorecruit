export type Job = {
    id: string;
    user_email: string;
    title: string;
    status: string;
    date: string;
    icon_src: string;
    icon_id: string;
    link?: string; 
    note?: string;
  };