"use strict";
exports.__esModule = true;
exports.setLocation = exports.setServer = exports.endsWith = exports.startsWith = void 0;
var add_trailing_slash_1 = require("./add-trailing-slash");
exports.startsWith = "\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  client_max_body_size 100M;\n  sendfile on;";
exports.endsWith = "\n}";
var setServer = function (domain, locations) { return "\n  server {\n    listen 80;\n    server_name ".concat(domain, ";\n\n    gzip on;\n    gzip_disable \"msie6\";\n\n    gzip_comp_level 6;\n    gzip_min_length 1100;\n    gzip_buffers 16 8k;\n    gzip_proxied any;\n    gzip_types\n        text/plain\n        text/css\n        text/js\n        text/xml\n        text/javascript\n        application/javascript\n        application/json\n        application/xml\n        application/rss+xml\n        image/svg+xml;\n    ").concat(locations.join('\n'), "\n  }\n"); };
exports.setServer = setServer;
var setLocation = function (path, proxy_instance, proxy_path, host, size_in_mb) { return "\n    location ".concat(path, " {\n      rewrite ^").concat((0, add_trailing_slash_1.addTrailingSlash)(path), "(.*) ").concat((0, add_trailing_slash_1.addTrailingSlash)(proxy_path), "$1 break;\n\n      client_max_body_size ").concat(size_in_mb || 1, "M;\n\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection \"upgrade\";\n      proxy_cache_bypass $http_upgrade;\n\n      proxy_set_header Host ").concat(host || "$host", ";\n      proxy_set_header X-Real-IP $remote_addr;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header X-Forwarded-Proto $scheme;\n\n      proxy_pass http://").concat(proxy_instance, ";\n    }"); };
exports.setLocation = setLocation;
//# sourceMappingURL=nginx-literals.js.map