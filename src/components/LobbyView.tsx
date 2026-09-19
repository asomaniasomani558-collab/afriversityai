import React from "react";
import { NavigationTab } from "../types";
import { useAuth } from "../context/AuthContext";
import { logUserActivity } from "../services/activityService";

interface LobbyViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ setActiveTab }) => {
  const { openAuthModal, isAuthenticated, currentUser, userData } = useAuth();

  const handleNavigate = (tab: NavigationTab, actionName: string, targetTitle: string) => {
    const uid = currentUser?.uid || "guest";
    const name = currentUser?.displayName || userData?.displayName || "Scholar";
    logUserActivity({
      userId: uid,
      userName: name,
      action: actionName,
      actionType: "navigation",
      targetTitle,
      details: `Navigated to ${targetTitle} from Home Page`,
    }).catch(() => {});
    setActiveTab(tab);
  };

  return (
    <div id="lobby-view-container" className="flex flex-col w-full relative min-h-screen bg-[#0b0a08] overflow-x-hidden">
      {/* Container presenting the exact second image UI with fully interactive hotspots */}
      <div className="relative w-full max-w-[1536px] mx-auto overflow-hidden flex flex-col items-center">
        <img
          src="/home_page_hero.jpg"
          alt="Afriversty - Your next chapter could begin anywhere."
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain block select-none pointer-events-none"
        />

        {/* --- INTERACTIVE HOTSPOTS --- */}

        {/* 1. Top Nav: Home */}
        <button
          type="button"
          onClick={() => handleNavigate("lobby", "Clicked Nav Home", "Home")}
          className="absolute top-[3.2%] left-[32.5%] w-[4.5%]"
          style={{ height: "3%" }}
          aria-label="Home"
        />

        {/* 2. Top Nav: Explore */}
        <button
          type="button"
          onClick={() => handleNavigate("my-courses", "Clicked Nav Explore", "Explore Courses")}
          className="absolute top-[3.2%] left-[39.2%] w-[4.5%]"
          style={{ height: "3%" }}
          aria-label="Explore"
        />

        {/* 3. Top Nav: Opportunities */}
        <button
          type="button"
          onClick={() => handleNavigate("scholarships", "Clicked Nav Opportunities", "Opportunities")}
          className="absolute top-[3.2%] left-[46.5%] w-[7.5%]"
          style={{ height: "3%" }}
          aria-label="Opportunities"
        />

        {/* 4. Top Nav: My Path */}
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              handleNavigate("dashboard", "Clicked Nav My Path", "Scholar Dashboard");
            } else {
              openAuthModal("signin");
            }
          }}
          className="absolute top-[3.2%] left-[56.8%] w-[5%]"
          style={{ height: "3%" }}
          aria-label="My Path"
        />

        {/* 5. Top Right: Search Icon */}
        <button
          type="button"
          onClick={() => handleNavigate("ai-assistant", "Clicked Search", "AI Assistant Search")}
          className="absolute top-[2.8%] right-[8%] w-[3%] rounded-full"
          style={{ height: "4%" }}
          aria-label="Search"
        />

        {/* 6. Top Right: User Profile Avatar */}
        <button
          type="button"
          onClick={() => {
            if (isAuthenticated) {
              handleNavigate("profile", "Clicked Profile", "Scholar Profile");
            } else {
              openAuthModal("signin");
            }
          }}
          className="absolute top-[2.4%] right-[2.2%] w-[3.5%] rounded-full"
          style={{ height: "4.5%" }}
          aria-label="User Profile"
        />

        {/* 7. Main CTA Button 1: "Explore Africa" */}
        <button
          type="button"
          onClick={() => handleNavigate("my-courses", "Clicked Explore Africa", "Course Catalog")}
          className="absolute top-[62%] left-[6.5%] w-[15.5%] rounded-2xl cursor-pointer transition-all hover:bg-white/10 active:scale-95"
          style={{ height: "7.5%" }}
          aria-label="Explore Africa"
        />

        {/* 8. Main CTA Button 2: "Tell Afriversty what you want to become" */}
        <button
          type="button"
          onClick={() => handleNavigate("ai-assistant", "Clicked AI Goal Setter", "AI Career Assistant")}
          className="absolute top-[62%] left-[24.2%] w-[19.8%] rounded-2xl cursor-pointer transition-all hover:bg-white/10 active:scale-95"
          style={{ height: "7.5%" }}
          aria-label="Tell Afriversty what you want to become"
        />

        {/* 9. Bottom Stat 1: 200+ Universities */}
        <button
          type="button"
          onClick={() => handleNavigate("universities", "Clicked Universities Stat", "African Universities")}
          className="absolute top-[76.5%] left-[6.5%] w-[10.5%]"
          style={{ height: "7.5%" }}
          aria-label="200+ Universities"
        />

        {/* 10. Bottom Stat 2: 1,000+ Scholarships */}
        <button
          type="button"
          onClick={() => handleNavigate("scholarships", "Clicked Scholarships Stat", "Scholarships")}
          className="absolute top-[76.5%] left-[20.2%] w-[10.5%]"
          style={{ height: "7.5%" }}
          aria-label="1,000+ Scholarships"
        />

        {/* 11. Bottom Stat 3: 50+ Skills & Courses */}
        <button
          type="button"
          onClick={() => handleNavigate("my-courses", "Clicked Skills Stat", "Skills & Courses")}
          className="absolute top-[76.5%] left-[33.8%] w-[11%]"
          style={{ height: "7.5%" }}
          aria-label="50+ Skills & Courses"
        />

        {/* 12. Bottom Stat 4: 1M+ Students & Alumni */}
        <button
          type="button"
          onClick={() => handleNavigate("community", "Clicked Community Stat", "Students & Alumni")}
          className="absolute top-[76.5%] left-[47.2%] w-[11.5%]"
          style={{ height: "7.5%" }}
          aria-label="1M+ Students & Alumni"
        />
      </div>
    </div>
  );
};
