import type { Metadata } from "next";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection, type TrustHighlight } from "@/components/TrustPage";
import { IconClock, IconFileText, IconGlobe, IconHeart, IconLock, IconUserOff } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre",
  description: "O que é o Nota Segura - BR, quem mantém o serviço e como ele continua gratuito.",
};

const HIGHLIGHTS: TrustHighlight[] = [
  { icon: IconUserOff, title: "Sem cadastro", text: "Não é preciso criar conta nem informar nome ou e-mail." },
  { icon: IconLock, title: "Criptografado", text: "A nota é guardada criptografada." },
  {
    icon: IconClock,
    title: "Autodestrutivo",
    text: "O link deixa de funcionar quando o prazo acaba ou o limite de visualizações é atingido.",
  },
];

export default function SobrePage() {
  return (
    <TrustPage
      title="Sobre o Nota Segura - BR"
      lead="Um jeito simples e gratuito de enviar segredos que se apagam sozinhos."
      icon={IconHeart}
      highlights={HIGHLIGHTS}
    >
      <TrustSection title="O que o site faz" icon={IconFileText}>
        <p>
          O Nota Segura - BR permite enviar textos sensíveis, como senhas, códigos de acesso ou dados pessoais, por meio
          de um link que se autodestrói. Você escreve a nota, escolhe por quantos dias ela fica disponível (de 1 a 30) e
          quantas vezes ela pode ser aberta (de 1 a 50), e recebe um link para compartilhar.
        </p>
        <p>
          A nota é guardada criptografada. Se você definir uma frase secreta, ela entra na chave de criptografia e
          nunca é armazenada em texto claro, então só quem conhece a frase consegue ler a nota. Quando o prazo acaba ou
          o limite de visualizações é atingido, o link deixa de funcionar.
        </p>
      </TrustSection>

      <TrustSection title="Quem mantém o serviço" icon={IconGlobe}>
        <p>
          O site é operado pelo Nota Segura - BR, um projeto independente criado no Brasil. Não é preciso criar conta
          nem informar nome ou e-mail para usar o serviço.
        </p>
      </TrustSection>

      <TrustSection title="Por que é gratuito" icon={IconHeart}>
        <p>
          O serviço é gratuito para quem envia e para quem recebe as notas. Para cobrir os custos de servidor e
          manutenção, o site pode exibir anúncios do Google nas páginas de conteúdo. Os anúncios nunca aparecem na
          página que exibe uma nota.
        </p>
        <p>
          Saiba como tratamos os dados e quais são as regras de uso na{" "}
          <TextLink href="/privacidade">Política de Privacidade e Termos de Uso</TextLink>, ou fale conosco pela página
          de <TextLink href="/contato">Contato</TextLink>.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
