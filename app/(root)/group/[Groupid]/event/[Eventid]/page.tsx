"use client";
import { ChevronRight, FolderClosed, MessageCircleMore, Share2, ThumbsUp, Edit } from "lucide-react";
import { MOCK_EVENTS, CURRENT_USER } from "../../../../../../data/event-detail";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import PriceContentCOmponent from "../../../../../../components/site/event-detail/price-content";
import MapContentComponent from "../../../../../../components/site/event-detail/map-content";
import DetailContentComponent from "../../../../../../components/site/event-detail/detail-content";
import { AdminOverview } from "../../../../../../components/site/event-detail/register-table";
import {DiscussionSection} from "../../../../../../components/site/event-detail/discussion-section";
type Tab = "details" | "price" | "map";
type AdminSubTab = "overview" | "discussion";

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>("overview");
  const event = MOCK_EVENTS[0];
  const isAdminOrOrganizer = CURRENT_USER.role === "Student" || CURRENT_USER.role === "Admin";

  return (
    <section className="w-full flex flex-col gap-y-4 bg-background">
      <section className="flex items-center gap-3 border-b border-border pb-2">
        <div className="bg-primary p-2 rounded-md text-primary-foreground"><FolderClosed /></div>
        <div>
          <span className="type-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded">Internal</span>
          <h1 className="type-subtitle text-primary">14th Generation Group</h1>
        </div>
      </section>

      <section className="flex gap-x-1 items-center text-grey-400 type-detail">
        <Link href="/group/1">Events</Link>
        <ChevronRight size={14} />
        <span className="text-action type-detail-semibold">Sport Reunion Events</span>
      </section>

      <section className="border border-border rounded-lg p-6 flex flex-col gap-y-6 bg-card">
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${event.creator.avatarUrl})` }} />
            <div>
              <p className="type-desc-semibold text-secondary">{event.creator.name}</p>
              <p className="type-detail-small-medium text-muted-foreground">01/05/2026 20:25</p>
            </div>
          </div>
          
          <div className="flex items-center gap-x-2">
            <span className="bg-primary/10 px-3 py-1 rounded text-primary type-desc-small-semibold">
              Admin
            </span>
            {isAdminOrOrganizer && (
              <button className="flex items-center gap-x-1 border border-border rounded-md px-3 py-1 text-grey-900 type-desc-small-semibold hover:bg-grey-50">
                <Edit size={12} /> Edit Event
              </button>
            )}
          </div>
        </section>

        <h2 className="type-title text-grey-900">Calling for HRD Alumni !</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image unoptimized src={event.bannerUrl} alt="Banner" width={600} height={350} className="rounded-xl w-full object-cover" />
          
          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-3 bg-grey-100 p-1 text-center rounded-xl type-desc-small-semibold">
              {(["details", "price", "map"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} className={`py-2 rounded-md capitalize ${activeTab === t ? "bg-primary text-primary-foreground" : "text-primary"}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-grow py-4">
              {activeTab === "details" && <DetailContentComponent />}
              {activeTab === "price" && <PriceContentCOmponent />}
              {activeTab === "map" && <MapContentComponent />}
            </div>

            {!isAdminOrOrganizer && (
              <button className="w-full rounded-md py-2.5 type-desc-semibold text-center text-primary-foreground bg-primary hover:opacity-95 transition-opacity">
                Register now
              </button>
            )}
          </div>
        </section>
        <section className="flex gap-x-6 py-2 border-b border-border text-grey-400 type-detail">
          <span className="flex items-center gap-x-1"><ThumbsUp size={16} /> 124</span>
          <span className="flex items-center gap-x-1"><MessageCircleMore size={16} /> 18</span>
          <span className="flex items-center gap-x-1"><Share2 size={16} /> Share</span>
        </section>
        {isAdminOrOrganizer ? (
        
          <div className="space-y-6">
            <section className="flex gap-x-6 border-b border-border type-desc-semibold">
              <button 
                onClick={() => setActiveAdminTab("overview")} 
                className={`pb-2 capitalize ${activeAdminTab === "overview" ? "text-primary border-b-2 border-primary" : "text-grey-400"}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveAdminTab("discussion")} 
                className={`pb-2 capitalize ${activeAdminTab === "discussion" ? "text-primary border-b-2 border-primary" : "text-grey-400"}`}
              >
                Discussion
              </button>
            </section>
            
            {activeAdminTab === "overview" ? <AdminOverview /> : <DiscussionSection event={event} />}
          </div>
        ) : (
          <div className="space-y-4">
            <DiscussionSection event={event} />
          </div>
        )}
      </section>
    </section>
  );
}