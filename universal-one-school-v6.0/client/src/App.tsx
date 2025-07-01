import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SelfHostedDeviceEcosystem from './pages/SelfHostedDeviceEcosystem'
import ManufacturingAdministration from './pages/ManufacturingAdministration'
import MultiDeviceLearning from './pages/MultiDeviceLearning'
import VREducationExperience from './pages/VREducationExperience'
import ComprehensiveK12Program from './pages/ComprehensiveK12Program'
import OptimalLearningSchedule from './pages/OptimalLearningSchedule'
import StudentDashboard from './pages/StudentDashboard'
import HolographicClassroom from './pages/HolographicClassroom'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/self-hosted-device-ecosystem" element={<SelfHostedDeviceEcosystem />} />
          <Route path="/manufacturing-administration" element={<ManufacturingAdministration />} />
          <Route path="/multi-device-learning" element={<MultiDeviceLearning />} />
          <Route path="/vr-education-experience" element={<VREducationExperience />} />
          <Route path="/comprehensive-k12-program" element={<ComprehensiveK12Program />} />
          <Route path="/optimal-learning-schedule" element={<OptimalLearningSchedule />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/holographic-classroom" element={<HolographicClassroom />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App