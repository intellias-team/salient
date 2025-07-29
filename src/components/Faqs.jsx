import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'What is OptiSurge T1?',
      answer:
        'OptiSurge T1 is a clinically-backed testosterone optimizer made with natural ingredients like Testosurge®, Hyperox™, and Venomerix Optima™ — designed to help you build muscle, burn fat, recover faster, and perform better.',
    },
    {
      question: 'Is OptiSurge T1 safe?',
      answer: 'Yes. OptiSurge is made in a GMP-certified facility and uses clinically studied ingredients shown to be safe in human trials. No synthetic hormones. No harsh stimulants.',
    },
    {
      question: 'Will I feel a difference?',
      answer:
        'Most users report feeling stronger, more energized, and better recovered within 1–2 weeks. Testosterone support typically builds gradually, so results improve over time.',
    },
  ],
  [
    {
      question: 'Can I stack this with other supplements?',
      answer:
        'Yes — there are absolutely no known contraindications. OptiSurge stacks well with creatine, protein, amino acids, and daily wellness vitamins. No ingredient conflicts or known medicinal interactions.',
    },
    {
      question:
        'Do I need to cycle off? ',
      answer:
        'No. OptiSurge is designed for long-term use with no need for cycling off. In fact, users often report that consistent use leads to more stable energy, recovery, and performance over time. While cycling off is not required, some users may notice a gradual decline in the benefits experienced during active use',
    },
    {
      question:
        'Is this only for men?',
      answer:
        'No. While OptiSurge is optimized for male hormone support, it’s formulated for both men and women — especially athletes, gym-goers, and anyone aiming to naturally support healthy testosterone levels and performance.',
    },
  ]
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, email our team and we will get back to you.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg/7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
