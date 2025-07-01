import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fundraiserData = {
      campaign: {
        title: "Go4it Global Academy - Vienna Launch",
        location: "Vienna, Austria",
        description: "The world's first IMG Academy + McDonald's + Community Recreation Center hybrid",
        goal_amount: 12500000, // 12.5M EUR
        current_amount: 847520, // Current funding amount in EUR
        currency: "EUR",
        start_date: "2025-01-01",
        end_date: "2025-12-31",
        days_remaining: 127,
        total_backers: 1847,
        funding_progress: 6.78, // Percentage
        status: "active"
      },

      facility_specs: {
        total_size: "15,000 m² (161,000 sq ft)",
        sports_facilities: 8,
        academic_classrooms: 24,
        community_capacity: 1200,
        student_enrollment: 600,
        target_opening: "September 2026"
      },

      investment_breakdown: {
        land_construction: 8500000,
        equipment_technology: 2800000,
        operating_capital: 1200000,
        total: 12500000
      },

      vienna_advantages: [
        {
          category: "Demographics",
          advantage: "Central European gateway with 1.9M metro population",
          impact: "Large target market with international families"
        },
        {
          category: "Market Demand",
          advantage: "High demand for international education and sports programs",
          impact: "Under-served premium youth sports market"
        },
        {
          category: "Economic Strength",
          advantage: "Strong economy with €48,000 average household income",
          impact: "High purchasing power for premium educational services"
        },
        {
          category: "Infrastructure",
          advantage: "World-class transportation and technology infrastructure",
          impact: "Easy accessibility and modern facility development"
        },
        {
          category: "Strategic Location",
          advantage: "Gateway to Central and Eastern European markets",
          impact: "Platform for rapid regional expansion"
        }
      ],

      funding_tiers: [
        {
          id: "supporter",
          name: "Community Supporter",
          amount: 50,
          description: "Help us build the future of community education",
          backers: 1205,
          perks: [
            "Vienna Academy digital newsletter",
            "Exclusive construction updates",
            "Community supporter certificate",
            "Early access to facility tours"
          ]
        },
        {
          id: "champion",
          name: "Academy Champion",
          amount: 250,
          description: "Champion the next generation of global citizens",
          backers: 487,
          perks: [
            "All Community Supporter benefits",
            "VIP opening ceremony invitation",
            "Go4it Academy branded merchandise",
            "Quarterly impact reports",
            "Behind-the-scenes facility videos"
          ]
        },
        {
          id: "founder",
          name: "Founding Partner",
          amount: 1000,
          description: "Be a founding partner in global education revolution",
          backers: 132,
          perks: [
            "All Academy Champion benefits",
            "Permanent recognition plaque at Vienna location",
            "Annual VIP family experience day",
            "Direct line to facility leadership",
            "First access to franchise opportunities"
          ]
        },
        {
          id: "visionary",
          name: "Global Visionary",
          amount: 5000,
          description: "Shape the future of international education",
          backers: 23,
          perks: [
            "All Founding Partner benefits",
            "Advisory board consideration",
            "Naming rights to facility spaces",
            "Lifetime family membership benefits",
            "Global franchise investment opportunities",
            "Annual Vienna Academy retreat invitation"
          ]
        }
      ],

      global_expansion_plan: {
        phase_1: {
          timeline: "2026-2027",
          focus: "European Expansion",
          target_locations: ["Berlin, Germany", "London, UK", "Paris, France", "Milan, Italy"],
          investment: "€45M",
          projected_students: 2400
        },
        phase_2: {
          timeline: "2027-2028",
          focus: "North American Launch",
          target_locations: ["Toronto, Canada", "New York, USA", "Los Angeles, USA"],
          investment: "€60M",
          projected_students: 1800
        },
        phase_3: {
          timeline: "2028-2030",
          focus: "Global Network",
          target_locations: ["Sydney, Australia", "Tokyo, Japan", "Dubai, UAE", "São Paulo, Brazil"],
          investment: "€80M",
          projected_students: 2400
        }
      },

      franchise_model: {
        img_academy_component: {
          title: "IMG Academy Excellence",
          features: [
            "Professional-grade training facilities",
            "Elite coaching and sports science",
            "Academic integration with athletics",
            "College recruitment pathways"
          ],
          investment_per_location: "€4.2M"
        },
        mcdonalds_component: {
          title: "McDonald's Scalability",
          features: [
            "Standardized operational systems",
            "Rapid global expansion model",
            "Quality control and training systems",
            "Local adaptation with global standards"
          ],
          investment_per_location: "€1.8M"
        },
        community_center_component: {
          title: "Recreation Center Heart",
          features: [
            "All-ages family programming",
            "Community events and gatherings",
            "Local cultural integration",
            "Social impact and wellness focus"
          ],
          investment_per_location: "€2.5M"
        }
      },

      revenue_projections: {
        vienna_location: {
          year_1: 4200000,
          year_2: 7800000,
          year_3: 12500000,
          year_5: 18200000
        },
        global_network_2030: {
          total_locations: 50,
          annual_revenue: 850000000,
          students_served: 30000,
          communities_impacted: 50
        }
      },

      social_impact: {
        community_benefits: [
          "Reduced youth inactivity and obesity rates",
          "Increased international education opportunities",
          "Enhanced community gathering spaces",
          "Local job creation and economic development",
          "Cultural exchange and global citizenship development"
        ],
        sustainability: [
          "LEED-certified green building standards",
          "Renewable energy integration",
          "Sustainable transportation incentives",
          "Local sourcing and community partnerships",
          "Carbon-neutral operations by 2028"
        ]
      },

      recent_milestones: [
        {
          date: "2025-01-15",
          milestone: "Vienna site acquisition completed",
          details: "Secured 15,000 m² premium location in Vienna's 22nd district"
        },
        {
          date: "2025-01-10",
          milestone: "Austrian education ministry approval",
          details: "Received official authorization for international education programs"
        },
        {
          date: "2025-01-05",
          milestone: "€500K pre-launch funding secured",
          details: "Initial investor commitments from European education fund"
        },
        {
          date: "2024-12-20",
          milestone: "Architectural plans finalized",
          details: "World-class design approved for multi-purpose facility"
        }
      ],

      backer_testimonials: [
        {
          name: "Dr. Maria Schneider",
          location: "Vienna, Austria",
          tier: "Global Visionary",
          testimonial: "As a parent and education professional, I believe Go4it Academy will revolutionize how we think about youth development. The combination of elite sports training and community enrichment is exactly what Vienna needs."
        },
        {
          name: "Thomas Mueller",
          location: "Munich, Germany",
          tier: "Founding Partner", 
          testimonial: "The franchise model reminds me of how McDonald's transformed global food service, but for education and sports. This will change communities worldwide."
        },
        {
          name: "Sarah Chen",
          location: "London, UK",
          tier: "Academy Champion",
          testimonial: "My daughter is a competitive swimmer, and the lack of comprehensive training facilities in Europe is frustrating. Go4it Academy will fill this massive gap."
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: fundraiserData,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Vienna fundraiser data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch fundraiser data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier, amount, donor_info, payment_method } = body;

    // Simulate payment processing
    const donation = {
      id: `don_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tier: tier,
      amount: amount,
      currency: "EUR",
      donor: {
        name: donor_info.name,
        email: donor_info.email,
        message: donor_info.message || ""
      },
      payment_method: payment_method,
      status: "completed",
      timestamp: new Date().toISOString(),
      confirmation_code: `GO4IT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      tax_deductible: true,
      receipt_url: `https://vienna.go4it-academy.com/receipt/${Date.now()}`
    };

    // Simulate updating campaign totals
    const updated_totals = {
      previous_amount: 847520,
      new_amount: 847520 + amount,
      new_backer_count: 1848,
      new_progress_percentage: ((847520 + amount) / 12500000) * 100
    };

    return NextResponse.json({
      success: true,
      donation: donation,
      updated_totals: updated_totals,
      message: "Thank you for supporting the Vienna Academy launch! Your contribution brings us one step closer to revolutionizing global education."
    });

  } catch (error) {
    console.error('Error processing donation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process donation' 
      },
      { status: 500 }
    );
  }
}