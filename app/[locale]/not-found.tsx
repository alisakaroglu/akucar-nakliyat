import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-30 text-center">
      <span className="overline">404</span>
      <h1 className="mt-4 font-display text-h1 font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-4 max-w-prose text-body text-text-muted">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
      </p>
      <Button href="/" className="mt-8">
        Anasayfaya dön
      </Button>
    </Container>
  );
}
