const {methods, HTTPParser} = process.binding('http_parser');
const incoming = require('_http_incoming');
const {IncomingMessage} = incoming;

const kOnHeaders = HTTPParser.kOnHeaders | 0;
const kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
const kOnBody = HTTPParser.kOnBody | 0;
const kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;

export const parseHTTP = async (data, type) => {
  return new Promise((resolve, reject) => {
    const parser = new HTTPParser(type);
    parser[kOnHeadersComplete] = (
      versionMajor,
      versionMinor,
      headers,
      method,
      url,
      statusCode,
      statusMessage,
      upgrade
      // shouldKeepAlive
    ) => {
      const {socket} = parser;
      const incoming = (parser.incoming = new IncomingMessage(socket));
      incoming.httpVersionMajor = versionMajor;
      incoming.httpVersionMinor = versionMinor;
      incoming.httpVersion = `${versionMajor}.${versionMinor}`;
      incoming.url = url;
      incoming.upgrade = upgrade;
      incoming._addHeaderLines(headers, headers.length);
      if (typeof method === 'number') {
        // server only
        incoming.method = methods[method];
      } else {
        // client only
        incoming.statusCode = statusCode;
        incoming.statusMessage = statusMessage;
      }
    };
    const resBodyData = [];
    parser[kOnBody] = (b, start, len) => {
      resBodyData.push(b.slice(start, start + len));
    };
    parser[kOnMessageComplete] = () => {
      const body = Buffer.concat(resBodyData).toString('utf8');
      const {url, method, headers} = parser.incoming;
      resolve({url, method, headers, body});
      parser.free();
    };
    try {
      parser.execute(Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8'));
    } catch (err) {
      reject(err);
    }
  });
};

export const parseHTTPRequest = async data => parseHTTP(data, HTTPParser.REQUEST);
export const parseHTTPResponse = async data => parseHTTP(data, HTTPParser.RESPONSE);
