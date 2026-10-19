/* KLAAT — authentic audio field; sample derived from user-recorded 12262.mp4, 29–49.2s, 2s overlap, 18.2s loop. */
(function(){
'use strict';
if(document.getElementById('klaat-sound-control')) return;
var SRC='/assets/klaat-ambient-loop-18s.mp3';
var ON='klaat-sound-enabled-v1', POS='klaat-sound-position-v1', VOL='klaat-sound-volume-v1';
function saved(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function save(k,v){try{sessionStorage.setItem(k,String(v))}catch(e){}}
var audio=new Audio(); audio.src=SRC; audio.loop=true; audio.preload='none';
var starting=false,playing=false,fadeId=0;
var v=Number(saved(VOL));var desiredVolume=(isFinite(v)&&v>0&&v<=1)?v:0.17;
audio.volume=0;
var w=document.createElement('div');w.className='klaat-sound';w.id='klaat-sound-control';w.setAttribute('role','group');w.setAttribute('aria-label','KLAAT site soundtrack');
w.innerHTML='<button type="button" class="klaat-sound-toggle" aria-label="Play KLAAT background audio" aria-pressed="false" title="KLAAT — authentic drone and drum. Click to play or pause."><span class="klaat-sound-mark" aria-hidden="true"></span><span class="klaat-sound-name">PLAY SOUND</span></button><input type="range" class="klaat-volume" aria-label="KLAAT audio volume" min="0" max="100" value="17" step="1" title="Volume">';
document.body.appendChild(w);
var button=w.querySelector('button'),label=w.querySelector('.klaat-sound-name'),slider=w.querySelector('input');
slider.value=Math.round(desiredVolume*100);
function render(){w.classList.toggle('is-on',playing);w.classList.toggle('is-loading',starting);button.setAttribute('aria-pressed',playing?'true':'false');label.textContent=starting?'LOADING':playing?'SOUND ON':'PLAY SOUND';button.setAttribute('aria-label',playing?'Pause KLAAT background audio':'Play KLAAT background audio')}
function fade(target,millis,after){cancelAnimationFrame(fadeId);var from=audio.volume,t0=performance.now();function step(now){var p=Math.min(1,(now-t0)/millis);audio.volume=Math.min(1,Math.max(0,from+(target-from)*p));if(p<1){fadeId=requestAnimationFrame(step)}else if(after){after()}}fadeId=requestAnimationFrame(step)}
var last=Number(saved(POS));if(isFinite(last)&&last>=0&&last<18.2){audio.addEventListener('loadedmetadata',function(){try{audio.currentTime=Math.min(last,Math.max(0,audio.duration-0.05))}catch(e){}},{once:true})}
async function turnOn(){if(starting||playing)return;starting=true;render();audio.preload='auto';try{await audio.play();starting=false;playing=true;save(ON,1);render();fade(desiredVolume,700)}catch(e){starting=false;playing=false;save(ON,0);render();}}
function turnOff(){save(ON,0);starting=false;playing=false;render();if(!audio.paused)fade(0,320,function(){audio.pause()});}
button.addEventListener('click',function(){if(playing||starting)turnOff();else turnOn()});
slider.addEventListener('input',function(){desiredVolume=Number(slider.value)/100;save(VOL,desiredVolume);if(playing)audio.volume=desiredVolume});
audio.addEventListener('timeupdate',function(){if(playing)save(POS,audio.currentTime)});
audio.addEventListener('error',function(){starting=false;playing=false;save(ON,0);render()});
window.addEventListener('pagehide',function(){save(POS,audio.currentTime||0)});
render();if(saved(ON)==='1')turnOn();
})();
