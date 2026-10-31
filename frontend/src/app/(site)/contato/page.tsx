import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import { IconAlert, IconFileText, IconHeart, IconLock, IconMail, IconShield } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";
import { getContactEmail } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contato",
  description: "Como falar com o Nota Segura - BR para denunciar abuso ou fazer pedidos de privacidade.",
  path: "/contato",
});

const HIGHLIGHTS: TrustHighlight[] = [
  { icon: IconAlert, title: "Denúncias de abuso", text: "Inclua o link da nota e uma descrição do problema." },
  { icon: IconShield, title: "Pedidos de privacidade", text: "Exerça os seus direitos pela LGPD." },
  { icon: IconHeart, title: "Falhas e sugestões", text: "Conte o que falhou no site ou como melhorar o serviço." },
];

export default function ContatoPage() {
  const email = getContactEmail();

  return (
    <TrustPage
      title="Contato"
      lead="Fale com a gente sobre abuso, privacidade ou falhas."
      icon={IconMail}
      highlights={HIGHLIGHTS}
    >
      {email ? (
        <section className="flex flex-col gap-4 rounded-lg border border-hairline-strong bg-canvas p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-100 text-primary">
              <IconMail className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p>
                Para falar com o Nota Segura - BR, envie um e-mail para{" "}
                <TextLink href={`mailto:${email}`}>{email}</TextLink>.
              </p>
              <p className="text-sm text-muted">Respondemos em até 5 dias úteis.</p>
            </div>
          </div>
          <a
            href={`mailto:${email}`}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xs bg-primary p-4 text-sm font-bold text-on-primary hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
          >
            <IconMail className="h-5 w-5" />
            Enviar e-mail
          </a>
        </section>
      ) : (
        <TrustSection>
          <p>O endereço de e-mail de contato ainda não está disponível. Tente novamente mais tarde.</p>
          <p>Respondemos em até 5 dias úteis.</p>
        </TrustSection>
      )}

      <TrustSection title="O que você pode nos enviar" icon={IconFileText}>
        <p>
          Denúncias de abuso, como notas usadas para golpes, phishing, malware ou conteúdo ilegal. Inclua o link da nota
          e uma descrição do problema. Não envie o conteúdo de notas de terceiros.
        </p>
        <p>
          Pedidos e dúvidas de privacidade, incluindo o exercício dos seus direitos pela LGPD, descritos na{" "}
          <TextLink href="/privacidade">Política de Privacidade</TextLink>.
        </p>
        <p>Relatos de falhas no site e sugestões para melhorar o serviço.</p>
      </TrustSection>

      <TrustSection title="O que não conseguimos fazer" icon={IconLock} tone="mint">
        <p>
          Não conseguimos ler nem recuperar notas protegidas por frase secreta, recuperar frases esquecidas, nem
          restaurar notas que já expiraram ou atingiram o limite de visualizações.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
