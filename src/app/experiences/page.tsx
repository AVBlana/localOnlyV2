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
import SearchBar from "@/components/SearchBar";
import { useExperiencesQuery } from "@/hooks/useExperiencesQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import ExperienceGrid from "@/components/ExperienceGrid";
import AppFooter from "@/components/AppFooter";
import { ExperienceFilters, DEFAULT_FILTERS } from "@/types/filters";
import {
  SearchParams,
  DEFAULT_SEARCH_PARAMS,
} from "@/types/search";

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  padding: 0 clamp(24px, 5vw, 80px) 2rem;
  display: flex;
  flex-direction: column;
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
  z-index: 1000;
`;

const HeaderInner = styled.div`
  width: 100%;
  padding: 0 clamp(24px, 5vw, 80px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 1rem 0;
  }
`;

const HeaderBottom = styled.div`
  padding: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const HeaderCenter = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 400px;
  margin: 0 2rem;

  @media (max-width: 900px) {
    flex: 1 1 100%;
    order: 3;
    max-width: none;
    margin: 0.5rem 0 0;
  }
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
  padding: 4rem 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Error = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 4rem 0;
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

export default function ExperiencesPage() {
  const [filters, setFilters] = useState<ExperienceFilters>(DEFAULT_FILTERS);
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_SEARCH_PARAMS);
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

  // Debounce search inputs so filtering runs only when the user stops typing (performance).
  const debouncedLocation = useDebouncedValue(searchParams.location, 300);
  const debouncedExperience = useDebouncedValue(searchParams.experience, 300);

  // Client-side filtering by SearchBar (location, experience text). Date is for future API.
  const filteredExperiences = useMemo(() => {
    let list = experiences;
    const loc = debouncedLocation.trim().toLowerCase();
    if (loc) {
      list = list.filter((e) =>
        e.location.toLowerCase().includes(loc),
      );
    }
    const exp = debouncedExperience.trim().toLowerCase();
    if (exp) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(exp) ||
          (e.description ?? "").toLowerCase().includes(exp),
      );
    }
    return list;
  }, [experiences, debouncedLocation, debouncedExperience]);

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
              <HeaderCenter>
                <SearchBar
                  value={searchParams}
                  onChange={setSearchParams}
                  onSearch={setSearchParams}
                />
              </HeaderCenter>
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
              <HeaderCenter>
                <SearchBar
                  value={searchParams}
                  onChange={setSearchParams}
                  onSearch={setSearchParams}
                />
              </HeaderCenter>
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
              <HeaderCenter>
                <SearchBar
                  value={searchParams}
                  onChange={setSearchParams}
                  onSearch={setSearchParams}
                />
              </HeaderCenter>
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
          {filteredExperiences.length > 0 ? (
            <>
              <GridWrapper>
                <ExperienceGrid experiences={filteredExperiences} />
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
      <AppFooter />
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

