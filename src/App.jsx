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
  { id: 1, name: 'Yamaha F310', type: 'Acústicas', brand: 'Yamaha', price: 3899, tag: 'Más vendido', image: '/img/yamaha.jpg', description: 'Una guitarra acústica de estilo tradicional, pensada para quienes quieren comenzar a tocar o tener un instrumento confiable para practicar. Su formato ofrece una presencia sonora amplia y equilibrada, adecuada para acompañar la voz y explorar distintos repertorios.', sound: 'Sonido acústico cálido y natural, apropiado para rasgueos, acordes abiertos y acompañamiento.', ideal: 'Principiantes y músicos que buscan una guitarra sencilla para practicar, componer y tocar en reuniones.' },
  { id: 2, name: 'Fender Player Stratocaster', type: 'Eléctricas', brand: 'Fender', price: 18999, tag: 'Favorita', image: '/img/fender.jpg', description: 'La Stratocaster es uno de los diseños más reconocibles de la guitarra eléctrica. Su ergonomía y versatilidad la convierten en una opción para explorar desde sonidos limpios y definidos hasta tonos con saturación, dependiendo del amplificador y los efectos utilizados.', sound: 'Carácter brillante y articulado, con gran flexibilidad para cambiar de matices y estilos.', ideal: 'Guitarristas que disfrutan del rock, blues, pop, funk y otros géneros que requieren variedad tonal.' },
  { id: 3, name: 'Cordoba C5', type: 'Clásicas', brand: 'Cordoba', price: 7299, tag: 'Ideal para empezar', image: '/img/cordoba.jpg', description: 'Una guitarra clásica de cuerdas de nylon, adecuada para desarrollar técnica, coordinación y control de ambas manos. La tensión y tacto característicos de este tipo de cuerdas ofrecen una experiencia cómoda para estudiar y acercarse a la música clásica o latinoamericana.', sound: 'Timbre suave, redondo y cálido, especialmente apropiado para tocar con los dedos.', ideal: 'Estudiantes, principiantes y guitarristas interesados en repertorio clásico, flamenco inicial o música acústica latina.' },
  { id: 4, name: 'Ibanez GSR200', type: 'Bajos', brand: 'Ibanez', price: 6999, tag: 'Gran sonido', image: '/img/ibanez.jpg', description: 'Un bajo eléctrico de cuatro cuerdas diseñado para ofrecer una plataforma accesible con la que construir una base rítmica sólida. Su formato familiar facilita el aprendizaje de líneas de bajo, escalas y acompañamientos en una banda.', sound: 'Graves definidos y una respuesta versátil para sostener el ritmo y complementar guitarras y batería.', ideal: 'Personas que comienzan a tocar el bajo y músicos que buscan un instrumento práctico para ensayo y aprendizaje.' },
  { id: 5, name: 'Epiphone Les Paul Special', type: 'Eléctricas', brand: 'Epiphone', price: 8999, tag: 'Recomendado', image: '/img/epi.jpg', description: 'Inspirada en la familia Les Paul, esta guitarra eléctrica apuesta por una estética clásica y una experiencia directa. Es una alternativa atractiva para quienes buscan un instrumento con personalidad para tocar riffs, acordes potentes y melodías principales.', sound: 'Tono con cuerpo y presencia, especialmente atractivo para rock y estilos que utilizan amplificación y efectos.', ideal: 'Guitarristas principiantes o intermedios que se inclinan por rock, hard rock, punk y sonidos eléctricos contundentes.' },
  { id: 6, name: 'Taylor Academy 10', type: 'Acústicas', brand: 'Taylor', price: 14999, tag: 'Calidad premium', image: '/img/taylor.jpg', description: 'Una acústica de enfoque cómodo y diseño cuidado, pensada para acompañar sesiones de práctica, composición y presentaciones. Su formato tradicional permite trabajar tanto patrones de rasgueo como arreglos de guitarra solista.', sound: 'Sonido acústico claro y balanceado, útil para mantener definición en acordes y melodías.', ideal: 'Músicos que buscan dar un paso adelante en comodidad y calidad para tocar en casa, componer o presentarse.' },
  { id: 7, name: 'Juego de cuerdas para acústica', type: 'Accesorios', brand: 'Genérico', price: 249, tag: 'Esencial', image: '/img/juego.jpg', description: 'Juego de seis cuerdas de acero para guitarra acústica. Conviene cambiarlas cada dos o tres meses para mantener un sonido brillante y una afinación estable.', sound: 'Sonido brillante y definido en acordes y melodías.', ideal: 'Cualquier guitarrista de acústica que quiera renovar el sonido de su instrumento.' },
  { id: 8, name: 'Afinador de clip', type: 'Accesorios', brand: 'Genérico', price: 299, tag: 'Para empezar', image: '/img/afinador.jpg', description: 'Afinador de clip que se coloca en la cabeza de la guitarra y detecta la vibración del instrumento, por lo que funciona incluso en lugares con ruido.', sound: 'No aplica: detecta la vibración de las cuerdas.', ideal: 'Principiantes y músicos que afinan antes de cada práctica o presentación.' }
];

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };
const PAGES = ['inicio','catalogo','asesoria','aprende','ayuda','carrito','cuenta'];
const parseHash = () => {
  const h = window.location.hash.slice(1);
  const m = h.match(/^producto-(\d+)$/);
  const p = m && products.find(x => x.id === +m[1]);
  return p ? ['producto', p] : [PAGES.includes(h) ? h : 'inicio', null];
};
const money = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const msi = n => n >= 2000 ? `Hasta 12 meses sin intereses de ${money(Math.round(n / 12))}` : '';
const SHIPPING = 199; // costo de envío estimado de demostración (MXN)
const STORE = {
  place: 'Facultad de Ingeniería, UNAM',
  street: 'Av. Universidad 3000, Circuito Escolar s/n, Ciudad Universitaria',
  city: 'Coyoacán, 04510 Ciudad de México',
  map: 'https://www.google.com/maps/search/?api=1&query=Facultad+de+Ingenier%C3%ADa+UNAM'
};

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

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

  const filtered = useMemo(() => products.filter(p =>
    (category === 'Todas' || p.type === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.id - b.id), [category, search, sort]);

  const addToCart = product => {
    setCart(c => c.some(i => i.id === product.id) ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }]);
    setNotice(`${product.name} se agregó al carrito`);
    setTimeout(() => setNotice(''), 2400);
  };

  const go = next => { window.location.hash = next; };
  const openProduct = product => { window.location.hash = 'producto-' + product.id; };
  useEffect(() => {
    const onHash = () => { const [pg, p] = parseHash(); setPage(pg); if (p) setSelected(p); setPhoto(0); setOrdered(false); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [page, selected.id]);
  useEffect(() => save('cl_cart', cart), [cart]);
  useEffect(() => save('cl_orders', orders), [orders]);
  useEffect(() => save('cl_citas', citas), [citas]);
  useEffect(() => save('cl_user', user), [user]);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const changeQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const puntos = orders.reduce((n, o) => n + Math.floor(o.subtotal / 100), 0);
  const placeOrder = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const order = { id: 'CL-' + String(orders.length + 1).padStart(4, '0'), fecha: new Date().toISOString(), items: cart, subtotal, envio: SHIPPING, total: subtotal + SHIPPING, nombre: f.get('nombre'), domicilio: f.get('domicilio') };
    setOrders(o => [order, ...o]); setCart([]); setOrdered(order.id);
  };

  return <div className="app-shell">
    <div className="top-strip">Envíos a todo México · Asesoría gratuita para encontrar tu sonido</div>
    <header className="header">
      <button className="brand" onClick={() => go('inicio')} aria-label="Ir al inicio">
        <span className="brand-mark">♪</span><span>CUERDA<span className="brand-light">LIBRE</span><small>ENCUENTRA TU SONIDO</small></span>
      </button>
      <nav className="nav">
        {['inicio','catalogo','asesoria','aprende','ayuda'].map(item =>
          <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} onClick={() => go(item)}>
            {{inicio:'Inicio',catalogo:'Catálogo',asesoria:'Asesoría',aprende:'Aprende',ayuda:'Ayuda'}[item]}
          </button>
        )}
      </nav>
      <div className="header-actions">
        <button className="icon-btn" onClick={() => go('cuenta')} title="Mi cuenta">♙</button>
        <button className="cart-btn" onClick={() => go('carrito')}>Carrito <span>{count}</span></button>
      </div>
    </header>

    {notice && <div className="notice" role="status">{notice}</div>}

    <main>
      {page === 'inicio' && <Home go={go} setCategory={setCategory} setSearch={setSearch} openProduct={openProduct} addToCart={addToCart} />}
      {page === 'catalogo' && <section className="page-section">
        <div className="eyebrow">EXPLORA NUESTRA SELECCIÓN</div><h1>Encuentra tu instrumento</h1>
        <p className="lead">Instrumentos para cada etapa de tu camino musical.</p>
        <div className="catalog-tools">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o marca..." />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {['Todas','Acústicas','Clásicas','Eléctricas','Bajos','Accesorios'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar"><option value="">Ordenar por</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option></select>
        </div>
        <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} p={p} open={openProduct} add={addToCart} />)}</div>
        {filtered.length === 0 && <p>No encontramos productos con esos filtros.</p>}
      </section>}
      {page === 'producto' && <section className="page-section product-detail">
        <button className="back-link" onClick={() => go('catalogo')}>← Volver al catálogo</button>
        <div className="detail-grid"><div className="gallery">{(selected.images?.[photo] || selected.image) ? <img src={selected.images?.[photo] || selected.image} alt={selected.name} /> : <div className="img-ph detail-ph" role="img" aria-label={selected.name}>♪</div>}{selected.images?.length > 1 && <div className="thumbs">{selected.images.map((src, i) => <button key={src} className={i === photo ? 'on' : ''} onClick={() => setPhoto(i)} aria-label={`Foto ${i + 1}`}><img src={src} alt="" /></button>)}</div>}</div>
          <div><div className="eyebrow">{selected.brand} · {selected.type}</div><h1>{selected.name}</h1>
            <div className="price detail-price">{money(selected.price)}</div>{msi(selected.price) && <p className="msi">{msi(selected.price)} con tarjetas participantes. Precio en MXN, IVA incluido.</p>}<p className="detail-description">{selected.description}</p><div className="detail-extra"><h3>Sonido y personalidad</h3><p>{selected.sound}</p><h3>¿Para quién es?</h3><p>{selected.ideal}</p></div>
            <h3 className="spec-title">Especificaciones</h3><table className="spec-table"><tbody><tr><td>Marca</td><td>{selected.brand}</td></tr><tr><td>Tipo</td><td>{selected.type}</td></tr><tr><td>Condición</td><td>Nuevo</td></tr><tr><td>Ficha técnica completa</td><td>Próximamente</td></tr></tbody></table><h3 className="spec-title">Reseñas</h3><p className="form-note">Aún no hay reseñas. Solo publicaremos reseñas de clientes que hayan comprado el producto.</p><ul className="spec-list"><li>✓ Producto nuevo y garantizado</li><li>✓ Envíos a todo México</li><li>✓ Asesoría personalizada gratuita</li></ul>
            <button className="primary-btn" onClick={() => addToCart(selected)}>Agregar al carrito</button>
            <button className="secondary-btn" onClick={() => go('asesoria')}>Hablar con un asesor</button>{selected.audio ? <audio className="player" controls preload="none" src={selected.audio} aria-label="Escucha cómo suena" /> : <button className="secondary-btn" onClick={() => setNotice('La muestra de audio real de este instrumento se agregará pronto.')}>▶ Escucha cómo suena</button>}
          </div>
        </div>
      </section>}
      {page === 'asesoria' && <Advice onSave={c => setCitas(x => [{ id: Date.now(), ...c }, ...x])} />}
      {page === 'carrito' && <section className="page-section"><div className="eyebrow">TU COMPRA</div><h1>Tu carrito</h1>
        {ordered ? <div className="form-card success narrow"><div className="success-icon">✓</div><h2>¡Pedido registrado!</h2><p>Tu número de pedido de demostración es <b>{ordered}</b>. Puedes consultarlo en Mi cuenta.</p><button className="primary-btn" onClick={() => go('cuenta')}>Ver mis pedidos</button></div>
        : cart.length === 0 ? <div className="empty-state"><div className="empty-icon">♫</div><h2>Tu carrito está esperando música</h2><p>Explora el catálogo y agrega tus instrumentos favoritos.</p><button className="primary-btn" onClick={() => go('catalogo')}>Explorar catálogo</button></div> :
          <div className="cart-layout"><div className="cart-items">{cart.map(i => <div className="cart-item" key={i.id}>{i.image ? <img src={i.image} alt={i.name} /> : <div className="img-ph mini">♪</div>}<div><b>{i.name}</b><p>{i.brand}</p><strong>{money(i.price * i.qty)}</strong><div className="qty"><button aria-label="Quitar una pieza" onClick={() => changeQty(i.id, -1)}>−</button><span>{i.qty}</span><button aria-label="Agregar una pieza" onClick={() => changeQty(i.id, 1)}>+</button></div></div><button onClick={() => setCart(c => c.filter(x => x.id !== i.id))}>Quitar</button></div>)}</div>
          <aside className="summary"><h3>Resumen</h3><div className="summary-line"><span>Productos ({count})</span><b>{money(subtotal)}</b></div><div className="summary-line"><span>Envío estándar (estimado)</span><b>{money(SHIPPING)}</b></div><hr/><div className="summary-line total"><b>Total</b><b>{money(subtotal + SHIPPING)}</b></div>
          <form className="ship-form" onSubmit={placeOrder}><label>Nombre completo<input name="nombre" required /></label><label>Domicilio de entrega<input name="domicilio" required placeholder="Calle, número, colonia y CP" /></label><label className="check"><input type="checkbox" required /><span>He leído el <button type="button" className="link" onClick={() => go('ayuda')}>aviso de privacidad</button> y acepto las condiciones de compra.</span></label><button className="primary-btn full">Confirmar pedido (demo)</button></form>
          <small>Precios en MXN con IVA incluido. Prototipo académico: no se realiza ningún cobro.</small></aside></div>}
      </section>}
      {page === 'cuenta' && <Account orders={orders} citas={citas} user={user} setUser={setUser} puntos={puntos} go={go} />}
      {page === 'aprende' && <section className="page-section narrow"><div className="eyebrow">GUÍAS PARA EMPEZAR</div><h1>Aprende y elige con confianza</h1><p className="lead">Guías breves para tu primera compra.</p><div className="faq"><details><summary>¿Acústica, clásica o eléctrica?</summary><p>La clásica usa cuerdas de nylon, más suaves para los dedos. La acústica usa cuerdas de acero y suena más fuerte, ideal para rasguear. La eléctrica necesita amplificador y tiene un mástil más delgado, pensada para rock, blues y pop.</p></details><details><summary>¿Qué necesito además de la guitarra?</summary><p>Un afinador, un juego de cuerdas de repuesto y una funda. Si es eléctrica, también un amplificador y un cable.</p></details><details><summary>Cuidado y afinación básicos</summary><p>Afina tu guitarra cada vez que la toques, guárdala en su funda lejos de la humedad y cambia las cuerdas cada dos o tres meses.</p></details></div></section>}
      {page === 'ayuda' && <section className="page-section narrow"><div className="eyebrow">ESTAMOS PARA AYUDARTE</div><h1>¿Cómo podemos ayudarte?</h1><div className="faq"><details><summary>¿Realizan envíos a todo México?</summary><p>Sí, nuestro objetivo es ofrecer envíos a toda la República Mexicana, con paquetería asegurada. Por ahora solo vendemos dentro de México.</p></details><details><summary>¿Puedo recibir ayuda para elegir una guitarra?</summary><p>Claro. Puedes solicitar una asesoría gratuita desde la sección Asesoría.</p></details><details><summary>¿Puedo escuchar cómo suena un instrumento?</summary><p>Estamos preparando fichas de producto con muestras de audio.</p></details><details><summary>Envíos y devoluciones</summary><p>Puedes solicitar la devolución dentro de los primeros 7 días posteriores a la entrega, con el instrumento sin uso indebido y en su empaque original. Los términos completos se publicarán antes de abrir la tienda.</p></details><details><summary>Aviso de privacidad</summary><p>Usamos tus datos solo para procesar pedidos, coordinar envíos y agendar asesorías. Podrás ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO). El texto completo del aviso se publicará conforme a la ley mexicana de protección de datos.</p></details><details open><summary>Contacto y domicilio</summary><Address /></details></div></section>}
    </main>

    <footer className="footer"><div className="footer-main"><div className="footer-brand"><div className="footer-logo">♪ CUERDA LIBRE</div><p>Tu música comienza con el instrumento correcto.</p></div><div><b>Explora</b><button onClick={() => go('catalogo')}>Catálogo</button><button onClick={() => go('asesoria')}>Asesoría</button><button onClick={() => go('aprende')}>Aprende</button></div><div><b>Atención</b><button onClick={() => go('ayuda')}>Preguntas frecuentes</button><button onClick={() => go('ayuda')}>Aviso de privacidad</button><button onClick={() => go('cuenta')}>Mi cuenta</button></div><div><b>Domicilio</b><Address /></div></div><div className="footer-bottom">© 2026 Cuerda Libre · Proyecto académico · Precios en MXN con IVA incluido · Última actualización: {lastModified}</div></footer>
  </div>;
}

function Home({go, setCategory, setSearch, openProduct, addToCart}) {
  const [q, setQ] = useState('');
  return <>
    <form className="home-search" onSubmit={e => { e.preventDefault(); setSearch(q); go('catalogo'); }}><input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar guitarras, bajos, accesorios..." aria-label="Buscar" /><button className="primary-btn">Buscar</button></form>
    <section className="hero"><div className="hero-copy"><div className="eyebrow light">EL SONIDO QUE ESTÁS BUSCANDO</div><h1>Tu música.<br/><em>Tu instrumento.</em><br/>Tu historia.</h1><p>Encuentra la guitarra ideal para darle vida a todo lo que llevas dentro.</p><div className="hero-actions"><button className="cream-btn" onClick={() => go('catalogo')}>Explorar instrumentos <span>→</span></button><button className="text-btn" onClick={() => go('asesoria')}>Agenda una asesoría gratuita</button></div></div><div className="hero-image"><div className="hero-badge">ENCUENTRA<br/>TU SONIDO</div></div></section>
    <section className="trust-row"><div><b>Asesoría personalizada</b><span>Te ayudamos a elegir</span></div><div><b> Envíos nacionales</b><span>Tu instrumento hasta tu puerta</span></div><div><b> Pasión por la música</b><span>Para principiantes y expertos</span></div></section>
    <section className="section-pad"><div className="section-heading"><div><div className="eyebrow">EXPLORA POR CATEGORÍA</div><h2>¿Qué sonido buscas?</h2></div><button className="arrow-link" onClick={() => go('catalogo')}>Ver catálogo completo →</button></div>
      <div className="category-grid">{[['Acústicas','Madera, calidez y libertad','/img/acustic.jpg'],['Clásicas','El sonido de siempre','/img/cordoba.jpg'],['Eléctricas','Haz que se escuche tu estilo','/img/electricas.jpg'],['Bajos','El ritmo empieza aquí','/img/bajo.jpg']].map(([name,desc,img])=><button key={name} className="category-card" onClick={()=>{setCategory(name);go('catalogo')}} style={{backgroundImage:`linear-gradient(0deg,rgba(14,29,39,.85),rgba(14,29,39,.05)),url(${img.startsWith('/') ? img : 'https://images.unsplash.com/' + img + '?w=700&q=80'})`}}><span>{name}</span><small>{desc}</small></button>)}</div>
    </section>
    <section className="featured section-pad"><div className="section-heading"><div><div className="eyebrow">SELECCIÓN CUERDA LIBRE</div><h2>Instrumentos destacados</h2></div><button className="arrow-link" onClick={()=>go('catalogo')}>Descubrir más →</button></div><div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p} open={openProduct} add={addToCart}/>)}</div></section>
    <section className="advice-banner"><div><div className="eyebrow light">¿NO SABES POR DÓNDE EMPEZAR?</div><h2>La guitarra ideal<br/>está más cerca de lo que crees.</h2><p>Habla con alguien que entiende de música. Te ayudamos a encontrarla.</p><button className="cream-btn" onClick={()=>go('asesoria')}>Agenda tu asesoría gratuita →</button></div><div className="advice-art">♫</div></section>
  </>;
}

function ProductCard({p,open,add}) {
  return <article className="product-card"><button className="product-image" onClick={()=>open(p)}>{p.image ? <img src={p.image} alt={p.name}/> : <div className="img-ph">♪</div>}<span>{p.tag}</span></button><div className="product-info"><small>{p.brand} · {p.type}</small><button className="product-name" onClick={()=>open(p)}>{p.name}</button><div className="product-bottom"><b>{money(p.price)}</b><button onClick={()=>add(p)} aria-label={`Agregar ${p.name}`}>+</button></div></div></article>;
}

function Address() {
  return <address className="address"><b>{STORE.place}</b><br/>{STORE.street}<br/>{STORE.city}<br/><a href={STORE.map} target="_blank" rel="noreferrer">Ver en el mapa</a><br/><small>Domicilio de referencia del proyecto académico.</small></address>;
}

function Advice({ onSave }) {
  const [sent,setSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    onSave({ nombre: f.get('nombre'), correo: f.get('correo'), instrumento: f.get('instrumento'), fecha: f.get('fecha'), horario: f.get('horario'), notas: f.get('notas') });
    setSent(true);
  };
  return <section className="page-section"><div className="advice-page"><div><div className="eyebrow">ASESORÍA PERSONALIZADA</div><h1>Encontremos tu sonido.</h1><p className="lead">Cuéntanos qué buscas y agenda una videollamada para recibir orientación sobre tu próximo instrumento.</p><div className="advice-points"><p>✓ Atención pensada en tu nivel y estilo</p><p>✓ Recomendaciones según tu presupuesto</p><p>✓ Una experiencia cercana y sin presión</p></div></div>
    {sent ? <div className="form-card success"><div className="success-icon">✓</div><h2>¡Solicitud recibida!</h2><p>Tu cita quedó guardada en Mi cuenta (demostración). En la versión final recibirás por correo el enlace de la videollamada.</p></div> :
    <form className="form-card" onSubmit={submit}><h2>Solicita tu asesoría</h2><label>Nombre completo<input name="nombre" required placeholder="Tu nombre"/></label><label>Correo electrónico<input name="correo" type="email" required placeholder="tu@correo.com"/></label><label>¿Qué instrumento te interesa?<select name="instrumento"><option>Guitarra acústica</option><option>Guitarra clásica</option><option>Guitarra eléctrica</option><option>Bajo</option><option>Aún no lo sé</option></select></label><label>Fecha preferida<input name="fecha" type="date" required min={new Date().toISOString().split('T')[0]}/></label><label>Horario<select name="horario"><option>11:00</option><option>13:00</option><option>17:00</option></select></label><label>Cuéntanos un poco más<textarea name="notas" rows="3" placeholder="Tu experiencia, estilo musical o presupuesto..."/></label><label className="check"><input type="checkbox" required/><span>Acepto el aviso de privacidad para recibir la asesoría.</span></label><button className="primary-btn full">Enviar solicitud</button><small>Formulario demostrativo; los datos se guardan solo en tu navegador.</small></form>}</div></section>;
}

function Account({ orders, citas, user, setUser, puntos, go }) {
  const [tab, setTab] = useState('pedidos');
  const [saved, setSaved] = useState(false);
  const tabs = [['pedidos','Mis pedidos'],['citas','Mis citas'],['puntos','Mis puntos'],['datos','Datos personales']];
  const fecha = iso => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const empty = (text, to, label) => <div className="empty-state"><p>{text}</p><button className="primary-btn" onClick={() => go(to)}>{label}</button></div>;
  return <section className="page-section narrow"><div className="eyebrow">TU ESPACIO</div><h1>Mi cuenta</h1><p className="lead">Tu información se guarda solo en este navegador (versión de demostración).</p>
    <div className="tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'tab on' : 'tab'} onClick={() => setTab(k)}>{l}</button>)}</div>
    {tab === 'pedidos' && (orders.length ? orders.map(o => <div className="row-card" key={o.id}><b>{o.id}</b> · {fecha(o.fecha)}<p>{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</p><strong>{money(o.total)}</strong> <small>Estado: pendiente (demo)</small></div>) : empty('Aún no tienes pedidos.', 'catalogo', 'Explorar catálogo'))}
    {tab === 'citas' && (citas.length ? citas.map(c => <div className="row-card" key={c.id}><b>{fecha(c.fecha + 'T12:00:00')}</b> · {c.horario}<p>{c.instrumento}</p><small>Estado: agendada (demo)</small></div>) : empty('Aún no tienes asesorías agendadas.', 'asesoria', 'Agendar asesoría'))}
    {tab === 'puntos' && <div className="row-card"><div className="points">{puntos}</div><p>puntos acumulados. Ganas 1 punto por cada $100 de compra.</p></div>}
    {tab === 'datos' && <form className="form-card" onSubmit={e => { e.preventDefault(); const f = new FormData(e.target); setUser({ nombre: f.get('nombre'), correo: f.get('correo'), telefono: f.get('telefono') }); setSaved(true); }}><label>Nombre completo<input name="nombre" defaultValue={user.nombre || ''} /></label><label>Correo electrónico<input name="correo" type="email" defaultValue={user.correo || ''} /></label><label>Teléfono<input name="telefono" defaultValue={user.telefono || ''} /></label><button className="primary-btn full">Guardar datos</button>{saved && <small role="status">Datos guardados.</small>}</form>}
  </section>;
}

export default App;
