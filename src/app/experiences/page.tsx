"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import UploadExperienceButton from "@/components/UploadExperienceButton";
import FilterBar from "@/components/FilterBar";
import FilterModal from "@/components/FilterModal";
import { useExperiencesQuery } from "@/hooks/useExperiencesQuery";
import ExperienceGrid from "@/components/ExperienceGrid";
import { ExperienceFilters, DEFAULT_FILTERS } from "@/types/filters";

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.header`
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem 0;
    flex-wrap: wrap;
  }
`;

const HeaderBottom = styled.div`
  padding: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const LogoImage = styled(Image)`
  width: 64px;
  height: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Prevents flex children from overflowing */
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Error = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const GridWrapper = styled.div`
  flex: 1;
  padding-top: 2rem;
  min-height: 0; /* Prevents flex children from overflowing */
  position: relative;
`;

const LoadMoreSentinel = styled.div`
  height: 1px;
`;

const LoadingMore = styled.div`
  text-align: center;
  padding: 2rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = styled.footer`
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  margin-top: auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3rem 0;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem 0;
    margin-top: 2rem;
  }
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1.5rem;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterLogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const FooterLogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FooterLogo = styled(Image)`
  width: 120px;
  height: auto;
  filter: brightness(0.95);
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
`;

const FooterBottom = styled.div`
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;


export default function ExperiencesPage() {
  const [filters, setFilters] = useState<ExperienceFilters>(DEFAULT_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExperiencesQuery(filters);

  const experiences = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const averagePrice = useMemo(() => {
    return data?.pages[0]?.averagePrice ?? 0;
  }, [data]);

  const maxPrice = useMemo(() => {
    return data?.pages[0]?.maxPrice ?? 1000;
  }, [data]);

  // Initialize filters with maxPrice when data is available
  useEffect(() => {
    if (maxPrice > 0 && maxPrice !== 1000) {
      setFilters((prev) => {
        // Only update if still using default max of 1000
        if (prev.priceRange[1] === 1000) {
          return {
            ...prev,
            priceRange: [0, maxPrice],
          };
        }
        return prev;
      });
    }
  }, [maxPrice]);

  const totalCount = useMemo(() => {
    return data?.pages[0]?.totalCount ?? experiences.length;
  }, [data, experiences.length]);

  const handleFiltersChange = useCallback((newFilters: ExperienceFilters) => {
    setFilters(newFilters);
  }, []);

  const handleOpenFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const sentinel = loadMoreRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.isIntersecting);

        if (entry && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <PageWrapper>
        <Header>
          <HeaderInner>
            <HeaderTop>
              <HeaderLeft>
                <LogoLink href="/">
                  <LogoImage
                    src="/localsOnlyLogoV4.7Tryangle.png"
                    alt="Locals Only"
                    width={64}
                    height={64}
                    priority
                  />
                </LogoLink>
                <Title>Experiences</Title>
              </HeaderLeft>
              <Actions>
                <BackLink href="/">← Home</BackLink>
                <ThemeToggle />
                <UploadExperienceButton />
                <AuthButton />
              </Actions>
            </HeaderTop>
          </HeaderInner>
        </Header>
        <Container>
          <Loading>Loading experiences...</Loading>
        </Container>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <Header>
          <HeaderInner>
            <HeaderTop>
              <HeaderLeft>
                <LogoLink href="/">
                  <LogoImage
                    src="/localsOnlyLogoV4.7Tryangle.png"
                    alt="Locals Only"
                    width={64}
                    height={64}
                  />
                </LogoLink>
                <Title>Experiences</Title>
              </HeaderLeft>
              <Actions>
                <BackLink href="/">← Home</BackLink>
                <ThemeToggle />
                <UploadExperienceButton />
                <AuthButton />
              </Actions>
            </HeaderTop>
          </HeaderInner>
        </Header>
        <Container>
          <Error>
            {error instanceof Error
              ? error.message
              : "Error loading experiences. Please try again later."}
          </Error>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderInner>
          <HeaderTop>
            <HeaderLeft>
              <LogoLink href="/">
                <LogoImage
                  src="/localsOnlyLogoV4.7Tryangle.png"
                  alt="Locals Only"
                  width={64}
                  height={64}
                />
              </LogoLink>
              <Title>Experiences</Title>
            </HeaderLeft>
            <Actions>
              <BackLink href="/">← Home</BackLink>
              <ThemeToggle />
              <UploadExperienceButton />
              <AuthButton />
            </Actions>
          </HeaderTop>
          <HeaderBottom>
            <FilterBar 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              onOpenModal={handleOpenFilterModal}
            />
          </HeaderBottom>
        </HeaderInner>
      </Header>
      <Container>
        <Content>
          {experiences.length > 0 ? (
            <>
              <GridWrapper>
                <ExperienceGrid experiences={experiences} />
              </GridWrapper>
              <LoadMoreSentinel ref={loadMoreRef} />
              {isFetchingNextPage && <LoadingMore>Loading more experiences...</LoadingMore>}
              {!hasNextPage && !isFetchingNextPage && (
                <LoadingMore>All experiences loaded.</LoadingMore>
              )}
            </>
          ) : (
            <Empty>No experiences found.</Empty>
          )}
        </Content>
      </Container>
      <Footer>
        <FooterInner>
          <FooterContent>
            <FooterSection>
              <FooterTitle>Locals Only</FooterTitle>
              <FooterText>
                Discover unique local experiences and connect with authentic hosts around the world.
              </FooterText>
            </FooterSection>
            <FooterSection>
              <FooterTitle>Explore</FooterTitle>
              <FooterLink href="/experiences">Browse Experiences</FooterLink>
              <FooterLink href="/experiences/new">Host an Experience</FooterLink>
              <FooterLink href="/">Home</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterTitle>About</FooterTitle>
              <FooterLink href="#">How it works</FooterLink>
              <FooterLink href="#">Safety</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
            </FooterSection>
            <FooterLogoSection>
              <FooterLogoLink href="/">
                <FooterLogo
                  src="/localsOnlyLogoV4.7Tryangle.png"
                  alt="Locals Only"
                  width={120}
                  height={120}
                />
              </FooterLogoLink>
            </FooterLogoSection>
          </FooterContent>
          <FooterBottom>
            <Copyright>© {new Date().getFullYear()} Locals Only. All rights reserved.</Copyright>
          </FooterBottom>
        </FooterInner>
      </Footer>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={totalCount}
        averagePrice={averagePrice}
        maxPrice={maxPrice}
      />
    </PageWrapper>
  );
}

