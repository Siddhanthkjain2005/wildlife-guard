'use client'

import { useState, useEffect,useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Info,
  Volume2,
  Sparkles,
  Target,
  Shield,
  Database,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('@/components/LocationMap'), { ssr: false })

// ✅ State -> Districts (ONLY those present in your CSV)
const stateDistricts: Record<string, string[]> = {
  Assam: ['Baksa', 'Golaghat', 'Udalguri'],
  Gujarat: ['Junagadh'],
  Karnataka: ['Chamarajanagar', 'Mysuru'],
  Kerala: ['Idukki', 'Palakkad', 'Wayanad'],
  'Madhya Pradesh': ['Mandla', 'Narmadapuram', 'Umaria'],
  Maharashtra: ['Amravati', 'Chandrapur', 'Nagpur'],
  Odisha: ['Mayurbhanj'],
  Rajasthan: ['Sawai Madhopur'],
  'Tamil Nadu': ['Coimbatore', 'Nilgiris', 'Tirunelveli'],
  'Uttar Pradesh': ['Lakhimpur Kheri'],
  Uttarakhand: ['Nainital'],
  'West Bengal': ['Alipurduar', 'South 24 Parganas'],
}

// ✅ District -> Reserves (ONLY those present in your CSV)
const districtReserves: Record<string, string[]> = {
  Baksa: ['Manas'],
  Golaghat: ['Kaziranga'],
  Udalguri: ['Orang'],

  Junagadh: ['Gir'],

  Chamarajanagar: ['BRT', 'Bandipur'],
  Mysuru: ['Nagarhole'],

  Idukki: ['Periyar'],
  Palakkad: ['Silent Valley'],
  Wayanad: ['Wayanad'],

  Mandla: ['Kanha'],
  Narmadapuram: ['Satpura'],
  Umaria: ['Bandhavgarh'],

  Amravati: ['Melghat'],
  Chandrapur: ['Tadoba-Andhari'],
  Nagpur: ['Pench MH'],

  Mayurbhanj: ['Similipal'],

  'Sawai Madhopur': ['Ranthambore'],

  Coimbatore: ['Anamalai'],
  Nilgiris: ['Mudumalai'],
  Tirunelveli: ['Kalakad-Mundanthurai'],

  'Lakhimpur Kheri': ['Dudhwa'],

  Nainital: ['Corbett'],

  Alipurduar: ['Buxa'],
  'South 24 Parganas': ['Sundarbans'],
}

// ✅ District Coordinates (Fallback only)
const districtCoords: Record<string, [number, number]> = {
  Baksa: [26.7191, 91.0256],
  Golaghat: [26.5775, 93.1711],
  Udalguri: [26.567, 92.3315],

  Junagadh: [21.124, 70.824],

  Chamarajanagar: [11.6544, 76.6295],
  Mysuru: [12.0, 76.1],

  Idukki: [9.462, 77.241],
  Palakkad: [11.131, 76.425],
  Wayanad: [11.6854, 76.132],

  Mandla: [22.3345, 80.6115],
  Narmadapuram: [22.463, 78.433],
  Umaria: [23.685, 81.04],

  Amravati: [21.396, 77.15],
  Chandrapur: [20.197, 79.301],
  Nagpur: [21.708, 79.33],

  Mayurbhanj: [21.95, 86.35],

  'Sawai Madhopur': [26.0173, 76.5026],

  Coimbatore: [10.396, 77.002],
  Nilgiris: [11.6, 76.5],
  Tirunelveli: [8.53, 77.4],

  'Lakhimpur Kheri': [28.5, 80.57],

  Nainital: [29.53, 78.7747],

  Alipurduar: [26.72, 89.56],
  'South 24 Parganas': [21.9497, 88.7468],
}

// ✅ Reserve coordinates (IMPORTANT FIX ✅)
const reserveCoords: Record<string, [number, number]> = {
  Manas: [26.7191, 91.0256],
  Kaziranga: [26.5775, 93.1711],
  Orang: [26.567, 92.3315],

  Gir: [21.124, 70.824],

  BRT: [11.909297, 77.000465],
  Bandipur: [11.7788, 76.4647],
  Nagarhole: [12.000201, 76.09996],

  Periyar: [9.462, 77.241],
  'Silent Valley': [11.130749, 76.425043],
  Wayanad: [11.685663, 76.132093],

  Kanha: [22.334019, 80.610875],
  Satpura: [22.46306, 78.433226],
  Bandhavgarh: [23.685746, 81.038788],

  Melghat: [21.396263, 77.150086],
  'Tadoba-Andhari': [20.196831, 79.300862],
  'Pench MH': [21.708546, 79.329603],

  Similipal: [21.949817, 86.35033],
  Ranthambore: [26.017381, 76.502589],

  Anamalai: [10.393541, 77.003039],
  Mudumalai: [11.599667, 76.499971],
  'Kalakad-Mundanthurai': [8.530356, 77.399954],

  Dudhwa: [28.500381, 80.570073],
  Corbett: [29.530173, 78.775423],

  Buxa: [26.719749, 89.559893],
  Sundarbans: [21.949722, 88.74679],
}

// ✅ State Centroids (fallback only)
const stateCentroid: Record<string, [number, number]> = {
  Assam: [26.6212, 92.1761],
  Gujarat: [21.124, 70.824],
  Karnataka: [11.8272, 76.3648],
  Kerala: [10.7595, 76.5993],
  'Madhya Pradesh': [22.8275, 80.0282],
  Maharashtra: [21.1003, 78.5937],
  Odisha: [21.95, 86.35],
  Rajasthan: [26.0173, 76.5026],
  'Tamil Nadu': [10.1753, 76.9673],
  'Uttar Pradesh': [28.5, 80.57],
  Uttarakhand: [29.53, 78.7747],
  'West Bengal': [24.3348, 89.1534],
}

export default function PredictPage() {
  const [districts, setDistricts] = useState<string[]>([])
  const [reserves, setReserves] = useState<string[]>([])

  const [formData, setFormData] = useState({
    state: 'Karnataka',
    district: 'Chamarajanagar',
    reserve_name: 'Bandipur',
    latitude: reserveCoords['Bandipur'][0],
    longitude: reserveCoords['Bandipur'][1],

    area_type: 'Core',
    species: 'Tiger',
    season: 'Summer',
    patrol_frequency: 'High',
    past_crimes_1yr_10km: 5,
    past_crimes_3yr_10km: 15,
    distance_to_road_km: 4,
    distance_to_water_km: 2,
    forest_cover_pct: 70,
    night_light_index: 12,
    population_density_sqkm: 300,
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState('location')
  // 🔊 Animal sound logic (ADDED)
const audioRef = useRef<HTMLAudioElement | null>(null)

const soundMap: Record<string, string> = {
  Tiger: '/sounds/tiger.mp3',
  Elephant: '/sounds/elephant.mp3',
  Leopard: '/sounds/leopard.mp3',
  Rhino: '/sounds/rhino.mp3',
  Pangolin: '/sounds/forest.mp3',
  'Sloth Bear': '/sounds/forest.mp3',
  'Spotted Deer': '/sounds/forest.mp3',
  'Wild Dog': '/sounds/forest.mp3',
}

useEffect(() => {
  if (!soundEnabled) {
    audioRef.current?.pause()
    audioRef.current = null
    return
  }

  const src = soundMap[formData.species]
  if (!src) return

  const audio = new Audio(src)
  audio.loop = true
  audio.volume = 0.5
  audio.play().catch(() => {})

  audioRef.current = audio

  return () => {
    audio.pause()
    audio.currentTime = 0
  }
}, [soundEnabled, formData.species])


  // ✅ Utility: get best coords
  const getCoords = (state: string, district: string, reserve: string): [number, number] => {
    if (reserve && reserveCoords[reserve]) return reserveCoords[reserve]
    if (district && districtCoords[district]) return districtCoords[district]
    return stateCentroid[state] || [22, 78]
  }

  // ✅ Update reserves list + set first reserve + coords
  const updateReserves = (state: string, district: string) => {
    const newReserves = districtReserves[district] || ['None']
    setReserves(newReserves)

    const selectedReserve = newReserves[0] && newReserves[0] !== 'None' ? newReserves[0] : ''
    const coord = getCoords(state, district, selectedReserve)

    setFormData((prev) => ({
      ...prev,
      district,
      reserve_name: selectedReserve || 'None',
      latitude: coord[0],
      longitude: coord[1],
    }))
  }

  // ✅ Update districts list + auto pick first district
  const updateDistricts = (state: string) => {
    const newDistricts = stateDistricts[state] || []
    setDistricts(newDistricts)

    if (newDistricts.length > 0) {
      const firstDistrict = newDistricts[0]
      updateReserves(state, firstDistrict)
    } else {
      const coord = getCoords(state, '', '')
      setFormData((prev) => ({
        ...prev,
        state,
        district: '',
        reserve_name: '',
        latitude: coord[0],
        longitude: coord[1],
      }))
    }
  }

  // ✅ On mount
  useEffect(() => {
    updateDistricts(formData.state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ Handle State change
  const handleStateChange = (newState: string) => {
    setFormData((prev) => ({ ...prev, state: newState }))
    updateDistricts(newState)
  }

  // ✅ Handle District change
  const handleDistrictChange = (newDistrict: string) => {
    updateReserves(formData.state, newDistrict)
  }

  // ✅ Handle Reserve change (MAIN FIX ✅)
  const handleReserveChange = (newReserve: string) => {
    const coord = getCoords(formData.state, formData.district, newReserve)

    setFormData((prev) => ({
      ...prev,
      reserve_name: newReserve,
      latitude: coord[0],
      longitude: coord[1],
    }))
  }

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        state: formData.state,
        district: formData.district,
        reserve_name: formData.reserve_name,
        area_type: formData.area_type,
        species: formData.species,
        season: formData.season,
        patrol_frequency: formData.patrol_frequency,
        past_crimes_1yr_10km: formData.past_crimes_1yr_10km,
        past_crimes_3yr_10km: formData.past_crimes_3yr_10km,
        distance_to_road_km: formData.distance_to_road_km,
        distance_to_water_km: formData.distance_to_water_km,
        forest_cover_pct: formData.forest_cover_pct,
        night_light_index: formData.night_light_index,
        population_density_sqkm: formData.population_density_sqkm,
        latitude: formData.latitude,
        longitude: formData.longitude,
      }

      const response = await fetch('https://unspringing-myah-encomiastically.ngrok-free.dev/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const result = await response.json()

      // ✅ FIX: Meaningful risk score (not only High prob)
      const riskScoreRaw =
        (result.probabilities?.Low || 0) * 20 +
        (result.probabilities?.Medium || 0) * 60 +
        (result.probabilities?.High || 0) * 100

      const transformedPrediction = {
        risk_level: result.risk_level,
        risk_score: Math.round(riskScoreRaw),
        probabilities: {
          Low: Math.round((result.probabilities?.Low || 0) * 100),
          Medium: Math.round((result.probabilities?.Medium || 0) * 100),
          High: Math.round((result.probabilities?.High || 0) * 100),
        },
        factors: generateFactorsFromData(result, formData),
      }

      setPrediction(transformedPrediction)
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to get prediction from backend')
      setLoading(false)
    }
  }

  const generateFactorsFromData = (result: any, data: typeof formData) => {
    const factors: any[] = []

    if (data.past_crimes_3yr_10km >= 12) {
      factors.push({
        text: 'High historical poaching incidents',
        impact: 'High',
        value: Math.min(95, data.past_crimes_3yr_10km * 5),
      })
    }

    if (data.distance_to_road_km <= 5) {
      factors.push({ text: 'Close proximity to road access', impact: 'High', value: 85 })
    }

    if (data.patrol_frequency === 'Low') {
      factors.push({ text: 'Low patrol frequency', impact: 'High', value: 80 })
    }

    if (data.population_density_sqkm > 250) {
      factors.push({ text: 'High population density nearby', impact: 'Medium', value: 65 })
    }

    if (data.forest_cover_pct < 60) {
      factors.push({ text: 'Lower forest cover increases accessibility', impact: 'Medium', value: 60 })
    }

    if (data.distance_to_water_km <= 3) {
      factors.push({
        text: 'Close to water sources (animal gathering points)',
        impact: 'Medium',
        value: 55,
      })
    }

    if (data.night_light_index > 10) {
      factors.push({ text: 'High night light activity', impact: 'Medium', value: 50 })
    }

    return factors
  }

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'from-red-500/20 to-orange-500/20',
          border: 'border-red-500/50',
          text: 'text-red-400',
          glow: 'shadow-red-500/20',
        }
      case 'MEDIUM':
        return {
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/20',
        }
      case 'LOW':
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400',
          glow: 'shadow-green-500/20',
        }
      default:
        return {
          bg: 'from-slate-500/20 to-slate-500/20',
          border: 'border-slate-500/50',
          text: 'text-slate-400',
          glow: 'shadow-slate-500/20',
        }
    }
  }

  const tabs = [
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'environment', label: 'Environment', icon: Sparkles },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'demographics', label: 'Demographics', icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-semibold">AI-Powered Risk Assessment</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Predict Poaching Risk
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Enter location and environmental data for comprehensive machine learning analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-6">
            {/* Location & Map Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">Location Details</h3>
                  <p className="text-slate-400 text-sm">Select state, district, and reserve</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      {Object.keys(stateDistricts).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">District</label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Reserve</label>
                    <select
                      value={formData.reserve_name}
                      onChange={(e) => handleReserveChange(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      {reserves.map((reserve) => (
                        <option key={reserve} value={reserve}>
                          {reserve}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Map */}
                <div className="relative h-96 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
                  <LocationMap latitude={formData.latitude} longitude={formData.longitude} />
                </div>

                {/* Coordinates Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Latitude</div>
                    <div className="text-lg font-bold text-purple-400">{formData.latitude.toFixed(6)}°</div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Longitude</div>
                    <div className="text-lg font-bold text-pink-400">{formData.longitude.toFixed(6)}°</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Features Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">Environmental & Risk Factors</h3>
                  <p className="text-slate-400 text-sm">Configure all input parameters</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Tabs */}
                <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 text-sm font-semibold mb-2">Area Type</label>
                          <select
                            value={formData.area_type}
                            onChange={(e) => setFormData({ ...formData, area_type: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option>Core</option>
                            <option>Buffer</option>
                            <option>Eco-sensitive</option>
                            <option>Reserve</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-sm font-semibold mb-2">Target Species</label>
                          <select
                            value={formData.species}
                            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option>Tiger</option>
                            <option>Elephant</option>
                            <option>Leopard</option>
                            <option>Rhino</option>
                            <option>Pangolin</option>
                            <option>Sloth Bear</option>
                            <option>Spotted Deer</option>
                            <option>Wild Dog</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/30"
                      >
                        <Volume2 className="w-5 h-5" />
                        {soundEnabled ? '🔊 Animal Sounds Enabled' : '🔊 Enable Animal Sounds'}
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'environment' && (
                    <motion.div
                      key="environment"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Season</label>
                        <select
                          value={formData.season}
                          onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Summer</option>
                          <option>Winter</option>
                          <option>Dry</option>
                          <option>Wet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Forest Cover (%)</label>
                        <input
                          type="number"
                          value={formData.forest_cover_pct}
                          onChange={(e) => setFormData({ ...formData, forest_cover_pct: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          min={0}
                          max={100}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Distance to Road (km)</label>
                        <input
                          type="number"
                          value={formData.distance_to_road_km}
                          onChange={(e) => setFormData({ ...formData, distance_to_road_km: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Distance to Water (km)</label>
                        <input
                          type="number"
                          value={formData.distance_to_water_km}
                          onChange={(e) => setFormData({ ...formData, distance_to_water_km: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Patrol Frequency</label>
                        <select
                          value={formData.patrol_frequency}
                          onChange={(e) => setFormData({ ...formData, patrol_frequency: e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Past Crimes (1yr / 10km)</label>
                        <input
                          type="number"
                          value={formData.past_crimes_1yr_10km}
                          onChange={(e) => setFormData({ ...formData, past_crimes_1yr_10km: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Past Crimes (3yr / 10km)</label>
                        <input
                          type="number"
                          value={formData.past_crimes_3yr_10km}
                          onChange={(e) => setFormData({ ...formData, past_crimes_3yr_10km: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Night Light Index</label>
                        <input
                          type="number"
                          value={formData.night_light_index}
                          onChange={(e) => setFormData({ ...formData, night_light_index: +e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'demographics' && (
                    <motion.div
                      key="demographics"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">
                          Population Density (per sq km)
                        </label>
                        <input
                          type="number"
                          value={formData.population_density_sqkm}
                          onChange={(e) =>
                            setFormData({ ...formData, population_density_sqkm: +e.target.value })
                          }
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                        <p className="text-slate-400 text-sm">
                          💡 <strong>Tip:</strong> Higher population density near wildlife areas typically correlates
                          with increased poaching risk.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-red-400 font-semibold mb-1">Prediction Error</div>
                      <div className="text-red-300 text-sm">{error}</div>
                    </div>
                  </motion.div>
                )}

                {/* Predict Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-black py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl shadow-purple-500/50 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6" />
                      Predict Poaching Risk
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl">Risk Assessment</h3>
                  <p className="text-slate-400 text-sm">AI-powered prediction results</p>
                </div>
              </div>

              {!prediction ? (
                <div className="text-center py-16">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <AlertTriangle className="w-24 h-24 text-slate-600 mx-auto mb-6" />
                  </motion.div>
                  <h4 className="text-slate-400 font-semibold text-lg mb-2">Awaiting Prediction</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Configure the input parameters and click{' '}
                    <span className="text-purple-400 font-semibold">"Predict"</span> to generate risk assessment
                  </p>
                </div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                  {/* Risk Level */}
                  <div
                    className={`relative bg-gradient-to-br ${
                      getRiskColor(prediction.risk_level).bg
                    } border-2 ${getRiskColor(prediction.risk_level).border} rounded-2xl p-8 text-center overflow-hidden shadow-2xl ${
                      getRiskColor(prediction.risk_level).glow
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                        Threat Level
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className={`text-6xl font-black ${getRiskColor(prediction.risk_level).text} mb-3 uppercase`}
                      >
                        {prediction.risk_level}
                      </motion.div>
                      <div className="text-4xl font-black text-white mb-2">
                        {prediction.risk_score}
                        <span className="text-2xl text-slate-400">/100</span>
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Risk Score</div>
                    </div>
                  </div>

                  {/* Probabilities */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h4 className="text-white font-bold mb-5 flex items-center gap-2">
                      <Info className="w-5 h-5 text-purple-400" />
                      Probability Distribution
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(prediction.probabilities).map(([level, prob]: [string, any]) => (
                        <div key={level}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-300">{level} Risk</span>
                            <span className="text-lg font-black text-white">{prob}%</span>
                          </div>
                          <div className="bg-slate-700/50 h-3 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prob}%` }}
                              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                level === 'High'
                                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                  : level === 'Medium'
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Factors */}
                  {prediction.factors.length > 0 && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                      <h4 className="text-white font-bold mb-5 flex items-center gap-2">
                        <Target className="w-5 h-5 text-pink-400" />
                        Key Risk Factors
                      </h4>
                      <div className="space-y-4">
                        {prediction.factors.map((factor: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`mt-1 w-2 h-2 rounded-full ${
                                factor.impact === 'High' ? 'bg-red-400' : 'bg-yellow-400'
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-slate-300 leading-tight">{factor.text}</span>
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    factor.impact === 'High'
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  {factor.impact}
                                </span>
                              </div>
                              <div className="bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${factor.value}%` }}
                                  transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Increase patrol frequency by 40%',
                        'Deploy motion-sensor cameras at entry points',
                        'Strengthen community engagement programs',
                        'Monitor high-risk zones 24/7',
                      ].map((action, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.1 }}
                          className="flex items-start gap-3 text-sm text-emerald-100"
                        >
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{action}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
