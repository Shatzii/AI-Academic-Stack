import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const LearningProfileDashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    loadLearningProfile()
  }, [])

  const loadLearningProfile = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockProfile = {
        learningStyle: {
          visual: 85,
          auditory: 60,
          kinesthetic: 75,
          reading: 70
        },
        skillsBreakdown: [
          { subject: 'Mathematics', level: 85, trend: 'up' },
          { subject: 'Science', level: 78, trend: 'up' },
          { subject: 'English', level: 90, trend: 'stable' },
          { subject: 'History', level: 72, trend: 'up' },
          { subject: 'Programming', level: 88, trend: 'up' },
          { subject: 'Art', level: 65, trend: 'down' }
        ],
        strengthsWeaknesses: {
          strengths: [
            { skill: 'Problem Solving', score: 92 },
            { skill: 'Critical Thinking', score: 88 },
            { skill: 'Creativity', score: 85 },
            { skill: 'Communication', score: 82 }
          ],
          weaknesses: [
            { skill: 'Time Management', score: 58 },
            { skill: 'Public Speaking', score: 62 },
            { skill: 'Data Analysis', score: 65 }
          ]
        },
        studyPatterns: {
          bestTime: 'Morning (8-11 AM)',
          avgSessionDuration: 45,
          frequency: 'Daily',
          totalHours: 287,
          consistency: 88
        },
        growthTrajectory: [
          { month: 'Apr', overall: 65, mathematics: 60, science: 70 },
          { month: 'May', overall: 68, mathematics: 65, science: 72 },
          { month: 'Jun', overall: 72, mathematics: 70, science: 75 },
          { month: 'Jul', overall: 75, mathematics: 75, science: 78 },
          { month: 'Aug', overall: 78, mathematics: 78, science: 80 },
          { month: 'Sep', overall: 82, mathematics: 82, science: 82 },
          { month: 'Oct', overall: 85, mathematics: 85, science: 85 }
        ]
      }
      setProfile(mockProfile)
    } catch (error) {
      console.error('Error loading learning profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="learning-profile-dashboard">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading profile...</span>
          </div>
          <p>Loading your learning profile...</p>
        </div>
      </div>
    )
  }

  const radarData = [
    { subject: 'Visual', value: profile.learningStyle.visual },
    { subject: 'Auditory', value: profile.learningStyle.auditory },
    { subject: 'Kinesthetic', value: profile.learningStyle.kinesthetic },
    { subject: 'Reading/Writing', value: profile.learningStyle.reading }
  ]

  const skillRadarData = profile.skillsBreakdown.map(skill => ({
    subject: skill.subject,
    value: skill.level
  }))

  return (
    <div className="learning-profile-dashboard">
      <div className="dashboard-header">
        <h2>
          <i className="fas fa-user-graduate me-2"></i>
          Your Learning Profile
        </h2>
        <div className="view-tabs">
          <button
            className={`tab-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeView === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveView('detailed')}
          >
            Detailed Analysis
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="overview-section">
          {/* Learning Style Breakdown */}
          <div className="profile-card">
            <h3>
              <i className="fas fa-brain me-2"></i>
              Learning Style Profile
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Learning Style"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="style-summary">
              <p className="lead-style">
                <strong>Primary Style:</strong> Visual Learner (85%)
              </p>
              <p className="recommendation">
                💡 Focus on diagrams, infographics, and video content for optimal learning
              </p>
            </div>
          </div>

          {/* Skills Radar Chart */}
          <div className="profile-card">
            <h3>
              <i className="fas fa-chart-radar me-2"></i>
              Subject Proficiency
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Skill Level"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="skills-list">
              {profile.skillsBreakdown.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <span className="skill-name">{skill.subject}</span>
                  <div className="skill-info">
                    <span className="skill-level">{skill.level}%</span>
                    <i className={`fas fa-arrow-${skill.trend === 'up' ? 'up text-success' : skill.trend === 'down' ? 'down text-danger' : 'right text-warning'} ms-2`}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Trajectory */}
          <div className="profile-card full-width">
            <h3>
              <i className="fas fa-chart-line me-2"></i>
              Growth Trajectory
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={profile.growthTrajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Overall"
                  />
                  <Area
                    type="monotone"
                    dataKey="mathematics"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.4}
                    name="Mathematics"
                  />
                  <Area
                    type="monotone"
                    dataKey="science"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.4}
                    name="Science"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="growth-insights">
              <div className="insight-card success">
                <i className="fas fa-trophy"></i>
                <div>
                  <strong>+20% Growth</strong>
                  <p>in the last 6 months</p>
                </div>
              </div>
              <div className="insight-card info">
                <i className="fas fa-fire"></i>
                <div>
                  <strong>287 Hours</strong>
                  <p>Total study time</p>
                </div>
              </div>
              <div className="insight-card warning">
                <i className="fas fa-clock"></i>
                <div>
                  <strong>8-11 AM</strong>
                  <p>Your peak learning time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Heat Map */}
          <div className="profile-card">
            <h3>
              <i className="fas fa-fire me-2"></i>
              Strengths
            </h3>
            <div className="strength-list">
              {profile.strengthsWeaknesses.strengths.map((item, idx) => (
                <div key={idx} className="strength-item">
                  <span className="skill-name">{item.skill}</span>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className="score">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-card">
            <h3>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Areas for Improvement
            </h3>
            <div className="weakness-list">
              {profile.strengthsWeaknesses.weaknesses.map((item, idx) => (
                <div key={idx} className="weakness-item">
                  <span className="skill-name">{item.skill}</span>
                  <div className="weakness-bar">
                    <div
                      className="weakness-fill"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className="score">{item.score}%</span>
                  <button className="btn btn-sm btn-outline-primary ms-2">
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Study Patterns */}
          <div className="profile-card full-width">
            <h3>
              <i className="fas fa-calendar-check me-2"></i>
              Study Pattern Analysis
            </h3>
            <div className="patterns-grid">
              <div className="pattern-card">
                <i className="fas fa-sun icon"></i>
                <strong>Best Time</strong>
                <p>{profile.studyPatterns.bestTime}</p>
              </div>
              <div className="pattern-card">
                <i className="fas fa-hourglass-half icon"></i>
                <strong>Avg Session</strong>
                <p>{profile.studyPatterns.avgSessionDuration} minutes</p>
              </div>
              <div className="pattern-card">
                <i className="fas fa-calendar-day icon"></i>
                <strong>Frequency</strong>
                <p>{profile.studyPatterns.frequency}</p>
              </div>
              <div className="pattern-card">
                <i className="fas fa-chart-bar icon"></i>
                <strong>Consistency</strong>
                <p>{profile.studyPatterns.consistency}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'detailed' && (
        <div className="detailed-section">
          <div className="profile-card full-width">
            <h3>Detailed Learning Analytics</h3>
            <p className="text-muted">
              Deep dive into your learning patterns, cognitive preferences, and performance metrics
            </p>
            <div className="coming-soon">
              <i className="fas fa-cog fa-spin fa-3x mb-3"></i>
              <p>Advanced analytics coming soon...</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .learning-profile-dashboard {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          margin: 0;
          color: #2c3e50;
        }

        .view-tabs {
          display: flex;
          gap: 10px;
        }

        .tab-btn {
          padding: 10px 20px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .overview-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .profile-card.full-width {
          grid-column: 1 / -1;
        }

        .profile-card h3 {
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 1.3rem;
        }

        .chart-container {
          margin: 20px 0;
        }

        .style-summary {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .lead-style {
          font-size: 1.1rem;
          color: #2c3e50;
        }

        .recommendation {
          color: #666;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-top: 10px;
        }

        .skills-list {
          margin-top: 20px;
        }

        .skill-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .skill-info {
          display: flex;
          align-items: center;
        }

        .skill-level {
          font-weight: 600;
          color: #28a745;
        }

        .growth-insights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .insight-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border-radius: 8px;
        }

        .insight-card.success {
          background: #d4edda;
          color: #155724;
        }

        .insight-card.info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .insight-card.warning {
          background: #fff3cd;
          color: #856404;
        }

        .insight-card i {
          font-size: 2rem;
        }

        .strength-list, .weakness-list {
          margin-top: 15px;
        }

        .strength-item, .weakness-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .strength-bar, .weakness-bar {
          flex: 1;
          height: 24px;
          background: #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745, #20c997);
          transition: width 0.3s;
        }

        .weakness-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffc107, #fd7e14);
          transition: width 0.3s;
        }

        .patterns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .pattern-card {
          text-align: center;
          padding: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .pattern-card .icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .pattern-card strong {
          display: block;
          font-size: 1.2rem;
          margin-bottom: 5px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .coming-soon {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        @media (max-width: 768px) {
          .overview-section {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}

export default LearningProfileDashboard
