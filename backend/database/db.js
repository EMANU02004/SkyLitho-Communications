const fs   = require('fs');
const path = require('path');

const DATA_DIR  = process.env.DATA_DIR || path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'machines.json');

const DEFAULT_MACHINES = [
  { id:'d1', brand:'KBA',        category:'Sheet-Fed Offset',  model:'Rapida RA 106-8',    year:'2018', condition:'Good',      badge:'new',       spec1Label:'Sheets', spec1Val:'248M',  spec2Label:'Max Format', spec2Val:'740 × 1060 mm', images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
  { id:'d2', brand:'Heidelberg', category:'Sheet-Fed Offset',  model:'CD 102-4',           year:'2007', condition:'Good',      badge:'available', spec1Label:'Sheets', spec1Val:'495M',  spec2Label:'Max Format', spec2Val:'720 × 1020 mm', images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
  { id:'d3', brand:'KBA',        category:'Sheet-Fed Offset',  model:'Rapida RA 105-5 LV', year:'2008', condition:'Good',      badge:'new',       spec1Label:'Sheets', spec1Val:'250M',  spec2Label:'Output',     spec2Val:'18,000 sph',    images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
  { id:'d4', brand:'Polar',      category:'Cutting Equipment', model:'Polar 92 ED',        year:'1996', condition:'Very Good', badge:'available', spec1Label:'Cuts',   spec1Val:'121M',  spec2Label:'Max Width',  spec2Val:'920 mm',        images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
  { id:'d5', brand:'Polar',      category:'Cutting Equipment', model:'Polar 137 XT',       year:'2009', condition:'Good',      badge:'new',       spec1Label:'Cuts',   spec1Val:'1.9M',  spec2Label:'Max Width',  spec2Val:'1370 mm',       images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
  { id:'d6', brand:'Komori',     category:'Sheet-Fed Offset',  model:'GL 640 C Hybrid',    year:'2016', condition:'Excellent', badge:'available', spec1Label:'Sheets', spec1Val:'30M',   spec2Label:'Output',     spec2Val:'16,500 sph',    images:[], unavailable:false, soldAt:null, createdAt:new Date().toISOString() },
];

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { machines: [] };
  }
}

function writeData(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function initDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    writeData({ machines: DEFAULT_MACHINES });
    console.log('Data directory initialized with default machines.');
  }
}

module.exports = { readData, writeData, initDb };
