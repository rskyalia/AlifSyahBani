export default function SpaceBackground() {
  return (
    <div className="space-bg" aria-hidden>
      {/* Deep space base */}
      <div className="space-bg__base" />

      {/* Nebula clouds */}
      <div className="space-bg__nebula space-bg__nebula--1" />
      <div className="space-bg__nebula space-bg__nebula--2" />
      <div className="space-bg__nebula space-bg__nebula--3" />

      {/* Aurora ribbons */}
      <div className="space-bg__aurora space-bg__aurora--1" />
      <div className="space-bg__aurora space-bg__aurora--2" />
      <div className="space-bg__aurora space-bg__aurora--3" />
      <div className="space-bg__aurora space-bg__aurora--4" />

      {/* Star layers */}
      <div className="space-bg__stars space-bg__stars--far" />
      <div className="space-bg__stars space-bg__stars--mid" />
      <div className="space-bg__stars space-bg__stars--near" />

      {/* Vignette — keeps edges dark */}
      <div className="space-bg__vignette" />
    </div>
  );
}
