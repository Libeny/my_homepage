!function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}
          , n = (new Error).stack;
        n && (e._sentryDebugIds = e._sentryDebugIds || {},
        e._sentryDebugIds[n] = "f8bed1b0-24a3-5791-9cdc-d677732ec8dd")
    } catch (e) {}
}();
function __vite__mapDeps(indexes) {
    if (!__vite__mapDeps.viteFileDeps) {
        __vite__mapDeps.viteFileDeps = [window.__toStaticUrl("assets/plugin.hash-B-rrflHg.js"), window.__toStaticUrl("assets/nivo.hash-3DLvEEek.js"), window.__toStaticUrl("assets/vendor-core.hash-TqyN1mH4.js"), window.__toStaticUrl("assets/prosemirror.hash-DzHTrBWt.js"), window.__toStaticUrl("assets/Root.hash-_Q_JDMPl.js"), window.__toStaticUrl("assets/Root.hash-QbHhGvDq.css")]
    }
    return indexes.map((i)=>__vite__mapDeps.viteFileDeps[i])
}
"use client";
import {_ as KE, i as kf, s as Gi, a as YE, b as QE, c as xf, d as XE, m as xk, n as Df, o as Ic, t as T3, e as JE, f as Sf, g as eA, h as tA, j as nA, k as rA, l as sA, p as iA, q as Dk, r as Yo, u as n5, v as aA, w as _f, x as q7, y as oA, z as cA, A as lA, B as Sk, C as dA, D as _k, E as uA, F as ug, G as hA, W as fA, H as pA, I as mA, J as gA, K as yA, L as CA, M as bA, N as vA, O as wA} from "./nivo.hash-3DLvEEek.js";
import {a as Cn, f as Fi, h as hg, i as Ik, k as Mr, s as hl, l as f2, m as $n, p as dd, n as Do, o as kA, w as xA, R as DA, q as SA, v as ut, x as Le, y as F2, z as ms, A as _A, B as IA, C as EA, D as AA, E as jA, F as fg, G as MA, H as TA, I as pg, J as LA, K as OA, L as O1, r as y, M as lt, N as Ln /** Ln is `makeObservable` of mobX  */, O as ae, Q as Qt, S as Ek, T as $a, j as c, u as If, b as r5, U as L3, V as RA, W as PA, e as Ak, X as jk, Y as Pt, Z as $A, _ as rn, c as FA, $ as Kd, a0 as Ef, a1 as fo, a2 as mg, a3 as gg, a4 as Dd, a5 as s5, a6 as _s, a7 as NA, a8 as n0, a9 as VA, aa as BA, ab as Sd, ac as UA, ad as HA, ae as Mk, af as Sa, ag as pi, ah as N2, ai as zA, aj as ZA, ak as Af, al as p2, am as Tk, an as r0, ao as jf, ap as oc, aq as ps, ar as yg, as as xu, at as qA, au as Cg, av as WA, aw as GA, ax as Zc, ay as Rs, az as vr, aA as O3, aB as Fr, aC as KA, aD as Ws, aE as Lk, aF as YA, aG as QA, aH as fr, aI as Mf, aJ as XA, aK as bg, aL as JA, aM as ej, aN as Ts, aO as zh, aP as s0, aQ as R3, aR as tj, aS as nj, aT as W7, aU as Zh, aV as vg, aW as rj, aX as sj, aY as Ok, aZ as Rk, a_ as Tf, a$ as P3, b0 as ij, b1 as Pk, b2 as $k, b3 as Fk, b4 as aj, b5 as oj, b6 as cj, b7 as lj, b8 as dj, b9 as uj, ba as hj, bb as fj, bc as $3, bd as F3, be as pj, bf as mj, bg as gj} from "./vendor-core.hash-TqyN1mH4.js";
import {t as yj, S as Cj, N as Nk, M as bj, a as vj, b as wj, P as Lf, c as kj, d as O5, F as R5, T as xj} from "./prosemirror.hash-DzHTrBWt.js";
(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload"))
        return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]'))
        r(s);
    new MutationObserver(s=>{
        for (const i of s)
            if (i.type === "childList")
                for (const a of i.addedNodes)
                    a.tagName === "LINK" && a.rel === "modulepreload" && r(a)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function n(s) {
        const i = {};
        return s.integrity && (i.integrity = s.integrity),
        s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
        s.crossOrigin === "use-credentials" ? i.credentials = "include" : s.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin",
        i
    }
    function r(s) {
        if (s.ep)
            return;
        s.ep = !0;
        const i = n(s);
        fetch(s.href, i)
    }
}
)();
function Dj() {
    "hasOwn"in Object || Object.defineProperty(Object, "hasOwn", {
        value: Object.call.bind(Object.hasOwnProperty),
        writable: !0,
        enumerable: !1,
        configurable: !0
    })
}
var Sj = KE
  , wg = kf;
function _j(t, e, n, r) {
    return t == null ? [] : (wg(e) || (e = e == null ? [] : [e]),
    n = r ? void 0 : n,
    wg(n) || (n = n == null ? [] : [n]),
    Sj(t, e, n))
}
var Ij = _j;
const Of = Cn(Ij);
function Ej() {
    if (Array.prototype.distinct = function() {
        return this.filter((t,e,n)=>n.indexOf(t) === e)
    }
    ,
    Array.prototype.concrete = function() { // remove undefined values from an array
        return this.filter(t=>t !== void 0)
    }
    ,
    Array.prototype.groupBy = function(t, e) {
        const n = new Map;
        for (const r of this) {
            const s = r[t]
              , i = n.get(s);
            i ? i.push(r) : n.set(s, [r])
        }
        if (e) {
            const r = [...n.keys()].sortBy(e)
              , s = new Map;
            for (const i of r)
                s.set(i, n.get(i));
            return s
        } else
            return n
    }
    ,
    Array.prototype.orderBy = function(t, e) {
        return Of(this, t, e)
    }
    ,
    Array.prototype.sortBy = function(t) {
        return Gi(this, t)
    }
    ,
    !("at"in Array.prototype)) {
        let t = function(e) {
            if (e = Math.trunc(e) || 0,
            e < 0 && (e += this.length),
            !(e < 0 || e >= this.length))
                return this[e]
        };
        Object.defineProperty(Array.prototype, "at", {
            value: t,
            writable: !0,
            enumerable: !1,
            configurable: !0
        })
    }
}
const Aj = 60 * 60 * 1e3
  , kg = (t,e,n)=>{
    const [r,s] = t.split("/")
      , [i,a] = s.split(":");
    return Date.UTC(n, r - 1, i, a) - e * Aj
}
  , jj = (t,e,n,r,s)=>{
    const i = new Date(t).getUTCFullYear()
      , a = kg(e, s, i)
      , o = kg(n, r, i);
    return t >= a && t < o
}
  , Vk = jj
  , Mj = t=>{
    let n = t.timezones[t.tz];
    if (n === void 0)
        return console.warn("Warning: couldn't find timezone " + t.tz),
        0;
    if (n.dst === void 0)
        return n.offset;
    let r = n.offset
      , s = n.offset + 1;
    n.hem === "n" && (s = r - 1);
    let i = n.dst.split("->");
    return Vk(t.epoch, i[0], i[1], r, s) === !0 ? r : s
}
  , Tj = Mj
  , xg = {
    "9|s": "2/dili,2/jayapura",
    "9|n": "2/chita,2/khandyga,2/pyongyang,2/seoul,2/tokyo,2/yakutsk,11/palau,japan,rok",
    "9.5|s|04/07:03->10/06:02": "4/adelaide,4/broken_hill,4/south,4/yancowinna",
    "9.5|s": "4/darwin,4/north",
    "8|s|03/13:01->10/02:00": "12/casey",
    "8|s": "2/kuala_lumpur,2/makassar,2/singapore,4/perth,2/ujung_pandang,4/west,singapore",
    "8|n": "2/brunei,2/choibalsan,2/hong_kong,2/irkutsk,2/kuching,2/macau,2/manila,2/shanghai,2/taipei,2/ulaanbaatar,2/chongqing,2/chungking,2/harbin,2/macao,2/ulan_bator,hongkong,prc,roc",
    "8.75|s": "4/eucla",
    "7|s": "12/davis,2/jakarta,9/christmas",
    "7|n": "2/bangkok,2/barnaul,2/hovd,2/krasnoyarsk,2/novokuznetsk,2/novosibirsk,2/phnom_penh,2/pontianak,2/ho_chi_minh,2/tomsk,2/vientiane,2/saigon",
    "6|s": "12/vostok",
    "6|n": "2/almaty,2/bishkek,2/dhaka,2/omsk,2/qyzylorda,2/qostanay,2/thimphu,2/urumqi,9/chagos,2/dacca,2/kashgar,2/thimbu",
    "6.5|n": "2/yangon,9/cocos,2/rangoon",
    "5|s": "12/mawson,9/kerguelen",
    "5|n": "2/aqtau,2/aqtobe,2/ashgabat,2/atyrau,2/dushanbe,2/karachi,2/oral,2/samarkand,2/tashkent,2/yekaterinburg,9/maldives,2/ashkhabad",
    "5.75|n": "2/kathmandu,2/katmandu",
    "5.5|n": "2/kolkata,2/colombo,2/calcutta",
    "4|s": "9/reunion",
    "4|n": "2/baku,2/dubai,2/muscat,2/tbilisi,2/yerevan,8/astrakhan,8/samara,8/saratov,8/ulyanovsk,8/volgograd,9/mahe,9/mauritius,2/volgograd",
    "4.5|n": "2/kabul",
    "3|s": "12/syowa,9/antananarivo",
    "3|n|04/28:00->10/26:24": "0/cairo,egypt",
    "3|n|03/31:03->10/27:04": "2/famagusta,2/nicosia,8/athens,8/bucharest,8/helsinki,8/mariehamn,8/riga,8/sofia,8/tallinn,8/uzhgorod,8/vilnius,8/zaporozhye,8/nicosia,eet",
    "3|n|03/31:02->10/27:03": "8/chisinau,8/tiraspol",
    "3|n|03/31:00->10/26:24": "2/beirut",
    "3|n|03/31:00->10/25:01": "2/gaza,2/hebron",
    "3|n|03/29:02->10/27:02": "2/jerusalem,2/tel_aviv,israel",
    "3|n|03/26:03->10/29:04": "8/kyiv,8/kiev",
    "3|n": "0/addis_ababa,0/asmara,0/asmera,0/dar_es_salaam,0/djibouti,0/juba,0/kampala,0/mogadishu,0/nairobi,2/aden,2/amman,2/baghdad,2/bahrain,2/damascus,2/kuwait,2/qatar,2/riyadh,8/istanbul,8/kirov,8/minsk,8/moscow,8/simferopol,9/comoro,9/mayotte,2/istanbul,turkey,w-su",
    "3.5|n": "2/tehran,iran",
    "2|s|03/31:02->10/27:02": "12/troll",
    "2|s": "0/gaborone,0/harare,0/johannesburg,0/lubumbashi,0/lusaka,0/maputo,0/maseru,0/mbabane",
    "2|n|03/31:02->10/27:03": "0/ceuta,arctic/longyearbyen,8/amsterdam,8/andorra,8/belgrade,8/berlin,8/bratislava,8/brussels,8/budapest,8/busingen,8/copenhagen,8/gibraltar,8/ljubljana,8/luxembourg,8/madrid,8/malta,8/monaco,8/oslo,8/paris,8/podgorica,8/prague,8/rome,8/san_marino,8/sarajevo,8/skopje,8/stockholm,8/tirane,8/vaduz,8/vatican,8/vienna,8/warsaw,8/zagreb,8/zurich,3/jan_mayen,poland,cet,met",
    "2|n": "0/blantyre,0/bujumbura,0/khartoum,0/kigali,0/tripoli,8/kaliningrad,libya",
    "1|s": "0/brazzaville,0/kinshasa,0/luanda,0/windhoek",
    "1|n|03/31:01->10/27:02": "3/canary,3/faroe,3/madeira,8/dublin,8/guernsey,8/isle_of_man,8/jersey,8/lisbon,8/london,3/faeroe,eire,8/belfast,gb-eire,gb,portugal,wet",
    "1|n": "0/algiers,0/bangui,0/douala,0/lagos,0/libreville,0/malabo,0/ndjamena,0/niamey,0/porto-novo,0/tunis",
    "14|n": "11/kiritimati",
    "13|s": "11/apia,11/tongatapu",
    "13|n": "11/enderbury,11/kanton,11/fakaofo",
    "12|s|04/07:03->09/29:02": "12/mcmurdo,11/auckland,12/south_pole,nz",
    "12|s": "11/fiji",
    "12|n": "2/anadyr,2/kamchatka,2/srednekolymsk,11/funafuti,11/kwajalein,11/majuro,11/nauru,11/tarawa,11/wake,11/wallis,kwajalein",
    "12.75|s|04/07:03->04/07:02": "11/chatham,nz-chat",
    "11|s|04/07:03->10/06:02": "12/macquarie",
    "11|s": "11/bougainville",
    "11|n": "2/magadan,2/sakhalin,11/efate,11/guadalcanal,11/kosrae,11/noumea,11/pohnpei,11/ponape",
    "11.5|n|04/07:03->10/06:02": "11/norfolk",
    "10|s|04/07:03->10/06:02": "4/currie,4/hobart,4/melbourne,4/sydney,4/act,4/canberra,4/nsw,4/tasmania,4/victoria",
    "10|s": "12/dumontdurville,4/brisbane,4/lindeman,11/port_moresby,4/queensland",
    "10|n": "2/ust-nera,2/vladivostok,11/guam,11/saipan,11/chuuk,11/truk,11/yap",
    "10.5|s|04/07:01->10/06:02": "4/lord_howe,4/lhi",
    "0|s|03/10:03->04/14:02": "0/casablanca,0/el_aaiun",
    "0|n|03/31:00->10/27:01": "1/scoresbysund,3/azores",
    "0|n": "0/abidjan,0/accra,0/bamako,0/banjul,0/bissau,0/conakry,0/dakar,0/freetown,0/lome,0/monrovia,0/nouakchott,0/ouagadougou,0/sao_tome,1/danmarkshavn,3/reykjavik,3/st_helena,13/gmt,13/utc,0/timbuktu,13/greenwich,13/uct,13/universal,13/zulu,gmt-0,gmt+0,gmt0,greenwich,iceland,uct,universal,utc,zulu,13/unknown,factory",
    "-9|n|03/10:02->11/03:02": "1/adak,1/atka,us/aleutian",
    "-9|n": "11/gambier",
    "-9.5|n": "11/marquesas",
    "-8|n|03/10:02->11/03:02": "1/anchorage,1/juneau,1/nome,1/sitka,1/yakutat,us/alaska",
    "-8|n": "1/metlakatla,11/pitcairn",
    "-7|n|03/10:02->11/03:02": "1/los_angeles,1/santa_isabel,1/tijuana,1/vancouver,1/ensenada,6/pacific,10/bajanorte,us/pacific-new,us/pacific",
    "-7|n": "1/creston,1/dawson,1/dawson_creek,1/fort_nelson,1/hermosillo,1/mazatlan,1/phoenix,1/whitehorse,6/yukon,10/bajasur,us/arizona,mst",
    "-6|s|04/06:22->09/07:22": "11/easter,7/easterisland",
    "-6|n|04/07:02->10/27:02": "1/merida",
    "-6|n|03/12:02->11/05:02": "1/ciudad_juarez",
    "-6|n|03/10:02->11/03:02": "1/boise,1/cambridge_bay,1/denver,1/edmonton,1/inuvik,1/north_dakota,1/ojinaga,1/yellowknife,1/shiprock,6/mountain,navajo,us/mountain",
    "-6|n": "1/bahia_banderas,1/belize,1/chihuahua,1/costa_rica,1/el_salvador,1/guatemala,1/managua,1/mexico_city,1/monterrey,1/regina,1/swift_current,1/tegucigalpa,11/galapagos,6/east-saskatchewan,6/saskatchewan,10/general",
    "-5|s": "1/lima,1/rio_branco,1/porto_acre,5/acre",
    "-5|n|03/10:02->11/03:02": "1/chicago,1/matamoros,1/menominee,1/rainy_river,1/rankin_inlet,1/resolute,1/winnipeg,1/indiana/knox,1/indiana/tell_city,1/north_dakota/beulah,1/north_dakota/center,1/north_dakota/new_salem,1/knox_in,6/central,us/central,us/indiana-starke",
    "-5|n": "1/bogota,1/cancun,1/cayman,1/coral_harbour,1/eirunepe,1/guayaquil,1/jamaica,1/panama,1/atikokan,jamaica,est",
    "-4|s|04/06:24->09/08:00": "1/santiago,7/continental",
    "-4|s|03/23:24->10/06:00": "1/asuncion",
    "-4|s": "1/campo_grande,1/cuiaba,1/la_paz,1/manaus,5/west",
    "-4|n|03/10:02->11/03:02": "1/detroit,1/grand_turk,1/indiana,1/indianapolis,1/iqaluit,1/kentucky,1/louisville,1/montreal,1/nassau,1/new_york,1/nipigon,1/pangnirtung,1/port-au-prince,1/thunder_bay,1/toronto,1/indiana/marengo,1/indiana/petersburg,1/indiana/vevay,1/indiana/vincennes,1/indiana/winamac,1/kentucky/monticello,1/fort_wayne,1/indiana/indianapolis,1/kentucky/louisville,6/eastern,us/east-indiana,us/eastern,us/michigan",
    "-4|n|03/10:00->11/03:01": "1/havana,cuba",
    "-4|n": "1/anguilla,1/antigua,1/aruba,1/barbados,1/blanc-sablon,1/boa_vista,1/caracas,1/curacao,1/dominica,1/grenada,1/guadeloupe,1/guyana,1/kralendijk,1/lower_princes,1/marigot,1/martinique,1/montserrat,1/port_of_spain,1/porto_velho,1/puerto_rico,1/santo_domingo,1/st_barthelemy,1/st_kitts,1/st_lucia,1/st_thomas,1/st_vincent,1/tortola,1/virgin",
    "-3|s": "1/argentina,1/buenos_aires,1/catamarca,1/cordoba,1/fortaleza,1/jujuy,1/mendoza,1/montevideo,1/punta_arenas,1/sao_paulo,12/palmer,12/rothera,3/stanley,1/argentina/la_rioja,1/argentina/rio_gallegos,1/argentina/salta,1/argentina/san_juan,1/argentina/san_luis,1/argentina/tucuman,1/argentina/ushuaia,1/argentina/comodrivadavia,1/argentina/buenos_aires,1/argentina/catamarca,1/argentina/cordoba,1/argentina/jujuy,1/argentina/mendoza,1/argentina/rosario,1/rosario,5/east",
    "-3|n|03/10:02->11/03:02": "1/glace_bay,1/goose_bay,1/halifax,1/moncton,1/thule,3/bermuda,6/atlantic",
    "-3|n": "1/araguaina,1/bahia,1/belem,1/cayenne,1/maceio,1/paramaribo,1/recife,1/santarem",
    "-2|n|03/30:22->10/26:23": "1/nuuk,1/godthab",
    "-2|n|03/10:02->11/03:02": "1/miquelon",
    "-2|n": "1/noronha,3/south_georgia,5/denoronha",
    "-2.5|n|03/10:02->11/03:02": "1/st_johns,6/newfoundland",
    "-1|n": "3/cape_verde",
    "-11|n": "11/midway,11/niue,11/pago_pago,11/samoa,us/samoa",
    "-10|n": "11/honolulu,11/johnston,11/rarotonga,11/tahiti,us/hawaii,hst"
}
  , Lj = ["africa", "america", "asia", "atlantic", "australia", "brazil", "canada", "chile", "europe", "indian", "mexico", "pacific", "antarctica", "etc"];
let i0 = {};
Object.keys(xg).forEach(t=>{
    let e = t.split("|")
      , n = {
        offset: Number(e[0]),
        hem: e[1]
    };
    e[2] && (n.dst = e[2]),
    xg[t].split(",").forEach(s=>{
        s = s.replace(/(^[0-9]+)\//, (i,a)=>(a = Number(a),
        Lj[a] + "/")),
        i0[s] = n
    }
    )
}
);
i0.utc = {
    offset: 0,
    hem: "n"
};
for (let t = -14; t <= 14; t += .5) {
    let e = t;
    e > 0 && (e = "+" + e);
    let n = "etc/gmt" + e;
    i0[n] = {
        offset: t * -1,
        hem: "n"
    },
    n = "utc/gmt" + e,
    i0[n] = {
        offset: t * -1,
        hem: "n"
    }
}
const Bk = i0
  , Oj = "utc"
  , Rj = ()=>{
    if (typeof Intl > "u" || typeof Intl.DateTimeFormat > "u")
        return null;
    let t = Intl.DateTimeFormat();
    if (typeof t > "u" || typeof t.resolvedOptions > "u")
        return null;
    let e = t.resolvedOptions().timeZone;
    return e ? e.toLowerCase() : null
}
  , Pj = ()=>{
    let t = Rj();
    return t === null ? Oj : t
}
  , $j = Pj
  , Fj = /(\-?[0-9]+)h(rs)?/i
  , Nj = /(\-?[0-9]+)/
  , Vj = /utc([\-+]?[0-9]+)/i
  , Bj = /gmt([\-+]?[0-9]+)/i
  , P5 = function(t) {
    return t = Number(t),
    t >= -13 && t <= 13 ? (t = t * -1,
    t = (t > 0 ? "+" : "") + t,
    "etc/gmt" + t) : null
}
  , Uj = function(t) {
    let e = t.match(Fj);
    if (e !== null || (e = t.match(Vj),
    e !== null))
        return P5(e[1]);
    if (e = t.match(Bj),
    e !== null) {
        let n = Number(e[1]) * -1;
        return P5(n)
    }
    return e = t.match(Nj),
    e !== null ? P5(e[1]) : null
}
  , Hj = Uj;
let $5 = $j();
const Dg = Object.keys(Bk).reduce((t,e)=>{
    let n = e.split("/")[1] || "";
    return n = n.replace(/_/g, " "),
    t[n] = e,
    t
}
, {})
  , zj = t=>(t = t.replace(/ time/g, ""),
t = t.replace(/ (standard|daylight|summer)/g, ""),
t = t.replace(/\b(east|west|north|south)ern/g, "$1"),
t = t.replace(/\b(africa|america|australia)n/g, "$1"),
t = t.replace(/\beuropean/g, "europe"),
t = t.replace(/\islands/g, "island"),
t)
  , Zj = (t,e)=>{
    if (!t)
        return e.hasOwnProperty($5) || (console.warn(`Unrecognized IANA id '${$5}'. Setting fallback tz to UTC.`),
        $5 = "utc"),
        $5;
    typeof t != "string" && console.error("Timezone must be a string - recieved: '", t, `'
`);
    let n = t.trim();
    if (n = n.toLowerCase(),
    e.hasOwnProperty(n) === !0 || (n = zj(n),
    e.hasOwnProperty(n) === !0))
        return n;
    if (Dg.hasOwnProperty(n) === !0)
        return Dg[n];
    if (/[0-9]/.test(n) === !0) {
        let r = Hj(n);
        if (r)
            return r
    }
    throw new Error("Spacetime: Cannot find timezone named: '" + t + "'. Please enter an IANA timezone id.")
}
  , V2 = Zj;
function i5(t) {
    return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
}
function Uk(t) {
    return Object.prototype.toString.call(t) === "[object Date]" && !isNaN(t.valueOf())
}
function qj(t) {
    return Object.prototype.toString.call(t) === "[object Array]"
}
function y1(t) {
    return Object.prototype.toString.call(t) === "[object Object]"
}
function Wj(t) {
    return Object.prototype.toString.call(t) === "[object Boolean]"
}
function vt(t, e=2) {
    let n = "0";
    return t = t + "",
    t.length >= e ? t : new Array(e - t.length + 1).join(n) + t
}
function Gj(t) {
    return t ? t[0].toUpperCase() + t.substr(1) : ""
}
function Ja(t) {
    let e = t % 10
      , n = t % 100;
    return e === 1 && n !== 11 ? t + "st" : e === 2 && n !== 12 ? t + "nd" : e === 3 && n !== 13 ? t + "rd" : t + "th"
}
function ud(t) {
    return t = String(t),
    t = t.replace(/([0-9])(st|nd|rd|th)$/i, "$1"),
    parseInt(t, 10)
}
function fl(t="") {
    return t = t.toLowerCase().trim(),
    t = t.replace(/ies$/, "y"),
    t = t.replace(/s$/, ""),
    t = t.replace(/-/g, ""),
    t === "day" || t === "days" ? "date" : t === "min" || t === "mins" ? "minute" : t
}
function uu(t) {
    return typeof t == "number" ? t : Uk(t) ? t.getTime() : t.epoch ? t.epoch : null
}
function yc(t, e) {
    return y1(t) === !1 ? e.clone().set(t) : t
}
function Du(t, e="") {
    const n = t > 0 ? "+" : "-"
      , r = Math.abs(t)
      , s = vt(parseInt("" + r, 10))
      , i = vt(r % 1 * 60);
    return `${n}${s}${e}${i}`
}
const G7 = {
    year: new Date().getFullYear(),
    month: 0,
    date: 1
}
  , Kj = (t,e,n)=>{
    if (e.length === 0)
        return t;
    let r = ["year", "month", "date", "hour", "minute", "second", "millisecond"];
    for (let s = 0; s < r.length; s++) {
        let i = e[s] || n[r[s]] || G7[r[s]] || 0;
        t = t[r[s]](i)
    }
    return t
}
  , Yj = (t,e,n)=>{
    if (Object.keys(e).length === 0)
        return t;
    e = Object.assign({}, G7, n, e);
    let r = Object.keys(e);
    for (let s = 0; s < r.length; s++) {
        let i = r[s];
        if (t[i] === void 0 || typeof t[i] != "function" || e[i] === null || e[i] === void 0 || e[i] === "")
            continue;
        let a = e[i] || n[i] || G7[i] || 0;
        t = t[i](a)
    }
    return t
}
  , Qj = function(t, e) {
    return e > 0 && e < 25e8 && t.silent === !1 && (console.warn("  - Warning: You are setting the date to January 1970."),
    console.warn("       -   did input seconds instead of milliseconds?")),
    t.epoch = e,
    t
}
  , Xj = {
    parseArray: Kj,
    parseObject: Yj,
    parseNumber: Qj
}
  , cc = function(t) {
    return t.epoch = Date.now(),
    Object.keys(t._today || {}).forEach(e=>{
        typeof t[e] == "function" && (t = t[e](t._today[e]))
    }
    ),
    t
}
  , K7 = {
    now: t=>cc(t),
    today: t=>cc(t),
    tonight: t=>(t = cc(t),
    t = t.hour(18),
    t),
    tomorrow: t=>(t = cc(t),
    t = t.add(1, "day"),
    t = t.startOf("day"),
    t),
    yesterday: t=>(t = cc(t),
    t = t.subtract(1, "day"),
    t = t.startOf("day"),
    t),
    christmas: t=>{
        let e = cc(t).year();
        return t = t.set([e, 11, 25, 18, 0, 0]),
        t
    }
    ,
    "new years": t=>{
        let e = cc(t).year();
        return t = t.set([e, 11, 31, 18, 0, 0]),
        t
    }
};
K7["new years eve"] = K7["new years"];
const Sg = K7
  , Jj = function(t) {
    return t = t.replace(/\b(mon|tues?|wed|wednes|thur?s?|fri|sat|satur|sun)(day)?\b/i, ""),
    t = t.replace(/([0-9])(th|rd|st|nd)/, "$1"),
    t = t.replace(/,/g, ""),
    t = t.replace(/ +/g, " ").trim(),
    t
}
  , eM = Jj;
let Qs = {
    millisecond: 1
};
Qs.second = 1e3;
Qs.minute = 6e4;
Qs.hour = 36e5;
Qs.day = 864e5;
Qs.date = Qs.day;
Qs.month = 864e5 * 29.5;
Qs.week = 6048e5;
Qs.year = 3154e7;
Object.keys(Qs).forEach(t=>{
    Qs[t + "s"] = Qs[t]
}
);
const Ar = Qs
  , F5 = (t,e,n,r,s)=>{
    let i = t.d[n]();
    if (i === e)
        return;
    let a = s === null ? null : t.d[s]()
      , o = t.epoch
      , l = e - i;
    t.epoch += Ar[r] * l,
    r === "day" && Math.abs(l) > 28 && e < 28 && (t.epoch += Ar.hour),
    s !== null && a !== t.d[s]() && (t.epoch = o);
    const d = Ar[r] / 2;
    for (; t.d[n]() < e; )
        t.epoch += d;
    for (; t.d[n]() > e; )
        t.epoch -= d;
    s !== null && a !== t.d[s]() && (t.epoch = o)
}
  , qh = {
    year: {
        valid: t=>t > -4e3 && t < 4e3,
        walkTo: (t,e)=>F5(t, e, "getFullYear", "year", null)
    },
    month: {
        valid: t=>t >= 0 && t <= 11,
        walkTo: (t,e)=>{
            let n = t.d
              , r = n.getMonth()
              , s = t.epoch
              , i = n.getFullYear();
            if (r === e)
                return;
            let a = e - r;
            for (t.epoch += Ar.day * (a * 28),
            i !== t.d.getFullYear() && (t.epoch = s); t.d.getMonth() < e; )
                t.epoch += Ar.day;
            for (; t.d.getMonth() > e; )
                t.epoch -= Ar.day
        }
    },
    date: {
        valid: t=>t > 0 && t <= 31,
        walkTo: (t,e)=>F5(t, e, "getDate", "day", "getMonth")
    },
    hour: {
        valid: t=>t >= 0 && t < 24,
        walkTo: (t,e)=>F5(t, e, "getHours", "hour", "getDate")
    },
    minute: {
        valid: t=>t >= 0 && t < 60,
        walkTo: (t,e)=>F5(t, e, "getMinutes", "minute", "getHours")
    },
    second: {
        valid: t=>t >= 0 && t < 60,
        walkTo: (t,e)=>{
            t.epoch = t.seconds(e).epoch
        }
    },
    millisecond: {
        valid: t=>t >= 0 && t < 1e3,
        walkTo: (t,e)=>{
            t.epoch = t.milliseconds(e).epoch
        }
    }
}
  , tM = (t,e)=>{
    let n = Object.keys(qh)
      , r = t.clone();
    for (let s = 0; s < n.length; s++) {
        let i = n[s]
          , a = e[i];
        if (a === void 0 && (a = r[i]()),
        typeof a == "string" && (a = parseInt(a, 10)),
        !qh[i].valid(a)) {
            t.epoch = null,
            t.silent === !1 && console.warn("invalid " + i + ": " + a);
            return
        }
        qh[i].walkTo(t, a)
    }
}
  , an = tM
  , nM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  , qc = nM;
let a0 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  , o0 = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function rM() {
    const t = {
        sep: 8
    };
    for (let e = 0; e < a0.length; e++)
        t[a0[e]] = e;
    for (let e = 0; e < o0.length; e++)
        t[o0[e]] = e;
    return t
}
function hu() {
    return a0
}
function sM() {
    return o0
}
function Hk() {
    return rM()
}
function iM(t) {
    a0 = t.short || a0,
    o0 = t.long || o0
}
const aM = (t,e)=>{
    if (!e)
        return t;
    let n = 0;
    if (/^[\+-]?[0-9]{2}:[0-9]{2}$/.test(e) && (/:00/.test(e) === !0 && (e = e.replace(/:00/, "")),
    /:30/.test(e) === !0 && (e = e.replace(/:30/, ".5"))),
    /^[\+-]?[0-9]{4}$/.test(e) && (e = e.replace(/30$/, ".5")),
    n = parseFloat(e),
    Math.abs(n) > 100 && (n = n / 100),
    n === 0 || e === "Z" || e === "z")
        return t.tz = "etc/gmt",
        t;
    n *= -1,
    n >= 0 && (n = "+" + n);
    let r = "etc/gmt" + n;
    return t.timezones[r] && (t.tz = r),
    t
}
  , oM = aM
  , cM = function(t="") {
    return t = String(t),
    t.length > 3 ? t = t.substr(0, 3) : t.length === 1 ? t = t + "00" : t.length === 2 && (t = t + "0"),
    Number(t) || 0
}
  , lM = (t,e="")=>{
    e = e.replace(/^\s+/, "").toLowerCase();
    let n = e.match(/([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?[:\.]?([0-9]{1,4})?/);
    if (n !== null) {
        let r = Number(n[1]);
        if (r < 0 || r > 24)
            return t.startOf("day");
        let s = Number(n[2]);
        if (n[2].length < 2 || s < 0 || s > 59)
            return t.startOf("day");
        t = t.hour(r),
        t = t.minute(s),
        t = t.seconds(n[3] || 0),
        t = t.millisecond(cM(n[4]));
        let i = e.match(/[\b0-9] ?(am|pm)\b/);
        return i !== null && i[1] && (t = t.ampm(i[1])),
        t
    }
    if (n = e.match(/([0-9]+) ?(am|pm)/),
    n !== null && n[1]) {
        let r = Number(n[1]);
        return r > 12 || r < 1 ? t.startOf("day") : (t = t.hour(n[1] || 0),
        t = t.ampm(n[2]),
        t = t.startOf("hour"),
        t)
    }
    return t = t.startOf("day"),
    t
}
  , cs = lM;
let _g = Hk();
const ls = t=>{
    if (qc.hasOwnProperty(t.month) !== !0)
        return !1;
    if (t.month === 1)
        return i5(t.year) && t.date <= 29 ? !0 : t.date <= 28;
    let e = qc[t.month] || 0;
    return t.date <= e
}
  , Co = (t="",e)=>{
    if (t = t.trim(),
    /^'[0-9][0-9]$/.test(t) === !0) {
        let r = Number(t.replace(/'/, ""));
        return r > 50 ? 1900 + r : 2e3 + r
    }
    let n = parseInt(t, 10);
    return !n && e && (n = e.year),
    n = n || new Date().getFullYear(),
    n
}
  , S1 = function(t) {
    return t = t.toLowerCase().trim(),
    t === "sept" ? _g.sep : _g[t]
}
  , dM = [{
    reg: /^(\-?0?0?[0-9]{3,4})-([0-9]{1,2})-([0-9]{1,2})[T| ]([0-9.:]+)(Z|[0-9\-\+:]+)?$/i,
    parse: (t,e)=>{
        let n = {
            year: e[1],
            month: parseInt(e[2], 10) - 1,
            date: e[3]
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (oM(t, e[5]),
        an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([0-9]{4})[\-\/\. ]([0-9]{1,2})[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (t,e)=>{
        let n = {
            year: e[1],
            month: parseInt(e[2], 10) - 1,
            date: parseInt(e[3], 10)
        };
        return n.month >= 12 && (n.date = parseInt(e[2], 10),
        n.month = parseInt(e[3], 10) - 1),
        ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([0-9]{4})[\-\/\. ]([a-z]+)[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[1], t._today),
            month: S1(e[2]),
            date: ud(e[3] || "")
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}]
  , uM = [{
    reg: /^([0-9]{1,2})[\-\/.]([0-9]{1,2})[\-\/.]?([0-9]{4})?( [0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
    parse: (t,e)=>{
        let n = parseInt(e[1], 10) - 1
          , r = parseInt(e[2], 10);
        (t.british || n >= 12) && (r = parseInt(e[1], 10),
        n = parseInt(e[2], 10) - 1);
        let s = {
            date: r,
            month: n,
            year: Co(e[3], t._today) || new Date().getFullYear()
        };
        return ls(s) === !1 ? (t.epoch = null,
        t) : (an(t, s),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([a-z]+)[\-\/\. ]([0-9]{1,2})[\-\/\. ]?([0-9]{4}|'[0-9]{2})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[3], t._today),
            month: S1(e[1]),
            date: ud(e[2] || "")
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([a-z]+) ([0-9]{1,2})( [0-9]{4})?( ([0-9:]+( ?am| ?pm| ?gmt)?))?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[3], t._today),
            month: S1(e[1]),
            date: ud(e[2] || "")
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([a-z]+) ([0-9]{1,2})( [0-9:]+)?( \+[0-9]{4})?( [0-9]{4})?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[5], t._today),
            month: S1(e[1]),
            date: ud(e[2] || "")
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[3]),
        t)
    }
}]
  , hM = [{
    reg: /^([0-9]{1,2})[\-\/]([a-z]+)[\-\/]?([0-9]{4})?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[3], t._today),
            month: S1(e[2]),
            date: ud(e[1] || "")
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([0-9]{1,2})( [a-z]+)( [0-9]{4}| '[0-9]{2})? ?([0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[3], t._today),
            month: S1(e[2]),
            date: ud(e[1])
        };
        return !n.month || ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([0-9]{1,2})[\. -/]([a-z]+)[\. -/]([0-9]{4})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (t,e)=>{
        let n = {
            date: Number(e[1]),
            month: S1(e[2]),
            year: Number(e[3])
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = t.startOf("day"),
        t = cs(t, e[4]),
        t)
    }
}]
  , fM = [{
    reg: /^([0-9]{4})[\-\/]([0-9]{2})$/i,
    parse: (t,e)=>{
        let n = {
            year: e[1],
            month: parseInt(e[2], 10) - 1,
            date: 1
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^([a-z]+) ([0-9]{4})$/i,
    parse: (t,e)=>{
        let n = {
            year: Co(e[2], t._today),
            month: S1(e[1]),
            date: t._today.date || 1
        };
        return ls(n) === !1 ? (t.epoch = null,
        t) : (an(t, n),
        t = cs(t, e[4]),
        t)
    }
}, {
    reg: /^(q[0-9])( of)?( [0-9]{4})?/i,
    parse: (t,e)=>{
        let n = e[1] || "";
        t = t.quarter(n);
        let r = e[3] || "";
        return r && (r = r.trim(),
        t = t.year(r)),
        t
    }
}, {
    reg: /^(spring|summer|winter|fall|autumn)( of)?( [0-9]{4})?/i,
    parse: (t,e)=>{
        let n = e[1] || "";
        t = t.season(n);
        let r = e[3] || "";
        return r && (r = r.trim(),
        t = t.year(r)),
        t
    }
}, {
    reg: /^[0-9,]+ ?b\.?c\.?$/i,
    parse: (t,e)=>{
        let n = e[0] || "";
        n = n.replace(/^([0-9,]+) ?b\.?c\.?$/i, "-$1");
        let r = new Date
          , s = {
            year: parseInt(n.trim(), 10),
            month: r.getMonth(),
            date: r.getDate()
        };
        return ls(s) === !1 ? (t.epoch = null,
        t) : (an(t, s),
        t = cs(t),
        t)
    }
}, {
    reg: /^[0-9,]+ ?(a\.?d\.?|c\.?e\.?)$/i,
    parse: (t,e)=>{
        let n = e[0] || "";
        n = n.replace(/,/g, "");
        let r = new Date
          , s = {
            year: parseInt(n.trim(), 10),
            month: r.getMonth(),
            date: r.getDate()
        };
        return ls(s) === !1 ? (t.epoch = null,
        t) : (an(t, s),
        t = cs(t),
        t)
    }
}, {
    reg: /^[0-9]{4}( ?a\.?d\.?)?$/i,
    parse: (t,e)=>{
        let n = t._today;
        n.month && !n.date && (n.date = 1);
        let r = new Date
          , s = {
            year: Co(e[0], n),
            month: n.month || r.getMonth(),
            date: n.date || r.getDate()
        };
        return ls(s) === !1 ? (t.epoch = null,
        t) : (an(t, s),
        t = cs(t),
        t)
    }
}]
  , Wh = [].concat(dM, uM, hM, fM)
  , pM = function(t, e, n) {
    for (let r = 0; r < Wh.length; r++) {
        let s = e.match(Wh[r].reg);
        if (s) {
            let i = Wh[r].parse(t, s, n);
            if (i !== null && i.isValid())
                return i
        }
    }
    return t.silent === !1 && console.warn("Warning: couldn't parse date-string: '" + e + "'"),
    t.epoch = null,
    t
}
  , mM = pM
  , {parseArray: gM, parseObject: Ig, parseNumber: yM} = Xj
  , Eg = {
    year: new Date().getFullYear(),
    month: 0,
    date: 1
}
  , CM = (t,e)=>{
    let n = t._today || Eg;
    if (typeof e == "number")
        return yM(t, e);
    if (t.epoch = Date.now(),
    t._today && y1(t._today) && Object.keys(t._today).length > 0) {
        let r = Ig(t, n, Eg);
        r.isValid() && (t.epoch = r.epoch)
    }
    return e == null || e === "" ? t : Uk(e) === !0 ? (t.epoch = e.getTime(),
    t) : qj(e) === !0 ? (t = gM(t, e, n),
    t) : y1(e) === !0 ? e.epoch ? (t.epoch = e.epoch,
    t.tz = e.tz,
    t) : (t = Ig(t, e, n),
    t) : typeof e != "string" ? t : (e = eM(e),
    Sg.hasOwnProperty(e) === !0 ? (t = Sg[e](t),
    t) : mM(t, e))
}
  , zk = CM;
let Y7 = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  , Q7 = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
function c0() {
    return Y7
}
function B2() {
    return Q7
}
function bM(t) {
    Y7 = t.short || Y7,
    Q7 = t.long || Q7
}
const Ag = {
    mo: 1,
    tu: 2,
    we: 3,
    th: 4,
    fr: 5,
    sa: 6,
    su: 7,
    tues: 2,
    weds: 3,
    wedn: 3,
    thur: 4,
    thurs: 4
};
let Zk = !0;
function vM() {
    return Zk
}
function wM(t) {
    Zk = t
}
const kM = t=>{
    let e = t.timezone().current.offset;
    return e ? Du(e, ":") : "Z"
}
  , jg = kM
  , ao = t=>vM() ? Gj(t) : t
  , xM = t=>t >= 0 ? vt(t, 4) : (t = Math.abs(t),
"-" + vt(t, 4))
  , Ql = {
    day: t=>ao(t.dayName()),
    "day-short": t=>ao(c0()[t.day()]),
    "day-number": t=>t.day(),
    "day-ordinal": t=>Ja(t.day()),
    "day-pad": t=>vt(t.day()),
    date: t=>t.date(),
    "date-ordinal": t=>Ja(t.date()),
    "date-pad": t=>vt(t.date()),
    month: t=>ao(t.monthName()),
    "month-short": t=>ao(hu()[t.month()]),
    "month-number": t=>t.month(),
    "month-ordinal": t=>Ja(t.month()),
    "month-pad": t=>vt(t.month()),
    "iso-month": t=>vt(t.month() + 1),
    year: t=>{
        let e = t.year();
        return e > 0 ? e : (e = Math.abs(e),
        e + " BC")
    }
    ,
    "year-short": t=>{
        let e = t.year();
        return e > 0 ? `'${String(t.year()).substr(2, 4)}` : (e = Math.abs(e),
        e + " BC")
    }
    ,
    "iso-year": t=>{
        let e = t.year()
          , n = e < 0
          , r = vt(Math.abs(e), 4);
        return n && (r = vt(r, 6),
        r = "-" + r),
        r
    }
    ,
    time: t=>t.time(),
    "time-24": t=>`${t.hour24()}:${vt(t.minute())}`,
    hour: t=>t.hour12(),
    "hour-pad": t=>vt(t.hour12()),
    "hour-24": t=>t.hour24(),
    "hour-24-pad": t=>vt(t.hour24()),
    minute: t=>t.minute(),
    "minute-pad": t=>vt(t.minute()),
    second: t=>t.second(),
    "second-pad": t=>vt(t.second()),
    millisecond: t=>t.millisecond(),
    "millisecond-pad": t=>vt(t.millisecond(), 3),
    ampm: t=>t.ampm(),
    AMPM: t=>t.ampm().toUpperCase(),
    quarter: t=>"Q" + t.quarter(),
    season: t=>t.season(),
    era: t=>t.era(),
    json: t=>t.json(),
    timezone: t=>t.timezone().name,
    offset: t=>jg(t),
    numeric: t=>`${t.year()}/${vt(t.month() + 1)}/${vt(t.date())}`,
    "numeric-us": t=>`${vt(t.month() + 1)}/${vt(t.date())}/${t.year()}`,
    "numeric-uk": t=>`${vt(t.date())}/${vt(t.month() + 1)}/${t.year()}`,
    "mm/dd": t=>`${vt(t.month() + 1)}/${vt(t.date())}`,
    iso: t=>{
        let e = t.format("iso-year")
          , n = vt(t.month() + 1)
          , r = vt(t.date())
          , s = vt(t.h24())
          , i = vt(t.minute())
          , a = vt(t.second())
          , o = vt(t.millisecond(), 3)
          , l = jg(t);
        return `${e}-${n}-${r}T${s}:${i}:${a}.${o}${l}`
    }
    ,
    "iso-short": t=>{
        let e = vt(t.month() + 1)
          , n = vt(t.date());
        return `${xM(t.year())}-${e}-${n}`
    }
    ,
    "iso-utc": t=>new Date(t.epoch).toISOString(),
    nice: t=>`${hu()[t.month()]} ${Ja(t.date())}, ${t.time()}`,
    "nice-24": t=>`${hu()[t.month()]} ${Ja(t.date())}, ${t.hour24()}:${vt(t.minute())}`,
    "nice-year": t=>`${hu()[t.month()]} ${Ja(t.date())}, ${t.year()}`,
    "nice-day": t=>`${c0()[t.day()]} ${ao(hu()[t.month()])} ${Ja(t.date())}`,
    "nice-full": t=>`${t.dayName()} ${ao(t.monthName())} ${Ja(t.date())}, ${t.time()}`,
    "nice-full-24": t=>`${t.dayName()} ${ao(t.monthName())} ${Ja(t.date())}, ${t.hour24()}:${vt(t.minute())}`
}
  , Mg = {
    "day-name": "day",
    "month-name": "month",
    "iso 8601": "iso",
    "time-h24": "time-24",
    "time-12": "time",
    "time-h12": "time",
    tz: "timezone",
    "day-num": "day-number",
    "month-num": "month-number",
    "month-iso": "iso-month",
    "year-iso": "iso-year",
    "nice-short": "nice",
    "nice-short-24": "nice-24",
    mdy: "numeric-us",
    dmy: "numeric-uk",
    ymd: "numeric",
    "yyyy/mm/dd": "numeric",
    "mm/dd/yyyy": "numeric-us",
    "dd/mm/yyyy": "numeric-us",
    "little-endian": "numeric-uk",
    "big-endian": "numeric",
    "day-nice": "nice-day"
};
Object.keys(Mg).forEach(t=>Ql[t] = Ql[Mg[t]]);
const DM = (t,e="")=>{
    if (t.isValid() !== !0)
        return "";
    if (Ql.hasOwnProperty(e)) {
        let n = Ql[e](t) || "";
        return e !== "json" && (n = String(n),
        e.toLowerCase() !== "ampm" && (n = ao(n))),
        n
    }
    if (e.indexOf("{") !== -1) {
        let n = /\{(.+?)\}/g;
        return e = e.replace(n, (r,s)=>{
            if (s = s.toLowerCase().trim(),
            Ql.hasOwnProperty(s)) {
                let i = String(Ql[s](t));
                return s.toLowerCase() !== "ampm" ? ao(i) : i
            }
            return ""
        }
        ),
        e
    }
    return t.format("iso-short")
}
  , Gh = DM
  , U2 = {
    G: t=>t.era(),
    GG: t=>t.era(),
    GGG: t=>t.era(),
    GGGG: t=>t.era() === "AD" ? "Anno Domini" : "Before Christ",
    y: t=>t.year(),
    yy: t=>vt(Number(String(t.year()).substr(2, 4))),
    yyy: t=>t.year(),
    yyyy: t=>t.year(),
    yyyyy: t=>"0" + t.year(),
    Q: t=>t.quarter(),
    QQ: t=>t.quarter(),
    QQQ: t=>t.quarter(),
    QQQQ: t=>t.quarter(),
    M: t=>t.month() + 1,
    MM: t=>vt(t.month() + 1),
    MMM: t=>t.format("month-short"),
    MMMM: t=>t.format("month"),
    w: t=>t.week(),
    ww: t=>vt(t.week()),
    d: t=>t.date(),
    dd: t=>vt(t.date()),
    D: t=>t.dayOfYear(),
    DD: t=>vt(t.dayOfYear()),
    DDD: t=>vt(t.dayOfYear(), 3),
    E: t=>t.format("day-short"),
    EE: t=>t.format("day-short"),
    EEE: t=>t.format("day-short"),
    EEEE: t=>t.format("day"),
    EEEEE: t=>t.format("day")[0],
    e: t=>t.day(),
    ee: t=>t.day(),
    eee: t=>t.format("day-short"),
    eeee: t=>t.format("day"),
    eeeee: t=>t.format("day")[0],
    a: t=>t.ampm().toUpperCase(),
    aa: t=>t.ampm().toUpperCase(),
    aaa: t=>t.ampm().toUpperCase(),
    aaaa: t=>t.ampm().toUpperCase(),
    h: t=>t.h12(),
    hh: t=>vt(t.h12()),
    H: t=>t.hour(),
    HH: t=>vt(t.hour()),
    m: t=>t.minute(),
    mm: t=>vt(t.minute()),
    s: t=>t.second(),
    ss: t=>vt(t.second()),
    SSS: t=>vt(t.millisecond(), 3),
    A: t=>t.epoch - t.startOf("day").epoch,
    z: t=>t.timezone().name,
    zz: t=>t.timezone().name,
    zzz: t=>t.timezone().name,
    zzzz: t=>t.timezone().name,
    Z: t=>Du(t.timezone().current.offset),
    ZZ: t=>Du(t.timezone().current.offset),
    ZZZ: t=>Du(t.timezone().current.offset),
    Z