/**
 *
 * The Bipio GMail Pod.  GMail Actions and Content Emitters
 *
 * Copyright (c) 2010-2014 WoT.IO inc http://wot.io
 * @author Michael Pearson <michael@wot.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Pod = require('bip-pod'),
gapi = require('googleapis'),
drive = gapi.drive('v2'),
https = require('https'),
GMail = new Pod({
  oAuthRefresh : function(refreshToken, next) {
    var c = this.getConfig();
    // @see https://developers.google.com/accounts/docs/OAuth2WebServer#refresh
    var options = {
        hostname : 'accounts.google.com',
        method : 'POST',
        path : '/o/oauth2/token',
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      },
      postBody = 'grant_type=refresh_token'
          + '&client_id=' + c.oauth.clientID
          + '&client_secret=' + c.oauth.clientSecret
          + '&refresh_token=' + refreshToken;

    // @todo migrate into pod/request
    var req = https.request(options, function(res) {
      var bodyTxt = '';

      res.on('data', function(d) {
        bodyTxt += d.toString();
      });

      res.on('end', function(d) {
        if (200 === res.statusCode) {
          next(false, JSON.parse(bodyTxt));
        } else {
          next(res.statusCode + ':' + d);
        }
      })
    });

    req.write(postBody);
    req.end();

    req.on('error', function(e) {
      next(e);
    });
  }
});

GMail.BTOA = function(str) {
  var buf;

  if (str instanceof Buffer) {
    buf = str;
  } else {
    buf = new Buffer(str.toString(), 'binary');
  }

  return buf.toString('base64');
}

GMail.getOAuthClient = function(sysImports) {
  var OAuth2 = gapi.auth.OAuth2Client ? gapi.auth.OAuth2Client : gapi.auth.OAuth2,
    oauth2Client = new OAuth2();

  oauth2Client.credentials = {
    access_token : sysImports.auth.oauth.access_token
  };

  return oauth2Client;
}

// -----------------------------------------------------------------------------
module.exports = GMail;