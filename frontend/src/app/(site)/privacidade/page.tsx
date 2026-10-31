import type { Metadata } from "next";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustPart, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import {
  IconAlert,
  IconCookie,
  IconEyeOff,
  IconKey,
  IconLock,
  IconScale,
  IconShield,
  IconUserOff,
} from "@/components/icons";
import { POLICY_UPDATED_AT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade e Termos de Uso",
  description:
    "Quais dados o Nota Segura - BR guarda, como funcionam os cookies de publicidade e as regras de uso do serviço.",
};

const HIGHLIGHTS: TrustHighlight[] = [
  {
    icon: IconKey,
    title: "Nada em texto claro",
    text: "Não guardamos o texto original, e a frase secreta nunca é armazenada em texto claro.",
  },
  {
    icon: IconCookie,
    title: "Sem cookies próprios",
    text: "O Nota Segura - BR não cria cookies próprios.",
  },
  {
    icon: IconShield,
    title: "Uso permitido",
    text: "É proibido enviar conteúdo ilegal, distribuir malware ou aplicar golpes.",
  },
];

export default function PrivacidadeETermosPage() {
  return (
    <TrustPage
      title="Política de Privacidade e Termos de Uso"
      lead="Como tratamos os seus dados e as regras para usar o serviço."
      icon={IconShield}
      updatedAt={POLICY_UPDATED_AT}
      highlights={HIGHLIGHTS}
    >
      <TrustSection>
        <p>
          Esta página reúne a Política de Privacidade e os Termos de Uso do Nota Segura - BR. O site é operado pelo Nota
          Segura - BR, que é o controlador dos dados descritos aqui. Ao criar ou abrir uma nota, você concorda com estas
          regras. Se não concordar, não use o serviço.
        </p>
        <p>
          Vá direto para a <TextLink href="#privacidade">Política de Privacidade</TextLink> ou para os{" "}
          <TextLink href="#termos">Termos de Uso</TextLink>.
        </p>
      </TrustSection>

      <TrustPart id="privacidade" title="Política de Privacidade" icon={IconShield}>
        <TrustSection title="Sem conta e sem cadastro" icon={IconUserOff} level={3}>
          <p>
            O site não exige conta, cadastro, nome nem e-mail. Não sabemos quem cria nem quem lê as notas, e não
            associamos as notas a nenhuma pessoa.
          </p>
        </TrustSection>

        <TrustSection title="O que guardamos sobre cada nota" icon={IconLock} tone="mint" level={3}>
          <p>
            Quando você cria uma nota, o texto é enviado ao nosso servidor e criptografado antes de ser armazenado. Não
            guardamos o texto original. Guardamos apenas a nota criptografada e os dados técnicos necessários para
            decifrá-la com a chave correta, a data de expiração, o número de visualizações já feitas e o número máximo
            de visualizações permitido.
          </p>
          <p>
            Se você definir uma frase secreta, ela faz parte da chave de criptografia e nunca é armazenada em texto
            claro. Por isso não conseguimos ler uma nota protegida por frase secreta, nem recuperar a frase se ela for
            esquecida. Se você não definir uma frase secreta, a nota é criptografada com uma chave padrão mantida no
            servidor.
          </p>
          <p>
            Quando a nota atinge o limite de visualizações, ela deixa de poder ser aberta. A nota criptografada é
            apagada automaticamente do banco de dados na data de expiração escolhida, que é de no máximo 30 dias após a
            criação.
          </p>
        </TrustSection>

        <TrustSection title="Registros técnicos" icon={IconEyeOff} level={3}>
          <p>
            Também guardamos registros técnicos de funcionamento: o método e a rota de cada pedido, o código de
            resposta, o tempo de resposta e, em caso de falha, a mensagem de erro. Esses registros não incluem o
            endereço IP nem o texto das notas, e são apagados automaticamente após 90 dias.
          </p>
        </TrustSection>

        <TrustSection title="Cookies e publicidade" icon={IconCookie} level={3}>
          <p>
            O Nota Segura - BR não cria cookies próprios. Para manter o serviço gratuito, as páginas de conteúdo podem
            exibir anúncios do Google AdSense. A página que exibe uma nota não carrega anúncios.
          </p>
          <p>
            Fornecedores terceiros, incluindo o Google, usam cookies para exibir anúncios com base nas visitas
            anteriores do usuário a este site ou a outros sites. Com os cookies de publicidade, o Google e os seus
            parceiros podem exibir anúncios para você com base nas suas visitas a este site e a outros sites na
            internet.
          </p>
          <p>
            Você pode desativar a publicidade personalizada nas{" "}
            <TextLink href="https://adssettings.google.com/">Configurações de anúncios do Google</TextLink>. Também
            pode desativar os cookies de publicidade personalizada de outros fornecedores em{" "}
            <TextLink href="https://www.aboutads.info/">www.aboutads.info</TextLink>.
          </p>
        </TrustSection>

        <TrustSection title="Seus direitos pela LGPD" icon={IconScale} level={3}>
          <p>
            A Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018) garante a você o direito de confirmar
            se tratamos dados seus, acessar esses dados, corrigi-los, pedir a anonimização, o bloqueio ou a eliminação,
            pedir a portabilidade, saber com quem os compartilhamos e revogar o consentimento. Você também pode
            reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
          <p>
            Como o site não tem contas, só conseguimos localizar uma nota a partir do link dela. Para exercer os seus
            direitos ou tirar dúvidas sobre esta política, fale conosco pela página de{" "}
            <TextLink href="/contato">Contato</TextLink>.
          </p>
        </TrustSection>
      </TrustPart>

      <TrustPart id="termos" title="Termos de Uso" icon={IconScale}>
        <TrustSection title="Uso permitido" icon={IconShield} level={3}>
          <p>
            O serviço serve para compartilhar textos de forma privada e temporária. Você é responsável pelo conteúdo
            que envia e por com quem compartilha o link.
          </p>
          <p>
            É proibido usar o site para enviar conteúdo ilegal, distribuir malware ou links maliciosos, aplicar golpes
            ou phishing, assediar ou ameaçar pessoas, violar direitos de terceiros, ou sobrecarregar e atacar o
            serviço. Podemos bloquear pedidos e remover notas quando houver indício de abuso.
          </p>
        </TrustSection>

        <TrustSection title="Conteúdo das notas" icon={IconLock} level={3}>
          <p>
            Não lemos o conteúdo das notas. Não conseguimos recuperar uma frase esquecida nem uma nota que já expirou,
            atingiu o limite de visualizações ou foi apagada.
          </p>
        </TrustSection>

        <TrustSection title="Disponibilidade e garantias" icon={IconAlert} level={3}>
          <p>
            O serviço é oferecido gratuitamente, no estado em que se encontra, sem garantia de funcionamento contínuo
            ou livre de erros. O site pode ficar indisponível para manutenção, por falhas técnicas ou por motivos fora
            do nosso controle, e uma nota pode deixar de estar disponível antes do prazo.
          </p>
          <p>
            Na medida permitida pela lei, o Nota Segura - BR não se responsabiliza por perdas decorrentes do uso ou da
            impossibilidade de uso do serviço, nem pelo conteúdo enviado pelos usuários.
          </p>
        </TrustSection>

        <TrustSection title="Lei aplicável e alterações" icon={IconScale} level={3}>
          <p>
            Estes termos e esta política são regidos pelas leis da República Federativa do Brasil. Podemos alterar esta
            página quando o serviço mudar, e a data da última atualização aparece no topo. Dúvidas podem ser enviadas
            pela página de <TextLink href="/contato">Contato</TextLink>.
          </p>
        </TrustSection>
      </TrustPart>
    </TrustPage>
  );
}
