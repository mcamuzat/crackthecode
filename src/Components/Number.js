import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Pad = (props) => {
    return (
    <div className="pad" onClick={props.onClick}>
      {props.value}   
    </div> 
    )

}

const Number = ({socket}) => {

  const [problem, setProblem] = useState([2, 3, 6, 7, 9, 10]); 




  function onCodeInput(number,input) {
   

  }

  console.log(problem);

  let buttons = problem.map((x)=> <Pad value={x} onClick={onCodeInput}/>);
  return (
    <>
    <div className="lock-animation" id="lockAnimation">
        <div className="lock-base">
            
        </div>

        <div>
          {buttons}
        </div>

        <div className="operation">
           <div className="operator">+</div>
           <div className="operator">-</div>
           <div className="operator">/</div>
           <div className="operator">*</div>
           <div className="operator">clear</div>
           
        </div>
    </div> 
    </>
  );
};

/*function solve(numbers, target) {
    let closestValue = Infinity;
    let closestExpression = null;
    let targetReached = false;
    
    function dfs(index, expression, value, used) {
        if (index === numbers.length) {
            if (value === target) {
                targetReached = true;
                closestValue = value;
                closestExpression = expression;
                return;
            }
            if (Math.abs(target - value) < Math.abs(target - closestValue)) {
                closestValue = value;
                closestExpression = expression;
            }
            return;
        }
        
        if (targetReached) return;
        
        for (let i = 0; i < numbers.length; i++) {
            if (used & (1 << i)) continue; // if number is already used, skip it
            
            // Try adding the number
            dfs(index + 1, expression + ' + ' + numbers[i], value + numbers[i], used | (1 << i));
            // Try subtracting the number
            dfs(index + 1, expression + ' - ' + numbers[i], value - numbers[i], used | (1 << i));
            // Try multiplying by the number
            dfs(index + 1, expression + ' * ' + numbers[i], value * numbers[i], used | (1 << i));
            // Try dividing by the number, if not zero
            if (numbers[i] !== 0) {
                dfs(index + 1, expression + ' / ' + numbers[i], value / numbers[i], used | (1 << i));
            }
        }
    }
    
    for (let i = 0; i < numbers.length; i++) {
        dfs(1, numbers[i].toString(), numbers[i], 1 << i);
        if (targetReached) break;
    }
    
    if (targetReached) {
        console.log("Target reached: ", closestExpression, "=", target);
    } else {
        console.log("Closest match: ", closestExpression, "=", closestValue);
    }
  }
  
  // enter random numbers and set target
  const numbers = [2, 3, 6, 7, 9, 10];
  const target = 63;
  
  solve(numbers, target);*/

export default Number;
