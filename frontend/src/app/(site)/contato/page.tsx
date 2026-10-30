import type { Metadata } from "next";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { getContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Como falar com o Nota Segura - BR para denunciar abuso ou fazer pedidos de privacidade.",
};

export default function ContatoPage() {
  const email = getContactEmail();

  return (
    <TrustPage title="Contato">
      <TrustSection>
        {email ? (
          <p>
            Para falar com o Nota Segura - BR, envie um e-mail para <TextLink href={`mailto:${email}`}>{email}</TextLink>.
          </p>
        ) : (
          <p>O endereço de e-mail de contato ainda não está disponível. Tente novamente mais tarde.</p>
        )}
        <p>Respondemos em até 5 dias úteis.</p>
      </TrustSection>

      <TrustSection title="O que você pode nos enviar">
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

      <TrustSection title="O que não conseguimos fazer">
        <p>
          Não conseguimos ler nem recuperar notas protegidas por frase secreta, recuperar frases esquecidas, nem
          restaurar notas que já expiraram ou atingiram o limite de visualizações.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
