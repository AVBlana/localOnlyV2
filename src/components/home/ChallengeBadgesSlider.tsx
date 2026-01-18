"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChallengeBadgeCard from "./ChallengeBadgeCard";

const Section = styled.section`
  width: 100%;
  padding: 0;
`;

const Header = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const TitleWrap = styled.div`
  position: relative;
  padding-left: 12px;
  padding-bottom: 8px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    background: ${({ theme }) => theme.colors.accent};
    border-top-left-radius: 6px;
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 6px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NavArrowsWrap = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 10px;
  overflow: hidden;
`;

const NavArrowBtn = styled.button<{ $active?: boolean }>`
  width: 44px;
  height: 44px;
  border: none;
  background: ${({ $active }) => ($active ? "transparent" : "rgba(0, 0, 0, 0.45)")};
  color: #fff;
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.45)")};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SliderWrap = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-bottom: 10rem;
`;

const Track = styled.div`
  width: 100%;
  overflow: hidden;
`;

const List = styled.div<{ $offset: number }>`
  display: flex;
  gap: 1.25rem;
  transform: translateX(${({ $offset }) => $offset}px);
  transition: transform 0.35s ease;
  margin-top: 2rem;

`;

const CHALLENGES = [
  {
    id: "foraging",
    title: "Foraging",
    description: "Knowledge of the environment, adaptability, and identifying plants and fungi.",
    icon: "🫐",
    complete: false,
  },
  {
    id: "orienteering",
    title: "Orienteering",
    description: "Adaptability, quick decision-making in varying terrain, and resourcefulness.",
    icon: "🧭",
    complete: true,
  },
  {
    id: "trail-running",
    title: "Trail Running",
    description: "Endurance, agility, and comfort on varied and technical terrain.",
    icon: "🏃",
    complete: false,
  },
  {
    id: "bird-watching",
    title: "Bird Watching",
    description: "Patience, attention to detail, and knowledge of local species.",
    icon: "🐦",
    complete: false,
  },
  {
    id: "mountain-biking",
    title: "Mountain Biking",
    description: "Technical skills, balance, and trail awareness.",
    icon: "🚴",
    complete: true,
  },
  {
    id: "foraging2",
    title: "Foraging",
    description: "Knowledge of the environment, adaptability, and identifying plants and fungi.",
    icon: "🫐",
    complete: false,
  },
  {
    id: "foraging3",
    title: "Foraging",
    description: "Knowledge of the environment, adaptability, and identifying plants and fungi.",
    icon: "🫐",
    complete: false,
  },
  {
    id: "foraging4",
    title: "Foraging",
    description: "Knowledge of the environment, adaptability, and identifying plants and fungi.",
    icon: "🫐",
    complete: false,
  },
];

const CARD_WIDTH = 260 + 20; // card width + gap

export default function ChallengeBadgesSlider() {
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxScroll = Math.max(
    0,
    CHALLENGES.length * CARD_WIDTH - (trackRef.current?.clientWidth ?? 800) + 48
  );

  const canGoLeft = offset < 0;
  const canGoRight = offset > -maxScroll;

  const go = (delta: number) => {
    setOffset((o) => Math.max(-maxScroll, Math.min(0, o + delta)));
  };

  return (
    <Section>
      <Header>
        <TitleWrap>
          <Title>Challenge your friends and earn badges</Title>
        </TitleWrap>
        <NavArrowsWrap>
          <NavArrowBtn
            type="button"
            onClick={() => go(CARD_WIDTH * 2)}
            disabled={!canGoLeft}
            aria-label="Previous"
            $active={canGoLeft}
          >
            <ChevronLeft size={22} />
          </NavArrowBtn>
          <NavArrowBtn
            type="button"
            onClick={() => go(-CARD_WIDTH * 2)}
            disabled={!canGoRight}
            aria-label="Next"
            $active={canGoRight}
          >
            <ChevronRight size={22} />
          </NavArrowBtn>
        </NavArrowsWrap>
      </Header>
      <SliderWrap>
        <Track ref={trackRef}>
          <List $offset={offset}>
            {CHALLENGES.map((c) => (
              <ChallengeBadgeCard
                key={c.id}
                title={c.title}
                description={c.description}
                icon={c.icon}
                complete={c.complete}
              />
            ))}
          </List>
        </Track>
      </SliderWrap>
    </Section>
  );
}
