import React, { useEffect, useMemo, useState } from 'react';

const rawDate = typeof __LAST_MODIFIED__ !== 'undefined' ? __LAST_MODIFIED__ : document.lastModified;
const lastModified = new Date(rawDate).toLocaleDateString('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const products = [
  { id: 1, name: 'Yamaha F310', type: 'Acústicas', brand: 'Yamaha', price: 3899, tag: 'Más vendido', image: '/img/yamaha.jpg', description: 'Guitarra acústica tipo dreadnought de construcción tradicional. Ofrece proyección equilibrada y estabilidad de afinación para sesiones diarias de práctica y acompañamiento vocal.', sound: 'Cálido y con buena proyección en acordes abiertos y rasgueo.', ideal: 'Quienes buscan su primera guitarra de cuerdas de acero sin sacrificar respuesta sonora.' },
  { id: 2, name: 'Fender Player Stratocaster', type: 'Eléctricas', brand: 'Fender', price: 18999, tag: 'Selección taller', image: '/img/fender.jpg', description: 'Configuración clásica de tres pastillas simples con cuerpo de aliso y mástil de arce. Permite transitar desde limpios cristalinos hasta saturación con total definición.', sound: 'Brillante, articulado y con gran rango dinámico entre posiciones.', ideal: 'Guitarristas de rock, blues, funk y pop que necesitan versatilidad en escenario o estudio.' },
  { id: 3, name: 'Cordoba C5', type: 'Clásicas', brand: 'Cordoba', price: 7299, tag: 'Recomendada', image: '/img/cordoba.jpg', description: 'Construida con tapa sólida de cedro canadiense y aros de caoba. La respuesta de sus cuerdas de nylon facilita el control de digitación y matices.', sound: 'Timbre redondo, dulce y con sustain prolongado en registros medios.', ideal: 'Estudiantes de guitarra clásica, repertorio latinoamericano y toque con dedos.' },
  { id: 4, name: 'Ibanez GSR200', type: 'Bajos', brand: 'Ibanez', price: 6999, tag: 'Gran respuesta', image: '/img/ibanez.jpg', description: 'Bajo eléctrico ligero de cuatro cuerdas con perfil de mástil delgado y circuito activo Phat II para reforzar graves cuando la mezcla lo pide.', sound: 'Graves firmes y ataque definido tanto con dedos como con plumilla.', ideal: 'Bajistas en formación o músicos que buscan un instrumento cómodo para ensayos largos.' },
  { id: 5, name: 'Epiphone Les Paul Special', type: 'Eléctricas', brand: 'Epiphone', price: 8999, tag: 'Clásico', image: '/img/epi.jpg', description: 'Cuerpo sólido de corte sencillo con pastillas de doble bobina diseñadas para entregar cuerpo, pegada en medios y sustain natural.', sound: 'Denso, con carácter y buena respuesta ante amplificadores saturados.', ideal: 'Riffs de rock, punk, hard rock y melodías con presencia.' },
  { id: 6, name: 'Taylor Academy 10', type: 'Acústicas', brand: 'Taylor', price: 14999, tag: 'Gama superior', image: '/img/taylor.jpg', description: 'Incorpora un bisel ergonómico en el aro para apoyar el antebrazo y un mástil de acción baja que reduce la fatiga en la mano izquierda.', sound: 'Balanceado y claro, con separación nítida entre cada cuerda.', ideal: 'Músicos que buscan comodidad superior para componer, grabar o tocar en vivo.' },
  { id: 7, name: 'Juego de cuerdas para acústica', type: 'Accesorios', brand: 'Genérico', price: 249, tag: 'Esencial', image: '/img/juego.jpg', description: 'Juego de seis cuerdas de acero entorchado en bronce. Recomendamos reemplazarlas cada dos o tres meses para conservar brillo y entonación.', sound: 'Ataque limpio y armónicos definidos.', ideal: 'Mantenimiento preventivo de cualquier guitarra acústica.' },
  { id: 8, name: 'Afinador de clip cromático', type: 'Accesorios', brand: 'Genérico', price: 299, tag: 'Básico', image: '/img/afinador.jpg', description: 'Sensor piezoeléctrico de pinza que lee directamente la vibración de la pala, permitiendo afinar con precisión incluso en salas ruidosas.', sound: 'No aplica: lectura por vibración directa.', ideal: 'Uso diario antes de cada ensayo o presentación.' }
];

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };
const PAGES = ['inicio', 'catalogo', 'asesoria', 'aprende', 'ayuda', 'carrito', 'cuenta', 'privacidad', 'terminos', 'devoluciones', 'arco'];
const parseHash = () => {
  const h = window.location.hash.slice(1);
  const m = h.match(/^producto-(\d+)$/);
  const p = m && products.find(x => x.id === +m[1]);
  return p ? ['producto', p] : [PAGES.includes(h) ? h : 'inicio', null];
};
const money = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const msi = n => n >= 2000 ? `Hasta 12 meses sin intereses de ${money(Math.round(n / 12))}` : '';
const SHIPPING = 199;
const STORE = {
  place: 'Facultad de Ingeniería, UNAM',
  street: 'Av. Universidad 3000, Circuito Escolar s/n, Ciudad Universitaria',
  city: 'Coyoacán, 04510 Ciudad de México',
  map: 'https://www.google.com/maps/search/?api=1&query=Facultad+de+Ingenier%C3%ADa+UNAM'
};
const WHATSAPP = '55607949322';
const GA_ID = '';
const HORARIOS = ['11:00', '13:00', '17:00'];
const GAMAS = ['Todas', 'Iniciación', 'Media-baja', 'Media-alta', 'Profesional', 'Premium'];
const gamaOf = p => p.type === 'Accesorios' ? '' : p.price < 4000 ? 'Iniciación' : p.price < 10000 ? 'Media-baja' : p.price < 30000 ? 'Media-alta' : p.price < 80000 ? 'Profesional' : 'Premium';
const FICHA = [['tapa', 'Tapa o cuerpo'], ['mastil', 'Mástil'], ['escala', 'Escala'], ['electronica', 'Electrónica'], ['peso', 'Peso']];
const REGIMENES = ['601 General de Ley Personas Morales', '603 Personas Morales con Fines no Lucrativos', '605 Sueldos y Salarios', '606 Arrendamiento', '612 Personas Físicas con Actividades Empresariales', '616 Sin obligaciones fiscales', '626 Régimen Simplificado de Confianza'];
const USOS = ['G01 Adquisición de mercancías', 'G03 Gastos en general', 'S01 Sin efectos fiscales'];
const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
const track = (name, params = {}) => { try { if (window.gtag) window.gtag('event', name, params); } catch { /* sin analítica */ } };

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

/* Iconografía SVG minimalista de trazo uniforme */
const BrandMark = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="9.5" stroke="#C9A66B" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="11" y1="3" x2="11" y2="29" stroke="currentColor" strokeWidth="1.2" />
    <line x1="16" y1="2.5" x2="16" y2="29.5" stroke="#C9A66B" strokeWidth="1.4" />
    <line x1="21" y1="3" x2="21" y2="29" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20c1.8-3.6 4.5-5 7.5-5s5.7 1.4 7.5 5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

function App() {
  const init = parseHash();
  const [page, setPage] = useState(init[0]);
  const [cart, setCart] = useState(() => load('cl_cart', []));
  const [orders, setOrders] = useState(() => load('cl_orders', []));
  const [citas, setCitas] = useState(() => load('cl_citas', []));
  const [user, setUser] = useState(() => load('cl_user', {}));
  const [selected, setSelected] = useState(init[1] || products[0]);
  const [photo, setPhoto] = useState(0);
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [ordered, setOrdered] = useState(false);
  const [resenas, setResenas] = useState(() => load('cl_resenas', []));
  const [arcos, setArcos] = useState(() => load('cl_arco', []));
  const [gama, setGama] = useState('Todas');
  const [wantFactura, setWantFactura] = useState(false);

  const filtered = useMemo(() => products.filter(p =>
    (category === 'Todas' || p.type === category) && (gama === 'Todas' || gamaOf(p) === gama) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.id - b.id), [category, search, sort, gama]);

  const addToCart = product => {
    setCart(c => c.some(i => i.id === product.id) ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }]);
    setNotice(`Agregado: ${product.name}`);
    track('add_to_cart', { currency: 'MXN', value: product.price, items: [{ item_id: String(product.id), item_name: product.name, price: product.price }] });
    setTimeout(() => setNotice(''), 2400);
  };

  const go = next => { window.location.hash = next; };
  const openProduct = product => { window.location.hash = 'producto-' + product.id; };
  useEffect(() => {
    const onHash = () => { const [pg, p] = parseHash(); setPage(pg); if (p) setSelected(p); setPhoto(0); setOrdered(false); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => save('cl_resenas', resenas), [resenas]);
  useEffect(() => save('cl_arco', arcos), [arcos]);
  useEffect(() => {
    if (!GA_ID || window.gtag) return;
    const sc = document.createElement('script'); sc.async = true; sc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', GA_ID, { send_page_view: false });
  }, []);
  useEffect(() => { window.scrollTo(0, 0); track('page_view', { page_path: '/' + (page === 'producto' ? 'producto-' + selected.id : page) }); }, [page, selected.id]);
  useEffect(() => save('cl_cart', cart), [cart]);
  useEffect(() => save('cl_orders', orders), [orders]);
  useEffect(() => save('cl_citas', citas), [citas]);
  useEffect(() => save('cl_user', user), [user]);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const changeQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const puntos = orders.reduce((n, o) => n + Math.floor(o.subtotal / 100), 0) + resenas.length * 10;
  const bought = id => orders.some(o => o.items.some(i => i.id === id));
  const avg = id => { const l = resenas.filter(r => r.productId === id); return l.length ? l.reduce((n, r) => n + r.calificacion, 0) / l.length : 0; };
  const addResena = r => setResenas(x => [r, ...x.filter(y => y.productId !== r.productId)]);

  const placeOrder = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const factura = f.get('factura') ? { rfc: String(f.get('rfc')).toUpperCase(), razon: f.get('razon'), cp: f.get('cpfiscal'), regimen: f.get('regimen'), uso: f.get('uso') } : null;
    const order = { id: 'CL-' + String(orders.length + 1).padStart(4, '0'), fecha: new Date().toISOString(), items: cart, subtotal, envio: SHIPPING, total: subtotal + SHIPPING, nombre: f.get('nombre'), domicilio: f.get('domicilio'), factura };
    setOrders(o => [order, ...o]); setCart([]); setOrdered(order.id); setWantFactura(false);
    track('purchase', { transaction_id: order.id, currency: 'MXN', value: order.total });
  };

  return (
    <div className="app-shell">
      <div className="top-strip">
        <span>Envíos asegurados a toda la República Mexicana</span>
        <span className="strip-sep">/</span>
        <span>Asesoría sin costo por videollamada</span>
      </div>

      <header className="header">
        <button className="brand" onClick={() => go('inicio')} aria-label="Ir al inicio">
          <BrandMark />
          <span className="brand-text">
            <strong>CUERDA LIBRE</strong>
            <small>INSTRUMENTOS &amp; TALLER </small>
          </span>
        </button>

        <nav className="nav" aria-label="Principal">
          {['inicio', 'catalogo', 'asesoria', 'aprende', 'ayuda'].map(item => (
            <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} onClick={() => go(item)}>
              {{ inicio: 'Inicio', catalogo: 'Catálogo', asesoria: 'Asesoría', aprende: 'Guías', ayuda: 'Ayuda' }[item]}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="account-btn" onClick={() => go('cuenta')} title="Mi cuenta">
            <UserIcon />
            <span>Cuenta</span>
          </button>
          <button className="cart-btn" onClick={() => go('carrito')}>
            Carrito <span className="cart-count">{count}</span>
          </button>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}
      {WHATSAPP && (
        <a className="wa" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, tengo una duda sobre Cuerda Libre')}`} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp">
          WhatsApp
        </a>
      )}

      <main>
        {page === 'inicio' && <Home go={go} setCategory={setCategory} setSearch={setSearch} openProduct={openProduct} addToCart={addToCart} avg={avg} />}

        {page === 'catalogo' && (
          <section className="page-section">
            <header className="page-header">
              <div>
                <div className="eyebrow">ARCHIVO DE INSTRUMENTOS</div>
                <h1>Catálogo general</h1>
              </div>
              <p className="lead">Selección curada de guitarras acústicas, clásicas, eléctricas, bajos y accesorios esenciales.</p>
            </header>

            <div className="catalog-tools">
              <div className="search-wrap">
                <SearchIcon />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar modelo o marca..." />
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Categoría">
                {['Todas', 'Acústicas', 'Clásicas', 'Eléctricas', 'Bajos', 'Accesorios'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={gama} onChange={e => setGama(e.target.value)} aria-label="Gama">
                {GAMAS.map(g => <option key={g} value={g}>{g === 'Todas' ? 'Todas las gamas' : 'Gama ' + g.toLowerCase()}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar">
                <option value="">Orden predeterminado</option>
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="product-grid">
              {filtered.map((p, idx) => <ProductCard key={p.id} p={p} index={idx + 1} open={openProduct} add={addToCart} avg={avg(p.id)} />)}
            </div>
            {filtered.length === 0 && <p className="empty-filter">No hay instrumentos que coincidan con los filtros actuales.</p>}
          </section>
        )}

        {page === 'producto' && (
          <section className="page-section product-detail">
            <button className="back-link" onClick={() => go('catalogo')}>← Volver al catálogo</button>
            <div className="detail-grid">
              <div className="gallery">
                <div className="gallery-frame">
                  {(selected.images?.[photo] || selected.image)
                    ? <img src={selected.images?.[photo] || selected.image} alt={selected.name} />
                    : <div className="img-ph detail-ph" role="img" aria-label={selected.name}>CL-{String(selected.id).padStart(2, '0')}</div>}
                </div>
                {selected.images?.length > 1 && (
                  <div className="thumbs">
                    {selected.images.map((src, i) => (
                      <button key={src} className={i === photo ? 'on' : ''} onClick={() => setPhoto(i)} aria-label={`Foto ${i + 1}`}>
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="detail-body">
                <div className="eyebrow">{selected.brand} · {selected.type}</div>
                <h1>{selected.name}</h1>
                <div className="price detail-price">{money(selected.price)}</div>
                {msi(selected.price) && <p className="msi">{msi(selected.price)} con tarjetas participantes · IVA incluido</p>}
                <p className="detail-description">{selected.description}</p>

                <div className="detail-extra">
                  <div>
                    <h3>Perfil sonoro</h3>
                    <p>{selected.sound}</p>
                  </div>
                  <div>
                    <h3>Uso recomendado</h3>
                    <p>{selected.ideal}</p>
                  </div>
                </div>

                <h3 className="spec-title">Ficha técnica</h3>
                <table className="spec-table">
                  <tbody>
                    <tr><td>Marca</td><td>{selected.brand}</td></tr>
                    <tr><td>Categoría</td><td>{selected.type}</td></tr>
                    {gamaOf(selected) && <tr><td>Nivel / Gama</td><td>{gamaOf(selected)}</td></tr>}
                    {selected.type !== 'Accesorios' && <tr><td>Encordado</td><td>{selected.type === 'Bajos' ? '4 cuerdas' : '6 cuerdas'}, {selected.type === 'Clásicas' ? 'nylon' : 'acero'}</td></tr>}
                    <tr><td>Estado</td><td>Nuevo, revisado antes de envío</td></tr>
                    {FICHA.filter(([k]) => selected.ficha?.[k]).map(([k, l]) => <tr key={k}><td>{l}</td><td>{selected.ficha[k]}</td></tr>)}
                  </tbody>
                </table>
                {selected.type !== 'Accesorios' && !selected.ficha && <p className="form-note">Especificaciones de maderas y escala disponibles bajo consulta.</p>}

                <div className="detail-actions">
                  <button className="primary-btn" onClick={() => addToCart(selected)}>Agregar al carrito</button>
                  <button className="secondary-btn" onClick={() => go('asesoria')}>Consultar con taller</button>
                  {selected.audio
                    ? <audio className="player" controls preload="none" src={selected.audio} aria-label="Escucha cómo suena" />
                    : <button className="ghost-btn" onClick={() => setNotice('Muestra de audio en grabación para este modelo.')}>Escuchar muestra</button>}
                </div>

                <ul className="spec-list">
                  <li>Garantía directa contra defectos de fabricación</li>
                  <li>Embalaje reforzado con envío asegurado en México</li>
                  <li>Orientación personalizada sin compromiso</li>
                </ul>

                <Reviews product={selected} list={resenas} canReview={bought(selected.id)} onAdd={addResena} />

                {selected.type !== 'Accesorios' && (
                  <>
                    <h3 className="spec-title">Complementos sugeridos</h3>
                    <div className="product-grid mini-grid">
                      {products.filter(x => x.type === 'Accesorios').slice(0, 2).map((x, idx) => (
                        <ProductCard key={x.id} p={x} index={idx + 1} open={openProduct} add={addToCart} avg={avg(x.id)} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {page === 'asesoria' && <Advice citas={citas} onSave={c => setCitas(x => [{ id: Date.now(), ...c }, ...x])} />}

        {page === 'carrito' && (
          <section className="page-section">
            <div className="eyebrow">RESUMEN DE COMPRA</div>
            <h1>Carrito de instrumentos</h1>
            {ordered ? (
              <div className="form-card success narrow">
                <div className="success-tag">PEDIDO CONFIRMADO</div>
                <h2>Orden {ordered} registrada</h2>
                <p>Puedes consultar el desglose y estado de este pedido de demostración en el apartado Mi cuenta.</p>
                <button className="primary-btn" onClick={() => go('cuenta')}>Ir a Mi cuenta</button>
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-state">
                <h2>Tu carrito está vacío</h2>
                <p>Aún no has seleccionado ningún instrumento o accesorio del catálogo.</p>
                <button className="primary-btn" onClick={() => go('catalogo')}>Explorar catálogo</button>
              </div>
            ) : (
              <div className="cart-layout">
                <div className="cart-items">
                  {cart.map(i => (
                    <div className="cart-item" key={i.id}>
                      {i.image ? <img src={i.image} alt={i.name} /> : <div className="img-ph mini">CL</div>}
                      <div>
                        <small>{i.brand}</small>
                        <b>{i.name}</b>
                        <strong>{money(i.price * i.qty)}</strong>
                        <div className="qty">
                          <button aria-label="Quitar una pieza" onClick={() => changeQty(i.id, -1)}>−</button>
                          <span>{i.qty}</span>
                          <button aria-label="Agregar una pieza" onClick={() => changeQty(i.id, 1)}>+</button>
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => setCart(c => c.filter(x => x.id !== i.id))}>Eliminar</button>
                    </div>
                  ))}
                </div>

                <aside className="summary">
                  <h3>Desglose</h3>
                  <div className="summary-line"><span>Artículos ({count})</span><b>{money(subtotal)}</b></div>
                  <div className="summary-line"><span>Envío asegurado (estimado)</span><b>{money(SHIPPING)}</b></div>
                  <hr />
                  <div className="summary-line total"><b>Total MXN</b><b>{money(subtotal + SHIPPING)}</b></div>

                  <form className="ship-form" onSubmit={placeOrder}>
                    <label>Nombre completo<input name="nombre" required /></label>
                    <label>Domicilio de entrega<input name="domicilio" required placeholder="Calle, número, colonia y CP" /></label>
                    <label className="check">
                      <input type="checkbox" name="factura" checked={wantFactura} onChange={e => setWantFactura(e.target.checked)} />
                      <span>Requiero factura (CFDI 4.0)</span>
                    </label>
                    {wantFactura && (
                      <div className="factura-box">
                        <label>RFC<input name="rfc" required pattern="[A-Za-zÑñ&]{3,4}[0-9]{6}[A-Za-z0-9]{3}" title="RFC de 12 o 13 caracteres" /></label>
                        <label>Nombre o razón social<input name="razon" required /></label>
                        <label>Código postal fiscal<input name="cpfiscal" required pattern="[0-9]{5}" title="5 dígitos" /></label>
                        <label>Régimen fiscal<select name="regimen">{REGIMENES.map(r => <option key={r}>{r}</option>)}</select></label>
                        <label>Uso del CFDI<select name="uso">{USOS.map(r => <option key={r}>{r}</option>)}</select></label>
                        <small>Prototipo: la solicitud de factura se guarda con el pedido sin timbrado fiscal.</small>
                      </div>
                    )}
                    <label className="check">
                      <input type="checkbox" required />
                      <span>He leído el <button type="button" className="link" onClick={() => go('privacidad')}>aviso de privacidad</button> y los <button type="button" className="link" onClick={() => go('terminos')}>términos y condiciones</button>.</span>
                    </label>
                    <button className="primary-btn full">Confirmar pedido (demo)</button>
                  </form>
                  <small>Precios en MXN con IVA incluido. Prototipo académico sin cargo real.</small>
                </aside>
              </div>
            )}
          </section>
        )}

        {page === 'cuenta' && <Account orders={orders} citas={citas} user={user} setUser={setUser} puntos={puntos} go={go} />}

        {page === 'aprende' && (
          <section className="page-section narrow">
            <div className="eyebrow">CUADERNO DE TALLER</div>
            <h1>Guías de elección y mantenimiento</h1>
            <p className="lead">Referencia rápida para elegir tu primer instrumento y conservarlo en buen estado.</p>
            <div className="faq">
              <details open><summary>01. ¿Clásica, acústica o eléctrica?</summary><p>La guitarra clásica monta cuerdas de nylon con mayor separación entre ellas, ideal para digitación y menor tensión en los dedos. La acústica utiliza cuerdas de acero, ofrece mayor volumen y brillo para rasgueo. La eléctrica requiere amplificador y cuenta con un mástil más estrecho, adecuado para rock, blues y pop.</p></details>
              <details><summary>02. Accesorios indispensables desde el primer día</summary><p>Un afinador de clip, un juego de cuerdas de repuesto y una funda acolchada. Si optas por guitarra eléctrica o bajo, necesitarás además un amplificador de práctica y un cable de instrumento.</p></details>
              <details><summary>03. Cuidado básico y estabilidad</summary><p>Afina antes de cada sesión, guarda el instrumento en su funda lejos de cambios bruscos de temperatura o humedad directa y reemplaza las cuerdas cada dos o tres meses.</p></details>
              <details><summary>04. Cómo afinar correctamente</summary><p>La afinación estándar de sexta a primera cuerda es Mi, La, Re, Sol, Si, Mi. Al usar un afinador de clip, siempre aproxima la nota tensando desde abajo hacia el tono objetivo para evitar que la clavija ceda al tocar.</p></details>
              <details><summary>05. Primeros acordes abiertos</summary><p>Mi menor: dedo medio en el segundo traste de la quinta cuerda y dedo anular en el segundo traste de la cuarta, rasgueando las seis cuerdas. La menor: dedo índice en primer traste de segunda cuerda, medio en segundo de cuarta y anular en segundo de tercera, tocando desde la quinta cuerda.</p></details>
              <details><summary>06. Cambio de cuerdas paso a paso</summary><p>Sustituye una cuerda a la vez para mantener constante la tensión sobre el mástil. Retira la vieja, fija la nueva en el puente, pasa el extremo por la clavija dejando dos vueltas de margen, tensa, estira suavemente la cuerda con los dedos y vuelve a afinar.</p></details>
            </div>
          </section>
        )}

        {page === 'ayuda' && (
          <section className="page-section narrow">
            <div className="eyebrow">ATENCIÓN Y SOPORTE</div>
            <h1>Preguntas frecuentes</h1>
            <div className="faq">
              <details open><summary>¿Realizan envíos a todo México?</summary><p>Sí, enviamos a toda la República Mexicana mediante paquetería asegurada y embalaje reforzado para instrumentos musicales.</p></details>
              <details><summary>¿Cómo funciona la asesoría gratuita?</summary><p>Puedes agendar una videollamada de en la sección Asesoría para revisar opciones según tu presupuesto, género musical y experiencia.</p></details>
              <details><summary>¿Tienen muestras de audio de los instrumentos?</summary><p>Estamos incorporando grabaciones directas sin procesamiento en las fichas de cada modelo.</p></details>
              <details><summary>Política de envíos y devoluciones</summary><p>Cuentas con 7 días naturales tras recibir tu pedido para solicitar una devolución, siempre que el instrumento conserve su estado original y empaque completo.</p></details>
              <details><summary>Protección de datos y derechos ARCO</summary><p>Tus datos se emplean únicamente para gestionar pedidos, envíos y citas. Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición desde el enlace Derechos ARCO al pie de página.</p></details>
              <details open><summary>Ubicación de referencia</summary><Address /></details>
            </div>
          </section>
        )}

        {['privacidad', 'terminos', 'devoluciones'].includes(page) && <Legal kind={page} go={go} />}
        {page === 'arco' && <Arco arcos={arcos} onSave={r => setArcos(x => [r, ...x])} />}
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">CUERDA LIBRE</div>
            <p>Selección de instrumentos de cuerda, asesoría directa y mantenimiento básico en Ciudad de México.</p>
          </div>
          <div>
            <b>Secciones</b>
            <button onClick={() => go('catalogo')}>Catálogo</button>
            <button onClick={() => go('asesoria')}>Asesoría</button>
            <button onClick={() => go('aprende')}>Guías</button>
          </div>
          <div>
            <b>Legal y soporte</b>
            <button onClick={() => go('ayuda')}>Ayuda</button>
            <button onClick={() => go('privacidad')}>Aviso de privacidad</button>
            <button onClick={() => go('terminos')}>Términos y condiciones</button>
            <button onClick={() => go('devoluciones')}>Devoluciones</button>
            <button onClick={() => go('arco')}>Derechos ARCO</button>
            <button onClick={() => go('cuenta')}>Mi cuenta</button>
          </div>
          <div>
            <b>Taller de referencia</b>
            <Address />
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Cuerda Libre · Proyecto académico · Precios en MXN con IVA incluido · Última actualización: {lastModified}
        </div>
      </footer>
    </div>
  );
}

function Home({ go, setCategory, setSearch, openProduct, addToCart, avg }) {
  const [q, setQ] = useState('');
  const categories = [
    ['01', 'Acústicas', 'Cuerdas de acero · Folk y dreadnought', '/img/acustic.jpg'],
    ['02', 'Clásicas', 'Cuerdas de nylon · Estudio y concierto', '/img/cordoba.jpg'],
    ['03', 'Eléctricas', 'Cuerpo sólido · Versatilidad tonal', '/img/electricas.jpg'],
    ['04', 'Bajos', 'Cuatro cuerdas · Base rítmica', '/img/bajo.jpg']
  ];

  return (
    <>
      <section className="hero-editorial">
        <div className="hero-main">
          <div className="hero-kicker">CATÁLOGO 2026 · MÉXICO</div>
          <h1>Encuentra el instrumento ideal para ti.</h1>
          <p className="hero-lead">
            Guitarras acústicas, clásicas, eléctricas y bajos calibrados para acompañarte desde tus primeros acordes hasta el escenario.
          </p>

          <form className="hero-search" onSubmit={e => { e.preventDefault(); setSearch(q); go('catalogo'); }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar Yamaha, Fender, Cordoba, accesorios..." aria-label="Buscar instrumento" />
            <button type="submit" className="primary-btn">Buscar</button>
          </form>

          <div className="hero-links">
            <button className="cream-btn" onClick={() => go('catalogo')}>Explorar catálogo completo →</button>
            <button className="text-btn" onClick={() => go('asesoria')}>Agendar asesoría sin costo</button>
          </div>
        </div>

        <figure className="hero-plate">
          <div className="plate-img" role="img" aria-label="Taller y guitarras Cuerda Libre" />
          
        </figure>
      </section>

      <section className="editorial-notes" aria-label="Compromisos del taller">
        <div>
          <span className="note-num">I</span>
          <div>
            <b>Asesoría directa</b>
            <span>Recomendaciones honestas según tu mano, género y presupuesto.</span>
          </div>
        </div>
        <div>
          <span className="note-num">II</span>
          <div>
            <b>Envío asegurado</b>
            <span>Embalaje rígido de doble pared a toda la República Mexicana.</span>
          </div>
        </div>
        <div>
          <span className="note-num">III</span>
          <div>
            <b>Garantía verificada</b>
            <span>Instrumentos nuevos inspeccionados antes de salir.</span>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FAMILIAS DE INSTRUMENTOS</div>
            <h2>Explora por formato</h2>
          </div>
          <button className="arrow-link" onClick={() => { setCategory('Todas'); go('catalogo'); }}>Ver todo el archivo →</button>
        </div>

        <div className="category-grid">
          {categories.map(([num, name, desc, img]) => (
            <button
              key={name}
              className="category-card"
              onClick={() => { setCategory(name); go('catalogo'); }}
            >
              <div
                className="category-thumb"
                style={{ backgroundImage: `url(${img.startsWith('/') ? img : 'https://images.unsplash.com/' + img + '?w=700&q=80'})` }}
              />
              <div className="category-meta">
                <span className="cat-index">{num}</span>
                <strong>{name}</strong>
                <small>{desc}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="featured section-pad">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SELECCIÓN DESTACADA</div>
            <h2>Piezas recomendadas del mes</h2>
          </div>
          <button className="arrow-link" onClick={() => go('catalogo')}>Ir al catálogo →</button>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((p, idx) => (
            <ProductCard key={p.id} p={p} index={idx + 1} open={openProduct} add={addToCart} avg={avg(p.id)} />
          ))}
        </div>
      </section>

      <section className="advice-strip">
        <div className="advice-strip-copy">
          <div className="eyebrow">ORIENTACIÓN PERSONALIZADA</div>
          <h2>¿Dudas entre dos modelos o tipos de madera?</h2>
          <p>Reserva una videollamada. Comparamos opciones contigo sin presión de compra.</p>
        </div>
        <button className="primary-btn" onClick={() => go('asesoria')}>Agendar videollamada →</button>
      </section>
    </>
  );
}

function ProductCard({ p, index = 1, open, add, avg = 0 }) {
  return (
    <article className="product-card">
      <button className="product-image" onClick={() => open(p)}>
        {p.image ? <img src={p.image} alt={p.name} /> : <div className="img-ph">CL-{String(p.id).padStart(2, '0')}</div>}
        <span className="product-tag">{p.tag}</span>
      </button>
      <div className="product-info">
        <div className="product-topline">
          <small>{p.brand} · {p.type}</small>
          <span className="item-code">#{String(index).padStart(2, '0')}</span>
        </div>
        <button className="product-name" onClick={() => open(p)}>{p.name}</button>
        {avg > 0 && <span className="rate">{stars(avg)} {avg.toFixed(1)}</span>}
        <div className="product-bottom">
          <b>{money(p.price)}</b>
          <button onClick={() => add(p)} aria-label={`Agregar ${p.name}`}>Agregar</button>
        </div>
      </div>
    </article>
  );
}

function Address() {
  return (
    <address className="address">
      <b>{STORE.place}</b><br />
      {STORE.street}<br />
      {STORE.city}<br />
      <a href={STORE.map} target="_blank" rel="noreferrer">Abrir ubicación en mapa</a><br />
      <small>Domicilio de referencia del proyecto académico.</small>
    </address>
  );
}

function Advice({ onSave, citas }) {
  const [sent, setSent] = useState(false);
  const [fecha, setFecha] = useState('');
  const submit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    onSave({ nombre: f.get('nombre'), correo: f.get('correo'), instrumento: f.get('instrumento'), fecha: f.get('fecha'), horario: f.get('horario'), notas: f.get('notas') });
    setSent(true);
  };
  return (
    <section className="page-section">
      <div className="advice-page">
        <div>
          <div className="eyebrow">ASESORÍA 1 A 1</div>
          <h1>Hablemos de tu próximo instrumento.</h1>
          <p className="lead">Agenda una sesión breve por videollamada para resolver dudas sobre ergonomía, calibres de cuerda, amplificación o presupuesto.</p>
          <div className="advice-points">
            <p>— Comparativa directa según tu nivel actual</p>
            <p>— Recomendaciones ajustadas a un presupuesto real</p>
            <p>— Sin compromiso de compra</p>
          </div>
        </div>
        {sent ? (
          <div className="form-card success">
            <div className="success-tag">CITA AGENDADA</div>
            <h2>Solicitud registrada</h2>
            <p>Tu sesión quedó guardada en Mi cuenta (demostración). En producción recibirás el enlace de videollamada en tu correo.</p>
          </div>
        ) : (
          <form className="form-card" onSubmit={submit}>
            <h2>Reservar horario</h2>
            <label>Nombre completo<input name="nombre" required placeholder="Tu nombre" /></label>
            <label>Correo electrónico<input name="correo" type="email" required placeholder="tu@correo.com" /></label>
            <label>Instrumento de interés
              <select name="instrumento">
                <option>Guitarra acústica</option>
                <option>Guitarra clásica</option>
                <option>Guitarra eléctrica</option>
                <option>Bajo eléctrico</option>
                <option>Aún estoy indeciso</option>
              </select>
            </label>
            <label>Fecha preferida
              <input name="fecha" type="date" required value={fecha} onChange={e => setFecha(e.target.value)} min={new Date().toISOString().split('T')[0]} max={new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0]} />
            </label>
            <label>Horario
              <select name="horario">
                {HORARIOS.map(h => {
                  const taken = citas.some(c => c.fecha === fecha && c.horario === h);
                  return <option key={h} value={h} disabled={taken}>{h}{taken ? ' (ocupado)' : ''}</option>;
                })}
              </select>
            </label>
            <label>Notas adicionales<textarea name="notas" rows="3" placeholder="Géneros que escuchas, experiencia previa o presupuesto aproximado..." /></label>
            <label className="check"><input type="checkbox" required /><span>Acepto el aviso de privacidad para coordinar la asesoría.</span></label>
            <button className="primary-btn full">Confirmar cita</button>
            <small>Formulario demostrativo; los datos se almacenan localmente en tu navegador.</small>
          </form>
        )}
      </div>
    </section>
  );
}

function Account({ orders, citas, user, setUser, puntos, go }) {
  const [tab, setTab] = useState('pedidos');
  const [saved, setSaved] = useState(false);
  const tabs = [['pedidos', 'Pedidos'], ['citas', 'Asesorías'], ['puntos', 'Puntos'], ['datos', 'Perfil']];
  const fecha = iso => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const empty = (text, to, label) => <div className="empty-state"><p>{text}</p><button className="primary-btn" onClick={() => go(to)}>{label}</button></div>;
  return (
    <section className="page-section narrow">
      <div className="eyebrow">ÁREA PERSONAL</div>
      <h1>Mi cuenta</h1>
      <p className="lead">Historial guardado localmente en este navegador (entorno de demostración).</p>
      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'tab on' : 'tab'} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === 'pedidos' && (orders.length ? orders.map(o => <div className="row-card" key={o.id}><b>{o.id}</b> · {fecha(o.fecha)}<p>{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</p><strong>{money(o.total)}</strong> <small>Estado: pendiente (demo)</small>{o.factura && <p><small>Factura solicitada · RFC {o.factura.rfc} · {o.factura.uso}</small></p>}</div>) : empty('Aún no tienes pedidos registrados.', 'catalogo', 'Explorar catálogo'))}
      {tab === 'citas' && (citas.length ? citas.map(c => <div className="row-card" key={c.id}><b>{fecha(c.fecha + 'T12:00:00')}</b> · {c.horario}<p>{c.instrumento}</p><small>Estado: agendada (demo)</small></div>) : empty('No tienes asesorías programadas.', 'asesoria', 'Agendar asesoría'))}
      {tab === 'puntos' && <div className="row-card"><div className="points">{puntos}</div><p>puntos acumulados (1 punto por cada $100 de compra y 10 por reseña publicada).</p></div>}
      {tab === 'datos' && <form className="form-card" onSubmit={e => { e.preventDefault(); const f = new FormData(e.target); setUser({ nombre: f.get('nombre'), correo: f.get('correo'), telefono: f.get('telefono') }); setSaved(true); }}><label>Nombre completo<input name="nombre" defaultValue={user.nombre || ''} /></label><label>Correo electrónico<input name="correo" type="email" defaultValue={user.correo || ''} /></label><label>Teléfono<input name="telefono" defaultValue={user.telefono || ''} /></label><button className="primary-btn full">Guardar cambios</button>{saved && <small role="status">Cambios guardados.</small>}</form>}
    </section>
  );
}

function Reviews({ product, list, canReview, onAdd }) {
  const rows = list.filter(r => r.productId === product.id);
  const avg = rows.length ? rows.reduce((n, r) => n + r.calificacion, 0) / rows.length : 0;
  return (
    <>
      <h3 className="spec-title">Opiniones de compradores</h3>
      {rows.length ? (
        <>
          <p className="rate-big">{stars(avg)} <b>{avg.toFixed(1)}</b> <small>({rows.length})</small></p>
          {rows.map(r => (
            <div className="review" key={r.id}>
              <b>{stars(r.calificacion)}</b> <small>Compra verificada · {new Date(r.fecha).toLocaleDateString('es-MX')}</small>
              <p>{r.comentario}</p>
            </div>
          ))}
        </>
      ) : <p className="form-note">Este modelo aún no cuenta con reseñas.</p>}
      {canReview ? (
        <form className="review-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.target); onAdd({ id: Date.now(), productId: product.id, calificacion: +f.get('calificacion'), comentario: f.get('comentario'), fecha: new Date().toISOString() }); e.target.reset(); }}>
          <label>Calificación<select name="calificacion" defaultValue="5">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} de 5</option>)}</select></label>
          <label>Comentario<textarea name="comentario" rows="3" required /></label>
          <button className="secondary-btn">Publicar opinión</button>
        </form>
      ) : <p className="form-note">Solo disponible para clientes con compra verificada de este artículo.</p>}
    </>
  );
}

const LEGAL = {
  privacidad: ['Aviso de privacidad', [
    ['Responsable', `Cuerda Libre, con domicilio en ${STORE.place}, ${STORE.street}, ${STORE.city}, es responsable del tratamiento de tus datos personales.`],
    ['Datos que recabamos', 'Nombre, correo y teléfono; domicilio de entrega; datos fiscales si solicitas factura; y datos de uso del sitio. No guardamos los datos completos de tu tarjeta, porque el pago lo procesa una pasarela autorizada, y no solicitamos datos sensibles.'],
    ['Para qué los usamos', 'Finalidades necesarias: procesar y entregar tus pedidos, facturar, agendar y realizar asesorías, y atender garantías y devoluciones. Finalidades adicionales, que requieren tu consentimiento: enviarte novedades y mejorar el sitio con analítica y con un asesor virtual con inteligencia artificial.'],
    ['Tus derechos', 'Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), y oponerte al tratamiento automatizado. Solicítalo desde la página de Derechos ARCO.'],
    ['Menores de edad', 'Si eres menor de 18 años, necesitas la autorización de tu madre, padre o tutor para comprar o registrar tus datos.'],
    ['Cambios y autoridad', 'Publicaremos los cambios de este aviso en esta página. La autoridad en materia de protección de datos personales es la Secretaría Anticorrupción y Buen Gobierno.']]],
  terminos: ['Términos y condiciones', [
    ['Alcance', 'Cuerda Libre vende instrumentos musicales y accesorios en línea. Por ahora solo realizamos ventas y envíos dentro de México.'],
    ['Precios', 'Los precios están en pesos mexicanos e incluyen IVA. El costo de envío se muestra antes de pagar. Los meses sin intereses aplican con tarjetas participantes.'],
    ['Pedido y pago', 'Tu pedido se confirma cuando se aprueba el pago. El pago lo procesa una pasarela autorizada y nosotros no almacenamos los datos completos de tu tarjeta.'],
    ['Entrega y riesgo', 'El riesgo de pérdida o daño corresponde a Cuerda Libre hasta que recibes el producto. Revisa el empaque al recibirlo y repórtanos cualquier daño dentro de las primeras 48 horas, con fotografías.'],
    ['Garantía y devoluciones', 'Aplica nuestra política de devoluciones. Estos términos no limitan los derechos que la ley mexicana te otorga como consumidor.'],
    ['Marcas e imágenes', 'Las marcas y nombres de productos pertenecen a sus titulares. Las imágenes del sitio pueden ser ilustrativas.'],
    ['Mayoría de edad', 'Para comprar debes ser mayor de edad o contar con autorización de tu madre, padre o tutor.'],
    ['Ley aplicable y quejas', 'Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Puedes presentar tus quejas ante la Procuraduría Federal del Consumidor.']]],
  devoluciones: ['Política de devoluciones', [
    ['Plazo', 'Puedes solicitar la devolución dentro de los primeros 7 días posteriores a la entrega.'],
    ['Condiciones', 'El instrumento debe estar sin uso indebido, completo y en su empaque original. Los costos de envío de la devolución corren por cuenta del cliente, salvo que el producto tenga un defecto.'],
    ['Reembolso', 'Reembolsamos el precio pagado por el mismo medio de pago, una vez que recibimos y revisamos el producto.'],
    ['Producto defectuoso o dañado', 'Si el producto llega dañado o con un defecto de fabricación, puedes elegir entre la reposición o la devolución de lo pagado, sin costo para ti. Repórtalo dentro de las primeras 48 horas con fotografías del empaque y del instrumento.'],
    ['Cómo solicitarla', 'Solicítala desde la sección de Asesoría o en nuestro contacto de la página de Ayuda, con tu número de pedido.']]]
};

function Legal({ kind, go }) {
  const [title, parts] = LEGAL[kind];
  return (
    <section className="page-section narrow legal">
      <div className="eyebrow">DOCUMENTACIÓN LEGAL</div>
      <h1>{title}</h1>
      <p className="form-note">Texto de referencia para el proyecto académico; debe revisarse con un abogado antes de operar la tienda.</p>
      {parts.map(([h, t]) => <div key={h}><h3>{h}</h3><p>{t}</p></div>)}
      <div className="legal-links">
        {kind !== 'privacidad' && <button className="link" onClick={() => go('privacidad')}>Aviso de privacidad</button>}
        {kind !== 'terminos' && <button className="link" onClick={() => go('terminos')}>Términos y condiciones</button>}
        {kind !== 'devoluciones' && <button className="link" onClick={() => go('devoluciones')}>Devoluciones</button>}
        <button className="link" onClick={() => go('arco')}>Derechos ARCO</button>
      </div>
    </section>
  );
}

function Arco({ arcos, onSave }) {
  const [folio, setFolio] = useState('');
  const submit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const id = 'ARCO-' + String(arcos.length + 1).padStart(4, '0');
    onSave({ id, nombre: f.get('nombre'), correo: f.get('correo'), derecho: f.get('derecho'), descripcion: f.get('descripcion'), fecha: new Date().toISOString(), estatus: 'recibida' });
    setFolio(id);
  };
  return (
    <section className="page-section narrow">
      <div className="eyebrow">PROTECCIÓN DE DATOS</div>
      <h1>Solicitud de derechos ARCO</h1>
      <p className="lead">Ejerce tu derecho de acceso, rectificación, cancelación u oposición sobre tus datos personales, así como oposición al tratamiento automatizado.</p>
      {folio ? (
        <div className="form-card success">
          <div className="success-tag">FOLIO GENERADO</div>
          <h2>Folio {folio}</h2>
          <p>Versión de demostración: la solicitud quedó registrada en el almacenamiento local de tu navegador.</p>
        </div>
      ) : (
        <form className="form-card" onSubmit={submit}>
          <label>Nombre completo<input name="nombre" required /></label>
          <label>Correo electrónico<input name="correo" type="email" required /></label>
          <label>Derecho a ejercer
            <select name="derecho">
              <option>Acceso</option>
              <option>Rectificación</option>
              <option>Cancelación</option>
              <option>Oposición</option>
              <option>Oposición al tratamiento automatizado</option>
            </select>
          </label>
          <label>Descripción de la solicitud<textarea name="descripcion" rows="4" required /></label>
          <button className="primary-btn full">Registrar solicitud</button>
        </form>
      )}
    </section>
  );
}

export default App;

