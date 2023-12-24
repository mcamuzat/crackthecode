import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Qwinto = ({socket}) => {
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
          <div>
              <h1>Qwinto score sheet</h1>
              <table>
                  <tr id="first" class="first">
                      <td></td>
                      <td></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f1" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f2" size="2"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f3" size="2" class="rounded"/></td>
                      <td></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f4" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f5" size="2"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f6" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f7" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f8" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r1f9" size="2" class="rounded"/></td>
                  </tr>
                  <tr id="second" class="second">
                      <td></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f1" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f2" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f3" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f4" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f5" size="2" class="rounded"/></td>
                      <td></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f6" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f7" size="2"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f8" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r2f9" size="2" class="rounded"/></td>
                      <td></td>
                  </tr>
                  <tr id="third" class="third">
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f1" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f2" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f3" size="2"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f4" size="2" class="rounded"/></td>
                      <td></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f5" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f6" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f7" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f8" size="2" class="rounded"/></td>
                      <td><input type="text" onkeypress="return validate(event)" onkeyup="score()" name="r3f9" size="2"/></td>
                      <td></td>
                      <td></td>
                  </tr>
                  <tr id="errors">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><input type="checkbox" name="error1" value="error1" onclick="score()"/></td>
                      <td><input type="checkbox" name="error2" value="error2" onclick="score()"/></td>
                      <td><input type="checkbox" name="error3" value="error3" onclick="score()"/></td>
                      <td><input type="checkbox" name="error4" value="error4" onclick="score()"/></td>
                      <td></td>
                      <td></td>
                      <td></td>
                  </tr>
                  <tr id="score">
                      <td class="first"><input type="text" disabled="true" name="s1" size="2" class="rounded"/></td>
                      <td class="second"><input type="text" disabled="true" name="s2" size="2" class="rounded"/></td>
                      <td class="third"><input type="text" disabled="true" name="s3" size="2" class="rounded"/></td>
                      <td><input type="text" disabled="true" name="s4" size="2"/></td>
                      <td><input type="text" disabled="true" name="s5" size="2"/></td>
                      <td><input type="text" disabled="true" name="s6" size="2"/></td>
                      <td><input type="text" disabled="true" name="s7" size="2"/></td>
                      <td><input type="text" disabled="true" name="s8" size="2"/></td>
                      <td><span>-</span></td>
                      <td><input type="text" disabled="true" name="sNegative" size="2"/></td>
                      <td><span>=</span></td>
                      <td><input type="text" disabled="true" name="sTotal" size="3"/></td>
                  </tr>
              </table>
          </div>
      </>
  );
};

export default Qwinto;
