let account=JSON.parse(localStorage.getItem("travianAccount"))||{
tribe:"Romans",
serverSpeed:3,
villages:[]
};

let editingVillageId=null;

const ids=[
"villageName","coordinates","population","isCapital",
"wood","clay","iron","crop",
"woodProd","clayProd","ironProd","cropProd",
"warehouse","granary","cropConsumption",
"mainBuilding","residence","palace","heroMansion",
"warehouseBuilding","granaryBuilding","barracks","stable",
"workshop","academy","smithy","market","rallyPoint","cityWall",
"legionnaire","praetorian","imperian","equitesLegati",
"equitesImperatoris","equitesCaesaris","ram","fireCatapult",
"senator","settler","heroLevel","heroXP","heroHealth",
"oasisCount","oasisWood","oasisClay","oasisIron","oasisCrop",
"buildingQueue","fieldQueue","barracksQueue","stableQueue",
"resourceFields"
];

function value(id){
const e=document.getElementById(id);
return e?e.value:"";
}

function num(id){
return Number(value(id))||0;
}

function set(id,v){
const e=document.getElementById(id);
if(e)e.value=v??"";
}

function saveAccount(){
localStorage.setItem("travianAccount",JSON.stringify(account));
}

function saveVillage(){

const name=value("villageName").trim();

if(!name){
alert("נא להזין שם כפר");
return;
}

const buildings={};

[
"mainBuilding","residence","palace","heroMansion",
"warehouseBuilding","granaryBuilding","barracks",
"stable","workshop","academy","smithy","market",
"rallyPoint","cityWall"
].forEach(x=>buildings[x]=num(x));

const village={
id:editingVillageId||Date.now(),
name,
coordinates:value("coordinates"),
population:num("population"),
isCapital:value("isCapital")==="true",

resources:{
wood:num("wood"),
clay:num("clay"),
iron:num("iron"),
crop:num("crop")
},

production:{
wood:num("woodProd"),
clay:num("clayProd"),
iron:num("ironProd"),
crop:num("cropProd")
},

storage:{
warehouse:num("warehouse"),
granary:num("granary")
},

cropConsumption:num("cropConsumption"),

resourceFields:value("resourceFields"),

buildings,

troops:{
legionnaire:num("legionnaire"),
praetorian:num("praetorian"),
imperian:num("imperian"),
equitesLegati:num("equitesLegati"),
equitesImperatoris:num("equitesImperatoris"),
equitesCaesaris:num("equitesCaesaris"),
ram:num("ram"),
fireCatapult:num("fireCatapult"),
senator:num("senator"),
settler:num("settler")
},

hero:{
level:num("heroLevel"),
experience:num("heroXP"),
health:num("heroHealth")
},

oasis:{
count:num("oasisCount"),
wood:num("oasisWood"),
clay:num("oasisClay"),
iron:num("oasisIron"),
crop:num("oasisCrop")
},

queues:{
building:value("buildingQueue"),
field:value("fieldQueue"),
barracks:value("barracksQueue"),
stable:value("stableQueue")
},

updatedAt:new Date().toISOString()
};

const index=account.villages.findIndex(v=>v.id===village.id);

if(index>=0)
account.villages[index]=village;
else
account.villages.push(village);

editingVillageId=null;

saveAccount();
renderVillages();
clearForm();
}

function editVillage(id){

const v=account.villages.find(x=>x.id===id);
if(!v)return;

editingVillageId=id;

set("villageName",v.name);
set("coordinates",v.coordinates);
set("population",v.population);
set("isCapital",v.isCapital?"true":"false");

["wood","clay","iron","crop"].forEach(x=>set(x,v.resources[x]));
["wood","clay","iron","crop"].forEach(x=>set(x+"Prod",v.production[x]));

set("warehouse",v.storage.warehouse);
set("granary",v.storage.granary);
set("cropConsumption",v.cropConsumption);

set("resourceFields",v.resourceFields);

Object.entries(v.buildings||{}).forEach(([k,val])=>set(k,val));

Object.entries(v.troops||{}).forEach(([k,val])=>set(k,val));

set("heroLevel",v.hero?.level);
set("heroXP",v.hero?.experience);
set("heroHealth",v.hero?.health);

Object.entries(v.oasis||{}).forEach(([k,val])=>set("oasis"+k.charAt(0).toUpperCase()+k.slice(1),val));

set("buildingQueue",v.queues?.building);
set("fieldQueue",v.queues?.field);
set("barracksQueue",v.queues?.barracks);
set("stableQueue",v.queues?.stable);

window.scrollTo({top:0,behavior:"smooth"});
}

function deleteVillage(id){

if(!confirm("למחוק את הכפר?"))return;

account.villages=account.villages.filter(v=>v.id!==id);

saveAccount();
renderVillages();
}

function renderVillages(){

const c=document.getElementById("villagesContainer");

if(!account.villages.length){
c.innerHTML='<div class="empty">עדיין לא הוספת כפרים.</div>';
updateDashboard();
return;
}

let html=`
<table>
<thead>
<tr>
<th>כפר</th>
<th>מיקום</th>
<th>אוכלוסייה</th>
<th>עץ</th>
<th>טיט</th>
<th>ברזל</th>
<th>יבול</th>
<th>יבול נטו</th>
<th>פעולות</th>
</tr>
</thead>
<tbody>
`;

account.villages.forEach(v=>{

const net=v.production.crop-v.cropConsumption;

html+=`
<tr>
<td><strong>${v.name}</strong>${v.isCapital?" 🏛️":""}</td>
<td>${v.coordinates||"-"}</td>
<td>${v.population.toLocaleString()}</td>
<td>${v.resources.wood.toLocaleString()}</td>
<td>${v.resources.clay.toLocaleString()}</td>
<td>${v.resources.iron.toLocaleString()}</td>
<td>${v.resources.crop.toLocaleString()}</td>
<td>${net.toLocaleString()}/h</td>
<td>
<button onclick="editVillage(${v.id})">✏️</button>
<button onclick="deleteVillage(${v.id})">🗑️</button>
</td>
</tr>
`;
});

html+="</tbody></table>";

c.innerHTML=html;

updateDashboard();
updateAI();
}

function updateDashboard(){

let population=0;
let troops=0;
let crop=0;

account.villages.forEach(v=>{

population+=v.population;

Object.values(v.troops||{}).forEach(x=>troops+=Number(x)||0);

crop+=v.production.crop-v.cropConsumption;
});

set("villageCount",account.villages.length);
set("populationTotal",population.toLocaleString());
set("troopsTotal",troops.toLocaleString());
set("netCropTotal",crop.toLocaleString());
}

function updateAI(){

const c=document.getElementById("aiAnalysis");

if(!account.villages.length){
c.textContent="הוסף נתוני כפר כדי לקבל ניתוח.";
return;
}

let bestCrop=null;
let lowestCrop=null;

account.villages.forEach(v=>{
const net=v.production.crop-v.cropConsumption;

if(!bestCrop||net>bestCrop.net)bestCrop={v,net};
if(!lowestCrop||net<lowestCrop.net)lowestCrop={v,net};
});

c.innerHTML=`
<strong>ניתוח ראשוני</strong><br>
כפר בעל יבול נטו הגבוה ביותר:
<strong>${bestCrop.v.name}</strong> — ${bestCrop.net.toLocaleString()}/שעה<br>
כפר בעל יבול נטו הנמוך ביותר:
<strong>${lowestCrop.v.name}</strong> — ${lowestCrop.net.toLocaleString()}/שעה<br>
סה"כ כפרים: ${account.villages.length}
`;
}

function clearForm(){

editingVillageId=null;

ids.forEach(id=>{
const e=document.getElementById(id);
if(!e)return;

if(e.type==="number")e.value=0;
else if(e.tagName==="SELECT")e.value="false";
else e.value="";
});

set("heroHealth",100);
}

function exportData(){

const blob=new Blob(
[JSON.stringify(account,null,2)],
{type:"application/json"}
);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");
a.href=url;
a.download="travian-ai-account.json";
a.click();

URL.revokeObjectURL(url);
}

function importData(event){

const file=event.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=e=>{

try{

const data=JSON.parse(e.target.result);

if(!data.villages||!Array.isArray(data.villages))
throw new Error();

account=data;

saveAccount();
renderVillages();

alert("הנתונים נטענו בהצלחה.");

}catch{

alert("קובץ נתונים לא תקין.");

}

};

reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded",()=>{
renderVillages();
});
