"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.accent};
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

type CreateExperiencePayload = {
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
};

export default function ExperienceForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: CreateExperiencePayload) => {
      const { data } = await apiClient.post("/experiences", payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["experiences"] });
      setSuccess("Experience uploaded successfully!");
      setError(null);
      setTimeout(() => {
        router.push("/experiences");
      }, 800);
    },
    onError: (mutationError: unknown) => {
      console.error(mutationError);
      setError("Failed to create experience. Please try again.");
      setSuccess(null);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload: CreateExperiencePayload = {
      title: String(formData.get("title") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      price: Number(formData.get("price")),
      rating: Number(formData.get("rating")),
      image: String(formData.get("image") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || undefined,
    };

    if (!payload.title || !payload.location || !payload.image || !Number.isFinite(payload.price) || !Number.isFinite(payload.rating)) {
      setError("All fields except description are required.");
      setSuccess(null);
      return;
    }

    mutation.mutate(payload);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container>
      <Title>Upload an Experience</Title>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Sunset kayak tour" required disabled={mutation.isPending} />
        </Field>
        <Field>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Lisbon, Portugal" required disabled={mutation.isPending} />
        </Field>
        <Field>
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="150" required disabled={mutation.isPending} />
        </Field>
        <Field>
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input id="rating" name="rating" type="number" min="0" max="5" step="0.1" placeholder="4.8" required disabled={mutation.isPending} />
        </Field>
        <Field>
          <Label htmlFor="image">Cover Image URL</Label>
          <Input id="image" name="image" type="url" placeholder="https://images..." required disabled={mutation.isPending} />
        </Field>
        <Field>
          <Label htmlFor="description">Description</Label>
          <TextArea id="description" name="description" placeholder="Tell guests what makes this experience special" disabled={mutation.isPending} />
        </Field>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {success && <SuccessMessage role="status">{success}</SuccessMessage>}
        <Actions>
          <SubmitButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Uploading..." : "Upload"}
          </SubmitButton>
          <CancelButton type="button" onClick={handleCancel} disabled={mutation.isPending}>
            Cancel
          </CancelButton>
        </Actions>
      </Form>
    </Container>
  );
}


