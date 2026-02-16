import { useMutation, useQuery } from "@apollo/client/react";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyStateCard, QueryErrorCard, QueryLoadingCard } from "@/components/admin/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_BOOK_MUTATION, UPDATE_BOOK_MUTATION } from "@/graphql/mutations";
import { AUTHORS_QUERY, BOOKS_QUERY, CATEGORIES_QUERY, PUBLISHERS_QUERY } from "@/graphql/queries";
import { formatDate } from "@/lib/format";
import type {
  Author,
  Book,
  Category,
  CreateBookInput,
  Publisher,
  QueryAuthorsData,
  QueryBooksData,
  QueryCategoriesData,
  QueryPublishersData,
  UpdateBookInput,
} from "@/types/graphql";

interface BookMutationData {
  createBook?: Book;
  updateBook?: Book;
}

interface CreateBookMutationVariables {
  input: CreateBookInput;
}

interface UpdateBookMutationVariables {
  id: string;
  input: UpdateBookInput;
}

interface BookFormState {
  title: string;
  isbn: string;
  publicationDate: string;
  price: string;
  description: string;
  pageCount: string;
  language: string;
  publisherId: string;
  authorIds: number[];
  categoryIds: number[];
}

const initialFormState: BookFormState = {
  title: "",
  isbn: "",
  publicationDate: "",
  price: "",
  description: "",
  pageCount: "",
  language: "",
  publisherId: "none",
  authorIds: [],
  categoryIds: [],
};

function toggleArrayValue(values: number[], value: number) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function toBookInput(form: BookFormState): CreateBookInput {
  return {
    title: form.title.trim(),
    isbn: form.isbn || null,
    publicationDate: form.publicationDate || null,
    price: form.price || null,
    description: form.description || null,
    pageCount: form.pageCount ? Number(form.pageCount) : null,
    language: form.language || null,
    publisherId: form.publisherId === "none" ? null : Number(form.publisherId),
    authorIds: form.authorIds,
    categoryIds: form.categoryIds,
  };
}

function mapBookToForm(book: Book): BookFormState {
  return {
    title: book.title,
    isbn: book.isbn ?? "",
    publicationDate: book.publicationDate ? book.publicationDate.slice(0, 10) : "",
    price: book.price ?? "",
    description: book.description ?? "",
    pageCount: book.pageCount?.toString() ?? "",
    language: book.language ?? "",
    publisherId: book.publisher ? book.publisher.id : "none",
    authorIds: book.authors.map((author) => Number(author.id)),
    categoryIds: book.categories.map((category) => Number(category.id)),
  };
}

function ResourceSelection({
  label,
  items,
  selectedIds,
  onToggle,
  getItemLabel,
}: {
  label: string;
  items: Array<Author | Category>;
  selectedIds: number[];
  onToggle: (value: number) => void;
  getItemLabel: (item: Author | Category) => string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border p-2">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No options available.</p>
        ) : (
          items.map((item) => {
            const id = Number(item.id);
            const checked = selectedIds.includes(id);
            return (
              <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={checked} onChange={() => onToggle(id)} />
                <span>{getItemLabel(item)}</span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}

export function BooksPage() {
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormState>(initialFormState);

  const booksQuery = useQuery<QueryBooksData>(BOOKS_QUERY);
  const authorsQuery = useQuery<QueryAuthorsData>(AUTHORS_QUERY);
  const categoriesQuery = useQuery<QueryCategoriesData>(CATEGORIES_QUERY);
  const publishersQuery = useQuery<QueryPublishersData>(PUBLISHERS_QUERY);

  const [createBook, { loading: creating }] = useMutation<BookMutationData, CreateBookMutationVariables>(CREATE_BOOK_MUTATION);
  const [updateBook, { loading: updating }] = useMutation<BookMutationData, UpdateBookMutationVariables>(UPDATE_BOOK_MUTATION);

  const isLoading = booksQuery.loading || authorsQuery.loading || categoriesQuery.loading || publishersQuery.loading;
  const hasError = booksQuery.error || authorsQuery.error || categoriesQuery.error || publishersQuery.error;

  const books = booksQuery.data?.books ?? [];
  const authors = authorsQuery.data?.authors ?? [];
  const categories = categoriesQuery.data?.categories ?? [];
  const publishers = publishersQuery.data?.publishers ?? [];

  const isSubmitting = creating || updating;

  const resetForm = () => {
    setEditingBookId(null);
    setForm(initialFormState);
  };

  const startEditing = (book: Book) => {
    setEditingBookId(book.id);
    setForm(mapBookToForm(book));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Book title is required.");
      return;
    }

    try {
      if (editingBookId) {
        await updateBook({
          variables: {
            id: editingBookId,
            input: toBookInput(form),
          },
        });
        toast.success("Book updated successfully.");
      } else {
        await createBook({
          variables: {
            input: toBookInput(form),
          },
        });
        toast.success("Book created successfully.");
      }

      resetForm();
      await booksQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save book.");
    }
  };

  if (isLoading) {
    return <QueryLoadingCard title="Loading books" />;
  }

  if (hasError) {
    return (
      <QueryErrorCard
        title="Unable to load books"
        message={hasError.message}
        onRetry={() => {
          void booksQuery.refetch();
          void authorsQuery.refetch();
          void categoriesQuery.refetch();
          void publishersQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingBookId ? "Edit book" : "New book"}</CardTitle>
          <CardDescription>{editingBookId ? "Update selected book details." : "Create a new book record."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="book-title">Title</Label>
              <Input id="book-title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="book-isbn">ISBN</Label>
                <Input id="book-isbn" value={form.isbn} onChange={(event) => setForm((prev) => ({ ...prev, isbn: event.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="book-language">Language</Label>
                <Input
                  id="book-language"
                  value={form.language}
                  onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="book-publication-date">Publication date</Label>
                <Input
                  id="book-publication-date"
                  type="date"
                  value={form.publicationDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, publicationDate: event.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="book-price">Price</Label>
                <Input id="book-price" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="book-page-count">Page count</Label>
                <Input
                  id="book-page-count"
                  type="number"
                  value={form.pageCount}
                  onChange={(event) => setForm((prev) => ({ ...prev, pageCount: event.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Publisher</Label>
                <Select value={form.publisherId} onValueChange={(value) => setForm((prev) => ({ ...prev, publisherId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a publisher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {publishers.map((publisher: Publisher) => (
                      <SelectItem key={publisher.id} value={publisher.id}>
                        {publisher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="book-description">Description</Label>
              <Textarea
                id="book-description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <ResourceSelection
              label="Authors"
              items={authors}
              selectedIds={form.authorIds}
              onToggle={(value) => setForm((prev) => ({ ...prev, authorIds: toggleArrayValue(prev.authorIds, value) }))}
              getItemLabel={(item) => `${(item as Author).firstName} ${(item as Author).lastName}`}
            />

            <ResourceSelection
              label="Categories"
              items={categories}
              selectedIds={form.categoryIds}
              onToggle={(value) => setForm((prev) => ({ ...prev, categoryIds: toggleArrayValue(prev.categoryIds, value) }))}
              getItemLabel={(item) => (item as Category).name}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {editingBookId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingBookId ? "Update" : "Create"}
              </Button>
              {editingBookId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {books.length === 0 ? (
          <EmptyStateCard title="No books found" description="Create your first book to start managing your catalog." />
        ) : (
          books.map((book) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle className="text-base">{book.title}</CardTitle>
                <CardDescription>
                  {book.publisher?.name ?? "No publisher"} • Updated at {formatDate(book.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-1">
                  {book.authors.map((author) => (
                    <Badge key={author.id} variant="outline">
                      {author.firstName} {author.lastName}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {book.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground">{book.description || "No description provided."}</p>
                <Button variant="outline" onClick={() => startEditing(book)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
