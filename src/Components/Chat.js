import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitchEmbed } from 'react-twitch-embed';

const Chat = ({socket}) => {
  const navigate = useNavigate();
  const [solution, setSolution] = useState([-1,-1,-1]);
  const [value1, setValue1] = useState(" ");
  const [value2, setValue2] = useState(" ");
  const [value3, setValue3] = useState(" ");
  const embed = useRef(); // We use a ref instead of state to avoid rerenders.
  
  const handleReady = (e) => {
    embed.current = e;
  };

  function onCodeInput(number,input) {
    let myvalue = input.target.value;
    if (myvalue.length >= 2) {
      myvalue =  myvalue.charAt(1)
    }
    switch (number) {
      case 0:
        setValue1(myvalue);
        break;
      case 1:
        setValue2(myvalue);
        break;
      case 2:    
        setValue3(myvalue);
        break;
    
      default:
        break;
    }
    solution[number] = +myvalue;
    setSolution(solution);
      
    socket.emit("solution", solution);


}


  return (
    <>
    <TwitchEmbed
        channel="grosescargotgris"
        darkMode={true}
    />
    <div className="lock-animation" id="lockAnimation">
        <div className="lock-base">
            <input type="number" id="guess1" value={value1} onInput={(e) => onCodeInput(0, e)} autoFocus="autofocus" placeholder="0"/>
            <input type="number" id="guess2" value={value2} onInput={(e) => onCodeInput(1, e)} autoFocus="autofocus" placeholder="0"/>
            <input type="number" id="guess3" value={value3} onInput={(e) => onCodeInput(2, e)} autoFocus="autofocus" placeholder="0"/>
        </div>
    </div> 
    </>
  );
};

export default Chat;
