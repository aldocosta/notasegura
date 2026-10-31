import type { Metadata } from "next";
import SafetyBadge from "@/components/SafetyBadge";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import { IconFileText, IconGlobe, IconKey, IconLock } from "@/components/icons";
import { algorithmHref } from "@/lib/algorithms";
import { ALGORITHMS } from "@/lib/playground";

export const metadata: Metadata = {
  title: "Algoritmos de criptografia",
  description:
    "Como funcionam AES, RSA, SHA-256, Base64 e as cifras de César e Vigenère, e quais deles protegem um segredo de verdade.",
};

const HIGHLIGHTS: TrustHighlight[] = [
  {
    icon: IconLock,
    title: "Criptografia",
    text: "Protege o texto com uma chave. Só quem tem a chave certa consegue ler.",
  },
  { icon: IconFileText, title: "Hash", text: "Gera uma impressão digital do texto. Não existe caminho de volta." },
  { icon: IconGlobe, title: "Codificação", text: "Só muda o formato do texto. Qualquer pessoa consegue desfazer." },
];

export default function AlgoritmosPage() {
  return (
    <TrustPage
      title="Algoritmos de criptografia"
      lead="Entenda como funcionam os algoritmos que você pode testar no Nota Segura - BR, e quais deles protegem um segredo de verdade."
      icon={IconLock}
      highlights={HIGHLIGHTS}
    >
      <TrustSection title="Criptografia, hash e codificação" icon={IconFileText}>
        <p>
          Muita coisa parece embaralhada sem estar protegida. Para saber se um segredo está seguro, é preciso separar
          três ideias: criptografia, hash e codificação. As três transformam um texto, mas só a criptografia esconde o
          conteúdo de quem não tem a chave.
        </p>
        <p>
          A criptografia usa uma chave para transformar o texto em algo ilegível, e a chave certa faz o caminho de
          volta. Na criptografia simétrica, como o AES, a mesma chave cifra e decifra. Na criptografia assimétrica,
          como o RSA, existem duas chaves: a chave pública cifra e só a chave privada decifra. Um hash, como o SHA-256,
          não tem chave nem caminho de volta: ele gera uma impressão digital que confirma se um texto mudou. Uma
          codificação, como o Base64, só muda o formato dos dados para transportá-los, e qualquer pessoa desfaz.
        </p>
        <p>
          As cifras clássicas, como a de César e a de Vigenère, foram a criptografia de outras épocas. Elas usam uma
          chave, mas a matemática e os computadores de hoje descobrem essa chave em segundos. Servem para aprender, não
          para proteger.
        </p>
        <p>
          O Nota Segura - BR protege cada nota com o AES-256-GCM, um padrão moderno que também protege o HTTPS. Abaixo,
          cada algoritmo tem uma página com o funcionamento, um exemplo, os usos e os cuidados, e você pode testá-lo no
          próprio navegador.
        </p>
      </TrustSection>

      <TrustSection title="Os algoritmos" icon={IconKey}>
        <ul aria-label="Lista de algoritmos" className="grid gap-4">
          {ALGORITHMS.map((algorithm) => (
            <li key={algorithm.id} className="rounded-lg border border-hairline-strong bg-canvas p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-ink">{algorithm.name}</h3>
                <SafetyBadge safety={algorithm.safety} />
              </div>
              <p className="mt-1 text-xs font-bold text-muted">{algorithm.kind}</p>
              {algorithm.summary.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-sm text-body">
                  {paragraph}
                </p>
              ))}
              <p className="mt-3 text-sm">
                <TextLink href={algorithmHref(algorithm.id)}>Ler sobre {algorithm.name}</TextLink>
              </p>
            </li>
          ))}
        </ul>
      </TrustSection>
    </TrustPage>
  );
}
