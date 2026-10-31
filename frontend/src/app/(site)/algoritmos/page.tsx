import type { Metadata } from "next";
import SafetyBadge from "@/components/SafetyBadge";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import { IconFileText, IconGlobe, IconKey, IconLock } from "@/components/icons";
import { algorithmHref } from "@/lib/algorithms";
import { algorithmsByCategory } from "@/lib/playground/categories";

export const metadata: Metadata = {
  title: "Algoritmos de criptografia",
  description:
    "Como funcionam AES, ChaCha20, RSA, SHA-256, HMAC, ECDSA, ECDH, PBKDF2, Base64 e cifras clássicas, e quais protegem um segredo.",
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
          Outros algoritmos não escondem o texto, mas resolvem problemas vizinhos. Um código de autenticação, como o
          HMAC, prova que a mensagem veio de quem tem a chave secreta e que não mudou. Uma assinatura digital, como o
          ECDSA ou o Ed25519, faz o mesmo com duas chaves: só a chave privada assina, e qualquer pessoa confere com a
          chave pública. A troca de chaves, como o ECDH, permite que duas pessoas combinem uma chave secreta pela
          internet sem enviá-la. E a derivação de chave, como o PBKDF2, transforma uma senha em uma chave forte.
        </p>
        <p>
          As cifras clássicas, como a de César e a de Vigenère, foram a criptografia de outras épocas. O ROT13 e a cifra
          Atbash nem usam chave: qualquer pessoa desfaz. Nas outras, a matemática e os computadores de hoje descobrem a
          chave com facilidade. A exceção é a cifra de Vernam: com uma chave aleatória, do tamanho do texto e usada uma
          única vez, ela não pode ser quebrada. As demais servem para aprender, não para proteger.
        </p>
        <p>
          O Nota Segura - BR protege cada nota com o AES-256-GCM, um padrão moderno que também protege o HTTPS. Abaixo,
          cada algoritmo tem uma página com o funcionamento, um exemplo, os usos e os cuidados, e você pode testá-lo no
          próprio navegador.
        </p>
      </TrustSection>

      <TrustSection title="Os algoritmos" icon={IconKey}>
        {algorithmsByCategory().map((category) => (
          <section key={category.name} className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-ink sm:text-lg">{category.name}</h3>
            <ul aria-label={category.name} className="grid gap-4">
              {category.algorithms.map((algorithm) => (
                <li key={algorithm.id} className="rounded-lg border border-hairline-strong bg-canvas p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-ink">{algorithm.name}</h4>
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
          </section>
        ))}
      </TrustSection>
    </TrustPage>
  );
}
