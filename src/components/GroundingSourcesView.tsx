import React from "react";
import {
  Globe,
  MapPin,
  ExternalLink,
  Search,
  BookOpen,
  Navigation,
  Sparkles,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { GroundingChunk } from "../types";

interface GroundingSourcesViewProps {
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
  model?: string;
}

export const GroundingSourcesView: React.FC<GroundingSourcesViewProps> = ({
  groundingChunks = [],
  webSearchQueries = [],
  model,
}) => {
  if (
    (!groundingChunks || groundingChunks.length === 0) &&
    (!webSearchQueries || webSearchQueries.length === 0)
  ) {
    return null;
  }

  const webChunks = groundingChunks.filter((chunk) => chunk.web && chunk.web.uri);
  const mapsChunks = groundingChunks.filter((chunk) => chunk.maps && chunk.maps.uri);

  return (
    <div className="mt-3.5 pt-3 border-t border-[#3d3425]/60 space-y-2.5">
      {/* Search Queries Section */}
      {webSearchQueries.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-[#a89e8b] flex items-center gap-1 uppercase tracking-wider">
            <Search size={11} className="text-[#f2ca50]" /> Grounded Queries:
          </span>
          {webSearchQueries.map((query, qIdx) => (
            <span
              key={qIdx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#231d14] border border-[#d4af37]/30 text-[#ded8cb]"
            >
              <Sparkles size={10} className="text-[#f2ca50]" />
              {query}
            </span>
          ))}
        </div>
      )}

      {/* Google Search Web Citations */}
      {webChunks.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#f2ca50] uppercase tracking-wider flex items-center gap-1.5">
            <Globe size={12} className="text-[#f2ca50]" />
            <span>Google Search Web Sources ({webChunks.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {webChunks.map((chunk, idx) => {
              const uri = chunk.web?.uri || "#";
              const title = chunk.web?.title || uri;
              let hostname = "";
              try {
                hostname = new URL(uri).hostname.replace("www.", "");
              } catch {
                hostname = "web-source";
              }

              return (
                <a
                  key={idx}
                  href={uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 p-2.5 rounded-xl bg-[#1c1710] hover:bg-[#282115] border border-[#443825] hover:border-[#d4af37]/60 transition-all text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#2b2316] group-hover:bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5 transition-colors">
                    <Globe size={12} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#ded8cb] group-hover:text-[#f2ca50] truncate transition-colors">
                      {title}
                    </p>
                    <p className="text-[10px] text-[#99907c] truncate flex items-center gap-1 mt-0.5">
                      <span>{hostname}</span>
                      <ExternalLink size={10} className="inline opacity-60 group-hover:opacity-100" />
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Google Maps Location Pins & Campus Landmarks */}
      {mapsChunks.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#f2ca50] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={12} className="text-amber-400" />
            <span>Google Maps Grounded Locations ({mapsChunks.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mapsChunks.map((chunk, idx) => {
              const uri = chunk.maps?.uri || "#";
              const title = chunk.maps?.title || "Academic Campus / Lab Location";
              const reviews = chunk.maps?.placeAnswerSources?.reviewSnippets || [];

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1a150e] border border-[#d4af37]/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Navigation size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#e5e2e1] truncate">{title}</p>
                        <p className="text-[10px] text-[#a89e8b]">Verified Google Maps Entity</p>
                      </div>
                    </div>

                    <a
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#2c2214] hover:bg-[#d4af37] text-[#ded8cb] hover:text-[#12100d] text-[11px] font-bold border border-[#d4af37]/40 flex items-center gap-1 shrink-0 transition-all"
                    >
                      <MapPin size={11} /> Open Map
                    </a>
                  </div>

                  {reviews.length > 0 && (
                    <div className="p-2 rounded-lg bg-[#221b12] border border-[#3d3220] text-[11px] text-[#c9c2b3] italic leading-snug">
                      "{reviews[0]}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
