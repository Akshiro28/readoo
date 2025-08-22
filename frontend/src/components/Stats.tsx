"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CircleCheck, Heart, Bookmark } from "lucide-react";

export default function Stats({
  readThisYearCount,
  favoriteCount,
  wishlistCount,
}: {
    readThisYearCount: number;
    favoriteCount: number;
    wishlistCount: number;
  }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Stats summary */}
      <div className="flex flex-col flex-row justify-center gap-2 xs:gap-4 mb-4 text-sm">
        <div className="flex-1 p-2 xs:p-4 rounded-xl bg-[rgba(0,166,62,0.1)] text-center">
          <p className="font-medium">Read</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {readThisYearCount}
          </p>
        </div>
        <div className="flex-1 p-2 xs:p-4 rounded-xl bg-[rgba(251,44,54,0.1)] text-center">
          <p className="font-medium">Favorited</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {favoriteCount}
          </p>
        </div>
        <div className="flex-1 p-2 xs:p-4 rounded-xl bg-[rgba(43,127,255,0.1)] text-center">
          <p className="font-medium">Wishlisted</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {wishlistCount}
          </p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="mx-auto flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-[var(--foreground-07)] transition cursor-pointer"
      >
        Challenges {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <Challenge
            icon={<CircleCheck className="text-green-500" size={24} />}
            label="Read books this year"
            count={readThisYearCount}
            goal={12}
            color="0,166,62"
          />
          <Challenge
            icon={<CircleCheck className="text-green-500" size={24} />}
            label="Read books this year"
            count={readThisYearCount}
            goal={24}
            color="0,166,62"
          />
          <Challenge
            icon={<Heart className="text-red-500" size={24} />}
            label="Favorite books"
            count={favoriteCount}
            goal={5}
            color="251,44,54"
          />
          <Challenge
            icon={<Heart className="text-red-500" size={24} />}
            label="Favorite books"
            count={favoriteCount}
            goal={10}
            color="251,44,54"
          />
          <Challenge
            icon={<Bookmark className="text-blue-500" size={24} />}
            label="Wishlisted books"
            count={wishlistCount}
            goal={5}
            color="43,127,255"
          />
          <Challenge
            icon={<Bookmark className="text-blue-500" size={24} />}
            label="Wishlisted books"
            count={wishlistCount}
            goal={10}
            color="43,127,255"
          />
        </div>
      )}
    </div>
  );
}

function Challenge({
  icon,
  label,
  count,
  goal,
  color,
}: {
    icon: React.ReactNode;
    label: string;
    count: number;
    goal: number;
    color: string;
  }) {
  const progress = Math.min((count / goal) * 100, 100);

  return (
    <div className="flex flex-col rounded-lg" style={{backgroundColor: `rgba(${color}, 0.1)`}}>
      <div className="flex items-center gap-2 p-4">
        {icon}
        <div className="w-full ms-1">
          <p className="text-sm font-medium mb-2">
            {label}: {count}/{goal}
          </p>

          <div className="w-full h-2 rounded-full overflow-hidden" style={{backgroundColor: `rgba(${color}, 0.15)`}}>
            <div
              className="h-full bg-[var(--foreground)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
