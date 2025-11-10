"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { formatPrice, formatRating } from "@/utils/formatters";

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

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1.5rem;
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
  };
};

export default function ExperienceDetailContent({
  experience,
}: ExperienceDetailProps) {
  return (
    <Container>
      <BackLink href="/experiences">← Back to Experiences</BackLink>
      <HeroImageWrapper>
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 800px) 100vw, 800px"
          priority
          style={{ objectFit: "cover" }}
        />
      </HeroImageWrapper>
      <Title>{experience.title}</Title>
      <Location>{experience.location}</Location>
      {experience.hostName && <HostInfo>Hosted by {experience.hostName}</HostInfo>}
      <Price>{formatPrice(experience.price)}</Price>
      <Rating>⭐ {formatRating(experience.rating)}</Rating>
      {experience.description && (
        <Description>{experience.description}</Description>
      )}
    </Container>
  );
}

