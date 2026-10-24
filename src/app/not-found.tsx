import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404"
      title="Esta oportunidad ya no está."
      lead={<p>Puede que el aviso se haya vendido o dado de baja en la última revisión. Mirá las que siguen activas.</p>}
      actions={<Button href="/#oportunidades">Ver oportunidades activas</Button>}
    />
  );
}
