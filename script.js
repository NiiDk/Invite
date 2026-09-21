const state={date:"",time:"",food:"",location:""};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function showStep(step){
  $$(".step").forEach(el=>el.classList.remove("active"));
  document.querySelector(`.step[data-step="${step}"]`)?.classList.add("active");
}

function confetti(){
  const layer=$("#confetti");
  const bits=["💘","✨","🌹","❤️","🥳","💕"];
  for(let i=0;i<34;i++){
    const s=document.createElement("span");
    s.className="piece";
    s.textContent=bits[Math.floor(Math.random()*bits.length)];
    s.style.left=Math.random()*100+"%";
    s.style.fontSize=(14+Math.random()*18)+"px";
    s.style.animationDelay=(Math.random()*.7)+"s";
    layer.appendChild(s);
  }
  setTimeout(()=>layer.innerHTML="",3500);
}

const noTexts=[
  "NO 🙈",
  "Nice try 😂",
  "Not that one 😌",
  "Catch me first 😜",
  "Still no? 👀",
  "Just press YES 😂"
];

let dodgeCount=0;

function dodgeNo(){
  const area=$("#decisionArea");
  const no=$("#noBtn");

  const maxX=Math.max(0,area.clientWidth-no.offsetWidth);
  const maxY=Math.max(0,area.clientHeight-no.offsetHeight);

  no.style.left=(Math.random()*maxX)+"px";
  no.style.top=(Math.random()*maxY)+"px";
  no.style.right="auto";

  dodgeCount++;
  no.textContent=noTexts[dodgeCount%noTexts.length];

  const tease=$("#tease");
  if(dodgeCount===2) tease.textContent="Sandy... just press YES 😂";
  if(dodgeCount===4) tease.textContent="You really want that NO button? 😭";
  if(dodgeCount>=6) tease.textContent="Okay, I think the button has chosen for you 😌💘";
}

["mouseenter","pointerenter","touchstart","click"].forEach(evt=>{
  $("#noBtn").addEventListener(evt,e=>{
    e.preventDefault();
    dodgeNo();
  },{passive:false});
});

$("#decisionArea").addEventListener("pointermove",e=>{
  const no=$("#noBtn");
  const r=no.getBoundingClientRect();
  const dx=Math.max(r.left-e.clientX,0,e.clientX-r.right);
  const dy=Math.max(r.top-e.clientY,0,e.clientY-r.bottom);
  if(Math.hypot(dx,dy)<70)dodgeNo();
});

$("#yesBtn").addEventListener("click",()=>{
  confetti();
  showStep(2);
});

$$("[data-next]").forEach(b=>b.addEventListener("click",()=>showStep(b.dataset.next)));

const now=new Date();
$("#dateInput").min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

$("#dateNext").addEventListener("click",()=>{
  state.date=$("#dateInput").value;
  state.time=$("#timeInput").value;
  if(state.date)showStep(4);
});

function setupChoice(grid,key){
  $(grid).addEventListener("click",e=>{
    const btn=e.target.closest(".choice");
    if(!btn)return;
    $(grid).querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    state[key]=btn.dataset.value;
  });
}

setupChoice("#foodGrid","food");
setupChoice("#locationGrid","location");

$("#foodNext").addEventListener("click",()=>{
  if(state.food)showStep(5);
});

$("#customLocation").addEventListener("input",e=>{
  const v=e.target.value.trim();
  if(v){
    $("#locationGrid").querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));
    state.location=v;
  }
});

$("#locationNext").addEventListener("click",()=>{
  const custom=$("#customLocation").value.trim();
  if(custom)state.location=custom;
  if(!state.location)return;

  $("#summaryDate").textContent=`📅 ${state.date}`;
  $("#summaryTime").textContent=`🕒 ${state.time||"Any time"}`;
  $("#summaryFood").textContent=`🍽️ ${state.food}`;
  $("#summaryLocation").textContent=`📍 ${state.location}`;

  confetti();
  showStep(6);
});

$("#sendWhatsapp").addEventListener("click",()=>{
  const message=`Hey Samuel 💘

I said YES 😌

📅 ${state.date}
🕒 ${state.time||"Any time"}
🍽️ ${state.food}
📍 ${state.location}`;

  location.href=`https://wa.me/233542232515?text=${encodeURIComponent(message)}`;
});
