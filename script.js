const KEY='src_v1';
const DEF={students:[{name:'Atharva',prn:'2307012345',roll:'45',dob:'2004-04-12',cls:'SYBCA',sem:'IV',sec:'A',year:'2023-24',date:'2024-05-24',cgpa:'8.20',photo:'',remark:'',subs:[['Mathematics',80],['Science',70],['English',90],['Computer',75],['Subject 5',85]]}],
settings:{year:'2023-24',inst:'Student Report Card System',max:100,pass:40,theme:'light',sig:['R. Patil|Class Teacher|Mr. R. Patil','S. Kulkarni|HOD|Dr. S. Kulkarni','P. Joshi|Principal|Dr. P. Joshi']}};
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!S||!S.students)S=JSON.parse(JSON.stringify(DEF));
let view='dash',cur=S.students[0]?S.students[0].prn:null,editing=null,rq='';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>{if(!d)return'';const p=d.split('-');return p.length==3?p[2]+'/'+p[1]+'/'+p[0]:d};
const gradeOf=p=>p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=40?'D':'F';
const AV_OLD='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="136" height="168" viewBox="0 0 136 168"><rect width="136" height="168" fill="#7fb0e6"/><path d="M4 168C8 136 34 124 68 122C102 124 128 136 132 168Z" fill="#fff" stroke="#dfe6f0"/><path d="M54 100h28v26c-8 8-20 8-28 0z" fill="#dca47c"/><path d="M52 120L68 146L58 152L44 128zM84 120L68 146L78 152L92 128z" fill="#eef2f7" stroke="#d5dce6"/><path d="M63 140h10l3 28H60z" fill="#17306b"/><rect x="62" y="137" width="12" height="8" rx="2" fill="#17306b"/><circle cx="40" cy="70" r="6" fill="#dca47c"/><circle cx="96" cy="70" r="6" fill="#dca47c"/><ellipse cx="68" cy="68" rx="28" ry="34" fill="#efbd96"/><path d="M38 64C33 36 52 25 70 27C90 27 103 40 98 64C94 52 88 46 70 46C54 46 44 52 38 64z" fill="#1b1b1f"/><ellipse cx="57" cy="70" rx="3" ry="2.6" fill="#222"/><ellipse cx="79" cy="70" rx="3" ry="2.6" fill="#222"/><path d="M51 62q6-4 12 0M73 62q6-4 12 0" stroke="#1b1b1f" stroke-width="2" fill="none"/><path d="M68 73q-4 8 0 10" stroke="#c28860" stroke-width="1.5" fill="none"/><path d="M55 86Q68 101 81 86Z" fill="#fff" stroke="#a85a46" stroke-width="1.5"/></svg>');
const AV='img/student.jpg';
const SG=(c,d)=>`<svg viewBox="0 0 150 60" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const SIGS=[SG('#222','<path d="M8 38C20 20 40 14 52 26C44 36 30 42 36 30C46 12 70 22 62 34C56 42 48 34 60 30C74 26 86 30 96 24L130 18"/><path d="M14 36C40 46 78 42 122 36"/><path d="M70 20C76 10 84 14 80 24"/>'),SG('#3342b5','<path d="M10 42C22 38 28 20 32 12C34 26 30 38 40 36C48 34 46 20 52 18C54 30 56 38 66 34C76 30 74 18 80 24C84 30 90 28 100 22L108 12C112 20 108 30 112 36"/><path d="M4 46C40 44 100 38 144 28"/>'),SG('#2f45b8','<path d="M10 38C16 26 24 30 22 38C20 46 30 42 34 32C38 24 44 28 42 38C52 30 56 18 60 12C72 2 84 8 78 18C74 24 66 18 70 12"/><path d="M58 14C56 26 54 38 62 40C70 36 74 26 80 30C86 34 82 42 92 34"/><path d="M20 54C60 48 110 32 146 12"/>')];
function calc(s){const mx=+S.settings.max,t=s.subs.reduce((a,x)=>a+ +x[1],0),M=mx*s.subs.length,p=M?t/M*100:0;
const ok=s.subs.every(x=>x[1]/mx*100>=S.settings.pass);return{t,M,p,g:gradeOf(p),res:ok?'PASS':'FAIL',sgpa:(p/10).toFixed(2)}}
function remark(s,c){if(s.remark)return s.remark;return c.p>=80?'Excellent performance! Keep it up and continue to maintain the quality.':c.p>=60?'Good effort. Consistent practice will lift your results further.':c.p>=40?'Needs improvement. Focus on weaker subjects and seek guidance.':'Unsatisfactory. Immediate attention and extra support are required.'}
function toast(t){const e=$('toast');e.textContent=t;e.className='s';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2200)}
const find=p=>S.students.find(s=>s.prn===String(p).trim());
const NAV=[['dash','🏠','Dashboard'],['add','👤','Add Student'],['rec','👥','Student Records'],['srch','🔍','Search Student'],['rep','📄','All Reports'],['set','⚙️','Settings']];
function go(v,x){view=v;if(v==='add')editing=x||null;if(v==='dash'&&x)cur=x;render();scrollTo(0,0)}
function hs(){const v=$('q').value.trim();if(!v)return toast('Enter a PRN number');const s=find(v);if(s){cur=s.prn;go('dash');toast('Student found: '+s.name)}else toast('No student found with PRN '+v)}
function pr(){if(!cur||!find(cur))return toast('No student selected');if(view!=='dash')go('dash');setTimeout(()=>window.print(),150)}
function logout(){$('login').style.display='flex'}
function login(){if($('lu').value==='admin'&&$('lp').value==='admin123'){$('login').style.display='none';toast('Welcome back, admin')}else toast('Invalid credentials')}
function render(){
const st=S.settings;$('yr').textContent='Academic Year '+st.year;$('ft').textContent='© 2024 '+st.inst+' | All Rights Reserved';
document.documentElement.dataset.theme=st.theme==='dark'?'dark':'light';
$('nav').innerHTML=NAV.map(n=>`<a class="${view===n[0]?'on':''}" onclick="go('${n[0]}')">${n[1]} ${n[2]}</a>`).join('')+`<div class="about"><b>About System</b>This system helps to manage student records, calculate marks, grades and CGPA automatically and generate report cards. 🎓</div>`;
$('m').innerHTML=({dash:vDash,add:vAdd,rec:vRec,srch:vSrch,rep:vRep,set:vSet})[view]();
}
const COL=['#3b82e0','#22b455','#9b59d0','#ff9a1f','#ef4a4a','#14b8a6','#e11d74','#7c8a3a'];
function chart(s){const n=s.subs.length,W=560,H=270,L=40,B=40,T=24,pw=W-L-10,ph=H-B-T,bw=Math.min(54,pw/n*.55);
let o=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" font-family="Inter,sans-serif" font-size="11">`;
[0,25,50,75,100].forEach(v=>{const y=T+ph-ph*v/100;o+=`<line x1="${L}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#8884" stroke-dasharray="3 3"/><text x="${L-8}" y="${y+4}" text-anchor="end" fill="#888">${v}</text>`});
s.subs.forEach((x,i)=>{const pc=Math.min(100,x[1]/S.settings.max*100),h=ph*pc/100,cx=L+pw/n*(i+.5),y=T+ph-h;
o+=`<rect x="${cx-bw/2}" y="${y}" width="${bw}" height="${h}" fill="${COL[i%8]}" rx="2"><title>${esc(x[0])}: ${x[1]}</title></rect><text x="${cx}" y="${y-6}" text-anchor="middle" font-weight="600" fill="currentColor">${x[1]}</text><text x="${cx}" y="${H-20}" text-anchor="middle" fill="currentColor">${esc(x[0]).slice(0,12)}</text>`});
return o+`</svg><div style="text-align:center;font-size:12px"><span style="color:#3b82e0">■</span> Marks Obtained</div>`}
function vDash(){const s=find(cur);if(!s)return`<div class="card empty">No student selected.<br><br><button class="btn g" onclick="go('add')">＋ Add Student</button></div>`;
const c=calc(s),st=S.settings;
const rows=s.subs.map(x=>{const p=x[1]/st.max*100;return`<tr><td>${esc(x[0])}</td><td>${st.max}</td><td>${x[1]}</td><td>${p.toFixed(2)}%</td><td>${gradeOf(p)}</td></tr>`}).join('');
const sg=st.sig.map((z,i)=>{const p=z.split('|');return`<div><div class="sg"><img src="img/sign${(i%3)+1}.png" alt="Signature"></div><div>${esc(p[1])}</div><small>${esc(p[2])}</small></div>`}).join('');
return`<div class="grid"><div class="card"><h3>Student Information</h3><div class="info"><img src="${s.photo||AV}" alt="Student photo"><div class="kv2"><div class="kv"><i>Student Name</i><span>${esc(s.name)}</span><i>PRN Number</i><span>${esc(s.prn)}</span><i>Class</i><span>${esc(s.cls)}</span><i>Semester</i><span>${esc(s.sem)}</span><i>Section</i><span>${esc(s.sec)}</span></div><div class="kv"><i>Roll Number</i><span>${esc(s.roll)}</span><i>Date of Birth</i><span>${fmt(s.dob)}</span><i>Academic Year</i><span>${esc(s.year)}</span><i>Date</i><span>${fmt(s.date)}</span></div></div></div></div>
<div class="card"><h3>Performance Overview</h3><div class="tiles"><div class="tile t1"><small>📖 Total Marks</small><b>${c.t} / ${c.M}</b></div><div class="tile t2"><small>📗 Percentage</small><b>${c.p.toFixed(2)}%</b></div><div class="tile t3"><small>📘 Grade</small><b>${c.g}</b></div><div class="tile t4"><small>📙 Result</small><b style="color:${c.res==='PASS'?'#e08a00':'#c3231e'}">${c.res}</b></div></div>
<div class="remark"><div><b>Teacher’s Remark</b>${esc(remark(s,c))}</div><span style="font-size:28px">${c.p>=60?'👍':'📝'}</span></div></div></div>
<div class="grid"><div class="card"><h3>Subject Wise Marks</h3><div class="scroll"><table><thead><tr><th>Subject</th><th>Maximum Marks</th><th>Marks Obtained</th><th>Percentage</th><th>Grade</th></tr></thead><tbody>${rows}<tr class="tot"><td>Total</td><td>${c.M}</td><td>${c.t}</td><td>${c.p.toFixed(2)}%</td><td>${c.g}</td></tr></tbody></table></div></div>
<div class="card"><h3>Performance Chart</h3>${chart(s)}</div></div>
<div class="grid"><div class="card"><h3 class="bl">CGPA &amp; Grade Scale</h3><div class="scale"><div class="box"><b>CGPA Scale</b>${[['9.00 - 10.00','O (Outstanding)'],['8.00 - 8.99','A+ (Excellent)'],['7.00 - 7.99','A (Very Good)'],['6.00 - 6.99','B+ (Good)'],['5.00 - 5.99','B (Above Average)'],['4.00 - 4.99','C (Average)'],['Below 4.00','F (Fail)']].map(r=>`<div><span>${r[0]}</span><span>:</span><span>${r[1]}</span></div>`).join('')}</div>
<div class="box"><b>Student Result</b><div><span>SGPA (Semester)</span><span>:</span><span>${c.sgpa}</span></div><div><span>CGPA (Cumulative)</span><span>:</span><span>${esc(s.cgpa||'—')}</span></div><div><span>Grade</span><span>:</span><span>${c.g}</span></div><div><span>Result</span><span>:</span><b style="color:${c.res==='PASS'?'#1f9d55':'#c3231e'}">${c.res}</b></div></div></div></div>
<div class="card"><h3>Authorized Signatures</h3><div class="sigs">${sg}</div><div class="dt">Date: ${fmt(s.date)}</div></div></div>`}
function vAdd(){const e=editing?find(editing):null,st=S.settings,s=e||{name:'',prn:'',roll:'',dob:'',cls:'',sem:'',sec:'',year:st.year,date:new Date().toISOString().slice(0,10),cgpa:'',remark:'',photo:'',subs:[['',''],['',''],['',''],['',''],['','']]};
const I=(id,l,v,t='text',x='')=>`<label>${l}<input id="f_${id}" type="${t}" value="${esc(v)}" ${x}></label>`;
return`<div class="card"><h3>${e?'Edit Student':'Add Student'}</h3><div class="f">${I('name','Student Name *',s.name)}${I('prn','PRN Number *',s.prn,'text',e?'readonly':'')}${I('roll','Roll Number',s.roll)}${I('dob','Date of Birth',s.dob,'date')}${I('cls','Class (e.g. SYBCA)',s.cls)}${I('sem','Semester',s.sem)}${I('sec','Section',s.sec)}${I('year','Academic Year',s.year)}${I('date','Report Date',s.date,'date')}${I('cgpa','CGPA (Cumulative)',s.cgpa,'number','step="0.01" min="0" max="10"')}
<label>Photo<input id="f_photo" type="file" accept="image/*" onchange="ph(this)"></label><label style="grid-column:1/-1">Teacher’s Remark (optional — auto if blank)<textarea id="f_remark" rows="2">${esc(s.remark)}</textarea></label></div>
<h3 style="margin-top:18px">Subjects &amp; Marks (out of ${st.max})</h3>${s.subs.map((x,i)=>`<div class="sub"><input id="sn${i}" placeholder="Subject ${i+1} name" value="${esc(x[0])}"><input id="sm${i}" type="number" min="0" max="${st.max}" placeholder="Marks" value="${esc(x[1])}"></div>`).join('')}
<div style="display:flex;gap:10px;margin-top:14px"><button class="btn g" onclick="saveS()">${e?'Update':'Save'} Student</button><button class="btn o" onclick="go('rec')">Cancel</button></div></div>`}
let photoData=null;
function ph(el){const f=el.files[0];if(!f)return;if(f.size>1.5e6){el.value='';return toast('Image too large (max 1.5 MB)')}const r=new FileReader();r.onload=()=>{photoData=r.result;toast('Photo attached')};r.readAsDataURL(f)}
function saveS(){const g=i=>$('f_'+i).value.trim(),prn=g('prn'),name=g('name');
if(!name||!prn)return toast('Name and PRN are required');
if(!editing&&find(prn))return toast('PRN already exists');
const subs=[];for(let i=0;i<5;i++){const n=$('sn'+i).value.trim(),m=$('sm'+i).value;if(!n&&m==='')continue;if(!n||m==='')return toast('Complete subject '+(i+1));
if(+m<0||+m>S.settings.max)return toast('Marks for subject '+(i+1)+' must be 0–'+S.settings.max);subs.push([n,+m])}
if(!subs.length)return toast('Add at least one subject');
const old=editing?find(editing):null;
const o={name,prn,roll:g('roll'),dob:g('dob'),cls:g('cls'),sem:g('sem'),sec:g('sec'),year:g('year'),date:g('date'),cgpa:g('cgpa'),remark:g('remark'),photo:photoData||(old?old.photo:''),subs};
if(old)Object.assign(old,o);else S.students.push(o);
photoData=null;save();cur=prn;toast(old?'Student updated':'Student added');go('dash')}
function del(p){if(!confirm('Delete student '+p+'?'))return;S.students=S.students.filter(s=>s.prn!==p);if(cur===p)cur=S.students[0]?S.students[0].prn:null;save();render();toast('Student deleted')}
function rowH(s){const c=calc(s);return`<tr><td>${esc(s.name)}</td><td>${esc(s.prn)}</td><td>${esc(s.cls)} ${esc(s.sec)}</td><td>${esc(s.roll)}</td><td>${c.p.toFixed(2)}%</td><td>${c.g}</td><td><span class="pill ${c.res==='PASS'?'ok':'no'}">${c.res}</span></td><td class="act"><button class="btn b" onclick="go('dash','${esc(s.prn)}')">View</button><button class="btn g" onclick="go('add','${esc(s.prn)}')">Edit</button><button class="btn r" onclick="del('${esc(s.prn)}')">Delete</button></td></tr>`}
function tbl(list){return list.length?`<div class="scroll"><table><thead><tr><th>Name</th><th>PRN</th><th>Class</th><th>Roll</th><th>%</th><th>Grade</th><th>Result</th><th>Actions</th></tr></thead><tbody>${list.map(rowH).join('')}</tbody></table></div>`:'<div class="empty">No students found.</div>'}
function fl(){const k=rq.toLowerCase();return S.students.filter(s=>s.name.toLowerCase().includes(k)||s.prn.includes(k)||s.cls.toLowerCase().includes(k))}
function vRec(){return`<div class="card"><h3>Student Records (${S.students.length})</h3><input placeholder="Filter by name, PRN or class..." value="${esc(rq)}" oninput="rq=this.value;rl()" style="width:100%;max-width:340px;margin-bottom:12px"><div id="rl">${tbl(fl())}</div></div>`}
function rl(){$('rl').innerHTML=tbl(fl())}
function vSrch(){return`<div class="card"><h3>Search Student</h3><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px"><input id="sp" placeholder="Enter PRN number" style="flex:1;min-width:200px" onkeydown="if(event.key==='Enter')ss()"><button class="btn b" onclick="ss()">Search</button></div><div id="sr"><div class="empty">Enter a PRN to look up a student.</div></div></div>`}
function ss(){const v=$('sp').value.trim(),s=find(v);$('sr').innerHTML=s?tbl([s]):`<div class="empty">No student found with PRN “${esc(v)}”.</div>`}
function vRep(){const L=S.students.map(s=>({s,c:calc(s)})),n=L.length,avg=n?L.reduce((a,x)=>a+x.c.p,0)/n:0,pass=L.filter(x=>x.c.res==='PASS').length;
return`<div class="stat"><div class="card"><small>Total Students</small><b>${n}</b></div><div class="card"><small>Average %</small><b>${avg.toFixed(2)}%</b></div><div class="card"><small>Pass Rate</small><b>${n?Math.round(pass/n*100):0}%</b></div><div class="card"><small>Top Scorer</small><b style="font-size:18px">${n?esc(L.slice().sort((a,b)=>b.c.p-a.c.p)[0].s.name):'—'}</b></div></div>
<div class="rep">${L.map(x=>`<div class="card"><h3>${esc(x.s.name)}</h3><p style="margin:0 0 4px">PRN: ${esc(x.s.prn)} · ${esc(x.s.cls)}</p><p style="margin:0 0 12px">${x.c.t}/${x.c.M} · ${x.c.p.toFixed(2)}% · Grade ${x.c.g} · <span class="pill ${x.c.res==='PASS'?'ok':'no'}">${x.c.res}</span></p><button class="btn b" onclick="go('dash','${esc(x.s.prn)}')">Open Report</button> <button class="btn o" onclick="cur='${esc(x.s.prn)}';pr()">Print</button></div>`).join('')||'<div class="card empty">No reports yet.</div>'}</div>`}
function vSet(){const t=S.settings;return`<div class="card" style="max-width:760px"><h3>Settings</h3><div class="f">
<label>Academic Year<input id="s_year" value="${esc(t.year)}"></label><label>Institute / System Name<input id="s_inst" value="${esc(t.inst)}"></label>
<label>Max Marks per Subject<input id="s_max" type="number" min="1" value="${t.max}"></label><label>Pass Percentage (per subject)<input id="s_pass" type="number" min="0" max="100" value="${t.pass}"></label>
<label>Theme<select id="s_theme">${['light','dark'].map(x=>`<option ${t.theme===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
<h3 style="margin-top:18px">Signatories (first field unused | designation | full name)</h3>${t.sig.map((z,i)=>`<input id="s_sig${i}" value="${esc(z)}" style="width:100%;margin-bottom:8px">`).join('')}
<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn g" onclick="saveSet()">Save Settings</button><button class="btn r" onclick="if(confirm('Reset all data to defaults?')){S=JSON.parse(JSON.stringify(DEF));cur=S.students[0].prn;save();render();toast('Data reset')}">Reset Data</button></div></div>`}
function saveSet(){const t=S.settings,mx=+$('s_max').value,ps=+$('s_pass').value;if(!(mx>0)||ps<0||ps>100)return toast('Check max marks and pass %');
Object.assign(t,{year:$('s_year').value.trim()||t.year,inst:$('s_inst').value.trim()||t.inst,max:mx,pass:ps,theme:$('s_theme').value});
t.sig=t.sig.map((z,i)=>$('s_sig'+i).value.trim()||z);save();render();toast('Settings saved')}
render();
