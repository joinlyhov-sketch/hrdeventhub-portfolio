"use client";

import { create } from "zustand";

type DeleteModalStore = {
  isOpen: boolean;

  title: string;
  description: string;

  onConfirm?: () => void;

  openModal: ({
    title,
    description,
    onConfirm,
  }: {
    title: string;
    description: string;
    onConfirm: () => void;
  }) => void;

  closeModal: () => void;
};

export const useDeleteModalStore = create<DeleteModalStore>((set) => ({
  isOpen: false,

  title: "",
  description: "",

  onConfirm: undefined,

  openModal: ({ title, description, onConfirm }) =>
    set({
      isOpen: true,
      title,
      description,
      onConfirm,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      onConfirm: undefined,
    }),
}));
