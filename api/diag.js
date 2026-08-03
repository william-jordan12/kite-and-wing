export default async function handler(req, res) {
  try {
    res.json({
      ok: true,
      method: req.method,
      node: process.version,
      pgInstalled: await import('fs').then(() => 'fs-ok'),
    })
  } catch (err) {
    res.status(500).json({ ok: false, name: err.name, message: err.message, stack: String(err.stack).slice(0, 500) })
  }
}
