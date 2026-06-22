export default function AppIcon({
  glyph,
  bg,
  className = "h-8 w-8 text-base",
}: {
  glyph: string;
  bg?: string;
  className?: string;
}) {
  // Renders a small rounded badge with a colored bg + the glyph.
  // We avoid emoji rendering issues by treating the glyph as text.
  return (
    <div
      className={`grid place-items-center rounded-lg font-bold text-white shadow-soft ${className}`}
      style={{ backgroundColor: bg ?? "#2a2f3d" }}
      aria-hidden
    >
      <span className="leading-none">{glyph}</span>
    </div>
  );
}