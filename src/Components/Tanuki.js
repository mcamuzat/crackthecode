import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Tanuki = ({socket}) => {
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

let IconWithCombos = ({icon,OnClick,}) => {
    return (
        <>
        <div>
            {icon}          
        </div>
        </>
      );
}
  return (
    <>
    <div>
      <div>Tori</div>  
      <div>Tableau
      <div>
        ligne chiffre
      </div>
      <div>
        <IconWithCombos icon="pasteque" combo="banana"/>
        <IconWithCombos icon="pineapple" combo="sakura"/>
        <IconWithCombos icon="banana" combo="tori"/>
        <IconWithCombos icon="figua" combo="tori"/>
        <IconWithCombos icon="strawberry" combo="sakura"/>
      </div>
      <div>
        <IconWithCombos icon="pasteque" combo="banana"/>
        <IconWithCombos icon="pineapple" combo="sakura"/>
        <IconWithCombos icon="banana" combo="tori"/>
        <IconWithCombos icon="figua" combo="tori"/>
        <IconWithCombos icon="strawberry" combo="sakura"/>
      </div>
      <div>
        <IconWithCombos icon="pasteque" combo="banana"/>
        <IconWithCombos icon="pineapple" combo="sakura"/>
        <IconWithCombos icon="banana" combo="tori"/>
        <IconWithCombos icon="figua" combo="tori"/>
        <IconWithCombos icon="strawberry" combo="sakura"/>
      </div>
      <div>
      <IconWithCombos icon="pasteque" combo="banana"/>
        <IconWithCombos icon="pineapple" combo="sakura"/>
        <IconWithCombos icon="banana" combo="tori"/>
        <IconWithCombos icon="figua" combo="tori"/>
        <IconWithCombos icon="strawberry" combo="sakura"/>
      </div>

      </div>

      <div>Score</div>  
    </div>
    </>
  );
};

export default Tanuki;
