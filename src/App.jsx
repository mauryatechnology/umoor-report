import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import ReportPage from './components/Report/ReportPage';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ReportPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
