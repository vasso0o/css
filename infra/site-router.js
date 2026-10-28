function handler(event) {
  var request = event.request;
  var host = request.headers.host.value.toLowerCase();
  var suffix = '.bakabuild.com';

  if (!host.endsWith(suffix)) {
    return { statusCode: 404, statusDescription: 'Not Found' };
  }

  var subdomain = host.slice(0, -suffix.length);
  if (
    !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain) ||
    ['api', 'www', 'editor', 'static', 'assets'].includes(subdomain)
  ) {
    return { statusCode: 404, statusDescription: 'Not Found' };
  }

  var segments = request.uri.split('/');
  if (segments.includes('..') || segments.includes('.')) {
    return { statusCode: 404, statusDescription: 'Not Found' };
  }

  var prefix = '/sites/' + subdomain + suffix;
  if (request.uri.endsWith('/')) {
    request.uri = prefix + request.uri + 'index.html';
  } else if (!/\.[^/]+$/.test(request.uri.split('/').pop())) {
    request.uri = prefix + request.uri + '/index.html';
  } else {
    request.uri = prefix + request.uri;
  }

  return request;
}
