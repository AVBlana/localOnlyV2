"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { Experience } from "@/types/experience";
import { formatPrice } from "@/utils/formatters";

export const CARD_IMAGE_RATIO = 1.5; // 3:2 aspect ratio

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  background: ${({ theme }) => theme.colors.cardBackground};
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  contain: layout style paint;
  backface-visibility: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${CARD_IMAGE_RATIO};
  background: ${({ theme }) => theme.colors.surface};
`;

const Info = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
`;

const Location = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Host = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const Price = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
`;

const Rating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

function ExperienceCardComponent({ experience }: { experience: Experience }) {
  return (
    <Card href={`/experiences/${experience.id}`} scroll={false}>
      <ImageWrapper>
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
      </ImageWrapper>
      <Info>
        <Title>{experience.title}</Title>
        <Location>{experience.location}</Location>
        {experience.hostName && <Host>Hosted by {experience.hostName}</Host>}
        <Rating aria-label={`Rating ${experience.rating} out of 5`}>
          <span aria-hidden="true">⭐</span>
          {experience.rating.toFixed(1)}
        </Rating>
        <Price>{formatPrice(experience.price)}</Price>
      </Info>
    </Card>
  );
}

export default memo(ExperienceCardComponent);

