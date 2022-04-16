import React from 'react';
import words from '../words.txt';

var curcol = 0;
var currow = 0;
var word = '';
var wordbank = new Object();

fetch(words)
    .then(r => r.text())
    .then(text => text.split(/\r?\n/))
    .then(t => parsewords(t))
    .then(l => {wordbank = l})


function parsewords(wordbankarr){
    let wb = new Object();
    for (let i = 0; i<wordbankarr.length; i++){
        let w = wordbankarr[i];

        if (wb.hasOwnProperty(w.length)){
            wb[w.length].push(w);
        } else {
            wb[w.length] = [w];
        }
        
    }

    return wb;
}

//https://stackoverflow.com/questions/36773671/deactivate-input-in-react-with-a-button-click

function Game(){
    const [wordlength, setWordlength] = React.useState(4);
    const [start, setStart] = React.useState(false);
    const myRefname = React.useRef(null);

    const startgame = (e) => {
        setStart(!start);
        word = wordbank[wordlength+1][Math.floor(Math.random() * wordbank[wordlength+1].length)];
        console.log(word);
        for (let i = 0; i<wordlength+1; i++){
            for (let x = 0; x<6; x++){
                document.getElementById(x + ' ' + i).innerHTML = "";
                document.getElementById(x + ' ' + i).parentNode.style.backgroundColor = "white";
                document.getElementById(x + ' ' + i).parentNode.style.borderColor = "#d3d6da";
                document.getElementById(x + ' ' + i).style.color = "black";
            }
            
        }

        let alp = "abcdefghijklmnopqrstuvwxyz";

        for (let i = 0; i<alp.length; i++){
            document.getElementById(alp[i]).style.backgroundColor = "#d3d6da";
            document.getElementById(alp[i]).style.color = "black";
        }



        curcol = 0;
        currow = 0;
    }

    const checkword = () => {
        if (currow === wordlength+1){
            let isword = ''
            for (let i = 0; i<wordlength+1; i++){
                isword = isword + document.getElementById(curcol + ' ' + i).innerHTML;
            }

            if (wordbank[wordlength+1].includes(isword)){
                
                let won = [];
                let col = curcol;
                for (let i = 0; i<wordlength+1; i++){
                    let k = document.getElementById(curcol + ' ' + i).innerHTML;
                    if (word[i] === k){
                        setTimeout(function(){document.getElementById(col + ' ' + i).parentNode.style.backgroundColor = '#6aaa64'}, 500*i);
                        setTimeout(function(){document.getElementById(k).style.backgroundColor = '#6aaa64'}, 500*i);
                        won.push(1);
                        
                    } else if (word.includes(k)){
                        setTimeout(function(){document.getElementById(col + ' ' + i).parentNode.style.backgroundColor = '#c9b458'}, 500*i);
                        setTimeout(function(){document.getElementById(k).style.backgroundColor = '#c9b458'}, 500*i);
                    } else {
                        setTimeout(function(){document.getElementById(col + ' ' + i).parentNode.style.backgroundColor = '#787c7e'}, 500*i);
                        setTimeout(function(){document.getElementById(k).style.backgroundColor = '#787c7e'}, 500*i);
                    }

                    setTimeout(function(){document.getElementById(col + ' ' + i).style.color = 'white'}, 500*i);
                    setTimeout(function(){document.getElementById(col + ' ' + i).parentNode.style.borderColor = 'transparent'}, 500*i);
                    setTimeout(function(){document.getElementById(k).style.color = 'white'}, 500*i);
                }

                if (won.length === wordlength+1){
                    setTimeout(function(){alert('you win!'); setStart(!start);}, 500*(wordlength+1)); //try to avoid alert later on
                    //setStart(!start);
                } else if (curcol === 5){
                    setTimeout(function(){alert('you lose! the correct word is ' + word); setStart(!start);}, 500*(wordlength+1)); //try to avoid alert later on
                }

                currow = 0;
                curcol = curcol + 1;
                
            } else {
                console.log('not a word');
            }
        }
    }

    const type = (e) => {
        if (start){ //remove ! when deploying
            document.getElementById(curcol + ' ' + currow).innerHTML = e.target.innerHTML;
            document.getElementById(curcol + ' ' + currow).parentNode.style.borderColor = "#878a8c";
            if (currow < wordlength+1){
                currow = currow + 1;
            }
        }
        
    }

    const deleteletter = () => {
        if (currow > 0){
            document.getElementById(curcol + ' ' + (currow-1)).innerHTML = "";
            document.getElementById(curcol + ' ' + (currow-1)).parentNode.style.borderColor = "#d3d6da";
            currow = currow - 1;
        }

    }

    let wordboxs = [];

    for (let i = 0; i<wordlength; i++){
        wordboxs.push(i);
    }

    return (
        <div className='game'>
        <h1>Wordle+</h1>
        <input className="slider" min="0" max="10" type="range" value={wordlength} onChange={(event) => setWordlength(Number(event.target.value))} disabled={start}/>
        <div onClick={startgame} className="test">
            <br></br><button className='startbutton' ref={myRefname} disabled={start}>Start</button>
        </div>
        <div style={{marginTop: "50px"}}>
            {[1,2,3,4,5,6].map((x, y) => (
                <div className='tiles'>{Array.from(Array(wordlength+1).keys()).map((i, k) =>(<div className='tile'><span id={y+' '+k}></span></div>))}</div>
            ))}
        </div>
        <div className='keyboard'>
            <div className='keyboardrow'>
                {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((letter) => (
                    <button id={letter} className="key" onClick={(e) => type(e)}>{letter}</button>
                ))}
            </div>
            <div className='keyboardrow'>
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map((letter) => (
                        <button id={letter} className="key" onClick={(e) => type(e)}>{letter}</button>
                    ))}
            </div>
            <div className='keyboardrow'>
                <button style={{width: "75px"}} className="key" onClick={checkword}>ENTER</button>
                {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((letter) => (
                        <button id={letter} className="key" onClick={(e) => type(e)}>{letter}</button>
                    ))}
                <button style={{width: "75px"}} className="key" onClick={deleteletter}><svg xmlns="http://www.w3.org/2000/svg" height="13" viewBox="0 0 24 24" width="24">
    <path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
  </svg></button>
            </div>
        </div>
        </div>
    )
}

export default Game;