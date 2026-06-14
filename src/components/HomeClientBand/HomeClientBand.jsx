import { siteContent } from '../../data/siteContent'
import './HomeClientBand.css'

const clients = siteContent.clients.map((client) => client.name)

function ClientGroup({ ariaHidden = false }) {
  return (
    <div className="home-client-band__group" aria-hidden={ariaHidden}>
      {clients.map((client) => (
        <span key={client} className="home-client-band__item">
          {client}
        </span>
      ))}
    </div>
  )
}

export default function HomeClientBand() {
  return (
    <section className="home-client-band" aria-label="Clientes de Manzana Cuatro">
      <div className="home-client-band__viewport">
        <div className="home-client-band__track">
          <ClientGroup />
          <ClientGroup ariaHidden />
          <ClientGroup ariaHidden />
          <ClientGroup ariaHidden />
        </div>
      </div>
    </section>
  )
}
