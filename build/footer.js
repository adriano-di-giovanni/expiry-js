
  function expiry() {
    return Expiry.forge.apply(Expiry, arguments);
  }

  expiry.VERSION = '<%= pkg.version %>';

  return expiry;
}));
