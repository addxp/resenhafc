"use client";

/**
 * Logo do Resenha FC — brasão oficial (public/logo.png).
 * A arte já é um círculo fechado com fundo, então aqui só recortamos
 * em círculo e aplicamos uma sombra leve, sem moldura extra por cima.
 */
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="relative rounded-full overflow-hidden shadow-md shrink-0"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Resenha FC"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const fallback = (e.target as HTMLImageElement)
            .nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="absolute inset-0 hidden items-center justify-center bg-sand-100 text-sand-700 font-black text-2xl"
        style={{ display: "none" }}
      >
        RFC
      </div>
    </div>
  );
}
