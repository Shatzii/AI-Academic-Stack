import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const academyData = {
      stats: {
        studentAthletes: 847,
        scholarshipsEarned: 2400000, // $2.4M
        collegeCommitments: 156,
        championshipTitles: 73
      },
      programs: [
        {
          id: 'basketball',
          name: 'Elite Basketball',
          description: 'Professional-level basketball training with NCAA pathway',
          features: ['NCAA Division I coaching', 'Skills development', 'Mental toughness', 'Game strategy'],
          seasons: 'Year-round',
          ageGroups: '8-18 years',
          tuition: 18000,
          scholarshipAvailable: true
        },
        {
          id: 'soccer',
          name: 'Premier Soccer',
          description: 'International-style soccer academy with pathway to professional leagues',
          features: ['UEFA certified coaches', 'Technical skills', 'Tactical awareness', 'Physical conditioning'],
          seasons: 'Year-round',
          ageGroups: '6-18 years',
          tuition: 16000,
          scholarshipAvailable: true
        },
        {
          id: 'tennis',
          name: 'Championship Tennis',
          description: 'Individual excellence in tennis with tournament preparation',
          features: ['ITF junior circuit', 'Mental game coaching', 'Fitness training', 'Equipment optimization'],
          seasons: 'Year-round',
          ageGroups: '5-18 years',
          tuition: 15000,
          scholarshipAvailable: true
        },
        {
          id: 'track',
          name: 'Track & Field Elite',
          description: 'Olympic-style training for track and field events',
          features: ['Olympic coaching methods', 'Event specialization', 'Performance analytics', 'Recovery protocols'],
          seasons: 'Year-round',
          ageGroups: '8-18 years',
          tuition: 14000,
          scholarshipAvailable: true
        },
        {
          id: 'swimming',
          name: 'Aquatic Excellence',
          description: 'Competitive swimming with pathway to collegiate and Olympic levels',
          features: ['USA Swimming certified', 'Stroke technique', 'Racing strategy', 'Nutrition planning'],
          seasons: 'Year-round',
          ageGroups: '5-18 years',
          tuition: 17000,
          scholarshipAvailable: true
        },
        {
          id: 'baseball',
          name: 'Diamond Prospects',
          description: 'Baseball development with MLB scouting connections',
          features: ['MLB coaching staff', 'Position specialization', 'Batting analytics', 'Pitching development'],
          seasons: 'Spring/Summer intensive',
          ageGroups: '8-18 years',
          tuition: 13000,
          scholarshipAvailable: true
        }
      ],
      facilities: [
        {
          name: 'Performance Center',
          description: 'Olympic-grade weight training and conditioning facility',
          features: ['Biomechanics lab', 'Recovery suites', 'Nutrition center'],
          capacity: 200
        },
        {
          name: 'Competition Venues',
          description: 'Regulation courts and fields for all major sports',
          features: ['Basketball courts', 'Soccer fields', 'Tennis courts'],
          capacity: 1500
        },
        {
          name: 'Aquatic Complex',
          description: '50-meter competition pool with diving platforms',
          features: ['Olympic lanes', 'Diving boards', 'Warm-up pool'],
          capacity: 300
        },
        {
          name: 'Medical Center',
          description: 'Sports medicine and injury prevention facility',
          features: ['Physical therapy', 'Sports medicine', 'Injury prevention'],
          capacity: 50
        }
      ],
      alumni: {
        olympicAthletes: 23,
        d1Scholarships: 156,
        professionalDrafts: 8,
        averageGPA: 4.2
      },
      admissions: {
        applicationDeadline: '2024-12-15',
        tryoutDates: ['2024-09-15', '2024-11-01', '2024-01-15'],
        requirements: [
          'Academic transcript (minimum 3.0 GPA)',
          'Athletic performance evaluation',
          'Medical clearance',
          'Letters of recommendation',
          'Personal statement'
        ],
        financialAid: {
          available: true,
          needBased: true,
          meritBased: true,
          athleticScholarships: true
        }
      }
    };

    return NextResponse.json(academyData);
  } catch (error) {
    console.error('Error fetching academy data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academy data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'application':
        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully',
          applicationId: `SA-${Date.now()}`,
          nextSteps: [
            'Schedule athletic evaluation',
            'Submit academic transcripts',
            'Complete medical clearance',
            'Attend campus tour'
          ]
        });

      case 'tryout':
        return NextResponse.json({
          success: true,
          message: 'Tryout registration confirmed',
          tryoutId: `TO-${Date.now()}`,
          details: {
            date: data.preferredDate,
            sport: data.sport,
            location: 'Go4it Sports Academy Main Campus',
            requirements: ['Athletic wear', 'Water bottle', 'Medical clearance form']
          }
        });

      case 'campus_tour':
        return NextResponse.json({
          success: true,
          message: 'Campus tour scheduled',
          tourId: `CT-${Date.now()}`,
          details: {
            date: data.preferredDate,
            time: data.preferredTime,
            type: data.tourType || 'general',
            guide: 'Athletic Department Staff'
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing sports academy request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}