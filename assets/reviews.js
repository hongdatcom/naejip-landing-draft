(() => {
  const root=document.querySelector('.reviews-carousel');if(!root)return;
  // Transcribed excerpts from the customer-supplied screenshots, captured 2026-11-13.
  // Never complete cropped sentences or infer review dates from relative dates.
  const reviews=[
    {name:'2사*',rating:'4.5',topic:'변기 역류 · 작업 전 안내',text:'물을 내리면 변기 물이 위로 차오르며 꿀렁 꿀렁 소리나서 급하게 하수구업체 찾았습니다. 먼저 상태 확인하시고 어떤 작업을 할지, 비용은 얼마인지 먼저 알려주셨어요. 변기 뜯고 할 정도는 아니라고 하셔서 안심했어요. 마무리까지 깔끔하게 해주셔서 만족합니다!'},
    {name:'쪼*',rating:'5.0',topic:'욕실 배수 · 마무리 확인',text:'화장실 배수구에 물이 고여서 한참 기다려야 했어요. 배수구 안쪽을 확인하고 어디에서 물이 막히는지 설명해 주셨고, 끝나고는 샤워기를 틀어서 물 빠지는 걸 같이 봤습니다. 평소에 배수구를 어떻게 관리하면 되는지도 알려주셔서 좋았어요.'},
    {name:'당근쥬*',rating:'5.0',topic:'베란다 역류 · 원인 설명',text:'갑자기 베란다 역류해서 급하게 요청드렸는데 빨리오셔서 해결해주셨어요. 원인도 친절하게 설명해주시고 주변에 추천하려구요.'},
    {name:'umunu***',rating:'5.0',topic:'하수구 막힘 · 과정 설명',text:'화장실 하수구가 갑자기 막히는듯 물이 잘 안 빠져서 직접 해결해보려다 도저히 안 될거같아서 급하게 연락드렸는데, 방문해서 원인부터 꼼꼼하게 확인해주셨어요. 막힌 부분도 빠르게 해결해주시고 작업 과정도 친절하게 설명해주셔서 믿음이 갔습니다.'},
    {name:'야호이*',rating:'5.0',topic:'식당 배수 · 현장 점검',text:'손님이 몰리는 시간에 설거지를 계속하면 주방 배수구가 역류해서 바닥 물을 닦느라 바빴어요. 언제 물이 올라오는지 먼저 물어봐 주시고 배관을 확인한 다음 원인을 설명해 주셨습니다. …'},
    {name:'ho***',rating:'5.0',topic:'주방 역류 · 비용 설명',text:'마감하고 주방 바닥을 청소할 때마다 배수구에서 물이 도로 올라왔어요. 내시경으로 확인한 부분을 보여주시고, 어디까지 작업해야 하는지와 비용을 먼저 설명해 주셨습니다. …'},
    {name:'우*',rating:'5.0',topic:'변기 막힘 · 신속한 방문',text:'변기가 갑자기 아무리 해도 내려가지 않아서 정말 당황했는데, 급하게 요청드렸음에도 불구하고 정말 빠르게 와주셔서 너무 감사했습니다! …'},
    {name:'땡땡*',rating:'5.0',topic:'하수구 막힘 · 꼼꼼한 작업',text:'집 화장실 하수구가 갑자기 막혀서 급하게 연락드렸는데, 상담부터 친절하게 응대해주시고 막힌 원인도 친절하게 설명해주시고 작업 과정도 이해하기 쉽게 설명해주셨어요!! …'},
    {name:'킹*',rating:'5.0',topic:'세면대 막힘',text:'세면대 셀프로 아무리 뚫어도 안내려가던거 시원하게 뚫어주셨어요 감사합니다~!!'},
    {name:'봄*',rating:'5.0',topic:'화장실 냄새 · 원인 확인',text:'쉬는 날인데도 바로 오셔서 화장실 냄새 원인을 찾아주시고, 해결해주신것도 감사한데..서비스로 이것저것 다 해주셨어요. …'},
    {name:'kkg**',rating:'5.0',topic:'반복 막힘 · 작업 전 설명',text:'어머니댁에 변기가 좀 시원찮았는데 뚫어뻥 쓰고 괜찮아진 줄 알았더니 또 막혔다고해서 급하게 업체 알아봤습니다. 제가 먼곳에 있어서 저한테도 전화로 상태 보고 왜 반복되는지 설명해 주시고 가격도 작업 전에 알려주셨어요. …'},
    {name:'송어달**',rating:'5.0',topic:'욕실 배수 · 원인 설명',text:'샤워 한 번 하면 바닥에 물이 한참 남아 있었거든요. 배수구 안쪽을 보고 어디가 막혔는지 쉽게 설명해 주셨어요. …'}
  ];
  const track=root.querySelector('.reviews-track'),windowEl=root.querySelector('.reviews-window');
  const count=root.querySelector('.reviews-count'),pause=root.querySelector('.reviews-pause');
  const mobile=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let index=0,total=0,timer,paused=reduced.matches,inView=false,hovered=false,focused=false,resetTimer,startX;
  const card=r=>{const article=document.createElement('article');article.className='review-card';article.innerHTML='<div class="review-card-top"><div class="review-customer"><span class="review-avatar" aria-hidden="true">“</span><span></span></div><span class="review-rating"></span></div><blockquote></blockquote><div class="review-card-bottom"><span class="review-topic"></span><span class="review-source-label">당근 후기 발췌</span></div>';article.querySelector('.review-customer>span:last-child').textContent=r.name+'님의 후기';article.querySelector('.review-rating').textContent='★ '+r.rating;article.querySelector('blockquote').textContent=r.text;article.querySelector('.review-topic').textContent=r.topic;return article};
  const sync=()=>{count.textContent=String(index+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');[...track.children].forEach((p,i)=>{p.setAttribute('aria-hidden',String(i!==index));p.inert=i!==index});pause.textContent=paused?'자동 넘김 재생':'자동 넘김 멈춤';pause.setAttribute('aria-pressed',String(paused))};
  const schedule=()=>{clearTimeout(timer);if(!paused&&!reduced.matches&&inView&&!document.hidden&&!hovered&&!focused)timer=setTimeout(()=>go(index+1),6500)};
  function go(target){clearTimeout(resetTimer);const looping=target>=total;index=(target+total)%total;sync();track.style.transition=reduced.matches?'none':'';track.style.transform='translateX(-'+(looping?total:index)*100+'%)';if(looping&&!reduced.matches){resetTimer=setTimeout(()=>{track.style.transition='none';track.style.transform='translateX(0)'},780)}schedule()}
  function build(){clearTimeout(resetTimer);track.replaceChildren();const size=mobile.matches?1:4;for(let i=0;i<reviews.length;i+=size){const page=document.createElement('div');page.className='reviews-page';page.setAttribute('role','group');page.setAttribute('aria-label',(Math.floor(i/size)+1)+'번째 후기 묶음');reviews.slice(i,i+size).forEach(r=>page.append(card(r)));track.append(page)}total=track.children.length;const clone=track.firstElementChild.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;track.append(clone);index=0;track.style.transition='none';track.style.transform='translateX(0)';sync();schedule()}
  root.querySelector('[data-review-prev]').onclick=()=>go(index-1);root.querySelector('[data-review-next]').onclick=()=>go(index+1);pause.onclick=()=>{paused=!paused;sync();schedule()};
  root.addEventListener('mouseenter',()=>{hovered=true;schedule()});root.addEventListener('mouseleave',()=>{hovered=false;schedule()});root.addEventListener('focusin',()=>{focused=true;schedule()});root.addEventListener('focusout',()=>setTimeout(()=>{focused=root.contains(document.activeElement);schedule()},0));
  windowEl.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;clearTimeout(timer)},{passive:true});windowEl.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>45)go(index+(d<0?1:-1));else schedule()},{passive:true});
  root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1))}});
  document.addEventListener('visibilitychange',schedule);mobile.addEventListener('change',build);reduced.addEventListener('change',()=>{paused=reduced.matches;sync();schedule()});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(root);else inView=true;
  build();
})();
