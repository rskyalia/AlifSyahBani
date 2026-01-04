import AboutBio from "@/components/AboutBio";
import AboutPhoto from "@/components/AboutPhoto";
import SpotifyCard from "@/components/SpotifyCard";
import Navbar from "@/components/Navbar";
export default function AboutPage() {
  return (
    <section className="min-h-screen px-8 py-24">
      <Navbar />
      {/* TOP SECTION */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <AboutBio />
          <AboutPhoto />
        </div>
      </div>

      {/* MUSIC SECTION */}
      <div className="mt-24">
        <h2 className="text-2xl font-semibold text-white mb-8">
          My favorite songs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpotifyCard embedId="spotify:track:0otRX6Z89qKkHkQ9OqJpKt" />
          <SpotifyCard embedId="spotify:track:04S1pkp1VaIqjg8zZqknR5" />
          <SpotifyCard embedId="spotify:track:4aT6vP9y2eDjxmRGm5ZqSC" />
          <SpotifyCard embedId="spotify:track:4s76r7AbquJcTccqJiqdVu" />
          <SpotifyCard embedId="spotify:track:4RAOI1etsgbh5NP3T5R8rN" />
          <SpotifyCard embedId="spotify:track:1daDRI9ahBonbWD8YcxOIB" />
        </div>
      </div>
    </section>
  );
}


