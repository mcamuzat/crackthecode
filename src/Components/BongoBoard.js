import React , { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BongoBoard = ({socket,room}) => {
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

  useEffect(() => {
    console.log('refresh !')
    socket.on('getNewGame', (data) => setGame(data));
  }, [socket, game]);
  
  return (
    <>
    <div id="intro" className="intro">
        <h1>CRACK THE CODE</h1>
    </div>

    <div className="header">
        <span id="headerLabel">CAN YOU CRACK THE CODE?</span>
    </div>

    <div className="hint-wrapper">
        <section className="hint">
            <section className="hint-top">
                <span id="hint1">{game.problem.hint1}</span>
            </section>
            <span className="hint-text" style={{color: "#4CAF50"}}>2 CORRECT BUT<br />WRONG PLACED</span>
        </section>

        <section className="hint">
            <section className="hint-top">
                <span id="hint2">{game.problem.hint2}</span>
            </section>
            <span className="hint-text" style={{color: "#CCDB39"}}>1  CORRECT AND<br />WELL PLACED</span>
        </section>

        <section className="hint">
            <section className="hint-top">
                <span id="hint3">{game.problem.hint3}</span>
            </section>
            <span className="hint-text" style={{color: "#FEC007"}}>1 CORRECT BUT<br />WRONG PLACED</span>
        </section>

        <section className="hint">
            <section className="hint-top">
                <span id="hint4">{game.problem.hint4}</span>
            </section>
            <span className="hint-text" style={{color: "#FEC007"}}>1 CORRECT BUT<br />WRONG PLACED</span>
        </section>

        <section className="hint">
            <section className="hint-top">
                <span id="hint5">{game.problem.hint5}</span>
            </section>
            <span className="hint-text" style={{color: "#F44336"}}>NOTHING IS<br />CORRECT</span>
        </section>
    </div>
    </>
  );
};

export default BongoBoard;
