import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Privacidade',
  description: 'Politica de privacidade da Biaggio Flooring.',
}

export default function PrivacyPolicyPt() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div>
          <p className="uppercase tracking-[0.4em] text-brand-charcoal/60 text-sm mb-2">
            Politica de Privacidade
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
            Politica de Privacidade
          </h1>
        </div>

        <div className="space-y-5 text-brand-charcoal/80">
          <p>
            Coletamos dados fornecidos no formulario de estimativa, incluindo nome,
            email, telefone, endereco e informacoes do projeto, para enviar a sua
            solicitacao e orientar o atendimento.
          </p>
          <p>
            As solicitacoes sao armazenadas na colecao estimateRequests para
            acompanhamento interno, agendamento e comunicacao sobre o projeto.
          </p>
          <p>
            Podemos utilizar cookies essenciais para manter a navegacao e melhorar
            a experiencia do usuario.
          </p>
          <p>
            Email e telefone sao obrigatorios para contato e confirmacao do pedido.
          </p>
          <p>
            Podemos registrar logs e analytics anonimizados para entender o uso do
            portal e melhorar o servico.
          </p>
          <p>
            O valor apresentado no estimate e apenas uma estimativa preliminar de
            mao de obra, nao vinculante, sujeita a verificacao presencial.
          </p>
        </div>
      </div>
    </section>
  )
}
