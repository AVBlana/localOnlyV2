"use client";

import styled from "styled-components";
import Link from "next/link";
import { useExperiencesQuery } from "@/hooks/useExperiencesQuery";
import ExperienceCard from "@/components/ExperienceCard";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const BackLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    color: #e91e63;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
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

const Empty = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.2rem;
`;

export default function ExperiencesPage() {
  const { data: experiences, isLoading, error } = useExperiencesQuery();

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Experiences</Title>
          <BackLink href="/">← Home</BackLink>
        </Header>
        <Loading>Loading experiences...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Experiences</Title>
          <BackLink href="/">← Home</BackLink>
        </Header>
        <Error>Error loading experiences. Please try again later.</Error>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Experiences</Title>
        <BackLink href="/">← Home</BackLink>
      </Header>
      {experiences && experiences.length > 0 ? (
        <Grid>
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </Grid>
      ) : (
        <Empty>No experiences found.</Empty>
      )}
    </Container>
  );
}

