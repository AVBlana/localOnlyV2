"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import styled from "styled-components";
import ExperienceCard from "./ExperienceCard";
import { Experience } from "@/types/experience";

const GRID_GAP = 32;
const MIN_CARD_WIDTH = 280;
const ESTIMATED_ROW_HEIGHT = 380;
const VIRTUALIZATION_THRESHOLD = 12; // minimum items before enabling virtualization

const GridOuter = styled.div`
  position: relative;
  margin-top: 2rem;
  width: 100%;
`;

const VirtualRows = styled.div`
  position: relative;
  width: 100%;
`;

const RowWrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  will-change: transform;
`;

const Row = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: ${GRID_GAP}px;
  padding-bottom: ${GRID_GAP}px;
`;

const StaticGrid = styled.div`
  display: grid;
  margin-top: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(${MIN_CARD_WIDTH}px, 1fr));
  gap: ${GRID_GAP}px;
`;

const CardSlot = styled.div`
  min-width: 0;
`;

export interface VirtualizedExperienceGridProps {
  experiences: Experience[];
}

export default function VirtualizedExperienceGrid({ experiences }: VirtualizedExperienceGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);

  const handleContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    containerRef.current = node;

    if (!node) {
      return;
    }

    const updateWidth = () => {
      const width = Math.floor(node.getBoundingClientRect().width);
      setContainerWidth((prev) => (prev !== width ? width : prev));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    resizeObserverRef.current = observer;
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    const updateScrollMargin = () => {
      const rect = node.getBoundingClientRect();
      setScrollMargin(Math.max(0, window.scrollY + rect.top));
    };

    updateScrollMargin();
    window.addEventListener("resize", updateScrollMargin);

    return () => {
      window.removeEventListener("resize", updateScrollMargin);
    };
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  const columns = useMemo(() => {
    if (!containerWidth) {
      return 1;
    }

    const tentativeColumns = Math.floor((containerWidth + GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP));
    return Math.max(1, tentativeColumns);
  }, [containerWidth]);

  const rowCount = useMemo(
    () => Math.max(0, Math.ceil(experiences.length / columns)),
    [experiences.length, columns],
  );

  const shouldVirtualize = experiences.length >= VIRTUALIZATION_THRESHOLD && containerWidth > 0;

  const virtualizer = useWindowVirtualizer({
    count: shouldVirtualize ? rowCount : 0,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 5,
    scrollMargin,
  });

  if (!shouldVirtualize) {
    return (
      <StaticGrid ref={handleContainerRef}>
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </StaticGrid>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <GridOuter ref={handleContainerRef}>
      <VirtualRows style={{ height: virtualizer.getTotalSize() }}>
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = experiences.slice(startIndex, startIndex + columns);

          return (
            <RowWrapper
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Row $columns={columns}>
                {rowItems.map((experience) => (
                  <CardSlot key={experience.id}>
                    <ExperienceCard experience={experience} />
                  </CardSlot>
                ))}
              </Row>
            </RowWrapper>
          );
        })}
      </VirtualRows>
    </GridOuter>
  );
}

