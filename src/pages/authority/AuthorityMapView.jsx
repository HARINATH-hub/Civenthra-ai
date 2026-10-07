import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import { DEPARTMENTS } from '../../data/mockData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Filter,
  Layers,
  Wrench,
  Eye,
  Compass,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AuthorityMapView() {
  const navigate = useNavigate();
  const { complaints } = useComplaints();

  const [selectedPin, setSelectedPin] = useState(() => complaints[0] || null);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const filtered = complaints.filter((c) => {
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || c.assignedDepartment === departmentFilter;
    return matchesPriority && matchesStatus && matchesDept;
  });

  // Extract complaints with valid numeric GPS coordinates
  const geocodedComplaints = filtered.filter(
    c => c.location &&
         typeof c.location.latitude === 'number' &&
         typeof c.location.longitude === 'number' &&
         !isNaN(c.location.latitude) &&
         !isNaN(c.location.longitude)
  );

  useEffect(() => {
    if (geocodedComplaints.length > 0 && (!selectedPin || !geocodedComplaints.some(c => c.id === selectedPin.id))) {
      setSelectedPin(geocodedComplaints[0]);
    }
  }, [geocodedComplaints.length]);

  // Leaflet Map Initialization and Marker Management
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (geocodedComplaints.length === 0) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    let map = mapInstanceRef.current;
    if (!map) {
      map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      geocodedComplaints.forEach((item) => {
        const isSelected = selectedPin?.id === item.id;
        const pinColor = item.status === 'RESOLVED'
          ? '#10b981' // emerald
          : item.priority === 'HIGH'
          ? '#f43f5e' // rose
          : item.priority === 'MEDIUM'
          ? '#f59e0b' // amber
          : '#64748b'; // slate

        const icon = L.divIcon({
          className: 'custom-civic-pin',
          html: `
            <div style="background-color: ${pinColor}; border: 3px solid ${isSelected ? '#38bdf8' : 'white'}; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};"
                 class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const marker = L.marker([item.location.latitude, item.location.longitude], { icon });
        marker.on('click', () => {
          setSelectedPin(item);
        });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 140px;">
            <strong style="color: #4f46e5; font-family: monospace;">${item.ticketId}</strong><br/>
            <b>${item.issueType}</b><br/>
            <span style="font-size: 11px; color: #64748b;">${item.location.address || 'Reported Location'}</span>
          </div>
        `);

        markersLayerRef.current.addLayer(marker);
      });
    }

    // Auto-focus and viewport centering
    if (selectedPin && selectedPin.location?.latitude && selectedPin.location?.longitude) {
      map.setView([selectedPin.location.latitude, selectedPin.location.longitude], 15);
    } else if (geocodedComplaints.length === 1) {
      map.setView([geocodedComplaints[0].location.latitude, geocodedComplaints[0].location.longitude], 15);
    } else if (geocodedComplaints.length > 1) {
      const bounds = L.latLngBounds(
        geocodedComplaints.map(c => [c.location.latitude, c.location.longitude])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [geocodedComplaints, selectedPin]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Metropolitan Spatial Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial clustering of civic grievances with priority color telemetry
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="AWAITING_VERIFICATION">AWAITING VERIFICATION</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden border relative h-[560px] bg-slate-950 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="relative z-10 p-3.5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 truncate max-w-[65%]">
                <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold truncate">
                  {selectedPin?.location?.address || 'Municipal Command Center — Geocoded Incidents'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800 shrink-0">
                {selectedPin?.location?.latitude && selectedPin?.location?.longitude
                  ? `${selectedPin.location.latitude.toFixed(4)}° N, ${selectedPin.location.longitude.toFixed(4)}° E`
                  : 'GPS TELEMETRY'}
              </span>
            </div>

            {/* Map Canvas or Location Unavailable */}
            <div className="relative z-0 flex-1 w-full h-full">
              {geocodedComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Location unavailable</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    No complaints with valid captured GPS coordinates are currently recorded in the system.
                  </p>
                </div>
              ) : (
                <div ref={mapContainerRef} className="w-full h-full" />
              )}
            </div>

            {/* Bottom Legend */}
            <div className="relative z-10 p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Priority</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> CV Resolved</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                {geocodedComplaints.length} locations rendered
              </span>
            </div>
          </Card>
        </div>

        {/* Selected Complaint Inspection Drawer */}
        <div className="lg:col-span-4">
          {selectedPin ? (
            <Card className="p-5 border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {selectedPin.ticketId}
                </span>
                <StatusBadge status={selectedPin.status} size="xs" />
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950">
                <img src={selectedPin.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <PriorityBadge priority={selectedPin.priority} size="xs" />
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {selectedPin.aiConfidence}% AI Match
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                  {selectedPin.assignedDepartment}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedPin.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                  {selectedPin.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{selectedPin.location?.address}</span>
                </div>
                {selectedPin.location?.latitude && selectedPin.location?.longitude ? (
                  <div className="text-[11px] font-mono text-slate-400">
                    Lat: {selectedPin.location.latitude}° N | Lon: {selectedPin.location.longitude}° E
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-500 font-medium">
                    Location unavailable
                  </div>
                )}
                <div className="text-[11px] font-mono text-slate-400">
                  Impact Score: <strong className="text-indigo-600">{selectedPin.impactScore}/100</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => navigate(`/authority/complaints/${selectedPin.id}`)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => navigate(`/authority/resolution/${selectedPin.id}`)}
                  size="sm"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white border-none"
                >
                  Resolution
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400 border">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Click a map pin to inspect grievance telemetry</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
