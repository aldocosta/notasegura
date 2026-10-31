import JsonLd from "@/components/JsonLd";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import { IconFileText, IconKey, IconScale, IconShield, type IconComponent } from "@/components/icons";
import { GUIDES, GUIDES_PATH, guideHref } from "@/lib/guides";
import type { GuideKind } from "@/lib/guides/types";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const TITLE = "Guias de criptografia e segurança";

export const metadata = pageMetadata({
  title: TITLE,
  description:
    "Comparações entre algoritmos de criptografia e guias práticos para enviar e guardar senhas e mensagens com segurança.",
  path: GUIDES_PATH,
});

const HIGHLIGHTS: TrustHighlight[] = [
  { icon: IconScale, title: "Comparações", text: "Algoritmos lado a lado, com uma tabela e uma recomendação." },
  { icon: IconShield, title: "Guias práticos", text: "O que fazer para proteger uma senha ou uma mensagem." },
  {
    icon: IconKey,
    title: "Teste no navegador",
    text: "Cada guia leva aos algoritmos que você pode testar no playground.",
  },
];

const GROUPS: Array<{ kind: GuideKind; title: string; icon: IconComponent }> = [
  { kind: "Comparação", title: "Comparações", icon: IconScale },
  { kind: "Guia prático", title: "Guias práticos", icon: IconShield },
];

export default function GuiasPage() {
  return (
    <TrustPage
      title={TITLE}
      lead="Comparações entre algoritmos e passo a passo para proteger senhas e mensagens no dia a dia."
      icon={IconScale}
      highlights={HIGHLIGHTS}
    >
      <TrustSection title="Como usar estes guias" icon={IconFileText}>
        <p>
          Os guias respondem a dois tipos de pergunta. As comparações colocam dois ou mais algoritmos lado a lado, com
          uma tabela que resume as diferenças e uma recomendação clara: qual usar, e em que situação. Os guias práticos
          explicam o que fazer em tarefas do dia a dia, como enviar uma senha para outra pessoa ou guardar as senhas dos
          usuários de um sistema.
        </p>
        <p>
          Cada guia cita os algoritmos que usa e leva às páginas deles. Nessas páginas, você encontra o funcionamento
          de cada algoritmo em detalhe, um exemplo, os usos e os cuidados, e pode testar o algoritmo no próprio
          navegador. Os textos são curtos e explicam cada termo técnico na primeira vez que ele aparece.
        </p>
        <p>
          Os guias também mostram quando uma nota autodestrutiva ajuda, e quais são os limites dela. O Nota Segura - BR
          protege cada nota com o AES-256-GCM, o mesmo padrão de criptografia que protege boa parte do HTTPS.
        </p>
      </TrustSection>

      {GROUPS.map((group) => (
        <TrustSection key={group.kind} title={group.title} icon={group.icon}>
          <ul aria-label={group.title} className="grid gap-4">
            {GUIDES.filter((guide) => guide.kind === group.kind).map((guide) => (
              <li key={guide.slug} className="rounded-lg border border-hairline-strong bg-canvas p-4">
                <h3 className="text-base font-bold text-ink">
                  <TextLink href={guideHref(guide.slug)}>{guide.title}</TextLink>
                </h3>
                <p className="mt-2 text-sm text-body">{guide.description}</p>
              </li>
            ))}
          </ul>
        </TrustSection>
      ))}

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Guias", path: GUIDES_PATH },
        ])}
      />
    </TrustPage>
  );
}
