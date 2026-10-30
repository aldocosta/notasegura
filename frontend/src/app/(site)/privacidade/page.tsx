import type { Metadata } from "next";
import TextLink from "@/components/TextLink";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { POLICY_UPDATED_AT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Quais dados o Nota Segura - BR guarda, por quanto tempo, e como funcionam os cookies de publicidade.",
};

export default function PrivacidadePage() {
  return (
    <TrustPage title="Política de Privacidade" updatedAt={POLICY_UPDATED_AT}>
      <TrustSection>
        <p>
          Esta política explica quais dados o Nota Segura - BR trata, por quanto tempo os guarda e quais são os seus
          direitos. O site é operado pelo Nota Segura - BR, que é o controlador dos dados descritos aqui.
        </p>
      </TrustSection>

      <TrustSection title="Sem conta e sem cadastro">
        <p>
          O site não exige conta, cadastro, nome nem e-mail. Não sabemos quem cria nem quem lê as notas, e não
          associamos as notas a nenhuma pessoa.
        </p>
      </TrustSection>

      <TrustSection title="O que guardamos sobre cada nota">
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
          Quando a nota atinge o limite de visualizações, ela deixa de poder ser aberta. A nota criptografada é apagada
          automaticamente do banco de dados na data de expiração escolhida, que é de no máximo 7 dias após a criação.
        </p>
      </TrustSection>

      <TrustSection title="Endereço IP e registros técnicos">
        <p>
          Para limitar o número de pedidos e proteger o serviço contra abuso, guardamos o endereço IP do visitante, a
          ação pedida e um contador por janela de 60 segundos. Esse registro é apagado automaticamente quando a janela
          termina.
        </p>
        <p>
          Também guardamos registros técnicos de funcionamento: o método e a rota de cada pedido, o código de
          resposta, o tempo de resposta e, em caso de falha, a mensagem de erro. Esses registros não incluem o
          endereço IP nem o texto das notas, e são apagados automaticamente após 90 dias.
        </p>
      </TrustSection>

      <TrustSection title="Cookies e publicidade">
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

      <TrustSection title="Seus direitos pela LGPD">
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

      <TrustSection title="Alterações">
        <p>
          Podemos atualizar esta política quando o serviço mudar. A data da última atualização aparece no topo desta
          página.
        </p>
      </TrustSection>
    </TrustPage>
  );
}
