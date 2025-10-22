import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const SkillGapAnalysis = () => {
  const { user } = useAuth()
  const [gaps, setGaps] = useState([])
  const [skillTree, setSkillTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('all')

  useEffect(() => {
    analyzeSkillGaps()
  }, [selectedSubject])

  const analyzeSkillGaps = async () => {
    setLoading(true)
    try {
      // Mock AI-powered skill gap analysis
      const mockGaps = [
        {
          id: 1,
          skill: 'Quadratic Equations',
          subject: 'Mathematics',
          currentLevel: 45,
          targetLevel: 80,
          gap: 35,
          priority: 'high',
          prerequisites: ['Linear Equations', 'Factoring'],
          missingPrerequisites: ['Factoring'],
          estimatedTime: '8 hours',
          resources: [
            { type: 'video', title: 'Quadratic Formula Explained', duration: '15 min' },
            { type: 'practice', title: 'Quadratic Equations Practice Set', questions: 50 },
            { type: 'reading', title: 'Quadratic Equations Guide', pages: 12 }
          ]
        },
        {
          id: 2,
          skill: 'Photosynthesis',
          subject: 'Biology',
          currentLevel: 60,
          targetLevel: 85,
          gap: 25,
          priority: 'medium',
          prerequisites: ['Cell Structure', 'Chemical Reactions'],
          missingPrerequisites: [],
          estimatedTime: '5 hours',
          resources: [
            { type: 'video', title: 'How Plants Make Food', duration: '20 min' },
            { type: 'interactive', title: 'Virtual Lab: Photosynthesis', duration: '30 min' }
          ]
        },
        {
          id: 3,
          skill: 'Essay Structure',
          subject: 'English',
          currentLevel: 70,
          targetLevel: 90,
          gap: 20,
          priority: 'medium',
          prerequisites: ['Grammar', 'Paragraph Writing'],
          missingPrerequisites: [],
          estimatedTime: '4 hours',
          resources: [
            { type: 'reading', title: 'Essay Writing Fundamentals', pages: 8 },
            { type: 'practice', title: 'Essay Outline Practice', questions: 10 }
          ]
        }
      ]

      const mockSkillTree = [
        {
          subject: 'Mathematics',
          skills: [
            {
              name: 'Basic Arithmetic',
              level: 'foundation',
              completed: true,
              progress: 100,
              children: [
                { name: 'Fractions', completed: true, progress: 100 },
                { name: 'Decimals', completed: true, progress: 100 }
              ]
            },
            {
              name: 'Algebra',
              level: 'intermediate',
              completed: false,
              progress: 65,
              children: [
                { name: 'Linear Equations', completed: true, progress: 100 },
                { name: 'Factoring', completed: false, progress: 45 },
                { name: 'Quadratic Equations', completed: false, progress: 45, locked: true }
              ]
            },
            {
              name: 'Calculus',
              level: 'advanced',
              completed: false,
              progress: 0,
              locked: true,
              children: [
                { name: 'Limits', completed: false, progress: 0, locked: true },
                { name: 'Derivatives', completed: false, progress: 0, locked: true }
              ]
            }
          ]
        }
      ]

      setGaps(mockGaps)
      setSkillTree(mockSkillTree)
    } catch (error) {
      console.error('Error analyzing skill gaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const filteredGaps = selectedSubject === 'all' 
    ? gaps 
    : gaps.filter(gap => gap.subject.toLowerCase() === selectedSubject.toLowerCase())

  if (loading) {
    return (
      <div className="skill-gap-analysis">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Analyzing skill gaps...</span>
          </div>
          <p>Analyzing your skill gaps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="skill-gap-analysis">
      <div className="header">
        <h2>
          <i className="fas fa-chart-network me-2"></i>
          Skill Gap Analysis
        </h2>
        <p className="subtitle">AI-powered analysis of your knowledge gaps and learning path</p>
      </div>

      <div className="filter-section">
        <label>Filter by Subject:</label>
        <select 
          className="form-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="all">All Subjects</option>
          <option value="mathematics">Mathematics</option>
          <option value="biology">Biology</option>
          <option value="english">English</option>
          <option value="physics">Physics</option>
        </select>
      </div>

      {/* Skill Gaps List */}
      <div className="gaps-section">
        <h3>
          <i className="fas fa-exclamation-circle me-2"></i>
          Identified Knowledge Gaps
        </h3>
        <div className="gaps-list">
          {filteredGaps.map((gap) => (
            <div key={gap.id} className="gap-card">
              <div className="gap-header">
                <div>
                  <h4>{gap.skill}</h4>
                  <span className="subject-badge">{gap.subject}</span>
                  <span className={`priority-badge badge bg-${getPriorityColor(gap.priority)}`}>
                    {gap.priority} priority
                  </span>
                </div>
                <div className="gap-percentage">
                  <span className="gap-value">{gap.gap}%</span>
                  <span className="gap-label">gap</span>
                </div>
              </div>

              <div className="progress-comparison">
                <div className="level-bar">
                  <span className="level-label">Current</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${gap.currentLevel}%` }}
                    >
                      {gap.currentLevel}%
                    </div>
                  </div>
                </div>
                <div className="level-bar">
                  <span className="level-label">Target</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${gap.targetLevel}%` }}
                    >
                      {gap.targetLevel}%
                    </div>
                  </div>
                </div>
              </div>

              {gap.missingPrerequisites.length > 0 && (
                <div className="prerequisites-alert">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Missing Prerequisites:</strong> {gap.missingPrerequisites.join(', ')}
                </div>
              )}

              <div className="resources-section">
                <h5>Recommended Resources ({gap.estimatedTime})</h5>
                <div className="resources-list">
                  {gap.resources.map((resource, idx) => (
                    <div key={idx} className="resource-item">
                      <i className={`fas fa-${resource.type === 'video' ? 'video' : resource.type === 'practice' ? 'pencil-alt' : resource.type === 'interactive' ? 'flask' : 'book'} me-2`}></i>
                      <span>{resource.title}</span>
                      <span className="duration">
                        {resource.duration || `${resource.questions} questions` || `${resource.pages} pages`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-100 mt-3">
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Tree */}
      <div className="skill-tree-section">
        <h3>
          <i className="fas fa-sitemap me-2"></i>
          Skill Tree Progression
        </h3>
        {skillTree.map((tree, idx) => (
          <div key={idx} className="tree-card">
            <h4>{tree.subject}</h4>
            <div className="tree-levels">
              {tree.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="skill-level">
                  <div className={`skill-node ${skill.completed ? 'completed' : skill.locked ? 'locked' : 'in-progress'}`}>
                    <i className={`fas fa-${skill.completed ? 'check-circle' : skill.locked ? 'lock' : 'spinner'} node-icon`}></i>
                    <span className="node-name">{skill.name}</span>
                    <span className="node-level">{skill.level}</span>
                    <div className="progress mt-2">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${skill.progress}%` }}
                      >
                        {skill.progress}%
                      </div>
                    </div>
                  </div>
                  {skill.children && (
                    <div className="children-nodes">
                      {skill.children.map((child, childIdx) => (
                        <div key={childIdx} className={`child-node ${child.completed ? 'completed' : child.locked ? 'locked' : 'in-progress'}`}>
                          <i className={`fas fa-${child.completed ? 'check' : child.locked ? 'lock' : 'circle-notch'}`}></i>
                          <span>{child.name}</span>
                          <span className="child-progress">{child.progress}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .skill-gap-analysis {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1.1rem;
        }

        .filter-section {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .filter-section label {
          font-weight: 600;
        }

        .filter-section select {
          max-width: 300px;
        }

        .gaps-section {
          margin-bottom: 40px;
        }

        .gaps-section h3 {
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .gaps-list {
          display: grid;
          gap: 20px;
        }

        .gap-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .gap-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .gap-header h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .subject-badge {
          background: #e9ecef;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-right: 8px;
        }

        .priority-badge {
          font-size: 0.85rem;
        }

        .gap-percentage {
          text-align: right;
        }

        .gap-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #dc3545;
        }

        .gap-label {
          font-size: 0.9rem;
          color: #666;
        }

        .progress-comparison {
          margin: 20px 0;
        }

        .level-bar {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .level-label {
          min-width: 70px;
          font-weight: 600;
          color: #666;
        }

        .level-bar .progress {
          flex: 1;
          height: 30px;
        }

        .prerequisites-alert {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
          color: #856404;
        }

        .resources-section {
          margin-top: 20px;
        }

        .resources-section h5 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .resources-list {
          display: grid;
          gap: 10px;
        }

        .resource-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .resource-item i {
          color: #007bff;
        }

        .resource-item .duration {
          margin-left: auto;
          color: #666;
          font-size: 0.9rem;
        }

        .skill-tree-section {
          margin-top: 40px;
        }

        .skill-tree-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .tree-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .tree-card h4 {
          color: #2c3e50;
          margin-bottom: 25px;
        }

        .tree-levels {
          display: grid;
          gap: 30px;
        }

        .skill-level {
          position: relative;
        }

        .skill-node {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          position: relative;
        }

        .skill-node.completed {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .skill-node.locked {
          background: #6c757d;
          opacity: 0.6;
        }

        .node-icon {
          font-size: 1.5rem;
          margin-right: 10px;
        }

        .node-name {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .node-level {
          display: block;
          font-size: 0.85rem;
          opacity: 0.9;
          margin-top: 5px;
        }

        .children-nodes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
          padding-left: 30px;
        }

        .child-node {
          background: white;
          border: 2px solid #e0e0e0;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .child-node.completed {
          border-color: #28a745;
          background: #d4edda;
        }

        .child-node.locked {
          opacity: 0.5;
        }

        .child-progress {
          margin-left: auto;
          font-weight: 600;
          color: #007bff;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 768px) {
          .gap-header {
            flex-direction: column;
          }

          .children-nodes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default SkillGapAnalysis
