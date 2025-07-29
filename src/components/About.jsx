'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-features.jpg'
import screenshotExpenses from '@/images/screenshots/expenses.png'
import screenshotPayroll from '@/images/screenshots/payroll.png'
import screenshotReporting from '@/images/screenshots/reporting.png'
import screenshotVatReturns from '@/images/screenshots/vat-returns.png'

const features = [
  {
    title: 'Testosterone',
    description:
      "Achieve 54% Higher Bioavailable Testosterone. Increase performance, muscle mass, healthy libido, and raise bioavailable, free, and total testosterone levels.  (Powered by Testosurge™) ",
    image: screenshotPayroll,
  },
  {
    title: 'Fat Loss',
    description:
      "Experience Rapid Reductions in Body-Fat% (Powered by Testosurge™)",
    image: screenshotExpenses,
  },
  {
    title: 'Recovery',
    description:
      "Unlock Clean Energy & Faster Recovery: (Powered by Hyperox™, Venomerix™, and Testosterone Support)",
    image: screenshotVatReturns,
  }/*,
  {
    title: 'Reporting',
    description:
      'Easily export your data into an Excel spreadsheet where you can do whatever the hell you want with it.',
    image: screenshotReporting,
  },*/
]

export function About() {  // Changed from PrimaryFeatures
  let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-x-hidden overflow-y-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative max-w-full">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Why use Opti-Surge?
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
			Boost Testosterone Naturally. Build more muscle. Burn more fat. Recover faster and perform longer — all without synthetic hormones or harsh stimulants.
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto overflow-y-hidden pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-2 px-2 max-h-screen overflow-y-hidden whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-0.5 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-3 py-0.5 lg:rounded-l-xl lg:rounded-r-none lg:p-4',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-base data-selected:not-data-focus:outline-hidden',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-1 hidden text-xs lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="w-full max-w-full lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute inset-x-0 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="relative mt-10 w-full max-w-full pl-4 overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:max-w-[960px] sm:pl-6 lg:mt-0 lg:max-w-[1080px] lg:pl-8">
                      <Image
                        className="w-full h-auto object-contain max-w-[100vw]"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="100vw"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}