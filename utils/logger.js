function Logger () {}

Logger.preload = function () {
  function pad (content, length) {
    content = content || '';
    while (content.length < length) {
      content = content + ' ';
    }
    return content;
  }

  function adapter (context, payload) {
    const when = new Date(payload.when).toUTCString();
    const kind = pad(payload.kind || '-', 8).toUpperCase();
    const type = pad(payload.case || '-', 8).toUpperCase();
    const text = payload.notice || payload.pattern || '-';

    console.log(when, kind, type, text);
  }

  return {
    extend: {
      logger: adapter
    }
  };
};

module.exports = Logger;
