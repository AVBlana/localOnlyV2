"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { formatPrice, formatRating } from "@/utils/formatters";
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.surface};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Location = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;
`;

const HostInfo = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  font-size: 1.3rem;
  color: ${({ $filled, theme }) => 
    $filled ? '#FFD700' : theme.colors.textSecondary};
  opacity: ${({ $filled }) => $filled ? 1 : 0.3};
  line-height: 1;
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.2rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1.5rem;
`;

const FiltersSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FiltersTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterChip = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: background 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const RadioContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: background 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const EditActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Field = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
  box-sizing: border-box;
`;

type ExperienceDetailProps = {
  experience: {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    image: string;
    description?: string | null;
    createdAt?: string;
    hostName?: string | null;
    activityTypes?: ActivityType[];
    timeOfDays?: TimeOfDay[];
    duration?: Duration | null;
    specials?: Special[];
  };
};

export default function ExperienceDetailContent({
  experience,
}: ExperienceDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(experience.title);
  const [location, setLocation] = useState(experience.location);
  const [price, setPrice] = useState(experience.price.toString());
  const [image, setImage] = useState(experience.image);
  const [description, setDescription] = useState(experience.description || "");
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(
    experience.activityTypes || []
  );
  const [timeOfDays, setTimeOfDays] = useState<TimeOfDay[]>(
    experience.timeOfDays || []
  );
  const [duration, setDuration] = useState<Duration | null>(
    experience.duration || null
  );
  const [specials, setSpecials] = useState<Special[]>(
    experience.specials || []
  );

  const isHost = session?.user?.role === "HOST";

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      title?: string;
      location?: string;
      price?: number;
      image?: string;
      description?: string;
      activityTypes?: ActivityType[];
      timeOfDays?: TimeOfDay[];
      duration?: Duration | null;
      specials?: Special[];
    }) => {
      const { data } = await apiClient.put(`/experiences/${experience.id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experience", experience.id] });
      setIsEditing(false);
      router.refresh();
    },
  });

  const handleActivityTypeToggle = useCallback((activityType: ActivityType) => {
    setActivityTypes((prev) =>
      prev.includes(activityType)
        ? prev.filter((t) => t !== activityType)
        : [...prev, activityType]
    );
  }, []);

  const handleTimeOfDayToggle = useCallback((timeOfDay: TimeOfDay) => {
    setTimeOfDays((prev) =>
      prev.includes(timeOfDay)
        ? prev.filter((t) => t !== timeOfDay)
        : [...prev, timeOfDay]
    );
  }, []);

  const handleDurationChange = useCallback((newDuration: Duration) => {
    setDuration(newDuration === duration ? null : newDuration);
  }, [duration]);

  const handleSpecialToggle = useCallback((special: Special) => {
    setSpecials((prev) =>
      prev.includes(special)
        ? prev.filter((s) => s !== special)
        : [...prev, special]
    );
  }, []);

  const handleSave = useCallback(() => {
    updateMutation.mutate({
      title: title.trim(),
      location: location.trim(),
      price: Number(price),
      image: image.trim(),
      description: description.trim() || undefined,
      activityTypes: activityTypes.length > 0 ? activityTypes : [],
      timeOfDays: timeOfDays.length > 0 ? timeOfDays : [],
      duration: duration || null,
      specials: specials.length > 0 ? specials : [],
    });
  }, [title, location, price, image, description, activityTypes, timeOfDays, duration, specials, updateMutation]);

  const handleCancel = useCallback(() => {
    setTitle(experience.title);
    setLocation(experience.location);
    setPrice(experience.price.toString());
    setImage(experience.image);
    setDescription(experience.description || "");
    setActivityTypes(experience.activityTypes || []);
    setTimeOfDays(experience.timeOfDays || []);
    setDuration(experience.duration || null);
    setSpecials(experience.specials || []);
    setIsEditing(false);
  }, [experience]);

  // Update state when experience prop changes
  useEffect(() => {
    if (!isEditing) {
      setTitle(experience.title);
      setLocation(experience.location);
      setPrice(experience.price.toString());
      setImage(experience.image);
      setDescription(experience.description || "");
      setActivityTypes(experience.activityTypes || []);
      setTimeOfDays(experience.timeOfDays || []);
      setDuration(experience.duration || null);
      setSpecials(experience.specials || []);
    }
  }, [experience, isEditing]);

  const hasFilters =
    (experience.activityTypes && experience.activityTypes.length > 0) ||
    (experience.timeOfDays && experience.timeOfDays.length > 0) ||
    experience.duration ||
    (experience.specials && experience.specials.length > 0);

  return (
    <Container>
      <BackLink href="/experiences">← Back to Experiences</BackLink>
      <HeroImageWrapper>
        <Image
          src={isEditing ? image : experience.image}
          alt={isEditing ? title : experience.title}
          fill
          sizes="(max-width: 800px) 100vw, 800px"
          priority
          style={{ objectFit: "cover" }}
        />
      </HeroImageWrapper>
      {!isEditing && (
        <>
          <Title>{experience.title}</Title>
          <Location>{experience.location}</Location>
        </>
      )}
      {!isEditing && experience.hostName && <HostInfo>Hosted by {experience.hostName}</HostInfo>}
      {!isEditing && <Price>{formatPrice(experience.price)}</Price>}
      <Rating aria-label={`Rating ${experience.rating.toFixed(1)} out of 5`}>
        <StarsContainer>
          {Array.from({ length: Math.floor(experience.rating) }).map((_, i) => (
            <Star key={`full-${i}`} $filled={true} aria-hidden="true">
              ★
            </Star>
          ))}
          {experience.rating % 1 >= 0.5 && (
            <Star $filled={true} aria-hidden="true" style={{ opacity: 0.6 }}>
              ★
            </Star>
          )}
          {Array.from({ length: 5 - Math.floor(experience.rating) - (experience.rating % 1 >= 0.5 ? 1 : 0) }).map((_, i) => (
            <Star key={`empty-${i}`} $filled={false} aria-hidden="true">
              ★
            </Star>
          ))}
        </StarsContainer>
        <RatingValue>{experience.rating.toFixed(1)}</RatingValue>
      </Rating>
      {isHost && !isEditing && (
        <EditButton onClick={() => setIsEditing(true)}>
          Edit Experience
        </EditButton>
      )}
      {!isEditing && experience.description && (
        <Description>{experience.description}</Description>
      )}

      {hasFilters && !isEditing && (
        <FiltersSection>
          <FiltersTitle>Filters & Details</FiltersTitle>
          {experience.activityTypes && experience.activityTypes.length > 0 && (
            <div>
              <strong>Activity Type:</strong>
              <FilterChips>
                {experience.activityTypes.map((type) => (
                  <FilterChip key={type}>{type}</FilterChip>
                ))}
              </FilterChips>
            </div>
          )}
          {experience.timeOfDays && experience.timeOfDays.length > 0 && (
            <div>
              <strong>Time of Day:</strong>
              <FilterChips>
                {experience.timeOfDays.map((time) => (
                  <FilterChip key={time}>{time}</FilterChip>
                ))}
              </FilterChips>
            </div>
          )}
          {experience.duration && (
            <div>
              <strong>Duration:</strong>
              <FilterChips>
                <FilterChip>{experience.duration}</FilterChip>
              </FilterChips>
            </div>
          )}
          {experience.specials && experience.specials.length > 0 && (
            <div>
              <strong>Specials:</strong>
              <FilterChips>
                {experience.specials.map((special) => (
                  <FilterChip key={special}>{special}</FilterChip>
                ))}
              </FilterChips>
            </div>
          )}
        </FiltersSection>
      )}

      {isEditing && isHost && (
        <EditSection>
          <FiltersTitle>Edit Experience</FiltersTitle>

          <Field>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={updateMutation.isPending}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={updateMutation.isPending}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="edit-price">Price (USD)</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={updateMutation.isPending}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="edit-image">Cover Image URL</Label>
            <Input
              id="edit-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={updateMutation.isPending}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="edit-description">Description</Label>
            <TextArea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={updateMutation.isPending}
              placeholder="Tell guests what makes this experience special"
            />
          </Field>

          <FiltersTitle style={{ marginTop: "2rem" }}>Filters & Details</FiltersTitle>

          <Field>
            <Label>Activity Type</Label>
            <CheckboxGroup>
              {ACTIVITY_TYPES.map((type) => (
                <CheckboxContainer key={type}>
                  <CheckboxInput
                    type="checkbox"
                    checked={activityTypes.includes(type)}
                    onChange={() => handleActivityTypeToggle(type)}
                    disabled={updateMutation.isPending}
                  />
                  <span>{type}</span>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Field>

          <Field>
            <Label>Time of Day</Label>
            <CheckboxGroup>
              {TIME_OF_DAYS.map((time) => (
                <CheckboxContainer key={time}>
                  <CheckboxInput
                    type="checkbox"
                    checked={timeOfDays.includes(time)}
                    onChange={() => handleTimeOfDayToggle(time)}
                    disabled={updateMutation.isPending}
                  />
                  <span>{time}</span>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Field>

          <Field>
            <Label>Duration</Label>
            <RadioGroup>
              {DURATIONS.map((dur) => (
                <RadioContainer key={dur}>
                  <RadioInput
                    type="radio"
                    name="duration"
                    checked={duration === dur}
                    onChange={() => handleDurationChange(dur)}
                    disabled={updateMutation.isPending}
                  />
                  <span>{dur}</span>
                </RadioContainer>
              ))}
            </RadioGroup>
          </Field>

          <Field>
            <Label>Specials</Label>
            <CheckboxGroup>
              {SPECIALS.map((special) => (
                <CheckboxContainer key={special}>
                  <CheckboxInput
                    type="checkbox"
                    checked={specials.includes(special)}
                    onChange={() => handleSpecialToggle(special)}
                    disabled={updateMutation.isPending}
                  />
                  <span>{special}</span>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Field>

          <EditActions>
            <SaveButton
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </SaveButton>
            <CancelButton
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </CancelButton>
          </EditActions>
        </EditSection>
      )}
    </Container>
  );
}

