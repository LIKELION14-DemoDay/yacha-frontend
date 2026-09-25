import dividerLine from '../assets/divider-line.svg'

type Swatch = {
  label: string
  hex: string
  bg: string
  text: string
  title?: string
}

const mainColors: Swatch[] = [
  { label: '001', hex: '#FCB3B3', bg: 'bg-main-001', text: 'text-main-100' },
  { label: '002', hex: '#F89494', bg: 'bg-main-002', text: 'text-main-100' },
  { label: '003', hex: '#FA5A5A', bg: 'bg-main-003', text: 'text-white' },
  { label: '004', hex: '#EC3838', bg: 'bg-main-004', text: 'text-white' },
  { label: '005', hex: '#E11010', bg: 'bg-main-005', text: 'text-white', title: 'Main color' },
  { label: '006', hex: '#C41515', bg: 'bg-main-006', text: 'text-white' },
  { label: '007', hex: '#A60A0A', bg: 'bg-main-007', text: 'text-white' },
  { label: '008', hex: '#7D0D0D', bg: 'bg-main-008', text: 'text-white' },
  { label: '009', hex: '#5A0303', bg: 'bg-main-009', text: 'text-white' },
  { label: '100', hex: '#360101', bg: 'bg-main-100', text: 'text-white' },
]

const neutralColors: Swatch[] = [
  { label: '001', hex: '#F9F7F7', bg: 'bg-neutral-001', text: 'text-neutral-100' },
  { label: '002', hex: '#F4F1F1', bg: 'bg-neutral-002', text: 'text-neutral-100' },
  { label: '003', hex: '#E8E4E4', bg: 'bg-neutral-003', text: 'text-neutral-100' },
  { label: '004', hex: '#D5D0D0', bg: 'bg-neutral-004', text: 'text-neutral-100' },
  { label: '005', hex: '#B0ABAB', bg: 'bg-neutral-005', text: 'text-neutral-100' },
  { label: '006', hex: '#817D7D', bg: 'bg-neutral-006', text: 'text-white' },
  { label: '007', hex: '#5C5959', bg: 'bg-neutral-007', text: 'text-white' },
  { label: '008', hex: '#373535', bg: 'bg-neutral-008', text: 'text-white' },
  { label: '009', hex: '#1E1D1D', bg: 'bg-neutral-009', text: 'text-white' },
  { label: '100', hex: '#0C0C0C', bg: 'bg-neutral-100', text: 'text-white', title: 'sEcondary color' },
]

const additionalColors: Swatch[] = [
  { label: 'green', hex: '#18C170', bg: 'bg-green', text: 'text-main-100' },
  { label: 'yellow', hex: '#FAC62C', bg: 'bg-yellow', text: 'text-main-100' },
]

type TypeSpec = { name: string; spec: string; className: string }

const headlines: TypeSpec[] = [
  { name: 'Headline_SB 1', spec: 'SemiBold, 36/130%', className: 'text-headline-sb1' },
  { name: 'Headline_SB 2', spec: 'SemiBold, 32/130%', className: 'text-headline-sb2' },
  { name: 'Headline_SB 3', spec: 'SemiBold, 24/130%', className: 'text-headline-sb3' },
]

const subheads: TypeSpec[] = [
  { name: 'Subhead_B-1', spec: 'Bold 24/130%', className: 'text-subhead-b1' },
  { name: 'Subhead_M-2', spec: 'Medium, 24/130%', className: 'text-subhead-m2' },
  { name: 'Subhead_R-3', spec: 'Regular, 24/130%', className: 'text-subhead-r3' },
  { name: 'Subhead_B-4', spec: 'Bold, 20/130%', className: 'text-subhead-b4' },
  { name: 'Subhead_M-5', spec: 'Medium, 20/130%', className: 'text-subhead-m5' },
  { name: 'Subhead_B-6', spec: 'Bold, 16/130%', className: 'text-subhead-b6' },
  { name: 'Subhead_M-7', spec: 'Medium, 16/130%', className: 'text-subhead-m7' },
  { name: 'Subhead_R-8', spec: 'Regular, 14/130%', className: 'text-subhead-r8' },
]

const bodies: TypeSpec[] = [
  { name: 'Body_M-1', spec: 'Medium, 20/140%', className: 'text-body-m1' },
  { name: 'Body_R-2', spec: 'Regular, 20/140%', className: 'text-body-r2' },
  { name: 'Body_M-3', spec: 'Medium, 16/140%', className: 'text-body-m3' },
  { name: 'Body_R-4', spec: 'Regular, 16/140%', className: 'text-body-r4' },
  { name: 'Body_DL-4', spec: 'Demlight, 16/140%', className: 'text-body-dl5' },
  { name: 'Body_R-5', spec: 'Regular, 14/140%', className: 'text-body-r6' },
]

const captions: TypeSpec[] = [
  { name: 'Caption_R-1', spec: 'Regular, 14/130%', className: 'text-caption-r1' },
  { name: 'Caption_R-2', spec: 'Regular, 12/130%', className: 'text-caption-r2' },
]

const weightSamples = ['font-bold', 'font-medium', 'font-normal', 'font-[350]', 'font-light']

const guideText = 'text-[20px] leading-[1.5] tracking-[-0.01em] uppercase'
const sectionTitle = 'text-[32px] font-bold leading-[1.5] tracking-[-0.01em] uppercase text-black'
const typeLabel = 'text-[24px] font-semibold leading-[1.2] tracking-[0.1px] text-main'

function ColorTile({ swatch }: { swatch: Swatch }) {
  return (
    <div
      className={`relative flex size-[200px] shrink-0 flex-col items-center justify-end rounded-[20px] pb-[29px] text-center ${swatch.bg} ${swatch.text} ${guideText}`}
    >
      {swatch.title && (
        <p className="absolute top-[25px] font-bold whitespace-nowrap">{swatch.title}</p>
      )}
      <p className="opacity-30">{swatch.label}</p>
      <p>{swatch.hex}</p>
    </div>
  )
}

function KeyColor({ title, hex, bg }: { title: string; hex: string; bg: string }) {
  return (
    <div className="flex flex-col gap-[33px]">
      <h2 className={sectionTitle}>{title}</h2>
      <div className="flex items-center gap-[25px]">
        <div className={`size-[75px] rounded-[20px] ${bg}`} />
        <p className={`${guideText} text-black opacity-90`}>{hex}</p>
      </div>
    </div>
  )
}

function TypeColumn({ items, gap }: { items: TypeSpec[]; gap: string }) {
  return (
    <div className={`flex flex-col ${gap}`}>
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-1">
          <p className={`${item.className} text-text-1`}>{item.name}</p>
          <p className="text-[16px] leading-[1.2] tracking-[0.1px] text-text-2">{item.spec}</p>
        </div>
      ))}
    </div>
  )
}

function ColorSection() {
  return (
    <section className="flex flex-col px-[54px] pt-[56px] pb-[62px]">
      <div className="grid grid-cols-[289px_auto]">
        <KeyColor title="Main Color" hex="#E11010" bg="bg-main" />
        <KeyColor title="sEcondary Color" hex="#0C0C0C" bg="bg-secondary" />
      </div>

      <div className="mt-[56px] flex flex-col gap-[33px]">
        {[mainColors, neutralColors].map((row, i) => (
          <div key={i} className="flex gap-5">
            {row.map((swatch) => (
              <ColorTile key={swatch.hex} swatch={swatch} />
            ))}
          </div>
        ))}
      </div>

      <h2 className={`mt-[62px] ${sectionTitle}`}>additional Color</h2>
      <div className="mt-[18px] flex w-[2180px] gap-5">
        {additionalColors.map((swatch) => (
          <ColorTile key={swatch.hex} swatch={swatch} />
        ))}
        <div className="bg-gradient-dark ml-auto size-[200px] rounded-[20px]" />
      </div>
    </section>
  )
}

function FontSection() {
  return (
    <section className="flex flex-col px-[54px] pt-[56px] pb-[62px]">
      <h2 className={sectionTitle}>Font</h2>

      <div className="mt-[33px] flex items-center">
        <div className="flex flex-col gap-[6px]">
          {weightSamples.map((weight) => (
            <p key={weight} className={`${guideText} ${weight} text-neutral-100`}>
              야차철학과 함께해보세요
            </p>
          ))}
        </div>
        <div className="ml-[15px] flex h-[164px] w-0 items-center justify-center">
          <img src={dividerLine} alt="" width={164} height={1} className="block max-w-none rotate-90" />
        </div>
        <p className={`ml-[24px] ${guideText} text-black opacity-90`}>NOto sans kr</p>
      </div>

      <div className={`mt-[70px] flex gap-[25px] ${guideText} font-bold text-neutral-100`}>
        <p>나는 생각한다, 고로 존재한다.</p>
        <p>너 자신을 알라.</p>
      </div>

      <div className="mt-[78px] flex">
        <div className="flex w-[304px] flex-col gap-6">
          <h3 className={typeLabel}>HEADLINES</h3>
          <TypeColumn items={headlines} gap="gap-5" />
        </div>
        <div className="flex w-[230px] flex-col gap-6">
          <h3 className={typeLabel}>SUBHEAD</h3>
          <TypeColumn items={subheads} gap="gap-4" />
        </div>
        <div className="flex flex-col gap-6">
          <h3 className={typeLabel}>BODY</h3>
          <TypeColumn items={bodies} gap="gap-5" />
          <h3 className={`mt-[10px] ${typeLabel} font-bold`}>CAPTION</h3>
          <TypeColumn items={captions} gap="gap-5" />
        </div>
      </div>
    </section>
  )
}

export default function StyleGuide() {
  return (
    <main className="min-w-max bg-white">
      <ColorSection />
      <hr className="border-neutral-003" />
      <FontSection />
    </main>
  )
}
