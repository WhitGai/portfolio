/*
 * CourtVision Match Mode — pickleball scoring engine (JavaScript).
 *
 * A browser- and Node-friendly port of the Python rules engine that powers the
 * courtvision-rules-mcp server. Same thesis: scoring is deterministic logic that
 * must be exact, so it lives in tested code, never improvised. Supports doubles
 * & singles, side-out & rally scoring. Zero dependencies.
 */
(function (root) {
  "use strict";

  const other = (t) => (t === "A" ? "B" : "A");

  class Match {
    constructor(opts = {}) {
      const o = Object.assign(
        { teamA: "Team A", teamB: "Team B", target: 11, winBy: 2,
          serving: "A", format: "doubles", scoring: "sideout" },
        opts
      );
      if (o.target < 1) throw new Error("target must be >= 1");
      if (o.winBy < 1) throw new Error("winBy must be >= 1");
      if (!["A", "B"].includes(o.serving)) throw new Error("serving must be A or B");
      if (!["doubles", "singles"].includes(o.format)) throw new Error("bad format");
      if (!["sideout", "rally"].includes(o.scoring)) throw new Error("bad scoring");
      const doublesSideout = o.format === "doubles" && o.scoring === "sideout";
      this.s = {
        teamA: o.teamA || "Team A", teamB: o.teamB || "Team B",
        a: 0, b: 0, serving: o.serving,
        server: doublesSideout ? 2 : 1,
        firstTurn: doublesSideout,
        format: o.format, scoring: o.scoring,
        target: o.target, winBy: o.winBy,
        finished: false, winner: null, rallies: 0, log: [],
      };
      this._hist = [];
    }
    get state() { return this.s; }
    servingScore() { return this.s.serving === "A" ? this.s.a : this.s.b; }
    receivingScore() { return this.s.serving === "A" ? this.s.b : this.s.a; }
    servingName() { return this.s.serving === "A" ? this.s.teamA : this.s.teamB; }
    usesServerNumber() { return this.s.format === "doubles" && this.s.scoring === "sideout"; }
    call() {
      if (this.s.finished) {
        const hi = Math.max(this.s.a, this.s.b), lo = Math.min(this.s.a, this.s.b);
        return `Game. ${this.s.winner}. ${hi}-${lo}.`;
      }
      return this.usesServerNumber()
        ? `${this.servingScore()} ${this.receivingScore()} ${this.s.server}`
        : `${this.servingScore()} ${this.receivingScore()}`;
    }
    _award(team) { if (team === "A") this.s.a++; else this.s.b++; }
    _checkWin() {
      const sv = this.servingScore(), rv = this.receivingScore();
      if (sv >= this.s.target && sv - rv >= this.s.winBy) {
        this.s.finished = true; this.s.winner = this.servingName();
      }
    }
    _sideOut() { this.s.serving = other(this.s.serving); this.s.server = 1; this.s.firstTurn = false; }
    _snap() { this._hist.push(JSON.parse(JSON.stringify(this.s))); }

    rally(outcome) {
      if (!["server_won", "server_lost"].includes(outcome)) throw new Error("bad outcome");
      if (this.s.finished) throw new Error("match finished");
      this._snap();
      this.s.rallies++;
      if (outcome === "server_won") { this._award(this.s.serving); this._checkWin(); return this.s; }
      if (this.s.scoring === "rally") {
        const r = other(this.s.serving);
        this._award(r); this.s.serving = r; this.s.server = 1; this.s.firstTurn = false; this._checkWin();
        return this.s;
      }
      if (this.s.format === "singles") this._sideOut();
      else if (this.s.firstTurn) this._sideOut();
      else if (this.s.server === 1) this.s.server = 2;
      else this._sideOut();
      return this.s;
    }
    undo() { if (!this._hist.length) throw new Error("nothing to undo"); this.s = this._hist.pop(); return this.s; }
  }

  const api = { Match };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CourtVision = api;
})(typeof self !== "undefined" ? self : this);
