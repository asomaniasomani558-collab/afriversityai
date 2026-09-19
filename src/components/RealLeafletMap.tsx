import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { University } from "../types";
import {
  Compass,
  MapPin,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface RealLeafletMapProps {
  universities: University[];
  onSelectUniversity?: (uni: University) => void;
  onApplyUniversity?: (uni: University) => void;
  selectedUniversityId?: string | null;
  height?: string;
  isCompact?: boolean;
  onExpand?: () => void;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  universities,
  onSelectUniversity,
  onApplyUniversity,
  selectedUniversityId,
  height = "500px",
  isCompact = false,
  onExpand,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [mapStyle, setMapStyle] = useState<"dark" | "voyager" | "satellite">("dark");
  const [activeUniInView, setActiveUniInView] = useState<University | null>(null);

  // Region centers and zoom levels for Africa
  const regions: { [key: string]: { center: [number, number]; zoom: number; label: string } } = {
    All: { center: [3.5, 20.0], zoom: isCompact ? 2 : 3, label: "All Africa" },
    "North Africa": { center: [28.0, 20.0], zoom: 4, label: "North" },
    "West Africa": { center: [9.0, 0.0], zoom: 4.5, label: "West" },
    "East Africa": { center: [2.0, 36.0], zoom: 4.5, label: "East" },
    "Southern Africa": { center: [-25.0, 26.0], zoom: 4.5, label: "Southern" },
    "Central Africa": { center: [0.0, 18.0], zoom: 4.5, label: "Central" },
  };

  // Tile layer providers
  const tileProviders = {
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a>',
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a>',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri &mdash; Earthstar Geographics",
    },
  };

  // Custom Gold SVG Pin Creator
  const createCustomPin = (uni: University, isSelected: boolean) => {
    const isTopTier = uni.rankBadge?.includes("#1") || uni.rankBadge?.includes("Premier");
    const pinColor = isSelected ? "#ffe088" : isTopTier ? "#f2ca50" : "#d4af37";
    const bgBadge = isSelected ? "#1c1917" : "#141210";

    const customHtml = `
      <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110">
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_16px_rgba(242,202,80,0.5)] border-2 ${
            isSelected ? "border-white bg-[#f2ca50] text-[#1c1917]" : "border-[#f2ca50]/80 bg-[#181614] text-[#f2ca50]"
          }">
            <span style="font-family: 'Playfair Display', serif; font-weight: 800; font-size: 10px; line-height: 1;">
              ${uni.shortName.slice(0, 3)}
            </span>
          </div>
          ${
            isTopTier
              ? `<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#f2ca50] border border-[#1c1917] flex items-center justify-center animate-ping"></span>`
              : ""
          }
        </div>
        ${
          !isCompact
            ? `<div class="mt-1 bg-black/80 backdrop-blur-sm border border-[#f2ca50]/40 text-[#f5f5f4] text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md pointer-events-none">
                ${uni.shortName}
              </div>`
            : ""
        }
      </div>
    `;

    return L.divIcon({
      html: customHtml,
      className: "custom-leaflet-marker",
      iconSize: [40, 48],
      iconAnchor: [20, 24],
      popupAnchor: [0, -26],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialView = regions[activeRegion] || regions.All;
      const map = L.map(mapContainerRef.current, {
        center: initialView.center,
        zoom: initialView.zoom,
        zoomControl: !isCompact,
        attributionControl: !isCompact,
        scrollWheelZoom: !isCompact,
      });

      // Add base tile layer
      const provider = tileProviders[mapStyle];
      const layer = L.tileLayer(provider.url, {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: provider.attribution,
      }).addTo(map);

      tileLayerRef.current = layer;
      mapInstanceRef.current = map;

      // Handle map clicks outside markers
      map.on("click", () => {
        if (!isCompact) {
          setActiveUniInView(null);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const provider = tileProviders[mapStyle];
    tileLayerRef.current = L.tileLayer(provider.url, {
      maxZoom: 19,
      subdomains: "abcd",
      attribution: provider.attribution,
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Render & Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Filter universities with coordinates
    universities.forEach((uni) => {
      if (!uni.coordinates) return;

      const isSelected = selectedUniversityId === uni.id;
      const marker = L.marker([uni.coordinates.lat, uni.coordinates.lng], {
        icon: createCustomPin(uni, isSelected),
        title: uni.fullName,
      }).addTo(map);

      // Popup Content matching African Night aesthetic
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; background: #161412; color: #f5f5f4; border: 1px solid rgba(242,202,80,0.4); border-radius: 16px; padding: 12px; min-width: 220px; max-width: 280px; box-shadow: 0 16px 40px rgba(0,0,0,0.85);">
          <div style="position: relative; height: 90px; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
            <img src="${uni.imageUrl}" alt="${uni.fullName}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(22,20,18,0.9), transparent);"></div>
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); color: #f2ca50; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(242,202,80,0.3);">
              ${uni.region}
            </span>
          </div>
          <h4 style="font-family: 'Playfair Display', serif; font-weight: bold; font-size: 14px; line-height: 1.2; color: #f5f5f4; margin: 0 0 4px 0;">
            ${uni.fullName}
          </h4>
          <p style="font-size: 11px; color: #d0c5af; margin: 0 0 8px 0;">
            📍 ${uni.location}, ${uni.country} &bull; Est. ${uni.established}
          </p>
          <div style="display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap;">
            ${uni.focusAreas.slice(0, 3).map(area => `
              <span style="background: #252019; color: #f2ca50; font-size: 9px; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(242,202,80,0.2);">
                ${area}
              </span>
            `).join("")}
          </div>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button id="btn-popup-profile-${uni.id}" style="flex: 1; background: #2a241b; color: #ded8cb; border: 1px solid #3c352f; border-radius: 8px; padding: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
              Profile
            </button>
            <button id="btn-popup-apply-${uni.id}" style="flex: 1; background: #f2ca50; color: #1c1917; border: none; border-radius: 8px; padding: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
              Apply
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: "afriversty-custom-popup",
        closeButton: true,
      });

      marker.on("click", () => {
        setActiveUniInView(uni);
        if (onSelectUniversity) {
          // Add timeout to bind popup button handlers after DOM mount
          setTimeout(() => {
            const profileBtn = document.getElementById(`btn-popup-profile-${uni.id}`);
            const applyBtn = document.getElementById(`btn-popup-apply-${uni.id}`);
            if (profileBtn) {
              profileBtn.onclick = () => onSelectUniversity(uni);
            }
            if (applyBtn && onApplyUniversity) {
              applyBtn.onclick = () => onApplyUniversity(uni);
            }
          }, 50);
        }
      });

      markersRef.current[uni.id] = marker;
    });
  }, [universities, selectedUniversityId, isCompact]);

  // Handle selectedUniversityId zoom focus
  useEffect(() => {
    if (!selectedUniversityId || !mapInstanceRef.current) return;
    const targetUni = universities.find((u) => u.id === selectedUniversityId);
    if (targetUni && targetUni.coordinates) {
      mapInstanceRef.current.flyTo(
        [targetUni.coordinates.lat, targetUni.coordinates.lng],
        7,
        { duration: 1.5 }
      );
      const targetMarker = markersRef.current[targetUni.id];
      if (targetMarker) {
        targetMarker.openPopup();
      }
      setActiveUniInView(targetUni);
    }
  }, [selectedUniversityId]);

  // Fly to Region
  const handleFlyToRegion = (regionKey: string) => {
    setActiveRegion(regionKey);
    const target = regions[regionKey];
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#3c352f] bg-[#0c0a09] shadow-2xl flex flex-col ${
        isCompact ? "h-full min-h-[360px]" : ""
      }`}
      style={{ height: isCompact ? "100%" : height }}
    >
      {/* 1. Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Compact View Overlay Header / Controls */}
      {isCompact ? (
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/90 to-transparent pointer-events-none z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f2ca50]">
                Live Real-World Geospatial Map
              </span>
            </div>
            <span className="text-[11px] text-[#99907c] bg-[#1c1917]/80 px-2.5 py-0.5 rounded-md border border-[#3c352f]">
              {universities.filter((u) => u.coordinates).length} Universities
            </span>
          </div>

          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white">
            Explore by Location
          </h3>
          <p className="text-xs text-[#d0c5af] font-sans-body line-clamp-1">
            Real satellite & street-level geospatial navigation across 54 African nations.
          </p>

          <div className="pt-2 pointer-events-auto">
            <button
              onClick={onExpand}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] font-bold text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Maximize2 size={14} />
              <span>Open Full Interactive Map</span>
            </button>
          </div>
        </div>
      ) : (
        /* Full Map Controls */
        <>
          {/* Top Bar Floating Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Left: Region Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#141210]/90 backdrop-blur-md border border-[#f2ca50]/30 rounded-2xl shadow-xl pointer-events-auto overflow-x-auto max-w-full">
              {Object.keys(regions).map((regKey) => {
                const isActive = activeRegion === regKey;
                return (
                  <button
                    key={regKey}
                    onClick={() => handleFlyToRegion(regKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#f2ca50] text-[#1c1917] shadow-md"
                        : "bg-transparent text-[#d0c5af] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {regions[regKey].label}
                  </button>
                );
              })}
            </div>

            {/* Right: Map Style Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-[#141210]/90 backdrop-blur-md border border-[#3c352f] rounded-2xl shadow-xl pointer-events-auto">
              <button
                onClick={() => setMapStyle("dark")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  mapStyle === "dark"
                    ? "bg-[#f2ca50] text-[#1c1917]"
                    : "text-[#99907c] hover:text-white"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setMapStyle("voyager")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  mapStyle === "voyager"
                    ? "bg-[#f2ca50] text-[#1c1917]"
                    : "text-[#99907c] hover:text-white"
                }`}
              >
                Street
              </button>
              <button
                onClick={() => setMapStyle("satellite")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  mapStyle === "satellite"
                    ? "bg-[#f2ca50] text-[#1c1917]"
                    : "text-[#99907c] hover:text-white"
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Active University Floating Card (Bottom-Left) */}
          {activeUniInView && (
            <div className="absolute bottom-4 left-4 z-10 max-w-sm w-full bg-[#181614]/95 backdrop-blur-md border border-[#f2ca50]/50 rounded-2xl p-4 shadow-2xl animate-fadeIn pointer-events-auto">
              <div className="flex items-start gap-3">
                <img
                  src={activeUniInView.imageUrl}
                  alt={activeUniInView.fullName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#f2ca50]/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-[#f2ca50] text-[#1c1917] px-2 py-0.5 rounded-full">
                      {activeUniInView.region}
                    </span>
                    {activeUniInView.rankBadge && (
                      <span className="text-[10px] text-[#ded8cb] font-semibold truncate">
                        {activeUniInView.rankBadge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif-title font-bold text-sm text-white mt-1 truncate">
                    {activeUniInView.fullName}
                  </h4>
                  <p className="text-[11px] text-[#99907c] truncate">
                    {activeUniInView.location}, {activeUniInView.country}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#292524]">
                <button
                  onClick={() => onSelectUniversity?.(activeUniInView)}
                  className="py-1.5 px-3 rounded-xl bg-[#252019] text-[#ded8cb] hover:text-white text-xs font-bold border border-[#3c352f] transition-all text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onApplyUniversity?.(activeUniInView)}
                  className="py-1.5 px-3 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] text-xs font-bold shadow-md transition-all text-center"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
