import TextLink from "@/components/TextLink";
import { TrustSection } from "@/components/TrustPage";
import { IconShield } from "@/components/icons";

export default function CreateNoteCallout() {
  return (
    <TrustSection title="Precisa enviar um segredo?" icon={IconShield} tone="mint">
      <p>Use uma nota segura: o texto é criptografado com AES-256-GCM e se apaga sozinho.</p>
      <p>
        <TextLink href="/#criar-nota">Criar uma nota</TextLink>
      </p>
    </TrustSection>
  );
}
