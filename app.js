async function loadTeam(){
  try{
    const res = await fetch("/api/team");
    const data = await res.json();
    data.forEach((m,i)=>{
      const name=document.getElementById(`name-${i}`);
      const role=document.getElementById(`role-${i}`);
      const avatar=document.getElementById(`avatar-${i}`);
      if(name) name.textContent=m.name;
      if(role) role.textContent=m.role;
      if(avatar){
        if(m.image){
          avatar.innerHTML=`<img src="${escapeHtml(m.image)}" alt="">`;
        }else{
          avatar.textContent=(m.name||"?").charAt(0).toUpperCase();
        }
      }
    });
  }catch(e){
    console.error("Could not load team:",e);
  }
}
function escapeHtml(v){
  return String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}
loadTeam();
