let _listener = null;

export function showToast(message, type = 'success') {
  if (_listener) _listener({ message, type });
}

export function _setListener(fn) {
  _listener = fn;
}
