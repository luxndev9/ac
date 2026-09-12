const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USER = process.env.ADMIN_USER || "AZURE99990";
const ADMIN_PASS = process.env.ADMIN_PASS || "PUROAZUREALV666PUTO";
const SESSION_SECRET = process.env.SESSION_SECRET || "CHANGE_THIS_SECRET";

const DATA_FILE = path.join(__dirname, "team.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([
    {name:"Borek",role:"Founder",image:""},
    {name:"Karma",role:"Founder",image:""},
    {name:"DN",role:"Administración",image:""},
    {name:"Domi",role:"Administración",image:""},
    {name:"Nahuel",role:"Staff",image:""},
    {name:"Pau",role:"Staff",image:""},
    {name:"Usuario",role:"Por definir",image:""}
  ], null, 2));
}

app.use(express.json({limit:"1mb"}));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use(express.static(path.join(__dirname, "public")));

function adminOnly(req,res,next){
  if(req.session && req.session.admin === true) return next();
  return res.status(401).json({error:"Unauthorized"});
}

app.post("/api/login",(req,res)=>{
  const {username,password}=req.body || {};
  if(username === ADMIN_USER && password === ADMIN_PASS){
    req.session.admin = true;
    return res.json({ok:true});
  }
  return res.status(401).json({error:"Invalid credentials"});
});

app.post("/api/logout",(req,res)=>{
  req.session.destroy(()=>res.json({ok:true}));
});

app.get("/api/team",(req,res)=>{
  res.json(JSON.parse(fs.readFileSync(DATA_FILE,"utf8")));
});

app.post("/api/team",adminOnly,(req,res)=>{
  const team = Array.isArray(req.body) ? req.body : [];
  if(team.length !== 7) return res.status(400).json({error:"Expected 7 members"});
  const clean = team.map(x=>({
    name:String(x.name || "Usuario").slice(0,60),
    role:String(x.role || "Staff").slice(0,60),
    image:String(x.image || "").slice(0,2000)
  }));
  fs.writeFileSync(DATA_FILE, JSON.stringify(clean,null,2));
  res.json({ok:true});
});

app.get("/admin",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","admin.html"));
});

app.listen(PORT,()=>console.log(`Azure running on port ${PORT}`));