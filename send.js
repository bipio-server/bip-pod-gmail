/**
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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
var gapi = require('googleapis'),
  gmail = gapi.gmail({ version : 'v1' });

function Send() {}

Send.prototype = {};

Send.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    log = this.$resource.log,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports),
    rawBody =
    'From:' + imports.user_id + '\r\n'
      + (imports.subject ? ('Subject:' + imports.subject + '\r\n') : '')
      + 'To:' + imports.rcpt_to + '\r\n\r\n'
      + imports.body,
    params = {
      auth : auth,
      userId:  'me',
      resource : {
        raw : new Buffer(rawBody).toString('base64')
      }
    };

  gmail.users.messages.send(params, function(err, body, res) {
    next(err, body);
  });
}

// -----------------------------------------------------------------------------
module.exports = Send;