"use client";

import React, { useState, useMemo } from "react";
import { useAgoraStore } from "@/store/useAgoraStore";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import ProgressTracker from "@/components/stats/ProgressTracker";
import SubjectProgressTable from "@/components/stats/SubjectProgressTable";

// Portfolio sub-components
import ProfileHero from "@/components/profile/ProfileHero";
import StatsGrid from "@/components/profile/StatsGrid";
import LevelProgress from "@/components/profile/LevelProgress";
import LearningJourney from "@/components/profile/LearningJourney";
import SubjectMastery from "@/components/profile/SubjectMastery";
import AchievementsGallery from "@/components/profile/AchievementsGallery";
import StudyHeatmap from "@/components/profile/StudyHeatmap";
import RecentActivity from "@/components/profile/RecentActivity";
import WeeklyAnalytics from "@/components/profile/WeeklyAnalytics";
import GoalsCard from "@/components/profile/GoalsCard";
import Collections from "@/components/profile/Collections";
import FriendsPreview from "@/components/profile/FriendsPreview";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const { user } = useAgoraStore();
  const { flashcards, progress } = useFlashcardStore();
  
  // Custom Profile states matching user info
  const [university, setUniversity] = useState("Université d'Alger 1 (Faculté de Médecine)");
  const [year, setYear] = useState("4ème Année - Externe");
  const [bio, setBio] = useState("Passionné par la cardiologie clinique et l'apprentissage par répétition espacée.");
  const [specialty, setSpecialty] = useState("Cardiologie");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "achievements" | "activity" | "collections">("overview");

  // Dynamically calculate flashcard statistics
  const flashcardStats = useMemo(() => {
    const total = flashcards.filter(c => c.status === "approved").length;
    
    // Cards considered mastered if reviewed at least once and interval >= 4
    const mastered = Object.values(progress).filter(p => p.interval >= 4).length;
    
    // Cards due today
    const now = new Date();
    const due = flashcards.filter(c => {
      if (c.status !== "approved") return false;
      const prog = progress[c.id];
      if (!prog) return true; // new card is due
      return new Date(prog.nextReviewAt) <= now;
    }).length;

    return { total, mastered, due };
  }, [flashcards, progress]);

  // Handle saving the modified user profile details
  const handleSaveProfile = (data: { university: string; year: string; specialty: string; bio: string }) => {
    setUniversity(data.university);
    setYear(data.year);
    setSpecialty(data.specialty);
    setBio(data.bio);
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "progress", label: "Cursus & Cibles" },
    { id: "achievements", label: "Médailles & Badges" },
    { id: "activity", label: "Activité" },
    { id: "collections", label: "Collections" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-8 font-sans overflow-hidden">
      {/* 1. Redesigned Premium Profile Hero Banner */}
      <ProfileHero
        user={user}
        university={university}
        year={year}
        bio={bio}
        specialty={specialty}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex border-b border-teal/10 overflow-x-auto pb-px scrollbar-none gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-teal text-teal font-extrabold"
                : "border-transparent text-text-light hover:text-text-dark"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Dynamic Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Metrics Dashboard */}
          <StatsGrid
            streak={user?.streak || 12}
            xp={user?.points || 840}
            lessonsCompleted={8}
            flashcardsMastered={flashcardStats.mastered}
            quizzesCompleted={412}
            achievementsCount={3}
            studyHours={42}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Yearly Activity Heatmap */}
              <StudyHeatmap />

              {/* Recent Activities Timeline */}
              <RecentActivity />
            </div>

            <div className="space-y-8">
              {/* Level progression bar */}
              <LevelProgress xp={user?.points || 840} />

              {/* Current active targets */}
              <GoalsCard />

              {/* Peer Classroom Preview */}
              <FriendsPreview />
            </div>
          </div>
        </div>
      )}

      {activeTab === "progress" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-bold text-text-dark font-display">Maîtrise par matières</h3>
            <SubjectMastery />
            
            <h3 className="text-base font-bold text-text-dark font-display pt-4">Progression détaillée</h3>
            <SubjectProgressTable />
          </div>

          <div className="space-y-6">
            <LearningJourney />
            <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm">
              <h4 className="text-xs font-bold text-text-dark">Résumé de l'Apprentissage</h4>
              <div className="mt-4">
                <ProgressTracker
                  lessonsRead={8}
                  totalLessons={24}
                  modulesRead={15}
                  totalModules={40}
                  qcmsAnswered={412}
                  qcmPrecision={84}
                  flashcardsMastered={flashcardStats.mastered}
                  totalFlashcards={flashcardStats.total}
                  flashcardsDueToday={flashcardStats.due}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-text-dark font-display">Galerie des Trophées</h3>
            <p className="text-xs text-text-light">Vos accomplissements débloqués et en cours d'acquisition</p>
          </div>
          <AchievementsGallery />
        </div>
      )}

      {activeTab === "activity" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
          <RecentActivity />
          <WeeklyAnalytics />
        </div>
      )}

      {activeTab === "collections" && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-text-dark font-display">Ma Bibliothèque</h3>
            <p className="text-xs text-text-light">Vos ressources cliniques, signets, et documents sauvegardés</p>
          </div>
          <Collections />
        </div>
      )}

      {/* Edit Profile Premium Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        university={university}
        year={year}
        specialty={specialty}
        bio={bio}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
