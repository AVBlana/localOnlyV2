/**
 * Search params from the SearchBar.
 * Used for primary/coarse filtering; FilterBar handles refinement (price, time of day, etc.).
 */

/** Single date or range. For range, `to` is optional while selecting. */
export type SearchDate = Date | { from: Date; to?: Date } | null;

export interface SearchParams {
  location: string;
  date: SearchDate;
  experience: string;
}

export type SearchResult = SearchParams;

export const DEFAULT_SEARCH_PARAMS: SearchParams = {
  location: "",
  date: null,
  experience: "",
};
