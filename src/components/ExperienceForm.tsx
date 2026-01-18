"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  ACTIVITY_TYPES,
  TIME_OF_DAYS,
  DURATIONS,
  SPECIALS,
  ActivityType,
  TimeOfDay,
  Duration,
  Special,
} from "@/types/filters";

const Container = styled.div`
  width: 100%;
  padding: 2rem clamp(24px, 5vw, 80px);
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

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const CheckboxLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RadioContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const RadioLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

type CreateExperiencePayload = {
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
  activityTypes?: ActivityType[];
  timeOfDays?: TimeOfDay[];
  duration?: Duration | null;
  specials?: Special[];
};

export default function ExperienceForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filter state
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [timeOfDays, setTimeOfDays] = useState<TimeOfDay[]>([]);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [specials, setSpecials] = useState<Special[]>([]);

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

  const handleActivityTypeToggle = (activityType: ActivityType) => {
    setActivityTypes((prev) =>
      prev.includes(activityType)
        ? prev.filter((t) => t !== activityType)
        : [...prev, activityType]
    );
  };

  const handleTimeOfDayToggle = (timeOfDay: TimeOfDay) => {
    setTimeOfDays((prev) =>
      prev.includes(timeOfDay)
        ? prev.filter((t) => t !== timeOfDay)
        : [...prev, timeOfDay]
    );
  };

  const handleDurationChange = (newDuration: Duration) => {
    setDuration(newDuration === duration ? null : newDuration);
  };

  const handleSpecialToggle = (special: Special) => {
    setSpecials((prev) =>
      prev.includes(special)
        ? prev.filter((s) => s !== special)
        : [...prev, special]
    );
  };

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
      activityTypes: activityTypes.length > 0 ? activityTypes : undefined,
      timeOfDays: timeOfDays.length > 0 ? timeOfDays : undefined,
      duration: duration || undefined,
      specials: specials.length > 0 ? specials : undefined,
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

        <SectionTitle>Activity Type</SectionTitle>
        <CheckboxGroup>
          {ACTIVITY_TYPES.map((type) => (
            <CheckboxContainer key={type}>
              <CheckboxInput
                type="checkbox"
                checked={activityTypes.includes(type)}
                onChange={() => handleActivityTypeToggle(type)}
                disabled={mutation.isPending}
              />
              <CheckboxLabel>{type}</CheckboxLabel>
            </CheckboxContainer>
          ))}
        </CheckboxGroup>

        <SectionTitle>Time of Day</SectionTitle>
        <CheckboxGroup>
          {TIME_OF_DAYS.map((time) => (
            <CheckboxContainer key={time}>
              <CheckboxInput
                type="checkbox"
                checked={timeOfDays.includes(time)}
                onChange={() => handleTimeOfDayToggle(time)}
                disabled={mutation.isPending}
              />
              <CheckboxLabel>{time}</CheckboxLabel>
            </CheckboxContainer>
          ))}
        </CheckboxGroup>

        <SectionTitle>Duration</SectionTitle>
        <RadioGroup>
          {DURATIONS.map((dur) => (
            <RadioContainer key={dur}>
              <RadioInput
                type="radio"
                name="duration"
                checked={duration === dur}
                onChange={() => handleDurationChange(dur)}
                disabled={mutation.isPending}
              />
              <RadioLabel>{dur}</RadioLabel>
            </RadioContainer>
          ))}
        </RadioGroup>

        <SectionTitle>Specials</SectionTitle>
        <CheckboxGroup>
          {SPECIALS.map((special) => (
            <CheckboxContainer key={special}>
              <CheckboxInput
                type="checkbox"
                checked={specials.includes(special)}
                onChange={() => handleSpecialToggle(special)}
                disabled={mutation.isPending}
              />
              <CheckboxLabel>{special}</CheckboxLabel>
            </CheckboxContainer>
          ))}
        </CheckboxGroup>

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


