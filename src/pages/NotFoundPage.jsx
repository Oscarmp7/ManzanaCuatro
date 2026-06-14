import { Link } from 'react-router'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <section className="page not-found-page">
      <h1>Página no encontrada</h1>
      <p>La ruta que intentaste abrir no existe o fue movida.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
