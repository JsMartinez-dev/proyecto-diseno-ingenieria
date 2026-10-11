export interface ClientePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export interface PrestadorPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export interface AdminPageProps {
  onNavigate: (page: string) => void;
}
