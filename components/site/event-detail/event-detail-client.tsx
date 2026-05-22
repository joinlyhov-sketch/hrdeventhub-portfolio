"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, ThumbsUp, MessageCircleMore, Share2 } from "lucide-react";
import PriceContentComponent from "../../../components/site/event-detail/price-content";
import MapContentComponent from "../../../components/site/event-detail//map-content";
import DetailContentComponent from "../../../components/site/event-detail//detail-content";
import { AdminOverview } from "../../../components/site/event-detail//register-table";
import { DiscussionSection } from "../../../components/site/event-detail//discussion-section";

type Tab = "details" | "price" | "map";
type AdminSubTab = "overview" | "discussion";

interface EventDetailClientProps {
  event: any;
  isAdminOrOrganizer: boolean;
}

export default function EventDetailClient({ event, isAdminOrOrganizer }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>("overview");

  return (
    <section className="border border-border rounded-lg p-6 flex flex-col gap-y-6 bg-card">
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${event.creator.avatarUrl})` }} 
          />
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
        <Image 
          unoptimized 
          src={event.bannerUrl} 
          alt="Banner" 
          width={600} 
          height={350} 
          className="rounded-xl w-full object-cover" 
        />
        
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-3 bg-grey-100 p-1 text-center rounded-xl type-desc-small-semibold">
            {(["details", "price", "map"] as Tab[]).map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)} 
                className={`py-2 rounded-md capitalize ${activeTab === t ? "bg-primary text-primary-foreground" : "text-primary"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grow py-4">
            {activeTab === "details" && <DetailContentComponent />}
            {activeTab === "price" && <PriceContentComponent />}
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
  );
}