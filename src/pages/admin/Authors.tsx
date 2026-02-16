import { useMutation, useQuery } from "@apollo/client/react";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyStateCard, QueryErrorCard, QueryLoadingCard } from "@/components/admin/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_AUTHOR_MUTATION, UPDATE_AUTHOR_MUTATION } from "@/graphql/mutations";
import { AUTHORS_QUERY } from "@/graphql/queries";
import { formatDate } from "@/lib/format";
import type { Author, CreateAuthorInput, QueryAuthorsData, UpdateAuthorInput } from "@/types/graphql";

interface AuthorMutationData {
  createAuthor?: Author;
  updateAuthor?: Author;
}

interface CreateAuthorMutationVariables {
  input: CreateAuthorInput;
}

interface UpdateAuthorMutationVariables {
  id: string;
  input: UpdateAuthorInput;
}

interface AuthorFormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  biography: string;
  nationality: string;
}

const initialFormState: AuthorFormState = {
  firstName: "",
  lastName: "",
  birthDate: "",
  biography: "",
  nationality: "",
};

function toAuthorInput(form: AuthorFormState): CreateAuthorInput {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    birthDate: form.birthDate || null,
    biography: form.biography || null,
    nationality: form.nationality || null,
  };
}

export function AuthorsPage() {
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  const [form, setForm] = useState<AuthorFormState>(initialFormState);

  const authorsQuery = useQuery<QueryAuthorsData>(AUTHORS_QUERY);
  const [createAuthor, { loading: creating }] = useMutation<AuthorMutationData, CreateAuthorMutationVariables>(CREATE_AUTHOR_MUTATION);
  const [updateAuthor, { loading: updating }] = useMutation<AuthorMutationData, UpdateAuthorMutationVariables>(UPDATE_AUTHOR_MUTATION);

  const isSubmitting = creating || updating;

  const resetForm = () => {
    setEditingAuthorId(null);
    setForm(initialFormState);
  };

  const startEditing = (author: Author) => {
    setEditingAuthorId(author.id);
    setForm({
      firstName: author.firstName,
      lastName: author.lastName,
      birthDate: author.birthDate ?? "",
      biography: author.biography ?? "",
      nationality: author.nationality ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    try {
      if (editingAuthorId) {
        await updateAuthor({
          variables: {
            id: editingAuthorId,
            input: toAuthorInput(form),
          },
        });
        toast.success("Author updated successfully.");
      } else {
        await createAuthor({
          variables: {
            input: toAuthorInput(form),
          },
        });
        toast.success("Author created successfully.");
      }

      resetForm();
      await authorsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save author.");
    }
  };

  if (authorsQuery.loading) {
    return <QueryLoadingCard title="Loading authors" />;
  }

  if (authorsQuery.error) {
    return <QueryErrorCard title="Unable to load authors" message={authorsQuery.error.message} onRetry={() => authorsQuery.refetch()} />;
  }

  const authors = authorsQuery.data?.authors ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingAuthorId ? "Edit author" : "New author"}</CardTitle>
          <CardDescription>{editingAuthorId ? "Update selected author details." : "Create a new author record."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="author-first-name">First name</Label>
              <Input
                id="author-first-name"
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="author-last-name">Last name</Label>
              <Input
                id="author-last-name"
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="author-birth-date">Birth date</Label>
              <Input
                id="author-birth-date"
                type="date"
                value={form.birthDate}
                onChange={(event) => setForm((prev) => ({ ...prev, birthDate: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="author-nationality">Nationality</Label>
              <Input
                id="author-nationality"
                value={form.nationality}
                onChange={(event) => setForm((prev) => ({ ...prev, nationality: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="author-biography">Biography</Label>
              <Textarea
                id="author-biography"
                value={form.biography}
                onChange={(event) => setForm((prev) => ({ ...prev, biography: event.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {editingAuthorId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingAuthorId ? "Update" : "Create"}
              </Button>
              {editingAuthorId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {authors.length === 0 ? (
          <EmptyStateCard title="No authors found" description="Create your first author to get started." />
        ) : (
          authors.map((author) => (
            <Card key={author.id}>
              <CardHeader>
                <CardTitle className="text-base">{author.firstName} {author.lastName}</CardTitle>
                <CardDescription>
                  Nationality: {author.nationality ?? "-"} • Birth date: {formatDate(author.birthDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{author.biography || "No biography provided."}</p>
                <p className="text-xs text-muted-foreground">Updated at: {formatDate(author.updatedAt)}</p>
                <Button variant="outline" onClick={() => startEditing(author)}>
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
