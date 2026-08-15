function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, message, status = 400, details) {
  return res.status(status).json({
    success: false,
    error: { message, ...(details ? { details } : {}) },
  });
}

module.exports = { success, error };