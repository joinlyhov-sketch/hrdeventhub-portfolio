import React from "react";
import {
  Type,
  TextAlignStart,
  CircleDot,
  SquareCheck,
  ChevronDown,
  Star,
  ToggleRight,
  LayoutGrid,
  BarChart4,
} from "lucide-react";
import SidebarItemButton from "../SidebarItemButton";
import { QuestionType } from "./SurveyCreationForm";

interface QuestionTypeSidebarProps {
  onAddQuestion: (type: QuestionType) => void;
}

export default function QuestionTypeSidebar({
  onAddQuestion,
}: QuestionTypeSidebarProps) {
  const categories = [
    {
      title: "Basic",
      items: [
        {
          label: "Short Text",
          type: "short-text" as const,
          icon: <Type size={24} />,
        },
        {
          label: "Long Text",
          type: "long-text" as const,
          icon: <TextAlignStart size={24} />,
        },
      ],
    },
    {
      title: "Choice",
      items: [
        {
          label: "Single Choice",
          type: "choice" as const,
          icon: <CircleDot size={24} />,
        },
        {
          label: "Multiple Choice",
          type: "choice" as const,
          icon: <SquareCheck size={24} />,
        },
        {
          label: "Dropdown",
          type: "dropdown" as const,
          icon: <ChevronDown size={24} />,
        },
      ],
    },
    {
      title: "Advanced",
      items: [
        { label: "Rating", type: "rating" as const, icon: <Star size={24} /> },
        {
          label: "Yes/No Toggle",
          type: "yes-no" as const,
          icon: <ToggleRight size={24} />,
        },
        {
          label: "Matrix",
          type: "matrix" as const,
          icon: <LayoutGrid size={24} />,
        },
        {
          label: "Linear Scale",
          type: "linear" as const,
          icon: <BarChart4 size={24} />,
        },
      ],
    },
  ];

  return (
    <aside className="bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-4 sm:p-6 space-y-6 order-2 h-auto">
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-gray-500 tracking-wider mb-4 uppercase">
          Question Types
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 sm:gap-4 lg:space-y-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-gray-100 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none"
            >
              <span className="text-[10px] font-bold text-gray-500 block mb-2 tracking-widest uppercase">
                {category.title}
              </span>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <SidebarItemButton
                    key={`${item.label}-${index}`}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => onAddQuestion(item.type)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
