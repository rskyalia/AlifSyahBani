import AboutBio from "@/components/AboutBio";
import AboutPhoto from "@/components/AboutPhoto";
import SpotifyCard from "@/components/SpotifyCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen px-4 sm:px-8 py-24 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <AboutBio />
            <AboutPhoto />
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 md:mt-28">
          <SectionHeader
            label="Music"
            title="My Favorite Songs"
            description="A few tracks I keep on repeat while coding and designing."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <SpotifyCard embedId="spotify:track:0otRX6Z89qKkHkQ9OqJpKt" />
            <SpotifyCard embedId="spotify:track:04S1pkp1VaIqjg8zZqknR5" />
            <SpotifyCard embedId="spotify:track:4aT6vP9y2eDjxmRGm5ZqSC" />
            <SpotifyCard embedId="spotify:track:4s76r7AbquJcTccqJiqdVu" />
            <SpotifyCard embedId="spotify:track:4RAOI1etsgbh5NP3T5R8rN" />
            <SpotifyCard embedId="spotify:track:1daDRI9ahBonbWD8YcxOIB" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
