export type NavItem = {
  title: string;
  href: string;
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};
