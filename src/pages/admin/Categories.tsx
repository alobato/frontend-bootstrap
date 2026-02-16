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
import { CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION } from "@/graphql/mutations";
import { CATEGORIES_QUERY } from "@/graphql/queries";
import { formatDate } from "@/lib/format";
import type { Category, CreateCategoryInput, QueryCategoriesData, UpdateCategoryInput } from "@/types/graphql";

interface CategoryMutationData {
  createCategory?: Category;
  updateCategory?: Category;
}

interface CreateCategoryMutationVariables {
  input: CreateCategoryInput;
}

interface UpdateCategoryMutationVariables {
  id: string;
  input: UpdateCategoryInput;
}

interface CategoryFormState {
  name: string;
  description: string;
}

const initialFormState: CategoryFormState = {
  name: "",
  description: "",
};

export function CategoriesPage() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);

  const categoriesQuery = useQuery<QueryCategoriesData>(CATEGORIES_QUERY);
  const [createCategory, { loading: creating }] = useMutation<CategoryMutationData, CreateCategoryMutationVariables>(
    CREATE_CATEGORY_MUTATION,
  );
  const [updateCategory, { loading: updating }] = useMutation<CategoryMutationData, UpdateCategoryMutationVariables>(
    UPDATE_CATEGORY_MUTATION,
  );

  const isSubmitting = creating || updating;

  const resetForm = () => {
    setEditingCategoryId(null);
    setForm(initialFormState);
  };

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategory({
          variables: {
            id: editingCategoryId,
            input: {
              name: form.name.trim(),
              description: form.description || null,
            },
          },
        });
        toast.success("Category updated successfully.");
      } else {
        await createCategory({
          variables: {
            input: {
              name: form.name.trim(),
              description: form.description || null,
            },
          },
        });
        toast.success("Category created successfully.");
      }

      resetForm();
      await categoriesQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save category.");
    }
  };

  if (categoriesQuery.loading) {
    return <QueryLoadingCard title="Loading categories" />;
  }

  if (categoriesQuery.error) {
    return (
      <QueryErrorCard
        title="Unable to load categories"
        message={categoriesQuery.error.message}
        onRetry={() => categoriesQuery.refetch()}
      />
    );
  }

  const categories = categoriesQuery.data?.categories ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingCategoryId ? "Edit category" : "New category"}</CardTitle>
          <CardDescription>{editingCategoryId ? "Update selected category details." : "Create a new category."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {editingCategoryId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingCategoryId ? "Update" : "Create"}
              </Button>
              {editingCategoryId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <EmptyStateCard title="No categories found" description="Create your first category." />
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
                <CardDescription>Updated at: {formatDate(category.updatedAt)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{category.description || "No description provided."}</p>
                <Button variant="outline" onClick={() => startEditing(category)}>
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
