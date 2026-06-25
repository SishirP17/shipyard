"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePanda } from "./panda-context";

/* -------------------------------------------------------------------------- *
 * Scaredy Panda — a shy, chubby creature that lives in the corner.
 *   • Single click → he panics and moves to an adjacent corner. Horizontal runs
 *     are a four-legged gallop; vertical runs sprout a bamboo tree that he hugs
 *     and climbs hand-over-hand (it vanishes once he arrives). Never diagonal.
 *       – climbing UP   → arm-driven (hands haul him up)
 *       – climbing DOWN → leg-driven (feet lower him down)
 *   • Double click → Easter egg: he balloons up, dances in the middle of the
 *     screen, then shrinks and scampers back home to the bottom-right.
 * -------------------------------------------------------------------------- */

const PW = 84; // panda footprint width  (px)
const PH = 64; // panda footprint height (px)
const MARGIN = 22;
const DOUBLE_WINDOW = 320; // ms — a 2nd click this fast = dance, otherwise he flees
const SLOW = 1.4; // global pacing multiplier — everything runs 40% slower

const ADJACENT: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2],
};

type Pt = { x: number; y: number };
type Mood = "idle" | "run" | "dance";
type Climb = { id: number; x: number; top: number; height: number; up: boolean };

function cornerCoords(i: number, W: number, H: number): Pt {
  const right = Math.max(MARGIN, W - PW - MARGIN);
  const bottom = Math.max(MARGIN, H - PH - MARGIN);
  switch (i) {
    case 0:
      return { x: MARGIN, y: MARGIN };
    case 1:
      return { x: right, y: MARGIN };
    case 2:
      return { x: MARGIN, y: bottom };
    default:
      return { x: right, y: bottom };
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function ScaredyPanda() {
  const reduce = useReducedMotion();
  const { visible } = usePanda();

  const [mounted, setMounted] = useState(false);
  const [dims, setDims] = useState({ W: 0, H: 0 });
  const [corner, setCorner] = useState(3);
  const [pos, setPos] = useState<Pt>({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0.9);
  const [mood, setMood] = useState<Mood>("idle");
  const [scared, setScared] = useState(false);
  const [dancing, setDancing] = useState(false);
  const [climbing, setClimbing] = useState(false);
  const [climb, setClimbState] = useState<Climb | null>(null);
  const [facing, setFacing] = useState(-1);
  const [dust, setDust] = useState<{ id: number; x: number; y: number }[]>([]);

  const clickCount = useRef(0);
  const fleeTimer = useRef<ReturnType<typeof setTimeout>>();
  const scaredTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastDust = useRef(0);
  const dustId = useRef(0);
  const climbId = useRef(0);

  useEffect(() => {
    const measure = () => setDims({ W: window.innerWidth, H: window.innerHeight });
    measure();
    setPos(cornerCoords(3, window.innerWidth, window.innerHeight));
    setMounted(true);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!mounted || dancing) return;
    setPos(cornerCoords(corner, dims.W, dims.H));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.W, dims.H]);

  useEffect(() => {
    return () => {
      clearTimeout(fleeTimer.current);
      clearTimeout(scaredTimer.current);
    };
  }, []);

  const spawnDust = useCallback((x: number, y: number) => {
    const now = performance.now();
    if (now - lastDust.current < 55) return;
    lastDust.current = now;
    const id = dustId.current++;
    setDust((d) => [
      ...d.slice(-16),
      { id, x: x + PW / 2 - 6 + (Math.random() * 8 - 4), y: y + PH - 12 },
    ]);
  }, []);

  const flee = useCallback(() => {
    const options = ADJACENT[corner];
    const next = options[Math.floor(Math.random() * options.length)];
    const target = cornerCoords(next, dims.W, dims.H);
    const dist = Math.hypot(target.x - pos.x, target.y - pos.y);
    const vertical = Math.abs(target.x - pos.x) < 1;

    if (vertical) {
      const up = target.y < pos.y;
      setSpeed(reduce ? 0 : clamp(dist / 430, 1.0, 2.2) * SLOW);
      const top = Math.min(pos.y, target.y) + 8;
      const bottom = Math.max(pos.y, target.y) + PH - 8;
      setClimbState({ id: climbId.current++, x: pos.x + PW / 2, top, height: bottom - top, up });
      setClimbing(true);
    } else {
      setFacing(target.x > pos.x ? 1 : -1);
      setSpeed(reduce ? 0 : clamp(dist / 620, 0.7, 1.7) * SLOW);
      setClimbing(false);
      setClimbState(null);
    }

    setCorner(next);
    setScared(true);
    setMood("run");
    setPos(target);
    clearTimeout(scaredTimer.current);
  }, [corner, dims, pos, reduce]);

  const dance = useCallback(() => {
    setClimbing(false);
    setClimbState(null);
    setScared(false);
    setMood("dance");
    setDancing(true);
  }, []);

  const handleClick = useCallback(() => {
    if (dancing) return;
    clickCount.current += 1;
    if (clickCount.current >= 2) {
      clearTimeout(fleeTimer.current);
      clickCount.current = 0;
      dance();
      return;
    }
    clearTimeout(fleeTimer.current);
    fleeTimer.current = setTimeout(() => {
      clickCount.current = 0;
      flee();
    }, DOUBLE_WINDOW);
  }, [dancing, dance, flee]);

  if (!mounted || !visible) return null;

  const cx = dims.W / 2 - PW / 2;
  const cy = dims.H / 2 - PH / 2;

  const danceAnim = {
    x: [cx, cx - 70, cx + 70, cx - 55, cx + 60, cx - 25, cx],
    y: [cy, cy - 38, cy - 14, cy - 44, cy - 16, cy - 34, cy],
    scale: [1, 3.1, 3.1, 3.2, 3.1, 3.2, 1],
    rotate: [0, -8, 8, -7, 7, -4, 0],
  };
  const danceTimes = [0, 0.16, 0.36, 0.54, 0.72, 0.88, 1];

  return (
    <>
      {/* Bamboo tree — only while climbing a vertical run */}
      <AnimatePresence>
        {climb && (
          <motion.div
            key={climb.id}
            className="pointer-events-none fixed z-[53]"
            style={{ left: climb.x, top: climb.top, height: climb.height, width: 18, x: "-50%" }}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.5 }}
            transition={{ duration: 0.3 * SLOW, ease: "easeOut" }}
          >
            <Bamboo height={climb.height} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dust trail */}
      {dust.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none fixed z-[54] rounded-full bg-zinc-400/40"
          style={{ left: p.x, top: p.y, width: 9, height: 9 }}
          initial={{ opacity: 0.55, scale: 0.5 }}
          animate={{ opacity: 0, scale: 1.7, y: -6 }}
          transition={{ duration: 0.6 * SLOW, ease: "easeOut" }}
          onAnimationComplete={() => setDust((d) => d.filter((q) => q.id !== p.id))}
        />
      ))}

      <motion.div
        className={cn("fixed left-0 top-0", dancing ? "z-[130]" : "z-[55]")}
        style={{ width: PW, height: PH }}
        initial={false}
        animate={dancing ? danceAnim : { x: pos.x, y: pos.y, scale: 1, rotate: 0 }}
        transition={
          dancing
            ? { duration: reduce ? 0 : 3.8 * SLOW, ease: "easeInOut", times: danceTimes }
            : { duration: speed, ease: climbing ? "easeInOut" : [0.4, 0, 0.3, 1] }
        }
        onUpdate={(latest) => {
          if (mood === "run" && !climbing && !reduce) {
            spawnDust(latest.x as number, latest.y as number);
          }
        }}
        onAnimationComplete={() => {
          if (dancing) {
            setDancing(false);
            setScared(false);
            const home = cornerCoords(3, dims.W, dims.H);
            setCorner(3);
            setFacing(home.x <= cx ? -1 : 1);
            setSpeed(reduce ? 0 : 0.9 * SLOW);
            setMood("run");
            setPos(home);
          } else if (mood === "run") {
            setMood("idle");
            setClimbing(false);
            setClimbState(null); // bamboo vanishes once he's arrived
            scaredTimer.current = setTimeout(() => setScared(false), 450);
          }
        }}
      >
        <button
          type="button"
          onClick={handleClick}
          aria-label="A shy panda. Click to startle it — or double-click for a surprise."
          className="block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-iris-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          {climbing ? (
            <ClimbingPanda up={climb?.up ?? true} />
          ) : (
            <Panda mood={mood} scared={scared} facing={facing} />
          )}
        </button>
      </motion.div>
    </>
  );
}

/* -------------------------------------------------------------------------- *
 * Colors
 * -------------------------------------------------------------------------- */
const WHITE = "#f7f7f4";
const INK = "#1b1716";

/* -------------------------------------------------------------------------- *
 * Running panda — chubby side-view quadruped, clean (no fur), facing right.
 * -------------------------------------------------------------------------- */
function Panda({ mood, scared, facing }: { mood: Mood; scared: boolean; facing: number }) {
  const moving = mood === "run" || mood === "dance";
  const legAnim = moving ? "animate-panda-gallop" : "";

  return (
    <div
      className="relative h-full w-full select-none"
      style={{ transform: `scaleX(${facing})`, transformOrigin: "center bottom" }}
    >
      {/* ground shadow */}
      <div
        className={cn(
          "absolute bottom-[2px] left-1/2 h-[6px] w-[54px] -translate-x-1/2 rounded-[50%] bg-black/30 blur-[3px] transition-all",
          moving && "w-[42px] opacity-70"
        )}
      />

      {/* far-side legs */}
      <Leg className={legAnim} left={11} top={45} w={11} h={16} delay={-0.18} dark />
      <Leg className={legAnim} left={44} top={45} w={11} h={16} delay={-0.05} dark />

      {/* tail */}
      <div
        className="absolute left-[2px] top-[30px] h-[10px] w-[11px] rounded-full"
        style={{ background: WHITE, boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
      />

      <div
        className={cn(
          "absolute inset-0 origin-bottom",
          moving ? "animate-panda-run-bob" : "animate-panda-idle"
        )}
      >
        {/* torso — chubby and round */}
        <div
          className="absolute left-[5px] top-[17px] h-[31px] w-[47px] overflow-hidden"
          style={{
            background: WHITE,
            borderRadius: "50% 48% 49% 51% / 56% 56% 46% 46%",
            boxShadow: "0 5px 12px -5px rgba(0,0,0,0.5), inset 0 -7px 11px -7px rgba(0,0,0,0.18)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 80% at 42% 120%, rgba(0,0,0,0.16), transparent 55%)",
            }}
          />
        </div>

        {/* black shoulder band */}
        <div
          className="absolute left-[35px] top-[18px] h-[29px] w-[21px]"
          style={{ background: INK, borderRadius: "48% 50% 48% 50% / 56% 56% 44% 44%" }}
        />

        {/* near hind leg (rear, sits behind the head) */}
        <Leg className={legAnim} left={16} top={46} w={13} h={16} delay={0} />

        {/* head — big and round */}
        <div
          className={cn(
            "absolute left-[41px] top-[2px] h-[40px] w-[40px] origin-bottom",
            moving && "animate-panda-head-bob"
          )}
        >
          <div className="absolute left-[4px] top-[0px] h-[14px] w-[14px] rounded-full" style={{ background: INK, opacity: 0.85 }} />
          <div
            className={cn("absolute left-[22px] top-[-1px] h-[15px] w-[15px] rounded-full", moving && "animate-panda-wiggle")}
            style={{ background: INK, transformOrigin: "bottom center" }}
          />
          <div
            className="absolute left-[3px] top-[4px] h-[34px] w-[34px] rounded-full"
            style={{ background: WHITE, boxShadow: "0 3px 8px -3px rgba(0,0,0,0.42), inset 0 -5px 7px -5px rgba(0,0,0,0.16)" }}
          />
          <div className="absolute left-[17px] top-[12px] h-[14px] w-[11px] rotate-[18deg] rounded-full" style={{ background: INK }} />
          {scared ? (
            <div className="absolute left-[18px] top-[13px] h-[10px] w-[10px] rounded-full bg-white">
              <div className="absolute left-1/2 top-[1px] h-[4px] w-[4px] -translate-x-1/2 rounded-full" style={{ background: INK }} />
            </div>
          ) : (
            <div className="absolute left-[19px] top-[15px] h-[8px] w-[8px] rounded-full bg-white">
              <div className="absolute left-1/2 top-[2px] h-[4px] w-[4px] -translate-x-1/2 rounded-full" style={{ background: INK }} />
            </div>
          )}
          <div className="absolute left-[30px] top-[18px] h-[5px] w-[8px] rounded-full" style={{ background: INK }} />
          {scared ? (
            <div className="absolute left-[30px] top-[24px] h-[5px] w-[5px] rounded-full" style={{ background: INK }} />
          ) : (
            <div className="absolute left-[29px] top-[24px] h-[3px] w-[7px] rounded-b-full border-b-2 border-zinc-800" />
          )}
        </div>

        {/* near foreleg — drawn on top of the head so its pump is clearly visible */}
        <Leg className={legAnim} left={40} top={45} w={13} h={17} delay={-0.17} />
      </div>

      {scared && (
        <span className="absolute -top-1 right-[2px] text-[13px] font-bold leading-none text-ember-400">!</span>
      )}
      {mood === "dance" && (
        <>
          <span className="absolute -left-2 top-1 animate-panda-idle text-[12px] text-iris-300">♪</span>
          <span className="absolute -right-1 top-3 animate-panda-wiggle text-[12px] text-aqua-200">♫</span>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- *
 * Climbing panda — front view, hugging the bamboo, reaching hand-over-hand.
 *   up   → arms do the big reach (hauling up),   legs shuffle.
 *   down → legs do the big reach (lowering down), arms shuffle.
 * -------------------------------------------------------------------------- */
function ClimbingPanda({ up }: { up: boolean }) {
  const armAnim = up ? "animate-panda-reach" : "animate-panda-reach-dn-sm";
  const legAnim = up ? "animate-panda-reach-sm" : "animate-panda-reach-dn";
  const eyeTop = up ? 10 : 14;

  return (
    <div className="relative h-full w-full origin-bottom animate-panda-hug select-none">
      {/* body — upright oval hugging the stalk */}
      <div
        className="absolute left-[25px] top-[16px] h-[40px] w-[34px]"
        style={{
          background: WHITE,
          borderRadius: "46% 46% 48% 48% / 40% 40% 60% 60%",
          boxShadow: "0 5px 11px -5px rgba(0,0,0,0.45), inset 0 -6px 9px -6px rgba(0,0,0,0.16)",
        }}
      />

      {/* legs gripping low (feet point inward to the stalk) */}
      <Limb wrap="left-[24px] top-[34px]" rot={18} anim={legAnim} delay={-0.23} w={11} h={24} />
      <Limb wrap="left-[49px] top-[34px]" rot={-18} anim={legAnim} delay={-0.68} w={11} h={24} />

      {/* head — peeking up the tree, between the shoulders */}
      <div className="absolute left-[27px] top-[8px] h-[30px] w-[30px]">
        <div className="absolute left-[0px] top-[0px] h-[13px] w-[13px] rounded-full" style={{ background: INK }} />
        <div className="absolute right-[0px] top-[0px] h-[13px] w-[13px] rounded-full" style={{ background: INK }} />
        <div
          className="absolute left-[2px] top-[3px] h-[26px] w-[26px] rounded-full"
          style={{ background: WHITE, boxShadow: "0 3px 7px -3px rgba(0,0,0,0.4), inset 0 -4px 6px -4px rgba(0,0,0,0.14)" }}
        />
        {/* eye patches */}
        <div className="absolute h-[9px] w-[8px] rounded-full" style={{ background: INK, left: 6, top: eyeTop - 2, transform: "rotate(-14deg)" }} />
        <div className="absolute h-[9px] w-[8px] rounded-full" style={{ background: INK, right: 6, top: eyeTop - 2, transform: "rotate(14deg)" }} />
        {/* eyes */}
        <div className="absolute h-[5px] w-[5px] rounded-full bg-white" style={{ left: 8, top: eyeTop }}>
          <div className="absolute left-1/2 top-[1px] h-[3px] w-[3px] -translate-x-1/2 rounded-full" style={{ background: INK }} />
        </div>
        <div className="absolute h-[5px] w-[5px] rounded-full bg-white" style={{ right: 8, top: eyeTop }}>
          <div className="absolute left-1/2 top-[1px] h-[3px] w-[3px] -translate-x-1/2 rounded-full" style={{ background: INK }} />
        </div>
        {/* nose */}
        <div className="absolute left-1/2 h-[4px] w-[6px] -translate-x-1/2 rounded-full" style={{ background: INK, top: eyeTop + 6 }} />
      </div>

      {/* arms reaching above the head to grip the stalk — drawn on top so the
          hand-over-hand pump is clearly visible */}
      <Limb wrap="left-[26px] top-[-2px]" rot={20} anim={armAnim} delay={0} w={10} h={28} />
      <Limb wrap="left-[48px] top-[-2px]" rot={-20} anim={armAnim} delay={-0.45} w={10} h={28} />
    </div>
  );
}

/* A single limb: a static rotated wrapper (shoulder/hip pivot) holding a bar
 * that reaches up/down on a loop. The rounded ends read as paws. */
function Limb({
  wrap,
  rot,
  anim,
  delay,
  w,
  h,
}: {
  wrap: string;
  rot: number;
  anim: string;
  delay: number;
  w: number;
  h: number;
}) {
  return (
    <div
      className={cn("absolute", wrap)}
      style={{ width: w, height: h, transform: `rotate(${rot}deg)`, transformOrigin: "bottom center" }}
    >
      <div
        className={cn("absolute inset-x-0 bottom-0 rounded-full", anim)}
        style={{ height: h, background: INK, animationDelay: `${delay * SLOW}s` }}
      />
    </div>
  );
}

function Leg({
  className,
  left,
  top,
  w,
  h,
  delay,
  dark,
}: {
  className?: string;
  left: number;
  top: number;
  w: number;
  h: number;
  delay: number;
  dark?: boolean;
}) {
  return (
    <div
      className={cn("absolute origin-top rounded-b-full rounded-t-md", className)}
      style={{ left, top, width: w, height: h, background: dark ? "#0f0c0b" : INK, animationDelay: `${delay * SLOW}s` }}
    />
  );
}

/* Bamboo stalk with node rings and a couple of leaves. */
function Bamboo({ height }: { height: number }) {
  const segments = Math.max(2, Math.round(height / 30));
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute left-1/2 top-0 h-full w-[12px] -translate-x-1/2 rounded-full"
        style={{
          background: "linear-gradient(90deg,#6b3fd4,#8a63ff 45%,#b59dff)",
          boxShadow: "inset -2px 0 3px rgba(0,0,0,0.22), inset 2px 0 2px rgba(255,255,255,0.3)",
        }}
      />
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 h-[3px] w-[16px] -translate-x-1/2 rounded-full bg-[#5a2fb0]"
          style={{ top: `${((i + 0.5) * 100) / segments}%` }}
        />
      ))}
      <Leaf top="16%" side="left" />
      <Leaf top="64%" side="right" />
    </div>
  );
}

function Leaf({ top, side }: { top: string; side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div
      className="absolute h-[8px] w-[22px] rounded-full"
      style={{
        top,
        left: "50%",
        background: "linear-gradient(90deg,#7c4ddb,#b59dff)",
        transform: `translateX(${left ? "-100%" : "0"}) rotate(${left ? -28 : 28}deg)`,
        transformOrigin: left ? "right center" : "left center",
      }}
    />
  );
}
