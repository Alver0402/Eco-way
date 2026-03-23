function errorHandler(err: any, req: any, res: any, next: any) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err.message.includes('no encontrado') || err.message.includes('registrado')) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Error interno del servidor', details: err.message });
}

module.exports = { errorHandler };
