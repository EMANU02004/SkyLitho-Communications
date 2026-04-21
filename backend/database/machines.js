const { randomUUID } = require('crypto');
const { readData, writeData } = require('./db');

function sanitize(data) {
  return {
    brand:      String(data.brand      || ''),
    category:   String(data.category   || ''),
    model:      String(data.model      || ''),
    year:       String(data.year       || ''),
    condition:  String(data.condition  || ''),
    badge:      String(data.badge      || 'available'),
    spec1Label: String(data.spec1Label || ''),
    spec1Val:   String(data.spec1Val   || ''),
    spec2Label: String(data.spec2Label || ''),
    spec2Val:   String(data.spec2Val   || ''),
    images:     Array.isArray(data.images) ? data.images : [],
  };
}

function getAll() {
  return readData().machines;
}

function getById(id) {
  return readData().machines.find(m => m.id === id) || null;
}

function create(data) {
  const db      = readData();
  const machine = {
    id: randomUUID(),
    ...sanitize(data),
    unavailable: false,
    soldAt:      null,
    createdAt:   new Date().toISOString(),
  };
  db.machines.push(machine);
  writeData(db);
  return machine;
}

function update(id, data) {
  const db  = readData();
  const idx = db.machines.findIndex(m => m.id === id);
  if (idx === -1) return null;
  db.machines[idx] = { ...db.machines[idx], ...sanitize(data) };
  writeData(db);
  return db.machines[idx];
}

function setSold(id, sold) {
  const db  = readData();
  const idx = db.machines.findIndex(m => m.id === id);
  if (idx === -1) return null;
  db.machines[idx].unavailable = sold;
  db.machines[idx].soldAt      = sold ? new Date().toISOString() : null;
  writeData(db);
  return db.machines[idx];
}

function remove(id) {
  const db = readData();
  db.machines = db.machines.filter(m => m.id !== id);
  writeData(db);
}

module.exports = { getAll, getById, create, update, setSold, remove };
