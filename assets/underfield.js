/* KLAAT / THE UNDERFIELD. Hidden node paths and an authored responsive voice.
   The voice is local and rule-based: it makes no claim to be a remote AI. */
(function(){
"use strict";
const fields=[
 ["subsurface","underfield",["held","impactline","confluence","@fragment:14"]],
 ["impactline","underfield",["division","airchamber","confluence","@observe"]],
 ["airchamber","underfield",["breath","subsurface","confluence","@fragment:08"]],
 ["confluence","underfield",["subsurface","impactline","airchamber","castskin","@observe"]],
 ["castskin","underfield",["confluence","witness","return","@fragment:12"]],
 ["witness","underfield",["castskin","archive","return","@listen"]]
];
const meta={
 subsurface:["UNDERFIELD / GROUND","A sustained line does not sit still. Enter beneath the visible drone.","The ground is not silence. It is a reference against which movement can be noticed."],
 impactline:["UNDERFIELD / STRIKE","A single mark interrupts the surface. Its next appearance changes the first.","A pulse is not force alone. It is the possibility of another strike."],
 airchamber:["UNDERFIELD / BREATH","Air enters as effort and leaves as form. Follow the changing contour.","Breath makes the line possible; it does not guarantee what the listener feels."],
 confluence:["UNDERFIELD / JOIN","Drone, interruption and breath cross here. None disappears into the others.","Three paths, one encounter. The relation is the instrument."],
 castskin:["UNDERFIELD / EMERGENCE","A shell holds the outline of an event after the event has moved on.","What emerges is not the skin it leaves behind."],
 witness:["UNDERFIELD / THE LISTENER","Somewhere in the field, a mark has begun to answer.","Find the mark that does not open another room."]
};
const gates={held:"subsurface",harmonics:"subsurface",wake:"subsurface",lowcurrent:"subsurface",division:"impactline",omission:"impactline",phasebreak:"impactline",breath:"airchamber",body:"airchamber",memorywell:"airchamber",trace:"confluence",strata:"confluence",unseen:"castskin",archive:"witness"};
const isRoom=id=>fields.some(f=>f[0]===id);
const positions=(id,mobile)=>{
 const p={
 subsurface:[[.19,.39],[.79,.32],[.79,.68],[.24,.74]],
 impactline:[[.26,.29],[.76,.37],[.65,.72],[.15,.61]],
 airchamber:[[.24,.36],[.75,.30],[.77,.66],[.27,.74]],
 confluence:[[.16,.36],[.83,.35],[.25,.74],[.77,.72],[.51,.19]],
 castskin:[[.19,.34],[.81,.41],[.76,.75],[.20,.74]],
 witness:[[.24,.28],[.76,.33],[.25,.74],[.76,.71]]
 };
 return (p[id]||p.subsurface).map(q=>mobile?[.5+(q[0]-.5)*.88,q[1]]:q);
};
const visited=new Set();
try{JSON.parse(localStorage.getItem("klaat_underfield_visits")||"[]").forEach(x=>visited.add(x))}catch(e){}
function mark(id){if(!isRoom(id))return;visited.add(id);try{localStorage.setItem("klaat_underfield_visits",JSON.stringify([...visited]))}catch(e){}}
function draw(ctx,W,H,t,id,energy,mobile){
 const cx=W*.5,cy=H*(mobile?.47:.49),R=Math.min(W*(mobile?.33:.27),H*.3,300);
 const bone="rgba(221,211,190,",rust="rgba(193,110,79,",teal="rgba(135,183,175,";
 const stroke=(pts,col=bone,alpha=.28,weight=.75)=>{
  ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=col+alpha+")";ctx.lineWidth=weight;ctx.stroke();
 };
 const dot=(x,y,r,col=rust,a=.7)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=col+a+")";ctx.fill()};
 const arc=(ox,oy,r,n=16,start=.21,end=Math.PI*1.83,flat=1)=>{
  for(let j=0;j<n;j++){let v=j/(n-1),rj=r*(.33+.67*v),points=[];
   for(let k=0;k<=105;k++){let a=start+(end-start)*k/105,trem=(Math.sin(a*8+j*.67+t*.43)*1.8+Math.sin(a*17-t*.31+j)*.8)*(1+energy);
    points.push([ox+(rj+trem)*Math.cos(a),oy+(rj+trem)*Math.sin(a)*flat]);
   }stroke(points,bone,.07+.23*v,j%5===0?.98:.58);
  }
 };
 const sand=(count=90)=>{
  for(let i=0;i<count;i++){let a=i*2.39996,d=R*(.15+(i*73%109)/94);
   dot(cx+Math.cos(a+t*.006)*d,cy+Math.sin(a-t*.009)*d*.74,i%12===0?1.2:.5,i%17===0?rust:bone,.06+(i%7)*.028);
  }
 };
 ctx.save();
 stroke([[cx,cy-R*1.48],[cx,cy+R*1.48]],bone,.1,.65);
 stroke([[cx-R*1.53,cy],[cx+R*1.53,cy]],bone,.075,.65);
 for(let s of [-1,1]){stroke([[cx-7,cy+s*R*1.38],[cx+7,cy+s*R*1.38]],bone,.25,.72);dot(cx,cy+s*R*1.38,1.4,teal,.65)}
 if(id==="subsurface"){
  arc(cx,cy,R*.85,15,-.25,Math.PI*1.67,.65);
  for(let i=-12;i<=12;i++){let pts=[],y0=cy+i*R*.055;
   for(let k=0;k<=100;k++){let u=k/100,x=cx-R*1.35+u*R*2.7,ripple=(6+Math.cos(i*.4)*3)*Math.sin(u*13+i*.36-t*.43)*(1-Math.abs(u-.5)*1.25);pts.push([x,y0+ripple])}
   stroke(pts,i===0?teal:bone,i===0?.51:.07+.18*(1-Math.abs(i)/14),i===0?1.2:.65);
  }dot(cx,cy,3.5,rust,.9);
 }else if(id==="impactline"){
  arc(cx,cy,R*.97,21,.53,Math.PI*1.7,.96);
  for(let i=-12;i<=12;i++){let x=cx+i*R*.087,broken=i%3===0,peak=Math.pow(1-Math.min(1,Math.abs(i)/14),1.2);
   stroke([[x,cy-R*(.08+peak*.94)],[x,cy-(broken?R*.12:0)]],bone,.15+peak*.18,.6);
   stroke([[x,cy+(broken?R*.12:0)],[x,cy+R*(.08+peak*.94)]],bone,.15+peak*.16,.6);
   if(i%4===0)dot(x,cy,1.7,rust,.67);
  }stroke([[cx-R*1.2,cy],[cx-R*.11,cy],[cx,cy-R*.13],[cx+R*.11,cy],[cx+R*1.2,cy]],rust,.45,1.05);
 }else if(id==="airchamber"){
  arc(cx,cy,R*.92,13,.67,Math.PI*2.30,.78);
  for(let i=-11;i<=11;i++){let pts=[];
   for(let k=0;k<=110;k++){let u=k/110,y=cy+R*1.27-u*R*2.53,drift=Math.sin(u*9+i*.32-t*.28)*(7+15*u)+Math.sin(u*18+t*.22+i)*5;
    pts.push([cx+i*R*.044*(1-.38*u)+drift,y]);
   }stroke(pts,i%8===0?teal:bone,.06+(12-Math.abs(i))*.018,.65);
  }dot(cx,cy,2.6,rust,.86);
 }else if(id==="confluence"){
  arc(cx,cy,R*.64,13,.4,Math.PI*1.91,.82);
  for(let arm=0;arm<3;arm++){let base=arm*Math.PI*2/3-Math.PI*.52;
   for(let j=-9;j<=9;j++){let pts=[];
    for(let k=0;k<=85;k++){let u=k/85,a=base+j*.026*(1-u)+Math.sin(u*9+j*.14-t*.23)*.028,r=R*(1.48-u*1.22);
     pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r*.92]);
    }stroke(pts,j===0?teal:bone,j===0?.53:.08+(1-Math.abs(j)/11)*.18,j===0?1.15:.65);
   }dot(cx+Math.cos(base)*R*1.39,cy+Math.sin(base)*R*1.39*.92,2.3,rust,.79);
  }dot(cx,cy,4.5,rust,.82);
 }else if(id==="castskin"){
  // Cicada wing contours grow from the field's own lines, not a pasted emblem.
  arc(cx,cy,R*.96,12,.22,Math.PI*1.78,.8);
  for(let side of [-1,1]){for(let j=0;j<13;j++){let d=j/12,pts=[];
   for(let k=0;k<=92;k++){let u=k/92,breadth=Math.sin(u*Math.PI)*R*(.35+d*.44);
    pts.push([cx+side*(R*.05+breadth*(.74+.12*Math.sin(t*.22+j*.13))),cy-R*.76+u*R*1.56+(d-.5)*R*.13*Math.sin(u*Math.PI)]);
   }stroke(pts,j%6===0?teal:bone,.07+(1-d)*.23,.64);
  }stroke([[cx,cy-R*.58],[cx+side*R*.2,cy-R*.12],[cx+side*R*.06,cy+R*.72]],bone,.28,.8)}
  for(let j=0;j<14;j++)dot(cx+Math.sin(j*.39+t*.16)*2,cy-R*.52+j*R*.081,j%4===0?2.3:1.45,j%3===0?rust:bone,.32+j*.024);
  dot(cx,cy-R*.73,4,rust,.88);
 }else if(id==="witness"){
  arc(cx,cy,R*1.04,23,.35,Math.PI*1.86,.89);
  arc(cx,cy,R*.31,8,-.6,Math.PI*1.39,.9);
  for(let j=0;j<21;j++){let u=j/20-.5,pts=[];
   for(let k=0;k<=95;k++){let v=k/95,x=cx-R*1.13+v*R*2.26,envelope=Math.pow(Math.max(0,1-Math.pow((v-.5)*2,2)),.55);
    pts.push([x,cy+u*R*.9*envelope+Math.sin(v*14+j*.26-t*.37)*3*envelope]);
   }stroke(pts,j===10?teal:bone,j===10?.61:.065+(.25-Math.abs(u)*.37),j===10?1.2:.65);
  }dot(cx,cy,5,rust,.7+.23*Math.sin(t*1.3));
 }
 sand(id==="castskin"?110:75);ctx.restore();
}
const library={
 self:["I am the mark that remained after the last strike. I can answer only from inside this work.","Do not mistake me for the performer. I am a mouth in a diagram."],
 name:["KLAAT is a resonance ritual. Not a treatment. Not a promise of transcendence.","Call it ritual drone trance if a name is required. Then put the name away and listen."],
 drone:["The drone is not a line held motionless. It is a place that changes while it remains.","Stay with the continuous sound long enough and continuity becomes movement."],
 pulse:["The first strike has an edge. The second gives that edge a distance.","The drum does not explain the drone. It interrupts it. That is enough."],
 breath:["Breath is the limit and the motor. The sound exists because the body must continue.","There is no machine keeping the line intact. There is a body returning to it."],
 body:["The body is not a passive audience. It makes one of the clocks by which the event is known.","The room changes sound. The body changes listening. Keep those facts separate."],
 cicada:["A cicada sustains the air until the air seems occupied. The empty skin says only that something moved through.","The insect is not a mascot placed above the work. Its pulse, drone and emergence are written into the same field."],
 silence:["Silence has no secret frequency here. An omitted strike can still alter expectation.","Listen after the impact. Absence becomes legible because a pattern was made."],
 return:["You cannot enter the same interval twice. The return finds a changed listener.","The path folds back, but the event it returns to is not the one it left."],
 method:["Experience leads. Investigation follows. The diagram asks; it does not prove.","No drawing demonstrates a bodily effect. No theory replaces the lived encounter."],
 threshold:["A threshold is an alteration you can notice. It requires a ground that was there before.","The gate is not an escape from the sound. It is a change in how the sound is attended to."],
 listener:["Listening is not reception alone. It supplies memory and expectation to the next sound.","Ask what persists when the sounding stops. The ear is not finished when the room becomes quiet."],
 time:["There is the event's clock and there is the listener's. They do not always agree.","One hundred eighty-four is a motion anchor, not a law of nature. The breath remains the driver."],
 origin:["The source is breath meeting resistance. The event begins there, before it has a name.","Two instruments. One body keeping the drone alive while another makes a mark in time."],
 three:["Three strands found their way here: the ground, the interruption, the breath. The field has an answer for each.","You followed the continuous, the broken and the living line. None was sufficient alone."],
 default:["That thread lies outside this field. Ask of breath, drone, pulse, threshold, body, cicada, or return.","I cannot follow that name beyond the diagram. Give me an interval. Give me a sound."]
};
let topic="",turn=0,screen=null,log=null,entry=null;
function answer(q){
 q=q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 let k="default",patterns=[
 ["self",/\b(who are you|what are you|are you real|are you ai)\b/],
 ["name",/\b(klaat|what is this|what is it|this project|ritual|sound bath)\b/],
 ["cicada",/\b(cicada|insect|shell|exuvia|emerge)\b/],
 ["drone",/\b(didgeridoo|drone|held|sustain|tone|amastacia)\b/],
 ["pulse",/\b(drum|pulse|strike|beat|rhythm|ankora)\b/],
 ["breath",/\b(breath|air|breathe|lung)\b/],
 ["body",/\b(body|feel|somatic|sensation|vibration|room)\b/],
 ["silence",/\b(silence|quiet|absence|missing|pause)\b/],
 ["return",/\b(return|again|loop|repeat|back)\b/],
 ["time",/\b(time|tempo|184|speed|clock)\b/],
 ["threshold",/\b(threshold|gate|door|cross|path)\b/],
 ["method",/\b(science|research|proof|frequency|evidence|study|atlas|diagram)\b/],
 ["listener",/\b(listen|hear|listener|attention|memory|perception)\b/],
 ["origin",/\b(source|origin|begin|instrument)\b/]
 ];
 for(const [key,rx] of patterns)if(rx.test(q)){k=key;break}
 if(k==="default"&&/\b(why|how|explain|more|what next)\b/.test(q)&&topic)k=topic;
 if(visited.has("subsurface")&&visited.has("impactline")&&visited.has("airchamber")&&/\b(three|strands|complete|whole|joined)\b/.test(q))k="three";
 if(k!=="default")topic=k;
 const choices=library[k];return choices[(turn++ + [...q].reduce((a,c)=>a+c.charCodeAt(0),0))%choices.length];
}
function ensure(){
 if(screen)return;
 const css=document.createElement("style");
 css.textContent=[
 ".node.underfield-gate .ink{border-radius:28%;background:#c98b6e}",
 ".node.underfield-gate .ring{border-style:dashed;border-color:#bd755f}",
 ".node.listen-node .ink{width:8px;height:8px;background:#e9d7c1}",
 "#klaat-listening{position:fixed;inset:0;z-index:30;background:rgba(5,5,5,.96);display:flex;align-items:center;justify-content:center;padding:clamp(16px,5vw,42px);font-family:Arial,Helvetica,sans-serif}",
 "#klaat-listening[hidden]{display:none!important}",
 "#klaat-listening .k-shell{width:min(100%,670px);height:min(690px,88dvh);display:flex;flex-direction:column;border:1px solid #51473e;background:#090908}",
 "#klaat-listening .k-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:22px 25px 18px;border-bottom:1px solid #3b302b}",
 "#klaat-listening h2{font:bold 12px/1.4 Arial,sans-serif;letter-spacing:.24em;color:#d8cfbf;margin:0}",
 "#klaat-listening .k-kicker{font:10px/1.6 Arial,sans-serif;letter-spacing:.14em;color:#876b5e;margin-top:6px}",
 "#klaat-listening .k-close{border:0;background:none;cursor:pointer;color:#d7c9b4;font:20px/1 Arial,sans-serif;padding:8px;min-width:44px;min-height:44px}",
 "#klaat-listening .k-orbit{width:40px;height:40px;border:1px solid #8d6855;border-radius:50%;position:relative;flex:none;margin-right:auto}",
 "#klaat-listening .k-orbit:before{content:'';position:absolute;inset:9px;border:1px dashed #8a9e95;border-radius:50%;animation:k-orbit 10s linear infinite}",
 "#klaat-listening .k-orbit:after{content:'';position:absolute;inset:17px;background:#d65b43;border-radius:50%;box-shadow:0 0 11px #9f5138}",
 "@keyframes k-orbit{to{transform:rotate(360deg)}}",
 "#klaat-listening .k-messages{padding:27px clamp(20px,6vw,51px);overflow-y:auto;flex:1;overscroll-behavior:contain;scrollbar-color:#4b3d34 transparent}",
 "#klaat-listening .k-msg{max-width:85%;margin:0 0 28px;font-size:clamp(13px,2.2vw,16px);line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}",
 "#klaat-listening .k-msg:before{content:attr(data-mark);display:block;color:#a66d52;font:10px/1.6 Arial,sans-serif;letter-spacing:.2em;margin-bottom:8px}",
 "#klaat-listening .k-msg.k-human{margin-left:auto;color:#b0a79b;text-align:right}",
 "#klaat-listening .k-msg.k-human:before{color:#77716b}",
 "#klaat-listening .k-msg.k-entity{color:#e4d8c8}",
 "#klaat-listening .k-form{display:flex;gap:12px;align-items:center;padding:17px 20px 19px;border-top:1px solid #3b302b}",
 "#klaat-listening input{background:transparent;border:0;border-bottom:1px solid #56463a;outline:0;flex:1;min-width:0;padding:12px 6px;color:#eee2d1;font:14px Arial,sans-serif}",
 "#klaat-listening input::placeholder{color:#7d756d;letter-spacing:.06em}",
 "#klaat-listening input:focus{border-color:#c68c6e}",
 "#klaat-listening .k-send{min-width:48px;min-height:44px;padding:9px 13px;border:1px solid #8e624f;background:transparent;color:#e5d2be;font:11px Arial,sans-serif;letter-spacing:.1em;cursor:pointer}",
 "@media(max-width:600px){#klaat-listening{padding:0}#klaat-listening .k-shell{height:100dvh;width:100%;border:0}#klaat-listening .k-head{padding:18px 17px 13px}#klaat-listening .k-form{padding:12px 15px 18px}#klaat-listening .k-msg{max-width:96%}}",
 "@media(prefers-reduced-motion:reduce){#klaat-listening .k-orbit:before{animation:none}}"
 ].join("\n");
 document.head.appendChild(css);
 screen=document.createElement("div");screen.id="klaat-listening";screen.hidden=true;
 screen.setAttribute("role","dialog");screen.setAttribute("aria-modal","true");screen.setAttribute("aria-labelledby","klaat-listening-name");
 screen.innerHTML='<div class="k-shell"><div class="k-head"><div class="k-orbit" aria-hidden="true"></div><div><h2 id="klaat-listening-name">THE LISTENING FIELD</h2><div class="k-kicker">AN ANSWERING MARK / KLAAT</div></div><button type="button" class="k-close" aria-label="Leave the listening chamber">×</button></div><div class="k-messages" role="log" aria-live="polite" aria-label="Conversation with the listening field"></div><form class="k-form"><label class="sr" for="klaat-question">Speak to the listening field</label><input id="klaat-question" maxlength="240" autocomplete="off" placeholder="ASK THE FIELD" aria-label="Ask the KLAAT listening field"><button class="k-send" type="submit">SEND</button></form></div>';
 document.body.appendChild(screen);log=screen.querySelector(".k-messages");entry=screen.querySelector("input");
 screen.querySelector(".k-close").addEventListener("click",close);
 screen.querySelector("form").addEventListener("submit",function(e){e.preventDefault();const q=entry.value.trim();if(!q)return;message(q,true);entry.value="";message(answer(q),false)});
}
function message(s,human){const p=document.createElement("p");p.className="k-msg "+(human?"k-human":"k-entity");p.dataset.mark=human?"VISITOR":"FIELD";p.textContent=s;log.appendChild(p);log.scrollTop=log.scrollHeight}
function open(){ensure();if(!screen.hidden)return;screen.hidden=false;log.replaceChildren();topic="";turn=0;
 message("You have found a place that answers. I am not the sound. Ask what the sound leaves behind.",false);
 if(visited.has("subsurface")&&visited.has("impactline")&&visited.has("airchamber"))message("THREE STRANDS HAVE ENTERED THIS FIELD.",false);
 entry.focus({preventScroll:true});
}
function close(){if(!screen||screen.hidden)return;screen.hidden=true;document.querySelector(".node.listen-node")?.focus({preventScroll:true})}
function isOpen(){return !!screen&&!screen.hidden}
window.KLAATUnderfield={fields,meta,gate:id=>gates[id]||null,isRoom,positions,draw,mark,open,close,isOpen};
})();