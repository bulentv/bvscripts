
var net = require('net');

var appc = null;
var dnsc = null;
var apps = null;
var dnss = {};

var dns = {};
var app = {};
var mode = null;
var help = null;
var id = 'default';
var rport = null;
var rapps = {};

for(var i=2; i<process.argv.length; i++) {
  var argv = process.argv[i];
  if(argv == '-d' || argv == '--dns'){
    i++;
    var parts = process.argv[i].split(':');
    dns = { host:parts[0], port:parseInt(parts[1]) || 53};
    continue;
  }
  if(argv == '-a' || argv == '--app'){
    i++;
    var parts = process.argv[i].split(':');
    app = { host:parts[0], port:parseInt(parts[1]) || 53};
    continue;
  }
  if(argv == '-i' || argv == '--id'){
    i++;
    id = process.argv[i];
    continue;
  }
  if(argv == '-r' || argv == '--rport'){
    i++;
    rport = parseInt(process.argv[i]) || 222;
    continue;
  }
  if(argv == '-c' || argv == '--client') mode = 'c';
  if(argv == '-s' || argv == '--server') mode = 's';
  if(argv == '-h' || argv == '--help') test = true;
}

if(help || process.argv.length < 6) {
  console.log({dns:dns, app:app, mode:mode});
  console.log(
    "Usage:\n"+
    "node dns_tcp_tunnel.js [-s|-c]  -d host:port -a host:port\n"+
    "\n"+
    "Options:\n"+
    "-i, --id     : Identifier\n"+
    "-s, --server : Start in server mode\n"+
    "-c, --client : Start in server mode\n"+
    "-d, --dns    : DNS server or dns listen host:port\n"+
    "-a, --app    : Application server or listen host:port\n"+
    "-r, --rport  : Remote port to request listen\n"+
    "-h, --help   : Print this info\n");
    
  process.exit(0);
}

console.log('Program started (id:'+id+')');

switch(mode) {
  case 's':
    start_server();
    break;
  case 'c':
    start_client();
    break;
  default:
    console.log("[s]erver or [c]lient?");
    break;
}
start_info_server();

function start_server() {
  console.log('starting server..');
  var server = net.createServer( function(_dnss) {
    console.log('a client is accepted');

    var rapp = {};

    _dnss.on('data', function(data) {
      console.log("dnss:received "+data.length+" bytes");
      
      var l = data.readUInt32BE(9);
      if(l == 16 && data.length == 29) {
        // client registration
        var parts = data.slice(13).toString().split(/\//);
        console.log("rapp = ",rapp);
        rapp = {
          id: parts[0],
          port: parts[1],
        }
        rapps[rapp.id+'_'+rapp.port] = JSON.parse(JSON.stringify(rapp));
        rapps[rapp.id+'_'+rapp.port].clients = {};
        rapp.dnss = _dnss;
        start_app_server(rapp);
        rapp.dnss.write(new Buffer('0000818000010001000000000c000c0001000100000000000420202020','hex'));
      }else{
        if(rapp.apps) {
          rapp.apps.write(data);
        }
      }
    });

    _dnss.on('end', function() {
      rapp.dnss = null;
      if(rapp.apps) {
        rapp.apps.end();
        rapp.apps = null;
      }
      if(rapp.server) {
        rapp.server.close();
      }
      delete rapps[rapp.id+'_'+rapp.port];
      rapp = null;
      console.log('dnss client disconnected');
    });
  });

  server.on('error', function(e) {
    console.log('dnss has an error, retrying');
    server.close();
    server.removeAllListeners();
    setTimeout( function() {
      start_server();
    },1000);
  });

  server.listen( dns.port, dns.host, function() {
    console.log("server is listening (dns) " + dns.host + ":" + dns.port);
  });
}

function start_app_server(rapp) {
  console.log('starting app server..');
  var server = net.createServer( function(_apps) {
    console.log('an app client for ('+rapp.id+'#'+rapp.port+')is accepted, ' + _apps.remoteAddress + ":" + _apps.remotePort);
    rapp.apps = _apps;

    var client_id = _apps.remoteAddress+'_'+_apps.remotePort;
    rapps[rapp.id+'_'+rapp.port].clients[client_id] = true;

    _apps.on('data', function(data) {
      console.log("apps:received "+data.length+" bytes");
      if(rapp.dnss) {
        rapp.dnss.write(data);
      }
    });

    _apps.on('end', function() {
      delete rapps[rapp.id+'_'+rapp.port].clients[client_id];
      rapp.apps = null;
      console.log('app client disconnected');
      if(rapp.dnss) {
        rapp.dnss.write(new Buffer("313370","hex"));
      }
    });
  });

  server.on('error', function(e) {
    delete rapps[rapp.id+'_'+rapp.port].clients[_apps.remoteAddress+'_'+_apps.remotePort];
    console.log('apps has an error, retrying',e);
    server.close();
    rapp.apps = null;
    rapp.server = null;
    delete rapps[rapp.id+'_'+rapp.port];
    server.removeAllListeners();
  });

  server.listen( rapp.port, "0.0.0.0", function() {
    console.log("server is listening (app) 0.0.0.0:" + rapp.port);
    rapp.server = server;
  });
}

function start_info_server() {
  console.log('starting info server..');
  var server = net.createServer( function(_is) {
    var report = JSON.stringify({
      dns:dns,
      app:app,
      mode:mode,
      id:id,
      rport:rport,
      rapps:rapps
    },null,"\t");
    _is.write(report+"\n");
    _is.end();
  });

  server.on('error', function(e) {
    console.log("error:",e);
  });

  server.listen( 2121, "0.0.0.0", function() {
    console.log("info server is listening 0.0.0.0:2121");
  });
}


function start_client() {
  console.log('starting client..');
  var _dnsc = net.connect( dns.port, dns.host, function() {
    console.log('dnsc connected');
    var header = new Buffer('00000100000100000000000000','hex');
    var idpadded = id+"/"+rport+"/";
    while(idpadded.length<16) idpadded = idpadded + "*";
    header.writeUInt32BE(idpadded.length, header.length - 4);
    var buffer = new Buffer(header.length + idpadded.length);
    header.copy(buffer);
    buffer.write(idpadded,header.length);
    _dnsc.write(buffer);
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
      var l = data.readUInt32BE(9);
      console.log(l);
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
  var _appc = net.connect( app.port, app.host, function() {
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
