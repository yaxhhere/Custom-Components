import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AiOutlineClose } from 'react-icons/ai';
import RichTextEditor from './components/CustomRichTextEditor';

function App() {
  return (
    <div className="App">
      {/* <FloatingCard>
        <div className="flexContainer">
          <div className="containerHead">
            <div className="headItem">
              CARD TITLE
            </div>
            <div className="headItem">
              <AiOutlineClose />
            </div>
          </div>
          <div className="containerBody">

          </div>
        </div>
      </FloatingCard> */}
      <RichTextEditor />
    </div>
  );
}

export default App;
