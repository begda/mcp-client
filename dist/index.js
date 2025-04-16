var re;
(function(s) {
  s.assertEqual = (u) => u;
  function n(u) {
  }
  s.assertIs = n;
  function r(u) {
    throw new Error();
  }
  s.assertNever = r, s.arrayToEnum = (u) => {
    const c = {};
    for (const p of u)
      c[p] = p;
    return c;
  }, s.getValidEnumValues = (u) => {
    const c = s.objectKeys(u).filter((_) => typeof u[u[_]] != "number"), p = {};
    for (const _ of c)
      p[_] = u[_];
    return s.objectValues(p);
  }, s.objectValues = (u) => s.objectKeys(u).map(function(c) {
    return u[c];
  }), s.objectKeys = typeof Object.keys == "function" ? (u) => Object.keys(u) : (u) => {
    const c = [];
    for (const p in u)
      Object.prototype.hasOwnProperty.call(u, p) && c.push(p);
    return c;
  }, s.find = (u, c) => {
    for (const p of u)
      if (c(p))
        return p;
  }, s.isInteger = typeof Number.isInteger == "function" ? (u) => Number.isInteger(u) : (u) => typeof u == "number" && isFinite(u) && Math.floor(u) === u;
  function a(u, c = " | ") {
    return u.map((p) => typeof p == "string" ? `'${p}'` : p).join(c);
  }
  s.joinValues = a, s.jsonStringifyReplacer = (u, c) => typeof c == "bigint" ? c.toString() : c;
})(re || (re = {}));
var Za;
(function(s) {
  s.mergeShapes = (n, r) => ({
    ...n,
    ...r
    // second overwrites first
  });
})(Za || (Za = {}));
const P = re.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), $t = (s) => {
  switch (typeof s) {
    case "undefined":
      return P.undefined;
    case "string":
      return P.string;
    case "number":
      return isNaN(s) ? P.nan : P.number;
    case "boolean":
      return P.boolean;
    case "function":
      return P.function;
    case "bigint":
      return P.bigint;
    case "symbol":
      return P.symbol;
    case "object":
      return Array.isArray(s) ? P.array : s === null ? P.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? P.promise : typeof Map < "u" && s instanceof Map ? P.map : typeof Set < "u" && s instanceof Set ? P.set : typeof Date < "u" && s instanceof Date ? P.date : P.object;
    default:
      return P.unknown;
  }
}, A = re.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), $v = (s) => JSON.stringify(s, null, 2).replace(/"([^"]+)":/g, "$1:");
class Ge extends Error {
  get errors() {
    return this.issues;
  }
  constructor(n) {
    super(), this.issues = [], this.addIssue = (a) => {
      this.issues = [...this.issues, a];
    }, this.addIssues = (a = []) => {
      this.issues = [...this.issues, ...a];
    };
    const r = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = n;
  }
  format(n) {
    const r = n || function(c) {
      return c.message;
    }, a = { _errors: [] }, u = (c) => {
      for (const p of c.issues)
        if (p.code === "invalid_union")
          p.unionErrors.map(u);
        else if (p.code === "invalid_return_type")
          u(p.returnTypeError);
        else if (p.code === "invalid_arguments")
          u(p.argumentsError);
        else if (p.path.length === 0)
          a._errors.push(r(p));
        else {
          let _ = a, y = 0;
          for (; y < p.path.length; ) {
            const w = p.path[y];
            y === p.path.length - 1 ? (_[w] = _[w] || { _errors: [] }, _[w]._errors.push(r(p))) : _[w] = _[w] || { _errors: [] }, _ = _[w], y++;
          }
        }
    };
    return u(this), a;
  }
  static assert(n) {
    if (!(n instanceof Ge))
      throw new Error(`Not a ZodError: ${n}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, re.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(n = (r) => r.message) {
    const r = {}, a = [];
    for (const u of this.issues)
      u.path.length > 0 ? (r[u.path[0]] = r[u.path[0]] || [], r[u.path[0]].push(n(u))) : a.push(n(u));
    return { formErrors: a, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
}
Ge.create = (s) => new Ge(s);
const zn = (s, n) => {
  let r;
  switch (s.code) {
    case A.invalid_type:
      s.received === P.undefined ? r = "Required" : r = `Expected ${s.expected}, received ${s.received}`;
      break;
    case A.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(s.expected, re.jsonStringifyReplacer)}`;
      break;
    case A.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${re.joinValues(s.keys, ", ")}`;
      break;
    case A.invalid_union:
      r = "Invalid input";
      break;
    case A.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${re.joinValues(s.options)}`;
      break;
    case A.invalid_enum_value:
      r = `Invalid enum value. Expected ${re.joinValues(s.options)}, received '${s.received}'`;
      break;
    case A.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case A.invalid_return_type:
      r = "Invalid function return type";
      break;
    case A.invalid_date:
      r = "Invalid date";
      break;
    case A.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (r = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? r = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? r = `Invalid input: must end with "${s.validation.endsWith}"` : re.assertNever(s.validation) : s.validation !== "regex" ? r = `Invalid ${s.validation}` : r = "Invalid";
      break;
    case A.too_small:
      s.type === "array" ? r = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? r = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? r = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? r = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : r = "Invalid input";
      break;
    case A.too_big:
      s.type === "array" ? r = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? r = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? r = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? r = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? r = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : r = "Invalid input";
      break;
    case A.custom:
      r = "Invalid input";
      break;
    case A.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case A.not_multiple_of:
      r = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case A.not_finite:
      r = "Number must be finite";
      break;
    default:
      r = n.defaultError, re.assertNever(s);
  }
  return { message: r };
};
let al = zn;
function Zv(s) {
  al = s;
}
function Wi() {
  return al;
}
const qi = (s) => {
  const { data: n, path: r, errorMaps: a, issueData: u } = s, c = [...r, ...u.path || []], p = {
    ...u,
    path: c
  };
  if (u.message !== void 0)
    return {
      ...u,
      path: c,
      message: u.message
    };
  let _ = "";
  const y = a.filter((w) => !!w).slice().reverse();
  for (const w of y)
    _ = w(p, { data: n, defaultError: _ }).message;
  return {
    ...u,
    path: c,
    message: _
  };
}, Dv = [];
function k(s, n) {
  const r = Wi(), a = qi({
    issueData: n,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      r,
      // then global override map
      r === zn ? void 0 : zn
      // then global default map
    ].filter((u) => !!u)
  });
  s.common.issues.push(a);
}
class Oe {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(n, r) {
    const a = [];
    for (const u of r) {
      if (u.status === "aborted")
        return q;
      u.status === "dirty" && n.dirty(), a.push(u.value);
    }
    return { status: n.value, value: a };
  }
  static async mergeObjectAsync(n, r) {
    const a = [];
    for (const u of r) {
      const c = await u.key, p = await u.value;
      a.push({
        key: c,
        value: p
      });
    }
    return Oe.mergeObjectSync(n, a);
  }
  static mergeObjectSync(n, r) {
    const a = {};
    for (const u of r) {
      const { key: c, value: p } = u;
      if (c.status === "aborted" || p.status === "aborted")
        return q;
      c.status === "dirty" && n.dirty(), p.status === "dirty" && n.dirty(), c.value !== "__proto__" && (typeof p.value < "u" || u.alwaysSet) && (a[c.value] = p.value);
    }
    return { status: n.value, value: a };
  }
}
const q = Object.freeze({
  status: "aborted"
}), Dn = (s) => ({ status: "dirty", value: s }), Me = (s) => ({ status: "valid", value: s }), Da = (s) => s.status === "aborted", Wa = (s) => s.status === "dirty", pn = (s) => s.status === "valid", Er = (s) => typeof Promise < "u" && s instanceof Promise;
function Bi(s, n, r, a) {
  if (typeof n == "function" ? s !== n || !0 : !n.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return n.get(s);
}
function ol(s, n, r, a, u) {
  if (typeof n == "function" ? s !== n || !0 : !n.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n.set(s, r), r;
}
var M;
(function(s) {
  s.errToObj = (n) => typeof n == "string" ? { message: n } : n || {}, s.toString = (n) => typeof n == "string" ? n : n == null ? void 0 : n.message;
})(M || (M = {}));
var mr, vr;
class bt {
  constructor(n, r, a, u) {
    this._cachedPath = [], this.parent = n, this.data = r, this._path = a, this._key = u;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Zc = (s, n) => {
  if (pn(n))
    return { success: !0, data: n.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const r = new Ge(s.common.issues);
      return this._error = r, this._error;
    }
  };
};
function z(s) {
  if (!s)
    return {};
  const { errorMap: n, invalid_type_error: r, required_error: a, description: u } = s;
  if (n && (r || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return n ? { errorMap: n, description: u } : { errorMap: (p, _) => {
    var y, w;
    const { message: S } = s;
    return p.code === "invalid_enum_value" ? { message: S ?? _.defaultError } : typeof _.data > "u" ? { message: (y = S ?? a) !== null && y !== void 0 ? y : _.defaultError } : p.code !== "invalid_type" ? { message: _.defaultError } : { message: (w = S ?? r) !== null && w !== void 0 ? w : _.defaultError };
  }, description: u };
}
class G {
  get description() {
    return this._def.description;
  }
  _getType(n) {
    return $t(n.data);
  }
  _getOrReturnCtx(n, r) {
    return r || {
      common: n.parent.common,
      data: n.data,
      parsedType: $t(n.data),
      schemaErrorMap: this._def.errorMap,
      path: n.path,
      parent: n.parent
    };
  }
  _processInputParams(n) {
    return {
      status: new Oe(),
      ctx: {
        common: n.parent.common,
        data: n.data,
        parsedType: $t(n.data),
        schemaErrorMap: this._def.errorMap,
        path: n.path,
        parent: n.parent
      }
    };
  }
  _parseSync(n) {
    const r = this._parse(n);
    if (Er(r))
      throw new Error("Synchronous parse encountered promise.");
    return r;
  }
  _parseAsync(n) {
    const r = this._parse(n);
    return Promise.resolve(r);
  }
  parse(n, r) {
    const a = this.safeParse(n, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  safeParse(n, r) {
    var a;
    const u = {
      common: {
        issues: [],
        async: (a = r == null ? void 0 : r.async) !== null && a !== void 0 ? a : !1,
        contextualErrorMap: r == null ? void 0 : r.errorMap
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: n,
      parsedType: $t(n)
    }, c = this._parseSync({ data: n, path: u.path, parent: u });
    return Zc(u, c);
  }
  "~validate"(n) {
    var r, a;
    const u = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: n,
      parsedType: $t(n)
    };
    if (!this["~standard"].async)
      try {
        const c = this._parseSync({ data: n, path: [], parent: u });
        return pn(c) ? {
          value: c.value
        } : {
          issues: u.common.issues
        };
      } catch (c) {
        !((a = (r = c == null ? void 0 : c.message) === null || r === void 0 ? void 0 : r.toLowerCase()) === null || a === void 0) && a.includes("encountered") && (this["~standard"].async = !0), u.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: n, path: [], parent: u }).then((c) => pn(c) ? {
      value: c.value
    } : {
      issues: u.common.issues
    });
  }
  async parseAsync(n, r) {
    const a = await this.safeParseAsync(n, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  async safeParseAsync(n, r) {
    const a = {
      common: {
        issues: [],
        contextualErrorMap: r == null ? void 0 : r.errorMap,
        async: !0
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: n,
      parsedType: $t(n)
    }, u = this._parse({ data: n, path: a.path, parent: a }), c = await (Er(u) ? u : Promise.resolve(u));
    return Zc(a, c);
  }
  refine(n, r) {
    const a = (u) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(u) : r;
    return this._refinement((u, c) => {
      const p = n(u), _ = () => c.addIssue({
        code: A.custom,
        ...a(u)
      });
      return typeof Promise < "u" && p instanceof Promise ? p.then((y) => y ? !0 : (_(), !1)) : p ? !0 : (_(), !1);
    });
  }
  refinement(n, r) {
    return this._refinement((a, u) => n(a) ? !0 : (u.addIssue(typeof r == "function" ? r(a, u) : r), !1));
  }
  _refinement(n) {
    return new pt({
      schema: this,
      typeName: W.ZodEffects,
      effect: { type: "refinement", refinement: n }
    });
  }
  superRefine(n) {
    return this._refinement(n);
  }
  constructor(n) {
    this.spa = this.safeParseAsync, this._def = n, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (r) => this["~validate"](r)
    };
  }
  optional() {
    return xt.create(this, this._def);
  }
  nullable() {
    return Xt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ht.create(this);
  }
  promise() {
    return Vn.create(this, this._def);
  }
  or(n) {
    return Ir.create([this, n], this._def);
  }
  and(n) {
    return Or.create(this, n, this._def);
  }
  transform(n) {
    return new pt({
      ...z(this._def),
      schema: this,
      typeName: W.ZodEffects,
      effect: { type: "transform", transform: n }
    });
  }
  default(n) {
    const r = typeof n == "function" ? n : () => n;
    return new Mr({
      ...z(this._def),
      innerType: this,
      defaultValue: r,
      typeName: W.ZodDefault
    });
  }
  brand() {
    return new Ja({
      typeName: W.ZodBranded,
      type: this,
      ...z(this._def)
    });
  }
  catch(n) {
    const r = typeof n == "function" ? n : () => n;
    return new Ur({
      ...z(this._def),
      innerType: this,
      catchValue: r,
      typeName: W.ZodCatch
    });
  }
  describe(n) {
    const r = this.constructor;
    return new r({
      ...this._def,
      description: n
    });
  }
  pipe(n) {
    return Zr.create(this, n);
  }
  readonly() {
    return $r.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Wv = /^c[^\s-]{8,}$/i, qv = /^[0-9a-z]+$/, Bv = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Fv = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Hv = /^[a-z0-9_-]{21}$/i, zv = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, jv = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Vv = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Gv = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ta;
const Kv = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Jv = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Yv = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Xv = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Qv = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, e0 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, ul = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", t0 = new RegExp(`^${ul}$`);
function cl(s) {
  let n = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return s.precision ? n = `${n}\\.\\d{${s.precision}}` : s.precision == null && (n = `${n}(\\.\\d+)?`), n;
}
function n0(s) {
  return new RegExp(`^${cl(s)}$`);
}
function ll(s) {
  let n = `${ul}T${cl(s)}`;
  const r = [];
  return r.push(s.local ? "Z?" : "Z"), s.offset && r.push("([+-]\\d{2}:?\\d{2})"), n = `${n}(${r.join("|")})`, new RegExp(`^${n}$`);
}
function r0(s, n) {
  return !!((n === "v4" || !n) && Kv.test(s) || (n === "v6" || !n) && Yv.test(s));
}
function i0(s, n) {
  if (!zv.test(s))
    return !1;
  try {
    const [r] = s.split("."), a = r.replace(/-/g, "+").replace(/_/g, "/").padEnd(r.length + (4 - r.length % 4) % 4, "="), u = JSON.parse(atob(a));
    return !(typeof u != "object" || u === null || !u.typ || !u.alg || n && u.alg !== n);
  } catch {
    return !1;
  }
}
function s0(s, n) {
  return !!((n === "v4" || !n) && Jv.test(s) || (n === "v6" || !n) && Xv.test(s));
}
class dt extends G {
  _parse(n) {
    if (this._def.coerce && (n.data = String(n.data)), this._getType(n) !== P.string) {
      const c = this._getOrReturnCtx(n);
      return k(c, {
        code: A.invalid_type,
        expected: P.string,
        received: c.parsedType
      }), q;
    }
    const a = new Oe();
    let u;
    for (const c of this._def.checks)
      if (c.kind === "min")
        n.data.length < c.value && (u = this._getOrReturnCtx(n, u), k(u, {
          code: A.too_small,
          minimum: c.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: c.message
        }), a.dirty());
      else if (c.kind === "max")
        n.data.length > c.value && (u = this._getOrReturnCtx(n, u), k(u, {
          code: A.too_big,
          maximum: c.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: c.message
        }), a.dirty());
      else if (c.kind === "length") {
        const p = n.data.length > c.value, _ = n.data.length < c.value;
        (p || _) && (u = this._getOrReturnCtx(n, u), p ? k(u, {
          code: A.too_big,
          maximum: c.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: c.message
        }) : _ && k(u, {
          code: A.too_small,
          minimum: c.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: c.message
        }), a.dirty());
      } else if (c.kind === "email")
        Vv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "email",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "emoji")
        Ta || (Ta = new RegExp(Gv, "u")), Ta.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "emoji",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "uuid")
        Fv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "uuid",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "nanoid")
        Hv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "nanoid",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "cuid")
        Wv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "cuid",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "cuid2")
        qv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "cuid2",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "ulid")
        Bv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
          validation: "ulid",
          code: A.invalid_string,
          message: c.message
        }), a.dirty());
      else if (c.kind === "url")
        try {
          new URL(n.data);
        } catch {
          u = this._getOrReturnCtx(n, u), k(u, {
            validation: "url",
            code: A.invalid_string,
            message: c.message
          }), a.dirty();
        }
      else c.kind === "regex" ? (c.regex.lastIndex = 0, c.regex.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "regex",
        code: A.invalid_string,
        message: c.message
      }), a.dirty())) : c.kind === "trim" ? n.data = n.data.trim() : c.kind === "includes" ? n.data.includes(c.value, c.position) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: { includes: c.value, position: c.position },
        message: c.message
      }), a.dirty()) : c.kind === "toLowerCase" ? n.data = n.data.toLowerCase() : c.kind === "toUpperCase" ? n.data = n.data.toUpperCase() : c.kind === "startsWith" ? n.data.startsWith(c.value) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: { startsWith: c.value },
        message: c.message
      }), a.dirty()) : c.kind === "endsWith" ? n.data.endsWith(c.value) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: { endsWith: c.value },
        message: c.message
      }), a.dirty()) : c.kind === "datetime" ? ll(c).test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: "datetime",
        message: c.message
      }), a.dirty()) : c.kind === "date" ? t0.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: "date",
        message: c.message
      }), a.dirty()) : c.kind === "time" ? n0(c).test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.invalid_string,
        validation: "time",
        message: c.message
      }), a.dirty()) : c.kind === "duration" ? jv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "duration",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : c.kind === "ip" ? r0(n.data, c.version) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "ip",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : c.kind === "jwt" ? i0(n.data, c.alg) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "jwt",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : c.kind === "cidr" ? s0(n.data, c.version) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "cidr",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : c.kind === "base64" ? Qv.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "base64",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : c.kind === "base64url" ? e0.test(n.data) || (u = this._getOrReturnCtx(n, u), k(u, {
        validation: "base64url",
        code: A.invalid_string,
        message: c.message
      }), a.dirty()) : re.assertNever(c);
    return { status: a.value, value: n.data };
  }
  _regex(n, r, a) {
    return this.refinement((u) => n.test(u), {
      validation: r,
      code: A.invalid_string,
      ...M.errToObj(a)
    });
  }
  _addCheck(n) {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, n]
    });
  }
  email(n) {
    return this._addCheck({ kind: "email", ...M.errToObj(n) });
  }
  url(n) {
    return this._addCheck({ kind: "url", ...M.errToObj(n) });
  }
  emoji(n) {
    return this._addCheck({ kind: "emoji", ...M.errToObj(n) });
  }
  uuid(n) {
    return this._addCheck({ kind: "uuid", ...M.errToObj(n) });
  }
  nanoid(n) {
    return this._addCheck({ kind: "nanoid", ...M.errToObj(n) });
  }
  cuid(n) {
    return this._addCheck({ kind: "cuid", ...M.errToObj(n) });
  }
  cuid2(n) {
    return this._addCheck({ kind: "cuid2", ...M.errToObj(n) });
  }
  ulid(n) {
    return this._addCheck({ kind: "ulid", ...M.errToObj(n) });
  }
  base64(n) {
    return this._addCheck({ kind: "base64", ...M.errToObj(n) });
  }
  base64url(n) {
    return this._addCheck({
      kind: "base64url",
      ...M.errToObj(n)
    });
  }
  jwt(n) {
    return this._addCheck({ kind: "jwt", ...M.errToObj(n) });
  }
  ip(n) {
    return this._addCheck({ kind: "ip", ...M.errToObj(n) });
  }
  cidr(n) {
    return this._addCheck({ kind: "cidr", ...M.errToObj(n) });
  }
  datetime(n) {
    var r, a;
    return typeof n == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: n
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (n == null ? void 0 : n.precision) > "u" ? null : n == null ? void 0 : n.precision,
      offset: (r = n == null ? void 0 : n.offset) !== null && r !== void 0 ? r : !1,
      local: (a = n == null ? void 0 : n.local) !== null && a !== void 0 ? a : !1,
      ...M.errToObj(n == null ? void 0 : n.message)
    });
  }
  date(n) {
    return this._addCheck({ kind: "date", message: n });
  }
  time(n) {
    return typeof n == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: n
    }) : this._addCheck({
      kind: "time",
      precision: typeof (n == null ? void 0 : n.precision) > "u" ? null : n == null ? void 0 : n.precision,
      ...M.errToObj(n == null ? void 0 : n.message)
    });
  }
  duration(n) {
    return this._addCheck({ kind: "duration", ...M.errToObj(n) });
  }
  regex(n, r) {
    return this._addCheck({
      kind: "regex",
      regex: n,
      ...M.errToObj(r)
    });
  }
  includes(n, r) {
    return this._addCheck({
      kind: "includes",
      value: n,
      position: r == null ? void 0 : r.position,
      ...M.errToObj(r == null ? void 0 : r.message)
    });
  }
  startsWith(n, r) {
    return this._addCheck({
      kind: "startsWith",
      value: n,
      ...M.errToObj(r)
    });
  }
  endsWith(n, r) {
    return this._addCheck({
      kind: "endsWith",
      value: n,
      ...M.errToObj(r)
    });
  }
  min(n, r) {
    return this._addCheck({
      kind: "min",
      value: n,
      ...M.errToObj(r)
    });
  }
  max(n, r) {
    return this._addCheck({
      kind: "max",
      value: n,
      ...M.errToObj(r)
    });
  }
  length(n, r) {
    return this._addCheck({
      kind: "length",
      value: n,
      ...M.errToObj(r)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(n) {
    return this.min(1, M.errToObj(n));
  }
  trim() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((n) => n.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((n) => n.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((n) => n.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((n) => n.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((n) => n.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((n) => n.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((n) => n.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((n) => n.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((n) => n.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((n) => n.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((n) => n.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((n) => n.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((n) => n.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((n) => n.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((n) => n.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((n) => n.kind === "base64url");
  }
  get minLength() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "min" && (n === null || r.value > n) && (n = r.value);
    return n;
  }
  get maxLength() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "max" && (n === null || r.value < n) && (n = r.value);
    return n;
  }
}
dt.create = (s) => {
  var n;
  return new dt({
    checks: [],
    typeName: W.ZodString,
    coerce: (n = s == null ? void 0 : s.coerce) !== null && n !== void 0 ? n : !1,
    ...z(s)
  });
};
function a0(s, n) {
  const r = (s.toString().split(".")[1] || "").length, a = (n.toString().split(".")[1] || "").length, u = r > a ? r : a, c = parseInt(s.toFixed(u).replace(".", "")), p = parseInt(n.toFixed(u).replace(".", ""));
  return c % p / Math.pow(10, u);
}
class Kt extends G {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(n) {
    if (this._def.coerce && (n.data = Number(n.data)), this._getType(n) !== P.number) {
      const c = this._getOrReturnCtx(n);
      return k(c, {
        code: A.invalid_type,
        expected: P.number,
        received: c.parsedType
      }), q;
    }
    let a;
    const u = new Oe();
    for (const c of this._def.checks)
      c.kind === "int" ? re.isInteger(n.data) || (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.invalid_type,
        expected: "integer",
        received: "float",
        message: c.message
      }), u.dirty()) : c.kind === "min" ? (c.inclusive ? n.data < c.value : n.data <= c.value) && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.too_small,
        minimum: c.value,
        type: "number",
        inclusive: c.inclusive,
        exact: !1,
        message: c.message
      }), u.dirty()) : c.kind === "max" ? (c.inclusive ? n.data > c.value : n.data >= c.value) && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.too_big,
        maximum: c.value,
        type: "number",
        inclusive: c.inclusive,
        exact: !1,
        message: c.message
      }), u.dirty()) : c.kind === "multipleOf" ? a0(n.data, c.value) !== 0 && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.not_multiple_of,
        multipleOf: c.value,
        message: c.message
      }), u.dirty()) : c.kind === "finite" ? Number.isFinite(n.data) || (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.not_finite,
        message: c.message
      }), u.dirty()) : re.assertNever(c);
    return { status: u.value, value: n.data };
  }
  gte(n, r) {
    return this.setLimit("min", n, !0, M.toString(r));
  }
  gt(n, r) {
    return this.setLimit("min", n, !1, M.toString(r));
  }
  lte(n, r) {
    return this.setLimit("max", n, !0, M.toString(r));
  }
  lt(n, r) {
    return this.setLimit("max", n, !1, M.toString(r));
  }
  setLimit(n, r, a, u) {
    return new Kt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: n,
          value: r,
          inclusive: a,
          message: M.toString(u)
        }
      ]
    });
  }
  _addCheck(n) {
    return new Kt({
      ...this._def,
      checks: [...this._def.checks, n]
    });
  }
  int(n) {
    return this._addCheck({
      kind: "int",
      message: M.toString(n)
    });
  }
  positive(n) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: M.toString(n)
    });
  }
  negative(n) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: M.toString(n)
    });
  }
  nonpositive(n) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: M.toString(n)
    });
  }
  nonnegative(n) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: M.toString(n)
    });
  }
  multipleOf(n, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: n,
      message: M.toString(r)
    });
  }
  finite(n) {
    return this._addCheck({
      kind: "finite",
      message: M.toString(n)
    });
  }
  safe(n) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: M.toString(n)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: M.toString(n)
    });
  }
  get minValue() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "min" && (n === null || r.value > n) && (n = r.value);
    return n;
  }
  get maxValue() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "max" && (n === null || r.value < n) && (n = r.value);
    return n;
  }
  get isInt() {
    return !!this._def.checks.find((n) => n.kind === "int" || n.kind === "multipleOf" && re.isInteger(n.value));
  }
  get isFinite() {
    let n = null, r = null;
    for (const a of this._def.checks) {
      if (a.kind === "finite" || a.kind === "int" || a.kind === "multipleOf")
        return !0;
      a.kind === "min" ? (r === null || a.value > r) && (r = a.value) : a.kind === "max" && (n === null || a.value < n) && (n = a.value);
    }
    return Number.isFinite(r) && Number.isFinite(n);
  }
}
Kt.create = (s) => new Kt({
  checks: [],
  typeName: W.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...z(s)
});
class Jt extends G {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(n) {
    if (this._def.coerce)
      try {
        n.data = BigInt(n.data);
      } catch {
        return this._getInvalidInput(n);
      }
    if (this._getType(n) !== P.bigint)
      return this._getInvalidInput(n);
    let a;
    const u = new Oe();
    for (const c of this._def.checks)
      c.kind === "min" ? (c.inclusive ? n.data < c.value : n.data <= c.value) && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.too_small,
        type: "bigint",
        minimum: c.value,
        inclusive: c.inclusive,
        message: c.message
      }), u.dirty()) : c.kind === "max" ? (c.inclusive ? n.data > c.value : n.data >= c.value) && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.too_big,
        type: "bigint",
        maximum: c.value,
        inclusive: c.inclusive,
        message: c.message
      }), u.dirty()) : c.kind === "multipleOf" ? n.data % c.value !== BigInt(0) && (a = this._getOrReturnCtx(n, a), k(a, {
        code: A.not_multiple_of,
        multipleOf: c.value,
        message: c.message
      }), u.dirty()) : re.assertNever(c);
    return { status: u.value, value: n.data };
  }
  _getInvalidInput(n) {
    const r = this._getOrReturnCtx(n);
    return k(r, {
      code: A.invalid_type,
      expected: P.bigint,
      received: r.parsedType
    }), q;
  }
  gte(n, r) {
    return this.setLimit("min", n, !0, M.toString(r));
  }
  gt(n, r) {
    return this.setLimit("min", n, !1, M.toString(r));
  }
  lte(n, r) {
    return this.setLimit("max", n, !0, M.toString(r));
  }
  lt(n, r) {
    return this.setLimit("max", n, !1, M.toString(r));
  }
  setLimit(n, r, a, u) {
    return new Jt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: n,
          value: r,
          inclusive: a,
          message: M.toString(u)
        }
      ]
    });
  }
  _addCheck(n) {
    return new Jt({
      ...this._def,
      checks: [...this._def.checks, n]
    });
  }
  positive(n) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: M.toString(n)
    });
  }
  negative(n) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: M.toString(n)
    });
  }
  nonpositive(n) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: M.toString(n)
    });
  }
  nonnegative(n) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: M.toString(n)
    });
  }
  multipleOf(n, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: n,
      message: M.toString(r)
    });
  }
  get minValue() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "min" && (n === null || r.value > n) && (n = r.value);
    return n;
  }
  get maxValue() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "max" && (n === null || r.value < n) && (n = r.value);
    return n;
  }
}
Jt.create = (s) => {
  var n;
  return new Jt({
    checks: [],
    typeName: W.ZodBigInt,
    coerce: (n = s == null ? void 0 : s.coerce) !== null && n !== void 0 ? n : !1,
    ...z(s)
  });
};
class Rr extends G {
  _parse(n) {
    if (this._def.coerce && (n.data = !!n.data), this._getType(n) !== P.boolean) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.boolean,
        received: a.parsedType
      }), q;
    }
    return Me(n.data);
  }
}
Rr.create = (s) => new Rr({
  typeName: W.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...z(s)
});
class gn extends G {
  _parse(n) {
    if (this._def.coerce && (n.data = new Date(n.data)), this._getType(n) !== P.date) {
      const c = this._getOrReturnCtx(n);
      return k(c, {
        code: A.invalid_type,
        expected: P.date,
        received: c.parsedType
      }), q;
    }
    if (isNaN(n.data.getTime())) {
      const c = this._getOrReturnCtx(n);
      return k(c, {
        code: A.invalid_date
      }), q;
    }
    const a = new Oe();
    let u;
    for (const c of this._def.checks)
      c.kind === "min" ? n.data.getTime() < c.value && (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.too_small,
        message: c.message,
        inclusive: !0,
        exact: !1,
        minimum: c.value,
        type: "date"
      }), a.dirty()) : c.kind === "max" ? n.data.getTime() > c.value && (u = this._getOrReturnCtx(n, u), k(u, {
        code: A.too_big,
        message: c.message,
        inclusive: !0,
        exact: !1,
        maximum: c.value,
        type: "date"
      }), a.dirty()) : re.assertNever(c);
    return {
      status: a.value,
      value: new Date(n.data.getTime())
    };
  }
  _addCheck(n) {
    return new gn({
      ...this._def,
      checks: [...this._def.checks, n]
    });
  }
  min(n, r) {
    return this._addCheck({
      kind: "min",
      value: n.getTime(),
      message: M.toString(r)
    });
  }
  max(n, r) {
    return this._addCheck({
      kind: "max",
      value: n.getTime(),
      message: M.toString(r)
    });
  }
  get minDate() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "min" && (n === null || r.value > n) && (n = r.value);
    return n != null ? new Date(n) : null;
  }
  get maxDate() {
    let n = null;
    for (const r of this._def.checks)
      r.kind === "max" && (n === null || r.value < n) && (n = r.value);
    return n != null ? new Date(n) : null;
  }
}
gn.create = (s) => new gn({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: W.ZodDate,
  ...z(s)
});
class Fi extends G {
  _parse(n) {
    if (this._getType(n) !== P.symbol) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.symbol,
        received: a.parsedType
      }), q;
    }
    return Me(n.data);
  }
}
Fi.create = (s) => new Fi({
  typeName: W.ZodSymbol,
  ...z(s)
});
class Cr extends G {
  _parse(n) {
    if (this._getType(n) !== P.undefined) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.undefined,
        received: a.parsedType
      }), q;
    }
    return Me(n.data);
  }
}
Cr.create = (s) => new Cr({
  typeName: W.ZodUndefined,
  ...z(s)
});
class Ar extends G {
  _parse(n) {
    if (this._getType(n) !== P.null) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.null,
        received: a.parsedType
      }), q;
    }
    return Me(n.data);
  }
}
Ar.create = (s) => new Ar({
  typeName: W.ZodNull,
  ...z(s)
});
class jn extends G {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(n) {
    return Me(n.data);
  }
}
jn.create = (s) => new jn({
  typeName: W.ZodAny,
  ...z(s)
});
class hn extends G {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(n) {
    return Me(n.data);
  }
}
hn.create = (s) => new hn({
  typeName: W.ZodUnknown,
  ...z(s)
});
class Zt extends G {
  _parse(n) {
    const r = this._getOrReturnCtx(n);
    return k(r, {
      code: A.invalid_type,
      expected: P.never,
      received: r.parsedType
    }), q;
  }
}
Zt.create = (s) => new Zt({
  typeName: W.ZodNever,
  ...z(s)
});
class Hi extends G {
  _parse(n) {
    if (this._getType(n) !== P.undefined) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.void,
        received: a.parsedType
      }), q;
    }
    return Me(n.data);
  }
}
Hi.create = (s) => new Hi({
  typeName: W.ZodVoid,
  ...z(s)
});
class ht extends G {
  _parse(n) {
    const { ctx: r, status: a } = this._processInputParams(n), u = this._def;
    if (r.parsedType !== P.array)
      return k(r, {
        code: A.invalid_type,
        expected: P.array,
        received: r.parsedType
      }), q;
    if (u.exactLength !== null) {
      const p = r.data.length > u.exactLength.value, _ = r.data.length < u.exactLength.value;
      (p || _) && (k(r, {
        code: p ? A.too_big : A.too_small,
        minimum: _ ? u.exactLength.value : void 0,
        maximum: p ? u.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: u.exactLength.message
      }), a.dirty());
    }
    if (u.minLength !== null && r.data.length < u.minLength.value && (k(r, {
      code: A.too_small,
      minimum: u.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: u.minLength.message
    }), a.dirty()), u.maxLength !== null && r.data.length > u.maxLength.value && (k(r, {
      code: A.too_big,
      maximum: u.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: u.maxLength.message
    }), a.dirty()), r.common.async)
      return Promise.all([...r.data].map((p, _) => u.type._parseAsync(new bt(r, p, r.path, _)))).then((p) => Oe.mergeArray(a, p));
    const c = [...r.data].map((p, _) => u.type._parseSync(new bt(r, p, r.path, _)));
    return Oe.mergeArray(a, c);
  }
  get element() {
    return this._def.type;
  }
  min(n, r) {
    return new ht({
      ...this._def,
      minLength: { value: n, message: M.toString(r) }
    });
  }
  max(n, r) {
    return new ht({
      ...this._def,
      maxLength: { value: n, message: M.toString(r) }
    });
  }
  length(n, r) {
    return new ht({
      ...this._def,
      exactLength: { value: n, message: M.toString(r) }
    });
  }
  nonempty(n) {
    return this.min(1, n);
  }
}
ht.create = (s, n) => new ht({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: W.ZodArray,
  ...z(n)
});
function Mn(s) {
  if (s instanceof ge) {
    const n = {};
    for (const r in s.shape) {
      const a = s.shape[r];
      n[r] = xt.create(Mn(a));
    }
    return new ge({
      ...s._def,
      shape: () => n
    });
  } else return s instanceof ht ? new ht({
    ...s._def,
    type: Mn(s.element)
  }) : s instanceof xt ? xt.create(Mn(s.unwrap())) : s instanceof Xt ? Xt.create(Mn(s.unwrap())) : s instanceof St ? St.create(s.items.map((n) => Mn(n))) : s;
}
class ge extends G {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const n = this._def.shape(), r = re.objectKeys(n);
    return this._cached = { shape: n, keys: r };
  }
  _parse(n) {
    if (this._getType(n) !== P.object) {
      const w = this._getOrReturnCtx(n);
      return k(w, {
        code: A.invalid_type,
        expected: P.object,
        received: w.parsedType
      }), q;
    }
    const { status: a, ctx: u } = this._processInputParams(n), { shape: c, keys: p } = this._getCached(), _ = [];
    if (!(this._def.catchall instanceof Zt && this._def.unknownKeys === "strip"))
      for (const w in u.data)
        p.includes(w) || _.push(w);
    const y = [];
    for (const w of p) {
      const S = c[w], I = u.data[w];
      y.push({
        key: { status: "valid", value: w },
        value: S._parse(new bt(u, I, u.path, w)),
        alwaysSet: w in u.data
      });
    }
    if (this._def.catchall instanceof Zt) {
      const w = this._def.unknownKeys;
      if (w === "passthrough")
        for (const S of _)
          y.push({
            key: { status: "valid", value: S },
            value: { status: "valid", value: u.data[S] }
          });
      else if (w === "strict")
        _.length > 0 && (k(u, {
          code: A.unrecognized_keys,
          keys: _
        }), a.dirty());
      else if (w !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const w = this._def.catchall;
      for (const S of _) {
        const I = u.data[S];
        y.push({
          key: { status: "valid", value: S },
          value: w._parse(
            new bt(u, I, u.path, S)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: S in u.data
        });
      }
    }
    return u.common.async ? Promise.resolve().then(async () => {
      const w = [];
      for (const S of y) {
        const I = await S.key, X = await S.value;
        w.push({
          key: I,
          value: X,
          alwaysSet: S.alwaysSet
        });
      }
      return w;
    }).then((w) => Oe.mergeObjectSync(a, w)) : Oe.mergeObjectSync(a, y);
  }
  get shape() {
    return this._def.shape();
  }
  strict(n) {
    return M.errToObj, new ge({
      ...this._def,
      unknownKeys: "strict",
      ...n !== void 0 ? {
        errorMap: (r, a) => {
          var u, c, p, _;
          const y = (p = (c = (u = this._def).errorMap) === null || c === void 0 ? void 0 : c.call(u, r, a).message) !== null && p !== void 0 ? p : a.defaultError;
          return r.code === "unrecognized_keys" ? {
            message: (_ = M.errToObj(n).message) !== null && _ !== void 0 ? _ : y
          } : {
            message: y
          };
        }
      } : {}
    });
  }
  strip() {
    return new ge({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ge({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(n) {
    return new ge({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...n
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(n) {
    return new ge({
      unknownKeys: n._def.unknownKeys,
      catchall: n._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...n._def.shape()
      }),
      typeName: W.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(n, r) {
    return this.augment({ [n]: r });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(n) {
    return new ge({
      ...this._def,
      catchall: n
    });
  }
  pick(n) {
    const r = {};
    return re.objectKeys(n).forEach((a) => {
      n[a] && this.shape[a] && (r[a] = this.shape[a]);
    }), new ge({
      ...this._def,
      shape: () => r
    });
  }
  omit(n) {
    const r = {};
    return re.objectKeys(this.shape).forEach((a) => {
      n[a] || (r[a] = this.shape[a]);
    }), new ge({
      ...this._def,
      shape: () => r
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Mn(this);
  }
  partial(n) {
    const r = {};
    return re.objectKeys(this.shape).forEach((a) => {
      const u = this.shape[a];
      n && !n[a] ? r[a] = u : r[a] = u.optional();
    }), new ge({
      ...this._def,
      shape: () => r
    });
  }
  required(n) {
    const r = {};
    return re.objectKeys(this.shape).forEach((a) => {
      if (n && !n[a])
        r[a] = this.shape[a];
      else {
        let c = this.shape[a];
        for (; c instanceof xt; )
          c = c._def.innerType;
        r[a] = c;
      }
    }), new ge({
      ...this._def,
      shape: () => r
    });
  }
  keyof() {
    return fl(re.objectKeys(this.shape));
  }
}
ge.create = (s, n) => new ge({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Zt.create(),
  typeName: W.ZodObject,
  ...z(n)
});
ge.strictCreate = (s, n) => new ge({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Zt.create(),
  typeName: W.ZodObject,
  ...z(n)
});
ge.lazycreate = (s, n) => new ge({
  shape: s,
  unknownKeys: "strip",
  catchall: Zt.create(),
  typeName: W.ZodObject,
  ...z(n)
});
class Ir extends G {
  _parse(n) {
    const { ctx: r } = this._processInputParams(n), a = this._def.options;
    function u(c) {
      for (const _ of c)
        if (_.result.status === "valid")
          return _.result;
      for (const _ of c)
        if (_.result.status === "dirty")
          return r.common.issues.push(..._.ctx.common.issues), _.result;
      const p = c.map((_) => new Ge(_.ctx.common.issues));
      return k(r, {
        code: A.invalid_union,
        unionErrors: p
      }), q;
    }
    if (r.common.async)
      return Promise.all(a.map(async (c) => {
        const p = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await c._parseAsync({
            data: r.data,
            path: r.path,
            parent: p
          }),
          ctx: p
        };
      })).then(u);
    {
      let c;
      const p = [];
      for (const y of a) {
        const w = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        }, S = y._parseSync({
          data: r.data,
          path: r.path,
          parent: w
        });
        if (S.status === "valid")
          return S;
        S.status === "dirty" && !c && (c = { result: S, ctx: w }), w.common.issues.length && p.push(w.common.issues);
      }
      if (c)
        return r.common.issues.push(...c.ctx.common.issues), c.result;
      const _ = p.map((y) => new Ge(y));
      return k(r, {
        code: A.invalid_union,
        unionErrors: _
      }), q;
    }
  }
  get options() {
    return this._def.options;
  }
}
Ir.create = (s, n) => new Ir({
  options: s,
  typeName: W.ZodUnion,
  ...z(n)
});
const Mt = (s) => s instanceof Pr ? Mt(s.schema) : s instanceof pt ? Mt(s.innerType()) : s instanceof Nr ? [s.value] : s instanceof Yt ? s.options : s instanceof Lr ? re.objectValues(s.enum) : s instanceof Mr ? Mt(s._def.innerType) : s instanceof Cr ? [void 0] : s instanceof Ar ? [null] : s instanceof xt ? [void 0, ...Mt(s.unwrap())] : s instanceof Xt ? [null, ...Mt(s.unwrap())] : s instanceof Ja || s instanceof $r ? Mt(s.unwrap()) : s instanceof Ur ? Mt(s._def.innerType) : [];
class Gi extends G {
  _parse(n) {
    const { ctx: r } = this._processInputParams(n);
    if (r.parsedType !== P.object)
      return k(r, {
        code: A.invalid_type,
        expected: P.object,
        received: r.parsedType
      }), q;
    const a = this.discriminator, u = r.data[a], c = this.optionsMap.get(u);
    return c ? r.common.async ? c._parseAsync({
      data: r.data,
      path: r.path,
      parent: r
    }) : c._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }) : (k(r, {
      code: A.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), q);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(n, r, a) {
    const u = /* @__PURE__ */ new Map();
    for (const c of r) {
      const p = Mt(c.shape[n]);
      if (!p.length)
        throw new Error(`A discriminator value for key \`${n}\` could not be extracted from all schema options`);
      for (const _ of p) {
        if (u.has(_))
          throw new Error(`Discriminator property ${String(n)} has duplicate value ${String(_)}`);
        u.set(_, c);
      }
    }
    return new Gi({
      typeName: W.ZodDiscriminatedUnion,
      discriminator: n,
      options: r,
      optionsMap: u,
      ...z(a)
    });
  }
}
function qa(s, n) {
  const r = $t(s), a = $t(n);
  if (s === n)
    return { valid: !0, data: s };
  if (r === P.object && a === P.object) {
    const u = re.objectKeys(n), c = re.objectKeys(s).filter((_) => u.indexOf(_) !== -1), p = { ...s, ...n };
    for (const _ of c) {
      const y = qa(s[_], n[_]);
      if (!y.valid)
        return { valid: !1 };
      p[_] = y.data;
    }
    return { valid: !0, data: p };
  } else if (r === P.array && a === P.array) {
    if (s.length !== n.length)
      return { valid: !1 };
    const u = [];
    for (let c = 0; c < s.length; c++) {
      const p = s[c], _ = n[c], y = qa(p, _);
      if (!y.valid)
        return { valid: !1 };
      u.push(y.data);
    }
    return { valid: !0, data: u };
  } else return r === P.date && a === P.date && +s == +n ? { valid: !0, data: s } : { valid: !1 };
}
class Or extends G {
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n), u = (c, p) => {
      if (Da(c) || Da(p))
        return q;
      const _ = qa(c.value, p.value);
      return _.valid ? ((Wa(c) || Wa(p)) && r.dirty(), { status: r.value, value: _.data }) : (k(a, {
        code: A.invalid_intersection_types
      }), q);
    };
    return a.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      }),
      this._def.right._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      })
    ]).then(([c, p]) => u(c, p)) : u(this._def.left._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }), this._def.right._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }));
  }
}
Or.create = (s, n, r) => new Or({
  left: s,
  right: n,
  typeName: W.ZodIntersection,
  ...z(r)
});
class St extends G {
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n);
    if (a.parsedType !== P.array)
      return k(a, {
        code: A.invalid_type,
        expected: P.array,
        received: a.parsedType
      }), q;
    if (a.data.length < this._def.items.length)
      return k(a, {
        code: A.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), q;
    !this._def.rest && a.data.length > this._def.items.length && (k(a, {
      code: A.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), r.dirty());
    const c = [...a.data].map((p, _) => {
      const y = this._def.items[_] || this._def.rest;
      return y ? y._parse(new bt(a, p, a.path, _)) : null;
    }).filter((p) => !!p);
    return a.common.async ? Promise.all(c).then((p) => Oe.mergeArray(r, p)) : Oe.mergeArray(r, c);
  }
  get items() {
    return this._def.items;
  }
  rest(n) {
    return new St({
      ...this._def,
      rest: n
    });
  }
}
St.create = (s, n) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new St({
    items: s,
    typeName: W.ZodTuple,
    rest: null,
    ...z(n)
  });
};
class kr extends G {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n);
    if (a.parsedType !== P.object)
      return k(a, {
        code: A.invalid_type,
        expected: P.object,
        received: a.parsedType
      }), q;
    const u = [], c = this._def.keyType, p = this._def.valueType;
    for (const _ in a.data)
      u.push({
        key: c._parse(new bt(a, _, a.path, _)),
        value: p._parse(new bt(a, a.data[_], a.path, _)),
        alwaysSet: _ in a.data
      });
    return a.common.async ? Oe.mergeObjectAsync(r, u) : Oe.mergeObjectSync(r, u);
  }
  get element() {
    return this._def.valueType;
  }
  static create(n, r, a) {
    return r instanceof G ? new kr({
      keyType: n,
      valueType: r,
      typeName: W.ZodRecord,
      ...z(a)
    }) : new kr({
      keyType: dt.create(),
      valueType: n,
      typeName: W.ZodRecord,
      ...z(r)
    });
  }
}
class zi extends G {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n);
    if (a.parsedType !== P.map)
      return k(a, {
        code: A.invalid_type,
        expected: P.map,
        received: a.parsedType
      }), q;
    const u = this._def.keyType, c = this._def.valueType, p = [...a.data.entries()].map(([_, y], w) => ({
      key: u._parse(new bt(a, _, a.path, [w, "key"])),
      value: c._parse(new bt(a, y, a.path, [w, "value"]))
    }));
    if (a.common.async) {
      const _ = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const y of p) {
          const w = await y.key, S = await y.value;
          if (w.status === "aborted" || S.status === "aborted")
            return q;
          (w.status === "dirty" || S.status === "dirty") && r.dirty(), _.set(w.value, S.value);
        }
        return { status: r.value, value: _ };
      });
    } else {
      const _ = /* @__PURE__ */ new Map();
      for (const y of p) {
        const w = y.key, S = y.value;
        if (w.status === "aborted" || S.status === "aborted")
          return q;
        (w.status === "dirty" || S.status === "dirty") && r.dirty(), _.set(w.value, S.value);
      }
      return { status: r.value, value: _ };
    }
  }
}
zi.create = (s, n, r) => new zi({
  valueType: n,
  keyType: s,
  typeName: W.ZodMap,
  ...z(r)
});
class _n extends G {
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n);
    if (a.parsedType !== P.set)
      return k(a, {
        code: A.invalid_type,
        expected: P.set,
        received: a.parsedType
      }), q;
    const u = this._def;
    u.minSize !== null && a.data.size < u.minSize.value && (k(a, {
      code: A.too_small,
      minimum: u.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: u.minSize.message
    }), r.dirty()), u.maxSize !== null && a.data.size > u.maxSize.value && (k(a, {
      code: A.too_big,
      maximum: u.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: u.maxSize.message
    }), r.dirty());
    const c = this._def.valueType;
    function p(y) {
      const w = /* @__PURE__ */ new Set();
      for (const S of y) {
        if (S.status === "aborted")
          return q;
        S.status === "dirty" && r.dirty(), w.add(S.value);
      }
      return { status: r.value, value: w };
    }
    const _ = [...a.data.values()].map((y, w) => c._parse(new bt(a, y, a.path, w)));
    return a.common.async ? Promise.all(_).then((y) => p(y)) : p(_);
  }
  min(n, r) {
    return new _n({
      ...this._def,
      minSize: { value: n, message: M.toString(r) }
    });
  }
  max(n, r) {
    return new _n({
      ...this._def,
      maxSize: { value: n, message: M.toString(r) }
    });
  }
  size(n, r) {
    return this.min(n, r).max(n, r);
  }
  nonempty(n) {
    return this.min(1, n);
  }
}
_n.create = (s, n) => new _n({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: W.ZodSet,
  ...z(n)
});
class Bn extends G {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(n) {
    const { ctx: r } = this._processInputParams(n);
    if (r.parsedType !== P.function)
      return k(r, {
        code: A.invalid_type,
        expected: P.function,
        received: r.parsedType
      }), q;
    function a(_, y) {
      return qi({
        data: _,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          Wi(),
          zn
        ].filter((w) => !!w),
        issueData: {
          code: A.invalid_arguments,
          argumentsError: y
        }
      });
    }
    function u(_, y) {
      return qi({
        data: _,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          Wi(),
          zn
        ].filter((w) => !!w),
        issueData: {
          code: A.invalid_return_type,
          returnTypeError: y
        }
      });
    }
    const c = { errorMap: r.common.contextualErrorMap }, p = r.data;
    if (this._def.returns instanceof Vn) {
      const _ = this;
      return Me(async function(...y) {
        const w = new Ge([]), S = await _._def.args.parseAsync(y, c).catch((ee) => {
          throw w.addIssue(a(y, ee)), w;
        }), I = await Reflect.apply(p, this, S);
        return await _._def.returns._def.type.parseAsync(I, c).catch((ee) => {
          throw w.addIssue(u(I, ee)), w;
        });
      });
    } else {
      const _ = this;
      return Me(function(...y) {
        const w = _._def.args.safeParse(y, c);
        if (!w.success)
          throw new Ge([a(y, w.error)]);
        const S = Reflect.apply(p, this, w.data), I = _._def.returns.safeParse(S, c);
        if (!I.success)
          throw new Ge([u(S, I.error)]);
        return I.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...n) {
    return new Bn({
      ...this._def,
      args: St.create(n).rest(hn.create())
    });
  }
  returns(n) {
    return new Bn({
      ...this._def,
      returns: n
    });
  }
  implement(n) {
    return this.parse(n);
  }
  strictImplement(n) {
    return this.parse(n);
  }
  static create(n, r, a) {
    return new Bn({
      args: n || St.create([]).rest(hn.create()),
      returns: r || hn.create(),
      typeName: W.ZodFunction,
      ...z(a)
    });
  }
}
class Pr extends G {
  get schema() {
    return this._def.getter();
  }
  _parse(n) {
    const { ctx: r } = this._processInputParams(n);
    return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
  }
}
Pr.create = (s, n) => new Pr({
  getter: s,
  typeName: W.ZodLazy,
  ...z(n)
});
class Nr extends G {
  _parse(n) {
    if (n.data !== this._def.value) {
      const r = this._getOrReturnCtx(n);
      return k(r, {
        received: r.data,
        code: A.invalid_literal,
        expected: this._def.value
      }), q;
    }
    return { status: "valid", value: n.data };
  }
  get value() {
    return this._def.value;
  }
}
Nr.create = (s, n) => new Nr({
  value: s,
  typeName: W.ZodLiteral,
  ...z(n)
});
function fl(s, n) {
  return new Yt({
    values: s,
    typeName: W.ZodEnum,
    ...z(n)
  });
}
class Yt extends G {
  constructor() {
    super(...arguments), mr.set(this, void 0);
  }
  _parse(n) {
    if (typeof n.data != "string") {
      const r = this._getOrReturnCtx(n), a = this._def.values;
      return k(r, {
        expected: re.joinValues(a),
        received: r.parsedType,
        code: A.invalid_type
      }), q;
    }
    if (Bi(this, mr) || ol(this, mr, new Set(this._def.values)), !Bi(this, mr).has(n.data)) {
      const r = this._getOrReturnCtx(n), a = this._def.values;
      return k(r, {
        received: r.data,
        code: A.invalid_enum_value,
        options: a
      }), q;
    }
    return Me(n.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const n = {};
    for (const r of this._def.values)
      n[r] = r;
    return n;
  }
  get Values() {
    const n = {};
    for (const r of this._def.values)
      n[r] = r;
    return n;
  }
  get Enum() {
    const n = {};
    for (const r of this._def.values)
      n[r] = r;
    return n;
  }
  extract(n, r = this._def) {
    return Yt.create(n, {
      ...this._def,
      ...r
    });
  }
  exclude(n, r = this._def) {
    return Yt.create(this.options.filter((a) => !n.includes(a)), {
      ...this._def,
      ...r
    });
  }
}
mr = /* @__PURE__ */ new WeakMap();
Yt.create = fl;
class Lr extends G {
  constructor() {
    super(...arguments), vr.set(this, void 0);
  }
  _parse(n) {
    const r = re.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(n);
    if (a.parsedType !== P.string && a.parsedType !== P.number) {
      const u = re.objectValues(r);
      return k(a, {
        expected: re.joinValues(u),
        received: a.parsedType,
        code: A.invalid_type
      }), q;
    }
    if (Bi(this, vr) || ol(this, vr, new Set(re.getValidEnumValues(this._def.values))), !Bi(this, vr).has(n.data)) {
      const u = re.objectValues(r);
      return k(a, {
        received: a.data,
        code: A.invalid_enum_value,
        options: u
      }), q;
    }
    return Me(n.data);
  }
  get enum() {
    return this._def.values;
  }
}
vr = /* @__PURE__ */ new WeakMap();
Lr.create = (s, n) => new Lr({
  values: s,
  typeName: W.ZodNativeEnum,
  ...z(n)
});
class Vn extends G {
  unwrap() {
    return this._def.type;
  }
  _parse(n) {
    const { ctx: r } = this._processInputParams(n);
    if (r.parsedType !== P.promise && r.common.async === !1)
      return k(r, {
        code: A.invalid_type,
        expected: P.promise,
        received: r.parsedType
      }), q;
    const a = r.parsedType === P.promise ? r.data : Promise.resolve(r.data);
    return Me(a.then((u) => this._def.type.parseAsync(u, {
      path: r.path,
      errorMap: r.common.contextualErrorMap
    })));
  }
}
Vn.create = (s, n) => new Vn({
  type: s,
  typeName: W.ZodPromise,
  ...z(n)
});
class pt extends G {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === W.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n), u = this._def.effect || null, c = {
      addIssue: (p) => {
        k(a, p), p.fatal ? r.abort() : r.dirty();
      },
      get path() {
        return a.path;
      }
    };
    if (c.addIssue = c.addIssue.bind(c), u.type === "preprocess") {
      const p = u.transform(a.data, c);
      if (a.common.async)
        return Promise.resolve(p).then(async (_) => {
          if (r.value === "aborted")
            return q;
          const y = await this._def.schema._parseAsync({
            data: _,
            path: a.path,
            parent: a
          });
          return y.status === "aborted" ? q : y.status === "dirty" || r.value === "dirty" ? Dn(y.value) : y;
        });
      {
        if (r.value === "aborted")
          return q;
        const _ = this._def.schema._parseSync({
          data: p,
          path: a.path,
          parent: a
        });
        return _.status === "aborted" ? q : _.status === "dirty" || r.value === "dirty" ? Dn(_.value) : _;
      }
    }
    if (u.type === "refinement") {
      const p = (_) => {
        const y = u.refinement(_, c);
        if (a.common.async)
          return Promise.resolve(y);
        if (y instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return _;
      };
      if (a.common.async === !1) {
        const _ = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return _.status === "aborted" ? q : (_.status === "dirty" && r.dirty(), p(_.value), { status: r.value, value: _.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((_) => _.status === "aborted" ? q : (_.status === "dirty" && r.dirty(), p(_.value).then(() => ({ status: r.value, value: _.value }))));
    }
    if (u.type === "transform")
      if (a.common.async === !1) {
        const p = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!pn(p))
          return p;
        const _ = u.transform(p.value, c);
        if (_ instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: r.value, value: _ };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((p) => pn(p) ? Promise.resolve(u.transform(p.value, c)).then((_) => ({ status: r.value, value: _ })) : p);
    re.assertNever(u);
  }
}
pt.create = (s, n, r) => new pt({
  schema: s,
  typeName: W.ZodEffects,
  effect: n,
  ...z(r)
});
pt.createWithPreprocess = (s, n, r) => new pt({
  schema: n,
  effect: { type: "preprocess", transform: s },
  typeName: W.ZodEffects,
  ...z(r)
});
class xt extends G {
  _parse(n) {
    return this._getType(n) === P.undefined ? Me(void 0) : this._def.innerType._parse(n);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xt.create = (s, n) => new xt({
  innerType: s,
  typeName: W.ZodOptional,
  ...z(n)
});
class Xt extends G {
  _parse(n) {
    return this._getType(n) === P.null ? Me(null) : this._def.innerType._parse(n);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Xt.create = (s, n) => new Xt({
  innerType: s,
  typeName: W.ZodNullable,
  ...z(n)
});
class Mr extends G {
  _parse(n) {
    const { ctx: r } = this._processInputParams(n);
    let a = r.data;
    return r.parsedType === P.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Mr.create = (s, n) => new Mr({
  innerType: s,
  typeName: W.ZodDefault,
  defaultValue: typeof n.default == "function" ? n.default : () => n.default,
  ...z(n)
});
class Ur extends G {
  _parse(n) {
    const { ctx: r } = this._processInputParams(n), a = {
      ...r,
      common: {
        ...r.common,
        issues: []
      }
    }, u = this._def.innerType._parse({
      data: a.data,
      path: a.path,
      parent: {
        ...a
      }
    });
    return Er(u) ? u.then((c) => ({
      status: "valid",
      value: c.status === "valid" ? c.value : this._def.catchValue({
        get error() {
          return new Ge(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: u.status === "valid" ? u.value : this._def.catchValue({
        get error() {
          return new Ge(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Ur.create = (s, n) => new Ur({
  innerType: s,
  typeName: W.ZodCatch,
  catchValue: typeof n.catch == "function" ? n.catch : () => n.catch,
  ...z(n)
});
class ji extends G {
  _parse(n) {
    if (this._getType(n) !== P.nan) {
      const a = this._getOrReturnCtx(n);
      return k(a, {
        code: A.invalid_type,
        expected: P.nan,
        received: a.parsedType
      }), q;
    }
    return { status: "valid", value: n.data };
  }
}
ji.create = (s) => new ji({
  typeName: W.ZodNaN,
  ...z(s)
});
const o0 = Symbol("zod_brand");
class Ja extends G {
  _parse(n) {
    const { ctx: r } = this._processInputParams(n), a = r.data;
    return this._def.type._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Zr extends G {
  _parse(n) {
    const { status: r, ctx: a } = this._processInputParams(n);
    if (a.common.async)
      return (async () => {
        const c = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return c.status === "aborted" ? q : c.status === "dirty" ? (r.dirty(), Dn(c.value)) : this._def.out._parseAsync({
          data: c.value,
          path: a.path,
          parent: a
        });
      })();
    {
      const u = this._def.in._parseSync({
        data: a.data,
        path: a.path,
        parent: a
      });
      return u.status === "aborted" ? q : u.status === "dirty" ? (r.dirty(), {
        status: "dirty",
        value: u.value
      }) : this._def.out._parseSync({
        data: u.value,
        path: a.path,
        parent: a
      });
    }
  }
  static create(n, r) {
    return new Zr({
      in: n,
      out: r,
      typeName: W.ZodPipeline
    });
  }
}
class $r extends G {
  _parse(n) {
    const r = this._def.innerType._parse(n), a = (u) => (pn(u) && (u.value = Object.freeze(u.value)), u);
    return Er(r) ? r.then((u) => a(u)) : a(r);
  }
  unwrap() {
    return this._def.innerType;
  }
}
$r.create = (s, n) => new $r({
  innerType: s,
  typeName: W.ZodReadonly,
  ...z(n)
});
function Dc(s, n) {
  const r = typeof s == "function" ? s(n) : typeof s == "string" ? { message: s } : s;
  return typeof r == "string" ? { message: r } : r;
}
function dl(s, n = {}, r) {
  return s ? jn.create().superRefine((a, u) => {
    var c, p;
    const _ = s(a);
    if (_ instanceof Promise)
      return _.then((y) => {
        var w, S;
        if (!y) {
          const I = Dc(n, a), X = (S = (w = I.fatal) !== null && w !== void 0 ? w : r) !== null && S !== void 0 ? S : !0;
          u.addIssue({ code: "custom", ...I, fatal: X });
        }
      });
    if (!_) {
      const y = Dc(n, a), w = (p = (c = y.fatal) !== null && c !== void 0 ? c : r) !== null && p !== void 0 ? p : !0;
      u.addIssue({ code: "custom", ...y, fatal: w });
    }
  }) : jn.create();
}
const u0 = {
  object: ge.lazycreate
};
var W;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(W || (W = {}));
const c0 = (s, n = {
  message: `Input not instance of ${s.name}`
}) => dl((r) => r instanceof s, n), hl = dt.create, pl = Kt.create, l0 = ji.create, f0 = Jt.create, gl = Rr.create, d0 = gn.create, h0 = Fi.create, p0 = Cr.create, g0 = Ar.create, _0 = jn.create, m0 = hn.create, v0 = Zt.create, y0 = Hi.create, w0 = ht.create, x0 = ge.create, b0 = ge.strictCreate, S0 = Ir.create, T0 = Gi.create, E0 = Or.create, R0 = St.create, C0 = kr.create, A0 = zi.create, I0 = _n.create, O0 = Bn.create, k0 = Pr.create, P0 = Nr.create, N0 = Yt.create, L0 = Lr.create, M0 = Vn.create, Wc = pt.create, U0 = xt.create, $0 = Xt.create, Z0 = pt.createWithPreprocess, D0 = Zr.create, W0 = () => hl().optional(), q0 = () => pl().optional(), B0 = () => gl().optional(), F0 = {
  string: (s) => dt.create({ ...s, coerce: !0 }),
  number: (s) => Kt.create({ ...s, coerce: !0 }),
  boolean: (s) => Rr.create({
    ...s,
    coerce: !0
  }),
  bigint: (s) => Jt.create({ ...s, coerce: !0 }),
  date: (s) => gn.create({ ...s, coerce: !0 })
}, H0 = q;
var d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: zn,
  setErrorMap: Zv,
  getErrorMap: Wi,
  makeIssue: qi,
  EMPTY_PATH: Dv,
  addIssueToContext: k,
  ParseStatus: Oe,
  INVALID: q,
  DIRTY: Dn,
  OK: Me,
  isAborted: Da,
  isDirty: Wa,
  isValid: pn,
  isAsync: Er,
  get util() {
    return re;
  },
  get objectUtil() {
    return Za;
  },
  ZodParsedType: P,
  getParsedType: $t,
  ZodType: G,
  datetimeRegex: ll,
  ZodString: dt,
  ZodNumber: Kt,
  ZodBigInt: Jt,
  ZodBoolean: Rr,
  ZodDate: gn,
  ZodSymbol: Fi,
  ZodUndefined: Cr,
  ZodNull: Ar,
  ZodAny: jn,
  ZodUnknown: hn,
  ZodNever: Zt,
  ZodVoid: Hi,
  ZodArray: ht,
  ZodObject: ge,
  ZodUnion: Ir,
  ZodDiscriminatedUnion: Gi,
  ZodIntersection: Or,
  ZodTuple: St,
  ZodRecord: kr,
  ZodMap: zi,
  ZodSet: _n,
  ZodFunction: Bn,
  ZodLazy: Pr,
  ZodLiteral: Nr,
  ZodEnum: Yt,
  ZodNativeEnum: Lr,
  ZodPromise: Vn,
  ZodEffects: pt,
  ZodTransformer: pt,
  ZodOptional: xt,
  ZodNullable: Xt,
  ZodDefault: Mr,
  ZodCatch: Ur,
  ZodNaN: ji,
  BRAND: o0,
  ZodBranded: Ja,
  ZodPipeline: Zr,
  ZodReadonly: $r,
  custom: dl,
  Schema: G,
  ZodSchema: G,
  late: u0,
  get ZodFirstPartyTypeKind() {
    return W;
  },
  coerce: F0,
  any: _0,
  array: w0,
  bigint: f0,
  boolean: gl,
  date: d0,
  discriminatedUnion: T0,
  effect: Wc,
  enum: N0,
  function: O0,
  instanceof: c0,
  intersection: E0,
  lazy: k0,
  literal: P0,
  map: A0,
  nan: l0,
  nativeEnum: L0,
  never: v0,
  null: g0,
  nullable: $0,
  number: pl,
  object: x0,
  oboolean: B0,
  onumber: q0,
  optional: U0,
  ostring: W0,
  pipeline: D0,
  preprocess: Z0,
  promise: M0,
  record: C0,
  set: I0,
  strictObject: b0,
  string: hl,
  symbol: h0,
  transformer: Wc,
  tuple: R0,
  undefined: p0,
  union: S0,
  unknown: m0,
  void: y0,
  NEVER: H0,
  ZodIssueCode: A,
  quotelessJson: $v,
  ZodError: Ge
});
const Ya = "2024-11-05", z0 = [
  Ya,
  "2024-10-07"
], Ki = "2.0", _l = d.union([d.string(), d.number().int()]), ml = d.string(), gt = d.object({
  _meta: d.optional(d.object({
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: d.optional(_l)
  }).passthrough())
}).passthrough(), Ke = d.object({
  method: d.string(),
  params: d.optional(gt)
}), Dr = d.object({
  /**
   * This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.
   */
  _meta: d.optional(d.object({}).passthrough())
}).passthrough(), Tt = d.object({
  method: d.string(),
  params: d.optional(Dr)
}), _t = d.object({
  /**
   * This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.
   */
  _meta: d.optional(d.object({}).passthrough())
}).passthrough(), Ji = d.union([d.string(), d.number().int()]), j0 = d.object({
  jsonrpc: d.literal(Ki),
  id: Ji
}).merge(Ke).strict(), V0 = d.object({
  jsonrpc: d.literal(Ki)
}).merge(Tt).strict(), G0 = d.object({
  jsonrpc: d.literal(Ki),
  id: Ji,
  result: _t
}).strict();
var fn;
(function(s) {
  s[s.ConnectionClosed = -32e3] = "ConnectionClosed", s[s.RequestTimeout = -32001] = "RequestTimeout", s[s.ParseError = -32700] = "ParseError", s[s.InvalidRequest = -32600] = "InvalidRequest", s[s.MethodNotFound = -32601] = "MethodNotFound", s[s.InvalidParams = -32602] = "InvalidParams", s[s.InternalError = -32603] = "InternalError";
})(fn || (fn = {}));
const K0 = d.object({
  jsonrpc: d.literal(Ki),
  id: Ji,
  error: d.object({
    /**
     * The error type that occurred.
     */
    code: d.number().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: d.string(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: d.optional(d.unknown())
  })
}).strict(), vl = d.union([
  j0,
  V0,
  G0,
  K0
]), Wn = _t.strict(), Xa = Tt.extend({
  method: d.literal("notifications/cancelled"),
  params: Dr.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: Ji,
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: d.string().optional()
  })
}), yl = d.object({
  name: d.string(),
  version: d.string()
}).passthrough(), J0 = d.object({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: d.optional(d.object({}).passthrough()),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: d.optional(d.object({}).passthrough()),
  /**
   * Present if the client supports listing roots.
   */
  roots: d.optional(d.object({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: d.optional(d.boolean())
  }).passthrough())
}).passthrough(), Y0 = Ke.extend({
  method: d.literal("initialize"),
  params: gt.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: d.string(),
    capabilities: J0,
    clientInfo: yl
  })
}), X0 = d.object({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: d.optional(d.object({}).passthrough()),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: d.optional(d.object({}).passthrough()),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: d.optional(d.object({}).passthrough()),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: d.optional(d.object({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: d.optional(d.boolean())
  }).passthrough()),
  /**
   * Present if the server offers any resources to read.
   */
  resources: d.optional(d.object({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: d.optional(d.boolean()),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: d.optional(d.boolean())
  }).passthrough()),
  /**
   * Present if the server offers any tools to call.
   */
  tools: d.optional(d.object({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: d.optional(d.boolean())
  }).passthrough())
}).passthrough(), wl = _t.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: d.string(),
  capabilities: X0,
  serverInfo: yl,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: d.optional(d.string())
}), Q0 = Tt.extend({
  method: d.literal("notifications/initialized")
}), Qa = Ke.extend({
  method: d.literal("ping")
}), ey = d.object({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: d.number(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: d.optional(d.number())
}).passthrough(), eo = Tt.extend({
  method: d.literal("notifications/progress"),
  params: Dr.merge(ey).extend({
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: _l
  })
}), Yi = Ke.extend({
  params: gt.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: d.optional(ml)
  }).optional()
}), Xi = _t.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: d.optional(ml)
}), xl = d.object({
  /**
   * The URI of this resource.
   */
  uri: d.string(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: d.optional(d.string())
}).passthrough(), bl = xl.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: d.string()
}), Sl = xl.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: d.string().base64()
}), ty = d.object({
  /**
   * The URI of this resource.
   */
  uri: d.string(),
  /**
   * A human-readable name for this resource.
   *
   * This can be used by clients to populate UI elements.
   */
  name: d.string(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: d.optional(d.string()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: d.optional(d.string())
}).passthrough(), ny = d.object({
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: d.string(),
  /**
   * A human-readable name for the type of resource this template refers to.
   *
   * This can be used by clients to populate UI elements.
   */
  name: d.string(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: d.optional(d.string()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: d.optional(d.string())
}).passthrough(), ry = Yi.extend({
  method: d.literal("resources/list")
}), Tl = Xi.extend({
  resources: d.array(ty)
}), iy = Yi.extend({
  method: d.literal("resources/templates/list")
}), El = Xi.extend({
  resourceTemplates: d.array(ny)
}), sy = Ke.extend({
  method: d.literal("resources/read"),
  params: gt.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: d.string()
  })
}), Rl = _t.extend({
  contents: d.array(d.union([bl, Sl]))
}), ay = Tt.extend({
  method: d.literal("notifications/resources/list_changed")
}), oy = Ke.extend({
  method: d.literal("resources/subscribe"),
  params: gt.extend({
    /**
     * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
     */
    uri: d.string()
  })
}), uy = Ke.extend({
  method: d.literal("resources/unsubscribe"),
  params: gt.extend({
    /**
     * The URI of the resource to unsubscribe from.
     */
    uri: d.string()
  })
}), cy = Tt.extend({
  method: d.literal("notifications/resources/updated"),
  params: Dr.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: d.string()
  })
}), ly = d.object({
  /**
   * The name of the argument.
   */
  name: d.string(),
  /**
   * A human-readable description of the argument.
   */
  description: d.optional(d.string()),
  /**
   * Whether this argument must be provided.
   */
  required: d.optional(d.boolean())
}).passthrough(), fy = d.object({
  /**
   * The name of the prompt or prompt template.
   */
  name: d.string(),
  /**
   * An optional description of what this prompt provides
   */
  description: d.optional(d.string()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: d.optional(d.array(ly))
}).passthrough(), dy = Yi.extend({
  method: d.literal("prompts/list")
}), Cl = Xi.extend({
  prompts: d.array(fy)
}), hy = Ke.extend({
  method: d.literal("prompts/get"),
  params: gt.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: d.string(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: d.optional(d.record(d.string()))
  })
}), Qi = d.object({
  type: d.literal("text"),
  /**
   * The text content of the message.
   */
  text: d.string()
}).passthrough(), es = d.object({
  type: d.literal("image"),
  /**
   * The base64-encoded image data.
   */
  data: d.string().base64(),
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: d.string()
}).passthrough(), ts = d.object({
  type: d.literal("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: d.string().base64(),
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: d.string()
}).passthrough(), Al = d.object({
  type: d.literal("resource"),
  resource: d.union([bl, Sl])
}).passthrough(), py = d.object({
  role: d.enum(["user", "assistant"]),
  content: d.union([
    Qi,
    es,
    ts,
    Al
  ])
}).passthrough(), Il = _t.extend({
  /**
   * An optional description for the prompt.
   */
  description: d.optional(d.string()),
  messages: d.array(py)
}), gy = Tt.extend({
  method: d.literal("notifications/prompts/list_changed")
}), _y = d.object({
  /**
   * The name of the tool.
   */
  name: d.string(),
  /**
   * A human-readable description of the tool.
   */
  description: d.optional(d.string()),
  /**
   * A JSON Schema object defining the expected parameters for the tool.
   */
  inputSchema: d.object({
    type: d.literal("object"),
    properties: d.optional(d.object({}).passthrough())
  }).passthrough()
}).passthrough(), my = Yi.extend({
  method: d.literal("tools/list")
}), Ol = Xi.extend({
  tools: d.array(_y)
}), to = _t.extend({
  content: d.array(d.union([Qi, es, ts, Al])),
  isError: d.boolean().default(!1).optional()
});
to.or(_t.extend({
  toolResult: d.unknown()
}));
const vy = Ke.extend({
  method: d.literal("tools/call"),
  params: gt.extend({
    name: d.string(),
    arguments: d.optional(d.record(d.unknown()))
  })
}), yy = Tt.extend({
  method: d.literal("notifications/tools/list_changed")
}), kl = d.enum([
  "debug",
  "info",
  "notice",
  "warning",
  "error",
  "critical",
  "alert",
  "emergency"
]), wy = Ke.extend({
  method: d.literal("logging/setLevel"),
  params: gt.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: kl
  })
}), xy = Tt.extend({
  method: d.literal("notifications/message"),
  params: Dr.extend({
    /**
     * The severity of this log message.
     */
    level: kl,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: d.optional(d.string()),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: d.unknown()
  })
}), by = d.object({
  /**
   * A hint for a model name.
   */
  name: d.string().optional()
}).passthrough(), Sy = d.object({
  /**
   * Optional hints to use for model selection.
   */
  hints: d.optional(d.array(by)),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: d.optional(d.number().min(0).max(1)),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: d.optional(d.number().min(0).max(1)),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: d.optional(d.number().min(0).max(1))
}).passthrough(), Ty = d.object({
  role: d.enum(["user", "assistant"]),
  content: d.union([Qi, es, ts])
}).passthrough(), Ey = Ke.extend({
  method: d.literal("sampling/createMessage"),
  params: gt.extend({
    messages: d.array(Ty),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: d.optional(d.string()),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
     */
    includeContext: d.optional(d.enum(["none", "thisServer", "allServers"])),
    temperature: d.optional(d.number()),
    /**
     * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
     */
    maxTokens: d.number().int(),
    stopSequences: d.optional(d.array(d.string())),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: d.optional(d.object({}).passthrough()),
    /**
     * The server's preferences for which model to select.
     */
    modelPreferences: d.optional(Sy)
  })
}), Ry = _t.extend({
  /**
   * The name of the model that generated the message.
   */
  model: d.string(),
  /**
   * The reason why sampling stopped.
   */
  stopReason: d.optional(d.enum(["endTurn", "stopSequence", "maxTokens"]).or(d.string())),
  role: d.enum(["user", "assistant"]),
  content: d.discriminatedUnion("type", [
    Qi,
    es,
    ts
  ])
}), Cy = d.object({
  type: d.literal("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: d.string()
}).passthrough(), Ay = d.object({
  type: d.literal("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: d.string()
}).passthrough(), Iy = Ke.extend({
  method: d.literal("completion/complete"),
  params: gt.extend({
    ref: d.union([Ay, Cy]),
    /**
     * The argument's information
     */
    argument: d.object({
      /**
       * The name of the argument
       */
      name: d.string(),
      /**
       * The value of the argument to use for completion matching.
       */
      value: d.string()
    }).passthrough()
  })
}), Pl = _t.extend({
  completion: d.object({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: d.array(d.string()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: d.optional(d.number().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: d.optional(d.boolean())
  }).passthrough()
}), Oy = d.object({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: d.string().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: d.optional(d.string())
}).passthrough(), ky = Ke.extend({
  method: d.literal("roots/list")
}), Py = _t.extend({
  roots: d.array(Oy)
}), Ny = Tt.extend({
  method: d.literal("notifications/roots/list_changed")
});
d.union([
  Qa,
  Y0,
  Iy,
  wy,
  hy,
  dy,
  ry,
  iy,
  sy,
  oy,
  uy,
  vy,
  my
]);
d.union([
  Xa,
  eo,
  Q0,
  Ny
]);
d.union([
  Wn,
  Ry,
  Py
]);
d.union([
  Qa,
  Ey,
  ky
]);
d.union([
  Xa,
  eo,
  xy,
  cy,
  ay,
  yy,
  gy
]);
d.union([
  Wn,
  wl,
  Pl,
  Il,
  Cl,
  Tl,
  El,
  Rl,
  to,
  Ol
]);
class Mi extends Error {
  constructor(n, r, a) {
    super(`MCP error ${n}: ${r}`), this.code = n, this.data = a, this.name = "McpError";
  }
}
const Ly = 6e4;
class My {
  constructor(n) {
    this._options = n, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map(), this._requestHandlerAbortControllers = /* @__PURE__ */ new Map(), this._notificationHandlers = /* @__PURE__ */ new Map(), this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers = /* @__PURE__ */ new Map(), this._timeoutInfo = /* @__PURE__ */ new Map(), this.setNotificationHandler(Xa, (r) => {
      const a = this._requestHandlerAbortControllers.get(r.params.requestId);
      a == null || a.abort(r.params.reason);
    }), this.setNotificationHandler(eo, (r) => {
      this._onprogress(r);
    }), this.setRequestHandler(
      Qa,
      // Automatic pong by default.
      (r) => ({})
    );
  }
  _setupTimeout(n, r, a, u, c = !1) {
    this._timeoutInfo.set(n, {
      timeoutId: setTimeout(u, r),
      startTime: Date.now(),
      timeout: r,
      maxTotalTimeout: a,
      resetTimeoutOnProgress: c,
      onTimeout: u
    });
  }
  _resetTimeout(n) {
    const r = this._timeoutInfo.get(n);
    if (!r)
      return !1;
    const a = Date.now() - r.startTime;
    if (r.maxTotalTimeout && a >= r.maxTotalTimeout)
      throw this._timeoutInfo.delete(n), new Mi(fn.RequestTimeout, "Maximum total timeout exceeded", { maxTotalTimeout: r.maxTotalTimeout, totalElapsed: a });
    return clearTimeout(r.timeoutId), r.timeoutId = setTimeout(r.onTimeout, r.timeout), !0;
  }
  _cleanupTimeout(n) {
    const r = this._timeoutInfo.get(n);
    r && (clearTimeout(r.timeoutId), this._timeoutInfo.delete(n));
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(n) {
    this._transport = n, this._transport.onclose = () => {
      this._onclose();
    }, this._transport.onerror = (r) => {
      this._onerror(r);
    }, this._transport.onmessage = (r) => {
      "method" in r ? "id" in r ? this._onrequest(r) : this._onnotification(r) : this._onresponse(r);
    }, await this._transport.start();
  }
  _onclose() {
    var n;
    const r = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._transport = void 0, (n = this.onclose) === null || n === void 0 || n.call(this);
    const a = new Mi(fn.ConnectionClosed, "Connection closed");
    for (const u of r.values())
      u(a);
  }
  _onerror(n) {
    var r;
    (r = this.onerror) === null || r === void 0 || r.call(this, n);
  }
  _onnotification(n) {
    var r;
    const a = (r = this._notificationHandlers.get(n.method)) !== null && r !== void 0 ? r : this.fallbackNotificationHandler;
    a !== void 0 && Promise.resolve().then(() => a(n)).catch((u) => this._onerror(new Error(`Uncaught error in notification handler: ${u}`)));
  }
  _onrequest(n) {
    var r, a, u;
    const c = (r = this._requestHandlers.get(n.method)) !== null && r !== void 0 ? r : this.fallbackRequestHandler;
    if (c === void 0) {
      (a = this._transport) === null || a === void 0 || a.send({
        jsonrpc: "2.0",
        id: n.id,
        error: {
          code: fn.MethodNotFound,
          message: "Method not found"
        }
      }).catch((y) => this._onerror(new Error(`Failed to send an error response: ${y}`)));
      return;
    }
    const p = new AbortController();
    this._requestHandlerAbortControllers.set(n.id, p);
    const _ = {
      signal: p.signal,
      sessionId: (u = this._transport) === null || u === void 0 ? void 0 : u.sessionId
    };
    Promise.resolve().then(() => c(n, _)).then((y) => {
      var w;
      if (!p.signal.aborted)
        return (w = this._transport) === null || w === void 0 ? void 0 : w.send({
          result: y,
          jsonrpc: "2.0",
          id: n.id
        });
    }, (y) => {
      var w, S;
      if (!p.signal.aborted)
        return (w = this._transport) === null || w === void 0 ? void 0 : w.send({
          jsonrpc: "2.0",
          id: n.id,
          error: {
            code: Number.isSafeInteger(y.code) ? y.code : fn.InternalError,
            message: (S = y.message) !== null && S !== void 0 ? S : "Internal error"
          }
        });
    }).catch((y) => this._onerror(new Error(`Failed to send response: ${y}`))).finally(() => {
      this._requestHandlerAbortControllers.delete(n.id);
    });
  }
  _onprogress(n) {
    const { progressToken: r, ...a } = n.params, u = Number(r), c = this._progressHandlers.get(u);
    if (!c) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(n)}`));
      return;
    }
    const p = this._responseHandlers.get(u), _ = this._timeoutInfo.get(u);
    if (_ && p && _.resetTimeoutOnProgress)
      try {
        this._resetTimeout(u);
      } catch (y) {
        p(y);
        return;
      }
    c(a);
  }
  _onresponse(n) {
    const r = Number(n.id), a = this._responseHandlers.get(r);
    if (a === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(n)}`));
      return;
    }
    if (this._responseHandlers.delete(r), this._progressHandlers.delete(r), this._cleanupTimeout(r), "result" in n)
      a(n);
    else {
      const u = new Mi(n.error.code, n.error.message, n.error.data);
      a(u);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    var n;
    await ((n = this._transport) === null || n === void 0 ? void 0 : n.close());
  }
  /**
   * Sends a request and wait for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(n, r, a) {
    return new Promise((u, c) => {
      var p, _, y, w, S;
      if (!this._transport) {
        c(new Error("Not connected"));
        return;
      }
      ((p = this._options) === null || p === void 0 ? void 0 : p.enforceStrictCapabilities) === !0 && this.assertCapabilityForMethod(n.method), (_ = a == null ? void 0 : a.signal) === null || _ === void 0 || _.throwIfAborted();
      const I = this._requestMessageId++, X = {
        ...n,
        jsonrpc: "2.0",
        id: I
      };
      a != null && a.onprogress && (this._progressHandlers.set(I, a.onprogress), X.params = {
        ...n.params,
        _meta: { progressToken: I }
      });
      const ee = (U) => {
        var te;
        this._responseHandlers.delete(I), this._progressHandlers.delete(I), this._cleanupTimeout(I), (te = this._transport) === null || te === void 0 || te.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: I,
            reason: String(U)
          }
        }).catch((ye) => this._onerror(new Error(`Failed to send cancellation: ${ye}`))), c(U);
      };
      this._responseHandlers.set(I, (U) => {
        var te;
        if (!(!((te = a == null ? void 0 : a.signal) === null || te === void 0) && te.aborted)) {
          if (U instanceof Error)
            return c(U);
          try {
            const ye = r.parse(U.result);
            u(ye);
          } catch (ye) {
            c(ye);
          }
        }
      }), (y = a == null ? void 0 : a.signal) === null || y === void 0 || y.addEventListener("abort", () => {
        var U;
        ee((U = a == null ? void 0 : a.signal) === null || U === void 0 ? void 0 : U.reason);
      });
      const ue = (w = a == null ? void 0 : a.timeout) !== null && w !== void 0 ? w : Ly, B = () => ee(new Mi(fn.RequestTimeout, "Request timed out", { timeout: ue }));
      this._setupTimeout(I, ue, a == null ? void 0 : a.maxTotalTimeout, B, (S = a == null ? void 0 : a.resetTimeoutOnProgress) !== null && S !== void 0 ? S : !1), this._transport.send(X).catch((U) => {
        this._cleanupTimeout(I), c(U);
      });
    });
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(n) {
    if (!this._transport)
      throw new Error("Not connected");
    this.assertNotificationCapability(n.method);
    const r = {
      ...n,
      jsonrpc: "2.0"
    };
    await this._transport.send(r);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(n, r) {
    const a = n.shape.method.value;
    this.assertRequestHandlerCapability(a), this._requestHandlers.set(a, (u, c) => Promise.resolve(r(n.parse(u), c)));
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(n) {
    this._requestHandlers.delete(n);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(n) {
    if (this._requestHandlers.has(n))
      throw new Error(`A request handler for ${n} already exists, which would be overridden`);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(n, r) {
    this._notificationHandlers.set(n.shape.method.value, (a) => Promise.resolve(r(n.parse(a))));
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(n) {
    this._notificationHandlers.delete(n);
  }
}
function Uy(s, n) {
  return Object.entries(n).reduce((r, [a, u]) => (u && typeof u == "object" ? r[a] = r[a] ? { ...r[a], ...u } : u : r[a] = u, r), { ...s });
}
class Nl extends My {
  /**
   * Initializes this client with the given name and version information.
   */
  constructor(n, r) {
    var a;
    super(r), this._clientInfo = n, this._capabilities = (a = r == null ? void 0 : r.capabilities) !== null && a !== void 0 ? a : {};
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(n) {
    if (this.transport)
      throw new Error("Cannot register capabilities after connecting to transport");
    this._capabilities = Uy(this._capabilities, n);
  }
  assertCapability(n, r) {
    var a;
    if (!(!((a = this._serverCapabilities) === null || a === void 0) && a[n]))
      throw new Error(`Server does not support ${n} (required for ${r})`);
  }
  async connect(n, r) {
    await super.connect(n);
    try {
      const a = await this.request({
        method: "initialize",
        params: {
          protocolVersion: Ya,
          capabilities: this._capabilities,
          clientInfo: this._clientInfo
        }
      }, wl, r);
      if (a === void 0)
        throw new Error(`Server sent invalid initialize result: ${a}`);
      if (!z0.includes(a.protocolVersion))
        throw new Error(`Server's protocol version is not supported: ${a.protocolVersion}`);
      this._serverCapabilities = a.capabilities, this._serverVersion = a.serverInfo, this._instructions = a.instructions, await this.notification({
        method: "notifications/initialized"
      });
    } catch (a) {
      throw this.close(), a;
    }
  }
  /**
   * After initialization has completed, this will be populated with the server's reported capabilities.
   */
  getServerCapabilities() {
    return this._serverCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the server's name and version.
   */
  getServerVersion() {
    return this._serverVersion;
  }
  /**
   * After initialization has completed, this may be populated with information about the server's instructions.
   */
  getInstructions() {
    return this._instructions;
  }
  assertCapabilityForMethod(n) {
    var r, a, u, c, p;
    switch (n) {
      case "logging/setLevel":
        if (!(!((r = this._serverCapabilities) === null || r === void 0) && r.logging))
          throw new Error(`Server does not support logging (required for ${n})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!(!((a = this._serverCapabilities) === null || a === void 0) && a.prompts))
          throw new Error(`Server does not support prompts (required for ${n})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
      case "resources/subscribe":
      case "resources/unsubscribe":
        if (!(!((u = this._serverCapabilities) === null || u === void 0) && u.resources))
          throw new Error(`Server does not support resources (required for ${n})`);
        if (n === "resources/subscribe" && !this._serverCapabilities.resources.subscribe)
          throw new Error(`Server does not support resource subscriptions (required for ${n})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!(!((c = this._serverCapabilities) === null || c === void 0) && c.tools))
          throw new Error(`Server does not support tools (required for ${n})`);
        break;
      case "completion/complete":
        if (!(!((p = this._serverCapabilities) === null || p === void 0) && p.completions))
          throw new Error(`Server does not support completions (required for ${n})`);
        break;
    }
  }
  assertNotificationCapability(n) {
    var r;
    switch (n) {
      case "notifications/roots/list_changed":
        if (!(!((r = this._capabilities.roots) === null || r === void 0) && r.listChanged))
          throw new Error(`Client does not support roots list changed notifications (required for ${n})`);
        break;
    }
  }
  assertRequestHandlerCapability(n) {
    switch (n) {
      case "sampling/createMessage":
        if (!this._capabilities.sampling)
          throw new Error(`Client does not support sampling capability (required for ${n})`);
        break;
      case "roots/list":
        if (!this._capabilities.roots)
          throw new Error(`Client does not support roots capability (required for ${n})`);
        break;
    }
  }
  async ping(n) {
    return this.request({ method: "ping" }, Wn, n);
  }
  async complete(n, r) {
    return this.request({ method: "completion/complete", params: n }, Pl, r);
  }
  async setLoggingLevel(n, r) {
    return this.request({ method: "logging/setLevel", params: { level: n } }, Wn, r);
  }
  async getPrompt(n, r) {
    return this.request({ method: "prompts/get", params: n }, Il, r);
  }
  async listPrompts(n, r) {
    return this.request({ method: "prompts/list", params: n }, Cl, r);
  }
  async listResources(n, r) {
    return this.request({ method: "resources/list", params: n }, Tl, r);
  }
  async listResourceTemplates(n, r) {
    return this.request({ method: "resources/templates/list", params: n }, El, r);
  }
  async readResource(n, r) {
    return this.request({ method: "resources/read", params: n }, Rl, r);
  }
  async subscribeResource(n, r) {
    return this.request({ method: "resources/subscribe", params: n }, Wn, r);
  }
  async unsubscribeResource(n, r) {
    return this.request({ method: "resources/unsubscribe", params: n }, Wn, r);
  }
  async callTool(n, r = to, a) {
    return this.request({ method: "tools/call", params: n }, r, a);
  }
  async listTools(n, r) {
    return this.request({ method: "tools/list", params: n }, Ol, r);
  }
  async sendRootsListChanged() {
    return this.notification({ method: "notifications/roots/list_changed" });
  }
}
class qc extends Error {
  constructor(n, r) {
    super(n), this.name = "ParseError", this.type = r.type, this.field = r.field, this.value = r.value, this.line = r.line;
  }
}
function Ea(s) {
}
function $y(s) {
  if (typeof s == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent: n = Ea, onError: r = Ea, onRetry: a = Ea, onComment: u } = s;
  let c = "", p = !0, _, y = "", w = "";
  function S(B) {
    const U = p ? B.replace(/^\xEF\xBB\xBF/, "") : B, [te, ye] = Zy(`${c}${U}`);
    for (const he of te)
      I(he);
    c = ye, p = !1;
  }
  function I(B) {
    if (B === "") {
      ee();
      return;
    }
    if (B.startsWith(":")) {
      u && u(B.slice(B.startsWith(": ") ? 2 : 1));
      return;
    }
    const U = B.indexOf(":");
    if (U !== -1) {
      const te = B.slice(0, U), ye = B[U + 1] === " " ? 2 : 1, he = B.slice(U + ye);
      X(te, he, B);
      return;
    }
    X(B, "", B);
  }
  function X(B, U, te) {
    switch (B) {
      case "event":
        w = U;
        break;
      case "data":
        y = `${y}${U}
`;
        break;
      case "id":
        _ = U.includes("\0") ? void 0 : U;
        break;
      case "retry":
        /^\d+$/.test(U) ? a(parseInt(U, 10)) : r(
          new qc(`Invalid \`retry\` value: "${U}"`, {
            type: "invalid-retry",
            value: U,
            line: te
          })
        );
        break;
      default:
        r(
          new qc(
            `Unknown field "${B.length > 20 ? `${B.slice(0, 20)}…` : B}"`,
            { type: "unknown-field", field: B, value: U, line: te }
          )
        );
        break;
    }
  }
  function ee() {
    y.length > 0 && n({
      id: _,
      event: w || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: y.endsWith(`
`) ? y.slice(0, -1) : y
    }), _ = void 0, y = "", w = "";
  }
  function ue(B = {}) {
    c && B.consume && I(c), p = !0, _ = void 0, y = "", w = "", c = "";
  }
  return { feed: S, reset: ue };
}
function Zy(s) {
  const n = [];
  let r = "", a = 0;
  for (; a < s.length; ) {
    const u = s.indexOf("\r", a), c = s.indexOf(`
`, a);
    let p = -1;
    if (u !== -1 && c !== -1 ? p = Math.min(u, c) : u !== -1 ? p = u : c !== -1 && (p = c), p === -1) {
      r = s.slice(a);
      break;
    } else {
      const _ = s.slice(a, p);
      n.push(_), a = p + 1, s[a - 1] === "\r" && s[a] === `
` && a++;
    }
  }
  return [n, r];
}
class Bc extends Event {
  /**
   * Constructs a new `ErrorEvent` instance. This is typically not called directly,
   * but rather emitted by the `EventSource` object when an error occurs.
   *
   * @param type - The type of the event (should be "error")
   * @param errorEventInitDict - Optional properties to include in the error event
   */
  constructor(n, r) {
    var a, u;
    super(n), this.code = (a = r == null ? void 0 : r.code) != null ? a : void 0, this.message = (u = r == null ? void 0 : r.message) != null ? u : void 0;
  }
  /**
   * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Node.js when you `console.log` an instance of this class.
   *
   * @param _depth - The current depth
   * @param options - The options passed to `util.inspect`
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @returns A string representation of the error
   */
  [Symbol.for("nodejs.util.inspect.custom")](n, r, a) {
    return a(Fc(this), r);
  }
  /**
   * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
   * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
   * we explicitly include the properties in the `inspect` method.
   *
   * This is automatically called by Deno when you `console.log` an instance of this class.
   *
   * @param inspect - The inspect function to use (prevents having to import it from `util`)
   * @param options - The options passed to `Deno.inspect`
   * @returns A string representation of the error
   */
  [Symbol.for("Deno.customInspect")](n, r) {
    return n(Fc(this), r);
  }
}
function Dy(s) {
  const n = globalThis.DOMException;
  return typeof n == "function" ? new n(s, "SyntaxError") : new SyntaxError(s);
}
function Ba(s) {
  return s instanceof Error ? "errors" in s && Array.isArray(s.errors) ? s.errors.map(Ba).join(", ") : "cause" in s && s.cause instanceof Error ? `${s}: ${Ba(s.cause)}` : s.message : `${s}`;
}
function Fc(s) {
  return {
    type: s.type,
    message: s.message,
    code: s.code,
    defaultPrevented: s.defaultPrevented,
    cancelable: s.cancelable,
    timeStamp: s.timeStamp
  };
}
var Ll = (s) => {
  throw TypeError(s);
}, no = (s, n, r) => n.has(s) || Ll("Cannot " + r), Y = (s, n, r) => (no(s, n, "read from private field"), r ? r.call(s) : n.get(s)), be = (s, n, r) => n.has(s) ? Ll("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(s) : n.set(s, r), de = (s, n, r, a) => (no(s, n, "write to private field"), n.set(s, r), r), Ut = (s, n, r) => (no(s, n, "access private method"), r), We, dn, Un, Zi, Vi, Sr, qn, Tr, Gt, $n, Fn, Zn, yr, ft, Fa, Ha, za, Hc, ja, Va, wr, Ga, Ka;
class Di extends EventTarget {
  constructor(n, r) {
    var a, u;
    super(), be(this, ft), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, be(this, We), be(this, dn), be(this, Un), be(this, Zi), be(this, Vi), be(this, Sr), be(this, qn), be(this, Tr, null), be(this, Gt), be(this, $n), be(this, Fn, null), be(this, Zn, null), be(this, yr, null), be(this, Ha, async (c) => {
      var p;
      Y(this, $n).reset();
      const { body: _, redirected: y, status: w, headers: S } = c;
      if (w === 204) {
        Ut(this, ft, wr).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
        return;
      }
      if (y ? de(this, Un, new URL(c.url)) : de(this, Un, void 0), w !== 200) {
        Ut(this, ft, wr).call(this, `Non-200 status code (${w})`, w);
        return;
      }
      if (!(S.get("content-type") || "").startsWith("text/event-stream")) {
        Ut(this, ft, wr).call(this, 'Invalid content type, expected "text/event-stream"', w);
        return;
      }
      if (Y(this, We) === this.CLOSED)
        return;
      de(this, We, this.OPEN);
      const I = new Event("open");
      if ((p = Y(this, yr)) == null || p.call(this, I), this.dispatchEvent(I), typeof _ != "object" || !_ || !("getReader" in _)) {
        Ut(this, ft, wr).call(this, "Invalid response body, expected a web ReadableStream", w), this.close();
        return;
      }
      const X = new TextDecoder(), ee = _.getReader();
      let ue = !0;
      do {
        const { done: B, value: U } = await ee.read();
        U && Y(this, $n).feed(X.decode(U, { stream: !B })), B && (ue = !1, Y(this, $n).reset(), Ut(this, ft, Ga).call(this));
      } while (ue);
    }), be(this, za, (c) => {
      de(this, Gt, void 0), !(c.name === "AbortError" || c.type === "aborted") && Ut(this, ft, Ga).call(this, Ba(c));
    }), be(this, ja, (c) => {
      typeof c.id == "string" && de(this, Tr, c.id);
      const p = new MessageEvent(c.event || "message", {
        data: c.data,
        origin: Y(this, Un) ? Y(this, Un).origin : Y(this, dn).origin,
        lastEventId: c.id || ""
      });
      Y(this, Zn) && (!c.event || c.event === "message") && Y(this, Zn).call(this, p), this.dispatchEvent(p);
    }), be(this, Va, (c) => {
      de(this, Sr, c);
    }), be(this, Ka, () => {
      de(this, qn, void 0), Y(this, We) === this.CONNECTING && Ut(this, ft, Fa).call(this);
    });
    try {
      if (n instanceof URL)
        de(this, dn, n);
      else if (typeof n == "string")
        de(this, dn, new URL(n, Wy()));
      else
        throw new Error("Invalid URL");
    } catch {
      throw Dy("An invalid or illegal string was specified");
    }
    de(this, $n, $y({
      onEvent: Y(this, ja),
      onRetry: Y(this, Va)
    })), de(this, We, this.CONNECTING), de(this, Sr, 3e3), de(this, Vi, (a = r == null ? void 0 : r.fetch) != null ? a : globalThis.fetch), de(this, Zi, (u = r == null ? void 0 : r.withCredentials) != null ? u : !1), Ut(this, ft, Fa).call(this);
  }
  /**
   * Returns the state of this EventSource object's connection. It can have the values described below.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
   *
   * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
   * defined in the TypeScript `dom` library.
   *
   * @public
   */
  get readyState() {
    return Y(this, We);
  }
  /**
   * Returns the URL providing the event stream.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
   *
   * @public
   */
  get url() {
    return Y(this, dn).href;
  }
  /**
   * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
   */
  get withCredentials() {
    return Y(this, Zi);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
  get onerror() {
    return Y(this, Fn);
  }
  set onerror(n) {
    de(this, Fn, n);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
  get onmessage() {
    return Y(this, Zn);
  }
  set onmessage(n) {
    de(this, Zn, n);
  }
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
  get onopen() {
    return Y(this, yr);
  }
  set onopen(n) {
    de(this, yr, n);
  }
  addEventListener(n, r, a) {
    const u = r;
    super.addEventListener(n, u, a);
  }
  removeEventListener(n, r, a) {
    const u = r;
    super.removeEventListener(n, u, a);
  }
  /**
   * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
   *
   * @public
   */
  close() {
    Y(this, qn) && clearTimeout(Y(this, qn)), Y(this, We) !== this.CLOSED && (Y(this, Gt) && Y(this, Gt).abort(), de(this, We, this.CLOSED), de(this, Gt, void 0));
  }
}
We = /* @__PURE__ */ new WeakMap(), dn = /* @__PURE__ */ new WeakMap(), Un = /* @__PURE__ */ new WeakMap(), Zi = /* @__PURE__ */ new WeakMap(), Vi = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap(), qn = /* @__PURE__ */ new WeakMap(), Tr = /* @__PURE__ */ new WeakMap(), Gt = /* @__PURE__ */ new WeakMap(), $n = /* @__PURE__ */ new WeakMap(), Fn = /* @__PURE__ */ new WeakMap(), Zn = /* @__PURE__ */ new WeakMap(), yr = /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ new WeakSet(), /**
* Connect to the given URL and start receiving events
*
* @internal
*/
Fa = function() {
  de(this, We, this.CONNECTING), de(this, Gt, new AbortController()), Y(this, Vi)(Y(this, dn), Ut(this, ft, Hc).call(this)).then(Y(this, Ha)).catch(Y(this, za));
}, Ha = /* @__PURE__ */ new WeakMap(), za = /* @__PURE__ */ new WeakMap(), /**
* Get request options for the `fetch()` request
*
* @returns The request options
* @internal
*/
Hc = function() {
  var s;
  const n = {
    // [spec] Let `corsAttributeState` be `Anonymous`…
    // [spec] …will have their mode set to "cors"…
    mode: "cors",
    redirect: "follow",
    headers: { Accept: "text/event-stream", ...Y(this, Tr) ? { "Last-Event-ID": Y(this, Tr) } : void 0 },
    cache: "no-store",
    signal: (s = Y(this, Gt)) == null ? void 0 : s.signal
  };
  return "window" in globalThis && (n.credentials = this.withCredentials ? "include" : "same-origin"), n;
}, ja = /* @__PURE__ */ new WeakMap(), Va = /* @__PURE__ */ new WeakMap(), /**
* Handles the process referred to in the EventSource specification as "failing a connection".
*
* @param error - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
wr = function(s, n) {
  var r;
  Y(this, We) !== this.CLOSED && de(this, We, this.CLOSED);
  const a = new Bc("error", { code: n, message: s });
  (r = Y(this, Fn)) == null || r.call(this, a), this.dispatchEvent(a);
}, /**
* Schedules a reconnection attempt against the EventSource endpoint.
*
* @param message - The error causing the connection to fail
* @param code - The HTTP status code, if available
* @internal
*/
Ga = function(s, n) {
  var r;
  if (Y(this, We) === this.CLOSED)
    return;
  de(this, We, this.CONNECTING);
  const a = new Bc("error", { code: n, message: s });
  (r = Y(this, Fn)) == null || r.call(this, a), this.dispatchEvent(a), de(this, qn, setTimeout(Y(this, Ka), Y(this, Sr)));
}, Ka = /* @__PURE__ */ new WeakMap(), /**
* ReadyState representing an EventSource currently trying to connect
*
* @public
*/
Di.CONNECTING = 0, /**
* ReadyState representing an EventSource connection that is open (eg connected)
*
* @public
*/
Di.OPEN = 1, /**
* ReadyState representing an EventSource connection that is closed (eg disconnected)
*
* @public
*/
Di.CLOSED = 2;
function Wy() {
  const s = "document" in globalThis ? globalThis.document : void 0;
  return s && typeof s == "object" && "baseURI" in s && typeof s.baseURI == "string" ? s.baseURI : void 0;
}
let ro;
ro = globalThis.crypto;
async function qy(s) {
  return (await ro).getRandomValues(new Uint8Array(s));
}
async function By(s) {
  const n = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let r = "";
  const a = await qy(s);
  for (let u = 0; u < s; u++) {
    const c = a[u] % n.length;
    r += n[c];
  }
  return r;
}
async function Fy(s) {
  return await By(s);
}
async function Hy(s) {
  const n = await (await ro).subtle.digest("SHA-256", new TextEncoder().encode(s));
  return btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}
async function zy(s) {
  if (s || (s = 43), s < 43 || s > 128)
    throw `Expected a length between 43 and 128. Received ${s}.`;
  const n = await Fy(s), r = await Hy(n);
  return {
    code_verifier: n,
    code_challenge: r
  };
}
const jy = d.object({
  issuer: d.string(),
  authorization_endpoint: d.string(),
  token_endpoint: d.string(),
  registration_endpoint: d.string().optional(),
  scopes_supported: d.array(d.string()).optional(),
  response_types_supported: d.array(d.string()),
  response_modes_supported: d.array(d.string()).optional(),
  grant_types_supported: d.array(d.string()).optional(),
  token_endpoint_auth_methods_supported: d.array(d.string()).optional(),
  token_endpoint_auth_signing_alg_values_supported: d.array(d.string()).optional(),
  service_documentation: d.string().optional(),
  revocation_endpoint: d.string().optional(),
  revocation_endpoint_auth_methods_supported: d.array(d.string()).optional(),
  revocation_endpoint_auth_signing_alg_values_supported: d.array(d.string()).optional(),
  introspection_endpoint: d.string().optional(),
  introspection_endpoint_auth_methods_supported: d.array(d.string()).optional(),
  introspection_endpoint_auth_signing_alg_values_supported: d.array(d.string()).optional(),
  code_challenge_methods_supported: d.array(d.string()).optional()
}).passthrough(), Ml = d.object({
  access_token: d.string(),
  token_type: d.string(),
  expires_in: d.number().optional(),
  scope: d.string().optional(),
  refresh_token: d.string().optional()
}).strip();
d.object({
  error: d.string(),
  error_description: d.string().optional(),
  error_uri: d.string().optional()
});
const Vy = d.object({
  redirect_uris: d.array(d.string()).refine((s) => s.every((n) => URL.canParse(n)), { message: "redirect_uris must contain valid URLs" }),
  token_endpoint_auth_method: d.string().optional(),
  grant_types: d.array(d.string()).optional(),
  response_types: d.array(d.string()).optional(),
  client_name: d.string().optional(),
  client_uri: d.string().optional(),
  logo_uri: d.string().optional(),
  scope: d.string().optional(),
  contacts: d.array(d.string()).optional(),
  tos_uri: d.string().optional(),
  policy_uri: d.string().optional(),
  jwks_uri: d.string().optional(),
  jwks: d.any().optional(),
  software_id: d.string().optional(),
  software_version: d.string().optional()
}).strip(), Gy = d.object({
  client_id: d.string(),
  client_secret: d.string().optional(),
  client_id_issued_at: d.number().optional(),
  client_secret_expires_at: d.number().optional()
}).strip(), Ky = Vy.merge(Gy);
d.object({
  error: d.string(),
  error_description: d.string().optional()
}).strip();
d.object({
  token: d.string(),
  token_type_hint: d.string().optional()
}).strip();
class _r extends Error {
  constructor(n) {
    super(n ?? "Unauthorized");
  }
}
async function Ra(s, { serverUrl: n, authorizationCode: r }) {
  const a = await Jy(n);
  let u = await Promise.resolve(s.clientInformation());
  if (!u) {
    if (r !== void 0)
      throw new Error("Existing OAuth client information is required when exchanging an authorization code");
    if (!s.saveClientInformation)
      throw new Error("OAuth client information must be saveable for dynamic registration");
    const y = await ew(n, {
      metadata: a,
      clientMetadata: s.clientMetadata
    });
    await s.saveClientInformation(y), u = y;
  }
  if (r !== void 0) {
    const y = await s.codeVerifier(), w = await Xy(n, {
      metadata: a,
      clientInformation: u,
      authorizationCode: r,
      codeVerifier: y,
      redirectUri: s.redirectUrl
    });
    return await s.saveTokens(w), "AUTHORIZED";
  }
  const c = await s.tokens();
  if (c != null && c.refresh_token)
    try {
      const y = await Qy(n, {
        metadata: a,
        clientInformation: u,
        refreshToken: c.refresh_token
      });
      return await s.saveTokens(y), "AUTHORIZED";
    } catch (y) {
      console.error("Could not refresh OAuth tokens:", y);
    }
  const { authorizationUrl: p, codeVerifier: _ } = await Yy(n, {
    metadata: a,
    clientInformation: u,
    redirectUrl: s.redirectUrl
  });
  return await s.saveCodeVerifier(_), await s.redirectToAuthorization(p), "REDIRECT";
}
async function Jy(s, n) {
  var r;
  const a = new URL("/.well-known/oauth-authorization-server", s);
  let u;
  try {
    u = await fetch(a, {
      headers: {
        "MCP-Protocol-Version": (r = n == null ? void 0 : n.protocolVersion) !== null && r !== void 0 ? r : Ya
      }
    });
  } catch (c) {
    if (c instanceof TypeError)
      u = await fetch(a);
    else
      throw c;
  }
  if (u.status !== 404) {
    if (!u.ok)
      throw new Error(`HTTP ${u.status} trying to load well-known OAuth metadata`);
    return jy.parse(await u.json());
  }
}
async function Yy(s, { metadata: n, clientInformation: r, redirectUrl: a }) {
  const u = "code", c = "S256";
  let p;
  if (n) {
    if (p = new URL(n.authorization_endpoint), !n.response_types_supported.includes(u))
      throw new Error(`Incompatible auth server: does not support response type ${u}`);
    if (!n.code_challenge_methods_supported || !n.code_challenge_methods_supported.includes(c))
      throw new Error(`Incompatible auth server: does not support code challenge method ${c}`);
  } else
    p = new URL("/authorize", s);
  const _ = await zy(), y = _.code_verifier, w = _.code_challenge;
  return p.searchParams.set("response_type", u), p.searchParams.set("client_id", r.client_id), p.searchParams.set("code_challenge", w), p.searchParams.set("code_challenge_method", c), p.searchParams.set("redirect_uri", String(a)), { authorizationUrl: p, codeVerifier: y };
}
async function Xy(s, { metadata: n, clientInformation: r, authorizationCode: a, codeVerifier: u, redirectUri: c }) {
  const p = "authorization_code";
  let _;
  if (n) {
    if (_ = new URL(n.token_endpoint), n.grant_types_supported && !n.grant_types_supported.includes(p))
      throw new Error(`Incompatible auth server: does not support grant type ${p}`);
  } else
    _ = new URL("/token", s);
  const y = new URLSearchParams({
    grant_type: p,
    client_id: r.client_id,
    code: a,
    code_verifier: u,
    redirect_uri: String(c)
  });
  r.client_secret && y.set("client_secret", r.client_secret);
  const w = await fetch(_, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: y
  });
  if (!w.ok)
    throw new Error(`Token exchange failed: HTTP ${w.status}`);
  return Ml.parse(await w.json());
}
async function Qy(s, { metadata: n, clientInformation: r, refreshToken: a }) {
  const u = "refresh_token";
  let c;
  if (n) {
    if (c = new URL(n.token_endpoint), n.grant_types_supported && !n.grant_types_supported.includes(u))
      throw new Error(`Incompatible auth server: does not support grant type ${u}`);
  } else
    c = new URL("/token", s);
  const p = new URLSearchParams({
    grant_type: u,
    client_id: r.client_id,
    refresh_token: a
  });
  r.client_secret && p.set("client_secret", r.client_secret);
  const _ = await fetch(c, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: p
  });
  if (!_.ok)
    throw new Error(`Token refresh failed: HTTP ${_.status}`);
  return Ml.parse(await _.json());
}
async function ew(s, { metadata: n, clientMetadata: r }) {
  let a;
  if (n) {
    if (!n.registration_endpoint)
      throw new Error("Incompatible auth server: does not support dynamic client registration");
    a = new URL(n.registration_endpoint);
  } else
    a = new URL("/register", s);
  const u = await fetch(a, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(r)
  });
  if (!u.ok)
    throw new Error(`Dynamic client registration failed: HTTP ${u.status}`);
  return Ky.parse(await u.json());
}
class tw extends Error {
  constructor(n, r, a) {
    super(`SSE error: ${r}`), this.code = n, this.event = a;
  }
}
class nw {
  constructor(n, r) {
    this._url = n, this._eventSourceInit = r == null ? void 0 : r.eventSourceInit, this._requestInit = r == null ? void 0 : r.requestInit, this._authProvider = r == null ? void 0 : r.authProvider;
  }
  async _authThenStart() {
    var n;
    if (!this._authProvider)
      throw new _r("No auth provider");
    let r;
    try {
      r = await Ra(this._authProvider, { serverUrl: this._url });
    } catch (a) {
      throw (n = this.onerror) === null || n === void 0 || n.call(this, a), a;
    }
    if (r !== "AUTHORIZED")
      throw new _r();
    return await this._startOrAuth();
  }
  async _commonHeaders() {
    const n = {};
    if (this._authProvider) {
      const r = await this._authProvider.tokens();
      r && (n.Authorization = `Bearer ${r.access_token}`);
    }
    return n;
  }
  _startOrAuth() {
    return new Promise((n, r) => {
      var a;
      this._eventSource = new Di(this._url.href, (a = this._eventSourceInit) !== null && a !== void 0 ? a : {
        fetch: (u, c) => this._commonHeaders().then((p) => fetch(u, {
          ...c,
          headers: {
            ...p,
            Accept: "text/event-stream"
          }
        }))
      }), this._abortController = new AbortController(), this._eventSource.onerror = (u) => {
        var c;
        if (u.code === 401 && this._authProvider) {
          this._authThenStart().then(n, r);
          return;
        }
        const p = new tw(u.code, u.message, u);
        r(p), (c = this.onerror) === null || c === void 0 || c.call(this, p);
      }, this._eventSource.onopen = () => {
      }, this._eventSource.addEventListener("endpoint", (u) => {
        var c;
        const p = u;
        try {
          if (this._endpoint = new URL(p.data, this._url), this._endpoint.origin !== this._url.origin)
            throw new Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`);
        } catch (_) {
          r(_), (c = this.onerror) === null || c === void 0 || c.call(this, _), this.close();
          return;
        }
        n();
      }), this._eventSource.onmessage = (u) => {
        var c, p;
        const _ = u;
        let y;
        try {
          y = vl.parse(JSON.parse(_.data));
        } catch (w) {
          (c = this.onerror) === null || c === void 0 || c.call(this, w);
          return;
        }
        (p = this.onmessage) === null || p === void 0 || p.call(this, y);
      };
    });
  }
  async start() {
    if (this._eventSource)
      throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return await this._startOrAuth();
  }
  /**
   * Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
   */
  async finishAuth(n) {
    if (!this._authProvider)
      throw new _r("No auth provider");
    if (await Ra(this._authProvider, { serverUrl: this._url, authorizationCode: n }) !== "AUTHORIZED")
      throw new _r("Failed to authorize");
  }
  async close() {
    var n, r, a;
    (n = this._abortController) === null || n === void 0 || n.abort(), (r = this._eventSource) === null || r === void 0 || r.close(), (a = this.onclose) === null || a === void 0 || a.call(this);
  }
  async send(n) {
    var r, a, u;
    if (!this._endpoint)
      throw new Error("Not connected");
    try {
      const c = await this._commonHeaders(), p = new Headers({ ...c, ...(r = this._requestInit) === null || r === void 0 ? void 0 : r.headers });
      p.set("content-type", "application/json");
      const _ = {
        ...this._requestInit,
        method: "POST",
        headers: p,
        body: JSON.stringify(n),
        signal: (a = this._abortController) === null || a === void 0 ? void 0 : a.signal
      }, y = await fetch(this._endpoint, _);
      if (!y.ok) {
        if (y.status === 401 && this._authProvider) {
          if (await Ra(this._authProvider, { serverUrl: this._url }) !== "AUTHORIZED")
            throw new _r();
          return this.send(n);
        }
        const w = await y.text().catch(() => null);
        throw new Error(`Error POSTing to endpoint (HTTP ${y.status}): ${w}`);
      }
    } catch (c) {
      throw (u = this.onerror) === null || u === void 0 || u.call(this, c), c;
    }
  }
}
var xr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ul(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function rw(s) {
  if (Object.prototype.hasOwnProperty.call(s, "__esModule")) return s;
  var n = s.default;
  if (typeof n == "function") {
    var r = function a() {
      return this instanceof a ? Reflect.construct(n, arguments, this.constructor) : n.apply(this, arguments);
    };
    r.prototype = n.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(s).forEach(function(a) {
    var u = Object.getOwnPropertyDescriptor(s, a);
    Object.defineProperty(r, a, u.get ? u : {
      enumerable: !0,
      get: function() {
        return s[a];
      }
    });
  }), r;
}
var ln = { exports: {} };
const Wr = {}, iw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wr
}, Symbol.toStringTag, { value: "Module" })), mn = /* @__PURE__ */ rw(iw);
var Ca, zc;
function sw() {
  if (zc) return Ca;
  zc = 1, Ca = a, a.sync = u;
  var s = mn;
  function n(c, p) {
    var _ = p.pathExt !== void 0 ? p.pathExt : process.env.PATHEXT;
    if (!_ || (_ = _.split(";"), _.indexOf("") !== -1))
      return !0;
    for (var y = 0; y < _.length; y++) {
      var w = _[y].toLowerCase();
      if (w && c.substr(-w.length).toLowerCase() === w)
        return !0;
    }
    return !1;
  }
  function r(c, p, _) {
    return !c.isSymbolicLink() && !c.isFile() ? !1 : n(p, _);
  }
  function a(c, p, _) {
    s.stat(c, function(y, w) {
      _(y, y ? !1 : r(w, c, p));
    });
  }
  function u(c, p) {
    return r(s.statSync(c), c, p);
  }
  return Ca;
}
var Aa, jc;
function aw() {
  if (jc) return Aa;
  jc = 1, Aa = n, n.sync = r;
  var s = mn;
  function n(c, p, _) {
    s.stat(c, function(y, w) {
      _(y, y ? !1 : a(w, p));
    });
  }
  function r(c, p) {
    return a(s.statSync(c), p);
  }
  function a(c, p) {
    return c.isFile() && u(c, p);
  }
  function u(c, p) {
    var _ = c.mode, y = c.uid, w = c.gid, S = p.uid !== void 0 ? p.uid : process.getuid && process.getuid(), I = p.gid !== void 0 ? p.gid : process.getgid && process.getgid(), X = parseInt("100", 8), ee = parseInt("010", 8), ue = parseInt("001", 8), B = X | ee, U = _ & ue || _ & ee && w === I || _ & X && y === S || _ & B && S === 0;
    return U;
  }
  return Aa;
}
var Ia, Vc;
function ow() {
  if (Vc) return Ia;
  Vc = 1;
  var s;
  process.platform === "win32" || xr.TESTING_WINDOWS ? s = sw() : s = aw(), Ia = n, n.sync = r;
  function n(a, u, c) {
    if (typeof u == "function" && (c = u, u = {}), !c) {
      if (typeof Promise != "function")
        throw new TypeError("callback not provided");
      return new Promise(function(p, _) {
        n(a, u || {}, function(y, w) {
          y ? _(y) : p(w);
        });
      });
    }
    s(a, u || {}, function(p, _) {
      p && (p.code === "EACCES" || u && u.ignoreErrors) && (p = null, _ = !1), c(p, _);
    });
  }
  function r(a, u) {
    try {
      return s.sync(a, u || {});
    } catch (c) {
      if (u && u.ignoreErrors || c.code === "EACCES")
        return !1;
      throw c;
    }
  }
  return Ia;
}
var Oa, Gc;
function uw() {
  if (Gc) return Oa;
  Gc = 1;
  const s = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", n = mn, r = s ? ";" : ":", a = ow(), u = (y) => Object.assign(new Error(`not found: ${y}`), { code: "ENOENT" }), c = (y, w) => {
    const S = w.colon || r, I = y.match(/\//) || s && y.match(/\\/) ? [""] : [
      // windows always checks the cwd first
      ...s ? [process.cwd()] : [],
      ...(w.path || process.env.PATH || /* istanbul ignore next: very unusual */
      "").split(S)
    ], X = s ? w.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", ee = s ? X.split(S) : [""];
    return s && y.indexOf(".") !== -1 && ee[0] !== "" && ee.unshift(""), {
      pathEnv: I,
      pathExt: ee,
      pathExtExe: X
    };
  }, p = (y, w, S) => {
    typeof w == "function" && (S = w, w = {}), w || (w = {});
    const { pathEnv: I, pathExt: X, pathExtExe: ee } = c(y, w), ue = [], B = (te) => new Promise((ye, he) => {
      if (te === I.length)
        return w.all && ue.length ? ye(ue) : he(u(y));
      const Te = I[te], ke = /^".*"$/.test(Te) ? Te.slice(1, -1) : Te, Je = n.join(ke, y), qe = !ke && /^\.[\\\/]/.test(y) ? y.slice(0, 2) + Je : Je;
      ye(U(qe, te, 0));
    }), U = (te, ye, he) => new Promise((Te, ke) => {
      if (he === X.length)
        return Te(B(ye + 1));
      const Je = X[he];
      a(te + Je, { pathExt: ee }, (qe, Qt) => {
        if (!qe && Qt)
          if (w.all)
            ue.push(te + Je);
          else
            return Te(te + Je);
        return Te(U(te, ye, he + 1));
      });
    });
    return S ? B(0).then((te) => S(null, te), S) : B(0);
  }, _ = (y, w) => {
    w = w || {};
    const { pathEnv: S, pathExt: I, pathExtExe: X } = c(y, w), ee = [];
    for (let ue = 0; ue < S.length; ue++) {
      const B = S[ue], U = /^".*"$/.test(B) ? B.slice(1, -1) : B, te = n.join(U, y), ye = !U && /^\.[\\\/]/.test(y) ? y.slice(0, 2) + te : te;
      for (let he = 0; he < I.length; he++) {
        const Te = ye + I[he];
        try {
          if (a.sync(Te, { pathExt: X }))
            if (w.all)
              ee.push(Te);
            else
              return Te;
        } catch {
        }
      }
    }
    if (w.all && ee.length)
      return ee;
    if (w.nothrow)
      return null;
    throw u(y);
  };
  return Oa = p, p.sync = _, Oa;
}
var Ui = { exports: {} }, Kc;
function cw() {
  if (Kc) return Ui.exports;
  Kc = 1;
  const s = (n = {}) => {
    const r = n.env || process.env;
    return (n.platform || process.platform) !== "win32" ? "PATH" : Object.keys(r).reverse().find((u) => u.toUpperCase() === "PATH") || "Path";
  };
  return Ui.exports = s, Ui.exports.default = s, Ui.exports;
}
var ka, Jc;
function lw() {
  if (Jc) return ka;
  Jc = 1;
  const s = mn, n = uw(), r = cw();
  function a(c, p) {
    const _ = c.options.env || process.env, y = process.cwd(), w = c.options.cwd != null, S = w && process.chdir !== void 0 && !process.chdir.disabled;
    if (S)
      try {
        process.chdir(c.options.cwd);
      } catch {
      }
    let I;
    try {
      I = n.sync(c.command, {
        path: _[r({ env: _ })],
        pathExt: p ? s.delimiter : void 0
      });
    } catch {
    } finally {
      S && process.chdir(y);
    }
    return I && (I = s.resolve(w ? c.options.cwd : "", I)), I;
  }
  function u(c) {
    return a(c) || a(c, !0);
  }
  return ka = u, ka;
}
var $i = {}, Yc;
function fw() {
  if (Yc) return $i;
  Yc = 1;
  const s = /([()\][%!^"`<>&|;, *?])/g;
  function n(a) {
    return a = a.replace(s, "^$1"), a;
  }
  function r(a, u) {
    return a = `${a}`, a = a.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"'), a = a.replace(/(?=(\\+?)?)\1$/, "$1$1"), a = `"${a}"`, a = a.replace(s, "^$1"), u && (a = a.replace(s, "^$1")), a;
  }
  return $i.command = n, $i.argument = r, $i;
}
var Pa, Xc;
function dw() {
  return Xc || (Xc = 1, Pa = /^#!(.*)/), Pa;
}
var Na, Qc;
function hw() {
  if (Qc) return Na;
  Qc = 1;
  const s = dw();
  return Na = (n = "") => {
    const r = n.match(s);
    if (!r)
      return null;
    const [a, u] = r[0].replace(/#! ?/, "").split(" "), c = a.split("/").pop();
    return c === "env" ? u : u ? `${c} ${u}` : c;
  }, Na;
}
var La, el;
function pw() {
  if (el) return La;
  el = 1;
  const s = mn, n = hw();
  function r(a) {
    const c = Buffer.alloc(150);
    let p;
    try {
      p = s.openSync(a, "r"), s.readSync(p, c, 0, 150, 0), s.closeSync(p);
    } catch {
    }
    return n(c.toString());
  }
  return La = r, La;
}
var Ma, tl;
function gw() {
  if (tl) return Ma;
  tl = 1;
  const s = mn, n = lw(), r = fw(), a = pw(), u = process.platform === "win32", c = /\.(?:com|exe)$/i, p = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function _(S) {
    S.file = n(S);
    const I = S.file && a(S.file);
    return I ? (S.args.unshift(S.file), S.command = I, n(S)) : S.file;
  }
  function y(S) {
    if (!u)
      return S;
    const I = _(S), X = !c.test(I);
    if (S.options.forceShell || X) {
      const ee = p.test(I);
      S.command = s.normalize(S.command), S.command = r.command(S.command), S.args = S.args.map((B) => r.argument(B, ee));
      const ue = [S.command].concat(S.args).join(" ");
      S.args = ["/d", "/s", "/c", `"${ue}"`], S.command = process.env.comspec || "cmd.exe", S.options.windowsVerbatimArguments = !0;
    }
    return S;
  }
  function w(S, I, X) {
    I && !Array.isArray(I) && (X = I, I = null), I = I ? I.slice(0) : [], X = Object.assign({}, X);
    const ee = {
      command: S,
      args: I,
      options: X,
      file: void 0,
      original: {
        command: S,
        args: I
      }
    };
    return X.shell ? ee : y(ee);
  }
  return Ma = w, Ma;
}
var Ua, nl;
function _w() {
  if (nl) return Ua;
  nl = 1;
  const s = process.platform === "win32";
  function n(c, p) {
    return Object.assign(new Error(`${p} ${c.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${p} ${c.command}`,
      path: c.command,
      spawnargs: c.args
    });
  }
  function r(c, p) {
    if (!s)
      return;
    const _ = c.emit;
    c.emit = function(y, w) {
      if (y === "exit") {
        const S = a(w, p);
        if (S)
          return _.call(c, "error", S);
      }
      return _.apply(c, arguments);
    };
  }
  function a(c, p) {
    return s && c === 1 && !p.file ? n(p.original, "spawn") : null;
  }
  function u(c, p) {
    return s && c === 1 && !p.file ? n(p.original, "spawnSync") : null;
  }
  return Ua = {
    hookChildProcess: r,
    verifyENOENT: a,
    verifyENOENTSync: u,
    notFoundError: n
  }, Ua;
}
var rl;
function mw() {
  if (rl) return ln.exports;
  rl = 1;
  const s = mn, n = gw(), r = _w();
  function a(c, p, _) {
    const y = n(c, p, _), w = s.spawn(y.command, y.args, y.options);
    return r.hookChildProcess(w, y), w;
  }
  function u(c, p, _) {
    const y = n(c, p, _), w = s.spawnSync(y.command, y.args, y.options);
    return w.error = w.error || r.verifyENOENTSync(w.status, y), w;
  }
  return ln.exports = a, ln.exports.spawn = a, ln.exports.sync = u, ln.exports._parse = n, ln.exports._enoent = r, ln.exports;
}
var vw = mw();
const yw = /* @__PURE__ */ Ul(vw);
class ww {
  append(n) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, n]) : n;
  }
  readMessage() {
    if (!this._buffer)
      return null;
    const n = this._buffer.indexOf(`
`);
    if (n === -1)
      return null;
    const r = this._buffer.toString("utf8", 0, n).replace(/\r$/, "");
    return this._buffer = this._buffer.subarray(n + 1), xw(r);
  }
  clear() {
    this._buffer = void 0;
  }
}
function xw(s) {
  return vl.parse(JSON.parse(s));
}
function bw(s) {
  return JSON.stringify(s) + `
`;
}
const Sw = Wr.platform === "win32" ? [
  "APPDATA",
  "HOMEDRIVE",
  "HOMEPATH",
  "LOCALAPPDATA",
  "PATH",
  "PROCESSOR_ARCHITECTURE",
  "SYSTEMDRIVE",
  "SYSTEMROOT",
  "TEMP",
  "USERNAME",
  "USERPROFILE"
] : (
  /* list inspired by the default env inheritance of sudo */
  ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
);
function Tw() {
  const s = {};
  for (const n of Sw) {
    const r = Wr.env[n];
    r !== void 0 && (r.startsWith("()") || (s[n] = r));
  }
  return s;
}
class Ew {
  constructor(n) {
    this._abortController = new AbortController(), this._readBuffer = new ww(), this._serverParams = n;
  }
  /**
   * Starts the server process and prepares to communicate with it.
   */
  async start() {
    if (this._process)
      throw new Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return new Promise((n, r) => {
      var a, u, c, p, _, y;
      this._process = yw(this._serverParams.command, (a = this._serverParams.args) !== null && a !== void 0 ? a : [], {
        env: (u = this._serverParams.env) !== null && u !== void 0 ? u : Tw(),
        stdio: ["pipe", "pipe", (c = this._serverParams.stderr) !== null && c !== void 0 ? c : "inherit"],
        shell: !1,
        signal: this._abortController.signal,
        windowsHide: Wr.platform === "win32" && Rw(),
        cwd: this._serverParams.cwd
      }), this._process.on("error", (w) => {
        var S, I;
        if (w.name === "AbortError") {
          (S = this.onclose) === null || S === void 0 || S.call(this);
          return;
        }
        r(w), (I = this.onerror) === null || I === void 0 || I.call(this, w);
      }), this._process.on("spawn", () => {
        n();
      }), this._process.on("close", (w) => {
        var S;
        this._process = void 0, (S = this.onclose) === null || S === void 0 || S.call(this);
      }), (p = this._process.stdin) === null || p === void 0 || p.on("error", (w) => {
        var S;
        (S = this.onerror) === null || S === void 0 || S.call(this, w);
      }), (_ = this._process.stdout) === null || _ === void 0 || _.on("data", (w) => {
        this._readBuffer.append(w), this.processReadBuffer();
      }), (y = this._process.stdout) === null || y === void 0 || y.on("error", (w) => {
        var S;
        (S = this.onerror) === null || S === void 0 || S.call(this, w);
      });
    });
  }
  /**
   * The stderr stream of the child process, if `StdioServerParameters.stderr` was set to "pipe" or "overlapped".
   *
   * This is only available after the process has been started.
   */
  get stderr() {
    var n, r;
    return (r = (n = this._process) === null || n === void 0 ? void 0 : n.stderr) !== null && r !== void 0 ? r : null;
  }
  processReadBuffer() {
    for (var n, r; ; )
      try {
        const a = this._readBuffer.readMessage();
        if (a === null)
          break;
        (n = this.onmessage) === null || n === void 0 || n.call(this, a);
      } catch (a) {
        (r = this.onerror) === null || r === void 0 || r.call(this, a);
      }
  }
  async close() {
    this._abortController.abort(), this._process = void 0, this._readBuffer.clear();
  }
  send(n) {
    return new Promise((r) => {
      var a;
      if (!(!((a = this._process) === null || a === void 0) && a.stdin))
        throw new Error("Not connected");
      const u = bw(n);
      this._process.stdin.write(u) ? r() : this._process.stdin.once("drain", r);
    });
  }
}
function Rw() {
  return "type" in Wr;
}
var br = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var Cw = br.exports, il;
function Aw() {
  return il || (il = 1, function(s, n) {
    (function() {
      var r, a = "4.17.21", u = 200, c = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", p = "Expected a function", _ = "Invalid `variable` option passed into `_.template`", y = "__lodash_hash_undefined__", w = 500, S = "__lodash_placeholder__", I = 1, X = 2, ee = 4, ue = 1, B = 2, U = 1, te = 2, ye = 4, he = 8, Te = 16, ke = 32, Je = 64, qe = 128, Qt = 256, ns = 512, ql = 30, Bl = "...", Fl = 800, Hl = 16, so = 1, zl = 2, jl = 3, qr = 1 / 0, vn = 9007199254740991, Vl = 17976931348623157e292, Br = NaN, mt = 4294967295, Gl = mt - 1, Kl = mt >>> 1, Jl = [
        ["ary", qe],
        ["bind", U],
        ["bindKey", te],
        ["curry", he],
        ["curryRight", Te],
        ["flip", ns],
        ["partial", ke],
        ["partialRight", Je],
        ["rearg", Qt]
      ], yn = "[object Arguments]", Fr = "[object Array]", Yl = "[object AsyncFunction]", Gn = "[object Boolean]", Kn = "[object Date]", Xl = "[object DOMException]", Hr = "[object Error]", zr = "[object Function]", ao = "[object GeneratorFunction]", st = "[object Map]", Jn = "[object Number]", Ql = "[object Null]", Et = "[object Object]", oo = "[object Promise]", ef = "[object Proxy]", Yn = "[object RegExp]", at = "[object Set]", Xn = "[object String]", jr = "[object Symbol]", tf = "[object Undefined]", Qn = "[object WeakMap]", nf = "[object WeakSet]", er = "[object ArrayBuffer]", wn = "[object DataView]", rs = "[object Float32Array]", is = "[object Float64Array]", ss = "[object Int8Array]", as = "[object Int16Array]", os = "[object Int32Array]", us = "[object Uint8Array]", cs = "[object Uint8ClampedArray]", ls = "[object Uint16Array]", fs = "[object Uint32Array]", rf = /\b__p \+= '';/g, sf = /\b(__p \+=) '' \+/g, af = /(__e\(.*?\)|\b__t\)) \+\n'';/g, uo = /&(?:amp|lt|gt|quot|#39);/g, co = /[&<>"']/g, of = RegExp(uo.source), uf = RegExp(co.source), cf = /<%-([\s\S]+?)%>/g, lf = /<%([\s\S]+?)%>/g, lo = /<%=([\s\S]+?)%>/g, ff = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, df = /^\w*$/, hf = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ds = /[\\^$.*+?()[\]{}|]/g, pf = RegExp(ds.source), hs = /^\s+/, gf = /\s/, _f = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, mf = /\{\n\/\* \[wrapped with (.+)\] \*/, vf = /,? & /, yf = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, wf = /[()=,{}\[\]\/\s]/, xf = /\\(\\)?/g, bf = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, fo = /\w*$/, Sf = /^[-+]0x[0-9a-f]+$/i, Tf = /^0b[01]+$/i, Ef = /^\[object .+?Constructor\]$/, Rf = /^0o[0-7]+$/i, Cf = /^(?:0|[1-9]\d*)$/, Af = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Vr = /($^)/, If = /['\n\r\u2028\u2029\\]/g, Gr = "\\ud800-\\udfff", Of = "\\u0300-\\u036f", kf = "\\ufe20-\\ufe2f", Pf = "\\u20d0-\\u20ff", ho = Of + kf + Pf, po = "\\u2700-\\u27bf", go = "a-z\\xdf-\\xf6\\xf8-\\xff", Nf = "\\xac\\xb1\\xd7\\xf7", Lf = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Mf = "\\u2000-\\u206f", Uf = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", _o = "A-Z\\xc0-\\xd6\\xd8-\\xde", mo = "\\ufe0e\\ufe0f", vo = Nf + Lf + Mf + Uf, ps = "['’]", $f = "[" + Gr + "]", yo = "[" + vo + "]", Kr = "[" + ho + "]", wo = "\\d+", Zf = "[" + po + "]", xo = "[" + go + "]", bo = "[^" + Gr + vo + wo + po + go + _o + "]", gs = "\\ud83c[\\udffb-\\udfff]", Df = "(?:" + Kr + "|" + gs + ")", So = "[^" + Gr + "]", _s = "(?:\\ud83c[\\udde6-\\uddff]){2}", ms = "[\\ud800-\\udbff][\\udc00-\\udfff]", xn = "[" + _o + "]", To = "\\u200d", Eo = "(?:" + xo + "|" + bo + ")", Wf = "(?:" + xn + "|" + bo + ")", Ro = "(?:" + ps + "(?:d|ll|m|re|s|t|ve))?", Co = "(?:" + ps + "(?:D|LL|M|RE|S|T|VE))?", Ao = Df + "?", Io = "[" + mo + "]?", qf = "(?:" + To + "(?:" + [So, _s, ms].join("|") + ")" + Io + Ao + ")*", Bf = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Ff = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Oo = Io + Ao + qf, Hf = "(?:" + [Zf, _s, ms].join("|") + ")" + Oo, zf = "(?:" + [So + Kr + "?", Kr, _s, ms, $f].join("|") + ")", jf = RegExp(ps, "g"), Vf = RegExp(Kr, "g"), vs = RegExp(gs + "(?=" + gs + ")|" + zf + Oo, "g"), Gf = RegExp([
        xn + "?" + xo + "+" + Ro + "(?=" + [yo, xn, "$"].join("|") + ")",
        Wf + "+" + Co + "(?=" + [yo, xn + Eo, "$"].join("|") + ")",
        xn + "?" + Eo + "+" + Ro,
        xn + "+" + Co,
        Ff,
        Bf,
        wo,
        Hf
      ].join("|"), "g"), Kf = RegExp("[" + To + Gr + ho + mo + "]"), Jf = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Yf = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ], Xf = -1, le = {};
      le[rs] = le[is] = le[ss] = le[as] = le[os] = le[us] = le[cs] = le[ls] = le[fs] = !0, le[yn] = le[Fr] = le[er] = le[Gn] = le[wn] = le[Kn] = le[Hr] = le[zr] = le[st] = le[Jn] = le[Et] = le[Yn] = le[at] = le[Xn] = le[Qn] = !1;
      var ce = {};
      ce[yn] = ce[Fr] = ce[er] = ce[wn] = ce[Gn] = ce[Kn] = ce[rs] = ce[is] = ce[ss] = ce[as] = ce[os] = ce[st] = ce[Jn] = ce[Et] = ce[Yn] = ce[at] = ce[Xn] = ce[jr] = ce[us] = ce[cs] = ce[ls] = ce[fs] = !0, ce[Hr] = ce[zr] = ce[Qn] = !1;
      var Qf = {
        // Latin-1 Supplement block.
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "A",
        Å: "A",
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "a",
        å: "a",
        Ç: "C",
        ç: "c",
        Ð: "D",
        ð: "d",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        Ñ: "N",
        ñ: "n",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "O",
        Ø: "O",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "o",
        ø: "o",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "U",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "u",
        Ý: "Y",
        ý: "y",
        ÿ: "y",
        Æ: "Ae",
        æ: "ae",
        Þ: "Th",
        þ: "th",
        ß: "ss",
        // Latin Extended-A block.
        Ā: "A",
        Ă: "A",
        Ą: "A",
        ā: "a",
        ă: "a",
        ą: "a",
        Ć: "C",
        Ĉ: "C",
        Ċ: "C",
        Č: "C",
        ć: "c",
        ĉ: "c",
        ċ: "c",
        č: "c",
        Ď: "D",
        Đ: "D",
        ď: "d",
        đ: "d",
        Ē: "E",
        Ĕ: "E",
        Ė: "E",
        Ę: "E",
        Ě: "E",
        ē: "e",
        ĕ: "e",
        ė: "e",
        ę: "e",
        ě: "e",
        Ĝ: "G",
        Ğ: "G",
        Ġ: "G",
        Ģ: "G",
        ĝ: "g",
        ğ: "g",
        ġ: "g",
        ģ: "g",
        Ĥ: "H",
        Ħ: "H",
        ĥ: "h",
        ħ: "h",
        Ĩ: "I",
        Ī: "I",
        Ĭ: "I",
        Į: "I",
        İ: "I",
        ĩ: "i",
        ī: "i",
        ĭ: "i",
        į: "i",
        ı: "i",
        Ĵ: "J",
        ĵ: "j",
        Ķ: "K",
        ķ: "k",
        ĸ: "k",
        Ĺ: "L",
        Ļ: "L",
        Ľ: "L",
        Ŀ: "L",
        Ł: "L",
        ĺ: "l",
        ļ: "l",
        ľ: "l",
        ŀ: "l",
        ł: "l",
        Ń: "N",
        Ņ: "N",
        Ň: "N",
        Ŋ: "N",
        ń: "n",
        ņ: "n",
        ň: "n",
        ŋ: "n",
        Ō: "O",
        Ŏ: "O",
        Ő: "O",
        ō: "o",
        ŏ: "o",
        ő: "o",
        Ŕ: "R",
        Ŗ: "R",
        Ř: "R",
        ŕ: "r",
        ŗ: "r",
        ř: "r",
        Ś: "S",
        Ŝ: "S",
        Ş: "S",
        Š: "S",
        ś: "s",
        ŝ: "s",
        ş: "s",
        š: "s",
        Ţ: "T",
        Ť: "T",
        Ŧ: "T",
        ţ: "t",
        ť: "t",
        ŧ: "t",
        Ũ: "U",
        Ū: "U",
        Ŭ: "U",
        Ů: "U",
        Ű: "U",
        Ų: "U",
        ũ: "u",
        ū: "u",
        ŭ: "u",
        ů: "u",
        ű: "u",
        ų: "u",
        Ŵ: "W",
        ŵ: "w",
        Ŷ: "Y",
        ŷ: "y",
        Ÿ: "Y",
        Ź: "Z",
        Ż: "Z",
        Ž: "Z",
        ź: "z",
        ż: "z",
        ž: "z",
        Ĳ: "IJ",
        ĳ: "ij",
        Œ: "Oe",
        œ: "oe",
        ŉ: "'n",
        ſ: "s"
      }, ed = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, td = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      }, nd = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      }, rd = parseFloat, id = parseInt, ko = typeof xr == "object" && xr && xr.Object === Object && xr, sd = typeof self == "object" && self && self.Object === Object && self, Ee = ko || sd || Function("return this")(), ys = n && !n.nodeType && n, en = ys && !0 && s && !s.nodeType && s, Po = en && en.exports === ys, ws = Po && ko.process, Ye = function() {
        try {
          var v = en && en.require && en.require("util").types;
          return v || ws && ws.binding && ws.binding("util");
        } catch {
        }
      }(), No = Ye && Ye.isArrayBuffer, Lo = Ye && Ye.isDate, Mo = Ye && Ye.isMap, Uo = Ye && Ye.isRegExp, $o = Ye && Ye.isSet, Zo = Ye && Ye.isTypedArray;
      function Be(v, T, b) {
        switch (b.length) {
          case 0:
            return v.call(T);
          case 1:
            return v.call(T, b[0]);
          case 2:
            return v.call(T, b[0], b[1]);
          case 3:
            return v.call(T, b[0], b[1], b[2]);
        }
        return v.apply(T, b);
      }
      function ad(v, T, b, N) {
        for (var F = -1, ie = v == null ? 0 : v.length; ++F < ie; ) {
          var we = v[F];
          T(N, we, b(we), v);
        }
        return N;
      }
      function Xe(v, T) {
        for (var b = -1, N = v == null ? 0 : v.length; ++b < N && T(v[b], b, v) !== !1; )
          ;
        return v;
      }
      function od(v, T) {
        for (var b = v == null ? 0 : v.length; b-- && T(v[b], b, v) !== !1; )
          ;
        return v;
      }
      function Do(v, T) {
        for (var b = -1, N = v == null ? 0 : v.length; ++b < N; )
          if (!T(v[b], b, v))
            return !1;
        return !0;
      }
      function Dt(v, T) {
        for (var b = -1, N = v == null ? 0 : v.length, F = 0, ie = []; ++b < N; ) {
          var we = v[b];
          T(we, b, v) && (ie[F++] = we);
        }
        return ie;
      }
      function Jr(v, T) {
        var b = v == null ? 0 : v.length;
        return !!b && bn(v, T, 0) > -1;
      }
      function xs(v, T, b) {
        for (var N = -1, F = v == null ? 0 : v.length; ++N < F; )
          if (b(T, v[N]))
            return !0;
        return !1;
      }
      function fe(v, T) {
        for (var b = -1, N = v == null ? 0 : v.length, F = Array(N); ++b < N; )
          F[b] = T(v[b], b, v);
        return F;
      }
      function Wt(v, T) {
        for (var b = -1, N = T.length, F = v.length; ++b < N; )
          v[F + b] = T[b];
        return v;
      }
      function bs(v, T, b, N) {
        var F = -1, ie = v == null ? 0 : v.length;
        for (N && ie && (b = v[++F]); ++F < ie; )
          b = T(b, v[F], F, v);
        return b;
      }
      function ud(v, T, b, N) {
        var F = v == null ? 0 : v.length;
        for (N && F && (b = v[--F]); F--; )
          b = T(b, v[F], F, v);
        return b;
      }
      function Ss(v, T) {
        for (var b = -1, N = v == null ? 0 : v.length; ++b < N; )
          if (T(v[b], b, v))
            return !0;
        return !1;
      }
      var cd = Ts("length");
      function ld(v) {
        return v.split("");
      }
      function fd(v) {
        return v.match(yf) || [];
      }
      function Wo(v, T, b) {
        var N;
        return b(v, function(F, ie, we) {
          if (T(F, ie, we))
            return N = ie, !1;
        }), N;
      }
      function Yr(v, T, b, N) {
        for (var F = v.length, ie = b + (N ? 1 : -1); N ? ie-- : ++ie < F; )
          if (T(v[ie], ie, v))
            return ie;
        return -1;
      }
      function bn(v, T, b) {
        return T === T ? Sd(v, T, b) : Yr(v, qo, b);
      }
      function dd(v, T, b, N) {
        for (var F = b - 1, ie = v.length; ++F < ie; )
          if (N(v[F], T))
            return F;
        return -1;
      }
      function qo(v) {
        return v !== v;
      }
      function Bo(v, T) {
        var b = v == null ? 0 : v.length;
        return b ? Rs(v, T) / b : Br;
      }
      function Ts(v) {
        return function(T) {
          return T == null ? r : T[v];
        };
      }
      function Es(v) {
        return function(T) {
          return v == null ? r : v[T];
        };
      }
      function Fo(v, T, b, N, F) {
        return F(v, function(ie, we, oe) {
          b = N ? (N = !1, ie) : T(b, ie, we, oe);
        }), b;
      }
      function hd(v, T) {
        var b = v.length;
        for (v.sort(T); b--; )
          v[b] = v[b].value;
        return v;
      }
      function Rs(v, T) {
        for (var b, N = -1, F = v.length; ++N < F; ) {
          var ie = T(v[N]);
          ie !== r && (b = b === r ? ie : b + ie);
        }
        return b;
      }
      function Cs(v, T) {
        for (var b = -1, N = Array(v); ++b < v; )
          N[b] = T(b);
        return N;
      }
      function pd(v, T) {
        return fe(T, function(b) {
          return [b, v[b]];
        });
      }
      function Ho(v) {
        return v && v.slice(0, Go(v) + 1).replace(hs, "");
      }
      function Fe(v) {
        return function(T) {
          return v(T);
        };
      }
      function As(v, T) {
        return fe(T, function(b) {
          return v[b];
        });
      }
      function tr(v, T) {
        return v.has(T);
      }
      function zo(v, T) {
        for (var b = -1, N = v.length; ++b < N && bn(T, v[b], 0) > -1; )
          ;
        return b;
      }
      function jo(v, T) {
        for (var b = v.length; b-- && bn(T, v[b], 0) > -1; )
          ;
        return b;
      }
      function gd(v, T) {
        for (var b = v.length, N = 0; b--; )
          v[b] === T && ++N;
        return N;
      }
      var _d = Es(Qf), md = Es(ed);
      function vd(v) {
        return "\\" + nd[v];
      }
      function yd(v, T) {
        return v == null ? r : v[T];
      }
      function Sn(v) {
        return Kf.test(v);
      }
      function wd(v) {
        return Jf.test(v);
      }
      function xd(v) {
        for (var T, b = []; !(T = v.next()).done; )
          b.push(T.value);
        return b;
      }
      function Is(v) {
        var T = -1, b = Array(v.size);
        return v.forEach(function(N, F) {
          b[++T] = [F, N];
        }), b;
      }
      function Vo(v, T) {
        return function(b) {
          return v(T(b));
        };
      }
      function qt(v, T) {
        for (var b = -1, N = v.length, F = 0, ie = []; ++b < N; ) {
          var we = v[b];
          (we === T || we === S) && (v[b] = S, ie[F++] = b);
        }
        return ie;
      }
      function Xr(v) {
        var T = -1, b = Array(v.size);
        return v.forEach(function(N) {
          b[++T] = N;
        }), b;
      }
      function bd(v) {
        var T = -1, b = Array(v.size);
        return v.forEach(function(N) {
          b[++T] = [N, N];
        }), b;
      }
      function Sd(v, T, b) {
        for (var N = b - 1, F = v.length; ++N < F; )
          if (v[N] === T)
            return N;
        return -1;
      }
      function Td(v, T, b) {
        for (var N = b + 1; N--; )
          if (v[N] === T)
            return N;
        return N;
      }
      function Tn(v) {
        return Sn(v) ? Rd(v) : cd(v);
      }
      function ot(v) {
        return Sn(v) ? Cd(v) : ld(v);
      }
      function Go(v) {
        for (var T = v.length; T-- && gf.test(v.charAt(T)); )
          ;
        return T;
      }
      var Ed = Es(td);
      function Rd(v) {
        for (var T = vs.lastIndex = 0; vs.test(v); )
          ++T;
        return T;
      }
      function Cd(v) {
        return v.match(vs) || [];
      }
      function Ad(v) {
        return v.match(Gf) || [];
      }
      var Id = function v(T) {
        T = T == null ? Ee : En.defaults(Ee.Object(), T, En.pick(Ee, Yf));
        var b = T.Array, N = T.Date, F = T.Error, ie = T.Function, we = T.Math, oe = T.Object, Os = T.RegExp, Od = T.String, Qe = T.TypeError, Qr = b.prototype, kd = ie.prototype, Rn = oe.prototype, ei = T["__core-js_shared__"], ti = kd.toString, ae = Rn.hasOwnProperty, Pd = 0, Ko = function() {
          var e = /[^.]+$/.exec(ei && ei.keys && ei.keys.IE_PROTO || "");
          return e ? "Symbol(src)_1." + e : "";
        }(), ni = Rn.toString, Nd = ti.call(oe), Ld = Ee._, Md = Os(
          "^" + ti.call(ae).replace(ds, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
        ), ri = Po ? T.Buffer : r, Bt = T.Symbol, ii = T.Uint8Array, Jo = ri ? ri.allocUnsafe : r, si = Vo(oe.getPrototypeOf, oe), Yo = oe.create, Xo = Rn.propertyIsEnumerable, ai = Qr.splice, Qo = Bt ? Bt.isConcatSpreadable : r, nr = Bt ? Bt.iterator : r, tn = Bt ? Bt.toStringTag : r, oi = function() {
          try {
            var e = on(oe, "defineProperty");
            return e({}, "", {}), e;
          } catch {
          }
        }(), Ud = T.clearTimeout !== Ee.clearTimeout && T.clearTimeout, $d = N && N.now !== Ee.Date.now && N.now, Zd = T.setTimeout !== Ee.setTimeout && T.setTimeout, ui = we.ceil, ci = we.floor, ks = oe.getOwnPropertySymbols, Dd = ri ? ri.isBuffer : r, eu = T.isFinite, Wd = Qr.join, qd = Vo(oe.keys, oe), xe = we.max, Ae = we.min, Bd = N.now, Fd = T.parseInt, tu = we.random, Hd = Qr.reverse, Ps = on(T, "DataView"), rr = on(T, "Map"), Ns = on(T, "Promise"), Cn = on(T, "Set"), ir = on(T, "WeakMap"), sr = on(oe, "create"), li = ir && new ir(), An = {}, zd = un(Ps), jd = un(rr), Vd = un(Ns), Gd = un(Cn), Kd = un(ir), fi = Bt ? Bt.prototype : r, ar = fi ? fi.valueOf : r, nu = fi ? fi.toString : r;
        function f(e) {
          if (_e(e) && !H(e) && !(e instanceof Q)) {
            if (e instanceof et)
              return e;
            if (ae.call(e, "__wrapped__"))
              return rc(e);
          }
          return new et(e);
        }
        var In = /* @__PURE__ */ function() {
          function e() {
          }
          return function(t) {
            if (!pe(t))
              return {};
            if (Yo)
              return Yo(t);
            e.prototype = t;
            var i = new e();
            return e.prototype = r, i;
          };
        }();
        function di() {
        }
        function et(e, t) {
          this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = r;
        }
        f.templateSettings = {
          /**
           * Used to detect `data` property values to be HTML-escaped.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          escape: cf,
          /**
           * Used to detect code to be evaluated.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          evaluate: lf,
          /**
           * Used to detect `data` property values to inject.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          interpolate: lo,
          /**
           * Used to reference the data object in the template text.
           *
           * @memberOf _.templateSettings
           * @type {string}
           */
          variable: "",
          /**
           * Used to import variables into the compiled template.
           *
           * @memberOf _.templateSettings
           * @type {Object}
           */
          imports: {
            /**
             * A reference to the `lodash` function.
             *
             * @memberOf _.templateSettings.imports
             * @type {Function}
             */
            _: f
          }
        }, f.prototype = di.prototype, f.prototype.constructor = f, et.prototype = In(di.prototype), et.prototype.constructor = et;
        function Q(e) {
          this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = mt, this.__views__ = [];
        }
        function Jd() {
          var e = new Q(this.__wrapped__);
          return e.__actions__ = Ue(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = Ue(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = Ue(this.__views__), e;
        }
        function Yd() {
          if (this.__filtered__) {
            var e = new Q(this);
            e.__dir__ = -1, e.__filtered__ = !0;
          } else
            e = this.clone(), e.__dir__ *= -1;
          return e;
        }
        function Xd() {
          var e = this.__wrapped__.value(), t = this.__dir__, i = H(e), o = t < 0, l = i ? e.length : 0, h = lp(0, l, this.__views__), g = h.start, m = h.end, x = m - g, E = o ? m : g - 1, R = this.__iteratees__, C = R.length, O = 0, L = Ae(x, this.__takeCount__);
          if (!i || !o && l == x && L == x)
            return Ru(e, this.__actions__);
          var Z = [];
          e:
            for (; x-- && O < L; ) {
              E += t;
              for (var V = -1, D = e[E]; ++V < C; ) {
                var J = R[V], ne = J.iteratee, je = J.type, Le = ne(D);
                if (je == zl)
                  D = Le;
                else if (!Le) {
                  if (je == so)
                    continue e;
                  break e;
                }
              }
              Z[O++] = D;
            }
          return Z;
        }
        Q.prototype = In(di.prototype), Q.prototype.constructor = Q;
        function nn(e) {
          var t = -1, i = e == null ? 0 : e.length;
          for (this.clear(); ++t < i; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function Qd() {
          this.__data__ = sr ? sr(null) : {}, this.size = 0;
        }
        function eh(e) {
          var t = this.has(e) && delete this.__data__[e];
          return this.size -= t ? 1 : 0, t;
        }
        function th(e) {
          var t = this.__data__;
          if (sr) {
            var i = t[e];
            return i === y ? r : i;
          }
          return ae.call(t, e) ? t[e] : r;
        }
        function nh(e) {
          var t = this.__data__;
          return sr ? t[e] !== r : ae.call(t, e);
        }
        function rh(e, t) {
          var i = this.__data__;
          return this.size += this.has(e) ? 0 : 1, i[e] = sr && t === r ? y : t, this;
        }
        nn.prototype.clear = Qd, nn.prototype.delete = eh, nn.prototype.get = th, nn.prototype.has = nh, nn.prototype.set = rh;
        function Rt(e) {
          var t = -1, i = e == null ? 0 : e.length;
          for (this.clear(); ++t < i; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function ih() {
          this.__data__ = [], this.size = 0;
        }
        function sh(e) {
          var t = this.__data__, i = hi(t, e);
          if (i < 0)
            return !1;
          var o = t.length - 1;
          return i == o ? t.pop() : ai.call(t, i, 1), --this.size, !0;
        }
        function ah(e) {
          var t = this.__data__, i = hi(t, e);
          return i < 0 ? r : t[i][1];
        }
        function oh(e) {
          return hi(this.__data__, e) > -1;
        }
        function uh(e, t) {
          var i = this.__data__, o = hi(i, e);
          return o < 0 ? (++this.size, i.push([e, t])) : i[o][1] = t, this;
        }
        Rt.prototype.clear = ih, Rt.prototype.delete = sh, Rt.prototype.get = ah, Rt.prototype.has = oh, Rt.prototype.set = uh;
        function Ct(e) {
          var t = -1, i = e == null ? 0 : e.length;
          for (this.clear(); ++t < i; ) {
            var o = e[t];
            this.set(o[0], o[1]);
          }
        }
        function ch() {
          this.size = 0, this.__data__ = {
            hash: new nn(),
            map: new (rr || Rt)(),
            string: new nn()
          };
        }
        function lh(e) {
          var t = Ei(this, e).delete(e);
          return this.size -= t ? 1 : 0, t;
        }
        function fh(e) {
          return Ei(this, e).get(e);
        }
        function dh(e) {
          return Ei(this, e).has(e);
        }
        function hh(e, t) {
          var i = Ei(this, e), o = i.size;
          return i.set(e, t), this.size += i.size == o ? 0 : 1, this;
        }
        Ct.prototype.clear = ch, Ct.prototype.delete = lh, Ct.prototype.get = fh, Ct.prototype.has = dh, Ct.prototype.set = hh;
        function rn(e) {
          var t = -1, i = e == null ? 0 : e.length;
          for (this.__data__ = new Ct(); ++t < i; )
            this.add(e[t]);
        }
        function ph(e) {
          return this.__data__.set(e, y), this;
        }
        function gh(e) {
          return this.__data__.has(e);
        }
        rn.prototype.add = rn.prototype.push = ph, rn.prototype.has = gh;
        function ut(e) {
          var t = this.__data__ = new Rt(e);
          this.size = t.size;
        }
        function _h() {
          this.__data__ = new Rt(), this.size = 0;
        }
        function mh(e) {
          var t = this.__data__, i = t.delete(e);
          return this.size = t.size, i;
        }
        function vh(e) {
          return this.__data__.get(e);
        }
        function yh(e) {
          return this.__data__.has(e);
        }
        function wh(e, t) {
          var i = this.__data__;
          if (i instanceof Rt) {
            var o = i.__data__;
            if (!rr || o.length < u - 1)
              return o.push([e, t]), this.size = ++i.size, this;
            i = this.__data__ = new Ct(o);
          }
          return i.set(e, t), this.size = i.size, this;
        }
        ut.prototype.clear = _h, ut.prototype.delete = mh, ut.prototype.get = vh, ut.prototype.has = yh, ut.prototype.set = wh;
        function ru(e, t) {
          var i = H(e), o = !i && cn(e), l = !i && !o && Vt(e), h = !i && !o && !l && Nn(e), g = i || o || l || h, m = g ? Cs(e.length, Od) : [], x = m.length;
          for (var E in e)
            (t || ae.call(e, E)) && !(g && // Safari 9 has enumerable `arguments.length` in strict mode.
            (E == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
            l && (E == "offset" || E == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
            h && (E == "buffer" || E == "byteLength" || E == "byteOffset") || // Skip index properties.
            kt(E, x))) && m.push(E);
          return m;
        }
        function iu(e) {
          var t = e.length;
          return t ? e[Hs(0, t - 1)] : r;
        }
        function xh(e, t) {
          return Ri(Ue(e), sn(t, 0, e.length));
        }
        function bh(e) {
          return Ri(Ue(e));
        }
        function Ls(e, t, i) {
          (i !== r && !ct(e[t], i) || i === r && !(t in e)) && At(e, t, i);
        }
        function or(e, t, i) {
          var o = e[t];
          (!(ae.call(e, t) && ct(o, i)) || i === r && !(t in e)) && At(e, t, i);
        }
        function hi(e, t) {
          for (var i = e.length; i--; )
            if (ct(e[i][0], t))
              return i;
          return -1;
        }
        function Sh(e, t, i, o) {
          return Ft(e, function(l, h, g) {
            t(o, l, i(l), g);
          }), o;
        }
        function su(e, t) {
          return e && yt(t, Se(t), e);
        }
        function Th(e, t) {
          return e && yt(t, Ze(t), e);
        }
        function At(e, t, i) {
          t == "__proto__" && oi ? oi(e, t, {
            configurable: !0,
            enumerable: !0,
            value: i,
            writable: !0
          }) : e[t] = i;
        }
        function Ms(e, t) {
          for (var i = -1, o = t.length, l = b(o), h = e == null; ++i < o; )
            l[i] = h ? r : ga(e, t[i]);
          return l;
        }
        function sn(e, t, i) {
          return e === e && (i !== r && (e = e <= i ? e : i), t !== r && (e = e >= t ? e : t)), e;
        }
        function tt(e, t, i, o, l, h) {
          var g, m = t & I, x = t & X, E = t & ee;
          if (i && (g = l ? i(e, o, l, h) : i(e)), g !== r)
            return g;
          if (!pe(e))
            return e;
          var R = H(e);
          if (R) {
            if (g = dp(e), !m)
              return Ue(e, g);
          } else {
            var C = Ie(e), O = C == zr || C == ao;
            if (Vt(e))
              return Iu(e, m);
            if (C == Et || C == yn || O && !l) {
              if (g = x || O ? {} : Gu(e), !m)
                return x ? tp(e, Th(g, e)) : ep(e, su(g, e));
            } else {
              if (!ce[C])
                return l ? e : {};
              g = hp(e, C, m);
            }
          }
          h || (h = new ut());
          var L = h.get(e);
          if (L)
            return L;
          h.set(e, g), Sc(e) ? e.forEach(function(D) {
            g.add(tt(D, t, i, D, e, h));
          }) : xc(e) && e.forEach(function(D, J) {
            g.set(J, tt(D, t, i, J, e, h));
          });
          var Z = E ? x ? ta : ea : x ? Ze : Se, V = R ? r : Z(e);
          return Xe(V || e, function(D, J) {
            V && (J = D, D = e[J]), or(g, J, tt(D, t, i, J, e, h));
          }), g;
        }
        function Eh(e) {
          var t = Se(e);
          return function(i) {
            return au(i, e, t);
          };
        }
        function au(e, t, i) {
          var o = i.length;
          if (e == null)
            return !o;
          for (e = oe(e); o--; ) {
            var l = i[o], h = t[l], g = e[l];
            if (g === r && !(l in e) || !h(g))
              return !1;
          }
          return !0;
        }
        function ou(e, t, i) {
          if (typeof e != "function")
            throw new Qe(p);
          return pr(function() {
            e.apply(r, i);
          }, t);
        }
        function ur(e, t, i, o) {
          var l = -1, h = Jr, g = !0, m = e.length, x = [], E = t.length;
          if (!m)
            return x;
          i && (t = fe(t, Fe(i))), o ? (h = xs, g = !1) : t.length >= u && (h = tr, g = !1, t = new rn(t));
          e:
            for (; ++l < m; ) {
              var R = e[l], C = i == null ? R : i(R);
              if (R = o || R !== 0 ? R : 0, g && C === C) {
                for (var O = E; O--; )
                  if (t[O] === C)
                    continue e;
                x.push(R);
              } else h(t, C, o) || x.push(R);
            }
          return x;
        }
        var Ft = Lu(vt), uu = Lu($s, !0);
        function Rh(e, t) {
          var i = !0;
          return Ft(e, function(o, l, h) {
            return i = !!t(o, l, h), i;
          }), i;
        }
        function pi(e, t, i) {
          for (var o = -1, l = e.length; ++o < l; ) {
            var h = e[o], g = t(h);
            if (g != null && (m === r ? g === g && !ze(g) : i(g, m)))
              var m = g, x = h;
          }
          return x;
        }
        function Ch(e, t, i, o) {
          var l = e.length;
          for (i = j(i), i < 0 && (i = -i > l ? 0 : l + i), o = o === r || o > l ? l : j(o), o < 0 && (o += l), o = i > o ? 0 : Ec(o); i < o; )
            e[i++] = t;
          return e;
        }
        function cu(e, t) {
          var i = [];
          return Ft(e, function(o, l, h) {
            t(o, l, h) && i.push(o);
          }), i;
        }
        function Re(e, t, i, o, l) {
          var h = -1, g = e.length;
          for (i || (i = gp), l || (l = []); ++h < g; ) {
            var m = e[h];
            t > 0 && i(m) ? t > 1 ? Re(m, t - 1, i, o, l) : Wt(l, m) : o || (l[l.length] = m);
          }
          return l;
        }
        var Us = Mu(), lu = Mu(!0);
        function vt(e, t) {
          return e && Us(e, t, Se);
        }
        function $s(e, t) {
          return e && lu(e, t, Se);
        }
        function gi(e, t) {
          return Dt(t, function(i) {
            return Pt(e[i]);
          });
        }
        function an(e, t) {
          t = zt(t, e);
          for (var i = 0, o = t.length; e != null && i < o; )
            e = e[wt(t[i++])];
          return i && i == o ? e : r;
        }
        function fu(e, t, i) {
          var o = t(e);
          return H(e) ? o : Wt(o, i(e));
        }
        function Pe(e) {
          return e == null ? e === r ? tf : Ql : tn && tn in oe(e) ? cp(e) : bp(e);
        }
        function Zs(e, t) {
          return e > t;
        }
        function Ah(e, t) {
          return e != null && ae.call(e, t);
        }
        function Ih(e, t) {
          return e != null && t in oe(e);
        }
        function Oh(e, t, i) {
          return e >= Ae(t, i) && e < xe(t, i);
        }
        function Ds(e, t, i) {
          for (var o = i ? xs : Jr, l = e[0].length, h = e.length, g = h, m = b(h), x = 1 / 0, E = []; g--; ) {
            var R = e[g];
            g && t && (R = fe(R, Fe(t))), x = Ae(R.length, x), m[g] = !i && (t || l >= 120 && R.length >= 120) ? new rn(g && R) : r;
          }
          R = e[0];
          var C = -1, O = m[0];
          e:
            for (; ++C < l && E.length < x; ) {
              var L = R[C], Z = t ? t(L) : L;
              if (L = i || L !== 0 ? L : 0, !(O ? tr(O, Z) : o(E, Z, i))) {
                for (g = h; --g; ) {
                  var V = m[g];
                  if (!(V ? tr(V, Z) : o(e[g], Z, i)))
                    continue e;
                }
                O && O.push(Z), E.push(L);
              }
            }
          return E;
        }
        function kh(e, t, i, o) {
          return vt(e, function(l, h, g) {
            t(o, i(l), h, g);
          }), o;
        }
        function cr(e, t, i) {
          t = zt(t, e), e = Xu(e, t);
          var o = e == null ? e : e[wt(rt(t))];
          return o == null ? r : Be(o, e, i);
        }
        function du(e) {
          return _e(e) && Pe(e) == yn;
        }
        function Ph(e) {
          return _e(e) && Pe(e) == er;
        }
        function Nh(e) {
          return _e(e) && Pe(e) == Kn;
        }
        function lr(e, t, i, o, l) {
          return e === t ? !0 : e == null || t == null || !_e(e) && !_e(t) ? e !== e && t !== t : Lh(e, t, i, o, lr, l);
        }
        function Lh(e, t, i, o, l, h) {
          var g = H(e), m = H(t), x = g ? Fr : Ie(e), E = m ? Fr : Ie(t);
          x = x == yn ? Et : x, E = E == yn ? Et : E;
          var R = x == Et, C = E == Et, O = x == E;
          if (O && Vt(e)) {
            if (!Vt(t))
              return !1;
            g = !0, R = !1;
          }
          if (O && !R)
            return h || (h = new ut()), g || Nn(e) ? zu(e, t, i, o, l, h) : op(e, t, x, i, o, l, h);
          if (!(i & ue)) {
            var L = R && ae.call(e, "__wrapped__"), Z = C && ae.call(t, "__wrapped__");
            if (L || Z) {
              var V = L ? e.value() : e, D = Z ? t.value() : t;
              return h || (h = new ut()), l(V, D, i, o, h);
            }
          }
          return O ? (h || (h = new ut()), up(e, t, i, o, l, h)) : !1;
        }
        function Mh(e) {
          return _e(e) && Ie(e) == st;
        }
        function Ws(e, t, i, o) {
          var l = i.length, h = l, g = !o;
          if (e == null)
            return !h;
          for (e = oe(e); l--; ) {
            var m = i[l];
            if (g && m[2] ? m[1] !== e[m[0]] : !(m[0] in e))
              return !1;
          }
          for (; ++l < h; ) {
            m = i[l];
            var x = m[0], E = e[x], R = m[1];
            if (g && m[2]) {
              if (E === r && !(x in e))
                return !1;
            } else {
              var C = new ut();
              if (o)
                var O = o(E, R, x, e, t, C);
              if (!(O === r ? lr(R, E, ue | B, o, C) : O))
                return !1;
            }
          }
          return !0;
        }
        function hu(e) {
          if (!pe(e) || mp(e))
            return !1;
          var t = Pt(e) ? Md : Ef;
          return t.test(un(e));
        }
        function Uh(e) {
          return _e(e) && Pe(e) == Yn;
        }
        function $h(e) {
          return _e(e) && Ie(e) == at;
        }
        function Zh(e) {
          return _e(e) && Pi(e.length) && !!le[Pe(e)];
        }
        function pu(e) {
          return typeof e == "function" ? e : e == null ? De : typeof e == "object" ? H(e) ? mu(e[0], e[1]) : _u(e) : Uc(e);
        }
        function qs(e) {
          if (!hr(e))
            return qd(e);
          var t = [];
          for (var i in oe(e))
            ae.call(e, i) && i != "constructor" && t.push(i);
          return t;
        }
        function Dh(e) {
          if (!pe(e))
            return xp(e);
          var t = hr(e), i = [];
          for (var o in e)
            o == "constructor" && (t || !ae.call(e, o)) || i.push(o);
          return i;
        }
        function Bs(e, t) {
          return e < t;
        }
        function gu(e, t) {
          var i = -1, o = $e(e) ? b(e.length) : [];
          return Ft(e, function(l, h, g) {
            o[++i] = t(l, h, g);
          }), o;
        }
        function _u(e) {
          var t = ra(e);
          return t.length == 1 && t[0][2] ? Ju(t[0][0], t[0][1]) : function(i) {
            return i === e || Ws(i, e, t);
          };
        }
        function mu(e, t) {
          return sa(e) && Ku(t) ? Ju(wt(e), t) : function(i) {
            var o = ga(i, e);
            return o === r && o === t ? _a(i, e) : lr(t, o, ue | B);
          };
        }
        function _i(e, t, i, o, l) {
          e !== t && Us(t, function(h, g) {
            if (l || (l = new ut()), pe(h))
              Wh(e, t, g, i, _i, o, l);
            else {
              var m = o ? o(oa(e, g), h, g + "", e, t, l) : r;
              m === r && (m = h), Ls(e, g, m);
            }
          }, Ze);
        }
        function Wh(e, t, i, o, l, h, g) {
          var m = oa(e, i), x = oa(t, i), E = g.get(x);
          if (E) {
            Ls(e, i, E);
            return;
          }
          var R = h ? h(m, x, i + "", e, t, g) : r, C = R === r;
          if (C) {
            var O = H(x), L = !O && Vt(x), Z = !O && !L && Nn(x);
            R = x, O || L || Z ? H(m) ? R = m : me(m) ? R = Ue(m) : L ? (C = !1, R = Iu(x, !0)) : Z ? (C = !1, R = Ou(x, !0)) : R = [] : gr(x) || cn(x) ? (R = m, cn(m) ? R = Rc(m) : (!pe(m) || Pt(m)) && (R = Gu(x))) : C = !1;
          }
          C && (g.set(x, R), l(R, x, o, h, g), g.delete(x)), Ls(e, i, R);
        }
        function vu(e, t) {
          var i = e.length;
          if (i)
            return t += t < 0 ? i : 0, kt(t, i) ? e[t] : r;
        }
        function yu(e, t, i) {
          t.length ? t = fe(t, function(h) {
            return H(h) ? function(g) {
              return an(g, h.length === 1 ? h[0] : h);
            } : h;
          }) : t = [De];
          var o = -1;
          t = fe(t, Fe($()));
          var l = gu(e, function(h, g, m) {
            var x = fe(t, function(E) {
              return E(h);
            });
            return { criteria: x, index: ++o, value: h };
          });
          return hd(l, function(h, g) {
            return Qh(h, g, i);
          });
        }
        function qh(e, t) {
          return wu(e, t, function(i, o) {
            return _a(e, o);
          });
        }
        function wu(e, t, i) {
          for (var o = -1, l = t.length, h = {}; ++o < l; ) {
            var g = t[o], m = an(e, g);
            i(m, g) && fr(h, zt(g, e), m);
          }
          return h;
        }
        function Bh(e) {
          return function(t) {
            return an(t, e);
          };
        }
        function Fs(e, t, i, o) {
          var l = o ? dd : bn, h = -1, g = t.length, m = e;
          for (e === t && (t = Ue(t)), i && (m = fe(e, Fe(i))); ++h < g; )
            for (var x = 0, E = t[h], R = i ? i(E) : E; (x = l(m, R, x, o)) > -1; )
              m !== e && ai.call(m, x, 1), ai.call(e, x, 1);
          return e;
        }
        function xu(e, t) {
          for (var i = e ? t.length : 0, o = i - 1; i--; ) {
            var l = t[i];
            if (i == o || l !== h) {
              var h = l;
              kt(l) ? ai.call(e, l, 1) : Vs(e, l);
            }
          }
          return e;
        }
        function Hs(e, t) {
          return e + ci(tu() * (t - e + 1));
        }
        function Fh(e, t, i, o) {
          for (var l = -1, h = xe(ui((t - e) / (i || 1)), 0), g = b(h); h--; )
            g[o ? h : ++l] = e, e += i;
          return g;
        }
        function zs(e, t) {
          var i = "";
          if (!e || t < 1 || t > vn)
            return i;
          do
            t % 2 && (i += e), t = ci(t / 2), t && (e += e);
          while (t);
          return i;
        }
        function K(e, t) {
          return ua(Yu(e, t, De), e + "");
        }
        function Hh(e) {
          return iu(Ln(e));
        }
        function zh(e, t) {
          var i = Ln(e);
          return Ri(i, sn(t, 0, i.length));
        }
        function fr(e, t, i, o) {
          if (!pe(e))
            return e;
          t = zt(t, e);
          for (var l = -1, h = t.length, g = h - 1, m = e; m != null && ++l < h; ) {
            var x = wt(t[l]), E = i;
            if (x === "__proto__" || x === "constructor" || x === "prototype")
              return e;
            if (l != g) {
              var R = m[x];
              E = o ? o(R, x, m) : r, E === r && (E = pe(R) ? R : kt(t[l + 1]) ? [] : {});
            }
            or(m, x, E), m = m[x];
          }
          return e;
        }
        var bu = li ? function(e, t) {
          return li.set(e, t), e;
        } : De, jh = oi ? function(e, t) {
          return oi(e, "toString", {
            configurable: !0,
            enumerable: !1,
            value: va(t),
            writable: !0
          });
        } : De;
        function Vh(e) {
          return Ri(Ln(e));
        }
        function nt(e, t, i) {
          var o = -1, l = e.length;
          t < 0 && (t = -t > l ? 0 : l + t), i = i > l ? l : i, i < 0 && (i += l), l = t > i ? 0 : i - t >>> 0, t >>>= 0;
          for (var h = b(l); ++o < l; )
            h[o] = e[o + t];
          return h;
        }
        function Gh(e, t) {
          var i;
          return Ft(e, function(o, l, h) {
            return i = t(o, l, h), !i;
          }), !!i;
        }
        function mi(e, t, i) {
          var o = 0, l = e == null ? o : e.length;
          if (typeof t == "number" && t === t && l <= Kl) {
            for (; o < l; ) {
              var h = o + l >>> 1, g = e[h];
              g !== null && !ze(g) && (i ? g <= t : g < t) ? o = h + 1 : l = h;
            }
            return l;
          }
          return js(e, t, De, i);
        }
        function js(e, t, i, o) {
          var l = 0, h = e == null ? 0 : e.length;
          if (h === 0)
            return 0;
          t = i(t);
          for (var g = t !== t, m = t === null, x = ze(t), E = t === r; l < h; ) {
            var R = ci((l + h) / 2), C = i(e[R]), O = C !== r, L = C === null, Z = C === C, V = ze(C);
            if (g)
              var D = o || Z;
            else E ? D = Z && (o || O) : m ? D = Z && O && (o || !L) : x ? D = Z && O && !L && (o || !V) : L || V ? D = !1 : D = o ? C <= t : C < t;
            D ? l = R + 1 : h = R;
          }
          return Ae(h, Gl);
        }
        function Su(e, t) {
          for (var i = -1, o = e.length, l = 0, h = []; ++i < o; ) {
            var g = e[i], m = t ? t(g) : g;
            if (!i || !ct(m, x)) {
              var x = m;
              h[l++] = g === 0 ? 0 : g;
            }
          }
          return h;
        }
        function Tu(e) {
          return typeof e == "number" ? e : ze(e) ? Br : +e;
        }
        function He(e) {
          if (typeof e == "string")
            return e;
          if (H(e))
            return fe(e, He) + "";
          if (ze(e))
            return nu ? nu.call(e) : "";
          var t = e + "";
          return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
        }
        function Ht(e, t, i) {
          var o = -1, l = Jr, h = e.length, g = !0, m = [], x = m;
          if (i)
            g = !1, l = xs;
          else if (h >= u) {
            var E = t ? null : sp(e);
            if (E)
              return Xr(E);
            g = !1, l = tr, x = new rn();
          } else
            x = t ? [] : m;
          e:
            for (; ++o < h; ) {
              var R = e[o], C = t ? t(R) : R;
              if (R = i || R !== 0 ? R : 0, g && C === C) {
                for (var O = x.length; O--; )
                  if (x[O] === C)
                    continue e;
                t && x.push(C), m.push(R);
              } else l(x, C, i) || (x !== m && x.push(C), m.push(R));
            }
          return m;
        }
        function Vs(e, t) {
          return t = zt(t, e), e = Xu(e, t), e == null || delete e[wt(rt(t))];
        }
        function Eu(e, t, i, o) {
          return fr(e, t, i(an(e, t)), o);
        }
        function vi(e, t, i, o) {
          for (var l = e.length, h = o ? l : -1; (o ? h-- : ++h < l) && t(e[h], h, e); )
            ;
          return i ? nt(e, o ? 0 : h, o ? h + 1 : l) : nt(e, o ? h + 1 : 0, o ? l : h);
        }
        function Ru(e, t) {
          var i = e;
          return i instanceof Q && (i = i.value()), bs(t, function(o, l) {
            return l.func.apply(l.thisArg, Wt([o], l.args));
          }, i);
        }
        function Gs(e, t, i) {
          var o = e.length;
          if (o < 2)
            return o ? Ht(e[0]) : [];
          for (var l = -1, h = b(o); ++l < o; )
            for (var g = e[l], m = -1; ++m < o; )
              m != l && (h[l] = ur(h[l] || g, e[m], t, i));
          return Ht(Re(h, 1), t, i);
        }
        function Cu(e, t, i) {
          for (var o = -1, l = e.length, h = t.length, g = {}; ++o < l; ) {
            var m = o < h ? t[o] : r;
            i(g, e[o], m);
          }
          return g;
        }
        function Ks(e) {
          return me(e) ? e : [];
        }
        function Js(e) {
          return typeof e == "function" ? e : De;
        }
        function zt(e, t) {
          return H(e) ? e : sa(e, t) ? [e] : nc(se(e));
        }
        var Kh = K;
        function jt(e, t, i) {
          var o = e.length;
          return i = i === r ? o : i, !t && i >= o ? e : nt(e, t, i);
        }
        var Au = Ud || function(e) {
          return Ee.clearTimeout(e);
        };
        function Iu(e, t) {
          if (t)
            return e.slice();
          var i = e.length, o = Jo ? Jo(i) : new e.constructor(i);
          return e.copy(o), o;
        }
        function Ys(e) {
          var t = new e.constructor(e.byteLength);
          return new ii(t).set(new ii(e)), t;
        }
        function Jh(e, t) {
          var i = t ? Ys(e.buffer) : e.buffer;
          return new e.constructor(i, e.byteOffset, e.byteLength);
        }
        function Yh(e) {
          var t = new e.constructor(e.source, fo.exec(e));
          return t.lastIndex = e.lastIndex, t;
        }
        function Xh(e) {
          return ar ? oe(ar.call(e)) : {};
        }
        function Ou(e, t) {
          var i = t ? Ys(e.buffer) : e.buffer;
          return new e.constructor(i, e.byteOffset, e.length);
        }
        function ku(e, t) {
          if (e !== t) {
            var i = e !== r, o = e === null, l = e === e, h = ze(e), g = t !== r, m = t === null, x = t === t, E = ze(t);
            if (!m && !E && !h && e > t || h && g && x && !m && !E || o && g && x || !i && x || !l)
              return 1;
            if (!o && !h && !E && e < t || E && i && l && !o && !h || m && i && l || !g && l || !x)
              return -1;
          }
          return 0;
        }
        function Qh(e, t, i) {
          for (var o = -1, l = e.criteria, h = t.criteria, g = l.length, m = i.length; ++o < g; ) {
            var x = ku(l[o], h[o]);
            if (x) {
              if (o >= m)
                return x;
              var E = i[o];
              return x * (E == "desc" ? -1 : 1);
            }
          }
          return e.index - t.index;
        }
        function Pu(e, t, i, o) {
          for (var l = -1, h = e.length, g = i.length, m = -1, x = t.length, E = xe(h - g, 0), R = b(x + E), C = !o; ++m < x; )
            R[m] = t[m];
          for (; ++l < g; )
            (C || l < h) && (R[i[l]] = e[l]);
          for (; E--; )
            R[m++] = e[l++];
          return R;
        }
        function Nu(e, t, i, o) {
          for (var l = -1, h = e.length, g = -1, m = i.length, x = -1, E = t.length, R = xe(h - m, 0), C = b(R + E), O = !o; ++l < R; )
            C[l] = e[l];
          for (var L = l; ++x < E; )
            C[L + x] = t[x];
          for (; ++g < m; )
            (O || l < h) && (C[L + i[g]] = e[l++]);
          return C;
        }
        function Ue(e, t) {
          var i = -1, o = e.length;
          for (t || (t = b(o)); ++i < o; )
            t[i] = e[i];
          return t;
        }
        function yt(e, t, i, o) {
          var l = !i;
          i || (i = {});
          for (var h = -1, g = t.length; ++h < g; ) {
            var m = t[h], x = o ? o(i[m], e[m], m, i, e) : r;
            x === r && (x = e[m]), l ? At(i, m, x) : or(i, m, x);
          }
          return i;
        }
        function ep(e, t) {
          return yt(e, ia(e), t);
        }
        function tp(e, t) {
          return yt(e, ju(e), t);
        }
        function yi(e, t) {
          return function(i, o) {
            var l = H(i) ? ad : Sh, h = t ? t() : {};
            return l(i, e, $(o, 2), h);
          };
        }
        function On(e) {
          return K(function(t, i) {
            var o = -1, l = i.length, h = l > 1 ? i[l - 1] : r, g = l > 2 ? i[2] : r;
            for (h = e.length > 3 && typeof h == "function" ? (l--, h) : r, g && Ne(i[0], i[1], g) && (h = l < 3 ? r : h, l = 1), t = oe(t); ++o < l; ) {
              var m = i[o];
              m && e(t, m, o, h);
            }
            return t;
          });
        }
        function Lu(e, t) {
          return function(i, o) {
            if (i == null)
              return i;
            if (!$e(i))
              return e(i, o);
            for (var l = i.length, h = t ? l : -1, g = oe(i); (t ? h-- : ++h < l) && o(g[h], h, g) !== !1; )
              ;
            return i;
          };
        }
        function Mu(e) {
          return function(t, i, o) {
            for (var l = -1, h = oe(t), g = o(t), m = g.length; m--; ) {
              var x = g[e ? m : ++l];
              if (i(h[x], x, h) === !1)
                break;
            }
            return t;
          };
        }
        function np(e, t, i) {
          var o = t & U, l = dr(e);
          function h() {
            var g = this && this !== Ee && this instanceof h ? l : e;
            return g.apply(o ? i : this, arguments);
          }
          return h;
        }
        function Uu(e) {
          return function(t) {
            t = se(t);
            var i = Sn(t) ? ot(t) : r, o = i ? i[0] : t.charAt(0), l = i ? jt(i, 1).join("") : t.slice(1);
            return o[e]() + l;
          };
        }
        function kn(e) {
          return function(t) {
            return bs(Lc(Nc(t).replace(jf, "")), e, "");
          };
        }
        function dr(e) {
          return function() {
            var t = arguments;
            switch (t.length) {
              case 0:
                return new e();
              case 1:
                return new e(t[0]);
              case 2:
                return new e(t[0], t[1]);
              case 3:
                return new e(t[0], t[1], t[2]);
              case 4:
                return new e(t[0], t[1], t[2], t[3]);
              case 5:
                return new e(t[0], t[1], t[2], t[3], t[4]);
              case 6:
                return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
              case 7:
                return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
            }
            var i = In(e.prototype), o = e.apply(i, t);
            return pe(o) ? o : i;
          };
        }
        function rp(e, t, i) {
          var o = dr(e);
          function l() {
            for (var h = arguments.length, g = b(h), m = h, x = Pn(l); m--; )
              g[m] = arguments[m];
            var E = h < 3 && g[0] !== x && g[h - 1] !== x ? [] : qt(g, x);
            if (h -= E.length, h < i)
              return qu(
                e,
                t,
                wi,
                l.placeholder,
                r,
                g,
                E,
                r,
                r,
                i - h
              );
            var R = this && this !== Ee && this instanceof l ? o : e;
            return Be(R, this, g);
          }
          return l;
        }
        function $u(e) {
          return function(t, i, o) {
            var l = oe(t);
            if (!$e(t)) {
              var h = $(i, 3);
              t = Se(t), i = function(m) {
                return h(l[m], m, l);
              };
            }
            var g = e(t, i, o);
            return g > -1 ? l[h ? t[g] : g] : r;
          };
        }
        function Zu(e) {
          return Ot(function(t) {
            var i = t.length, o = i, l = et.prototype.thru;
            for (e && t.reverse(); o--; ) {
              var h = t[o];
              if (typeof h != "function")
                throw new Qe(p);
              if (l && !g && Ti(h) == "wrapper")
                var g = new et([], !0);
            }
            for (o = g ? o : i; ++o < i; ) {
              h = t[o];
              var m = Ti(h), x = m == "wrapper" ? na(h) : r;
              x && aa(x[0]) && x[1] == (qe | he | ke | Qt) && !x[4].length && x[9] == 1 ? g = g[Ti(x[0])].apply(g, x[3]) : g = h.length == 1 && aa(h) ? g[m]() : g.thru(h);
            }
            return function() {
              var E = arguments, R = E[0];
              if (g && E.length == 1 && H(R))
                return g.plant(R).value();
              for (var C = 0, O = i ? t[C].apply(this, E) : R; ++C < i; )
                O = t[C].call(this, O);
              return O;
            };
          });
        }
        function wi(e, t, i, o, l, h, g, m, x, E) {
          var R = t & qe, C = t & U, O = t & te, L = t & (he | Te), Z = t & ns, V = O ? r : dr(e);
          function D() {
            for (var J = arguments.length, ne = b(J), je = J; je--; )
              ne[je] = arguments[je];
            if (L)
              var Le = Pn(D), Ve = gd(ne, Le);
            if (o && (ne = Pu(ne, o, l, L)), h && (ne = Nu(ne, h, g, L)), J -= Ve, L && J < E) {
              var ve = qt(ne, Le);
              return qu(
                e,
                t,
                wi,
                D.placeholder,
                i,
                ne,
                ve,
                m,
                x,
                E - J
              );
            }
            var lt = C ? i : this, Lt = O ? lt[e] : e;
            return J = ne.length, m ? ne = Sp(ne, m) : Z && J > 1 && ne.reverse(), R && x < J && (ne.length = x), this && this !== Ee && this instanceof D && (Lt = V || dr(Lt)), Lt.apply(lt, ne);
          }
          return D;
        }
        function Du(e, t) {
          return function(i, o) {
            return kh(i, e, t(o), {});
          };
        }
        function xi(e, t) {
          return function(i, o) {
            var l;
            if (i === r && o === r)
              return t;
            if (i !== r && (l = i), o !== r) {
              if (l === r)
                return o;
              typeof i == "string" || typeof o == "string" ? (i = He(i), o = He(o)) : (i = Tu(i), o = Tu(o)), l = e(i, o);
            }
            return l;
          };
        }
        function Xs(e) {
          return Ot(function(t) {
            return t = fe(t, Fe($())), K(function(i) {
              var o = this;
              return e(t, function(l) {
                return Be(l, o, i);
              });
            });
          });
        }
        function bi(e, t) {
          t = t === r ? " " : He(t);
          var i = t.length;
          if (i < 2)
            return i ? zs(t, e) : t;
          var o = zs(t, ui(e / Tn(t)));
          return Sn(t) ? jt(ot(o), 0, e).join("") : o.slice(0, e);
        }
        function ip(e, t, i, o) {
          var l = t & U, h = dr(e);
          function g() {
            for (var m = -1, x = arguments.length, E = -1, R = o.length, C = b(R + x), O = this && this !== Ee && this instanceof g ? h : e; ++E < R; )
              C[E] = o[E];
            for (; x--; )
              C[E++] = arguments[++m];
            return Be(O, l ? i : this, C);
          }
          return g;
        }
        function Wu(e) {
          return function(t, i, o) {
            return o && typeof o != "number" && Ne(t, i, o) && (i = o = r), t = Nt(t), i === r ? (i = t, t = 0) : i = Nt(i), o = o === r ? t < i ? 1 : -1 : Nt(o), Fh(t, i, o, e);
          };
        }
        function Si(e) {
          return function(t, i) {
            return typeof t == "string" && typeof i == "string" || (t = it(t), i = it(i)), e(t, i);
          };
        }
        function qu(e, t, i, o, l, h, g, m, x, E) {
          var R = t & he, C = R ? g : r, O = R ? r : g, L = R ? h : r, Z = R ? r : h;
          t |= R ? ke : Je, t &= ~(R ? Je : ke), t & ye || (t &= -4);
          var V = [
            e,
            t,
            l,
            L,
            C,
            Z,
            O,
            m,
            x,
            E
          ], D = i.apply(r, V);
          return aa(e) && Qu(D, V), D.placeholder = o, ec(D, e, t);
        }
        function Qs(e) {
          var t = we[e];
          return function(i, o) {
            if (i = it(i), o = o == null ? 0 : Ae(j(o), 292), o && eu(i)) {
              var l = (se(i) + "e").split("e"), h = t(l[0] + "e" + (+l[1] + o));
              return l = (se(h) + "e").split("e"), +(l[0] + "e" + (+l[1] - o));
            }
            return t(i);
          };
        }
        var sp = Cn && 1 / Xr(new Cn([, -0]))[1] == qr ? function(e) {
          return new Cn(e);
        } : xa;
        function Bu(e) {
          return function(t) {
            var i = Ie(t);
            return i == st ? Is(t) : i == at ? bd(t) : pd(t, e(t));
          };
        }
        function It(e, t, i, o, l, h, g, m) {
          var x = t & te;
          if (!x && typeof e != "function")
            throw new Qe(p);
          var E = o ? o.length : 0;
          if (E || (t &= -97, o = l = r), g = g === r ? g : xe(j(g), 0), m = m === r ? m : j(m), E -= l ? l.length : 0, t & Je) {
            var R = o, C = l;
            o = l = r;
          }
          var O = x ? r : na(e), L = [
            e,
            t,
            i,
            o,
            l,
            R,
            C,
            h,
            g,
            m
          ];
          if (O && wp(L, O), e = L[0], t = L[1], i = L[2], o = L[3], l = L[4], m = L[9] = L[9] === r ? x ? 0 : e.length : xe(L[9] - E, 0), !m && t & (he | Te) && (t &= -25), !t || t == U)
            var Z = np(e, t, i);
          else t == he || t == Te ? Z = rp(e, t, m) : (t == ke || t == (U | ke)) && !l.length ? Z = ip(e, t, i, o) : Z = wi.apply(r, L);
          var V = O ? bu : Qu;
          return ec(V(Z, L), e, t);
        }
        function Fu(e, t, i, o) {
          return e === r || ct(e, Rn[i]) && !ae.call(o, i) ? t : e;
        }
        function Hu(e, t, i, o, l, h) {
          return pe(e) && pe(t) && (h.set(t, e), _i(e, t, r, Hu, h), h.delete(t)), e;
        }
        function ap(e) {
          return gr(e) ? r : e;
        }
        function zu(e, t, i, o, l, h) {
          var g = i & ue, m = e.length, x = t.length;
          if (m != x && !(g && x > m))
            return !1;
          var E = h.get(e), R = h.get(t);
          if (E && R)
            return E == t && R == e;
          var C = -1, O = !0, L = i & B ? new rn() : r;
          for (h.set(e, t), h.set(t, e); ++C < m; ) {
            var Z = e[C], V = t[C];
            if (o)
              var D = g ? o(V, Z, C, t, e, h) : o(Z, V, C, e, t, h);
            if (D !== r) {
              if (D)
                continue;
              O = !1;
              break;
            }
            if (L) {
              if (!Ss(t, function(J, ne) {
                if (!tr(L, ne) && (Z === J || l(Z, J, i, o, h)))
                  return L.push(ne);
              })) {
                O = !1;
                break;
              }
            } else if (!(Z === V || l(Z, V, i, o, h))) {
              O = !1;
              break;
            }
          }
          return h.delete(e), h.delete(t), O;
        }
        function op(e, t, i, o, l, h, g) {
          switch (i) {
            case wn:
              if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
                return !1;
              e = e.buffer, t = t.buffer;
            case er:
              return !(e.byteLength != t.byteLength || !h(new ii(e), new ii(t)));
            case Gn:
            case Kn:
            case Jn:
              return ct(+e, +t);
            case Hr:
              return e.name == t.name && e.message == t.message;
            case Yn:
            case Xn:
              return e == t + "";
            case st:
              var m = Is;
            case at:
              var x = o & ue;
              if (m || (m = Xr), e.size != t.size && !x)
                return !1;
              var E = g.get(e);
              if (E)
                return E == t;
              o |= B, g.set(e, t);
              var R = zu(m(e), m(t), o, l, h, g);
              return g.delete(e), R;
            case jr:
              if (ar)
                return ar.call(e) == ar.call(t);
          }
          return !1;
        }
        function up(e, t, i, o, l, h) {
          var g = i & ue, m = ea(e), x = m.length, E = ea(t), R = E.length;
          if (x != R && !g)
            return !1;
          for (var C = x; C--; ) {
            var O = m[C];
            if (!(g ? O in t : ae.call(t, O)))
              return !1;
          }
          var L = h.get(e), Z = h.get(t);
          if (L && Z)
            return L == t && Z == e;
          var V = !0;
          h.set(e, t), h.set(t, e);
          for (var D = g; ++C < x; ) {
            O = m[C];
            var J = e[O], ne = t[O];
            if (o)
              var je = g ? o(ne, J, O, t, e, h) : o(J, ne, O, e, t, h);
            if (!(je === r ? J === ne || l(J, ne, i, o, h) : je)) {
              V = !1;
              break;
            }
            D || (D = O == "constructor");
          }
          if (V && !D) {
            var Le = e.constructor, Ve = t.constructor;
            Le != Ve && "constructor" in e && "constructor" in t && !(typeof Le == "function" && Le instanceof Le && typeof Ve == "function" && Ve instanceof Ve) && (V = !1);
          }
          return h.delete(e), h.delete(t), V;
        }
        function Ot(e) {
          return ua(Yu(e, r, ac), e + "");
        }
        function ea(e) {
          return fu(e, Se, ia);
        }
        function ta(e) {
          return fu(e, Ze, ju);
        }
        var na = li ? function(e) {
          return li.get(e);
        } : xa;
        function Ti(e) {
          for (var t = e.name + "", i = An[t], o = ae.call(An, t) ? i.length : 0; o--; ) {
            var l = i[o], h = l.func;
            if (h == null || h == e)
              return l.name;
          }
          return t;
        }
        function Pn(e) {
          var t = ae.call(f, "placeholder") ? f : e;
          return t.placeholder;
        }
        function $() {
          var e = f.iteratee || ya;
          return e = e === ya ? pu : e, arguments.length ? e(arguments[0], arguments[1]) : e;
        }
        function Ei(e, t) {
          var i = e.__data__;
          return _p(t) ? i[typeof t == "string" ? "string" : "hash"] : i.map;
        }
        function ra(e) {
          for (var t = Se(e), i = t.length; i--; ) {
            var o = t[i], l = e[o];
            t[i] = [o, l, Ku(l)];
          }
          return t;
        }
        function on(e, t) {
          var i = yd(e, t);
          return hu(i) ? i : r;
        }
        function cp(e) {
          var t = ae.call(e, tn), i = e[tn];
          try {
            e[tn] = r;
            var o = !0;
          } catch {
          }
          var l = ni.call(e);
          return o && (t ? e[tn] = i : delete e[tn]), l;
        }
        var ia = ks ? function(e) {
          return e == null ? [] : (e = oe(e), Dt(ks(e), function(t) {
            return Xo.call(e, t);
          }));
        } : ba, ju = ks ? function(e) {
          for (var t = []; e; )
            Wt(t, ia(e)), e = si(e);
          return t;
        } : ba, Ie = Pe;
        (Ps && Ie(new Ps(new ArrayBuffer(1))) != wn || rr && Ie(new rr()) != st || Ns && Ie(Ns.resolve()) != oo || Cn && Ie(new Cn()) != at || ir && Ie(new ir()) != Qn) && (Ie = function(e) {
          var t = Pe(e), i = t == Et ? e.constructor : r, o = i ? un(i) : "";
          if (o)
            switch (o) {
              case zd:
                return wn;
              case jd:
                return st;
              case Vd:
                return oo;
              case Gd:
                return at;
              case Kd:
                return Qn;
            }
          return t;
        });
        function lp(e, t, i) {
          for (var o = -1, l = i.length; ++o < l; ) {
            var h = i[o], g = h.size;
            switch (h.type) {
              case "drop":
                e += g;
                break;
              case "dropRight":
                t -= g;
                break;
              case "take":
                t = Ae(t, e + g);
                break;
              case "takeRight":
                e = xe(e, t - g);
                break;
            }
          }
          return { start: e, end: t };
        }
        function fp(e) {
          var t = e.match(mf);
          return t ? t[1].split(vf) : [];
        }
        function Vu(e, t, i) {
          t = zt(t, e);
          for (var o = -1, l = t.length, h = !1; ++o < l; ) {
            var g = wt(t[o]);
            if (!(h = e != null && i(e, g)))
              break;
            e = e[g];
          }
          return h || ++o != l ? h : (l = e == null ? 0 : e.length, !!l && Pi(l) && kt(g, l) && (H(e) || cn(e)));
        }
        function dp(e) {
          var t = e.length, i = new e.constructor(t);
          return t && typeof e[0] == "string" && ae.call(e, "index") && (i.index = e.index, i.input = e.input), i;
        }
        function Gu(e) {
          return typeof e.constructor == "function" && !hr(e) ? In(si(e)) : {};
        }
        function hp(e, t, i) {
          var o = e.constructor;
          switch (t) {
            case er:
              return Ys(e);
            case Gn:
            case Kn:
              return new o(+e);
            case wn:
              return Jh(e, i);
            case rs:
            case is:
            case ss:
            case as:
            case os:
            case us:
            case cs:
            case ls:
            case fs:
              return Ou(e, i);
            case st:
              return new o();
            case Jn:
            case Xn:
              return new o(e);
            case Yn:
              return Yh(e);
            case at:
              return new o();
            case jr:
              return Xh(e);
          }
        }
        function pp(e, t) {
          var i = t.length;
          if (!i)
            return e;
          var o = i - 1;
          return t[o] = (i > 1 ? "& " : "") + t[o], t = t.join(i > 2 ? ", " : " "), e.replace(_f, `{
/* [wrapped with ` + t + `] */
`);
        }
        function gp(e) {
          return H(e) || cn(e) || !!(Qo && e && e[Qo]);
        }
        function kt(e, t) {
          var i = typeof e;
          return t = t ?? vn, !!t && (i == "number" || i != "symbol" && Cf.test(e)) && e > -1 && e % 1 == 0 && e < t;
        }
        function Ne(e, t, i) {
          if (!pe(i))
            return !1;
          var o = typeof t;
          return (o == "number" ? $e(i) && kt(t, i.length) : o == "string" && t in i) ? ct(i[t], e) : !1;
        }
        function sa(e, t) {
          if (H(e))
            return !1;
          var i = typeof e;
          return i == "number" || i == "symbol" || i == "boolean" || e == null || ze(e) ? !0 : df.test(e) || !ff.test(e) || t != null && e in oe(t);
        }
        function _p(e) {
          var t = typeof e;
          return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
        }
        function aa(e) {
          var t = Ti(e), i = f[t];
          if (typeof i != "function" || !(t in Q.prototype))
            return !1;
          if (e === i)
            return !0;
          var o = na(i);
          return !!o && e === o[0];
        }
        function mp(e) {
          return !!Ko && Ko in e;
        }
        var vp = ei ? Pt : Sa;
        function hr(e) {
          var t = e && e.constructor, i = typeof t == "function" && t.prototype || Rn;
          return e === i;
        }
        function Ku(e) {
          return e === e && !pe(e);
        }
        function Ju(e, t) {
          return function(i) {
            return i == null ? !1 : i[e] === t && (t !== r || e in oe(i));
          };
        }
        function yp(e) {
          var t = Oi(e, function(o) {
            return i.size === w && i.clear(), o;
          }), i = t.cache;
          return t;
        }
        function wp(e, t) {
          var i = e[1], o = t[1], l = i | o, h = l < (U | te | qe), g = o == qe && i == he || o == qe && i == Qt && e[7].length <= t[8] || o == (qe | Qt) && t[7].length <= t[8] && i == he;
          if (!(h || g))
            return e;
          o & U && (e[2] = t[2], l |= i & U ? 0 : ye);
          var m = t[3];
          if (m) {
            var x = e[3];
            e[3] = x ? Pu(x, m, t[4]) : m, e[4] = x ? qt(e[3], S) : t[4];
          }
          return m = t[5], m && (x = e[5], e[5] = x ? Nu(x, m, t[6]) : m, e[6] = x ? qt(e[5], S) : t[6]), m = t[7], m && (e[7] = m), o & qe && (e[8] = e[8] == null ? t[8] : Ae(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = l, e;
        }
        function xp(e) {
          var t = [];
          if (e != null)
            for (var i in oe(e))
              t.push(i);
          return t;
        }
        function bp(e) {
          return ni.call(e);
        }
        function Yu(e, t, i) {
          return t = xe(t === r ? e.length - 1 : t, 0), function() {
            for (var o = arguments, l = -1, h = xe(o.length - t, 0), g = b(h); ++l < h; )
              g[l] = o[t + l];
            l = -1;
            for (var m = b(t + 1); ++l < t; )
              m[l] = o[l];
            return m[t] = i(g), Be(e, this, m);
          };
        }
        function Xu(e, t) {
          return t.length < 2 ? e : an(e, nt(t, 0, -1));
        }
        function Sp(e, t) {
          for (var i = e.length, o = Ae(t.length, i), l = Ue(e); o--; ) {
            var h = t[o];
            e[o] = kt(h, i) ? l[h] : r;
          }
          return e;
        }
        function oa(e, t) {
          if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
            return e[t];
        }
        var Qu = tc(bu), pr = Zd || function(e, t) {
          return Ee.setTimeout(e, t);
        }, ua = tc(jh);
        function ec(e, t, i) {
          var o = t + "";
          return ua(e, pp(o, Tp(fp(o), i)));
        }
        function tc(e) {
          var t = 0, i = 0;
          return function() {
            var o = Bd(), l = Hl - (o - i);
            if (i = o, l > 0) {
              if (++t >= Fl)
                return arguments[0];
            } else
              t = 0;
            return e.apply(r, arguments);
          };
        }
        function Ri(e, t) {
          var i = -1, o = e.length, l = o - 1;
          for (t = t === r ? o : t; ++i < t; ) {
            var h = Hs(i, l), g = e[h];
            e[h] = e[i], e[i] = g;
          }
          return e.length = t, e;
        }
        var nc = yp(function(e) {
          var t = [];
          return e.charCodeAt(0) === 46 && t.push(""), e.replace(hf, function(i, o, l, h) {
            t.push(l ? h.replace(xf, "$1") : o || i);
          }), t;
        });
        function wt(e) {
          if (typeof e == "string" || ze(e))
            return e;
          var t = e + "";
          return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
        }
        function un(e) {
          if (e != null) {
            try {
              return ti.call(e);
            } catch {
            }
            try {
              return e + "";
            } catch {
            }
          }
          return "";
        }
        function Tp(e, t) {
          return Xe(Jl, function(i) {
            var o = "_." + i[0];
            t & i[1] && !Jr(e, o) && e.push(o);
          }), e.sort();
        }
        function rc(e) {
          if (e instanceof Q)
            return e.clone();
          var t = new et(e.__wrapped__, e.__chain__);
          return t.__actions__ = Ue(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
        }
        function Ep(e, t, i) {
          (i ? Ne(e, t, i) : t === r) ? t = 1 : t = xe(j(t), 0);
          var o = e == null ? 0 : e.length;
          if (!o || t < 1)
            return [];
          for (var l = 0, h = 0, g = b(ui(o / t)); l < o; )
            g[h++] = nt(e, l, l += t);
          return g;
        }
        function Rp(e) {
          for (var t = -1, i = e == null ? 0 : e.length, o = 0, l = []; ++t < i; ) {
            var h = e[t];
            h && (l[o++] = h);
          }
          return l;
        }
        function Cp() {
          var e = arguments.length;
          if (!e)
            return [];
          for (var t = b(e - 1), i = arguments[0], o = e; o--; )
            t[o - 1] = arguments[o];
          return Wt(H(i) ? Ue(i) : [i], Re(t, 1));
        }
        var Ap = K(function(e, t) {
          return me(e) ? ur(e, Re(t, 1, me, !0)) : [];
        }), Ip = K(function(e, t) {
          var i = rt(t);
          return me(i) && (i = r), me(e) ? ur(e, Re(t, 1, me, !0), $(i, 2)) : [];
        }), Op = K(function(e, t) {
          var i = rt(t);
          return me(i) && (i = r), me(e) ? ur(e, Re(t, 1, me, !0), r, i) : [];
        });
        function kp(e, t, i) {
          var o = e == null ? 0 : e.length;
          return o ? (t = i || t === r ? 1 : j(t), nt(e, t < 0 ? 0 : t, o)) : [];
        }
        function Pp(e, t, i) {
          var o = e == null ? 0 : e.length;
          return o ? (t = i || t === r ? 1 : j(t), t = o - t, nt(e, 0, t < 0 ? 0 : t)) : [];
        }
        function Np(e, t) {
          return e && e.length ? vi(e, $(t, 3), !0, !0) : [];
        }
        function Lp(e, t) {
          return e && e.length ? vi(e, $(t, 3), !0) : [];
        }
        function Mp(e, t, i, o) {
          var l = e == null ? 0 : e.length;
          return l ? (i && typeof i != "number" && Ne(e, t, i) && (i = 0, o = l), Ch(e, t, i, o)) : [];
        }
        function ic(e, t, i) {
          var o = e == null ? 0 : e.length;
          if (!o)
            return -1;
          var l = i == null ? 0 : j(i);
          return l < 0 && (l = xe(o + l, 0)), Yr(e, $(t, 3), l);
        }
        function sc(e, t, i) {
          var o = e == null ? 0 : e.length;
          if (!o)
            return -1;
          var l = o - 1;
          return i !== r && (l = j(i), l = i < 0 ? xe(o + l, 0) : Ae(l, o - 1)), Yr(e, $(t, 3), l, !0);
        }
        function ac(e) {
          var t = e == null ? 0 : e.length;
          return t ? Re(e, 1) : [];
        }
        function Up(e) {
          var t = e == null ? 0 : e.length;
          return t ? Re(e, qr) : [];
        }
        function $p(e, t) {
          var i = e == null ? 0 : e.length;
          return i ? (t = t === r ? 1 : j(t), Re(e, t)) : [];
        }
        function Zp(e) {
          for (var t = -1, i = e == null ? 0 : e.length, o = {}; ++t < i; ) {
            var l = e[t];
            o[l[0]] = l[1];
          }
          return o;
        }
        function oc(e) {
          return e && e.length ? e[0] : r;
        }
        function Dp(e, t, i) {
          var o = e == null ? 0 : e.length;
          if (!o)
            return -1;
          var l = i == null ? 0 : j(i);
          return l < 0 && (l = xe(o + l, 0)), bn(e, t, l);
        }
        function Wp(e) {
          var t = e == null ? 0 : e.length;
          return t ? nt(e, 0, -1) : [];
        }
        var qp = K(function(e) {
          var t = fe(e, Ks);
          return t.length && t[0] === e[0] ? Ds(t) : [];
        }), Bp = K(function(e) {
          var t = rt(e), i = fe(e, Ks);
          return t === rt(i) ? t = r : i.pop(), i.length && i[0] === e[0] ? Ds(i, $(t, 2)) : [];
        }), Fp = K(function(e) {
          var t = rt(e), i = fe(e, Ks);
          return t = typeof t == "function" ? t : r, t && i.pop(), i.length && i[0] === e[0] ? Ds(i, r, t) : [];
        });
        function Hp(e, t) {
          return e == null ? "" : Wd.call(e, t);
        }
        function rt(e) {
          var t = e == null ? 0 : e.length;
          return t ? e[t - 1] : r;
        }
        function zp(e, t, i) {
          var o = e == null ? 0 : e.length;
          if (!o)
            return -1;
          var l = o;
          return i !== r && (l = j(i), l = l < 0 ? xe(o + l, 0) : Ae(l, o - 1)), t === t ? Td(e, t, l) : Yr(e, qo, l, !0);
        }
        function jp(e, t) {
          return e && e.length ? vu(e, j(t)) : r;
        }
        var Vp = K(uc);
        function uc(e, t) {
          return e && e.length && t && t.length ? Fs(e, t) : e;
        }
        function Gp(e, t, i) {
          return e && e.length && t && t.length ? Fs(e, t, $(i, 2)) : e;
        }
        function Kp(e, t, i) {
          return e && e.length && t && t.length ? Fs(e, t, r, i) : e;
        }
        var Jp = Ot(function(e, t) {
          var i = e == null ? 0 : e.length, o = Ms(e, t);
          return xu(e, fe(t, function(l) {
            return kt(l, i) ? +l : l;
          }).sort(ku)), o;
        });
        function Yp(e, t) {
          var i = [];
          if (!(e && e.length))
            return i;
          var o = -1, l = [], h = e.length;
          for (t = $(t, 3); ++o < h; ) {
            var g = e[o];
            t(g, o, e) && (i.push(g), l.push(o));
          }
          return xu(e, l), i;
        }
        function ca(e) {
          return e == null ? e : Hd.call(e);
        }
        function Xp(e, t, i) {
          var o = e == null ? 0 : e.length;
          return o ? (i && typeof i != "number" && Ne(e, t, i) ? (t = 0, i = o) : (t = t == null ? 0 : j(t), i = i === r ? o : j(i)), nt(e, t, i)) : [];
        }
        function Qp(e, t) {
          return mi(e, t);
        }
        function eg(e, t, i) {
          return js(e, t, $(i, 2));
        }
        function tg(e, t) {
          var i = e == null ? 0 : e.length;
          if (i) {
            var o = mi(e, t);
            if (o < i && ct(e[o], t))
              return o;
          }
          return -1;
        }
        function ng(e, t) {
          return mi(e, t, !0);
        }
        function rg(e, t, i) {
          return js(e, t, $(i, 2), !0);
        }
        function ig(e, t) {
          var i = e == null ? 0 : e.length;
          if (i) {
            var o = mi(e, t, !0) - 1;
            if (ct(e[o], t))
              return o;
          }
          return -1;
        }
        function sg(e) {
          return e && e.length ? Su(e) : [];
        }
        function ag(e, t) {
          return e && e.length ? Su(e, $(t, 2)) : [];
        }
        function og(e) {
          var t = e == null ? 0 : e.length;
          return t ? nt(e, 1, t) : [];
        }
        function ug(e, t, i) {
          return e && e.length ? (t = i || t === r ? 1 : j(t), nt(e, 0, t < 0 ? 0 : t)) : [];
        }
        function cg(e, t, i) {
          var o = e == null ? 0 : e.length;
          return o ? (t = i || t === r ? 1 : j(t), t = o - t, nt(e, t < 0 ? 0 : t, o)) : [];
        }
        function lg(e, t) {
          return e && e.length ? vi(e, $(t, 3), !1, !0) : [];
        }
        function fg(e, t) {
          return e && e.length ? vi(e, $(t, 3)) : [];
        }
        var dg = K(function(e) {
          return Ht(Re(e, 1, me, !0));
        }), hg = K(function(e) {
          var t = rt(e);
          return me(t) && (t = r), Ht(Re(e, 1, me, !0), $(t, 2));
        }), pg = K(function(e) {
          var t = rt(e);
          return t = typeof t == "function" ? t : r, Ht(Re(e, 1, me, !0), r, t);
        });
        function gg(e) {
          return e && e.length ? Ht(e) : [];
        }
        function _g(e, t) {
          return e && e.length ? Ht(e, $(t, 2)) : [];
        }
        function mg(e, t) {
          return t = typeof t == "function" ? t : r, e && e.length ? Ht(e, r, t) : [];
        }
        function la(e) {
          if (!(e && e.length))
            return [];
          var t = 0;
          return e = Dt(e, function(i) {
            if (me(i))
              return t = xe(i.length, t), !0;
          }), Cs(t, function(i) {
            return fe(e, Ts(i));
          });
        }
        function cc(e, t) {
          if (!(e && e.length))
            return [];
          var i = la(e);
          return t == null ? i : fe(i, function(o) {
            return Be(t, r, o);
          });
        }
        var vg = K(function(e, t) {
          return me(e) ? ur(e, t) : [];
        }), yg = K(function(e) {
          return Gs(Dt(e, me));
        }), wg = K(function(e) {
          var t = rt(e);
          return me(t) && (t = r), Gs(Dt(e, me), $(t, 2));
        }), xg = K(function(e) {
          var t = rt(e);
          return t = typeof t == "function" ? t : r, Gs(Dt(e, me), r, t);
        }), bg = K(la);
        function Sg(e, t) {
          return Cu(e || [], t || [], or);
        }
        function Tg(e, t) {
          return Cu(e || [], t || [], fr);
        }
        var Eg = K(function(e) {
          var t = e.length, i = t > 1 ? e[t - 1] : r;
          return i = typeof i == "function" ? (e.pop(), i) : r, cc(e, i);
        });
        function lc(e) {
          var t = f(e);
          return t.__chain__ = !0, t;
        }
        function Rg(e, t) {
          return t(e), e;
        }
        function Ci(e, t) {
          return t(e);
        }
        var Cg = Ot(function(e) {
          var t = e.length, i = t ? e[0] : 0, o = this.__wrapped__, l = function(h) {
            return Ms(h, e);
          };
          return t > 1 || this.__actions__.length || !(o instanceof Q) || !kt(i) ? this.thru(l) : (o = o.slice(i, +i + (t ? 1 : 0)), o.__actions__.push({
            func: Ci,
            args: [l],
            thisArg: r
          }), new et(o, this.__chain__).thru(function(h) {
            return t && !h.length && h.push(r), h;
          }));
        });
        function Ag() {
          return lc(this);
        }
        function Ig() {
          return new et(this.value(), this.__chain__);
        }
        function Og() {
          this.__values__ === r && (this.__values__ = Tc(this.value()));
          var e = this.__index__ >= this.__values__.length, t = e ? r : this.__values__[this.__index__++];
          return { done: e, value: t };
        }
        function kg() {
          return this;
        }
        function Pg(e) {
          for (var t, i = this; i instanceof di; ) {
            var o = rc(i);
            o.__index__ = 0, o.__values__ = r, t ? l.__wrapped__ = o : t = o;
            var l = o;
            i = i.__wrapped__;
          }
          return l.__wrapped__ = e, t;
        }
        function Ng() {
          var e = this.__wrapped__;
          if (e instanceof Q) {
            var t = e;
            return this.__actions__.length && (t = new Q(this)), t = t.reverse(), t.__actions__.push({
              func: Ci,
              args: [ca],
              thisArg: r
            }), new et(t, this.__chain__);
          }
          return this.thru(ca);
        }
        function Lg() {
          return Ru(this.__wrapped__, this.__actions__);
        }
        var Mg = yi(function(e, t, i) {
          ae.call(e, i) ? ++e[i] : At(e, i, 1);
        });
        function Ug(e, t, i) {
          var o = H(e) ? Do : Rh;
          return i && Ne(e, t, i) && (t = r), o(e, $(t, 3));
        }
        function $g(e, t) {
          var i = H(e) ? Dt : cu;
          return i(e, $(t, 3));
        }
        var Zg = $u(ic), Dg = $u(sc);
        function Wg(e, t) {
          return Re(Ai(e, t), 1);
        }
        function qg(e, t) {
          return Re(Ai(e, t), qr);
        }
        function Bg(e, t, i) {
          return i = i === r ? 1 : j(i), Re(Ai(e, t), i);
        }
        function fc(e, t) {
          var i = H(e) ? Xe : Ft;
          return i(e, $(t, 3));
        }
        function dc(e, t) {
          var i = H(e) ? od : uu;
          return i(e, $(t, 3));
        }
        var Fg = yi(function(e, t, i) {
          ae.call(e, i) ? e[i].push(t) : At(e, i, [t]);
        });
        function Hg(e, t, i, o) {
          e = $e(e) ? e : Ln(e), i = i && !o ? j(i) : 0;
          var l = e.length;
          return i < 0 && (i = xe(l + i, 0)), Ni(e) ? i <= l && e.indexOf(t, i) > -1 : !!l && bn(e, t, i) > -1;
        }
        var zg = K(function(e, t, i) {
          var o = -1, l = typeof t == "function", h = $e(e) ? b(e.length) : [];
          return Ft(e, function(g) {
            h[++o] = l ? Be(t, g, i) : cr(g, t, i);
          }), h;
        }), jg = yi(function(e, t, i) {
          At(e, i, t);
        });
        function Ai(e, t) {
          var i = H(e) ? fe : gu;
          return i(e, $(t, 3));
        }
        function Vg(e, t, i, o) {
          return e == null ? [] : (H(t) || (t = t == null ? [] : [t]), i = o ? r : i, H(i) || (i = i == null ? [] : [i]), yu(e, t, i));
        }
        var Gg = yi(function(e, t, i) {
          e[i ? 0 : 1].push(t);
        }, function() {
          return [[], []];
        });
        function Kg(e, t, i) {
          var o = H(e) ? bs : Fo, l = arguments.length < 3;
          return o(e, $(t, 4), i, l, Ft);
        }
        function Jg(e, t, i) {
          var o = H(e) ? ud : Fo, l = arguments.length < 3;
          return o(e, $(t, 4), i, l, uu);
        }
        function Yg(e, t) {
          var i = H(e) ? Dt : cu;
          return i(e, ki($(t, 3)));
        }
        function Xg(e) {
          var t = H(e) ? iu : Hh;
          return t(e);
        }
        function Qg(e, t, i) {
          (i ? Ne(e, t, i) : t === r) ? t = 1 : t = j(t);
          var o = H(e) ? xh : zh;
          return o(e, t);
        }
        function e_(e) {
          var t = H(e) ? bh : Vh;
          return t(e);
        }
        function t_(e) {
          if (e == null)
            return 0;
          if ($e(e))
            return Ni(e) ? Tn(e) : e.length;
          var t = Ie(e);
          return t == st || t == at ? e.size : qs(e).length;
        }
        function n_(e, t, i) {
          var o = H(e) ? Ss : Gh;
          return i && Ne(e, t, i) && (t = r), o(e, $(t, 3));
        }
        var r_ = K(function(e, t) {
          if (e == null)
            return [];
          var i = t.length;
          return i > 1 && Ne(e, t[0], t[1]) ? t = [] : i > 2 && Ne(t[0], t[1], t[2]) && (t = [t[0]]), yu(e, Re(t, 1), []);
        }), Ii = $d || function() {
          return Ee.Date.now();
        };
        function i_(e, t) {
          if (typeof t != "function")
            throw new Qe(p);
          return e = j(e), function() {
            if (--e < 1)
              return t.apply(this, arguments);
          };
        }
        function hc(e, t, i) {
          return t = i ? r : t, t = e && t == null ? e.length : t, It(e, qe, r, r, r, r, t);
        }
        function pc(e, t) {
          var i;
          if (typeof t != "function")
            throw new Qe(p);
          return e = j(e), function() {
            return --e > 0 && (i = t.apply(this, arguments)), e <= 1 && (t = r), i;
          };
        }
        var fa = K(function(e, t, i) {
          var o = U;
          if (i.length) {
            var l = qt(i, Pn(fa));
            o |= ke;
          }
          return It(e, o, t, i, l);
        }), gc = K(function(e, t, i) {
          var o = U | te;
          if (i.length) {
            var l = qt(i, Pn(gc));
            o |= ke;
          }
          return It(t, o, e, i, l);
        });
        function _c(e, t, i) {
          t = i ? r : t;
          var o = It(e, he, r, r, r, r, r, t);
          return o.placeholder = _c.placeholder, o;
        }
        function mc(e, t, i) {
          t = i ? r : t;
          var o = It(e, Te, r, r, r, r, r, t);
          return o.placeholder = mc.placeholder, o;
        }
        function vc(e, t, i) {
          var o, l, h, g, m, x, E = 0, R = !1, C = !1, O = !0;
          if (typeof e != "function")
            throw new Qe(p);
          t = it(t) || 0, pe(i) && (R = !!i.leading, C = "maxWait" in i, h = C ? xe(it(i.maxWait) || 0, t) : h, O = "trailing" in i ? !!i.trailing : O);
          function L(ve) {
            var lt = o, Lt = l;
            return o = l = r, E = ve, g = e.apply(Lt, lt), g;
          }
          function Z(ve) {
            return E = ve, m = pr(J, t), R ? L(ve) : g;
          }
          function V(ve) {
            var lt = ve - x, Lt = ve - E, $c = t - lt;
            return C ? Ae($c, h - Lt) : $c;
          }
          function D(ve) {
            var lt = ve - x, Lt = ve - E;
            return x === r || lt >= t || lt < 0 || C && Lt >= h;
          }
          function J() {
            var ve = Ii();
            if (D(ve))
              return ne(ve);
            m = pr(J, V(ve));
          }
          function ne(ve) {
            return m = r, O && o ? L(ve) : (o = l = r, g);
          }
          function je() {
            m !== r && Au(m), E = 0, o = x = l = m = r;
          }
          function Le() {
            return m === r ? g : ne(Ii());
          }
          function Ve() {
            var ve = Ii(), lt = D(ve);
            if (o = arguments, l = this, x = ve, lt) {
              if (m === r)
                return Z(x);
              if (C)
                return Au(m), m = pr(J, t), L(x);
            }
            return m === r && (m = pr(J, t)), g;
          }
          return Ve.cancel = je, Ve.flush = Le, Ve;
        }
        var s_ = K(function(e, t) {
          return ou(e, 1, t);
        }), a_ = K(function(e, t, i) {
          return ou(e, it(t) || 0, i);
        });
        function o_(e) {
          return It(e, ns);
        }
        function Oi(e, t) {
          if (typeof e != "function" || t != null && typeof t != "function")
            throw new Qe(p);
          var i = function() {
            var o = arguments, l = t ? t.apply(this, o) : o[0], h = i.cache;
            if (h.has(l))
              return h.get(l);
            var g = e.apply(this, o);
            return i.cache = h.set(l, g) || h, g;
          };
          return i.cache = new (Oi.Cache || Ct)(), i;
        }
        Oi.Cache = Ct;
        function ki(e) {
          if (typeof e != "function")
            throw new Qe(p);
          return function() {
            var t = arguments;
            switch (t.length) {
              case 0:
                return !e.call(this);
              case 1:
                return !e.call(this, t[0]);
              case 2:
                return !e.call(this, t[0], t[1]);
              case 3:
                return !e.call(this, t[0], t[1], t[2]);
            }
            return !e.apply(this, t);
          };
        }
        function u_(e) {
          return pc(2, e);
        }
        var c_ = Kh(function(e, t) {
          t = t.length == 1 && H(t[0]) ? fe(t[0], Fe($())) : fe(Re(t, 1), Fe($()));
          var i = t.length;
          return K(function(o) {
            for (var l = -1, h = Ae(o.length, i); ++l < h; )
              o[l] = t[l].call(this, o[l]);
            return Be(e, this, o);
          });
        }), da = K(function(e, t) {
          var i = qt(t, Pn(da));
          return It(e, ke, r, t, i);
        }), yc = K(function(e, t) {
          var i = qt(t, Pn(yc));
          return It(e, Je, r, t, i);
        }), l_ = Ot(function(e, t) {
          return It(e, Qt, r, r, r, t);
        });
        function f_(e, t) {
          if (typeof e != "function")
            throw new Qe(p);
          return t = t === r ? t : j(t), K(e, t);
        }
        function d_(e, t) {
          if (typeof e != "function")
            throw new Qe(p);
          return t = t == null ? 0 : xe(j(t), 0), K(function(i) {
            var o = i[t], l = jt(i, 0, t);
            return o && Wt(l, o), Be(e, this, l);
          });
        }
        function h_(e, t, i) {
          var o = !0, l = !0;
          if (typeof e != "function")
            throw new Qe(p);
          return pe(i) && (o = "leading" in i ? !!i.leading : o, l = "trailing" in i ? !!i.trailing : l), vc(e, t, {
            leading: o,
            maxWait: t,
            trailing: l
          });
        }
        function p_(e) {
          return hc(e, 1);
        }
        function g_(e, t) {
          return da(Js(t), e);
        }
        function __() {
          if (!arguments.length)
            return [];
          var e = arguments[0];
          return H(e) ? e : [e];
        }
        function m_(e) {
          return tt(e, ee);
        }
        function v_(e, t) {
          return t = typeof t == "function" ? t : r, tt(e, ee, t);
        }
        function y_(e) {
          return tt(e, I | ee);
        }
        function w_(e, t) {
          return t = typeof t == "function" ? t : r, tt(e, I | ee, t);
        }
        function x_(e, t) {
          return t == null || au(e, t, Se(t));
        }
        function ct(e, t) {
          return e === t || e !== e && t !== t;
        }
        var b_ = Si(Zs), S_ = Si(function(e, t) {
          return e >= t;
        }), cn = du(/* @__PURE__ */ function() {
          return arguments;
        }()) ? du : function(e) {
          return _e(e) && ae.call(e, "callee") && !Xo.call(e, "callee");
        }, H = b.isArray, T_ = No ? Fe(No) : Ph;
        function $e(e) {
          return e != null && Pi(e.length) && !Pt(e);
        }
        function me(e) {
          return _e(e) && $e(e);
        }
        function E_(e) {
          return e === !0 || e === !1 || _e(e) && Pe(e) == Gn;
        }
        var Vt = Dd || Sa, R_ = Lo ? Fe(Lo) : Nh;
        function C_(e) {
          return _e(e) && e.nodeType === 1 && !gr(e);
        }
        function A_(e) {
          if (e == null)
            return !0;
          if ($e(e) && (H(e) || typeof e == "string" || typeof e.splice == "function" || Vt(e) || Nn(e) || cn(e)))
            return !e.length;
          var t = Ie(e);
          if (t == st || t == at)
            return !e.size;
          if (hr(e))
            return !qs(e).length;
          for (var i in e)
            if (ae.call(e, i))
              return !1;
          return !0;
        }
        function I_(e, t) {
          return lr(e, t);
        }
        function O_(e, t, i) {
          i = typeof i == "function" ? i : r;
          var o = i ? i(e, t) : r;
          return o === r ? lr(e, t, r, i) : !!o;
        }
        function ha(e) {
          if (!_e(e))
            return !1;
          var t = Pe(e);
          return t == Hr || t == Xl || typeof e.message == "string" && typeof e.name == "string" && !gr(e);
        }
        function k_(e) {
          return typeof e == "number" && eu(e);
        }
        function Pt(e) {
          if (!pe(e))
            return !1;
          var t = Pe(e);
          return t == zr || t == ao || t == Yl || t == ef;
        }
        function wc(e) {
          return typeof e == "number" && e == j(e);
        }
        function Pi(e) {
          return typeof e == "number" && e > -1 && e % 1 == 0 && e <= vn;
        }
        function pe(e) {
          var t = typeof e;
          return e != null && (t == "object" || t == "function");
        }
        function _e(e) {
          return e != null && typeof e == "object";
        }
        var xc = Mo ? Fe(Mo) : Mh;
        function P_(e, t) {
          return e === t || Ws(e, t, ra(t));
        }
        function N_(e, t, i) {
          return i = typeof i == "function" ? i : r, Ws(e, t, ra(t), i);
        }
        function L_(e) {
          return bc(e) && e != +e;
        }
        function M_(e) {
          if (vp(e))
            throw new F(c);
          return hu(e);
        }
        function U_(e) {
          return e === null;
        }
        function $_(e) {
          return e == null;
        }
        function bc(e) {
          return typeof e == "number" || _e(e) && Pe(e) == Jn;
        }
        function gr(e) {
          if (!_e(e) || Pe(e) != Et)
            return !1;
          var t = si(e);
          if (t === null)
            return !0;
          var i = ae.call(t, "constructor") && t.constructor;
          return typeof i == "function" && i instanceof i && ti.call(i) == Nd;
        }
        var pa = Uo ? Fe(Uo) : Uh;
        function Z_(e) {
          return wc(e) && e >= -9007199254740991 && e <= vn;
        }
        var Sc = $o ? Fe($o) : $h;
        function Ni(e) {
          return typeof e == "string" || !H(e) && _e(e) && Pe(e) == Xn;
        }
        function ze(e) {
          return typeof e == "symbol" || _e(e) && Pe(e) == jr;
        }
        var Nn = Zo ? Fe(Zo) : Zh;
        function D_(e) {
          return e === r;
        }
        function W_(e) {
          return _e(e) && Ie(e) == Qn;
        }
        function q_(e) {
          return _e(e) && Pe(e) == nf;
        }
        var B_ = Si(Bs), F_ = Si(function(e, t) {
          return e <= t;
        });
        function Tc(e) {
          if (!e)
            return [];
          if ($e(e))
            return Ni(e) ? ot(e) : Ue(e);
          if (nr && e[nr])
            return xd(e[nr]());
          var t = Ie(e), i = t == st ? Is : t == at ? Xr : Ln;
          return i(e);
        }
        function Nt(e) {
          if (!e)
            return e === 0 ? e : 0;
          if (e = it(e), e === qr || e === -1 / 0) {
            var t = e < 0 ? -1 : 1;
            return t * Vl;
          }
          return e === e ? e : 0;
        }
        function j(e) {
          var t = Nt(e), i = t % 1;
          return t === t ? i ? t - i : t : 0;
        }
        function Ec(e) {
          return e ? sn(j(e), 0, mt) : 0;
        }
        function it(e) {
          if (typeof e == "number")
            return e;
          if (ze(e))
            return Br;
          if (pe(e)) {
            var t = typeof e.valueOf == "function" ? e.valueOf() : e;
            e = pe(t) ? t + "" : t;
          }
          if (typeof e != "string")
            return e === 0 ? e : +e;
          e = Ho(e);
          var i = Tf.test(e);
          return i || Rf.test(e) ? id(e.slice(2), i ? 2 : 8) : Sf.test(e) ? Br : +e;
        }
        function Rc(e) {
          return yt(e, Ze(e));
        }
        function H_(e) {
          return e ? sn(j(e), -9007199254740991, vn) : e === 0 ? e : 0;
        }
        function se(e) {
          return e == null ? "" : He(e);
        }
        var z_ = On(function(e, t) {
          if (hr(t) || $e(t)) {
            yt(t, Se(t), e);
            return;
          }
          for (var i in t)
            ae.call(t, i) && or(e, i, t[i]);
        }), Cc = On(function(e, t) {
          yt(t, Ze(t), e);
        }), Li = On(function(e, t, i, o) {
          yt(t, Ze(t), e, o);
        }), j_ = On(function(e, t, i, o) {
          yt(t, Se(t), e, o);
        }), V_ = Ot(Ms);
        function G_(e, t) {
          var i = In(e);
          return t == null ? i : su(i, t);
        }
        var K_ = K(function(e, t) {
          e = oe(e);
          var i = -1, o = t.length, l = o > 2 ? t[2] : r;
          for (l && Ne(t[0], t[1], l) && (o = 1); ++i < o; )
            for (var h = t[i], g = Ze(h), m = -1, x = g.length; ++m < x; ) {
              var E = g[m], R = e[E];
              (R === r || ct(R, Rn[E]) && !ae.call(e, E)) && (e[E] = h[E]);
            }
          return e;
        }), J_ = K(function(e) {
          return e.push(r, Hu), Be(Ac, r, e);
        });
        function Y_(e, t) {
          return Wo(e, $(t, 3), vt);
        }
        function X_(e, t) {
          return Wo(e, $(t, 3), $s);
        }
        function Q_(e, t) {
          return e == null ? e : Us(e, $(t, 3), Ze);
        }
        function em(e, t) {
          return e == null ? e : lu(e, $(t, 3), Ze);
        }
        function tm(e, t) {
          return e && vt(e, $(t, 3));
        }
        function nm(e, t) {
          return e && $s(e, $(t, 3));
        }
        function rm(e) {
          return e == null ? [] : gi(e, Se(e));
        }
        function im(e) {
          return e == null ? [] : gi(e, Ze(e));
        }
        function ga(e, t, i) {
          var o = e == null ? r : an(e, t);
          return o === r ? i : o;
        }
        function sm(e, t) {
          return e != null && Vu(e, t, Ah);
        }
        function _a(e, t) {
          return e != null && Vu(e, t, Ih);
        }
        var am = Du(function(e, t, i) {
          t != null && typeof t.toString != "function" && (t = ni.call(t)), e[t] = i;
        }, va(De)), om = Du(function(e, t, i) {
          t != null && typeof t.toString != "function" && (t = ni.call(t)), ae.call(e, t) ? e[t].push(i) : e[t] = [i];
        }, $), um = K(cr);
        function Se(e) {
          return $e(e) ? ru(e) : qs(e);
        }
        function Ze(e) {
          return $e(e) ? ru(e, !0) : Dh(e);
        }
        function cm(e, t) {
          var i = {};
          return t = $(t, 3), vt(e, function(o, l, h) {
            At(i, t(o, l, h), o);
          }), i;
        }
        function lm(e, t) {
          var i = {};
          return t = $(t, 3), vt(e, function(o, l, h) {
            At(i, l, t(o, l, h));
          }), i;
        }
        var fm = On(function(e, t, i) {
          _i(e, t, i);
        }), Ac = On(function(e, t, i, o) {
          _i(e, t, i, o);
        }), dm = Ot(function(e, t) {
          var i = {};
          if (e == null)
            return i;
          var o = !1;
          t = fe(t, function(h) {
            return h = zt(h, e), o || (o = h.length > 1), h;
          }), yt(e, ta(e), i), o && (i = tt(i, I | X | ee, ap));
          for (var l = t.length; l--; )
            Vs(i, t[l]);
          return i;
        });
        function hm(e, t) {
          return Ic(e, ki($(t)));
        }
        var pm = Ot(function(e, t) {
          return e == null ? {} : qh(e, t);
        });
        function Ic(e, t) {
          if (e == null)
            return {};
          var i = fe(ta(e), function(o) {
            return [o];
          });
          return t = $(t), wu(e, i, function(o, l) {
            return t(o, l[0]);
          });
        }
        function gm(e, t, i) {
          t = zt(t, e);
          var o = -1, l = t.length;
          for (l || (l = 1, e = r); ++o < l; ) {
            var h = e == null ? r : e[wt(t[o])];
            h === r && (o = l, h = i), e = Pt(h) ? h.call(e) : h;
          }
          return e;
        }
        function _m(e, t, i) {
          return e == null ? e : fr(e, t, i);
        }
        function mm(e, t, i, o) {
          return o = typeof o == "function" ? o : r, e == null ? e : fr(e, t, i, o);
        }
        var Oc = Bu(Se), kc = Bu(Ze);
        function vm(e, t, i) {
          var o = H(e), l = o || Vt(e) || Nn(e);
          if (t = $(t, 4), i == null) {
            var h = e && e.constructor;
            l ? i = o ? new h() : [] : pe(e) ? i = Pt(h) ? In(si(e)) : {} : i = {};
          }
          return (l ? Xe : vt)(e, function(g, m, x) {
            return t(i, g, m, x);
          }), i;
        }
        function ym(e, t) {
          return e == null ? !0 : Vs(e, t);
        }
        function wm(e, t, i) {
          return e == null ? e : Eu(e, t, Js(i));
        }
        function xm(e, t, i, o) {
          return o = typeof o == "function" ? o : r, e == null ? e : Eu(e, t, Js(i), o);
        }
        function Ln(e) {
          return e == null ? [] : As(e, Se(e));
        }
        function bm(e) {
          return e == null ? [] : As(e, Ze(e));
        }
        function Sm(e, t, i) {
          return i === r && (i = t, t = r), i !== r && (i = it(i), i = i === i ? i : 0), t !== r && (t = it(t), t = t === t ? t : 0), sn(it(e), t, i);
        }
        function Tm(e, t, i) {
          return t = Nt(t), i === r ? (i = t, t = 0) : i = Nt(i), e = it(e), Oh(e, t, i);
        }
        function Em(e, t, i) {
          if (i && typeof i != "boolean" && Ne(e, t, i) && (t = i = r), i === r && (typeof t == "boolean" ? (i = t, t = r) : typeof e == "boolean" && (i = e, e = r)), e === r && t === r ? (e = 0, t = 1) : (e = Nt(e), t === r ? (t = e, e = 0) : t = Nt(t)), e > t) {
            var o = e;
            e = t, t = o;
          }
          if (i || e % 1 || t % 1) {
            var l = tu();
            return Ae(e + l * (t - e + rd("1e-" + ((l + "").length - 1))), t);
          }
          return Hs(e, t);
        }
        var Rm = kn(function(e, t, i) {
          return t = t.toLowerCase(), e + (i ? Pc(t) : t);
        });
        function Pc(e) {
          return ma(se(e).toLowerCase());
        }
        function Nc(e) {
          return e = se(e), e && e.replace(Af, _d).replace(Vf, "");
        }
        function Cm(e, t, i) {
          e = se(e), t = He(t);
          var o = e.length;
          i = i === r ? o : sn(j(i), 0, o);
          var l = i;
          return i -= t.length, i >= 0 && e.slice(i, l) == t;
        }
        function Am(e) {
          return e = se(e), e && uf.test(e) ? e.replace(co, md) : e;
        }
        function Im(e) {
          return e = se(e), e && pf.test(e) ? e.replace(ds, "\\$&") : e;
        }
        var Om = kn(function(e, t, i) {
          return e + (i ? "-" : "") + t.toLowerCase();
        }), km = kn(function(e, t, i) {
          return e + (i ? " " : "") + t.toLowerCase();
        }), Pm = Uu("toLowerCase");
        function Nm(e, t, i) {
          e = se(e), t = j(t);
          var o = t ? Tn(e) : 0;
          if (!t || o >= t)
            return e;
          var l = (t - o) / 2;
          return bi(ci(l), i) + e + bi(ui(l), i);
        }
        function Lm(e, t, i) {
          e = se(e), t = j(t);
          var o = t ? Tn(e) : 0;
          return t && o < t ? e + bi(t - o, i) : e;
        }
        function Mm(e, t, i) {
          e = se(e), t = j(t);
          var o = t ? Tn(e) : 0;
          return t && o < t ? bi(t - o, i) + e : e;
        }
        function Um(e, t, i) {
          return i || t == null ? t = 0 : t && (t = +t), Fd(se(e).replace(hs, ""), t || 0);
        }
        function $m(e, t, i) {
          return (i ? Ne(e, t, i) : t === r) ? t = 1 : t = j(t), zs(se(e), t);
        }
        function Zm() {
          var e = arguments, t = se(e[0]);
          return e.length < 3 ? t : t.replace(e[1], e[2]);
        }
        var Dm = kn(function(e, t, i) {
          return e + (i ? "_" : "") + t.toLowerCase();
        });
        function Wm(e, t, i) {
          return i && typeof i != "number" && Ne(e, t, i) && (t = i = r), i = i === r ? mt : i >>> 0, i ? (e = se(e), e && (typeof t == "string" || t != null && !pa(t)) && (t = He(t), !t && Sn(e)) ? jt(ot(e), 0, i) : e.split(t, i)) : [];
        }
        var qm = kn(function(e, t, i) {
          return e + (i ? " " : "") + ma(t);
        });
        function Bm(e, t, i) {
          return e = se(e), i = i == null ? 0 : sn(j(i), 0, e.length), t = He(t), e.slice(i, i + t.length) == t;
        }
        function Fm(e, t, i) {
          var o = f.templateSettings;
          i && Ne(e, t, i) && (t = r), e = se(e), t = Li({}, t, o, Fu);
          var l = Li({}, t.imports, o.imports, Fu), h = Se(l), g = As(l, h), m, x, E = 0, R = t.interpolate || Vr, C = "__p += '", O = Os(
            (t.escape || Vr).source + "|" + R.source + "|" + (R === lo ? bf : Vr).source + "|" + (t.evaluate || Vr).source + "|$",
            "g"
          ), L = "//# sourceURL=" + (ae.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Xf + "]") + `
`;
          e.replace(O, function(D, J, ne, je, Le, Ve) {
            return ne || (ne = je), C += e.slice(E, Ve).replace(If, vd), J && (m = !0, C += `' +
__e(` + J + `) +
'`), Le && (x = !0, C += `';
` + Le + `;
__p += '`), ne && (C += `' +
((__t = (` + ne + `)) == null ? '' : __t) +
'`), E = Ve + D.length, D;
          }), C += `';
`;
          var Z = ae.call(t, "variable") && t.variable;
          if (!Z)
            C = `with (obj) {
` + C + `
}
`;
          else if (wf.test(Z))
            throw new F(_);
          C = (x ? C.replace(rf, "") : C).replace(sf, "$1").replace(af, "$1;"), C = "function(" + (Z || "obj") + `) {
` + (Z ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (m ? ", __e = _.escape" : "") + (x ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + C + `return __p
}`;
          var V = Mc(function() {
            return ie(h, L + "return " + C).apply(r, g);
          });
          if (V.source = C, ha(V))
            throw V;
          return V;
        }
        function Hm(e) {
          return se(e).toLowerCase();
        }
        function zm(e) {
          return se(e).toUpperCase();
        }
        function jm(e, t, i) {
          if (e = se(e), e && (i || t === r))
            return Ho(e);
          if (!e || !(t = He(t)))
            return e;
          var o = ot(e), l = ot(t), h = zo(o, l), g = jo(o, l) + 1;
          return jt(o, h, g).join("");
        }
        function Vm(e, t, i) {
          if (e = se(e), e && (i || t === r))
            return e.slice(0, Go(e) + 1);
          if (!e || !(t = He(t)))
            return e;
          var o = ot(e), l = jo(o, ot(t)) + 1;
          return jt(o, 0, l).join("");
        }
        function Gm(e, t, i) {
          if (e = se(e), e && (i || t === r))
            return e.replace(hs, "");
          if (!e || !(t = He(t)))
            return e;
          var o = ot(e), l = zo(o, ot(t));
          return jt(o, l).join("");
        }
        function Km(e, t) {
          var i = ql, o = Bl;
          if (pe(t)) {
            var l = "separator" in t ? t.separator : l;
            i = "length" in t ? j(t.length) : i, o = "omission" in t ? He(t.omission) : o;
          }
          e = se(e);
          var h = e.length;
          if (Sn(e)) {
            var g = ot(e);
            h = g.length;
          }
          if (i >= h)
            return e;
          var m = i - Tn(o);
          if (m < 1)
            return o;
          var x = g ? jt(g, 0, m).join("") : e.slice(0, m);
          if (l === r)
            return x + o;
          if (g && (m += x.length - m), pa(l)) {
            if (e.slice(m).search(l)) {
              var E, R = x;
              for (l.global || (l = Os(l.source, se(fo.exec(l)) + "g")), l.lastIndex = 0; E = l.exec(R); )
                var C = E.index;
              x = x.slice(0, C === r ? m : C);
            }
          } else if (e.indexOf(He(l), m) != m) {
            var O = x.lastIndexOf(l);
            O > -1 && (x = x.slice(0, O));
          }
          return x + o;
        }
        function Jm(e) {
          return e = se(e), e && of.test(e) ? e.replace(uo, Ed) : e;
        }
        var Ym = kn(function(e, t, i) {
          return e + (i ? " " : "") + t.toUpperCase();
        }), ma = Uu("toUpperCase");
        function Lc(e, t, i) {
          return e = se(e), t = i ? r : t, t === r ? wd(e) ? Ad(e) : fd(e) : e.match(t) || [];
        }
        var Mc = K(function(e, t) {
          try {
            return Be(e, r, t);
          } catch (i) {
            return ha(i) ? i : new F(i);
          }
        }), Xm = Ot(function(e, t) {
          return Xe(t, function(i) {
            i = wt(i), At(e, i, fa(e[i], e));
          }), e;
        });
        function Qm(e) {
          var t = e == null ? 0 : e.length, i = $();
          return e = t ? fe(e, function(o) {
            if (typeof o[1] != "function")
              throw new Qe(p);
            return [i(o[0]), o[1]];
          }) : [], K(function(o) {
            for (var l = -1; ++l < t; ) {
              var h = e[l];
              if (Be(h[0], this, o))
                return Be(h[1], this, o);
            }
          });
        }
        function ev(e) {
          return Eh(tt(e, I));
        }
        function va(e) {
          return function() {
            return e;
          };
        }
        function tv(e, t) {
          return e == null || e !== e ? t : e;
        }
        var nv = Zu(), rv = Zu(!0);
        function De(e) {
          return e;
        }
        function ya(e) {
          return pu(typeof e == "function" ? e : tt(e, I));
        }
        function iv(e) {
          return _u(tt(e, I));
        }
        function sv(e, t) {
          return mu(e, tt(t, I));
        }
        var av = K(function(e, t) {
          return function(i) {
            return cr(i, e, t);
          };
        }), ov = K(function(e, t) {
          return function(i) {
            return cr(e, i, t);
          };
        });
        function wa(e, t, i) {
          var o = Se(t), l = gi(t, o);
          i == null && !(pe(t) && (l.length || !o.length)) && (i = t, t = e, e = this, l = gi(t, Se(t)));
          var h = !(pe(i) && "chain" in i) || !!i.chain, g = Pt(e);
          return Xe(l, function(m) {
            var x = t[m];
            e[m] = x, g && (e.prototype[m] = function() {
              var E = this.__chain__;
              if (h || E) {
                var R = e(this.__wrapped__), C = R.__actions__ = Ue(this.__actions__);
                return C.push({ func: x, args: arguments, thisArg: e }), R.__chain__ = E, R;
              }
              return x.apply(e, Wt([this.value()], arguments));
            });
          }), e;
        }
        function uv() {
          return Ee._ === this && (Ee._ = Ld), this;
        }
        function xa() {
        }
        function cv(e) {
          return e = j(e), K(function(t) {
            return vu(t, e);
          });
        }
        var lv = Xs(fe), fv = Xs(Do), dv = Xs(Ss);
        function Uc(e) {
          return sa(e) ? Ts(wt(e)) : Bh(e);
        }
        function hv(e) {
          return function(t) {
            return e == null ? r : an(e, t);
          };
        }
        var pv = Wu(), gv = Wu(!0);
        function ba() {
          return [];
        }
        function Sa() {
          return !1;
        }
        function _v() {
          return {};
        }
        function mv() {
          return "";
        }
        function vv() {
          return !0;
        }
        function yv(e, t) {
          if (e = j(e), e < 1 || e > vn)
            return [];
          var i = mt, o = Ae(e, mt);
          t = $(t), e -= mt;
          for (var l = Cs(o, t); ++i < e; )
            t(i);
          return l;
        }
        function wv(e) {
          return H(e) ? fe(e, wt) : ze(e) ? [e] : Ue(nc(se(e)));
        }
        function xv(e) {
          var t = ++Pd;
          return se(e) + t;
        }
        var bv = xi(function(e, t) {
          return e + t;
        }, 0), Sv = Qs("ceil"), Tv = xi(function(e, t) {
          return e / t;
        }, 1), Ev = Qs("floor");
        function Rv(e) {
          return e && e.length ? pi(e, De, Zs) : r;
        }
        function Cv(e, t) {
          return e && e.length ? pi(e, $(t, 2), Zs) : r;
        }
        function Av(e) {
          return Bo(e, De);
        }
        function Iv(e, t) {
          return Bo(e, $(t, 2));
        }
        function Ov(e) {
          return e && e.length ? pi(e, De, Bs) : r;
        }
        function kv(e, t) {
          return e && e.length ? pi(e, $(t, 2), Bs) : r;
        }
        var Pv = xi(function(e, t) {
          return e * t;
        }, 1), Nv = Qs("round"), Lv = xi(function(e, t) {
          return e - t;
        }, 0);
        function Mv(e) {
          return e && e.length ? Rs(e, De) : 0;
        }
        function Uv(e, t) {
          return e && e.length ? Rs(e, $(t, 2)) : 0;
        }
        return f.after = i_, f.ary = hc, f.assign = z_, f.assignIn = Cc, f.assignInWith = Li, f.assignWith = j_, f.at = V_, f.before = pc, f.bind = fa, f.bindAll = Xm, f.bindKey = gc, f.castArray = __, f.chain = lc, f.chunk = Ep, f.compact = Rp, f.concat = Cp, f.cond = Qm, f.conforms = ev, f.constant = va, f.countBy = Mg, f.create = G_, f.curry = _c, f.curryRight = mc, f.debounce = vc, f.defaults = K_, f.defaultsDeep = J_, f.defer = s_, f.delay = a_, f.difference = Ap, f.differenceBy = Ip, f.differenceWith = Op, f.drop = kp, f.dropRight = Pp, f.dropRightWhile = Np, f.dropWhile = Lp, f.fill = Mp, f.filter = $g, f.flatMap = Wg, f.flatMapDeep = qg, f.flatMapDepth = Bg, f.flatten = ac, f.flattenDeep = Up, f.flattenDepth = $p, f.flip = o_, f.flow = nv, f.flowRight = rv, f.fromPairs = Zp, f.functions = rm, f.functionsIn = im, f.groupBy = Fg, f.initial = Wp, f.intersection = qp, f.intersectionBy = Bp, f.intersectionWith = Fp, f.invert = am, f.invertBy = om, f.invokeMap = zg, f.iteratee = ya, f.keyBy = jg, f.keys = Se, f.keysIn = Ze, f.map = Ai, f.mapKeys = cm, f.mapValues = lm, f.matches = iv, f.matchesProperty = sv, f.memoize = Oi, f.merge = fm, f.mergeWith = Ac, f.method = av, f.methodOf = ov, f.mixin = wa, f.negate = ki, f.nthArg = cv, f.omit = dm, f.omitBy = hm, f.once = u_, f.orderBy = Vg, f.over = lv, f.overArgs = c_, f.overEvery = fv, f.overSome = dv, f.partial = da, f.partialRight = yc, f.partition = Gg, f.pick = pm, f.pickBy = Ic, f.property = Uc, f.propertyOf = hv, f.pull = Vp, f.pullAll = uc, f.pullAllBy = Gp, f.pullAllWith = Kp, f.pullAt = Jp, f.range = pv, f.rangeRight = gv, f.rearg = l_, f.reject = Yg, f.remove = Yp, f.rest = f_, f.reverse = ca, f.sampleSize = Qg, f.set = _m, f.setWith = mm, f.shuffle = e_, f.slice = Xp, f.sortBy = r_, f.sortedUniq = sg, f.sortedUniqBy = ag, f.split = Wm, f.spread = d_, f.tail = og, f.take = ug, f.takeRight = cg, f.takeRightWhile = lg, f.takeWhile = fg, f.tap = Rg, f.throttle = h_, f.thru = Ci, f.toArray = Tc, f.toPairs = Oc, f.toPairsIn = kc, f.toPath = wv, f.toPlainObject = Rc, f.transform = vm, f.unary = p_, f.union = dg, f.unionBy = hg, f.unionWith = pg, f.uniq = gg, f.uniqBy = _g, f.uniqWith = mg, f.unset = ym, f.unzip = la, f.unzipWith = cc, f.update = wm, f.updateWith = xm, f.values = Ln, f.valuesIn = bm, f.without = vg, f.words = Lc, f.wrap = g_, f.xor = yg, f.xorBy = wg, f.xorWith = xg, f.zip = bg, f.zipObject = Sg, f.zipObjectDeep = Tg, f.zipWith = Eg, f.entries = Oc, f.entriesIn = kc, f.extend = Cc, f.extendWith = Li, wa(f, f), f.add = bv, f.attempt = Mc, f.camelCase = Rm, f.capitalize = Pc, f.ceil = Sv, f.clamp = Sm, f.clone = m_, f.cloneDeep = y_, f.cloneDeepWith = w_, f.cloneWith = v_, f.conformsTo = x_, f.deburr = Nc, f.defaultTo = tv, f.divide = Tv, f.endsWith = Cm, f.eq = ct, f.escape = Am, f.escapeRegExp = Im, f.every = Ug, f.find = Zg, f.findIndex = ic, f.findKey = Y_, f.findLast = Dg, f.findLastIndex = sc, f.findLastKey = X_, f.floor = Ev, f.forEach = fc, f.forEachRight = dc, f.forIn = Q_, f.forInRight = em, f.forOwn = tm, f.forOwnRight = nm, f.get = ga, f.gt = b_, f.gte = S_, f.has = sm, f.hasIn = _a, f.head = oc, f.identity = De, f.includes = Hg, f.indexOf = Dp, f.inRange = Tm, f.invoke = um, f.isArguments = cn, f.isArray = H, f.isArrayBuffer = T_, f.isArrayLike = $e, f.isArrayLikeObject = me, f.isBoolean = E_, f.isBuffer = Vt, f.isDate = R_, f.isElement = C_, f.isEmpty = A_, f.isEqual = I_, f.isEqualWith = O_, f.isError = ha, f.isFinite = k_, f.isFunction = Pt, f.isInteger = wc, f.isLength = Pi, f.isMap = xc, f.isMatch = P_, f.isMatchWith = N_, f.isNaN = L_, f.isNative = M_, f.isNil = $_, f.isNull = U_, f.isNumber = bc, f.isObject = pe, f.isObjectLike = _e, f.isPlainObject = gr, f.isRegExp = pa, f.isSafeInteger = Z_, f.isSet = Sc, f.isString = Ni, f.isSymbol = ze, f.isTypedArray = Nn, f.isUndefined = D_, f.isWeakMap = W_, f.isWeakSet = q_, f.join = Hp, f.kebabCase = Om, f.last = rt, f.lastIndexOf = zp, f.lowerCase = km, f.lowerFirst = Pm, f.lt = B_, f.lte = F_, f.max = Rv, f.maxBy = Cv, f.mean = Av, f.meanBy = Iv, f.min = Ov, f.minBy = kv, f.stubArray = ba, f.stubFalse = Sa, f.stubObject = _v, f.stubString = mv, f.stubTrue = vv, f.multiply = Pv, f.nth = jp, f.noConflict = uv, f.noop = xa, f.now = Ii, f.pad = Nm, f.padEnd = Lm, f.padStart = Mm, f.parseInt = Um, f.random = Em, f.reduce = Kg, f.reduceRight = Jg, f.repeat = $m, f.replace = Zm, f.result = gm, f.round = Nv, f.runInContext = v, f.sample = Xg, f.size = t_, f.snakeCase = Dm, f.some = n_, f.sortedIndex = Qp, f.sortedIndexBy = eg, f.sortedIndexOf = tg, f.sortedLastIndex = ng, f.sortedLastIndexBy = rg, f.sortedLastIndexOf = ig, f.startCase = qm, f.startsWith = Bm, f.subtract = Lv, f.sum = Mv, f.sumBy = Uv, f.template = Fm, f.times = yv, f.toFinite = Nt, f.toInteger = j, f.toLength = Ec, f.toLower = Hm, f.toNumber = it, f.toSafeInteger = H_, f.toString = se, f.toUpper = zm, f.trim = jm, f.trimEnd = Vm, f.trimStart = Gm, f.truncate = Km, f.unescape = Jm, f.uniqueId = xv, f.upperCase = Ym, f.upperFirst = ma, f.each = fc, f.eachRight = dc, f.first = oc, wa(f, function() {
          var e = {};
          return vt(f, function(t, i) {
            ae.call(f.prototype, i) || (e[i] = t);
          }), e;
        }(), { chain: !1 }), f.VERSION = a, Xe(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
          f[e].placeholder = f;
        }), Xe(["drop", "take"], function(e, t) {
          Q.prototype[e] = function(i) {
            i = i === r ? 1 : xe(j(i), 0);
            var o = this.__filtered__ && !t ? new Q(this) : this.clone();
            return o.__filtered__ ? o.__takeCount__ = Ae(i, o.__takeCount__) : o.__views__.push({
              size: Ae(i, mt),
              type: e + (o.__dir__ < 0 ? "Right" : "")
            }), o;
          }, Q.prototype[e + "Right"] = function(i) {
            return this.reverse()[e](i).reverse();
          };
        }), Xe(["filter", "map", "takeWhile"], function(e, t) {
          var i = t + 1, o = i == so || i == jl;
          Q.prototype[e] = function(l) {
            var h = this.clone();
            return h.__iteratees__.push({
              iteratee: $(l, 3),
              type: i
            }), h.__filtered__ = h.__filtered__ || o, h;
          };
        }), Xe(["head", "last"], function(e, t) {
          var i = "take" + (t ? "Right" : "");
          Q.prototype[e] = function() {
            return this[i](1).value()[0];
          };
        }), Xe(["initial", "tail"], function(e, t) {
          var i = "drop" + (t ? "" : "Right");
          Q.prototype[e] = function() {
            return this.__filtered__ ? new Q(this) : this[i](1);
          };
        }), Q.prototype.compact = function() {
          return this.filter(De);
        }, Q.prototype.find = function(e) {
          return this.filter(e).head();
        }, Q.prototype.findLast = function(e) {
          return this.reverse().find(e);
        }, Q.prototype.invokeMap = K(function(e, t) {
          return typeof e == "function" ? new Q(this) : this.map(function(i) {
            return cr(i, e, t);
          });
        }), Q.prototype.reject = function(e) {
          return this.filter(ki($(e)));
        }, Q.prototype.slice = function(e, t) {
          e = j(e);
          var i = this;
          return i.__filtered__ && (e > 0 || t < 0) ? new Q(i) : (e < 0 ? i = i.takeRight(-e) : e && (i = i.drop(e)), t !== r && (t = j(t), i = t < 0 ? i.dropRight(-t) : i.take(t - e)), i);
        }, Q.prototype.takeRightWhile = function(e) {
          return this.reverse().takeWhile(e).reverse();
        }, Q.prototype.toArray = function() {
          return this.take(mt);
        }, vt(Q.prototype, function(e, t) {
          var i = /^(?:filter|find|map|reject)|While$/.test(t), o = /^(?:head|last)$/.test(t), l = f[o ? "take" + (t == "last" ? "Right" : "") : t], h = o || /^find/.test(t);
          l && (f.prototype[t] = function() {
            var g = this.__wrapped__, m = o ? [1] : arguments, x = g instanceof Q, E = m[0], R = x || H(g), C = function(J) {
              var ne = l.apply(f, Wt([J], m));
              return o && O ? ne[0] : ne;
            };
            R && i && typeof E == "function" && E.length != 1 && (x = R = !1);
            var O = this.__chain__, L = !!this.__actions__.length, Z = h && !O, V = x && !L;
            if (!h && R) {
              g = V ? g : new Q(this);
              var D = e.apply(g, m);
              return D.__actions__.push({ func: Ci, args: [C], thisArg: r }), new et(D, O);
            }
            return Z && V ? e.apply(this, m) : (D = this.thru(C), Z ? o ? D.value()[0] : D.value() : D);
          });
        }), Xe(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
          var t = Qr[e], i = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", o = /^(?:pop|shift)$/.test(e);
          f.prototype[e] = function() {
            var l = arguments;
            if (o && !this.__chain__) {
              var h = this.value();
              return t.apply(H(h) ? h : [], l);
            }
            return this[i](function(g) {
              return t.apply(H(g) ? g : [], l);
            });
          };
        }), vt(Q.prototype, function(e, t) {
          var i = f[t];
          if (i) {
            var o = i.name + "";
            ae.call(An, o) || (An[o] = []), An[o].push({ name: t, func: i });
          }
        }), An[wi(r, te).name] = [{
          name: "wrapper",
          func: r
        }], Q.prototype.clone = Jd, Q.prototype.reverse = Yd, Q.prototype.value = Xd, f.prototype.at = Cg, f.prototype.chain = Ag, f.prototype.commit = Ig, f.prototype.next = Og, f.prototype.plant = Pg, f.prototype.reverse = Ng, f.prototype.toJSON = f.prototype.valueOf = f.prototype.value = Lg, f.prototype.first = f.prototype.head, nr && (f.prototype[nr] = kg), f;
      }, En = Id();
      en ? ((en.exports = En)._ = En, ys._ = En) : Ee._ = En;
    }).call(Cw);
  }(br, br.exports)), br.exports;
}
var Iw = Aw();
const io = /* @__PURE__ */ Ul(Iw), Ce = [];
for (let s = 0; s < 256; ++s)
  Ce.push((s + 256).toString(16).slice(1));
function Ow(s, n = 0) {
  return (Ce[s[n + 0]] + Ce[s[n + 1]] + Ce[s[n + 2]] + Ce[s[n + 3]] + "-" + Ce[s[n + 4]] + Ce[s[n + 5]] + "-" + Ce[s[n + 6]] + Ce[s[n + 7]] + "-" + Ce[s[n + 8]] + Ce[s[n + 9]] + "-" + Ce[s[n + 10]] + Ce[s[n + 11]] + Ce[s[n + 12]] + Ce[s[n + 13]] + Ce[s[n + 14]] + Ce[s[n + 15]]).toLowerCase();
}
let $a;
const kw = new Uint8Array(16);
function Pw() {
  if (!$a) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    $a = crypto.getRandomValues.bind(crypto);
  }
  return $a(kw);
}
const Nw = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), sl = { randomUUID: Nw };
function $l(s, n, r) {
  var u;
  if (sl.randomUUID && !s)
    return sl.randomUUID();
  s = s || {};
  const a = s.random ?? ((u = s.rng) == null ? void 0 : u.call(s)) ?? Pw();
  if (a.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return a[6] = a[6] & 15 | 64, a[8] = a[8] & 63 | 128, Ow(a);
}
const Hn = (s, n, r) => s.map((a) => ({
  ...a,
  name: `${a.name}/${n}`,
  description: `${a.description}<[${r.name}]>}`,
  server: r
})), Dw = (s) => s.map((n) => ({
  type: "function",
  function: {
    name: n.name,
    description: n.description,
    parameters: n.inputSchema
  }
})), Zl = async (s) => {
  const n = JSON.stringify(s.getServerVersion()), r = {
    tools: [],
    resources: [],
    prompts: []
  };
  try {
    const { tools: a } = await s.listTools();
    r.tools = a;
  } catch (a) {
    console.log(n + "获取工具失败（tools）:", a.message || a), r.tools = null;
  }
  try {
    const { resources: a } = await s.listResources();
    r.resources = a;
  } catch (a) {
    console.log(n + "获取资源失败（resources）:", a.message || a), r.resources = [];
  }
  try {
    const { prompts: a } = await s.listPrompts();
    r.prompts = a;
  } catch (a) {
    console.log(n + "获取提示词失败（prompts）:", a.message || a), r.prompts = [];
  }
  return r;
}, Lw = (s) => io(s).flatMap((n) => [n.client_sees, n.client_stdios]).filter(Boolean).reduce((n, r) => (n.mcp_tools.push(...r.tools || []), n.mcp_resources.push(...r.resources || []), n.mcp_prompts.push(...r.prompts || []), n), {
  // 初始化最终结果结构
  mcp_tools: [],
  mcp_resources: [],
  mcp_prompts: []
}), Mw = (s) => {
  const n = Object.keys(process.env).find(
    (a) => a.toLowerCase() === "path"
  ) || "PATH", r = {
    [n]: process.env[n],
    LANG: process.env.LANG || "en_US.UTF-8",
    NODE_ENV: "production"
    // ✅ 默认注入生产环境标识
  };
  return !s || !s.env || Object.keys(s.env).length === 0 ? r : {
    ...r,
    ...s.env
    // 合并用户自定义变量（可以覆盖 NODE_ENV）
  };
}, Dl = async (s) => {
  const n = new Nl(
    { name: "sse-client", version: "1.0.0" },
    { capabilities: { prompts: {}, resources: {}, tools: {} } }
  ), r = new nw(new URL(s));
  return await n.connect(r), n;
}, Wl = async (s) => {
  const n = new Nl(
    { name: "stdio-client", version: "1.0.0" },
    { capabilities: { prompts: {}, resources: {}, tools: {} } }
  );
  console.log("这里是本地运行,需要本地运行环境");
  const r = new Ew({
    command: s.command,
    // 使用 Node.js 运行 MCP 服务器
    args: [...s.args],
    // MCP 服务器的可执行文件路径
    //这里是在node运行的时候 给node命令行传递参数
    env: Mw(s)
  });
  return await n.connect(r), n;
}, Uw = async (s) => {
  const n = await Dl(s.baseUrl), r = $l(), a = {
    ...s,
    //mcp服务注册系统的信息
    mcp_server: n.getServerVersion(),
    //这是注册完以后加载的mcp真实服务的版本信息和名字
    type: "sse"
  }, { tools: u, resources: c, prompts: p } = await Zl(n);
  return {
    tools: Hn(u, r, a),
    resources: Hn(c, r, a),
    prompts: Hn(p, r, a)
  };
}, $w = async (s) => {
  const n = await Wl(s), r = $l(), a = {
    ...s,
    //mcp服务注册系统的信息
    mcp_server: n.getServerVersion(),
    //这是注册完以后加载的mcp真实服务的版本信息和名字
    type: "stdio"
    //在本地运行是stdio
  }, { tools: u, resources: c, prompts: p } = await Zl(n);
  return {
    tools: Hn(u, r, a),
    resources: Hn(c, r, a),
    prompts: Hn(p, r, a)
  };
}, Ww = async (s) => {
  if (!s)
    throw new Error("缺少 MCP 配置，程序终止");
  const n = io.map(s, (u, c) => ({ key: c, ...u })), r = await Promise.allSettled(
    n.map(async (u) => {
      try {
        let c = null, p = null;
        return u.type === "sse" ? c = await Uw(u) : u.type === "stdio" && (p = await $w(u)), { client_sees: c, client_stdios: p };
      } catch (c) {
        throw new Error(`连接失败: ${u.key}, 错误信息: ${c.message}`);
      }
    })
  );
  r.filter((u) => u.status === "rejected").forEach((u) => console.warn("部分mcp服务器连接失败：", u.reason));
  const a = r.filter((u) => u.status === "fulfilled").map((u) => u.value);
  return Lw(a);
};
async function Zw(s, n) {
  const r = s.function.name, a = s.function.arguments, u = r.split("/")[0], c = io.find(n, { name: r }), p = await new Promise(async (_) => {
    if (c) {
      let y;
      c.server.type === "sse" ? y = await Dl(c.server.baseUrl) : c.server.type === "stdio" && (y = await Wl(c.server));
      try {
        const w = await y.callTool({
          arguments: a,
          name: u
        });
        _({
          ...w,
          mcp_server: {
            tool_name: u,
            name: c.server.name,
            server: c.server.mcp_server
          },
          role: "tool"
        });
      } catch (w) {
        _({
          role: "tool",
          content: [{
            type: "error",
            text: "工具调用失败",
            data: w.message
          }]
        });
      }
    } else
      _({
        role: "tool",
        content: [{
          type: "error",
          text: "未找到工具服务器,可能是大模型参数太小,无法理解调用的工具",
          data: r
        }]
      });
  });
  return console.log("🛼 运行了", p), console.log("======================end========================"), p;
}
async function qw(s, n) {
  const r = [];
  console.log("====================start==========================");
  for (const a of s)
    try {
      const u = await Zw(a, n);
      r.push(u);
    } catch (u) {
      throw console.error(`执行函数 ${a.function.name} 时出错:`, u), u;
    }
  return r;
}
export {
  Dw as mcp_ollama_tools,
  Ww as mcp_server,
  qw as run_tools,
  Dl as see_cli,
  Wl as stdio_cli
};
