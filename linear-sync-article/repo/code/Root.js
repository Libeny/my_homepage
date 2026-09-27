!function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}
          , n = (new Error).stack;
        n && (e._sentryDebugIds = e._sentryDebugIds || {},
        e._sentryDebugIds[n] = "9660bc13-dbd2-504c-8c38-bbe30850c8ee")
    } catch (e) {}
}();
function __vite__mapDeps(indexes) {
    if (!__vite__mapDeps.viteFileDeps) {
        __vite__mapDeps.viteFileDeps = [window.__toStaticUrl("assets/Arcade.hash-odnZyqiI.js"), window.__toStaticUrl("assets/vendor-core.hash-TqyN1mH4.js"), window.__toStaticUrl("assets/html.hash-p99cR5n6.js"), window.__toStaticUrl("assets/nivo.hash-3DLvEEek.js"), window.__toStaticUrl("assets/prosemirror.hash-DzHTrBWt.js"), window.__toStaticUrl("assets/EditorComponent.hash--0pjcv_e.js"), window.__toStaticUrl("assets/useIsMounted.hash-6JmVzofH.js"), window.__toStaticUrl("assets/uploadFile.hash-0g22HxDx.js"), window.__toStaticUrl("assets/CustomViewPopover.hash-518niGTR.js"), window.__toStaticUrl("assets/EditorIssueIcons.hash-u27iPlN7.js"), window.__toStaticUrl("assets/FastIssueCreateEditor.hash-vCaYbbVj.js"), window.__toStaticUrl("assets/FastTriageAcceptEditor.hash-vtoiTU-6.js"), window.__toStaticUrl("assets/graphs.hash-vKCkiCxm.js"), window.__toStaticUrl("assets/useNivoTheme.hash-tyNjFRcW.js"), window.__toStaticUrl("assets/ProjectUpdatesEmptyIcon.hash-PeK817io.js"), window.__toStaticUrl("assets/InlineCommentsEmptyIcon.hash-LIu0LLF8.js"), window.__toStaticUrl("assets/IssueCommentsAndHistory.hash-Vpip1D-C.js"), window.__toStaticUrl("assets/Inbox.hash-l8pjDoeL.js"), window.__toStaticUrl("assets/SplitView.hash-q7PXDJGW.js"), window.__toStaticUrl("assets/SplitIssueView.hash-hB7CZDI8.js"), window.__toStaticUrl("assets/ProjectDocumentInboxView.hash-3zbhbAkF.js"), window.__toStaticUrl("assets/SplitViewPanel.hash-f_PEXteT.js"), window.__toStaticUrl("assets/BackIcon.hash-YnKg49bA.js"), window.__toStaticUrl("assets/SubscriptionsControl.hash-phpVeSsy.js"), window.__toStaticUrl("assets/InitiativeOverviewPage.hash-329szuzI.js"), window.__toStaticUrl("assets/useIsSplitViewHeaderTight.hash-PWuUKGSj.js"), window.__toStaticUrl("assets/OauthClientApprovalActions.hash-EuB8ruu5.js"), window.__toStaticUrl("assets/OAuthAuthorizeView.hash-LLKI2XLg.js"), window.__toStaticUrl("assets/MyIssuesPage.hash-SxjkphuB.js"), window.__toStaticUrl("assets/LazyTriageEmptyPage.hash-2jawQZ1Q.js"), window.__toStaticUrl("assets/DraftsPage.hash-_loZiXCF.js"), window.__toStaticUrl("assets/MobileAuthView.hash-RQ9bhvYn.js"), window.__toStaticUrl("assets/TriagePage.hash-PlO5Zp11.js"), window.__toStaticUrl("assets/TeamsPage.hash-ScqsWBwv.js"), window.__toStaticUrl("assets/ProjectEmptyPage.hash-efE0ldTh.js"), window.__toStaticUrl("assets/LazyProjectPages.hash-9qPZnYyi.js"), window.__toStaticUrl("assets/useRoadmapHeaderPageSettings.hash-oaaaaTfr.js"), window.__toStaticUrl("assets/useOpenProjectFromTemplateUrl.hash-eqtyNW_C.js"), window.__toStaticUrl("assets/LazyProjectsPages.hash-JBo3HFdm.js"), window.__toStaticUrl("assets/useFacetModelsFromParams.hash-lQhz8IlI.js"), window.__toStaticUrl("assets/LazyInitiativePages.hash--3rIiusz.js"), window.__toStaticUrl("assets/SplitSearch.hash-u66NWxhg.js"), window.__toStaticUrl("assets/HelpCenter.hash-aWZL_lsX.js"), window.__toStaticUrl("assets/keyboardUpDownNavigation.hash-GFy-BRTX.js"), window.__toStaticUrl("assets/Settings.hash-tYXnlx1l.js"), window.__toStaticUrl("assets/SettingsRoutes.hash-miwX8Fwq.js"), window.__toStaticUrl("assets/FilterIcon.hash-GoXTxoTE.js"), window.__toStaticUrl("assets/TeamPullRequestSettings.hash-qd6iBr9k.js"), window.__toStaticUrl("assets/FeedbackFilledIcon.hash-K6WsrgsL.js"), window.__toStaticUrl("assets/UniversalCustomFilterPanelShouldBeLazyLoaded.hash-qtNURh_M.js"), window.__toStaticUrl("assets/TeamFilterBlocks.hash-JQLzMkQk.js"), window.__toStaticUrl("assets/RegisterFilterValuesShouldBeLazyLoaded.hash-zoUAgqAA.js"), window.__toStaticUrl("assets/browser.hash-I3R3ZqQq.js"), window.__toStaticUrl("assets/EmptyMilestoneImage.hash-4Tcl-CtW.js"), window.__toStaticUrl("assets/HelpShouldBeLazyLoaded.hash-y-gbK-MC.js"), window.__toStaticUrl("assets/QuestionMarkIcon.hash-t0B_99X_.js"), window.__toStaticUrl("assets/DeveloperToolbar.hash-47Z2ZyPw.js"), window.__toStaticUrl("assets/DebugFlags.hash-TdjUzhNL.js"), window.__toStaticUrl("assets/AiIsland.hash--t9E6CCQ.js"), window.__toStaticUrl("assets/InsightsPanelShouldBeLazyLoaded.hash-BtiYu8ZI.js"), window.__toStaticUrl("assets/JoinOrganization.hash-OvFv_XX_.js"), window.__toStaticUrl("assets/StyledOnboardingComponents.hash-CtOAUVrx.js"), window.__toStaticUrl("assets/Onboarding.hash-Gf6OXo2R.js"), window.__toStaticUrl("assets/InviteAccept.hash-tHtbsLWK.js"), window.__toStaticUrl("assets/InviteLinkAccept.hash-mlHdahRD.js"), window.__toStaticUrl("assets/DebugStatistics.hash-qJqc9H61.js"), window.__toStaticUrl("assets/DebugMisc.hash-jrsFQwZU.js"), window.__toStaticUrl("assets/DebugList.hash-_vQ82x7m.js"), window.__toStaticUrl("assets/DebugDifferentUITesting.hash-wQJfihLk.js"), window.__toStaticUrl("assets/DiaryPage.hash-UEVMVTbf.js"), window.__toStaticUrl("assets/DiaryView.hash-NDtMw_yw.js"), window.__toStaticUrl("assets/AIPlaygroundRouter.hash-_qT2IA_X.js"), window.__toStaticUrl("assets/DiaryModal.hash-hh5ldgv9.js"), window.__toStaticUrl("assets/DesktopInterstitial.hash-9At1DueS.js")]
    }
    return indexes.map((i)=>__vite__mapDeps.viteFileDeps[i])
}
"use client";
var K1e = Object.defineProperty;
var q1e = (e,t,n)=>t in e ? K1e(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n;
var nd = (e,t,n)=>(q1e(e, typeof t != "symbol" ? t + "" : t, n),
n);
import {r as f, O as y, j as s, Y as Rt, T as ee, N as Fu, v as mt, z as uo, x as he, _ as A, $ as Hr, c as Ps, Q as et, a as wi, Z as Wc, aM as qi, X as nc, ao as pn, bh as SP, u as Go, b as rs, bi as va, bj as Q5, M as Be, p as Ne, bk as VS, bl as z_, ak as We, b3 as xu, bc as hl, bd as rr, a5 as ol, f as Pv, a6 as er, bm as $v, an as Hi, bn as U_, aH as ls, bo as Up, e as jd, d as zS, ah as Ro, bp as Gf, a$ as OZ, ac as pi, b9 as H8, l as US, bq as Z1e, b8 as Y1e, aN as X5, a2 as e4, aQ as IP, n as gm, a4 as Lc, br as TP, aq as jg, bs as LZ, aa as FZ, k as J1e, bt as Q1e, bu as X1e, L as wg, bv as e0e, aT as t4, aO as G_, bw as _Z, bx as t0e, by as n0e, bz as BZ, bA as GS, bB as s0e, bC as o0e, bD as r0e, bE as i0e, m as kc, h as JC, bF as a0e, bG as l0e, bH as kP, bI as NZ, bJ as HZ, bK as V8, bL as VZ, bM as c0e, bN as d0e, bO as zZ, bP as Hj, bQ as AP, bR as MP, bS as hp, bT as Vj, bU as Jg, bV as Vi, bW as Qg, g as UZ, bX as u0e, bY as h0e, bZ as p0e, U as PP, b_ as zn, b$ as m0e, c0 as GZ, c1 as WZ, ag as KZ, ab as n4, c2 as f0e, c3 as qZ, c4 as g0e, b1 as x0e, aW as y0e, c5 as ZZ, c6 as fk, af as QC, ar as YZ, at as W_, bb as JZ, c7 as QZ, c8 as XZ, s as b0e, as as $P, au as v0e, a0 as eY, c9 as zj, ca as j0e, aE as w0e, aK as C0e, aI as gk, cb as S0e, ay as tY, aB as xk, cc as WS, cd as I0e, al as T0e, I as K_, am as DP, t as k0e, ce as nY, cf as sY, cg as oY, ch as A0e, aF as M0e, ci as P0e, cj as $0e, ck as D0e, cl as E0e, b0 as R0e, cm as O0e, cn as L0e, co as F0e, cp as _0e, cq as wn, cr as B0e, cs as _a, R as Tf, a1 as N0e, ct as H0e, cu as V0e, cv as rY, cw as iY, cx as z0e, cy as U0e, cz as G0e, S as W0e} from "./vendor-core.hash-TqyN1mH4.js";
import {C as pt, _ as qt, i as E0, o as aY, a as lY, n as K0e, t as it, f as Ho, K as At, T as k, I as Te, b as je, M as Mo, c as J, s as Ba, d as EP, B as ve, e as $e, z as gt, g as ge, m as vn, u as ti, P as an, A as Ci, h as cY, E as Sa, j as Tr, k as z8, l as q0e, p as Qt, O as Z0e, q as Y0e, r as s4, v as dY, w as X1, x as dd, y as J0e, D as kf, F as U8, G as lg, H as Q0e, J as Y2, L as qp, N as G8, Q as Wb, R as q_, S as yk, U as X0e, V as Z_, W as Y_, X as R0, Y as exe, Z as txe, $ as nxe, a0 as sxe, a1 as oxe, a2 as rxe, a3 as be, a4 as uY, a5 as ixe, a6 as axe, a7 as zt, a8 as hY, a9 as pY, aa as zi, ab as bn, ac as xm, ad as lxe, ae as St, af as Ul, ag as bs, ah as xs, ai as Mr, aj as no, ak as Fc, al as T, am as RP, an as J2, ao as Od, ap as js, aq as cxe, ar as OP, as as Ve, at as ke, au as dxe, av as Xg, aw as mY, ax as Pn, ay as uxe, az as Dv, aA as Uj, aB as al, aC as hxe, aD as pxe, aE as LP, aF as W8, aG as Vo, aH as _n, aI as Ah, aJ as dt, aK as Mh, aL as Ie, aM as sc, aN as st, aO as Wo, aP as fY, aQ as KS, aR as FP, aS as mxe, aT as o4, aU as pe, aV as z, aW as _c, aX as Nx, aY as ll, aZ as fxe, a_ as gY, a$ as Mn, b0 as ut, b1 as _u, b2 as Ut, b3 as oo, b4 as _h, b5 as gxe, b6 as vs, b7 as xY, b8 as Pr, b9 as xxe, ba as e1, bb as ym, bc as Cg, bd as Bc, be as t1, bf as It, bg as ce, bh as _P, bi as Ls, bj as am, bk as qr, bl as me, bm as ue, bn as Kt, bo as ct, bp as pl, bq as Ld, br as Zr, bs as cg, bt as $r, bu as Xt, bv as yxe, bw as Hx, bx as bxe, by as vxe, bz as Gj, bA as Ui, bB as Vn, bC as Ca, bD as Ke, bE as X0, bF as yY, bG as jxe, bH as wxe, bI as qS, bJ as l0, bK as Cxe, bL as Le, bM as BP, bN as mi, bO as XC, bP as zr, bQ as ds, bR as Wj, bS as Ds, bT as $n, bU as Sxe, bV as Si, bW as Vx, bX as Bh, bY as ws, bZ as bY, b_ as Ixe, b$ as ha, c0 as NP, c1 as Fd, c2 as rt, c3 as jt, c4 as Na, c5 as Kj, c6 as ra, c7 as zx, c8 as Lt, c9 as Es, ca as HP, cb as VP, cc as vt, cd as so, ce as Ye, cf as r4, cg as Hm, ch as Dt, ci as ro, cj as Ht, ck as vY, cl as B, cm as zP, cn as Wf, co as gi, cp as i4, cq as Txe, cr as jY, cs as Ha, ct as br, cu as Lo, cv as J_, cw as Ri, cx as Yi, cy as wY, cz as mo, cA as xh, cB as K, cC as W, cD as lm, cE as ZS, cF as CY, cG as Kc, cH as SY, cI as Yr, cJ as Yn, cK as zo, cL as UP, cM as wd, cN as An, cO as Ux, cP as xi, cQ as IY, cR as yi, cS as Nc, cT as la, cU as Xn, cV as TY, cW as So, cX as kn, cY as Hc, cZ as Ra, c_ as Tu, c$ as Oi, d0 as kxe, d1 as Nn, d2 as te, d3 as Is, d4 as YS, d5 as Axe, d6 as Ms, d7 as jr, d8 as GP, d9 as JS, da as tn, db as rl, dc as n1, dd as ex, de as qj, df as QS, dg as Kn, dh as oc, di as Mxe, dj as kY, dk as Li, dl as Ko, dm as Ct, dn as Ts, dp as to, dq as go, dr as Pxe, ds as XS, dt as $xe, du as tt, dv as qc, dw as ni, dx as Zj, dy as dg, dz as hd, dA as tx, dB as ot, dC as Cd, dD as pp, dE as ca, dF as Js, dG as eI, dH as Gl, dI as Po, dJ as Yj, dK as ug, dL as tI, dM as eo, dN as ku, dO as nI, dP as ui, dQ as Uo, dR as sI, dS as Dxe, dT as oI, dU as K8, dV as hg, dW as Exe, dX as AY, dY as Rxe, dZ as Oxe, d_ as Lxe, d$ as rc, e0 as Jj, e1 as Rs, e2 as Ue, e3 as ze, e4 as Fxe, e5 as Jr, e6 as ys, e7 as Fr, e8 as Ev, e9 as rI, ea as Q_, eb as _xe, ec as iI, ed as aI, ee as WP, ef as s1, eg as Vt, eh as Cn, ei as io, ej as Bu, ek as KP, el as Kf, em as MY, en as o1, eo as wr, ep as sr, eq as Cr, er as fn, es as a4, et as Qj, eu as bm, ev as yt, ew as Bxe, ex as Nxe, ey as Hxe, ez as PY, eA as l4, eB as lI, eC as cI, eD as qP, eE as $Y, eF as Vxe, eG as zxe, eH as ZP, eI as DY, eJ as Gx, eK as ml, eL as EY, eM as Xj, eN as Sd, eO as YP, eP as Wx, eQ as da, eR as Kb, eS as O0, eT as lr, eU as fe, eV as ld, eW as du, eX as Uxe, eY as Gxe, eZ as Xs, e_ as _d, e$ as c4, f0 as X_, f1 as bk, f2 as bc, f3 as og, f4 as Aa, f5 as d4, f6 as nx, f7 as fi, f8 as u4, f9 as eB, fa as pa, fb as Ja, fc as wl, fd as Fo, fe as On, ff as Wxe, fg as tB, fh as di, fi as fr, fj as Kxe, fk as xt, fl as RY, fm as OY, fn as LY, fo as h4, fp as Sg, fq as us, fr as Io, fs as qxe, ft as dI, fu as yn, fv as nB, fw as sx, fx as Zxe, fy as zs, fz as Yxe, fA as uI, fB as Jxe, fC as Ig, fD as FY, fE as xo, fF as Zc, fG as dh, fH as _Y, fI as tr, fJ as BY, fK as Nh, fL as p4, fM as Qo, fN as q8, fO as JP, fP as ia, fQ as ew, fR as $l, fS as ka, fT as ox, fU as QP, fV as Rv, fW as rx, fX as Tg, fY as vm, fZ as ma, f_ as Kx, f$ as Qxe, g0 as Xxe, g1 as Vm, g2 as XP, g3 as Z8, g4 as wo, g5 as sB, g6 as Ua, g7 as Al, g8 as vr, g9 as hI, ga as eye, gb as r1, gc as NY, gd as zm, ge as gs, gf as ix, gg as Y8, gh as Ch, gi as m4, gj as jm, gk as J8, gl as Id, gm as f4, gn as e$, go as g4, gp as t$, gq as HY, gr as n$, gs as VY, gt as qf, gu as tye, gv as Q8, gw as zY, gx as Au, gy as tw, gz as s$, gA as o$, gB as nye, gC as oB, gD as r$, gE as sye, gF as i$, gG as oye, gH as rye, gI as UY, gJ as vk, gK as nw, gL as GY, gM as X8, gN as iye, gO as aye, gP as lye, gQ as a$, gR as Hh, gS as l$, gT as c$, gU as cye, gV as $c, gW as wm, gX as dye, gY as WY, gZ as KY, g_ as Um, g$ as sw, h0 as kr, h1 as es, h2 as uye, h3 as hye, h4 as pye, h5 as pI, h6 as jk, h7 as Gp, h8 as qY, h9 as d$, ha as Bd, hb as Q2, hc as qo, hd as mI, he as i1, hf as mye, hg as u$, hh as Wl, hi as fI, hj as fye, hk as rB, hl as gI, hm as xI, hn as yI, ho as gye, hp as Nu, hq as Kl, hr as Cl, hs as Ph, ht as h$, hu as p$, hv as xye, hw as ho, hx as ZY, hy as iB, hz as yye, hA as bye, hB as m$, hC as vye, hD as Zp, hE as f$, hF as tl, hG as jye, hH as Cm, hI as bI, hJ as wye, hK as Cye, hL as Vh, hM as g$, hN as Ll, hO as Sye, hP as vI, hQ as wk, hR as Iye, hS as Tye, hT as YY, hU as kye, hV as Aye, hW as Mye, hX as ow, hY as rw, hZ as Pye, h_ as x4, h$ as si, i0 as Gm, i1 as $ye, i2 as JY, i3 as yu, i4 as x$, i5 as jI, i6 as QY, i7 as y$, i8 as Dye, i9 as cr, ia as a1, ib as XY, ic as eJ, id as ks, ie as Eye, ig as Fi, ih as cl, ii as wI, ij as tJ, ik as Rye, il as Oye, im as kg, io as qb, ip as Lye, iq as aB, ir as nJ, is as sJ, it as oJ, iu as rJ, iv as CI, iw as b$, ix as Fye, iy as e9, iz as v$, iA as SI, iB as _ye, iC as X2, iD as j$, iE as Bye, iF as L0, iG as eC, iH as ax, iI as ql, iJ as y4, iK as w$, iL as Ov, iM as iJ, iN as Lv, iO as l1, iP as Sm, iQ as zh, iR as Nye, iS as Sh, iT as C$, iU as II, iV as TI, iW as S$, iX as lx, iY as Hye, iZ as Uh, i_ as Vye, i$ as lB, j0 as zye, j1 as aJ, j2 as qx, j3 as I$, j4 as cB, j5 as Uye, j6 as Gye, j7 as Wye, j8 as Kye, j9 as T$, ja as lJ, jb as qye, jc as Zye, jd as Yye, je as Jye, jf as cJ, jg as Qye, jh as Xye, ji as k$, jj as dJ, jk as c1, jl as b4, jm as uJ, jn as kI, jo as Zx, jp as hJ, jq as pJ, jr as cx, js as Fv, jt as ao, ju as ebe, jv as wb, jw as tbe, jx as mJ, jy as nbe, jz as A$, jA as sbe, jB as mp, jC as fJ, jD as dB, jE as uB, jF as hB, jG as obe, jH as pB, jI as v4, jJ as j4, jK as M$, jL as iw, jM as t9, jN as rd, jO as e5, jP as P$, jQ as Wm, jR as AI, jS as mB, jT as rbe, jU as $$, jV as ibe, jW as abe, jX as fB, jY as lbe, jZ as cbe, j_ as dbe, j$ as D$, k0 as ube, k1 as hbe, k2 as pbe, k3 as gB, k4 as mbe, k5 as fbe, k6 as gbe, k7 as xbe, k8 as E$, k9 as Gh, ka as Im, kb as dx, kc as ybe, kd as bbe, ke as R$, kf as pg, kg as MI, kh as _v, ki as z1, kj as Ag, kk as aw, kl as vbe, km as jbe, kn as gJ, ko as Zt, kp as d1, kq as O$, kr as Va, ks as Us, kt as cm, ku as ir, kv as PI, kw as wbe, kx as Cbe, ky as Mg, kz as Sbe, kA as Ck, kB as xJ, kC as xB, kD as yB, kE as Ibe, kF as $I, kG as Af, kH as yJ, kI as Tbe, kJ as kbe, kK as Abe, kL as Mbe, kM as Pbe, kN as bB, kO as lw, kP as $be, kQ as n9, kR as bJ, kS as vJ, kT as jJ, kU as wJ, kV as Hu, kW as CJ, kX as Dbe, kY as Ebe, kZ as Rbe, k_ as SJ, k$ as IJ, l0 as Obe, l1 as Lbe, l2 as Fbe, l3 as _be, l4 as Bbe, l5 as Nbe, l6 as Hbe, l7 as Vbe, l8 as zbe, l9 as Ube, la as TJ, lb as Gbe, lc as kJ, ld as Zb, le as vB, lf as Wbe, lg as Kbe, lh as w4, li as qbe, lj as Zbe, lk as s9, ll as Ybe, lm as Jbe, ln as Bv, lo as C4, lp as Qbe, lq as Xbe, lr as jB, ls as Sk, lt as eve, lu as c0, lv as tve, lw as nve, lx as wB, ly as AJ, lz as sve, lA as u1, lB as Ik, lC as MJ, lD as yh, lE as PJ, lF as ove, lG as rve, lH as $J, lI as Nv, lJ as DJ, lK as ive, lL as ave, lM as lve, lN as cve, lO as dve, lP as uve, lQ as hve, lR as Yb, lS as CB, lT as pve, lU as mve, lV as L$, lW as fve, lX as gve, lY as SB, lZ as IB, l_ as TB, l$ as kB, m0 as AB, m1 as ou, m2 as xve, m3 as EJ, m4 as Yx, m5 as yve, m6 as bve, m7 as MB, m8 as vve, m9 as jve, ma as wve, mb as Cve, mc as PB, md as Sve, me as Ive, mf as Tve, mg as kve, mh as Ave, mi as Mve, mj as tC, mk as Pve, ml as $i, mm as $ve, mn as Dve, mo as Eve, mp as Rve, mq as Ove, mr as Lve, ms as Fve, mt as _ve, mu as Bve, mv as Nve, mw as Hve, mx as Vve, my as Ji, mz as zve, mA as F$, mB as Uve, mC as U1, mD as S4, mE as t5, mF as Zf, mG as Gve, mH as Wve, mI as o9, mJ as Kve, mK as qve, mL as Zve, mM as Yve, mN as $B, mO as Pg, mP as Jve, mQ as RJ, mR as Qve, mS as _$, mT as Hv, mU as OJ, mV as Xve, mW as Ae, mX as Il, mY as eje, mZ as tje, m_ as nje, m$ as I4, n0 as DB, n1 as sje, n2 as n5, n3 as oje, n4 as LJ, n5 as r9, n6 as EB, n7 as rje, n8 as ije, n9 as nC, na as aje, nb as RB, nc as OB, nd as LB, ne as FB, nf as _B, ng as BB, nh as lje, ni as NB, nj as cje, nk as dje, nl as FJ, nm as uje, nn as Wy, no as hje, np as pje, nq as mje, nr as fje, ns as HB, nt as gje, nu as xje} from "./html.hash-p99cR5n6.js";
import {r as hn, n as Zn, X as yje, m as _J, P as bje, e as BJ, O as vje, i as NJ, s as Km, Q as jje, R as wje, S as Cje, T as Sje, U as Ije, V as Tje, c as kje, t as B$, u as Ys, Y as VB, o as _o, Z as HJ, $ as Zd, a0 as zB, a1 as UB, F as Vv, f as DI, a2 as Aje, l as Mje, b as Pje, a3 as $je, d as Dje, a4 as VJ, I as zJ, a5 as Eje, x as UJ, K as Rje} from "./nivo.hash-3DLvEEek.js";
import {T as Ws, e as Fl, C as jc, I as Oje, f as i9, g as Lje, F as gr, R as EI, d as Wh, h as GJ, l as Fje, i as _je, P as Yc, c as Dr, j as N$, k as a9, m as ux, D as Tm, n as Mu, o as Qd, p as Bje, q as GB, r as Tk, s as sC, u as Nje, v as WB, w as Hje, x as G1, y as WJ, z as Vje, A as zje, B as Uje, E as Gje, G as Wje, H as Kje, J as qje, K as h1, S as Zje, L as Yje, O as Jje, Q as KB, U as KJ, V as qJ, W as Qje, X as Xje, Y as ZJ, Z as ewe, _ as twe, $ as nwe, a0 as RI, a1 as swe, a2 as owe} from "./prosemirror.hash-DzHTrBWt.js";
const YJ = "abcdefghijkmnpqrstuvwxyz23456789"
  , TFt = new RegExp(`^[${YJ}]+$`)
  , rwe = pt.protectedLoadable(()=>qt(()=>import("./Arcade.hash-odnZyqiI.js"), __vite__mapDeps([0, 1, 2, 3, 4]), import.meta.url), {
    preloadOrder: "skip",
    resolveComponent: e=>e.ArcadeShouldBeLazyLoaded
})
  , iwe = pt.protectedLoadable(()=>qt(()=>import("./EditorComponent.hash--0pjcv_e.js"), __vite__mapDeps([5, 1, 4, 2, 3, 6, 7, 8, 9]), import.meta.url), {
    preloadOrder: 30,
    loadAtStartupForPath: [{
        path: "/:org/(issue|document)/*"
    }, {
        path: "/:org/(project|initiative)/:slug",
        exact: !0
    }, {
        path: "/:org/(project|initiative)/:slug/overview"
    }],
    resolveComponent: e=>e.EditorShouldBeLazyLoaded
})
  , JJ = pt.protectedLoadable(()=>qt(()=>import("./FastIssueCreateEditor.hash-vCaYbbVj.js"), __vite__mapDeps([10, 1, 2, 3, 4]), import.meta.url).then(e=>e.FastIssueCreateEditorShouldBeLazyLoaded), {
    preloadOrder: 10,
    resolveComponent: e=>e
})
  , awe = pt.protectedLoadable(()=>qt(()=>import("./FastTriageAcceptEditor.hash-vtoiTU-6.js"), __vite__mapDeps([11, 1, 3, 2, 4]), import.meta.url), {
    preloadOrder: 20,
    resolveComponent: e=>e.FastTriageAcceptEditorShouldBeLazyLoaded
});
function OI() {
    return qt(()=>import("./graphs.hash-vKCkiCxm.js"), __vite__mapDeps([12, 1, 3, 2, 4, 13]), import.meta.url)
}
const lwe = pt.protectedLoadable(OI, {
    preloadOrder: 51,
    resolveComponent: e=>e.ProjectMiniGraphShouldBeLazyLoaded
})
  , cwe = pt.protectedLoadable(OI, {
    preloadOrder: 53,
    loadAtStartupForPath: "/:org/team/:teamId/(cycles|cycle)",
    resolveComponent: e=>e.BurnUpGraphShouldBeLazyLoaded
})
  , dwe = pt.protectedLoadable(OI, {
    preloadOrder: 53,
    loadAtStartupForPath: "/:org/(project|roadmap|team/:teamId/projects)",
    resolveComponent: e=>e.BurnUpGraphShouldBeLazyLoaded
})
  , kFt = pt.protectedLoadable(OI, {
    preloadOrder: 53,
    loadAtStartupForPath: "/:org/(roadmap|initiative)",
    resolveComponent: e=>e.ProjectBubbleGraphShouldBeLazyLoaded
})
  , uwe = pt.protectedLoadable(()=>qt(()=>import("./ProjectUpdatesEmptyIcon.hash-PeK817io.js"), __vite__mapDeps([14, 1]), import.meta.url), {
    preloadOrder: "last",
    resolveComponent: e=>e.ProjectUpdatesEmptyIconShouldBeLazyLoaded
})
  , hwe = pt.protectedLoadable(()=>qt(()=>import("./InlineCommentsEmptyIcon.hash-LIu0LLF8.js"), __vite__mapDeps([15, 1]), import.meta.url), {
    preloadOrder: "last",
    resolveComponent: e=>e.InlineCommentsEmptyIcon
})
  , pwe = pt.protectedLoadable(()=>qt(()=>import("./IssueCommentsAndHistory.hash-Vpip1D-C.js"), __vite__mapDeps([16, 1, 2, 3, 4]), import.meta.url), {
    loadAtStartupForPath: "/:org/issue/*",
    preloadOrder: 30,
    resolveComponent: e=>e.IssueCommentsAndHistoryShouldBeLazyLoaded
})
  , Mf = pt.protectedLoadable(()=>qt(()=>import("./Inbox.hash-l8pjDoeL.js"), __vite__mapDeps([17, 1, 3, 2, 4, 18, 19, 20, 21, 22, 23, 24, 8, 25, 26, 27]), import.meta.url), {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/inbox",
    resolveComponent: e=>e.InboxShouldBeLazyLoaded
})
  , mwe = pt.protectedLoadable(()=>qt(()=>import("./MyIssuesPage.hash-SxjkphuB.js"), __vite__mapDeps([28, 1, 2, 3, 4, 29]), import.meta.url), {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/my-issues/*",
    resolveComponent: e=>e.MyIssuesPageShouldBeLazyLoaded
})
  , fwe = pt.protectedLoadable(()=>qt(()=>import("./DraftsPage.hash-_loZiXCF.js"), __vite__mapDeps([30, 1, 3, 2, 4]), import.meta.url), {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/drafts",
    resolveComponent: e=>e.DraftsPageShouldBeLazyLoaded
})
  , gwe = pt.protectedLoadable(()=>qt(()=>import("./OAuthAuthorizeView.hash-LLKI2XLg.js").then(e=>e.b), __vite__mapDeps([27, 1, 2, 3, 4]), import.meta.url), {
    preloadOrder: "skip",
    resolveComponent: e=>e.OAuthAuthorizeViewShouldBeLazyLoaded
})
  , xwe = pt.protectedLoadable(()=>qt(()=>import("./MobileAuthView.hash-RQ9bhvYn.js"), __vite__mapDeps([31, 1, 2, 3, 4]), import.meta.url), {
    preloadOrder: "skip",
    resolveComponent: e=>e.MobileAuthViewShouldBeLazyLoaded
})
  , qB = pt.protectedLoadable(()=>qt(()=>import("./TriagePage.hash-PlO5Zp11.js"), __vite__mapDeps([32, 1, 2, 3, 4, 18, 29, 25, 19, 21, 22]), import.meta.url), {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/team/:team/triage",
    resolveComponent: e=>e.TriagePageShouldBeLazyLoaded
})
  , ywe = pt.protectedLoadable(()=>qt(()=>import("./TeamsPage.hash-ScqsWBwv.js"), __vite__mapDeps([33, 1, 2, 3, 4]), import.meta.url), {
    preloadOrder: 300,
    loadAtStartupForPath: "/:org/teams",
    resolveComponent: e=>e.TeamsPageShouldBeLazyLoaded
})
  , bwe = pt.protectedLoadable(()=>qt(()=>import("./ProjectEmptyPage.hash-efE0ldTh.js"), __vite__mapDeps([34, 1, 2, 3, 4]), import.meta.url), {
    preloadOrder: "last",
    resolveComponent: e=>e.ProjectEmptyPageShouldBeLazyLoaded
})
  , LI = ()=>qt(()=>import("./LazyProjectPages.hash-9qPZnYyi.js"), __vite__mapDeps([35, 1, 2, 3, 4, 36, 18, 37]), import.meta.url)
  , FI = ()=>qt(()=>import("./LazyProjectsPages.hash-JBo3HFdm.js"), __vite__mapDeps([38, 1, 2, 3, 4, 36, 37, 39]), import.meta.url)
  , ZB = pt.protectedLoadable(FI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(roadmap|projects)/*",
    resolveComponent: e=>e.AllProjectsPageShouldBeLazyLoaded
})
  , YB = pt.protectedLoadable(FI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(roadmap|projects)/*",
    resolveComponent: e=>e.NewProjectsPageFacetPageShouldBeLazyLoaded
})
  , JB = pt.protectedLoadable(FI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(roadmap|projects)/*",
    resolveComponent: e=>e.EditProjectsPageFacetPageShouldBeLazyLoaded
})
  , QB = pt.protectedLoadable(FI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(roadmap|projects)/*",
    resolveComponent: e=>e.ProjectsPageFacetPageShouldBeLazyLoaded
})
  , vwe = pt.protectedLoadable(LI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(roadmap|projects)/*",
    resolveComponent: e=>e.ProjectsPageShouldBeLazyLoaded
})
  , QJ = pt.protectedLoadable(LI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(initiatives|initiative)/*",
    resolveComponent: e=>e.InitiativesPageShouldBeLazyLoaded
})
  , jwe = pt.protectedLoadable(LI, {
    preloadOrder: 200,
    resolveComponent: e=>e.CustomRoadmapPageShouldBeLazyLoaded
})
  , p1 = ()=>qt(()=>import("./LazyInitiativePages.hash--3rIiusz.js"), __vite__mapDeps([40, 24, 1, 2, 3, 4, 21, 22, 36, 39]), import.meta.url)
  , wwe = pt.protectedLoadable(p1, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeOverviewPageShouldBeLazyLoaded
})
  , Cwe = pt.protectedLoadable(p1, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeOverviewSplitViewShouldBeLazyLoaded
})
  , Swe = pt.protectedLoadable(p1, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeProjectsPageShouldBeLazyLoaded
})
  , Iwe = pt.protectedLoadable(p1, {
    preloadOrder: 300,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeFacetPageShouldBeLazyLoaded
})
  , Twe = pt.protectedLoadable(p1, {
    preloadOrder: 300,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeNewFacetPageShouldBeLazyLoaded
})
  , kwe = pt.protectedLoadable(p1, {
    preloadOrder: 300,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeEditFacetPageShouldBeLazyLoaded
});
pt.protectedLoadable(p1, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/(initiative/initiatives)/*",
    resolveComponent: e=>e.InitiativeProjectsSplitViewShouldBeLazyLoaded
});
const Awe = pt.protectedLoadable(LI, {
    preloadOrder: 200,
    loadAtStartupForPath: "/:org/team/:team/projects/*",
    resolveComponent: e=>e.TeamProjectsPageShouldBeLazyLoaded
})
  , Mwe = ()=>qt(()=>import("./SplitSearch.hash-u66NWxhg.js"), __vite__mapDeps([41, 1, 2, 3, 4, 9, 18, 19, 21, 22, 20, 23]), import.meta.url)
  , s5 = pt.protectedLoadable(Mwe, {
    preloadOrder: 200,
    resolveComponent: e=>e.SplitSearchShouldBeLazyLoaded
})
  , Pwe = pt.protectedLoadable(()=>qt(()=>import("./HelpCenter.hash-aWZL_lsX.js"), __vite__mapDeps([42, 1, 2, 3, 4, 22, 43]), import.meta.url), {
    preloadOrder: 200,
    resolveComponent: e=>e.HelpCenterShouldBeLazyLoaded
})
  , $we = pt.protectedLoadable(()=>qt(()=>import("./Settings.hash-tYXnlx1l.js"), __vite__mapDeps([44, 1, 2, 3, 4, 45, 7, 27, 46, 47, 48, 26, 43, 22]), import.meta.url), {
    preloadOrder: 300,
    loadAtStartupForPath: "/:org/settings",
    resolveComponent: e=>e.SettingsShouldBeLazyLoaded
});
function XJ() {
    var e = f.useRef(!0);
    return e.current ? (e.current = !1,
    !0) : e.current
}
var Dwe = function(e, t) {
    var n = XJ();
    f.useEffect(function() {
        if (!n)
            return e()
    }, t)
};
const Vu = Dwe;
var Ewe = function(e) {
    return (e + 1) % 1e6
};
function Rwe() {
    var e = f.useReducer(Ewe, 0)
      , t = e[1];
    return t
}
var Owe = E0 ? f.useLayoutEffect : f.useEffect;
const Lwe = Owe;
function H$(e, t) {
    t === void 0 && (t = 0);
    var n = f.useRef(!1)
      , o = f.useRef()
      , r = f.useRef(e)
      , i = f.useCallback(function() {
        return n.current
    }, [])
      , a = f.useCallback(function() {
        n.current = !1,
        o.current && clearTimeout(o.current),
        o.current = setTimeout(function() {
            n.current = !0,
            r.current()
        }, t)
    }, [t])
      , l = f.useCallback(function() {
        n.current = null,
        o.current && clearTimeout(o.current)
    }, []);
    return f.useEffect(function() {
        r.current = e
    }, [e]),
    f.useEffect(function() {
        return a(),
        l
    }, [t]),
    [i, l, a]
}
function l9(e, t, n) {
    t === void 0 && (t = 0),
    n === void 0 && (n = []);
    var o = H$(e, t)
      , r = o[0]
      , i = o[1]
      , a = o[2];
    return f.useEffect(a, n),
    [r, i]
}
var Fwe = function(e) {
    f.useEffect(e, [])
};
const eQ = Fwe;
var _we = E0 ? window : null
  , XB = function(e) {
    return !!e.addEventListener
}
  , eN = function(e) {
    return !!e.on
}
  , Bwe = function(e, t, n, o) {
    n === void 0 && (n = _we),
    f.useEffect(function() {
        if (t && n)
            return XB(n) ? aY(n, e, t, o) : eN(n) && n.on(e, t, o),
            function() {
                XB(n) ? lY(n, e, t, o) : eN(n) && n.off(e, t, o)
            }
    }, [e, t, n, JSON.stringify(o)])
};
const tN = Bwe;
var Nwe = function(e) {
    eQ(function() {
        e()
    })
};
const tQ = Nwe;
var Hwe = function(e) {
    var t = f.useRef(e);
    t.current = e,
    eQ(function() {
        return function() {
            return t.current()
        }
    })
};
const Vwe = Hwe;
var zwe = function(e) {
    var t = f.useRef(0)
      , n = f.useState(e)
      , o = n[0]
      , r = n[1]
      , i = f.useCallback(function(a) {
        cancelAnimationFrame(t.current),
        t.current = requestAnimationFrame(function() {
            r(a)
        })
    }, []);
    return Vwe(function() {
        cancelAnimationFrame(t.current)
    }),
    [o, i]
};
const Uwe = zwe;
var Gwe = function(e, t) {
    return e === t
};
function Wwe(e, t) {
    t === void 0 && (t = Gwe);
    var n = f.useRef()
      , o = f.useRef(e)
      , r = XJ();
    return !r && !t(o.current, e) && (n.current = o.current,
    o.current = e),
    n.current
}
function T4(e) {
    e === void 0 && (e = 0);
    var t = Rwe();
    return H$(t, e)
}
var Kwe = function(e, t) {
    e === void 0 && (e = 1 / 0),
    t === void 0 && (t = 1 / 0);
    var n = Uwe({
        width: E0 ? window.innerWidth : e,
        height: E0 ? window.innerHeight : t
    })
      , o = n[0]
      , r = n[1];
    return f.useEffect(function() {
        if (E0) {
            var i = function() {
                r({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            };
            return aY(window, "resize", i),
            function() {
                lY(window, "resize", i)
            }
        }
    }, []),
    o
};
const fp = Kwe;
var nQ = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
};
function qwe() {
    var e = f.useState(null)
      , t = e[0]
      , n = e[1]
      , o = f.useState(nQ)
      , r = o[0]
      , i = o[1]
      , a = f.useMemo(function() {
        return new window.ResizeObserver(function(l) {
            if (l[0]) {
                var c = l[0].contentRect
                  , d = c.x
                  , u = c.y
                  , h = c.width
                  , p = c.height
                  , m = c.top
                  , g = c.left
                  , x = c.bottom
                  , b = c.right;
                i({
                    x: d,
                    y: u,
                    width: h,
                    height: p,
                    top: m,
                    left: g,
                    bottom: x,
                    right: b
                })
            }
        }
        )
    }, []);
    return Lwe(function() {
        if (t)
            return a.observe(t),
            function() {
                a.disconnect()
            }
    }, [t]),
    [n, r]
}
const _I = E0 && typeof window.ResizeObserver < "u" ? qwe : function() {
    return [K0e, nQ]
}
;
function sQ(e, t, n=1) {
    e.forEach((o,r)=>{
        const i = n + r;
        o.childCount !== 0 && sQ(o.content, t, i + 1),
        t(o, i)
    }
    )
}
function Zwe(e, t) {
    const n = []
      , o = [];
    return sQ(e.content, (r,i)=>{
        r.type === t && (n.push(r),
        o.push(i))
    }
    ),
    [n, o]
}
const oQ = (e,t,n)=>e.selection.empty ? (n == null || n.dom.blur(),
!!n) : (t && t(e.tr.setSelection(Ws.create(e.tr.doc, e.tr.selection.to))),
!0);
function rQ(e, t, n) {
    const o = [];
    if (!Array.isArray(e.content))
        return o;
    for (let r = 0, i = e.content.length; r < i; ++r) {
        const a = e.content[r];
        t(a) && o.push(a),
        n != null && n.deep && o.push(...rQ(a, t, n))
    }
    return o
}
function BI(e, t, n, o, r) {
    let i = [];
    return n.doc.nodesBetween(e, t, (a,l)=>{
        i = [...i, ...a.marks.filter(c=>o && c.type !== o ? !1 : r ? r(c.attrs) : !0).map(c=>({
            start: l,
            end: l + a.nodeSize,
            mark: c,
            text: a.textContent
        }))]
    }
    ),
    i
}
const nN = (e,t)=>{
    const {from: n, to: o} = e.selection;
    let r = [];
    e.doc.nodesBetween(n, o, a=>{
        r = [...r, ...a.marks]
    }
    );
    const i = r.find(a=>a.type.name === t.name);
    return i ? i.attrs : {}
}
  , Ywe = e=>e.childCount <= 1 && e.content.size <= 2 && e.textContent === ""
  , Jwe = (e,t)=>{
    const {from: n, $from: o, to: r, empty: i} = e.selection;
    return i ? !!t.isInSet(e.storedMarks || o.marks()) : !!e.doc.rangeHasMark(n, r, t)
}
  , Qwe = (e,t)=>{
    const n = Object.keys(t);
    return n.length ? n.every(o=>t[o] === e[o]) : !0
}
  , iQ = (e,t,n={})=>{
    const {from: o, to: r, empty: i} = e.selection
      , a = [];
    e.doc.nodesBetween(o, r, (u,h)=>{
        if (u.isText)
            return;
        const p = Math.max(o, h)
          , m = Math.min(r, h + u.nodeSize);
        a.push({
            node: u,
            from: p,
            to: m
        })
    }
    );
    const l = r - o
      , c = a.filter(u=>t ? t.name === u.node.type.name : !0).filter(u=>Qwe(u.node.attrs, n));
    return i ? !!c.length : c.reduce((u,h)=>u + h.to - h.from, 0) >= l
}
;
function cw(e) {
    if (e.type !== "doc")
        return !1;
    if (e.content.length === 1) {
        const t = e.content[0];
        return t.type === "paragraph" && (t.content == null || t.content.length === 0)
    }
    return e.content.length === 0
}
function bu(e) {
    if (e.type !== "doc")
        return e;
    const t = [...e.content];
    if (t.length > 0) {
        for (; t.length > 0 && sN(t[0]); )
            t.shift();
        for (; t.length > 0 && sN(t[t.length - 1]); )
            t.pop()
    }
    return {
        ...e,
        content: t
    }
}
function sN(e) {
    return !!(e.type === "paragraph" && (!e.content || e.content.length === 1 && e.content[0].type === "text" && /^\s*$/.test(e.content[0].text)))
}
function Xwe(e) {
    const t = e.getMeta("y-sync$");
    return t !== void 0 && !t.isUndoRedoOperation
}
function uu(e) {
    return c9(e == null ? void 0 : e.type)
}
function c9(e) {
    return e ? ["bullet_list", "ordered_list", "todo_list"].includes(e.name) : !1
}
function NI(e) {
    return e ? ["list_item", "todo_item"].includes(e.type.name) : !1
}
function k4(e, t, n=!1) {
    const o = t ?? e.state.selection;
    let {from: r, to: i} = o;
    const a = Fl.atStart(e.state.doc).from
      , l = Fl.atEnd(e.state.doc).to;
    if (r < a && i > l && (r = a,
    i = l),
    o instanceof jc) {
        const v = o.$anchorCell.pos
          , j = o.$headCell.pos;
        r = Math.min(j, v),
        i = Math.max(j, v)
    }
    const c = e.coordsAtPos(r)
      , d = e.coordsAtPos(i, -1)
      , u = Math.min(c.top, d.top)
      , h = n ? u - e.dom.getBoundingClientRect().top : u
      , p = Math.max(c.bottom, d.bottom)
      , m = Math.min(c.left, d.left)
      , g = Math.max(c.right, d.right)
      , x = p - u
      , b = g - m;
    return new DOMRectReadOnly(m,h,b,x)
}
function e2e(e, t) {
    const {$from: n} = e.selection;
    let o = n.nodeBefore
      , r = n.depth;
    for (; r > 0 && !o; )
        o = e.doc.resolve(n.before(r)).nodeBefore,
        r--;
    return o ? t(o) : !1
}
const t2e = {
    disallowMentionsInContent: !1,
    disallowHardBreaks: !1
}
  , n2e = (e,t,n={})=>new Oje(e,(o,r,i,a)=>{
    const {tr: l} = o
      , c = r[0]
      , {disallowMentionsInContent: d, disallowHardBreaks: u} = {
        ...t2e,
        ...n
    }
      , h = r[r.length - 1]
      , p = r[Math.max(0, r.length - 2)];
    let m = a
      , g = i;
    if (h) {
        const x = g + c.lastIndexOf(p)
          , b = g + c.lastIndexOf(h)
          , v = b + h.length;
        if (BI(i, a, o).filter(S=>S.mark.type.excludes(t)).filter(S=>S.end > x).length)
            return null;
        let w = !1;
        if (l.doc.nodesBetween(i, a, S=>{
            S.type.name === "hard_break" && (w = !0)
        }
        ),
        u && w)
            return null;
        v < m && l.delete(v, m),
        b > x && l.delete(x, b),
        g = x,
        m = g + h.length
    }
    return d && aQ(g, m, o) ? null : (l.addMark(g, m, t.create()),
    l.removeStoredMark(t),
    l)
}
)
  , A4 = e=>e.type.name.toLowerCase().includes("mention")
  , aQ = (e,t,n)=>{
    let o = !1;
    return n.doc.nodesBetween(e, t, r=>{
        A4(r) && (o = !0)
    }
    ),
    o
}
;
function AFt(e, t=null) {
    return function(n, o) {
        let {$from: r, $to: i} = n.selection
          , a = r.blockRange(i)
          , l = !1
          , c = a;
        if (!a)
            return !1;
        if (a.depth >= 2 && r.node(a.depth - 1).type.compatibleContent(e) && a.startIndex == 0) {
            if (r.index(a.depth - 1) == 0)
                return !1;
            let u = n.doc.resolve(a.start - 2);
            c = new i9(u,u,a.depth),
            a.endIndex < a.parent.childCount && (a = new i9(r,n.doc.resolve(i.end(a.depth)),a.depth)),
            l = !0
        }
        let d = Lje(c, e, t, a);
        return d ? (o && o(s2e(n.tr, a, d, l, e).scrollIntoView()),
        !0) : !1
    }
}
function s2e(e, t, n, o, r) {
    let i = gr.empty;
    for (let u = n.length - 1; u >= 0; u--)
        i = gr.from(n[u].type.create(n[u].attrs, i));
    e.step(new EI(t.start - (o ? 2 : 0),t.end,t.start,t.end,new Wh(i,0,0),n.length,!0));
    let a = 0;
    for (let u = 0; u < n.length; u++)
        n[u].type == r && (a = u + 1);
    let l = n.length - a
      , c = t.start + n.length - (o ? 2 : 0)
      , d = t.parent;
    for (let u = t.startIndex, h = t.endIndex, p = !0; u < h; u++,
    p = !1)
        !p && GJ(e.doc, c, l) && (e.split(c, l),
        c += 2 * l),
        c += d.child(u).nodeSize;
    return e
}
function MFt(e, t) {
    return function(n, o) {
        let {$from: r, $to: i, node: a} = n.selection;
        if (a && a.isBlock || r.depth < 2 || !r.sameParent(i))
            return !1;
        let l = r.node(-1);
        if (l.type != e)
            return !1;
        if (r.parent.content.size == 0 && r.node(-1).childCount == r.indexAfter(-1)) {
            if (r.depth == 3 || r.node(-3).type != e || r.index(-2) != r.node(-2).childCount - 1)
                return !1;
            if (o) {
                let h = gr.empty
                  , p = r.index(-1) ? 1 : r.index(-2) ? 2 : 3;
                for (let v = r.depth - p; v >= r.depth - 3; v--)
                    h = gr.from(r.node(v).copy(h));
                let m = r.indexAfter(-1) < r.node(-2).childCount ? 1 : r.indexAfter(-2) < r.node(-3).childCount ? 2 : 3;
                h = h.append(gr.from(e.createAndFill()));
                let g = r.before(r.depth - (p - 1))
                  , x = n.tr.replace(g, r.after(-m), new Wh(h,4 - p,0))
                  , b = -1;
                x.doc.nodesBetween(g, x.doc.content.size, (v,j)=>{
                    if (b > -1)
                        return !1;
                    v.isTextblock && v.content.size == 0 && (b = j + 1)
                }
                ),
                b > -1 && x.setSelection(Fl.near(x.doc.resolve(b))),
                o(x.scrollIntoView())
            }
            return !0
        }
        let c = i.pos == r.end() ? l.contentMatchAt(0).defaultType : null
          , d = n.tr.delete(r.pos, i.pos)
          , u = c ? [t ? {
            type: e,
            attrs: t
        } : null, {
            type: c
        }] : void 0;
        return GJ(d.doc, r.pos, 2, u) ? (o && o(d.split(r.pos, 2, u).scrollIntoView()),
        !0) : !1
    }
}
function o2e(e) {
    return function(t, n) {
        let {$from: o, $to: r} = t.selection
          , i = o.blockRange(r, a=>a.childCount > 0 && a.firstChild.type == e);
        return i ? n ? o.node(i.depth - 1).type == e ? r2e(t, n, e, i) : i2e(t, n, i) : !0 : !1
    }
}
function r2e(e, t, n, o) {
    let r = e.tr
      , i = o.end
      , a = o.$to.end(o.depth);
    i < a && (r.step(new EI(i - 1,a,i,a,new Wh(gr.from(n.create(null, o.parent.copy())),1,0),1,!0)),
    o = new i9(r.doc.resolve(o.$from.pos),r.doc.resolve(a),o.depth));
    const l = Fje(o);
    if (l == null)
        return !1;
    r.lift(o, l);
    let c = r.mapping.map(i, -1) - 1;
    return _je(r.doc, c) && r.join(c),
    t(r.scrollIntoView()),
    !0
}
function i2e(e, t, n) {
    let o = e.tr
      , r = n.parent;
    for (let m = n.end, g = n.endIndex - 1, x = n.startIndex; g > x; g--)
        m -= r.child(g).nodeSize,
        o.delete(m - 1, m + 1);
    let i = o.doc.resolve(n.start)
      , a = i.nodeAfter;
    if (o.mapping.map(n.end) != n.start + i.nodeAfter.nodeSize)
        return !1;
    let l = n.startIndex == 0
      , c = n.endIndex == r.childCount
      , d = i.node(-1)
      , u = i.index(-1);
    if (!d.canReplace(u + (l ? 0 : 1), u + 1, a.content.append(c ? gr.empty : gr.from(r))))
        return !1;
    let h = i.pos
      , p = h + a.nodeSize;
    return o.step(new EI(h - (l ? 1 : 0),p + (c ? 1 : 0),h + 1,p - 1,new Wh((l ? gr.empty : gr.from(r.copy(gr.empty))).append(c ? gr.empty : gr.from(r.copy(gr.empty))),l ? 0 : 1,c ? 0 : 1),l ? 0 : 1)),
    t(o.scrollIntoView()),
    !0
}
function PFt(e) {
    return function(t, n) {
        let {$from: o, $to: r} = t.selection
          , i = o.blockRange(r, d=>d.childCount > 0 && d.firstChild.type == e);
        if (!i)
            return !1;
        let a = i.startIndex;
        if (a == 0)
            return !1;
        let l = i.parent
          , c = l.child(a - 1);
        if (c.type != e)
            return !1;
        if (n) {
            let d = c.lastChild && c.lastChild.type == l.ty