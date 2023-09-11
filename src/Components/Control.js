import React , { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Control = ({socket}) => {

    const [game, setGame] = useState(
        { problem: {
            hint1: "0 0 0",
            hint2: "0 0 0",
            hint3: "0 0 0",
            hint4: "0 0 0",
            hint5: "0 0 0"
        }
    });

    useEffect(() => {
        socket.emit('getProblem')
    }, [socket]);
    
      useEffect(() => {
        socket.on('getCurrentGame', (data) => setGame(data));
        console.log(game);
      }, [socket, game]);

  return (
    <>
    <div id="intro" className="intro">
        <h1>Choose</h1>
    </div>

    <div className="header">
        <span id="headerLabel">CAN YOU CRACK THE CODE?</span>
    </div>




    </>
  );
};

export default Control;
