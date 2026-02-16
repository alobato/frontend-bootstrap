import { useMutation, useQuery } from "@apollo/client/react";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyStateCard, QueryErrorCard, QueryLoadingCard } from "@/components/admin/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CREATE_PUBLISHER_MUTATION, UPDATE_PUBLISHER_MUTATION } from "@/graphql/mutations";
import { PUBLISHERS_QUERY } from "@/graphql/queries";
import { formatDate } from "@/lib/format";
import type { CreatePublisherInput, Publisher, QueryPublishersData, UpdatePublisherInput } from "@/types/graphql";

interface PublisherMutationData {
  createPublisher?: Publisher;
  updatePublisher?: Publisher;
}

interface CreatePublisherMutationVariables {
  input: CreatePublisherInput;
}

interface UpdatePublisherMutationVariables {
  id: string;
  input: UpdatePublisherInput;
}

interface PublisherFormState {
  name: string;
  address: string;
  city: string;
  country: string;
  website: string;
}

const initialFormState: PublisherFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  website: "",
};

export function PublishersPage() {
  const [editingPublisherId, setEditingPublisherId] = useState<string | null>(null);
  const [form, setForm] = useState<PublisherFormState>(initialFormState);

  const publishersQuery = useQuery<QueryPublishersData>(PUBLISHERS_QUERY);
  const [createPublisher, { loading: creating }] = useMutation<PublisherMutationData, CreatePublisherMutationVariables>(
    CREATE_PUBLISHER_MUTATION,
  );
  const [updatePublisher, { loading: updating }] = useMutation<PublisherMutationData, UpdatePublisherMutationVariables>(
    UPDATE_PUBLISHER_MUTATION,
  );

  const isSubmitting = creating || updating;

  const resetForm = () => {
    setEditingPublisherId(null);
    setForm(initialFormState);
  };

  const startEditing = (publisher: Publisher) => {
    setEditingPublisherId(publisher.id);
    setForm({
      name: publisher.name,
      address: publisher.address ?? "",
      city: publisher.city ?? "",
      country: publisher.country ?? "",
      website: publisher.website ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Publisher name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      address: form.address || null,
      city: form.city || null,
      country: form.country || null,
      website: form.website || null,
    };

    try {
      if (editingPublisherId) {
        await updatePublisher({
          variables: {
            id: editingPublisherId,
            input: payload,
          },
        });
        toast.success("Publisher updated successfully.");
      } else {
        await createPublisher({
          variables: {
            input: payload,
          },
        });
        toast.success("Publisher created successfully.");
      }

      resetForm();
      await publishersQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save publisher.");
    }
  };

  if (publishersQuery.loading) {
    return <QueryLoadingCard title="Loading publishers" />;
  }

  if (publishersQuery.error) {
    return (
      <QueryErrorCard
        title="Unable to load publishers"
        message={publishersQuery.error.message}
        onRetry={() => publishersQuery.refetch()}
      />
    );
  }

  const publishers = publishersQuery.data?.publishers ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingPublisherId ? "Edit publisher" : "New publisher"}</CardTitle>
          <CardDescription>{editingPublisherId ? "Update selected publisher details." : "Create a new publisher."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="publisher-name">Name</Label>
              <Input id="publisher-name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publisher-address">Address</Label>
              <Input
                id="publisher-address"
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publisher-city">City</Label>
              <Input id="publisher-city" value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publisher-country">Country</Label>
              <Input
                id="publisher-country"
                value={form.country}
                onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="publisher-website">Website</Label>
              <Input
                id="publisher-website"
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {editingPublisherId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingPublisherId ? "Update" : "Create"}
              </Button>
              {editingPublisherId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {publishers.length === 0 ? (
          <EmptyStateCard title="No publishers found" description="Create your first publisher." />
        ) : (
          publishers.map((publisher) => (
            <Card key={publisher.id}>
              <CardHeader>
                <CardTitle className="text-base">{publisher.name}</CardTitle>
                <CardDescription>
                  {[publisher.city, publisher.country].filter(Boolean).join(", ") || "No location"} • Updated at: {formatDate(publisher.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{publisher.address || "No address provided."}</p>
                <p className="text-muted-foreground">{publisher.website || "No website provided."}</p>
                <Button variant="outline" onClick={() => startEditing(publisher)}>
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
