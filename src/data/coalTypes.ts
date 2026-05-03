export interface CoalType {
  id: string;
  name: string;
  description: string;
  grade: string;
  calorificValue: string;
  moisture: string;
  ashContent: string;
  image: string;
  accentColor: string;
}

const coalTypes: CoalType[] = [
  {
    id: 'anthracite',
    name: 'Anthracite',
    description:
      'The highest rank of coal with a lustrous, hard, and glossy surface. Prized for its high energy density and clean-burning properties, ideal for residential heating and metallurgical processes.',
    grade: 'Premium',
    calorificValue: '7,800 – 8,000 kcal/kg',
    moisture: '2 – 5%',
    ashContent: '5 – 10%',
    image: '/images/coal-anthracite.png',
    accentColor: '#a8b5c8',
  },
  {
    id: 'bituminous',
    name: 'Bituminous',
    description:
      'A dense, dark black coal with a higher carbon content. Most widely used for power generation and industrial manufacturing. Known for reliable heat output and versatile applications.',
    grade: 'High',
    calorificValue: '6,500 – 7,500 kcal/kg',
    moisture: '5 – 15%',
    ashContent: '6 – 12%',
    image: '/images/coal-bituminous.png',
    accentColor: '#e2b714',
  },
  {
    id: 'sub-bituminous',
    name: 'Sub-Bituminous',
    description:
      'A versatile intermediate coal with moderate energy content. Widely used in thermal power plants for electricity generation, offering a balance between cost efficiency and heating capacity.',
    grade: 'Medium-High',
    calorificValue: '5,000 – 6,500 kcal/kg',
    moisture: '15 – 30%',
    ashContent: '3 – 10%',
    image: '/images/coal-subbituminous.png',
    accentColor: '#c87533',
  },
  {
    id: 'lignite',
    name: 'Lignite',
    description:
      'A soft, brown coal with the lowest carbon content. Used primarily for electricity generation near mining sites. Its high moisture content makes it an economical choice for local power plants.',
    grade: 'Standard',
    calorificValue: '3,500 – 5,000 kcal/kg',
    moisture: '30 – 60%',
    ashContent: '6 – 19%',
    image: '/images/coal-hero.jpg',
    accentColor: '#8b6914',
  },
  {
    id: 'steam-coal',
    name: 'Steam Coal',
    description:
      'Thermal coal engineered for steam-electric power generation. Offers consistent combustion performance and is the backbone of thermal energy production in industries worldwide.',
    grade: 'High',
    calorificValue: '5,500 – 7,000 kcal/kg',
    moisture: '8 – 18%',
    ashContent: '8 – 15%',
    image: '/images/coal-anthracite.png',
    accentColor: '#e07b39',
  },
  {
    id: 'coking-coal',
    name: 'Coking Coal',
    description:
      'Metallurgical coal essential for steel production. When heated, it produces coke — a critical reducing agent in blast furnaces. Indispensable for the global steel and infrastructure industries.',
    grade: 'Premium',
    calorificValue: '7,000 – 8,200 kcal/kg',
    moisture: '1 – 5%',
    ashContent: '8 – 12%',
    image: '/images/coal-bituminous.png',
    accentColor: '#5b8abf',
  },
];

export default coalTypes;
