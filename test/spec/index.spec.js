import expect from 'expect';
import publishDebugGlobals from 'debug-utils';
import {parseHTTPRequest, parseHTTPResponse} from '../../src';

import requests from './__fixtures__/requests';
import responses from './__fixtures__/responses';

publishDebugGlobals();

describe('http-parser-native', () => {
  describe('parseHTTPRequest', () => {
    it('should properly parse requests', () => {
      requests.forEach(async request => {
        const parsed = await parseHTTPRequest(request);
        expect(parsed).toMatchSnapshot();
      });
    });
  });
  describe('parseHTTPResponse', () => {
    it('should properly parse responses', () => {
      responses.forEach(async response => {
        const parsed = await parseHTTPResponse(response);
        expect(parsed).toMatchSnapshot();
      });
    });
  });
});
