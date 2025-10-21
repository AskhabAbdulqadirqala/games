import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CheckersPage } from '@pages/Checkers/Checkers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CheckersPage />} />
        <Route path='/checkers' element={<CheckersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
