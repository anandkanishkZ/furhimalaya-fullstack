import React from 'react';
import { 
  Ruler, 
  Building2, 
  Calculator, 
  MapPin, 
  Home as HomeIcon, 
  HardHat, 
  CheckCircle, 
  ArrowRight,
  Phone 
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/Button';
import Image from 'next/image';

interface ServiceDetailProps {
  params: {
    id: string;
  }
}

export async function generateStaticParams() {
  return [
    { id: 'municipality-drawing' },
    { id: 'interior-design' },
    { id: 'estimation' },
    { id: 'civil-surveying' },
    { id: 'property-valuation' },
    { id: 'site-supervision' },
  ];
}

const services = {
  'municipality-drawing': {
    title: 'Municipality Drawing & Design',
    description: 'Professional architectural drawings and designs that comply with local municipality regulations and standards.',
    icon: <Ruler size={40} />,
    longDescription: 'Our Municipality Drawing & Design service provides comprehensive architectural and engineering drawings that comply with local building codes and regulations. We work closely with municipal authorities to ensure that all designs meet the required standards and obtain necessary approvals for construction permits.',
    features: [
      'Building permit drawings',
      'Construction documentation',
      'Regulatory compliance',
      'Architectural plans',
      'Structural designs',
      'MEP drawings',
    ],
    benefits: [
      'Streamlined approval process',
      'Compliance with local regulations',
      'Detailed and accurate drawings',
      'Professional documentation',
      'Reduced risk of permit rejection',
      'Expert guidance throughout the process',
    ],
    process: [
      {
        title: 'Initial Consultation',
        description: 'We begin with a thorough consultation to understand your project requirements, site conditions, and design preferences.',
      },
      {
        title: 'Preliminary Design',
        description: 'Our team creates preliminary designs based on your requirements and local building codes.',
      },
      {
        title: 'Detailed Drawings',
        description: 'We develop detailed architectural and engineering drawings with all necessary specifications.',
      },
      {
        title: 'Regulatory Review',
        description: 'We review the designs to ensure compliance with all applicable regulations and standards.',
      },
      {
        title: 'Submission & Approval',
        description: 'We submit the drawings to the relevant authorities and follow up to obtain necessary approvals.',
      },
      {
        title: 'Final Documentation',
        description: 'Once approved, we provide you with complete documentation for construction.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'interior-design': {
    title: '3D Interior Design',
    description: 'Stunning 3D visualizations of interior spaces to help you envision your dream home or office before construction.',
    icon: <Building2 size={40} />,
    longDescription: 'Our 3D Interior Design service brings your vision to life with photorealistic visualizations of interior spaces. Using advanced 3D modeling and rendering techniques, we create detailed representations of your future home or office, allowing you to see and refine the design before construction begins.',
    features: [
      'Photorealistic 3D renderings',
      'Space planning',
      'Material selection',
      'Furniture layout',
      'Lighting design',
      'Color schemes',
    ],
    benefits: [
      'Visualize your space before construction',
      'Make informed design decisions',
      'Explore different design options',
      'Identify potential issues early',
      'Streamline the construction process',
      'Achieve your desired aesthetic',
    ],
    process: [
      {
        title: 'Design Brief',
        description: 'We gather information about your preferences, requirements, and inspiration for the space.',
      },
      {
        title: 'Concept Development',
        description: 'Our designers create initial concepts based on your brief and spatial requirements.',
      },
      {
        title: 'Space Planning',
        description: 'We develop detailed floor plans and layouts to optimize the functionality of the space.',
      },
      {
        title: 'Material & Finish Selection',
        description: 'We select appropriate materials, finishes, colors, and furnishings for the design.',
      },
      {
        title: '3D Modeling & Rendering',
        description: 'We create photorealistic 3D visualizations of the designed space from multiple viewpoints.',
      },
      {
        title: 'Refinement & Finalization',
        description: 'Based on your feedback, we refine the design until it meets your expectations.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'estimation': {
    title: 'Estimation & Costing',
    description: 'Accurate cost estimations for construction projects to help you plan your budget effectively.',
    icon: <Calculator size={40} />,
    longDescription: 'Our Estimation & Costing service provides detailed and accurate cost projections for construction projects of all sizes. We analyze all aspects of your project to develop comprehensive cost estimates that help you plan your budget, make informed decisions, and avoid unexpected expenses during construction.',
    features: [
      'Detailed cost breakdowns',
      'Material quantity takeoffs',
      'Labor cost estimation',
      'Equipment cost analysis',
      'Budget planning',
      'Value engineering',
    ],
    benefits: [
      'Accurate budget planning',
      'Identification of cost-saving opportunities',
      'Transparent cost breakdown',
      'Reduced financial risk',
      'Informed decision-making',
      'Optimized resource allocation',
    ],
    process: [
      {
        title: 'Project Analysis',
        description: 'We thoroughly analyze your project plans, specifications, and requirements.',
      },
      {
        title: 'Quantity Takeoff',
        description: 'We calculate the quantities of all materials required for the project.',
      },
      {
        title: 'Cost Research',
        description: 'We research current market prices for materials, labor, and equipment.',
      },
      {
        title: 'Detailed Estimation',
        description: 'We develop detailed cost estimates for all aspects of the project.',
      },
      {
        title: 'Value Engineering',
        description: 'We identify potential cost-saving opportunities without compromising quality.',
      },
      {
        title: 'Final Report',
        description: 'We provide a comprehensive cost report with detailed breakdowns and recommendations.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'civil-surveying': {
    title: 'Civil Surveying',
    description: 'Comprehensive land surveying services to determine property boundaries and topographic features.',
    icon: <MapPin size={40} />,
    longDescription: 'Our Civil Surveying service provides accurate measurements and mapping of land and property features. Using advanced surveying equipment and techniques, we collect precise data about property boundaries, topography, and existing structures to support planning, design, and construction activities.',
    features: [
      'Boundary surveys',
      'Topographic surveys',
      'Construction staking',
      'ALTA/NSPS surveys',
      'GPS surveying',
      'As-built surveys',
    ],
    benefits: [
      'Accurate property information',
      'Prevention of boundary disputes',
      'Informed design decisions',
      'Compliance with legal requirements',
      'Precise construction layout',
      'Comprehensive site documentation',
    ],
    process: [
      {
        title: 'Initial Assessment',
        description: 'We assess your surveying needs and gather existing documentation about the property.',
      },
      {
        title: 'Field Survey',
        description: 'Our surveyors conduct on-site measurements using advanced equipment.',
      },
      {
        title: 'Data Collection',
        description: 'We collect precise data about property boundaries, elevations, and existing features.',
      },
      {
        title: 'Data Processing',
        description: 'We process the collected data using specialized software to ensure accuracy.',
      },
      {
        title: 'Map & Drawing Preparation',
        description: 'We prepare detailed maps, drawings, and reports based on the survey data.',
      },
      {
        title: 'Final Deliverables',
        description: 'We provide you with comprehensive survey documentation for your specific needs.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566596343373-30675cf5aae4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551651057-f4a47d3bf130?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'property-valuation': {
    title: 'Property Valuation',
    description: 'Professional property valuation services for banking institutions, including residential, commercial, and hospitality sector assessments.',
    icon: <HomeIcon size={40} />,
    longDescription: 'Our Property Valuation service provides expert assessment of real estate assets for institutional lending purposes. Working with leading banks including Nepal Investment Mega Bank and Nabil Bank, we conduct comprehensive property evaluations covering residential apartments, luxury hotels, commercial buildings, and construction projects. Our experienced team ensures accurate valuations meeting banking standards for loan processing and investment decisions.',
    features: [
      'Bank-grade institutional property valuations',
      'Luxury hotel and apartment complex assessments',
      'Commercial property appraisals for lending',
      'Construction progress valuations',
      'Investment grade property analysis',  
      'Comprehensive valuation reports for institutional lenders',
    ],
    benefits: [
      'Trusted by leading banks and financial institutions',
      'Expertise in hospitality sector valuations',
      'Accurate assessments for institutional lending',
      'Detailed reports meeting banking standards',
      'Experience with high-value property assessments',
      'Professional site visit and inspection services',
    ],
    process: [
      {
        title: 'Property Inspection',
        description: 'We conduct a thorough inspection of the property to assess its condition and features.',
      },
      {
        title: 'Data Collection',
        description: 'We gather relevant information about the property and research comparable properties.',
      },
      {
        title: 'Market Analysis',
        description: 'We analyze current market trends and factors affecting property values in the area.',
      },
      {
        title: 'Valuation Calculation',
        description: 'We apply appropriate valuation methods to determine the fair market value.',
      },
      {
        title: 'Report Preparation',
        description: 'We prepare a comprehensive valuation report with detailed analysis and findings.',
      },
      {
        title: 'Client Consultation',
        description: 'We discuss the valuation results with you and address any questions or concerns.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
  'site-supervision': {
    title: 'Site Supervision & Running Bill Verification',
    description: 'Comprehensive construction monitoring, quality control, and running bill verification services for banking institutions.',
    icon: <HardHat size={40} />,
    longDescription: 'Our Site Supervision and Running Bill Verification service provides comprehensive construction monitoring for banking institutions and lenders. We conduct systematic verification of construction progress, quality control assessments, and running bill validations for projects funded by leading banks. Our services include monitoring luxury hotel construction, residential developments, and commercial projects, ensuring compliance with approved specifications and quality standards throughout the construction lifecycle.',
    features: [
      'Running bill verification for institutional lenders',
      'Construction progress monitoring and assessment',
      'Quality control and compliance verification',
      'Material usage verification and standards compliance',
      'Safety protocol adherence monitoring',
      'Post-delivery technical inspections and reporting',
    ],
    benefits: [
      'Protect lender investments through systematic monitoring',
      'Ensure construction quality meets approved standards',
      'Systematic progress verification for payment releases',
      'Professional oversight of high-value projects',
      'Detailed reporting for institutional requirements',
      'Experience with luxury hospitality and residential projects',
    ],
    process: [
      {
        title: 'Project Familiarization',
        description: 'We thoroughly review project plans, specifications, and requirements.',
      },
      {
        title: 'Supervision Planning',
        description: "We develop a supervision plan tailored to your project's specific needs.",
      },
      {
        title: 'On-site Monitoring',
        description: 'Our supervisors regularly visit the site to monitor construction activities.',
      },
      {
        title: 'Quality Inspections',
        description: 'We conduct detailed inspections to ensure work meets quality standards.',
      },
      {
        title: 'Progress Reporting',
        description: 'We provide regular reports on construction progress and any issues.',
      },
      {
        title: 'Final Inspection',
        description: 'We perform a comprehensive final inspection before project handover.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  },
};

export default function ServiceDetail({ params }: ServiceDetailProps) {
  const service = services[params.id as keyof typeof services];

  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-32 bg-blue-700">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            width={1200}
            height={800}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8">{service.description}</p>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Service Overview</h2>
                <p className="text-gray-600">What we offer and how it benefits you</p>
              </div>
              <p className="text-gray-600 mb-8">{service.longDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="text-blue-700 h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button href="/contact">
                Request a Quote
              </Button>
            </div>

            <div className="relative">
              <Image
                src={service.image}
                alt={service.title}
                className="rounded-lg shadow-xl w-full h-auto"
                width={1200}
                height={800}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">How our service adds value to your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {benefit}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">How we approach each project to deliver exceptional results</p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.process.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-md relative"
                >
                  <div className="absolute -top-5 -left-5 w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Project Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Examples of our work in this service area</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {service.gallery.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image}
                  alt={`${service.title} Project ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Ready to Get Started?
              </h2>
              <p className="text-blue-100">
                Contact us today to discuss your {service.title.toLowerCase()}{' '}
                needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" variant="secondary">
                Request a Quote
              </Button>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md font-medium bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Related Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore other services that complement your project needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {Object.entries(services)
              .filter(([key]) => key !== params.id)
              .slice(0, 3)
              .map(([key, relatedService]) => (
                <div
                  key={key}
                  className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
                    {relatedService.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {relatedService.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {relatedService.description}
                  </p>
                  <Link
                    href={`/services/${key}`}
                    className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-all duration-300"
                  >
                    Learn More{' '}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/services" variant="outline">
              View All Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}