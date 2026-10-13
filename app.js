const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window&&!reducedMotion){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}},{threshold:.08});
  document.querySelectorAll('.reveal:not(.standard-card)').forEach(el=>observer.observe(el));
  const standardObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');standardObserver.unobserve(entry.target)}},{threshold:.22});
  document.querySelectorAll('.standard-card').forEach((el,index)=>{el.style.setProperty('--reveal-delay',`${index*120}ms`);standardObserver.observe(el)});
}
const descriptions=['보이는 증상과 실제 막힌 위치는 다를 수 있습니다.','원인과 범위에 맞는 방법을 설명한 뒤 작업합니다.','작업 후에는 해당 증상에 맞춰 배수 상태를 확인합니다.'];
const diagnosisCard=document.querySelector('.diagnosis-card');
if(diagnosisCard){
  const stageButtons=[...diagnosisCard.querySelectorAll('[data-step]')];
  const stagePhoto=document.querySelector('.work-photo img');
  const photoSources=['assets/work.jpg','assets/stage-2-v5.jpg','assets/stage-3-v5.jpg'];
  const photoAlts=['내집배관솔루션 작업자가 천장 배관을 점검하는 모습','필요한 작업에 사용하는 고압세척·샤프트·내시경 장비','작업 후 배관 내부 상태를 확인하는 내시경 화면'];
  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let stage=0,timer=null,inView=false,hovered=false;
  const stop=()=>{clearTimeout(timer);timer=null};
  const canPlay=()=>!motionPreference.matches&&!document.hidden&&inView&&!hovered&&!diagnosisCard.contains(document.activeElement);
  const schedule=()=>{stop();if(canPlay())timer=setTimeout(()=>{setStage((stage+1)%3);schedule()},6500)};
  const setStage=step=>{
    stage=step;diagnosisCard.dataset.stage=String(step);
    stageButtons.forEach((b,i)=>{b.classList.toggle('active',i===step);b.setAttribute('aria-pressed',String(i===step))});
    diagnosisCard.querySelector('#step-copy').textContent=descriptions[step];
    stagePhoto.src=photoSources[step];stagePhoto.alt=photoAlts[step];
    stagePhoto.closest('.work-photo').dataset.stage=String(step);
  };
  // Warm the two replacement photos without changing the initial field photo.
  photoSources.slice(1).forEach(src=>{const img=new Image();img.src=src;img.decode().catch(()=>{})});
  stageButtons.forEach(button=>button.addEventListener('click',()=>{stop();setStage(Number(button.dataset.step));schedule()}));
  diagnosisCard.addEventListener('mouseenter',()=>{hovered=true;stop()});
  diagnosisCard.addEventListener('mouseleave',()=>{hovered=false;schedule()});
  diagnosisCard.addEventListener('focusin',stop);
  diagnosisCard.addEventListener('focusout',()=>setTimeout(schedule,0));
  document.addEventListener('visibilitychange',schedule);
  motionPreference.addEventListener('change',schedule);
  if('IntersectionObserver' in window){const stageObserver=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule()},{threshold:.25});stageObserver.observe(diagnosisCard)}
}

const caseTrack=document.querySelector('.case-track');
if(caseTrack){
  const slides=[...caseTrack.querySelectorAll('.case-slide')];
  const dots=[...document.querySelectorAll('[data-case-go]')];
  const prev=document.querySelector('[data-case-prev]');
  const next=document.querySelector('[data-case-next]');
  let current=0,frame=0;
  const position=slide=>slide.getBoundingClientRect().left-caseTrack.getBoundingClientRect().left+caseTrack.scrollLeft;
  const sync=()=>{
    current=slides.reduce((best,slide,index)=>Math.abs(position(slide)-caseTrack.scrollLeft)<Math.abs(position(slides[best])-caseTrack.scrollLeft)?index:best,0);
    prev.disabled=current===0;next.disabled=current===slides.length-1;
    dots.forEach((dot,index)=>dot.setAttribute('aria-current',String(index===current)));
    document.querySelector('.case-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  };
  const go=index=>caseTrack.scrollTo({left:position(slides[Math.max(0,Math.min(index,slides.length-1))]),behavior:reducedMotion?'instant':'smooth'});
  prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
  dots.forEach(dot=>dot.addEventListener('click',()=>go(Number(dot.dataset.caseGo))));
  caseTrack.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)},{passive:true});
  caseTrack.addEventListener('keydown',event=>{if(event.target!==caseTrack)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1))}});
  window.addEventListener('resize',()=>{go(current);sync()});sync();
}
