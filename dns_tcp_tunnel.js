var net = require('net');

var appc = null;
var dnsc = null;
var apps = null;
var dnss = null;

var dns = {};
var app = {};
var mode = null;
var test = null;

for(var i=2; i<process.argv.length; i++) {
  var argv = process.argv[i];
  if(argv == '-d' || argv == '--dns'){
    i++;
    var parts = process.argv[i].split(':');
    dns = { ip:parts[0], port:parseInt(parts[1]) || 53};
    continue;
  }
  if(argv == '-a' || argv == '--app'){
    i++;
    var parts = process.argv[i].split(':');
    app = { ip:parts[0], port:parseInt(parts[1]) || 53};
    continue;
  }
  if(argv == '-c' || argv == '--client') mode = 'c';
  if(argv == '-s' || argv == '--server') mode = 's';
  if(argv == '-t' || argv == '--test') test = true;
}

if(test || process.argc < 6) {
  console.log({dns:dns, app:app, mode:mode});
  console.log(
    "Usage:\n"+
    "node dns_tcp_tunnel.js [-s|-c]  -d ip:port -a ip:port\n"+
    "\n"+
    "Options:\n"+
    "-s, --server : Start in server mode\n"+
    "-c, --client : Start in server mode\n"+
    "-d, --dns    : DNS server or dns listen ip:port\n"+
    "-a, --app    : Application server or listen ip:port\n"+
    "-t, --test   : Check the parameters\n");
    
  process.exit(0);
}

switch(mode) {
  case 's':
    start_server();
    start_app_server();
    break;
  case 'c':
    start_client();
    break;
  default:
    console.log("[s]erver or [c]lient?");
    break;
}

function start_server() {
  console.log('starting server..');
  var server = net.createServer( function(_dnss) {
    console.log('a client is accepted');

    _dnss.on('data', function(data) {
      if(!dnss) {
        dnss = _dnss;
        console.log('Discarding first packet, sending first packet..');
        console.log(data.toString("hex"));
        _dnss.write(new Buffer('0000818000010001000000000c000c0001000100000000000420202020','hex'));

      }else{
        if(apps) {
          apps.write(data);
        }
      }
    });

    _dnss.on('end', function() {
      dnss = null;
      console.log('client disconnected');
    });
  });

  server.on('error', function(e) {
    console.log('dnss has an error, retrying');
    server.close();
    dnss = null;
    server.removeAllListeners();
    setTimeout( function() {
      start_server();
    },1000);
  });

  server.listen( 53, '0.0.0.0');
}

function start_app_server() {
  console.log('starting app server..');
  var server = net.createServer( function(_apps) {
    console.log('an app client is accepted');
    apps = _apps;

    _apps.on('data', function(data) {
      if(dnss) {
        dnss.write(data);
      }
    });

    _apps.on('end', function() {
      apps = null;
      console.log('app client disconnected');
      if(dnss) {
        dnss.write(new Buffer("313370","hex"));
      }
    });
  });

  server.on('error', function(e) {
    console.log('apps has an error, retrying');
    server.close();
    apps = null;
    server.removeAllListeners();
    setTimeout( function() {
      start_app_server();
    },1000);
  });

  server.listen( 222, '0.0.0.0');
}

function start_client() {
  console.log('starting client..');
  var _dnsc = net.connect( 53, 'buloev.bvnet.net', function() {
    console.log('dnsc connected');
    _dnsc.write(new Buffer('0000010000010000000000000420202020','hex'));
  });
  _dnsc.on('data', function(data) {
    console.log('dnsc recv ' + data.length + ' bytes');
    if(data.slice(0,3).toString("hex") == "313370") {
      console.log("App close cmd received");
      if(appc)
        appc.end();
      return;
    }
    if(dnsc==null){
      console.log("dnsc: discarding first packet");
      console.log(data.toString("hex"));
      dnsc = _dnsc;
    }else{
      if(!appc) {
        connect_to_app(function() {
          appc.write(data); 
        });
      }else{
        appc.write(data);
      }
    }
  });
  _dnsc.on('error', function(e) {
    console.log("dnsc: connection refused, retrying..");
    _dnsc.removeAllListeners();
    dnsc = null;
    setTimeout( function() {
      start_client();
    },1000);
  });
  _dnsc.on('end', function() {
    console.log('dnsc disconnected, reconnecting..');
    dnsc.removeAllListeners();
    dnsc = null;
    setTimeout( function() {
      start_client();
    },1000);
  });
}

function connect_to_app(cb) {
  console.log('starting appc..');
  var _appc = net.connect( 22, 'localhost', function() {
    console.log('appc connected');
    appc = _appc;
    if(cb) cb();
  });
  _appc.on('data', function(data) {
    console.log('appc recv ' + data.length + ' bytes');
    if(dnsc) {
      dnsc.write(data);
    }else{
      _appc.end();
    }
  });
  _appc.on('error', function(e) {
    console.log("appc: connection refused, retrying..");
    appc = null;
    _appc.removeAllListeners();
  });
  _appc.on('end', function() {
    console.log('dnsc disconnected');
    appc = null;
  });
}
