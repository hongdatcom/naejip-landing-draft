const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window&&!reducedMotion){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}},{threshold:.08});
  document.querySelectorAll('.reveal:not(.standard-card)').forEach(el=>observer.observe(el));
  const standardObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');standardObserver.unobserve(entry.target)}},{threshold:.22});
  document.querySelectorAll('.standard-card').forEach((el,index)=>{el.style.setProperty('--reveal-delay',`${index*120}ms`);standardObserver.observe(el)});
}
const descriptions=['보이는 증상과 실제 막힌 위치는 다를 수 있습니다.','원인과 범위에 맞는 방법을 설명한 뒤 작업합니다.','작업 후에는 해당 증상에 맞춰 배수 상태를 확인합니다.'];
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
  const step=Number(button.dataset.step);
  document.querySelectorAll('[data-step]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  document.querySelector('.diagnosis-card').dataset.stage=String(step);
  document.querySelector('#step-copy').textContent=descriptions[step];
}));

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
