const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window&&!reducedMotion){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
const descriptions=['보이는 증상과 실제 막힌 위치는 다를 수 있습니다.','원인과 범위에 맞는 방법을 설명한 뒤 작업합니다.','작업 후에는 해당 증상에 맞춰 배수 상태를 확인합니다.'];
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
  const step=Number(button.dataset.step);
  document.querySelectorAll('[data-step]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  document.querySelector('.diagnosis-card').dataset.stage=String(step);
  document.querySelector('#step-copy').textContent=descriptions[step];
}));
