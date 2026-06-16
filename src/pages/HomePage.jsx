import HomeReel from '../components/HomeReel/HomeReel'
import HomeClientBand from '../components/HomeClientBand/HomeClientBand'
import HomeEndFrame from '../components/HomeEndFrame/HomeEndFrame'

export default function HomePage({ ready, firstLoad = false }) {
  return (
    <>
      <HomeReel ready={ready} firstLoad={firstLoad} />
      <HomeClientBand />
      <HomeEndFrame />
    </>
  )
}
