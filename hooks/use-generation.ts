"use client";
import useSWR from "swr";
import { generationService } from "@/service/generation.service";

export function useGenerations() {
  const { data, error, isLoading, mutate } = useSWR(
    ["generations"],
    () => generationService.getAll()
  );

  return {
    generations: data ?? [],
    error,
    isLoading,
    mutate,
  };
}