import Image from "next/image";

/**
 * Logo do Resenha FC.
 *
 * Para usar sua logo de verdade: coloque o arquivo em `public/logo.png`
 * (de preferência PNG com fundo transparente, quadrado, ~512x512px).
 * Assim que o arquivo existir nessa pasta, ele aparece automaticamente aqui.
 * Até lá, mostra um escudo placeholder para o layout não quebrar.
 */
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-sand-100 border-4 border-sand-300 shadow-md overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Resenha FC"
        width={size}
        height={size}
        className="object-contain w-full h-full"
        onError={(e) => {
          // Se logo.png não existir ainda, esconde a imagem quebrada e mostra o placeholder
          (e.target as HTMLImageElement).style.display = "none";
          const fallback = (e.target as HTMLImageElement)
            .nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="absolute inset-0 hidden items-center justify-center text-sand-700 font-black text-2xl"
        style={{ display: "none" }}
      >
        RFC
      </div>
    </div>
  );
}
