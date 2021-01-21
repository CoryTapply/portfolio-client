// import AuthenticationService from './auth.service' // TODO: Add Auth some day

function requiredEnv(env) {
  throw new TypeError(`The ${env} environment variable is strictly required.`);
}

function assertPath(path) {
  const type = typeof path;
  if (type !== 'string') {
    throw new TypeError(`The path should be a string, instead received a ${type}`);
  }
}

export const hosts = {
  MAIN_SERVICE: process.env.MAIN_SERVICE || requiredEnv('MAIN_SERVICE'),
  SECONDARY_SERVICE: process.env.SECONDARY_SERVICE || requiredEnv('SECONDARY_SERVICE'),
};

export function request(path, options = {}) {
  const {
    headers,
    query = null,
    method = 'GET',
    body,
    host = hosts.MAIN_SERVICE,
    ...extraOpts
  } = options;
  assertPath(path);

  // let token = AuthenticationService.getToken(); // TODO: Add Auth some day

  // Compose the request configuration object
  const reqOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // ...(token && { Authorization: `Bearer ${token}` }), // TODO: Add Auth some day
      ...headers,
    },
    ...extraOpts,
  };

  // If a body object is passed, automatically stringify it.
  if (body && reqOptions.headers['Content-Type'] === 'application/json') {
    console.log("Stringifying the data");
    reqOptions.body = typeof body === 'object' ? JSON.stringify(body) : body;
  } else {
    console.log("leaving the body data as is");
    reqOptions.body = body;
  }

  if (reqOptions.headers['Content-Type'] === 'multipart/form-data') {
    delete reqOptions.headers['Content-Type'];
  }

  let queryString = '';
  if (query) {
    // Convert to encoded string and prepend with ?
    queryString = new URLSearchParams(query).toString();
    queryString = queryString && `?${queryString}`;
  }

  return fetch(`${host}${path}${queryString}`, reqOptions).then(res => res.json());
}
