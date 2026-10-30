import type { Metadata } from "next";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { POLICY_UPDATED_AT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Regras de uso do Nota Segura - BR, limites de responsabilidade e lei aplicável.",
};

export default function TermosPage() {
  return (
    <TrustPage title="Termos de Uso" updatedAt={POLICY_UPDATED_AT}>
      <TrustSection>
        <p>
          Estes termos regem o uso do site Nota Segura - BR, operado pelo Nota Segura - BR. Ao criar ou abrir uma nota,
          você concorda com estes termos. Se não concordar, não use o serviço.
        </p>
      </TrustSection>

      <TrustSection title="Uso permitido">
        <p>
          O serviço serve para compartilhar textos de forma privada e temporária. Você é responsável pelo conteúdo que
          envia e por com quem compartilha o link.
        </p>
        <p>
          É proibido usar o site para enviar conteúdo ilegal, distribuir malware ou links maliciosos, aplicar golpes ou
          phishing, assediar ou ameaçar pessoas, violar direitos de terceiros, ou sobrecarregar e atacar o serviço.
          Podemos bloquear pedidos e remover notas quando houver indício de abuso.
        </p>
      </TrustSection>

      <TrustSection title="Conteúdo das notas">
        <p>
          Não lemos o conteúdo das notas. Uma nota protegida por frase secreta não pode ser decifrada sem essa frase, e
          a frase não é armazenada em texto claro. Não conseguimos recuperar uma frase esquecida nem uma nota que já
          expirou, atingiu o limite de visualizações ou foi apagada.
        </p>
      </TrustSection>

      <TrustSection title="Disponibilidade e garantias">
        <p>
          O serviço é oferecido gratuitamente, no estado em que se encontra, sem garantia de funcionamento contínuo ou
          livre de erros. O site pode ficar indisponível para manutenção, por falhas técnicas ou por motivos fora do
          nosso controle, e uma nota pode deixar de estar disponível antes do prazo.
        </p>
        <p>
          Na medida permitida pela lei, o Nota Segura - BR não se responsabiliza por perdas decorrentes do uso ou da
          impossibilidade de uso do serviço, nem pelo conteúdo enviado pelos usuários.
        </p>
      </TrustSection>

      <TrustSection title="Privacidade">
        <p>
          O tratamento de dados está descrito na <TextLink href="/privacidade">Política de Privacidade</TextLink>, que
          faz parte destes termos.
        </p>
      </TrustSection>

      <TrustSection title="Lei aplicável e alterações">
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil. Podemos alterar estes termos quando o
          serviço mudar, e a data da última atualização aparece no topo desta página. Dúvidas podem ser enviadas pela
          página de <TextLink href="/contato">Contato</TextLink>.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
