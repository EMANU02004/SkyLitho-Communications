const router          = require('express').Router();
const machines        = require('../database/machines');
const { requireAdmin} = require('../auth/auth');

router.get('/', (_req, res) => {
  res.json(machines.getAll());
});

router.get('/:id', (req, res) => {
  const m = machines.getById(req.params.id);
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

router.post('/', requireAdmin, (req, res) => {
  const { brand, category, model, year } = req.body || {};
  if (!brand || !category || !model || !year) {
    return res.status(400).json({ error: 'brand, category, model, and year are required' });
  }
  res.status(201).json(machines.create(req.body));
});

router.put('/:id', requireAdmin, (req, res) => {
  if (!machines.getById(req.params.id)) return res.status(404).json({ error: 'Not found' });
  res.json(machines.update(req.params.id, req.body));
});

router.patch('/:id/sold', requireAdmin, (req, res) => {
  if (!machines.getById(req.params.id)) return res.status(404).json({ error: 'Not found' });
  res.json(machines.setSold(req.params.id, Boolean(req.body.sold)));
});

router.delete('/:id', requireAdmin, (req, res) => {
  if (!machines.getById(req.params.id)) return res.status(404).json({ error: 'Not found' });
  machines.remove(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
