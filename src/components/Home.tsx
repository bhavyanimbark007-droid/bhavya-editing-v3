"use client";

/**
 * Exact composition of the Vite project's src/App.tsx.
 * All section components are copied UNCHANGED from the Vite project
 * (see README §"Copying components") — they read from "@/lib/content".
 */
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Stats from "./Stats";
import Skills from "./Skills";
import WhyMe from "./WhyMe";
import Services from "./Services";
import Work from "./Work";
import Testimonials from "./Testimonials";
import FinalCTA from "./FinalCTA";
import Contact from "./Contact";
import Footer from "./Footer";
import VideoModal, { type VideoItem } from "./VideoModal";

export default function Home() {
  const [video, setVideo] = useState<VideoItem | null>(null);

  // legacy deep-link: site.com/#cms → /admin
  useEffect(() => {
    if (window.location.hash === "#cms") {
      window.location.replace("/admin");
    }
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white antialiased">
      <Navbar />
      <main>
        <Hero onPlay={setVideo} />
        <Marquee />
        <Stats />
        <Skills />
        <WhyMe />
        <Services />
        <Work onPlay={setVideo} />
        <Testimonials />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <VideoModal video={video} onClose={() => setVideo(null)} />
    </div>
  );
}
