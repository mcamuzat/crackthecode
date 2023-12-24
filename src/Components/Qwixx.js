import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Qwixx = ({socket}) => {
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
              <h1>Qwixx score sheet</h1>
<table>
<tr class="punainen">
<td class="eka"><input type="checkbox" class="punainen" id="punainen2" /></td>
<td><input type="checkbox" class="punainen" id="punainen3" /></td>
<td><input type="checkbox" class="punainen" id="punainen4" /></td>
<td><input type="checkbox" class="punainen" id="punainen5" /></td>
<td><input type="checkbox" class="punainen" id="punainen6" /></td>
<td><input type="checkbox" class="punainen" id="punainen7" /></td>
<td><input type="checkbox" class="punainen" id="punainen8" /></td>
<td><input type="checkbox" class="punainen" id="punainen9" /></td>
<td><input type="checkbox" class="punainen" id="punainen10" /></td>
<td><input type="checkbox" class="punainen" id="punainen11" /></td>
<td><input type="checkbox" class="punainen" id="punainen12" /></td>
<td class="vika"><input type="checkbox" class="punainen" id="punainenlukko" disabled="disabled" /></td>
<td class="tyhja"></td>
<td class="sakkotd"><input type="checkbox" class="sakko" id="virhe1" /></td>
</tr>
<tr>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
<th>6</th>
<th>7</th>
<th>8</th>
<th>9</th>
<th>10</th>
<th>11</th>
<th>12</th>
<th>L</th>
</tr>
<tr class="keltainen">
<td class="eka"><input type="checkbox" class="keltainen" id="keltainen2" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen3" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen4" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen5" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen6" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen7" /></td>
<td><input type="checkbox" class="keltainen"  id="keltainen8" /></td>
<td><input type="checkbox" class="keltainen" id="keltainen9" /></td>
<td><input type="checkbox" class="keltainen" id="keltainen10" /></td>
<td><input type="checkbox" class="keltainen" id="keltainen11" /></td>
<td><input type="checkbox" class="keltainen" id="keltainen12" /></td>
<td class="vika"><input type="checkbox" class="keltainen" id="keltainenlukko" disabled="disabled" /></td>
<td class="tyhja"></td>
<td class="sakkotd"><input type="checkbox" class="sakko" id="virhe2" /></td>
</tr>
<tr class="vihreä">
<td class="eka"><input type="checkbox" class="vihreä" id="vihreä12" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä11" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä10" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä9" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä8" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä7" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä6" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä5" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä4" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä3" /></td>
<td><input type="checkbox" class="vihreä" id="vihreä2" /></td>
<td class="vika"><input type="checkbox" class="vihreä" id="vihreälukko" disabled="disabled" /></td>
<td class="tyhja"></td>
<td class="sakkotd"><input type="checkbox" class="sakko" id="virhe3" /></td>
</tr>
<tr>
<th>12</th>
<th>11</th>
<th>10</th>
<th>9</th>
<th>8</th>
<th>7</th>
<th>6</th>
<th>5</th>
<th>4</th>
<th>3</th>
<th>2</th>
<th>L</th>
</tr>
<tr class="sininen">
<td className="red"><input type="checkbox" class="sininen" id="sininen12" /></td>
<td><input type="checkbox" class="sininen" id="sininen11" /></td>
<td><input type="checkbox" class="sininen" id="sininen10" /></td>
<td><input type="checkbox" class="sininen" id="sininen9" /></td>
<td><input type="checkbox" class="sininen" id="sininen8" /></td>
<td><input type="checkbox" class="sininen" id="sininen7" /></td>
<td><input type="checkbox" class="sininen" id="sininen6" /></td>
<td><input type="checkbox" class="sininen" id="sininen5" /></td>
<td><input type="checkbox" class="sininen" id="sininen4" /></td>
<td><input type="checkbox" class="sininen" id="sininen3" /></td>
<td><input type="checkbox" class="sininen" id="sininen2" /></td>
<td class="vika"><input type="checkbox" class="sininen" id="sininenlukko" disabled="disabled" /></td>
<td class="tyhja"></td>
<td class="sakkotd"><input type="checkbox" class="sakko" id="virhe4" /></td>
</tr>
</table>

<input type="text" readonly="readonly" id="punapisteet" size="3" value="0"/>
<input type="text" readonly="readonly" id="keltapisteet" size="3" value="0" />
<input type="text" readonly="readonly" id="viherpisteet" size="3" value="0" />
<input type="text" readonly="readonly" id="sinipisteet" size="3" value="0" />
<input type="text" readonly="readonly" id="sakkopisteet" size="3" value="0" />

<p>Total score: <input type="text" readonly="readonly" id="summapisteet" size="3" /></p>

<input type="submit" id="clearall" value="Clear" />
          </div>
      </>
  );
};

export default Qwixx;
