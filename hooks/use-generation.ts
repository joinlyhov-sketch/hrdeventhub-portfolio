"use client";
import useSWR from "swr";
import { generationService } from "@/service/generation.service";

export function useGenerations() {
  const { data, error, isLoading, mutate } = useSWR(
    ["generations"],
    () => generationService.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return {
    generations: data ?? [],
    error,
    isLoading,
    mutate,
  };
}