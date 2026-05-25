import { FeatureCard } from "../components/landing/FeatureCard";
import { ListCard } from "../components/landing/ListCard";
import PlatFormEssential from "../components/landing/PlatFormEssential";
import { MediaItem } from "../components/landing/types";

const featuredData: MediaItem = {
  id: "feat-1",
  title: "Sport Reunion 2026: Celebrating 14th Generation",
  category: "GATHERING",
  imageUrl: "/images/sport.png",
};

const listData: MediaItem[] = Array(3).fill({
  id: "list-1",
  title: "Gen 13 Graduate Secure Global Roles ",
  description:
    "Congratulations to our latest graduates! 95% employment rate within 2 months of completing the software engineering.",
  category: "SUCCESS STORY",
  imageUrl: "/images/songkran.png",
});

export default function Page() {
  return (
    <main className="min-h-screen bg-background pr-12 pl-12">
      <div className="mb-6">
            <h1 className="type-h1 text-secondary`">
             Community <span className="text-action">Updates</span>
            </h1>
            <p className="type-desc text-secondary mt-2 ">
              Stay connected with the latest events, success story, and learning resources from the KSHRD family.
            </p>
          </div>
      <div className=" mx-auto">
        <div className="grid grid-cols-12 gap-8 items-stretch">
          <div className="col-span-7">
            <FeatureCard item={featuredData} />
          </div>
          <div className="col-span-5 flex flex-col justify-between gap-4">
            {listData.map((mediaItem, index) => (
              <ListCard key={`${mediaItem.id}-${index}`} item={mediaItem} />
            ))}
          </div>
        </div>
      </div>
      <PlatFormEssential />
    </main>
  );
}
