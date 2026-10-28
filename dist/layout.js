// Keep the desktop sidebar within the remaining visible viewport as page headers scroll away.
export function sidebarAvailableHeight(viewportHeight,paneTop,stickyTop=18,bottomGutter=18){
 return Math.max(120,viewportHeight-Math.max(stickyTop,paneTop)-bottomGutter);
}
export function mountSidebarLayout(sidebar){
 let pending=false;
 const fit=()=>{pending=false;if(window.innerWidth<=720){sidebar.style.maxHeight='';return;}sidebar.style.maxHeight=sidebarAvailableHeight(window.innerHeight,sidebar.getBoundingClientRect().top)+'px';};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit);}};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 schedule();return schedule;
}
