"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  ExperienceFilters,
  DEFAULT_FILTERS,
  ACTIVITY_TYPES,
  TIME_OF_DAYS,
  DURATIONS,
  SPECIALS,
} from "@/types/filters";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 8px;
  transition: background 0.2s ease;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const CloseIcon = styled.span`
  position: relative;
  width: 24px;
  height: 24px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 2px;
    background: currentColor;
    top: 50%;
    left: 50%;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const CheckboxLabel = styled.span`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const RadioLabel = styled.span`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const RangeSliderContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem 0;
`;

const RangeSliderWrapper = styled.div`
  position: relative;
  height: 6px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 3px;
`;

const RangeSliderTrack = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 3px;
`;

const RangeSliderInput = styled.input<{ $isMin: boolean }>`
  position: absolute;
  width: 100%;
  height: 20px;
  background: none;
  pointer-events: ${({ $isMin }) => ($isMin ? "auto" : "none")};
  -webkit-appearance: none;
  appearance: none;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: ${({ $isMin }) => ($isMin ? 2 : 1)};

  &::-webkit-slider-runnable-track {
    height: 6px;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    pointer-events: all;
    border: 2px solid ${({ theme }) => theme.colors.background};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    margin-top: -7px;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-track {
    height: 6px;
    background: transparent;
    border: none;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    pointer-events: all;
    border: 2px solid ${({ theme }) => theme.colors.background};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33;
  }

  &:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent}33;
  }
`;

const RangeSliderInputMax = styled(RangeSliderInput)`
  pointer-events: auto;
  z-index: 2;
`;

const DualRangeContainer = styled.div`
  position: relative;
  height: 20px;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  gap: 1rem;
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ShowResultsButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExperienceFilters;
  onFiltersChange: (filters: ExperienceFilters) => void;
  resultCount: number;
  averagePrice: number;
  maxPrice?: number;
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
  averagePrice,
  maxPrice = 1000,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<ExperienceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleActivityTypeChange = useCallback(
    (activityType: string, checked: boolean) => {
      setLocalFilters((prev) => {
        const newTypes = checked
          ? [...prev.activityTypes, activityType as typeof ACTIVITY_TYPES[number]]
          : prev.activityTypes.filter((t) => t !== activityType);
        return { ...prev, activityTypes: newTypes };
      });
    },
    [],
  );

  const handleTimeOfDayChange = useCallback(
    (timeOfDay: string, checked: boolean) => {
      setLocalFilters((prev) => {
        const newTimes = checked
          ? [...prev.timeOfDays, timeOfDay as typeof TIME_OF_DAYS[number]]
          : prev.timeOfDays.filter((t) => t !== timeOfDay);
        return { ...prev, timeOfDays: newTimes };
      });
    },
    [],
  );

  const handleDurationChange = useCallback((duration: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      duration: duration as typeof DURATIONS[number] | null,
    }));
  }, []);

  const handleSpecialChange = useCallback(
    (special: string, checked: boolean) => {
      setLocalFilters((prev) => {
        const newSpecials = checked
          ? [...prev.specials, special as typeof SPECIALS[number]]
          : prev.specials.filter((s) => s !== special);
        return { ...prev, specials: newSpecials };
      });
    },
    [],
  );

  const handlePriceMinChange = useCallback(
    (value: string) => {
      const numValue = Math.max(0, Number(value) || 0);
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: [Math.min(numValue, prev.priceRange[1]), prev.priceRange[1]],
      }));
    },
    [],
  );

  const handlePriceMaxChange = useCallback(
    (value: string) => {
      const numValue = Math.max(
        localFilters.priceRange[0],
        Math.min(maxPrice, Number(value) || localFilters.priceRange[0])
      );
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], numValue],
      }));
    },
    [localFilters.priceRange, maxPrice],
  );

  const handleMinSliderChange = useCallback(
    (value: number) => {
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: [Math.min(value, prev.priceRange[1]), prev.priceRange[1]],
      }));
    },
    [],
  );

  const handleMaxSliderChange = useCallback(
    (value: number) => {
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], Math.max(value, prev.priceRange[0])],
      }));
    },
    [],
  );

  const handleClearAll = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS);
  }, []);

  const handleShowResults = useCallback(() => {
    onFiltersChange(localFilters);
    onClose();
  }, [localFilters, onFiltersChange, onClose]);

  const rangePercentages = useMemo(() => {
    const maxRange = maxPrice;
    const left = (localFilters.priceRange[0] / maxRange) * 100;
    const width = ((localFilters.priceRange[1] - localFilters.priceRange[0]) / maxRange) * 100;
    return { left, width };
  }, [localFilters.priceRange, maxPrice]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Filters</Title>
          <CloseButton onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </CloseButton>
        </Header>

        <Content>
          {/* Activity Type */}
          <Section>
            <SectionTitle>Activity type</SectionTitle>
            <CheckboxGroup>
              {ACTIVITY_TYPES.map((type) => (
                <CheckboxContainer key={type}>
                  <CheckboxInput
                    type="checkbox"
                    checked={localFilters.activityTypes.includes(type)}
                    onChange={(e) => handleActivityTypeChange(type, e.target.checked)}
                  />
                  <CheckboxLabel>{type}</CheckboxLabel>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Section>

          {/* Price Range */}
          <Section>
            <SectionTitle>Price range</SectionTitle>
            <SectionSubtitle>
              The average price of an experience is ${averagePrice.toFixed(2)}
            </SectionSubtitle>
            <RangeSliderContainer>
              <RangeSliderWrapper>
                <RangeSliderTrack
                  $left={rangePercentages.left}
                  $width={rangePercentages.width}
                />
              </RangeSliderWrapper>
              <DualRangeContainer>
                <RangeSliderInput
                  $isMin={true}
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handleMinSliderChange(Number(e.target.value))}
                />
                <RangeSliderInputMax
                  $isMin={false}
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handleMaxSliderChange(Number(e.target.value))}
                />
              </DualRangeContainer>
            </RangeSliderContainer>
            <PriceInputs>
              <PriceInput
                type="number"
                min={0}
                max={localFilters.priceRange[1]}
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceMinChange(e.target.value)}
                placeholder="Min"
              />
              <PriceInput
                type="number"
                min={localFilters.priceRange[0]}
                max={maxPrice}
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                placeholder="Max"
              />
            </PriceInputs>
          </Section>

          {/* Time of Day */}
          <Section>
            <SectionTitle>Time of Day</SectionTitle>
            <CheckboxGroup>
              {TIME_OF_DAYS.map((time) => (
                <CheckboxContainer key={time}>
                  <CheckboxInput
                    type="checkbox"
                    checked={localFilters.timeOfDays.includes(time)}
                    onChange={(e) => handleTimeOfDayChange(time, e.target.checked)}
                  />
                  <CheckboxLabel>{time}</CheckboxLabel>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Section>

          {/* Duration */}
          <Section>
            <SectionTitle>Duration</SectionTitle>
            <RadioGroup>
              {DURATIONS.map((duration) => (
                <RadioContainer key={duration}>
                  <RadioInput
                    type="radio"
                    name="duration"
                    checked={localFilters.duration === duration}
                    onChange={() => handleDurationChange(duration)}
                  />
                  <RadioLabel>{duration}</RadioLabel>
                </RadioContainer>
              ))}
            </RadioGroup>
          </Section>

          {/* Specials */}
          <Section>
            <SectionTitle>Specials</SectionTitle>
            <CheckboxGroup>
              {SPECIALS.map((special) => (
                <CheckboxContainer key={special}>
                  <CheckboxInput
                    type="checkbox"
                    checked={localFilters.specials.includes(special)}
                    onChange={(e) => handleSpecialChange(special, e.target.checked)}
                  />
                  <CheckboxLabel>{special}</CheckboxLabel>
                </CheckboxContainer>
              ))}
            </CheckboxGroup>
          </Section>
        </Content>

        <Footer>
          <ClearButton onClick={handleClearAll}>Clear all</ClearButton>
          <ShowResultsButton onClick={handleShowResults}>
            Show all {resultCount} results
          </ShowResultsButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
}
