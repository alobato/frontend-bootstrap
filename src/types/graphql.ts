export type UserRole = "admin" | string;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  biography: string | null;
  nationality: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Publisher {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string | null;
  publicationDate: string | null;
  price: string | null;
  description: string | null;
  pageCount: number | null;
  language: string | null;
  publisherId: number | null;
  publisher: Publisher | null;
  authors: Author[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface QueryMeData {
  me: User | null;
}

export interface QueryPingData {
  ping: boolean;
}

export interface QueryAuthorsData {
  authors: Author[];
}

export interface QueryCategoriesData {
  categories: Category[];
}

export interface QueryPublishersData {
  publishers: Publisher[];
}

export interface QueryBooksData {
  books: Book[];
}

export interface LoginMutationData {
  login: User;
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

export interface LogoutMutationData {
  logout: boolean;
}

export interface CreateAuthorInput {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  biography?: string | null;
  nationality?: string | null;
}

export interface UpdateAuthorInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string | null;
  biography?: string | null;
  nationality?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string | null;
}

export interface CreatePublisherInput {
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  website?: string | null;
}

export interface UpdatePublisherInput {
  name?: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  website?: string | null;
}

export interface CreateBookInput {
  title: string;
  isbn?: string | null;
  publicationDate?: string | null;
  price?: string | null;
  description?: string | null;
  pageCount?: number | null;
  language?: string | null;
  publisherId?: number | null;
  authorIds?: number[];
  categoryIds?: number[];
}

export interface UpdateBookInput {
  title?: string;
  isbn?: string | null;
  publicationDate?: string | null;
  price?: string | null;
  description?: string | null;
  pageCount?: number | null;
  language?: string | null;
  publisherId?: number | null;
  authorIds?: number[];
  categoryIds?: number[];
}
