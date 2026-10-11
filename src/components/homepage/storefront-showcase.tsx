import { useEffect, useRef, useState } from "react";
import { Check, LockKeyhole, MousePointer2, Pause, Play, ShoppingBag, MessageSquare, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import tshirt from "@/assets/brand-tshirt.jpg.asset.json";
import jeans from "@/assets/brand-jeans.jpg.asset.json";
import hoodie from "@/assets/brand-hoodie.jpg.asset.json";

const PRODUCTS = [
  { name: "تيشيرت قطن كلاسيك", category: "تيشيرتات", price: 450, image: tshirt.url, alt: "تيشيرت أبيض قطني حقيقي", sizes: ["S", "M", "L", "XL"] },
  { name: "جينز أزرق", category: "بناطيل", price: 850, image: jeans.url, alt: "بنطلون جينز أزرق حقيقي", sizes: ["30", "32", "34", "36"] },
  { name: "هودي قطن", category: "هوديز", price: 950, image: hoodie.url, alt: "هودي قطني حقيقي", sizes: ["S", "M", "L", "XL"] },
];

export function StorefrontShowcase() {
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sizes, setSizes] = useState(["S", "30", "S"]);
  const [category, setCategory] = useState<string | null>(null);
  const [inCart, setInCart] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const [added, setAdded] = useState<number | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [pressing, setPressing] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const sizeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const buyRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const addProduct = (index: number) => {
    setCount((previous) => previous + 1);
    setInCart((previous) => [...previous, index]);
    setAdded(index);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setAdded(null), 1200);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (!playing || reducedMotion) { setCursorVisible(false); return; }
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let stopped = false;
    const schedule = (action: () => void, delay: number) => {
      timers.push(setTimeout(() => { if (!stopped) action(); }, delay));
    };
    const moveCursor = (element: HTMLElement | null) => {
      const stage = stageRef.current;
      const cursor = cursorRef.current;
      if (!stage || !cursor || !element) return;
      const bounds = stage.getBoundingClientRect();
      const target = element.getBoundingClientRect();
      cursor.style.transform = `translate(${target.left - bounds.left + target.width * 0.55}px, ${target.top - bounds.top + stage.scrollTop + target.height * 0.65}px)`;
      setCursorVisible(true);
    };
    const cycle = () => {
      setCount(0);
      setInCart([]);
      setCategory(null);
      stageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      setBagOpen(false);
      setSizes(["S", "30", "S"]);
      PRODUCTS.forEach((product, index) => {
        const start = index * 4000 + 2400;
        schedule(() => {
          setCursorVisible(false);
          const card = cardRefs.current[index];
          const track = trackRef.current;
          if (card && track && stageRef.current) {
            const stage = stageRef.current;
            stage.scrollTo({ top: card.getBoundingClientRect().top - stage.getBoundingClientRect().top + stage.scrollTop - 110, behavior: "smooth" });
          }
        }, start + 200);
        schedule(() => moveCursor(sizeRefs.current[index]), start + 850);
        schedule(() => {
          setPressing(true);
          setSizes((previous) => previous.map((size, i) => i === index ? product.sizes[1] : size));
        }, start + 1550);
        schedule(() => { setPressing(false); moveCursor(buyRefs.current[index]); }, start + 1800);
        schedule(() => { setPressing(true); addProduct(index); }, start + 2550);
        schedule(() => setPressing(false), start + 2800);
        schedule(() => setCursorVisible(false), start + 3550);
      });
      schedule(cycle, 16600);
    };
    schedule(cycle, 600);
    return () => { stopped = true; timers.forEach(clearTimeout); setPressing(false); };
  }, [playing, reducedMotion]);

  const takeControl = () => { setPlaying(false); setCursorVisible(false); };

  return (
    <div className="homepage-showcase mx-auto mt-9 max-w-5xl text-right sm:mt-12">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="showcase-live-dot" /> متجرك، كما يراه عملاؤك</span>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs" aria-label={playing && !reducedMotion ? "إيقاف العرض المتحرك" : "تشغيل العرض المتحرك"} disabled={reducedMotion} onClick={() => setPlaying(!playing)}>
          {playing && !reducedMotion ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} <span>عرض تجريبي</span>
        </Button>
      </div>
      <div className="showcase-browser overflow-hidden rounded-lg border border-border bg-card">
        <div dir="ltr" className="flex h-10 items-center justify-between border-b border-border bg-muted/60 px-3 sm:px-5">
          <div className="flex gap-1.5" aria-hidden="true"><i className="showcase-window-dot" /><i className="showcase-window-dot" /><i className="showcase-window-dot" /></div>
          <span className="flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs"><LockKeyhole className="h-3 w-3" /> cupai.app / brand</span>
          <div className="w-8" />
        </div>
        <div ref={stageRef} className="store showcase-store relative">
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-8">
              <nav className="hidden items-center gap-6 sm:flex"><Button variant="ghost" className="store-label h-auto rounded-none p-0" onClick={() => { takeControl(); setCategory(null); }}>الكل</Button></nav>
              <div className="sm:hidden" />
              <span className="store-display truncate text-3xl sm:text-4xl">براند</span>
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" className="store-label h-10 rounded-none px-2" onClick={takeControl}>EN</Button>
                <Button variant="ghost" className="store-label h-10 rounded-none border-b border-foreground/30 px-0" onClick={() => { takeControl(); setBagOpen(true); }}>تتبع طلبي</Button>
                <Button variant="ghost" className="relative me-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border hover:bg-muted" aria-label="سلة العرض التجريبي" aria-expanded={bagOpen} onClick={() => { takeControl(); setBagOpen(!bagOpen); }}>
                  <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
                  {count > 0 && <span className="absolute left-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground" aria-live="polite">{count}</span>}
                </Button>
              </div>
            </div>
          </header>
          <section className="relative isolate overflow-hidden bg-secondary">
            <div className="showcase-hero mx-auto grid w-full max-w-7xl items-end px-4 pb-12 pt-24 sm:px-8">
              <img src={tshirt.url} alt="مجموعة براند للملابس" className="absolute inset-0 -z-10 h-full w-full object-cover" />
              <div className="showcase-hero-overlay absolute inset-0 -z-10" />
              <div className="text-primary-foreground">
                <p className="store-label">المجموعة الجديدة</p>
                <h2 className="store-display mt-3 max-w-4xl text-7xl sm:text-9xl">براند</h2>
                <Button variant="secondary" className="store-label mt-8 inline-flex h-12 items-center rounded-none bg-background px-10 text-foreground hover:bg-background/85" onClick={() => { takeControl(); const stage = stageRef.current; const track = trackRef.current; if (stage && track) stage.scrollTo({ top: track.offsetTop - 160, behavior: "smooth" }); }}>تسوّق الآن</Button>
              </div>
            </div>
          </section>
          <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
              <h2 className="store-display text-5xl sm:text-6xl">{category ?? "كل المنتجات"}</h2>
              <span className="store-label text-muted-foreground">{category ? 1 : 3} قطعة</span>
            </div>
            <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {[null, ...PRODUCTS.map((p) => p.category)].map((c) => <Button key={c ?? "all"} variant="outline" className={`store-label h-auto shrink-0 rounded-none border px-4 py-2 ${category === c ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "border-border hover:border-primary"}`} onClick={() => { takeControl(); setCategory(c); }}>{c ?? "الكل"}</Button>)}
            </div>
            <div ref={trackRef} className="showcase-product-track grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {PRODUCTS.map((product, index) => (
                <article key={product.name} ref={(element) => { cardRefs.current[index] = element; }} className={`showcase-product group flex flex-col ${category && category !== product.category ? "hidden" : ""}`}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary"><img src={product.image} alt={product.name} width="600" height="800" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /></div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-3">
                    <span className="store-label truncate text-[10px] text-muted-foreground">{product.category}</span>
                    <span className="line-clamp-2 min-h-[2.5rem] text-right text-sm font-medium leading-5">{product.name}</span>
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm"><span className="font-semibold">{product.price} جنيه</span></div>
                    <div className="grid grid-cols-4 gap-1" role="group" aria-label={`مقاس ${product.name}`}>
                      {product.sizes.map((size, sizeIndex) => <Button key={size} ref={(element) => { if (sizeIndex === 1) sizeRefs.current[index] = element; }} variant="outline" size="sm" aria-pressed={sizes[index] === size} className={`h-8 min-w-0 truncate rounded-none border px-1 text-[11px] font-semibold ${sizes[index] === size ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "border-border hover:border-primary"}`} onClick={() => { takeControl(); setSizes((previous) => previous.map((old, i) => i === index ? size : old)); }}>{size}</Button>)}
                    </div>
                    <div className="mt-auto pt-1"><Button ref={(element) => { buyRefs.current[index] = element; }} disabled={inCart.includes(index)} className="store-label h-10 w-full rounded-none bg-primary text-primary-foreground transition hover:bg-primary/85 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100" onClick={() => { takeControl(); addProduct(index); }}>{inCart.includes(index) ? "في السلة ✓" : "شراء الآن"}</Button></div>
                  </div>
                </article>
              ))}
            </div>
          </main>
          <section className="border-y border-border"><div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">{[{Icon:Truck,title:"شحن سريع",description:""},{Icon:ShieldCheck,title:"دفع آمن",description:"بالطريقة التي تناسبك"},{Icon:MessageSquare,title:"خدمة العملاء",description:"نرد عليك في أسرع وقت"}].map(({Icon,title,description}) => <div key={title} className="flex items-center gap-4 px-6 py-6"><Icon className="h-6 w-6 shrink-0" strokeWidth={1.25}/><div><div className="store-label">{title}</div>{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)}</div></section>
          <footer className="bg-primary px-4 py-14 text-primary-foreground sm:px-8"><p className="store-display text-5xl">براند</p><div className="store-label mt-8 border-t border-primary-foreground/15 pt-5 text-center opacity-60">© 2026 براند</div></footer>
          <Button size="icon" aria-label="محادثة العرض التجريبي" className="showcase-chat grid h-14 w-14 place-items-center rounded-full" onClick={() => { takeControl(); setBagOpen(true); }}><MessageSquare className="h-6 w-6" /></Button>
          <div ref={cursorRef} aria-hidden="true" className={`showcase-cursor ${cursorVisible ? "is-visible" : ""} ${pressing ? "is-pressing" : ""}`}><MousePointer2 className="h-7 w-7 fill-primary-foreground text-primary" strokeWidth={1.7} /><span className="showcase-click-ring" /></div>
          {added !== null && <div role="status" className="showcase-toast pointer-events-none absolute bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-border bg-card px-4 py-2 text-xs shadow-card"><Check className="h-4 w-4" /> تمت الإضافة</div>}
          {bagOpen && <div className="absolute inset-x-4 top-16 z-10 border border-border bg-card p-4 text-sm shadow-card" role="status">{count ? `السلة: ${count} قطع` : "السلة فارغة"}</div>}
        </div>
      </div>
    </div>
  );
}