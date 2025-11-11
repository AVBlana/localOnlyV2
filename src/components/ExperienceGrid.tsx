"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import ExperienceCard, { CARD_IMAGE_RATIO } from "./ExperienceCard";
import { Experience } from "@/types/experience";

const GRID_GAP_PX = 32; // matches 2rem gap from previous grid
const INFO_HEIGHT_ESTIMATE = 160; // heuristic for text block height

const GridContainer = styled.div`
  position: relative;
  width: 100%;
`;

const VirtualRow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const RowGrid = styled.div<{ $columns: number }>`
  display: grid;
  width: 100%;
  gap: ${GRID_GAP_PX}px;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  padding-bottom: ${GRID_GAP_PX}px;
`;

const SimpleGrid = styled.div<{ $columns: number }>`
  display: grid;
  width: 100%;
  gap: ${GRID_GAP_PX}px;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
`;

type ExperienceGridProps = {
  experiences: Experience[];
};

export default function ExperienceGrid({ experiences }: ExperienceGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);

  const columns = useMemo(() => {
    if (containerWidth >= 1080) return 3;
    if (containerWidth >= 720) return 2;
    return 1;
  }, [containerWidth]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setContainerWidth(entry.contentRect.width);
    });
    resizeObserver.observe(node);

    const updateScrollMargin = () => {
      const rect = node.getBoundingClientRect();
      setScrollMargin(window.scrollY + rect.top);
    };

    updateScrollMargin();
    window.addEventListener("resize", updateScrollMargin);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollMargin);
    };
  }, []);

  const rows = useMemo(() => {
    if (!experiences.length) {
      return [];
    }
    const nextRows: Experience[][] = [];
    for (let i = 0; i < experiences.length; i += columns) {
      nextRows.push(experiences.slice(i, i + columns));
    }
    return nextRows;
  }, [experiences, columns]);

  const safeColumns = useMemo(() => Math.max(columns, 1), [columns]);

  const estimatedRowHeight = useMemo(() => {
    if (containerWidth === 0) {
      return 320;
    }
    const totalGapWidth = GRID_GAP_PX * Math.max(safeColumns - 1, 0);
    const cardWidth = (containerWidth - totalGapWidth) / safeColumns;
    const imageHeight = cardWidth / CARD_IMAGE_RATIO;
    return imageHeight + INFO_HEIGHT_ESTIMATE + GRID_GAP_PX;
  }, [safeColumns, containerWidth]);

  const shouldUseVirtualization =
    rows.length > safeColumns * 2 && containerWidth > 0;

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => estimatedRowHeight,
    overscan: 4,
    scrollMargin,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  if (!shouldUseVirtualization) {
    return (
      <GridContainer ref={containerRef}>
        <SimpleGrid $columns={safeColumns}>
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </SimpleGrid>
      </GridContainer>
    );
  }

  return (
    <GridContainer ref={containerRef}>
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {virtualRows.map((virtualRow) => {
          const rowExperiences = rows[virtualRow.index] ?? [];

          return (
            <VirtualRow
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <RowGrid $columns={safeColumns}>
                {rowExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </RowGrid>
            </VirtualRow>
          );
        })}
      </div>
    </GridContainer>
  );
}

