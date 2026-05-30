"use client";

import { StatCard } from "../../../types/transaction";
import { StatsCard } from "./StatsCard";

interface StatsCardsSectionProps {
  stats: StatCard[];
}

export function StatsCardsSection({ stats }: StatsCardsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        key={1}
        title="Pending Payment"
        value="42"
        color="text-action"
        bgColor={"bg-action/10"}
        customIcon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66797 8.33594H18.3346"
              stroke="#FF9F2E"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.62292 17.0802H5.36459C2.40626 17.0802 1.65625 16.3469 1.65625 13.4219V6.57188C1.65625 3.92188 2.27294 3.07188 4.59794 2.93855C4.83127 2.93021 5.08959 2.92188 5.36459 2.92188H14.6229C17.5812 2.92188 18.3313 3.65521 18.3313 6.58021V10.2552"
              stroke="#FF9F2E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 13.3359H8.33333"
              stroke="#FF9F2E"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.3346 14.9974C18.3346 15.6224 18.1596 16.2141 17.8513 16.7141C17.2763 17.6807 16.218 18.3307 15.0013 18.3307C13.7846 18.3307 12.7263 17.6807 12.1513 16.7141C11.843 16.2141 11.668 15.6224 11.668 14.9974C11.668 13.1557 13.1596 11.6641 15.0013 11.6641C16.843 11.6641 18.3346 13.1557 18.3346 14.9974Z"
              stroke="#FF9F2E"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.7031 14.9964L14.5281 15.8214L16.3031 14.1797"
              stroke="#FF9F2E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <StatsCard
        key={2}
        title={"Total Donations"}
        value={"124,50"}
        customIcon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_55189_84441)">
              <path
                d="M10 0.835938V19.1693M14.1667 4.16927H7.91667C7.14312 4.16927 6.40125 4.47656 5.85427 5.02354C5.30729 5.57052 5 6.31239 5 7.08594C5 7.85949 5.30729 8.60135 5.85427 9.14833C6.40125 9.69531 7.14312 10.0026 7.91667 10.0026H12.0833C12.8569 10.0026 13.5987 10.3099 14.1457 10.8569C14.6927 11.4039 15 12.1457 15 12.9193C15 13.6928 14.6927 14.4347 14.1457 14.9817C13.5987 15.5286 12.8569 15.8359 12.0833 15.8359H5"
                stroke="#1C4D8D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_55189_84441">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        color={"text-primary"}
        bgColor={"bg-primary/10"}
      />
      <StatsCard
        key={3}
        title={"Total Attendee"}
        value={"24,512"}
        customIcon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.9987 9.9974C12.2999 9.9974 14.1654 8.13192 14.1654 5.83073C14.1654 3.52954 12.2999 1.66406 9.9987 1.66406C7.69751 1.66406 5.83203 3.52954 5.83203 5.83073C5.83203 8.13192 7.69751 9.9974 9.9987 9.9974Z"
              stroke="#EA1D24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.1565 18.3333C17.1565 15.1083 13.9482 12.5 9.99817 12.5C6.04817 12.5 2.83984 15.1083 2.83984 18.3333"
              stroke="#EA1D24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        color={"text-red-500"}
        bgColor={"bg-red-500/10"}
      />
      <StatsCard
        key={4}
        title={"Active Events"}
        value={"850"}
        customIcon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66797 1.66406V4.16406"
              stroke="#3BC1A8"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.332 1.66406V4.16406"
              stroke="#3BC1A8"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.91797 7.57812H17.0846"
              stroke="#3BC1A8"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.5 7.08073V14.1641C17.5 16.6641 16.25 18.3307 13.3333 18.3307H6.66667C3.75 18.3307 2.5 16.6641 2.5 14.1641V7.08073C2.5 4.58073 3.75 2.91406 6.66667 2.91406H13.3333C16.25 2.91406 17.5 4.58073 17.5 7.08073Z"
              stroke="#3BC1A8"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.0801 11.4167H13.0875"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.0801 13.9167H13.0875"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.99803 11.4167H10.0055"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.99803 13.9167H10.0055"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.91209 11.4167H6.91957"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.91209 13.9167H6.91957"
              stroke="#3BC1A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        color={"text-teal-500"}
        bgColor={"bg-teal-500/10"}
      />
    </div>
  );
}
