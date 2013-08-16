// Generated by CoffeeScript 1.6.3
(function() {
  var answerMultis, answerSingle, dbURL, fetchAnswer, fetchRequest, fillForm, getAnswerMultis, getAnswerSingle, getMultisQuestion, getName, getSingleQuestion, ifm, multis, multisAns, multisCounts, prompts, pushAnswer, pushRequest, randInt, randIntArray, single, singleAns, singleCounts,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  randInt = function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  randIntArray = function(min, max, count) {
    var _results;
    _results = [];
    while (count--) {
      _results.push(randInt(min, max));
    }
    return _results;
  };

  dbURL = "https://examination.firebaseio.com/";

  singleCounts = 80;

  multisCounts = 10;

  ifm = $("[name='mainm']").contents();

  prompts = [];

  fetchRequest = (function() {
    function fetchRequest(ref, name) {
      this.ref = ref;
      this.name = name;
      this.fetchCallback = __bind(this.fetchCallback, this);
    }

    fetchRequest.prototype.fetchCallback = function(snap) {
      var ans;
      ans = snap.val();
      console.log("Fetching " + this.name);
      if (ans !== null) {
        return fillForm(this.name, ans);
      } else {
        console.log("" + name + " no answer");
        return prompts.push(name);
      }
    };

    fetchRequest.prototype.exec = function() {
      return this.ref.once("value", this.fetchCallback);
    };

    return fetchRequest;

  })();

  pushRequest = (function() {
    function pushRequest(ref, answer) {
      this.ref = ref;
      this.answer = answer;
      this.pushCallback = __bind(this.pushCallback, this);
    }

    pushRequest.prototype.pushCallback = function(snap) {
      var ans;
      ans = snap.val();
      if (!ans) {
        return this.ref.set(this.answer);
      }
    };

    pushRequest.prototype.exec = function() {
      return this.ref.once("value", this.pushCallback);
    };

    return pushRequest;

  })();

  fillForm = function(name, answer) {
    var ans, _i, _len;
    console.log("Filling " + name + " with " + answer);
    if (typeof answer === "number") {
      answer = [answer];
    }
    for (_i = 0, _len = answer.length; _i < _len; _i++) {
      ans = answer[_i];
      ifm.find("[name='" + name + "']").get(ans).checked = true;
    }
  };

  getSingleQuestion = function() {
    var q, _i, _results;
    _results = [];
    for (q = _i = 1; 1 <= singleCounts ? _i <= singleCounts : _i >= singleCounts; q = 1 <= singleCounts ? ++_i : --_i) {
      _results.push(ifm.find("[name='s_an[" + q + "]']").next().next().next().html().replace(/\uff08<fon.+\uff09/, "").replace(/\n\r]/, "").replace(/<(\w).*>.+<\/\1>/, "").replace(/[.#$\[\]]/, "").slice(0, 102));
    }
    return _results;
  };

  getMultisQuestion = function() {
    var q, _i, _results;
    _results = [];
    for (q = _i = 1; 1 <= multisCounts ? _i <= multisCounts : _i >= multisCounts; q = 1 <= multisCounts ? ++_i : --_i) {
      _results.push(ifm.find("[name='m_an[" + q + "]']").next().next().next().html().replace(/\uff08<fon.+\uff09/, "").replace(/\n\r]/, "").replace(/<(\w).*>.+<\/\1>/, "").replace(/[.#$\[\]]/, "").slice(0, 102));
    }
    return _results;
  };

  getName = function(mode, id) {
    if (mode === "single") {
      return "single_answer[" + id + "]";
    } else {
      return "more_answer[" + id + "]";
    }
  };

  answerSingle = function(queSet, ansSet) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = ansSet.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      ifm.find("[name='single_answer[" + (i + 1) + "]']").get(ansSet[i]).checked = true;
    }
  };

  answerMultis = function(queSet, ansSet) {
    var i, q, _i, _j, _len, _ref, _ref1;
    for (i = _i = 0, _ref = ansSet.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _ref1 = ansSet[i];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        q = _ref1[_j];
        ifm.find("[name='more_answer[" + (i + 1) + "]']").get(q).checked = true;
      }
    }
  };

  fetchAnswer = function(mode, qSet) {
    var dbRef, i, req, reqQueue, _i, _j, _len, _ref;
    dbRef = new Firebase(dbURL + mode + '/');
    reqQueue = [];
    for (i = _i = 0, _ref = qSet.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      reqQueue.push(new fetchRequest(dbRef.child(escape(qSet[i])), getName(mode, i + 1)));
    }
    for (_j = 0, _len = reqQueue.length; _j < _len; _j++) {
      req = reqQueue[_j];
      req.exec();
    }
  };

  pushAnswer = function(mode, qSet, aSet) {
    var dbRef, i, push, pushQueue, ref, _i, _j, _len, _ref;
    dbRef = new Firebase(dbURL + mode + '/');
    pushQueue = [];
    for (i = _i = 0, _ref = qSet.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (aSet[i] !== null) {
        console.log("Pushing " + aSet[i]);
        ref = dbRef.child(escape(qSet[i]));
        pushQueue.push(new pushRequest(ref, aSet[i]));
      } else {
        console.log("Ignoring " + aSet[i] + " in " + qSet[i]);
        continue;
      }
    }
    for (_j = 0, _len = pushQueue.length; _j < _len; _j++) {
      push = pushQueue[_j];
      push.exec();
    }
  };

  getAnswerSingle = function() {
    var ans, i, _i, _results;
    _results = [];
    for (i = _i = 1; 1 <= singleCounts ? _i <= singleCounts : _i >= singleCounts; i = 1 <= singleCounts ? ++_i : --_i) {
      ans = ifm.find("[name='single_answer[" + i + "]']:checked").val();
      if (ans) {
        _results.push(ans.charCodeAt(0) - 65);
      } else {
        prompts.push("single_answer[" + i + "]");
        _results.push(null);
      }
    }
    return _results;
  };

  getAnswerMultis = function() {
    var ansCell, ansSet, i;
    ansSet = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; 1 <= multisCounts ? _i <= multisCounts : _i >= multisCounts; i = 1 <= multisCounts ? ++_i : --_i) {
        ansCell = [];
        ifm.find("[name='more_answer[" + i + "]']:checked").each(function(index, value) {
          return ansCell.push(value.value.charCodeAt(0) - 65);
        });
        if (ansCell.length === 0) {
          prompts.push("multis_answer[" + i + "]");
          _results.push(null);
        } else {
          _results.push(ansCell);
        }
      }
      return _results;
    })();
    console.log(ansSet);
    return ansSet;
  };

  single = getSingleQuestion();

  multis = getMultisQuestion();

  alert("Please be patient while uploading answers.");

  singleAns = getAnswerSingle();

  multisAns = getAnswerMultis();

  pushAnswer("single", single, singleAns);

  pushAnswer("multis", multis, multisAns);

  setTimeout(function() {
    if (prompts.length !== 0) {
      return alert("There are questions have no answer chosen. They are:\n" + (prompts.join("\n")));
    }
  }, 3000);

}).call(this);