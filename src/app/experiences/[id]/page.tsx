"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { Experience } from "@/types/experience";
import { formatPrice, formatRating } from "@/utils/formatters";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1.5rem;

  &:hover {
    color: #e91e63;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Location = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e91e63;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin-top: 1.5rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const Error = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e91e63;
  font-size: 1.2rem;
`;

export default function ExperienceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: experience, isLoading, error } = useQuery<Experience>({
    queryKey: ["experience", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/experiences/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Container>
        <Loading>Loading experience...</Loading>
      </Container>
    );
  }

  if (error || !experience) {
    return (
      <Container>
        <Error>Error loading experience. Please try again later.</Error>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href="/experiences">← Back to Experiences</BackLink>
      <Image src={experience.image} alt={experience.title} />
      <Title>{experience.title}</Title>
      <Location>{experience.location}</Location>
      <Price>{formatPrice(experience.price)}</Price>
      <Rating>⭐ {formatRating(experience.rating)}</Rating>
      {experience.description && (
        <Description>{experience.description}</Description>
      )}
    </Container>
  );
}

