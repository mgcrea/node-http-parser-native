export default [
  `PUT /devices/data HTTP/1.1
Server: Foobar-001234567890
content-type: application/json

[{"id":123456,"endpoints":[{"id":123456,"error":15,"data":[{"name":"thermicDefect","validity":"expired","value":false},{"name":"level","validity":"expired","value":100},{"name":"onFavPos","validity":"expired","value":false}]}]}]
`
];
