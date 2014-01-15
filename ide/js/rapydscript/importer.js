/*
_IMPORTS = {}
_VALID_NAMES = ['stdlib']
def read_file(fname):
    if (!(_VALID_NAMES.indexOf(fname) >= 0)):
        #Don't even try to import a name we do not know
        throw "Cannot Import " + fname;
    if (!(fname in _IMPORTS)):
        request = new XMLHttpRequest();
        # `false` makes the request synchronous
        request.open('GET', '/rapydscript/src/'+fname+'.pyj', false)
        request.send(null)
        if (request.status is 200):
            _IMPORTS[fname] = request.responseText
        else:
            throw "404 (File not found)"

    return _IMPORTS[fname]
*/

_IMPORTS = {};

_VALID_NAMES = [ "stdlib.pyj" ];

function import_read_file(fname) {
    var request;
    if (!(_VALID_NAMES.indexOf(fname) >= 0)) {
        throw "Cannot Import " + fname;
    }
    if (!(fname in _IMPORTS)) {
        request = new XMLHttpRequest();
        request.open("GET", "/static/rapydscript/src/" + fname, false);
        request.send(null);
        if (request.status === 200) {
            _IMPORTS[fname] = request.responseText;
        } else {
            throw "404 (File not found)";
        }
    }
    return _IMPORTS[fname];
}
