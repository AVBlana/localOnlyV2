"use client";

import styled from "styled-components";
import Link from "next/link";
import { Experience } from "@/types/experience";
import { formatPrice } from "@/utils/formatters";

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Location = styled.p`
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const Price = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e91e63;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #666;
`;

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card href={`/experiences/${experience.id}`}>
      <Image src={experience.image} alt={experience.title} />
      <Info>
        <Title>{experience.title}</Title>
        <Location>{experience.location}</Location>
        <Rating>⭐ {experience.rating}</Rating>
        <Price>{formatPrice(experience.price)}</Price>
      </Info>
    </Card>
  );
}

