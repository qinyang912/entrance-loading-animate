/*
* @Author: qin yang
* @Date:   2016-04-08 22:25:30
* @Last Modified by:   qin yang
* @Last Modified time: 2016-04-09 12:37:28
*/
(function (h, j) {
  function f (p, q) {
    this.x = p;
    this.y = q
  }

  f.prototype.add = function (p) {
    return new f(this.x + p.x, this.y + p.y)
  };
  f.prototype.times = function (p) {
    return new f(this.x * p, this.y * p)
  };
  function e (q, r) {
    var p = j.createElement(q);
    if (r) {
      p.className = r
    }
    return p
  }

  function a (r) {
    this.htmlElement = null;
    var q = r || {};
    this.size = new f(q.size[0], q.size[1]);
    this.speed = new f(q.speed[0], q.speed[1]);
    this.dateCreated = new Date().getTime();
    this.orgPos = this.pos = new f(q.pos[0], q.pos[1]);
    this.showTime = (o.bottom - this.orgPos.y) / this.speed.y
  }

  a.prototype.actorType = "cloud";
  a.prototype.step = function (p) {
    this.pos = this.pos.add(this.speed.times(p))
  };
  a.prototype.isOut = function () {
    var p = (new Date().getTime() - this.dateCreated) / 1000;
    return p > this.showTime
  };
  function c (r) {
    this.htmlElement = null;
    var q = r || {};
    this.size = new f(q.size[0], q.size[1]);
    this.orgPos = this.pos = new f(q.pos[0], q.pos[1]);
    this.speed = new f(q.speed[0], q.speed[1]);
    this.dateCreated = new Date().getTime();
    this.showTime = (o.bottom - this.orgPos.y) / this.speed.y
  }

  c.prototype.actorType = "dot";
  c.prototype.step = function (p) {
    this.pos = this.pos.add(this.speed.times(p))
  };
  c.prototype.isOut = function () {
    var p = (new Date().getTime() - this.dateCreated) / 1000;
    return p > this.showTime
  };
  function i (r) {
    this.htmlElement = null;
    var q = r || {};
    this.size = new f(q.size[0], q.size[1]);
    this.pos = new f(q.pos[0], q.pos[1]);
    this.speed = new f(q.speed[0], q.speed[1]);
    this.wobble = Math.PI, 0;
    this.middle = o.center.x;
    this.radius = 1.5 * this.size.x
  }

  i.prototype.actorType = "logo";
  i.prototype.step = function (p) {
    this.wobble += p * this.speed.x;
    this.pos = new f(this.middle + Math.sin(this.wobble) * this.radius, this.pos.y)
  };
  i.prototype.isOut = function () {
    return false
  };
  function n (r) {
    this.htmlElement = null;
    var q = r || {};
    this.size = new f(q.size[0], q.size[1]);
    this.pos = new f(q.pos[0], q.pos[1]);
    this.speed = new f(q.speed[0], q.speed[1])
  }

  n.prototype.actorType = "sun";
  n.prototype.step = function (p) {
  };
  n.prototype.isOut = function () {
    return false
  };
  function g (r) {
    this.htmlElement = null;
    var q = r || {};
    this.size = new f(q.size[0], q.size[1]);
    this.orgPos = this.pos = new f(q.pos[0], q.pos[1]);
    this.speed = new f(q.speed[0], q.speed[1]);
    this.shadowSize = r.shadowSize;
    this.shadowSpeed = r.shadowSpeed;
    this.shadowColor = r.shadowColor;
    this.wobble = Math.PI;
    this.middle = 30;
    this.radius = 10
  }

  g.prototype.actorType = "sunInner";
  g.prototype.step = function (p) {
    this.wobble += p * this.shadowSpeed;
    this.shadowSize = Math.sin(this.wobble) * this.radius + this.middle
  };
  g.prototype.isOut = function () {
    return false
  };
  function d (q, s) {
    var r = s || {};
    this.window = q;
    this.element = s.element;
    this.left = 0;
    this.top = 0;
    this.right = this.element.offsetWidth;
    this.bottom = this.element.offsetHeight;
    this.center = new f(this.left + this.right / 2, this.top + this.bottom / 2);
    this.lastTimeStamp = null;
    this.active = true
  }

  d.prototype.init = function (p) {
    this.elementArray = p;
    this.elementArray.forEach(function (r) {
      var q = this.makeDisplayNode(r);
      this.element.appendChild(q);
      r.htmlElement = q
    }, this)
  };
  d.prototype.makeDisplayNode = function (p) {
    var q = e("div", "actor " + p.actorType);
    q.style.left = p.pos.x + "px";
    q.style.top = p.pos.y + "px";
    q.style.width = p.size.x + "px";
    q.style.height = p.size.y + "px";
    return q
  };
  d.prototype.step = function (r) {
    if (this.lastTimeStamp) {
      var q = Math.min(r - this.lastTimeStamp, 100) / 1000;
      this.redraw(q)
    }
    this.lastTimeStamp = r;
    var p = this;
    if (this.active) {
      this.window.requestAnimationFrame(function (s) {
        p.step(s)
      })
    }
  };
  d.prototype.redraw = function (p) {
    this.elementArray.forEach(function (q) {
      q.step(p);
      this.drawElement(q)
    }, this)
  };
  d.prototype.drawElement = function (q) {
    if (q.isOut()) {
      return this.handleOut(q)
    }
    var r = q.htmlElement;
    if (r) {
      r.style.left = q.pos.x + "px";
      r.style.top = q.pos.y + "px";
      if (q.shadowSize) {
        var p = q.shadowSize;
        r.style.boxShadow = "0 0 " + p + "px " + p + "px " + q.shadowColor
      }
    } else {
      r = this.makeDisplayNode(q);
      this.element.appendChild(r);
      q.htmlElement = r
    }
  };
  d.prototype.handleOut = function (q) {
    var r = q.htmlElement;
    if (r) {
      this.element.removeChild(r)
    }
    var p = this.elementArray.indexOf(q);
    this.elementArray.splice(p, 1)
  };
  d.prototype.start = function () {
    this.active = true;
    var p = this;
    this.window.requestAnimationFrame(function (q) {
      p.step(q)
    })
  };
  d.prototype.stop = function () {
    this.active = false
  };
  d.prototype.destroy = function () {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild)
    }
    this.element.remove();
  };
  function m (p) {
    this.plan = p;
    this.elementArray = []
  }

  m.prototype.createFromPlan = function () {
    this.plan.initElement.forEach(function (p) {
      this.elementArray.push(this.generateElement(p))
    }, this);
    this.plan.genElement.forEach(function (p) {
      this.addElement(p)
    }, this);
    return this.elementArray
  };
  m.prototype.generateElement = function (p) {
    return new p.typeFunction(p)
  };
  m.prototype.addElement = function (q) {
    this.elementArray.push(this.getRandomElement(q));
    var p = this;
    h.setTimeout(function () {
      p.addElement(q)
    }, q.generatorInterval)
  };
  m.prototype.getRandomElement = function (w) {
    var y = w.size, s = w.pos.scope, v = w.speed.scope;
    var r = y.scope[0] + Math.floor(Math.random() * (y.scope[1] - y.scope[0]));
    var x = r * y.ratio;
    var q = s[0][0] + Math.floor(Math.random() * (s[0][1] - s[0][0]));
    var p = s[1][0] + Math.floor(Math.random() * (s[1][1] - s[1][0]));
    var u = v[0][0] + Math.floor(Math.random() * (v[0][1] - v[0][0]));
    var t = v[1][0] + Math.floor(Math.random() * (v[1][1] - v[1][0]));
    return this.generateElement({typeFunction: w.typeFunction, size: [r, x], pos: [q, p], speed: [u, t]})
  };
  function b (q) {
    var p = new m(q);
    var r = p.createFromPlan();
    o.init(r);
    o.start()
  }

  function l () {
    o.stop();
    o.destroy()
  }
  var o;
  h.RsqLoading = {
    start: function (id) {
      o = new d(h, {element: j.getElementById(id)});
      var k = {
        initElement: [{
          typeFunction: a,
          size: [50, 24.5],
          pos: [o.center.x - 150, o.center.y - 10],
          speed: [0, 50]
        }, {typeFunction: a, size: [80, 39.2], pos: [o.center.x + 100, o.center.y - 100], speed: [0, 50]}, {
          typeFunction: c,
          size: [5, 5],
          pos: [o.left + 100, o.bottom - 200],
          speed: [0, 50]
        }, {typeFunction: c, size: [8, 8], pos: [o.center.x - 100, o.center.y + 20], speed: [0, 50]}, {
          typeFunction: i,
          size: [115, 170],
          pos: [o.center.x, o.center.y],
          speed: [0.5, 0]
        }, {typeFunction: n, size: [30, 30], pos: [o.left + 160, o.top + 160], speed: [0, 0]}, {
          typeFunction: g,
          size: [2, 2],
          pos: [o.left + 174, o.top + 174],
          speed: [0, 0],
          shadowSize: 20,
          shadowSpeed: 6,
          shadowColor: "#e9e9eb"
        }],
        genElement: [{
          typeFunction: a,
          generatorInterval: 2000,
          size: {scope: [30, 100], ratio: 0.49},
          pos: {scope: [[o.left + 10, o.right - 110], [0, 0]]},
          speed: {scope: [[0, 0], [50, 100]]}
        }, {
          typeFunction: c,
          generatorInterval: 1500,
          size: {scope: [5, 15], ratio: 1},
          pos: {scope: [[o.left + 10, o.right - 25], [0, 0]]},
          speed: {scope: [[0, 0], [20, 50]]}
        }]
      };
      b(k)
    }, stop: function () {
      l()
    }
  }
})(window, document);