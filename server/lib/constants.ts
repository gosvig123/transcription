import dotenv from 'dotenv'
import localtunnel = require('localtunnel');
dotenv.config()

if (!process.env.TOKEN) {
  throw new Error("No token provided.");
}
export const TOKEN = process.env.TOKEN


let urlPromise: Promise<string>

function getCallbackUrl() {
  if (!urlPromise) {
    urlPromise = localtunnel({ port: 8080 }).then(tunnel => {
      return tunnel.url;
    });
  }
  return urlPromise;
}
export const callBackUrl = getCallbackUrl()

